import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, Target, Shield, Activity, User, Wallet, Clock, AlertCircle, ChevronRight, Trophy, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-Components ---

const NavLink = ({ label, active }: { label: string; active?: boolean }) => (
  <a href="#" className={cn("text-[10px] font-bold tracking-[0.2em] transition-colors", active ? "text-white" : "text-white/40 hover:text-white/70")}>{label}</a>
);

const ReflexUnit = ({ title, status, icon: Icon, delay = 0, locked }: { title: string; status: string; icon: any; delay?: number; locked?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={cn(
      "relative group w-44 h-60 rounded-2xl flex flex-col items-center justify-center gap-4 overflow-hidden border transition-all duration-300",
      locked ? "bg-white/5 border-white/5 grayscale pointer-events-none" : "bg-white/5 border-white/10 hover:border-accent/40 cursor-pointer"
    )}
  >
    <div className={cn("absolute inset-0 bg-accent/10 opacity-0 transition-opacity duration-300", !locked && "group-hover:opacity-100")} />
    <div className={cn("w-20 h-20 rounded-xl flex items-center justify-center border transition-all duration-300", locked ? "bg-black/20 border-white/5" : "bg-white/10 border-white/20 group-hover:border-accent/40")}>
      <Icon className={cn("w-10 h-10 transition-colors duration-300", locked ? "text-white/10" : "text-white/50 group-hover:text-accent")} />
    </div>
    <div className="text-center px-2">
      <h3 className="text-xs font-black italic tracking-widest text-white uppercase">{title}</h3>
      <p className="text-[9px] text-white/40 mt-1 uppercase tracking-tighter font-bold">{status}</p>
    </div>
    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
      <div className={cn("w-12 h-[2px] transition-colors duration-300", locked ? "bg-white/5" : "bg-white/20 group-hover:bg-accent/40")} />
    </div>
  </motion.div>
);

const LevelBox = ({ level, title, description, variant = "light", delay = 0 }: { level: string; title: string; description: string; variant?: "light" | "dark"; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={cn(
      "p-5 rounded-2xl shadow-xl flex flex-col items-center text-center gap-3 border transition-all duration-300",
      variant === "light" ? "bg-white border-black/5" : "bg-white/5 border-white/10"
    )}
  >
    <div className={cn("w-10 h-10 border rounded-lg flex items-center justify-center", variant === "light" ? "border-black/10" : "border-white/10")}>
      <Shield className={cn("w-5 h-5", variant === "light" ? "text-black/20" : "text-white/20")} />
    </div>
    <div>
      <p className={cn("text-[9px] font-black uppercase tracking-widest", variant === "light" ? "text-black/30" : "text-white/30")}>Phase {level}</p>
      <h3 className={cn("text-[11px] font-bold mt-1 leading-tight uppercase tracking-tight", variant === "light" ? "text-black" : "text-white")}>{title}</h3>
      <p className={cn("text-[8px] mt-2 leading-relaxed max-w-[110px] font-medium", variant === "light" ? "text-black/50" : "text-white/50")}>{description}</p>
    </div>
    <button className={cn(
      "mt-1 px-4 py-1.5 text-[9px] font-black italic rounded-full uppercase tracking-widest transition-transform hover:scale-105",
      variant === "light" ? "bg-accent text-white" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
    )}>
      Protocol
    </button>
  </motion.div>
);

const HistoryLog = ({ title, date, status, delay = 0 }: { title: string; date: string; status: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-black/5 group hover:shadow-md transition-shadow"
  >
    <div className="h-20 bg-black/5 flex items-center justify-center relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-30 group-hover:opacity-50 transition-opacity" />
       <Activity className="w-8 h-8 text-black/10 group-hover:text-accent/20 transition-colors" />
    </div>
    <div className="p-3">
       <div className="flex justify-between items-center">
          <span className="text-[7px] text-black/40 font-bold uppercase">{date}</span>
          <div className={cn("h-1 w-1 rounded-full", status === "STABLE" ? "bg-success" : "bg-warning")} />
       </div>
       <h4 className="text-[10px] font-extrabold text-black leading-tight mt-1 uppercase italic tracking-tighter">{title}</h4>
       <div className="mt-2 flex items-center justify-between">
          <span className="text-[8px] font-bold text-black/30 uppercase">{status}</span>
          <ChevronRight className="w-3 h-3 text-black/20" />
       </div>
    </div>
  </motion.div>
);

// --- Main Page ---

export default function ReflexTest() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [lastMessage, setLastMessage] = useState("Tap to initiate stability scan.");
  const startTime = useRef<number>(0);
  const timeoutRef = useRef<any>(null);

  const startTest = () => {
    setGameState("waiting");
    setLastMessage("Synchronizing neural pathways... Wait for signal.");
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startTime.current = Date.now();
      setGameState("ready");
      setLastMessage("SIGNAL DETECTED! REACT NOW!");
    }, delay);
  };

  const handleTap = () => {
    if (gameState === "ready") {
      const time = Date.now() - startTime.current;
      setReactionTime(time);
      setGameState("result");
      
      if (time < 300) setLastMessage("STATUS: OPTIMAL. Metabolic balance confirmed.");
      else if (time < 500) setLastMessage("STATUS: FAIR. Minimal glucose-induced lag detected.");
      else setLastMessage("STATUS: CRITICAL! Severe reflex impediment. Check levels!");
    } else if (gameState === "waiting") {
      clearTimeout(timeoutRef.current);
      setGameState("idle");
      setLastMessage("ABORTED: Early response invalidates mapping data.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0814] text-white overflow-hidden relative font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="absolute left-6 top-1/3 flex flex-col gap-1.5 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-1.5">
             {[...Array(4)].map((_, j) => <div key={j} className="w-1.5 h-1.5 bg-accent" />)}
          </div>
        ))}
      </div>

      <header className="flex justify-between items-center py-8 px-12 relative z-50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center bg-accent/20 border border-accent/40 rounded italic font-black text-accent text-xl skew-x-[-15deg]">
             G
          </div>
          <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">Meta-Reflex ARENA</span>
        </div>
        <nav className="flex items-center gap-10">
          <NavLink label="BIOMETRICS" active />
          <NavLink label="ANALYSIS" />
          <NavLink label="CLINIC" />
        </nav>
      </header>

      <main className="grid grid-cols-12 min-h-screen relative z-10">
        
        {/* Left Side: Performance Hub */}
        <div className="col-span-12 xl:col-span-7 pl-12 pr-6 pb-24 relative">
          
          <div className="mt-8 relative z-20">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3" /> NEURO-GLYCO MAPPING ACTIVE
            </p>
            <h1 className="text-8xl font-black italic tracking-tighter leading-[0.85] mb-6 uppercase">
              REFLEX<br/>DASHBOARD
            </h1>
            <p className="text-xs text-white/40 max-w-xs font-bold leading-relaxed uppercase tracking-wide">
              Testing for hypoglycemia-induced cognitive delays. <span className="text-white">Reflex speed correlates directly with cerebral glucose availability.</span>
            </p>
          </div>

          <div className="mt-16 flex gap-6 items-center relative z-20">
            <AnimatePresence mode="wait">
              {gameState === "idle" || gameState === "result" ? (
                <motion.div
                  key="game-idle"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-6 items-center"
                >
                   <ReflexUnit 
                     onClick={startTest} 
                     title={gameState === "result" ? `LAST: ${reactionTime}ms` : "INITIATE SCAN"} 
                     status={gameState === "result" ? "RESET TEST" : "Stability Test"} 
                     icon={Zap} 
                   />
                   <ReflexUnit title="NEURAL PATH" status="Level 02 Required" icon={Shield} locked />
                   <ReflexUnit title="FOCUS LOCK" status="Level 05 Required" icon={Timer} locked />
                </motion.div>
              ) : (
                <motion.div
                  key="game-active"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  onClick={handleTap}
                  className="w-full flex flex-col items-center justify-center py-10 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-accent/5 animate-pulse" />
                   <motion.div
                     animate={gameState === "ready" ? {
                       scale: [1, 1.3, 1],
                       opacity: [0.6, 1, 0.6],
                     } : {}}
                     transition={{ repeat: Infinity, duration: 0.4 }}
                     className={cn(
                       "w-40 h-40 rounded-full flex items-center justify-center transition-all duration-200 border-4",
                       gameState === "ready" 
                        ? "bg-primary/20 border-primary shadow-[0_0_80px_rgba(var(--primary),0.6)]" 
                        : "bg-white/5 border-white/10"
                     )}
                   >
                     <div className="text-center">
                        <p className="text-[10px] font-black italic tracking-widest text-white/50 uppercase">
                          {gameState === "ready" ? "FLASH DETECTED" : "SYNCHING..."}
                        </p>
                        <p className="text-sm font-black italic text-white uppercase mt-1">
                          {gameState === "ready" ? "TAP NOW!" : "WAIT"}
                        </p>
                     </div>
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-16 flex items-end gap-12 relative z-20">
            <div className="flex flex-col gap-1">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Stability XP</span>
               <span className="text-4xl font-black text-accent italic">11,240</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Patient Rank</span>
               <span className="text-4xl font-black text-white/20 italic uppercase tracking-widest">RANK: 04</span>
            </div>
            <div className="ml-auto flex flex-col items-end gap-3 translate-y-[-10px]">
               <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">{lastMessage}</p>
               <div className="flex gap-1">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className={cn("h-8 w-1 rounded-full", 
                      gameState === "waiting" && i < 15 ? "bg-accent/40" : 
                      gameState === "ready" ? i < 20 ? "bg-primary" : "bg-white/5" :
                      i < 12 ? "bg-accent/20" : "bg-white/5"
                    )} />
                  ))}
               </div>
            </div>
          </div>

          {/* Zigzag Bottom Left Overlay (White Zone) */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[450px] bg-white z-30"
            style={{ clipPath: 'polygon(0 80px, 80px 0, 100% 0, 100% 100%, 0 100%)' }}
          >
             <div className="p-12 h-full flex flex-col justify-end gap-10">
                <div className="flex gap-4">
                   <button className="px-8 py-2.5 bg-black text-white text-[10px] font-black rounded-full italic uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-transform">Stability Sync</button>
                   <button className="px-8 py-2.5 bg-black/5 text-black/30 text-[10px] font-black rounded-full italic uppercase tracking-[0.2em] hover:bg-black/10 transition-colors">Neural Path</button>
                </div>
                <div className="flex flex-col gap-2">
                   <h2 className="text-5xl font-black italic text-black leading-[0.85] uppercase tracking-tighter max-w-sm">
                      NEUROGLYCOPENIC<br/>RESPONSE RULES
                   </h2>
                   <p className="text-[9px] text-black/40 font-bold uppercase tracking-widest mt-2">Critical test protocols for type 1 patients.</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                   <LevelBox level="1" title="RAPID REACTION" description="React within 300ms to confirm optimal brain glucose supply." />
                   <LevelBox level="2" title="PATHWAY CONSISTENCY" description="Monitor lag across 5 consecutive attempts for metabolic drift." />
                   <LevelBox level="3" title="ALERT PROTOCOL" description="Reaction > 500ms initiates emergency SMS to your guardian." />
                </div>
             </div>
          </div>

        </div>

        {/* Right Side: Analytical Hub */}
        <div className="col-span-12 xl:col-span-5 relative">
          
          {/* Top Zigzag (Light Gray Section) */}
          <div 
            className="absolute top-0 right-0 w-full h-[65%] bg-[#F9F9FB] z-0"
            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
          />
          
          <div className="relative z-10 pt-16 px-12 flex flex-col gap-10 h-[65%]">
             <div className="flex justify-center gap-8">
                 <LevelBox level="A" title="SIGNAL PULSE" description="The core of reflex diagnostics. Measures raw impulse speed." delay={0.1} />
                 <LevelBox level="B" title="DRIFT MONITOR" description="Checks for cognitive wavering over sustained periods." delay={0.2} />
                 <LevelBox level="C" title="PRE-HYPO ALARM" description="Identifies patterns of slowing before you feel symptoms." delay={0.3} />
             </div>

             <div className="mt-6">
                <div className="flex justify-between items-center mb-8 pr-2">
                   <h3 className="text-xs font-black text-black uppercase tracking-[0.3em] italic flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" /> Historic Stability Logs
                   </h3>
                   <span className="text-[9px] font-black text-black/30 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">View All</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <HistoryLog title="SYNC SCAN COMPLETED" date="AUG 21, 10:24" status="STABLE" delay={0.4} />
                   <HistoryLog title="DRIFT DETECTED" date="AUG 20, 22:15" status="CAUTION" delay={0.5} />
                   <HistoryLog title="NIGHT SCAN" date="AUG 20, 03:00" status="STABLE" delay={0.6} />
                   <HistoryLog title="REFLEX SPIKE" date="AUG 19, 14:30" status="STABLE" delay={0.7} />
                </div>
             </div>
          </div>

          {/* Bottom Zigzag (Dark Wallet Section) */}
          <div 
            className="absolute bottom-0 right-0 w-[115%] h-[38%] bg-[#0B0610] z-40 border-t border-accent/20"
            style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
             
             <div className="relative p-12 flex flex-col h-full justify-center gap-6">
                <div className="flex justify-between items-center">
                   <h2 className="text-3xl font-black italic tracking-tighter text-white leading-[0.9] uppercase max-w-[280px]">
                      METABOLIC WALLET:<br/>ANALYTICS VAULT
                   </h2>
                   <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group cursor-pointer hover:bg-accent/20 transition-all">
                      <Wallet className="w-6 h-6 text-white/30 group-hover:text-accent" />
                   </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                   <LevelBox level="MAX" title="VOLTAGE" description="Raw neural output measured in micro-impulses." variant="dark" delay={0.8} />
                   <LevelBox level="AVG" title="SYNAPSE" description="Average pathway latency across all tests." variant="dark" delay={0.9} />
                   <LevelBox level="MIN" title="PULSE" description="Lowest recorded reflex during hypo-state." variant="dark" delay={1.0} />
                   <LevelBox level="RT" title="UPTIME" description="Continuous monitoring duration for this cycle." variant="dark" delay={1.1} />
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
                   <div className="flex items-center gap-2">
                       <AlertCircle className="w-4 h-4 text-warning" />
                       <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Next scan required in 4h 22m</span>
                   </div>
                   <div className="flex gap-4">
                      <button className="px-6 py-2 bg-accent/20 border border-accent/40 text-accent text-[9px] font-black italic rounded uppercase tracking-widest hover:bg-accent/30 transition-all">Access Data</button>
                      <button className="px-6 py-2 bg-white/5 border border-white/10 text-white/40 text-[9px] font-black italic rounded uppercase tracking-widest hover:bg-white/10 transition-all">Protocols</button>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Extreme Right Neon Indicator */}
      <div className="absolute right-0 top-0 w-1.5 h-full bg-white/5 z-50">
         <motion.div 
           animate={{ height: ["10%", "40%", "20%"] }}
           transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
           className="w-full bg-accent shadow-[0_0_15px_rgba(187,57,237,1)]" 
         />
      </div>

    </div>
  );
}
