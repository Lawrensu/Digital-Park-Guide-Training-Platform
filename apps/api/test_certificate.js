import { generateCertificatePdf } from './src/lib/certificatePdf.js';
import fs from 'fs/promises';

async function testCertificatePdf() {
    const pdfBuffer = await generateCertificatePdf({
        certificationId: 'CERT-12345',
        guideName: 'John Doe',
        moduleTitle: 'Digital Park Guide Training',
        companyName: 'Singapore Food Corporation',
        issuerName: 'Jane Smith',
        issuerTitle: 'Training Director',
        issueDate: '2026-05-06',
        expiryDate: '2027-05-06',
        verifyUrl: 'https://example.com/verify/CERT-12345'
    });

    await fs.writeFile('sample_certificate.pdf', pdfBuffer);
    console.log('Sample certificate PDF generated: sample_certificate.pdf');
}

testCertificatePdf().catch(console.error);