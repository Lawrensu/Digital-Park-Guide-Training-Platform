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
		const callbackUrl = `${process.env.WEB_URL}/api/payments/callback`;
		const redirectUrl = `${process.env.WEB_URL}/quiz/${quizId}/retake`;

		// TODO: replace placeholder with real BillPlz API call once BILLPLZ_API_KEY is set
		// const response = await fetch(`${BILLPLZ_BASE}/bills`, {
		//   method: 'POST',
		//   headers: { Authorization: 'Basic ' + Buffer.from(process.env.BILLPLZ_API_KEY + ':').toString('base64') },
		//   body: new URLSearchParams({
		//     collection_id: process.env.BILLPLZ_COLLECTION_ID,
		//     email: req.user.email,
		//     name: req.user.username,
		//     amount: amountCents,
		//     description: `Retake: ${quiz.title}`,
		//     callback_url: callbackUrl,
		//     redirect_url: redirectUrl,
		//   })
		// });
		// const bill = await response.json();

		const placeholderBillId = 'placeholder-' + crypto.randomUUID();
		const billUrl = '#billplz-pending';

		await prisma.payment.create({
			data: {
				quizId,
				userId,
				amount: quiz.retakePriceMyr,
				billplzBillId: placeholderBillId,
				status: 'PENDING'
			}
		});

		return res.status(200).json({ success: true, data: { url: billUrl } });
	} catch (err) {
		return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
	}
};


export const callback = async (req, res) => {
	try {
		const { 'billplz[id]': billId, 'billplz[paid]': paidRaw } = req.body;
		const paid = paidRaw === 'true' || paidRaw === true;

		// TODO: verify X-Signature once BILLPLZ_X_SIGNATURE is set
		// const xSig = req.headers['x-signature'];
		// const expected = crypto.createHmac('sha256', process.env.BILLPLZ_X_SIGNATURE)
		//   .update(`${billId}|${paid}`)
		//   .digest('hex');
		// if (xSig !== expected) {
		//   return res.status(400).send();
		// }

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
