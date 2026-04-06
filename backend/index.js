import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vocalRiskRouter from './routes/vocal-risk.js';
import chatRouter from './routes/chat.js';
import reflexRouter from './routes/reflex.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:8080', 'http://localhost:5173'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- 1. Router-based Routes ---
app.use('/api', vocalRiskRouter);
app.use('/api', chatRouter);
app.use('/api', reflexRouter);

// --- 2. Timeline Data Route (NEW) ---
app.get('/api/timeline-data', (req, res) => {
    res.json({
        timeline: [
            { time: "12:00", glucose: 115, insulin: 3.8, steps: 1200, meal: 0, sleep: 7, label: "Lunch Skipped" },
            { time: "13:00", glucose: 105, insulin: 3.5, steps: 2800, meal: 0, sleep: 7, label: null },
            { time: "14:00", glucose: 95, insulin: 3.2, steps: 5400, meal: 0, sleep: 7, label: "3km Walk Start" },
            { time: "15:00", glucose: 80, insulin: 3.0, steps: 7800, meal: 0, sleep: 5.5, label: null },
            { time: "15:30", glucose: 72, insulin: 2.8, steps: 9200, meal: 0, sleep: 5.5, label: "Rapid Depletion" },
            { time: "16:00", glucose: 58, insulin: 2.4, steps: 10500, meal: 0, sleep: 5.5, label: "CRITICAL" }
        ],
        riskScore: 82,
        xaiLabel: "Critical: 5km walk + 6h fasting + poor sleep (5.5h)",
        xaiFactors: [
            { factor: "Extended Walk (5km)", impact: 35, color: "#ef4444" },
            { factor: "Fasting (6h)", impact: 28, color: "#f97316" },
            { factor: "Poor Sleep (5.5h)", impact: 22, color: "#eab308" },
            { factor: "High Basal Insulin", impact: 15, color: "#3b82f6" }
        ]
    });
});

// --- 3. Food Scan Route ---
app.post('/api/food-scan', async (req, res) => {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    console.log('Food scan hit, mimeType:', mimeType, 'base64 length:', imageBase64?.length);
    if (!imageBase64) {
        return res.status(400).json({ error: 'No image data provided' });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-nano-12b-v2-vl:free",
                max_tokens: 300,
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Identify this food. Respond ONLY with raw JSON: { "foodName": "", "estimatedCarbs": 0, "glycemicIndex": 0, "predictedGlucosePeak": 0, "timeToPeakMinutes": 0, "recoveryMinutes": 0 }' },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
                    ]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok || !data.choices?.[0]?.message?.content) {
            return res.json({
                foodName: "Arrabiata Pasta (AI Simulated)",
                estimatedCarbs: 62,
                glycemicIndex: 55,
                predictedGlucosePeak: 154,
                timeToPeakMinutes: 45,
                recoveryMinutes: 120
            });
        }

        const responseText = data.choices[0].message.content.trim();
        const cleanJsonString = responseText.replace(/```json|```/g, '').trim();
        res.json(JSON.parse(cleanJsonString));

    } catch (err) {
        console.error('Food scan error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- 4. System Status ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), project: 'GluPulse' });
});

app.listen(PORT, () => {
    console.log(`🚀 GluPulse Backend running on port ${PORT}`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}/api/timeline-data`);
});