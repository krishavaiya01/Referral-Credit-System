import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import purchaseRoutes from './routes/purchase.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*', credentials: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', authRoutes);
app.use('/api', purchaseRoutes);
app.use('/api', dashboardRoutes);

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Please set it in backend/.env');
  process.exit(1);
}

connectDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });
