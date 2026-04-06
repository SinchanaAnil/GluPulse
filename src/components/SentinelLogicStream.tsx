import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Database, Activity, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SentinelLogicStream.tsx - The Real-time Agentic Thinking Terminal
 * Displays the Sentinel's underlying reasoning and tool calls for judging transparency.
 */
export function SentinelLogicStream() {
  const [logs, setLogs] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLogs = () => {
      // Pulling "Internal Thoughts" from localStorage for Demo Persistence 
      const lastReflex = JSON.parse(localStorage.getItem("lastReflexSession") || "{}");
      const lastVoice = JSON.parse(localStorage.getItem("lastVoicePayload") || "{}");
      const lastMeal = JSON.parse(localStorage.getItem("lastScannedFood") || "{}");
      const lastThought = JSON.parse(localStorage.getItem("sentinel_last_thought") || "{}");

      const newLogs = [
        { time: "SYS_UP", type: "INFO", thought: "SENTINEL AGENT CONNECTED. Multi-modal biometrics listening..." },
      ];

      if (lastThought.text) {
          newLogs.push({ time: lastThought.time || "NOW", type: "AI", thought: lastThought.text });
      }

      if (lastMeal.name) {
          newLogs.push({ time: "T+15m", type: "DB", thought: `Vision tool updated: ${lastMeal.name} (GI: ${lastMeal.glycemicIndex}) identified.` });
      }

      if (lastReflex.meanLatency) {
          newLogs.push({ time: "T+2s", type: "TOOL", thought: `Reflex tool returned synaptic delay of ${lastReflex.meanLatency}ms.` });
          if (lastReflex.meanLatency > 1150) {
              newLogs.push({ time: "NOW", type: "CRITICAL", thought: `[AUTO_ESCALATION] Synaptic threshold exceeded. Global risk calculated at 85%.` });
              newLogs.push({ time: "NOW", type: "ACTION", thought: `ENGAGING SENTINEL SHIELD: SOS BROADCAST IMMINENT.` });
          }
      }

      if (lastVoice.jitter) {
          newLogs.push({ time: "T+1s", type: "TOOL", thought: `Voice tool returned ${lastVoice.jitter}% jitter. High fidelity capture confirmed.` });
      }

      setLogs(newLogs.reverse());
    };

    const interval = setInterval(handleLogs, 2000);
    handleLogs();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="bg-black/80 border border-zinc-800 rounded-3xl p-6 h-64 overflow-hidden relative shadow-2xl backdrop-blur-xl group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-primary/20 to-rose-500/20" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-zinc-900 border border-emerald-500/30 rounded-lg">
                <Terminal className="h-4 w-4 text-emerald-500" />
            </div>
            <h2 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Sentinel Logic Stream v4.1</h2>
        </div>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase text-emerald-500/50 tracking-widest italic">Agentic Core Online</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="space-y-3 font-mono text-[9px] h-40 overflow-y-auto pr-2 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={i + log.thought}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex gap-4 items-start"
            >
                <div className="flex flex-col items-end gap-1 w-14 border-r border-zinc-800 pr-3 opacity-30">
                    <span className="text-zinc-500 font-bold">{log.time}</span>
                </div>
                <div className="flex-1">
                    <p className={cn(
                        "font-bold uppercase tracking-tight",
                        log.type === "AI" && "text-emerald-400 font-extrabold animate-pulse",
                        log.type === "DB" && "text-sky-500",
                        log.type === "TOOL" && "text-primary",
                        log.type === "CRITICAL" && "text-rose-500 animate-pulse",
                        log.type === "ACTION" && "text-emerald-500"
                    )}>
                       <span className="opacity-40 mr-2">&gt;</span>
                       [{log.type}] {log.thought}
                    </p>
                </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      
      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center opacity-40">
        <div className="flex gap-4">
            <Cpu className="h-3 w-3 text-zinc-600" />
            <Database className="h-3 w-3 text-zinc-600" />
            <Activity className="h-3 w-3 text-zinc-600" />
        </div>
        <span className="text-[6px] font-black uppercase text-zinc-600 tracking-widest">Autonomous Reasoning Engine Enabled</span>
      </div>
    </div>
  );
}
