const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const vocalRiskRouter = require('./routes/vocal-risk');

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
