import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.js';
import registrationsRouter from './routes/registrations.js';
import usersRouter from './routes/users.js';
import stationsRouter from './routes/stations.js';
import modulesRouter from './routes/modules.js';
import contentItemsRouter from './routes/contentItems.js';
import enrolmentsRouter from './routes/enrolments.js';
import quizzesRouter from './routes/quizzes.js';
import quizAttemptsRouter from './routes/quizAttempts.js';
import paymentsRouter from './routes/payments.js';
import certificationsRouter from './routes/certifications.js';
import badgesRouter from './routes/badges.js';
import notificationsRouter from './routes/notifications.js';
import iotAlertsRouter from './routes/iotAlerts.js';
import iotAlertsInternalRouter from './routes/iotAlertsInternal.js';
import uploadsRouter from './routes/uploads.js';
import syncRouter from './routes/sync.js';
import analyticsRouter from './routes/analytics.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEB_URL, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.status(200).json({ success: true, data: { status: 'ok' } }));

// mounted outside /api, protected by the internal secret header
app.use('/internal', iotAlertsInternalRouter);

app.use('/api/auth', authRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/users', usersRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/modules', modulesRouter);
// content items nested under a module; moduleId is available via mergeParams
app.use('/api/modules/:moduleId/content-items', contentItemsRouter);
app.use('/api/enrolments', enrolmentsRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/quiz-attempts', quizAttemptsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/certifications', certificationsRouter);
app.use('/api/badges', badgesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/iot-alerts', iotAlertsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/sync', syncRouter);
app.use('/api/analytics', analyticsRouter);

// 404 fallback for /api
app.use('/api', (_req, res) => res.status(404).json({
	success: false,
	error: { code: 'NOT_FOUND', message: 'Route not found' },
}));

export default app;