import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Twilio client initialized with environment variables
const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

router.post('/call', async (req, res) => {
    const {
        emergencyPhone,
        patientName = 'the patient',
        latencyMs = 'unknown',
    } = req.body;

    if (!emergencyPhone) {
        return res.status(400).json({ error: 'emergencyPhone is required' });
    }

    const twiml = `
    <Response>
      <Say voice="Polly.Joanna" rate="90%">
        This is the GluPulse Sentinel emergency system.
        ${patientName} is unresponsive.
        Their neural latency has exceeded ${latencyMs} milliseconds,
        indicating a critical neuroglycopenic event.
        Please check your email immediately for their GPS location
        and clinical data report.
        This message will repeat.
      </Say>
      <Pause length="1"/>
      <Say voice="Polly.Joanna" rate="90%">
        This is the GluPulse Sentinel emergency system.
        ${patientName} is unresponsive. Check your email now.
      </Say>
    </Response>
  `.trim();

    try {
        const call = await client.calls.create({
            twiml: twiml,
            to: emergencyPhone,
            from: process.env.TWILIO_FROM,
        });

        console.log('[SOS CALL] Initiated ✅', call.sid);
        res.json({ success: true, callSid: call.sid });
    } catch (err) {
        console.error('[SOS CALL] Failed ❌', err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;