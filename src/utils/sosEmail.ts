import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_ihi8gju';   // from your dashboard
const EMAILJS_TEMPLATE_ID = 'template_wyn2cpy';
const EMAILJS_PUBLIC_KEY = 'WXCs5S3haG6HMVeYP';

export interface SOSPayload {
    patientName: string;
    latencyMs: number;
    status?: string;
}

export const dispatchSOSEmail = async (payload: SOSPayload): Promise<void> => {
    const mapsLink = `https://maps.google.com/?q=13.0694,77.5617`;

    try {
        const result = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                patient_name: payload.patientName,
                patient_status: payload.status ?? 'NEUROGLYCOPENIC_SHOCK_DETECTED',
                latency_ms: payload.latencyMs.toString(),
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                maps_link: mapsLink,
            },
            EMAILJS_PUBLIC_KEY
        );
        console.log('[SOS EMAIL] Dispatched ✅', result.status);
    } catch (err) {
        console.error('[SOS EMAIL] Failed ❌', err);
        // Fail silently — don't block the voice call
    }
};