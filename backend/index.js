import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vocalRiskRouter from './routes/vocal-risk.js'; // Note the .js extension!

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', vocalRiskRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), project: 'GluPulse' });
});

app.listen(PORT, () => {
    console.log(`🚀 GluPulse Backend running on port ${PORT}`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}/api/vocal-risk`);
});