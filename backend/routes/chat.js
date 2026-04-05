import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/chat', async (req, res) => {
  const { messages, riskScore = 72 } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5', // Kept original model from server.js
      max_tokens: 500,
      system: `You are GluPulse Co-Pilot, an AI assistant for diabetics. The patient's current risk score is ${riskScore}/100. Ask about recent meals, activity, and how they feel. If user says they feel shaky, dizzy, or weak — respond with immediate action steps and flag it as CRITICAL ALERT. Be empathetic and concise. Keep replies under 3 sentences.`,
      messages,
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/food-scan', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg' } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: imageBase64 } },
          { type: 'text', text: 'Identify this food. Respond ONLY with JSON: { "foodName": "", "estimatedCarbs": 0, "glycemicIndex": 0, "predictedGlucosePeak": 0, "timeToPeakMinutes": 0, "recoveryMinutes": 0 }' }
        ]
      }]
    });
    const json = JSON.parse(response.content[0].text.replace(/```json|```/g, '').trim());
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
