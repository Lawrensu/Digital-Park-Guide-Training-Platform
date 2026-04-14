import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import stationsRouter from './routes/stations.js';
import paymentsRouter from './routes/payments.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEB_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/stations', stationsRouter);
app.use('/api/payments', paymentsRouter);

export default app;
