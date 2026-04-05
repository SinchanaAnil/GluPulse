import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/chat', async (req, res) => {
  console.log('Chat Route Hit (OpenRouter Free Router)');
  const { messages = [] } = req.body;
  
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("No ANTHROPIC_API_KEY found in environment");

    const systemPrompt = "You are the GluPulse Co-Pilot, a medical AI assistant for hypoglycemia. Answer any question, but always prioritize user safety and relate answers to metabolic health.";
    const conversationHistory = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:8080",
        "X-Title": "GluPulse AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        model: "openrouter/free", 
        messages: conversationHistory 
      })
    });

    const data = await response.json();
    if (data.error) {
      console.error('[OPENROUTER_ERROR]', JSON.stringify(data.error, null, 2));
      throw new Error(data.error.message || "OpenRouter Error");
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('[CHAT_ERROR]', err.message);
    const lastUserMsg = messages.length > 0 ? messages[messages.length - 1].content : "your health status";
    res.json({ 
      reply: `I received your message about: "${lastUserMsg}". While I'm connecting to my medical database, please remember to monitor your glucose levels closely and have a fast-acting carb source nearby if you feel shaky.`,
      error: err.message,
      isMock: true
    });
  }
});

router.post('/food-scan', async (req, res) => {
  console.log('Food Scan Route Hit (OpenRouter Free Router)');
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("No API key configured");

    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:8080",
        "X-Title": "GluPulse AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: 'Identify this food. Respond ONLY with JSON format: { "foodName": "", "estimatedCarbs": 0, "glycemicIndex": 0, "predictedGlucosePeak": 0, "timeToPeakMinutes": 0, "recoveryMinutes": 0 }' },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const jsonText = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const json = JSON.parse(jsonText);
    res.json(json);
  } catch (err) {
    console.error('[FOOD_SCAN_ERROR]', err.message);
    res.json({ 
      foodName: "Nutritional Analysis Pending", 
      estimatedCarbs: 45, 
      error: err.message,
      isMock: true
    });
  }
});

export default router;
