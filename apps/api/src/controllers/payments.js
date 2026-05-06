import crypto from 'crypto';
import prisma from '../lib/prisma.js';

const SANDBOX = process.env.BILLPLZ_SANDBOX === 'true';
const BILLPLZ_BASE = SANDBOX
	? 'https://www.billplz-sandbox.com/api/v3'
	: 'https://www.billplz.com/api/v3';


export const initiate = async (req, res) => {
	try {
		const { quizId } = req.body;
		const userId = req.user.id;

		const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
		if (!quiz) {
			return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
		}
		if (!quiz.retakePriceMyr) {
			return res.status(400).json({ success: false, error: { code: 'PAYMENT_NOT_CONFIGURED', message: 'This quiz does not have a retake price set' } });
		}

		const priorAttempt = await prisma.quizAttempt.findFirst({ where: { quizId, guideId: userId } });
		if (!priorAttempt) {
			return res.status(400).json({ success: false, error: { code: 'NO_PRIOR_ATTEMPT', message: 'First attempt is free — payment is only required for retakes' } });
		}

		const existingPending = await prisma.payment.findFirst({
			where: { quizId, userId, status: 'PENDING' }
		});
		if (existingPending) {
			return res.status(409).json({ success: false, error: { code: 'PAYMENT_PENDING', message: 'A pending payment already exists for this quiz' } });
		}

		const amountCents = Math.round(Number(quiz.retakePriceMyr) * 100);

		// BillPlz callback is server-to-server; redirect is where the user lands after payment
		const callbackUrl = `${process.env.WEB_URL}/api/payments/callback`;
		const redirectUrl = `${process.env.WEB_URL}/guide/quiz/${quizId}`;

		const response = await fetch(`${BILLPLZ_BASE}/bills`, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + Buffer.from(process.env.BILLPLZ_API_KEY + ':').toString('base64'),
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				collection_id: process.env.BILLPLZ_COLLECTION_ID,
				email: req.user.email,
				name: req.user.email.split('@')[0],
				amount: String(amountCents),
				description: `Retake: ${quiz.title}`,
				callback_url: callbackUrl,
				redirect_url: redirectUrl,
			}),
		});

		if (!response.ok) {
			const errBody = await response.text();
			console.error('BillPlz create bill error:', errBody);
			return res.status(502).json({ success: false, error: { code: 'BILLPLZ_ERROR', message: 'Failed to create payment bill' } });
		}

		const bill = await response.json();

		await prisma.payment.create({
			data: {
				quizId,
				userId,
				amount: quiz.retakePriceMyr,
				billplzBillId: bill.id,
				status: 'PENDING'
			}
		});

		return res.status(200).json({ success: true, data: { url: bill.url } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const callback = async (req, res) => {
	try {
		const { 'billplz[id]': billId, 'billplz[paid]': paidRaw } = req.body;
		const paid = paidRaw === 'true' || paidRaw === true;

		// Verify the request genuinely came from BillPlz, not a spoofed POST
		const xSig = req.headers['x-signature'];
		const expected = crypto.createHmac('sha256', process.env.BILLPLZ_X_SIGNATURE)
			.update(`${billId}|${paid}`)
			.digest('hex');
		if (xSig !== expected) {
			return res.status(400).send();
		}

		const payment = await prisma.payment.findUnique({ where: { billplzBillId: billId } });
		if (!payment) {
			return res.status(200).send(); // always 200 so BillPlz stops retrying
		}

		await prisma.payment.update({
			where: { id: payment.id },
			data: { status: paid ? 'PAID' : 'FAILED' }
		});

		return res.status(200).send();
	} catch (err) {
		console.error('BillPlz callback error:', err.message);
		return res.status(200).send(); // always 200 so BillPlz stops retrying
	}
};
