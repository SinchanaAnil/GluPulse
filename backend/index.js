import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vocalRiskRouter from './routes/vocal-risk.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', vocalRiskRouter);
app.use('/api', chatRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), project: 'GluPulse' });
});

app.listen(PORT, () => {
    console.log(`🚀 GluPulse Backend running on port ${PORT}`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}/api/vocal-risk`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}/api/chat`);
});