import express from 'express';

const router = express.Router();

// In-memory store for the prototype demo
let reflexHistory = [
    { id: 1, meanLatency: 285, neuroScore: 92, stabilityIndex: 0.94, timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'STABLE' },
    { id: 2, meanLatency: 412, neuroScore: 68, stabilityIndex: 0.82, timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'CAUTION' },
    { id: 3, meanLatency: 310, neuroScore: 88, stabilityIndex: 0.91, timestamp: new Date(Date.now() - 259200000).toISOString(), status: 'STABLE' }
];

// --- 1. GET /api/reflex/history ---
router.get('/reflex/history', (req, res) => {
    res.json(reflexHistory.slice(0, 5));
});

// --- 2. POST /api/reflex-sync (Multimodal Diagnostic) ---
router.post('/reflex-sync', (req, res) => {
    const { testType, latencies, meanLatency, accuracy = 100, userName, timestamp } = req.body;

    if (!latencies || !Array.isArray(latencies)) {
        return res.status(400).json({ error: 'Latencies array required' });
    }

    const mean = meanLatency || (latencies.reduce((a, b) => a + b, 0) / latencies.length);
    
    // Calibrated thresholds for Multi-Modal Diagnostic Battery
    let isCritical = false;
    let isCaution = false;

    if (testType === 'spatial') {
        isCritical = mean > 1200 || accuracy < 80;
        isCaution = mean > 800 && mean <= 1200;
    } else {
        isCritical = mean > 1800 || accuracy < 70;
        isCaution = mean > 1300 && mean <= 1800;
    }

    const status = isCritical ? 'CRITICAL' : (isCaution ? 'CAUTION' : 'STABLE');

    // Scientific Scoring
    let neuroBase = testType === 'spatial' 
        ? Math.max(0, Math.min(100, Math.round(130 - (mean / 8))))
        : Math.max(0, Math.min(100, Math.round(160 - (mean / 12))));
    
    let neuroScore = Math.round(neuroBase * (accuracy / 100));

    const newRecord = {
        id: Date.now(),
        userName: userName || 'Anonymous Patient',
        testType: testType || 'spatial',
        latencies,
        meanLatency: Math.round(mean),
        accuracy,
        neuroScore,
        timestamp: timestamp || new Date().toISOString(),
        status
    };

    reflexHistory.unshift(newRecord);
    if (reflexHistory.length > 20) reflexHistory = reflexHistory.slice(0, 20);

    // [REFLEX_LOG] User: [Name] | Score: [Avg] | Status: [Label]
    console.log(`[REFLEX_LOG] User: ${newRecord.userName} | Score: ${newRecord.meanLatency}ms | Status: ${newRecord.status}`);
    
    res.json(newRecord);
});

export default router;
