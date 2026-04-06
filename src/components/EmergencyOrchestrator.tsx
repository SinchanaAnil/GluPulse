import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { triggerFullSOS } from "../utils/sosDispatcher";
import { cn } from "@/lib/utils";

const COUNTDOWN_INITIAL = 15;
const COOLDOWN_MS = 2 * 60 * 1000;

export const EmergencyOrchestrator = () => {
  const [isArmed, setIsArmed] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_INITIAL);
  const [sosSent, setSosSent] = useState(false);
  const [manualToastVisible, setManualToastVisible] = useState(false);
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const checkStatus = () => {
    // Cooldown check (2 mins)
    const lastSos = localStorage.getItem("sosCooldown");
    if (lastSos && Date.now() - parseInt(lastSos) < COOLDOWN_MS) return;

    const sessionStr = localStorage.getItem("lastReflexSession");
    if (!sessionStr) return;

    try {
      const session = JSON.parse(sessionStr);
      if (session.status === "CRITICAL" && session.meanLatency > 1000) {
        console.log("[EMERGENCY ORCHESTRATOR] 🚨 ARMING THE DEADMAN SWITCH");
        setIsArmed(true);
      }
    } catch (e) {
      console.error("Failed to parse reflex session", e);
    }
  };

  useEffect(() => {
    // 1. Initial check upon opening the app
    checkStatus();

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    // 2. Countdown logic when armed
    if (isArmed && countdown > 0 && !sosSent) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !sosSent) {
      handleAutonomousTrigger();
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isArmed, countdown, sosSent]);

  const handleResponsive = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Clear overlay state
    setIsArmed(false);
    setCountdown(COUNTDOWN_INITIAL);
    setSosSent(false);
    
    // As per user request: Trigger one last time after 10 seconds delay
    console.log("[EMERGENCY ORCHESTRATOR] Responsive. Scheduling final check in 10s...");
    setTimeout(() => {
      checkStatus();
    }, 10000);
  };

  const handleAutonomousTrigger = async () => {
    const profileStr = localStorage.getItem("userProfile");
    const sessionStr = localStorage.getItem("lastReflexSession");
    
    let patientName = "Unknown Patient";
    let meanLatency = 0;

    try {
      if (profileStr) patientName = JSON.parse(profileStr).patientName || patientName;
      if (sessionStr) meanLatency = JSON.parse(sessionStr).meanLatency || 0;
    } catch (e) {}

    setSosSent(true);
    localStorage.setItem("sosCooldown", Date.now().toString());

    await triggerFullSOS({
      patientName,
      latencyMs: meanLatency,
      status: "NEUROGLYCOPENIC_SHOCK_DETECTED",
    });

    // Voice Alert
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Emergency alert. ${patientName} is unresponsive at BMSIT Campus. SOS has been dispatched.`
    );
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleManualSOS = async () => {
    const profileStr = localStorage.getItem("userProfile");
    const sessionStr = localStorage.getItem("lastReflexSession");
    
    let patientName = "Unknown Patient";
    let meanLatency = 0;

    try {
      if (profileStr) patientName = JSON.parse(profileStr).patientName || patientName;
      if (sessionStr) meanLatency = JSON.parse(sessionStr).meanLatency || 0;
    } catch (e) {}

    setManualToastVisible(true);
    setTimeout(() => setManualToastVisible(false), 3000);

    triggerFullSOS({
      patientName,
      latencyMs: meanLatency,
      status: "MANUAL_SOS_BROADCAST",
    });
  };

  if (!isArmed) {
    return (
      <>
        {/* Manual Broadcast SOS Button - Fixed Bottom-Right */}
        <button
          onClick={handleManualSOS}
          className="fixed bottom-6 right-6 z-[45] bg-red-600 hover:bg-red-700 text-white font-black italic text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Broadcast SOS
        </button>

        {manualToastVisible && (
          <div className="fixed bottom-20 right-6 z-50 bg-black/80 backdrop-blur-md border border-red-500/50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4">
            SOS Dispatched ✅
          </div>
        )}
      </>
    );
  }

  // Deadman Switch Overlay
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Radial Countdown Timer Backdrop */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex items-center justify-center">
        <div 
          className="w-[200vw] h-[200vw] transition-all duration-1000 ease-linear"
          style={{ 
            background: `conic-gradient(from 0deg, #ef4444 ${(countdown / COUNTDOWN_INITIAL) * 100}%, transparent 0)` 
          }} 
        />
      </div>

      {/* Main Alert Content */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-6">
        <div className="w-32 h-32 rounded-full border-2 border-red-500/20 flex items-center justify-center relative bg-black/40 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="transparent"
              stroke="white"
              strokeOpacity="0.05"
              strokeWidth="4"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="60"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="377"
              animate={{ strokeDashoffset: 377 - (377 * countdown) / COUNTDOWN_INITIAL }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <span className="text-5xl font-black italic text-red-500 tabular-nums drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            {countdown}
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            ⚠️ Critical Alert Detected
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs leading-relaxed max-w-sm mx-auto">
            Neural latency threshold exceeded.<br/>Emergency protocol arming...
          </p>
        </div>

        {!sosSent ? (
          <>
            <button
              onClick={handleResponsive}
              className="mt-8 px-12 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full font-black italic text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(34,197,94,0.3)] border border-white/20 transition-all hover:scale-105 active:scale-95"
            >
              ✅ I Am Responsive
            </button>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Auto-dispatching SOS in {countdown}s...
            </p>
          </>
        ) : (
          <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="px-10 py-5 bg-red-500/10 border border-red-500/30 rounded-full">
              <h3 className="text-red-500 font-black italic uppercase tracking-widest">
                🚨 SOS Dispatched. Help is on the way.
              </h3>
            </div>
            <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/50 max-w-xs mx-auto">
              Emergency contacts and local medical services at BMSIT Campus have been notified.
            </p>
          </div>
        )}
      </div>

      {/* Manual button is hidden during overlay to prevent confusion */}
    </div>
  );
};
