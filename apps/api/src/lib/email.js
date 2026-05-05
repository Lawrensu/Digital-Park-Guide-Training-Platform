import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';


const ses = new SESClient({ region: process.env.SES_REGION });

const FROM = process.env.SES_FROM_EMAIL;


async function sendEmail(to, subject, html, text) {
	const command = new SendEmailCommand({
		Source: FROM,
		Destination: { ToAddresses: [to] },
		Message: {
			Subject: { Data: subject },
			Body: {
				Html: { Data: html },
				Text: { Data: text },
			},
		},
	});

	try {
		await ses.send(command);
	} catch (err) {
		// don't let email failure break the HTTP response
		console.error('SES send failed:', err.message);
	}
}


async function sendActivationEmail(to, name, activationUrl) {
	const subject = 'Activate your SFC Park Guide account';
	const text = `Hi ${name},\n\nYour registration has been approved. Set your password here:\n${activationUrl}\n\nThis link expires in 24 hours.`;
	const html = `<p>Hi ${name},</p><p>Your registration has been approved. Set your password here:</p><p><a href="${activationUrl}">${activationUrl}</a></p><p>This link expires in 24 hours.</p>`;

	await sendEmail(to, subject, html, text);
}


async function sendRegistrationRejectedEmail(to, name, reason) {
	const subject = 'SFC Park Guide registration update';
	const reasonText = reason ? `\n\nReason: ${reason}` : '';
	const reasonHtml = reason ? `<p>Reason: ${reason}</p>` : '';
	const text = `Hi ${name},\n\nYour registration could not be approved at this time.${reasonText}`;
	const html = `<p>Hi ${name},</p><p>Your registration could not be approved at this time.</p>${reasonHtml}`;

	await sendEmail(to, subject, html, text);
}


async function sendPasswordResetEmail(to, resetUrl) {
	const subject = 'Reset your SFC Park Guide password';
	const text = `Reset your password here:\n${resetUrl}\n\nThis link expires in 24 hours. If you did not request this, ignore this email.`;
	const html = `<p>Reset your password here:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 24 hours. If you did not request this, ignore this email.</p>`;

	await sendEmail(to, subject, html, text);
}


export { sendActivationEmail, sendRegistrationRejectedEmail, sendPasswordResetEmail };
