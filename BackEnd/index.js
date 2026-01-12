import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './database.js';
import jobRoutes from './routes/jobs.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 8000;

console.log('🚀 Starting Job Tracker API...');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 API available at http://localhost:${PORT}/api/jobs`);
});

export default app;