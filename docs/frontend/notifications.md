# Frontend : Notification System Design

## Brainstorming
**Notification System Design**
- Admin/Trainer
	- Park Guide's registration
		- Admin/Trainer receives Park Guide's registration and option to review/mark as read.
	- Live Alert
		- Send notification regarding "Abnormal Activity/Violation Detected".
		- Can review the evidence snippets/frames.
		- Admin/Trainer will be notified through mobile app push notification and an email.
		- Admin/Trainer will confirm and flag it as either "Abnormal Activity/Violation Detected" or "False detection".
- Park Guide
	- Training Module
		- When admin/trainer releases a new training module, will be notified through the mobile app push notification.
			- Title of the training module
			- Description of the training module
		- Deadline reminder for training module(s).
			- In mobile app and push notification.
			- 24 hours prior to the submission date/time.
		- Result/Score
			- Will be notified through in-app.
			- If pass,
				- "Congratulations, you scored (insert score) and passed (insert training module name)" something.
			- If fail,
				- "Unfortunately, you failed (insert training module name) with scoring of (insert score). Would you like to retake?". 
	- Certificate
		- Upon admin/trainer('s) approval regarding certificate, notification is sent to Park Guide ("Congratulation! Here is your certificate/qualification from (insert training module name) something something").
- Customisable Notification **by Admin/Trainer** (e.g., When admin/trainer wants to notify a specific park guide only or not a structured/rigid notification)
	- Title
	- Description