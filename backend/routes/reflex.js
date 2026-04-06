import express from 'express';

const router = express.Router();

// In-memory store for the prototype demo
let reflexHistory = [
    { id: 1, meanLatency: 285, neuroScore: 92, stabilityIndex: 0.94, timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'STABLE' },
    { id: 2, meanLatency: 412, neuroScore: 68, stabilityIndex: 0.82, timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'CAUTION' },
    { id: 3, meanLatency: 310, neuroScore: 88, stabilityIndex: 0.91, timestamp: new Date(Date.now() - 259200000).toISOString(), status: 'STABLE' }
];

// --- 1. POST /api/reflex/record ---
router.post('/reflex/record', (req, res) => {
    const { meanLatency, stabilityIndex, timestamp } = req.body;

    if (meanLatency === undefined) {
        return res.status(400).json({ error: 'Missing meanLatency data' });
    }

    // Calibrated scaling for Neuro-Score (0-100)
    // < 250ms -> 95+ 
    // > 500ms -> < 40
    let neuroScore = Math.max(0, Math.min(100, Math.round(150 - (meanLatency * 0.22))));
    
    const status = meanLatency < 300 ? 'STABLE' : (meanLatency < 500 ? 'CAUTION' : 'CRITICAL');

    const newRecord = {
        id: Date.now(),
        meanLatency,
        neuroScore,
        stabilityIndex: stabilityIndex || 0.9,
        timestamp: timestamp || new Date().toISOString(),
        status
    };

    reflexHistory.unshift(newRecord);
    
    // Keep only last 10 records
    if (reflexHistory.length > 10) {
        reflexHistory = reflexHistory.slice(0, 10);
    }

    console.log('[REFLEX_ENGINE] New record saved:', newRecord);
    res.json(newRecord);
});

// --- 2. GET /api/reflex/history ---
router.get('/reflex/history', (req, res) => {
    // Return last 5 for the UI
    res.json(reflexHistory.slice(0, 5));
});

export default router;
