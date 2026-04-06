import { dispatchSOSEmail } from './sosEmail';

export interface FullSOSPayload {
    patientName: string;
    emergencyPhone?: string; // Opted to keep it optional since we skip calls
    latencyMs: number;
    status?: string;
}

export const triggerFullSOS = async (payload: FullSOSPayload): Promise<void> => {
    console.log('[SOS DISPATCHER] 🚨 Full SOS sequence initiated');

    // Fire only email — keep Promise.allSettled for future extensibility as requested
    const results = await Promise.allSettled([
        dispatchSOSEmail({
            patientName: payload.patientName,
            latencyMs: payload.latencyMs,
            status: payload.status,
        })
    ]);

    results.forEach((result, index) => {
        const type = index === 0 ? 'Email' : 'Unknown';
        console.log(`[SOS] ${type}:`, result.status);
    });
};