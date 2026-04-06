import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/chat', async (req, res) => {
  const { messages = [], riskScore = 72 } = req.body;
  
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("No OPENROUTER_API_KEY found in environment");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `You are GluPulse Co-Pilot, an AI assistant for diabetics. The patient's current risk score is ${riskScore}/100. Ask about recent meals, activity, and how they feel. If user says they feel shaky, dizzy, or weak — respond with immediate action steps and flag it as CRITICAL ALERT. Be empathetic and concise. Keep replies under 3 sentences.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(`OpenRouter Error: ${data.error?.message || response.statusText}`);
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('[CHAT_ERROR]', err.message);
    
    // Provide the clean graceful fallback requested by the upstream stash without crashing the UI
    const lastUserMsg = messages.length > 0 ? messages[messages.length - 1].content : "your health status";
    res.json({ 
      reply: `I received your message about: "${lastUserMsg}". While I'm connecting to my medical database, please remember to monitor your glucose levels closely and have a fast-acting carb source nearby if you feel shaky.`,
      error: err.message,
      isMock: true
    });
  }
});

export default router;
