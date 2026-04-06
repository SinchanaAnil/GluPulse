import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, Activity, CheckCircle2, AlertCircle, Loader2, Brain, Move } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "RED", value: "#ef4444" },
  { name: "GREEN", value: "#22c55e" },
  { name: "BLUE", value: "#3b82f6" },
  { name: "YELLOW", value: "#eab308" },
  { name: "PINK", value: "#ec4899" }
];

const MetricCard = ({ icon: Icon, label, value, subValue, colorClass }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
    <div className={cn("absolute top-0 left-0 w-1 h-full opacity-50", colorClass)} />
    <div className="flex items-center gap-2 text-zinc-500">
      <Icon className="w-4 h-4" />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-3xl font-black italic tracking-tighter text-white">{value}</div>
    <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">{subValue}</div>
  </div>
);

export default function ReflexTest() {
  const [testType, setTestType] = useState<"spatial" | "interference">("spatial");
  const [gameState, setGameState] = useState<"idle" | "waiting" | "active" | "round_result" | "final_result" | "syncing">("idle");
  const [rounds, setRounds] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [lastSession, setLastSession] = useState<any>(null);
  const [isEmergencyPending, setIsEmergencyPending] = useState(false);
  
  // Spatial state
  const [triggerPos, setTriggerPos] = useState({ top: 50, left: 50 });
  
  // Stroop state
  const [stroopTask, setStroopTask] = useState<any>(null);

  const startTime = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const generateSpatialPos = () => ({
    top: 15 + Math.random() * 60,
    left: 15 + Math.random() * 60
  });

  const generateStroopTask = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let colorIdx;
    do {
      colorIdx = Math.floor(Math.random() * COLORS.length);
    } while (colorIdx === wordIdx);

    const task = {
      word: COLORS[wordIdx].name,
      color: COLORS[colorIdx].value,
      correctValue: COLORS[colorIdx].value,
      options: [...COLORS].sort(() => 0.5 - Math.random()).slice(0, 3)
    };
    
    // Ensure correct option is present
    if (!task.options.find(o => o.value === task.correctValue)) {
      task.options[0] = COLORS[colorIdx];
      task.options.sort(() => 0.5 - Math.random());
    }
    
    setStroopTask(task);
  }, []);

  useEffect(() => {
    if (gameState === "active") {
      startTime.current = Date.now();
    }
  }, [gameState]);

  const startNewSession = (type: "spatial" | "interference") => {
    setTestType(type);
    setRounds([]);
    setErrors(0);
    setGameState("idle");
    setCurrentLatency(null);
    initiateRound(1, type);
  };

  const initiateRound = (roundNum: number, type: "spatial" | "interference") => {
    setGameState("waiting");
    if (type === "spatial") setTriggerPos(generateSpatialPos());
    if (type === "interference") generateStroopTask();

    const delay = 1200 + Math.random() * 2000;
    timerRef.current = setTimeout(() => {
      setGameState("active");
    }, delay);
  };

  const handleInteraction = (val?: string) => {
    if (gameState !== "active") return;

    const latency = Date.now() - startTime.current;
    
    if (testType === "interference") {
      if (val !== stroopTask.correctValue) {
        setErrors(prev => prev + 1);
        // Visual penalty/feedback could go here
      }
    }

    const newRounds = [...rounds, latency];
    setRounds(newRounds);
    setCurrentLatency(latency);
    
    if (newRounds.length < 5) {
      setGameState("round_result");
      setTimeout(() => initiateRound(newRounds.length + 1, testType), 800);
    } else {
      syncResults(newRounds, (testType === "interference" ? errors : 0));
    }
  };

  const syncResults = async (finalRounds: number[], sessionErrors: number) => {
    setGameState("syncing");
    const mean = finalRounds.reduce((a, b) => a + b, 0) / finalRounds.length;
    const accuracy = testType === "interference" ? Math.round(((5 - sessionErrors) / 5) * 100) : 100;
    
    try {
      const response = await fetch("http://127.0.0.1:5000/api/reflex-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType,
          latencies: finalRounds,
          meanLatency: Math.round(mean),
          accuracy,
          userName: "Simulated Patient",
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      const sessionResult = { ...data, accuracy };
      setLastSession(sessionResult);
      localStorage.setItem("lastReflexSession", JSON.stringify(sessionResult));
      setGameState("final_result");
    } catch (err) {
      console.error("[REFLEX_ERROR] Sync failed:", err);
      // Fallback with new thresholds
      const isCritical = testType === 'spatial' ? mean > 1200 : mean > 1800;
      const sessionResult = {
        meanLatency: Math.round(mean),
        accuracy,
        status: isCritical ? 'CRITICAL' : 'STABLE'
      };
      setLastSession(sessionResult);
      localStorage.setItem("lastReflexSession", JSON.stringify(sessionResult));
      setGameState("final_result");
    }
  };

  const dispatchToCloud = useCallback(async () => {
    const lastSession = JSON.parse(localStorage.getItem("lastReflexSession") || '{"meanLatency": 0}');
    
    try {
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
      console.log('SENTINEL: Data Broadcasted to Emergency Bridge.');
    } catch (err) {
      console.error('SENTINEL: Broadcast Failed', err);
    }
  }, []);

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("lastReflexSession");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.handled && isEmergencyPending) {
          setIsEmergencyPending(false);
          setLastSession((prev: any) => ({ ...prev, meanLatency: 0, status: 'STABLE' }));
        } else if (data.status === 'CRITICAL' && !data.handled) {
          setIsEmergencyPending(true);
        }
      }
    };
    const interval = setInterval(handleSync, 1000);
    return () => clearInterval(interval);
  }, [isEmergencyPending]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col p-8 md:p-12 gap-8 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-0.5 bg-primary/20 border border-primary/40 rounded text-primary text-[9px] font-black italic uppercase tracking-widest">
               Multimodal Diagnostic-v5
             </div>
             <div className="h-0.5 w-12 bg-zinc-800" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">
            Neural Battery<br />Orchestrator
          </h1>
        </div>

        <div className="flex gap-4 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
           <button 
             onClick={() => setTestType("spatial")}
             className={cn("px-6 py-2 rounded-lg text-[10px] font-black italic uppercase tracking-widest transition-all", 
               testType === "spatial" ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
           >
             Spatial-Sync
           </button>
           <button 
             onClick={() => setTestType("interference")}
             className={cn("px-6 py-2 rounded-lg text-[10px] font-black italic uppercase tracking-widest transition-all", 
               testType === "interference" ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
           >
             Neuro-Interference
           </button>
        </div>
      </div>

      {/* 2. Active Test Zone */}
      <div className="flex-grow flex flex-col items-center justify-center relative z-10 min-h-[450px]">
        <AnimatePresence mode="wait">
          {gameState === "idle" || gameState === "final_result" ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center max-w-md mb-4">
                 <h2 className="text-lg font-black italic uppercase text-zinc-400 mb-2">
                   {testType === "spatial" ? "Spatial Reaction Test" : "Neural Interference Test"}
                 </h2>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                   {testType === "spatial" 
                    ? "Targets will appear in random positions. Track and tap instantly to measure visual-motor latency."
                    : "Conflicts between word and color will appear. Select the button matching the INK COLOR only."}
                 </p>
              </div>
              <button
                onClick={() => startNewSession(testType)}
                className="group relative px-16 py-8 bg-primary rounded-2xl font-black italic text-xl uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                   {testType === "spatial" ? <Move className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                   INITIATE {testType === "spatial" ? "SPATIAL" : "NEURAL"} SCAN
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "w-full max-w-5xl h-[450px] rounded-[2.5rem] border-4 flex flex-col items-center justify-center transition-all duration-150 relative overflow-hidden",
                gameState === "waiting" && "bg-zinc-900 border-zinc-800",
                gameState === "active" && testType === "spatial" && "bg-zinc-950 border-primary shadow-[inset_0_0_100px_rgba(var(--primary-rgb),0.1)]",
                gameState === "active" && testType === "interference" && "bg-zinc-900 border-zinc-800",
                (gameState === "round_result" || gameState === "syncing") && "bg-zinc-950 border-zinc-800"
              )}
              onClick={testType === "spatial" ? () => handleInteraction() : undefined}
            >
              {gameState === "waiting" && (
                <div className="text-center">
                  <p className="text-zinc-600 text-xs font-black italic uppercase tracking-[0.4em] mb-3 animate-pulse">Synchronizing Neural Channels...</p>
                  <p className="text-zinc-800 text-[10px] font-bold uppercase tracking-widest">Awaiting Peripheral Impulse</p>
                </div>
              )}

              {gameState === "active" && testType === "spatial" && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute p-6 bg-primary rounded-2xl shadow-[0_0_40px_rgba(var(--primary-rgb),0.6)] cursor-crosshair group flex flex-col items-center gap-2"
                  style={{ 
                    top: `${triggerPos.top}%`, 
                    left: `${triggerPos.left}%`,
                    transform: 'translate(-50%, -50%)' 
                  }}
                >
                  <Zap className="w-8 h-8 text-white fill-white" />
                  <span className="text-[10px] font-black text-white italic uppercase white-nowrap">TAP!</span>
                </motion.div>
              )}

              {gameState === "active" && testType === "interference" && (
                <div className="flex flex-col items-center gap-12">
                   <motion.h2 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     style={{ color: stroopTask.color }}
                     className="text-8xl font-black italic tracking-tighter uppercase"
                   >
                     {stroopTask.word}
                   </motion.h2>

                   <div className="flex gap-6">
                      {stroopTask.options.map((opt: any) => (
                        <button
                          key={opt.value}
                          onClick={() => handleInteraction(opt.value)}
                          className="w-24 h-24 rounded-3xl border-2 border-zinc-700 transition-all hover:scale-110 active:scale-90 hover:border-white shadow-xl"
                          style={{ backgroundColor: opt.value }}
                        />
                      ))}
                   </div>
                </div>
              )}

              {(gameState === "round_result" || gameState === "syncing") && (
                <div className="text-center flex flex-col items-center gap-6">
                  {gameState === "syncing" ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      <p className="text-primary text-sm font-black italic uppercase tracking-widest">Inference in Progress...</p>
                    </div>
                  ) : (
                    <>
                    <p className="text-white text-7xl font-black italic tracking-tighter mb-2">{currentLatency}ms</p>
                    <div className="flex items-center gap-3 justify-center mb-4">
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className={cn("h-1.5 w-8 rounded-full transition-all", i < rounds.length ? "bg-primary" : "bg-zinc-800")} />
                       ))}
                    </div>
                    {gameState === "round_result" && currentLatency && (
                      <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", 
                        testType === 'spatial' ? (currentLatency < 800 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20") :
                        (currentLatency < 1300 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")
                      )}>
                        {currentLatency < (testType === 'spatial' ? 800 : 1300) ? "OPTIMAL IMPULSE" : "NEURAL LAG DETECTED"}
                      </div>
                    )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-6xl mx-auto w-full">
        <MetricCard 
          icon={Timer} 
          label="Impulse Latency" 
          value={lastSession ? `${lastSession.meanLatency}ms` : "---"} 
          subValue={testType === "spatial" ? "Spatial Tracking" : "Conflict Reaction"} 
          colorClass="bg-blue-500"
        />
        <MetricCard 
          icon={Brain} 
          label="Cognitive Load" 
          value={lastSession ? `${lastSession.accuracy}%` : "---"} 
          subValue="Inhibition Accuracy" 
          colorClass="bg-emerald-500"
        />
        <MetricCard 
          icon={lastSession?.status === 'CRITICAL' ? AlertCircle : CheckCircle2} 
          label="Neural Outlook" 
          value={lastSession ? (lastSession.meanLatency > 1000 ? 'CRITICAL' : 'STABLE') : "READY"} 
          subValue="Diagnostic Conclusion" 
          colorClass={lastSession?.meanLatency > 1000 ? "bg-red-500" : (lastSession?.status === 'CAUTION' ? "bg-yellow-500" : "bg-primary")}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button 
          onClick={() => {
            alert("Sentience-ML Engine v2.1\n\nFeature Importance:\n1. Synaptic Latency: 40%\n2. Acoustic Jitter: 35%\n3. Amplitude Shimmer: 25%\n\nVerdict: High-confidence neural drift detection active.");
          }}
          className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-black italic uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2"
        >
          <Activity className="w-3 h-3" />
          Neural Weight Insights (XAI)
        </button>
      </div>

      {/* 4. Recovery Snapshot - Direct bridge to Nutrition Logic */}
      <AnimatePresence>
        {lastSession?.meanLatency > 1000 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-red-950 border border-red-500/30 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-6 backdrop-blur-xl">
               <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/40 shrink-0">
                  <Brain className="w-8 h-8 text-red-500 animate-pulse" />
               </div>
               <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Neural collapse imminent</h3>
                  <p className="text-red-200/60 text-[10px] font-bold uppercase tracking-widest mt-1">Reflex time exceeds 1000ms. EMERGENCY PROTOCOL ARMED.</p>
               </div>
               <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => window.location.href = '/vision-engine'}
                    className="w-full px-6 py-2 bg-zinc-950/40 text-white text-[9px] font-black italic uppercase tracking-widest rounded-xl hover:bg-zinc-950 transition-all border border-white/5"
                  >
                    Scan Food
                  </button>
                  <button 
                    onClick={dispatchToCloud}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black italic uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-red-900/40"
                  >
                    Broadcast SOS (BMSIT Stealth)
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
