import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, '..', 'assets', 'certificate_template.pdf');


// generates a certificate PDF buffer by overlaying dynamic fields onto the Figma template
export async function generateCertificatePdf({
	certificationId,
	guideName,
	moduleTitle,
	companyName,
	issuerName,
	issuerTitle,
	issueDate,
	expiryDate,
	verifyUrl,
}) {
	let pdfDoc;
	try {
		const templateBytes = await fs.readFile(TEMPLATE_PATH);
		pdfDoc = await PDFDocument.load(templateBytes);
	} catch {
		// fallback: blank A4 landscape so the flow works before the template is dropped in
		pdfDoc = await PDFDocument.create();
		pdfDoc.addPage([842, 595]);
	}

	const page = pdfDoc.getPages()[0];
	const { width, height } = page.getSize();

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	const black = rgb(0.1, 0.1, 0.1);
	const grey = rgb(0.4, 0.4, 0.4);

	const drawCentered = (text, y, size, f = font, color = black) => {
		const tw = f.widthOfTextAtSize(text, size);
		page.drawText(text, { x: (width - tw) / 2, y, size, font: f, color });
	};

	drawCentered(companyName, height - 80, 18, fontBold);
	drawCentered('Certificate of Completion', height - 130, 28, fontBold);
	drawCentered('This certifies that', height - 190, 14, font, grey);
	drawCentered(guideName, height - 230, 26, fontBold);
	drawCentered('has successfully completed', height - 270, 14, font, grey);
	drawCentered(moduleTitle, height - 310, 20, fontBold);

	const issueStr = new Date(issueDate).toISOString().slice(0, 10);
	drawCentered(`Issued: ${issueStr}`, 120, 12, font, grey);
	if (expiryDate) {
		drawCentered(`Expires: ${new Date(expiryDate).toISOString().slice(0, 10)}`, 100, 12, font, grey);
	}

	page.drawText(issuerName, { x: 80, y: 80, size: 12, font: fontBold, color: black });
	page.drawText(issuerTitle, { x: 80, y: 64, size: 10, font, color: grey });

	page.drawText(`ID: ${certificationId}`, { x: 80, y: 40, size: 8, font, color: grey });

	// QR code placed in the bottom right corner
	try {
		const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 120 });
		const qrPng = await pdfDoc.embedPng(qrDataUrl);
		page.drawImage(qrPng, { x: width - 140, y: 40, width: 100, height: 100 });
	} catch (err) {
		console.error('QR embed failed:', err.message);
	}

	return pdfDoc.save();
}
