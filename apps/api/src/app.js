import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Cyndia — import your routers here as you build each domain
import authRouter from './routes/auth.js';
// import authRouter from './routes/auth.js';
// import stationsRouter from './routes/stations.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEB_URL }));
app.use(express.json());
app.use(cookieParser());

// Cyndia — mount your routers here as you build each domain
// app.use('/api/auth', authRouter);
// app.use('/api/stations', stationsRouter);
app.use('/api/auth', authRouter);

export default app;
