import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';


const ses = new SESClient({ region: process.env.SES_REGION });

const FROM = process.env.SES_FROM_EMAIL;


// shared wrapper — never throws; email failure must not break the HTTP response
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
		console.error('SES send failed:', err.message);
	}
}


// shared base layout
function layout(bodyContent) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SFC Park Guide</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1eb;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1eb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- header -->
          <tr>
            <td style="background-color:#1a3a2a;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:11px;font-weight:normal;color:#7fb99a;letter-spacing:2px;text-transform:uppercase;">Sarawak Forestry Corporation</p>
              <h1 style="margin:0;font-family:'Georgia',serif;font-size:22px;font-weight:normal;color:#ffffff;letter-spacing:0.5px;">SFC Park Guide Platform</h1>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;border-left:1px solid #e8e0d0;border-right:1px solid #e8e0d0;">
              ${bodyContent}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="background-color:#f9f6f0;border:1px solid #e8e0d0;border-top:none;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#a8a29e;">This is an automated message from the SFC Park Guide Training Platform.</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#a8a29e;">Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}


function primaryButton(label, url) {
	return `
<table cellpadding="0" cellspacing="0" style="margin:32px auto;">
  <tr>
    <td style="background-color:#1a3a2a;border-radius:8px;">
      <a href="${url}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">${label}</a>
    </td>
  </tr>
</table>`;
}


function divider() {
	return `<hr style="border:none;border-top:1px solid #f0e9db;margin:28px 0;" />`;
}


async function sendActivationEmail(to, name, activationUrl) {
	const subject = 'Your SFC Park Guide account is approved — set your password';

	const html = layout(`
    <h2 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:20px;font-weight:normal;color:#1a3a2a;">Welcome, ${name}!</h2>
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#78716c;line-height:1.6;">
      Your registration as a Sarawak Forestry Corporation Park Guide has been <strong style="color:#2d7d4e;">approved</strong>.
      Click the button below to set your password and activate your account.
    </p>

    ${primaryButton('Activate My Account', activationUrl)}

    ${divider()}

    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;color:#a8a29e;text-align:center;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:12px;color:#78716c;text-align:center;word-break:break-all;">
      ${activationUrl}
    </p>

    ${divider()}

    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#a8a29e;text-align:center;">
      This link expires in <strong>24 hours</strong>. If you did not apply to become a park guide, you can safely ignore this email.
    </p>
  `);

	const text = `Welcome, ${name}!\n\nYour registration has been approved. Set your password here:\n${activationUrl}\n\nThis link expires in 24 hours.`;

	await sendEmail(to, subject, html, text);
}


async function sendRegistrationRejectedEmail(to, name, reason) {
	const subject = 'Update on your SFC Park Guide application';

	const reasonBlock = reason
		? `${divider()}
       <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;color:#44403c;">Reason provided:</p>
       <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#78716c;line-height:1.6;background:#f9f6f0;border-left:3px solid #d4a96a;padding:12px 16px;border-radius:0 6px 6px 0;">${reason}</p>`
		: '';

	const html = layout(`
    <h2 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:20px;font-weight:normal;color:#1a3a2a;">Hi ${name},</h2>
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#78716c;line-height:1.6;">
      Thank you for your interest in becoming a Sarawak Forestry Corporation Park Guide.
      After careful review, we are unable to approve your application at this time.
    </p>

    ${reasonBlock}

    ${divider()}

    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#a8a29e;text-align:center;">
      If you believe this is an error or would like further clarification, please contact us directly.
    </p>
  `);

	const text = `Hi ${name},\n\nThank you for your interest. Unfortunately, your application could not be approved at this time.${reason ? `\n\nReason: ${reason}` : ''}\n\nIf you have questions, please contact us.`;

	await sendEmail(to, subject, html, text);
}


async function sendPasswordResetEmail(to, resetUrl) {
	const subject = 'Reset your SFC Park Guide password';

	const html = layout(`
    <h2 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:20px;font-weight:normal;color:#1a3a2a;">Password Reset Request</h2>
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#78716c;line-height:1.6;">
      We received a request to reset the password for your SFC Park Guide account.
      Click the button below to choose a new password.
    </p>

    ${primaryButton('Reset My Password', resetUrl)}

    ${divider()}

    <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;color:#a8a29e;text-align:center;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:12px;color:#78716c;text-align:center;word-break:break-all;">
      ${resetUrl}
    </p>

    ${divider()}

    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#a8a29e;text-align:center;">
      This link expires in <strong>24 hours</strong>. If you did not request a password reset, you can safely ignore this email — your password will not change.
    </p>
  `);

	const text = `Password Reset Request\n\nReset your password here:\n${resetUrl}\n\nThis link expires in 24 hours. If you did not request this, ignore this email.`;

	await sendEmail(to, subject, html, text);
}


export { sendActivationEmail, sendRegistrationRejectedEmail, sendPasswordResetEmail };
