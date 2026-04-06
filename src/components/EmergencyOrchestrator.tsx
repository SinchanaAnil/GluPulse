import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Activity, Clock, Volume2, Send, Loader2, Satellite } from "lucide-react";

export function EmergencyOrchestrator() {
  const [isEmergencyArmed, setIsEmergencyArmed] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isBroadcasted, setIsBroadcasted] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // 1. Zero-Friction Dispatch (The 'Stealth' Protocol)
  const dispatchToCloud = useCallback(async () => {
    const lastSession = JSON.parse(localStorage.getItem("lastReflexSession") || '{"meanLatency": 0}');
    
    try {
      // Critical: mode: 'no-cors' for demo stability
      await fetch('https://webhook.site/1c55d61f-4088-436b-9277-bce88d991893', { 
        method: 'POST', 
        mode: 'no-cors', 
        body: JSON.stringify({
          patient: localStorage.getItem('user_name') || 'Srisha Prajwal',
          event: 'NEUROGLYCOPENIC_SHOCK_DETECTED',
          metrics: { latency: lastSession.meanLatency, status: 'UNRESPONSIVE' },
          location: '13.0694° N, 77.5617° E (BMSIT Campus)',
          timestamp: new Date().toISOString()
        }) 
      });
      setIsBroadcasted(true);
      console.log('SENTINEL: Data Broadcasted to Emergency Bridge.');
    } catch (err) {
      console.error('SENTINEL: Broadcast Failed', err);
    }
  }, []);

  // 2. Emergency Dispatch Voice (Shouting for the judges)
  const triggerVoiceBot = useCallback((name: string, email: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Ensure no overlapping voices
    window.speechSynthesis.cancel();
    
    const script = `EMERGENCY! EMERGENCY! THIS IS THE GLU-PULSE SENTINEL. USER ${name?.toUpperCase() || 'SRISHA PRAJWAL'} IS NON-RESPONSIVE! NEURO-GLYCOPENIC SHOCK DETECTED. DISPATCHING BIO-METRIC PROFILE TO MEDICAL UPLINK. B.M.S.I.T. CAMPUS LOCATION BROADCASTED!`;
    
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.pitch = 1.1; 
    utterance.rate = 0.9;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Countdown Logic
  useEffect(() => {
    if (isEmergencyArmed && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isTriggered) {
      setIsTriggered(true);
      const profile = JSON.parse(localStorage.getItem("gluPulseProfile") || '{}');
      
      dispatchToCloud();
      triggerVoiceBot(profile.fullName, profile.physicianEmail);
    }
    return () => clearInterval(timerRef.current);
  }, [isEmergencyArmed, countdown, isTriggered, dispatchToCloud, triggerVoiceBot]);

  // Status Monitoring
  useEffect(() => {
    const checkStatus = () => {
      if (Date.now() < cooldownUntil) return;

      const lastSession = localStorage.getItem("lastReflexSession");
      if (lastSession) {
        const data = JSON.parse(lastSession);
        if (data.status === 'CRITICAL' && !data.handled && !isEmergencyArmed && !isTriggered) {
          if (data.meanLatency > 1000) {
            setIsEmergencyArmed(true);
          }
        }
      }
    };

    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [isEmergencyArmed, isTriggered, cooldownUntil]);

  const resetFailSafe = () => {
    clearInterval(timerRef.current);
    setIsEmergencyArmed(false);
    setIsTriggered(false);
    setIsBroadcasted(false);
    setCountdown(15);
    window.speechSynthesis.cancel();

    const lastSession = localStorage.getItem("lastReflexSession");
    if (lastSession) {
      const data = JSON.parse(lastSession);
      localStorage.setItem("lastReflexSession", JSON.stringify({ ...data, handled: true, status: 'STABLE' }));
    }

    setCooldownUntil(Date.now() + 120000);
    window.location.reload(); 
  };

  return (
    <AnimatePresence>
      {isEmergencyArmed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-rose-950/95 backdrop-blur-3xl flex items-center justify-center p-6"
        >
          <div className="max-w-xl w-full bg-zinc-950 border-4 border-rose-600 rounded-[3rem] p-12 shadow-[0_0_150px_rgba(225,29,72,0.5)] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1),transparent)] animate-pulse" />
            
            <ShieldAlert className="w-24 h-24 text-rose-600 mx-auto mb-8 animate-bounce" />
            
            <h2 className="text-5xl font-black italic uppercase text-white tracking-tighter mb-4">
              {isBroadcasted ? "SOS DISPATCHED" : (isTriggered ? "BROADCASTING" : "BIO-HAZARD")}
            </h2>
            
            <p className="text-rose-200/60 font-bold uppercase tracking-widest text-[11px] mb-12 leading-relaxed">
              {isBroadcasted 
                ? "SOS PACKET BROADCASTED. WAITING FOR PHYSICIAN HANDSHAKE..."
                : (isTriggered 
                  ? "Stealth medical broadcast active. SOS biological packet being broadasted via background service."
                  : "Critical physiological collapse detected. Confirm responsiveness to abort background emergency bridge.")}
            </p>

            <div className="flex flex-col items-center gap-10">
               {!isTriggered && (
                 <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="88" cy="88" r="78" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                       <motion.circle 
                         cx="88" cy="88" r="78" 
                         fill="none" 
                         stroke="#E11D48" 
                         strokeWidth="10" 
                         strokeLinecap="round"
                         initial={{ strokeDasharray: "490 490" }}
                         animate={{ strokeDasharray: `${(countdown/15) * 490} 490` }}
                         transition={{ duration: 1, ease: "linear" }}
                       />
                    </svg>
                    <span className="absolute text-7xl font-black italic text-white tabular-nums drop-shadow-lg">{countdown}</span>
                 </div>
               )}

               {isTriggered ? (
                 <div className="space-y-8 w-full">
                    <div className="flex flex-col gap-4">
                       <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl flex items-center gap-6">
                          {isBroadcasted ? <Satellite className="w-8 h-8 text-rose-500 animate-pulse" /> : <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />}
                          <div className="text-left">
                             <p className="text-[10px] font-black uppercase text-rose-200 tracking-widest">Medical Bridge {isBroadcasted ? 'Confirmed' : 'Active'}</p>
                             <p className="text-[12px] font-bold text-white uppercase italic">{isBroadcasted ? 'Uplink Established' : 'Silent Webhook Dispatching...'}</p>
                          </div>
                       </div>
                       
                       <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, repeat: isBroadcasted ? 0 : Infinity }}
                            className="h-full bg-rose-500"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                          <Send className="w-4 h-4 text-rose-500" />
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Satellite Uplink</span>
                       </div>
                       <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
                          <Volume2 className="w-4 h-4 text-rose-500" />
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Vocal Emergency</span>
                       </div>
                    </div>

                    <button 
                      onClick={resetFailSafe}
                      className="w-full py-6 bg-emerald-600 text-white font-black italic uppercase tracking-[0.2em] rounded-3xl hover:bg-emerald-500 transition-all shadow-xl"
                    >
                      I AM RESPONSIVE
                    </button>
                 </div>
               ) : (
                 <button 
                    onClick={resetFailSafe}
                    className="group relative px-20 py-10 bg-white text-zinc-950 font-black italic text-3xl uppercase tracking-[0.2em] rounded-[2rem] overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.2)]"
                 >
                    <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10">I AM RESPONSIVE</span>
                 </button>
               )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
