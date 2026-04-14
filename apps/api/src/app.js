import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Cyndia — import your routers here as you build each domain
// import authRouter from './routes/auth.js';
// import stationsRouter from './routes/stations.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.WEB_URL }));
app.use(express.json());

// Cyndia — mount your routers here as you build each domain
// app.use('/api/auth', authRouter);
// app.use('/api/stations', stationsRouter);

export default app;
