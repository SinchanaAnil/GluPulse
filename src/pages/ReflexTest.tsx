import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, Target, Users, Shield, Trophy, Activity, MessageCircle, MoreHorizontal, LayoutDashboard, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Components ---

const GameCard = ({ title, status, icon: Icon, delay = 0 }: { title: string; status: string; icon: any; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative group cursor-pointer"
  >
    <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
    <div className="relative glass-card-hover p-6 border-accent/20 bg-accent/5 overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Icon className="w-12 h-12 text-accent" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const LevelCard = ({ level, title, description, active, delay = 0 }: { level: string; title: string; description: string; active?: boolean; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={cn(
      "p-4 rounded-xl border border-accent/10 bg-accent/5 transition-all duration-300",
      active ? "border-accent/40 bg-accent/10 shadow-[0_0_20px_-5px_rgba(var(--accent),0.3)]" : "hover:border-accent/20"
    )}
  >
    <div className="flex items-center gap-4">
      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs border", active ? "bg-accent text-white border-accent" : "bg-muted text-muted-foreground border-border")}>
        {level}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{description}</p>
      </div>
    </div>
  </motion.div>
);

const HistoryCard = ({ date, test, result, status, delay = 0 }: { date: string; test: string; result: string; status: "optimal" | "low" | "critical"; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group"
  >
    <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
      <Timer className="w-4 h-4 text-accent" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-foreground">{test}</h4>
        <span className="text-[10px] text-muted-foreground">{date}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-semibold tabular-nums text-foreground">{result}</span>
        <div className={cn("w-1.5 h-1.5 rounded-full",
          status === "optimal" ? "bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]" :
          status === "low" ? "bg-warning shadow-[0_0_8px_rgba(var(--warning),0.5)]" :
          "bg-destructive shadow-[0_0_8px_rgba(var(--destructive),0.5)]"
        )} />
      </div>
    </div>
  </motion.div>
);

// --- Main Page ---

export default function ReflexTest() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "result">("idle");
  const [lastTime, setLastTime] = useState<number | null>(null);
  const startTime = useRef<number>(0);
  const timeoutRef = useRef<any>(null);

  const startTest = () => {
    setGameState("waiting");
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startTime.current = Date.now();
      setGameState("ready");
    }, delay);
  };

  const handleTap = () => {
    if (gameState === "ready") {
      const time = Date.now() - startTime.current;
      setLastTime(time);
      setGameState("result");
    } else if (gameState === "waiting") {
      clearTimeout(timeoutRef.current);
      setGameState("idle");
    }
  };

  const getStatus = (time: number) => {
    if (time < 300) return { label: "OPTIMAL", color: "text-success", icon: Zap };
    if (time < 500) return { label: "FAIR", color: "text-warning", icon: Activity };
    return { label: "IMPEDED", color: "text-destructive", icon: Shield };
  };

  const currentStatus = lastTime ? getStatus(lastTime) : null;

  return (
    <div className="min-h-screen relative flex flex-col gap-6 -mt-6">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Info */}
      <header className="flex justify-between items-center py-4 px-2">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-accent/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground italic">NEURO-PULSE AR</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6">
            <NavLinkItem text="DASHBOARD" active />
            <NavLinkItem text="NEURAL STATS" />
            <NavLinkItem text="PROTOCOL" />
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/5 rounded border border-white/10 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Testing Active</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-accent" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 overflow-visible">
        {/* Left Section (2/3) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative glass-card p-10 border-accent/10 overflow-hidden min-h-[500px] flex flex-col">
            {/* Title Section */}
            <div className="relative z-10 flex flex-col gap-1 max-w-md">
              <p className="text-[10px] font-black text-accent tracking-widest uppercase">Neuro-Stability Protocol</p>
              <h1 className="text-5xl font-black text-foreground tracking-tighter leading-none mb-4 italic">REFLEX ARENA</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Precision neuro-cognitive assessment designed to identify metabolic interference. 
                Delayed reflex response is a primary indicator of neuroglycopenia in diabetic patients.
              </p>
            </div>

            {/* Game Canvas / Simulation */}
            <div className="flex-1 flex flex-col items-center justify-center relative py-12">
              <AnimatePresence mode="wait">
                {gameState === "idle" || gameState === "result" ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center gap-8"
                  >
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl" />
                      <button
                        onClick={startTest}
                        className="relative w-full h-full rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center text-accent group hover:bg-accent hover:text-white transition-all duration-500 hover:scale-105 active:scale-95"
                      >
                        <Zap className={cn("w-16 h-16 transition-transform duration-500", gameState === "result" ? "rotate-0" : "animate-pulse")} />
                      </button>
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-black text-foreground italic uppercase">
                        {gameState === "result" ? "Assessment Complete" : "Enter Neural Test"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                        {gameState === "result" ? "Refining metabolic profile..." : "Tap the pulse core to begin"}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full flex flex-col items-center"
                    onClick={handleTap}
                  >
                    <motion.div
                      animate={gameState === "ready" ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                      } : {}}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                      className={cn(
                        "w-56 h-56 rounded-full flex items-center justify-center transition-colors duration-200",
                        gameState === "ready" ? "bg-primary shadow-[0_0_80px_rgba(var(--primary),0.6)]" : "bg-white/5 border border-white/10"
                      )}
                    >
                      <span className="text-sm font-black italic text-background">
                        {gameState === "ready" ? "SIGNAL DETECTED!" : "SYNCHRONIZING..."}
                      </span>
                    </motion.div>
                    <p className="mt-8 text-[10px] text-muted-foreground font-bold tracking-[0.3em] uppercase">
                      {gameState === "ready" ? "React instantly" : "Do not engage until flash"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Stats */}
            <div className="flex flex-wrap items-end gap-12 mt-auto pt-8 border-t border-white/5 relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Session XP</span>
                <span className="text-3xl font-black text-foreground tabular-nums italic">12,240</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Status Rank</span>
                <span className="text-3xl font-black text-accent italic">STABLE VETERAN</span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Phase Progress</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className={cn("h-6 w-1 rounded-full", i < 4 ? "bg-accent" : i === 4 ? "bg-primary animate-pulse" : "bg-white/10")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard title="REACTION SURGE" status="Trained: 24h ago" icon={Zap} delay={0.1} />
            <GameCard title="PATTERN LOCK" status="Elite Mastery" icon={Shield} delay={0.2} />
            <GameCard title="FOCUS STREAK" status="New Record" icon={Target} delay={0.3} />
          </div>
        </div>

        {/* Right Section (1/3) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 border-accent/10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest italic flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" /> CHALLENGE TIERS
              </h3>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-3">
              <LevelCard level="01" title="NEURAL SYNC" description="Basic reaction testing protocol for stability check." delay={0.1} />
              <LevelCard level="02" title="COGNITIVE SHIELD" description="Sustained pattern recognition under low flux." active delay={0.2} />
              <LevelCard level="03" title="VANGUARD FOCUS" description="High-intensity reflex mapping for advanced monitoring." delay={0.3} />
            </div>
            <button className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent font-bold text-xs rounded-xl border border-accent/30 transition-all uppercase tracking-widest italic">
              EXPLORE PROTOCOLS
            </button>
          </div>

          <div className="flex-1 glass-card p-6 border-accent/10 flex flex-col gap-6">
             <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest italic">ANOMALY LOGS</h3>
              <span className="text-[10px] text-accent font-bold cursor-pointer hover:underline">VIEW ALL</span>
            </div>
            <div className="flex flex-col gap-1 flex-1 overflow-auto">
              <HistoryCard date="TODAY, 10:24" test="Reflex Arena" result="242ms" status="optimal" delay={0.1} />
              <HistoryCard date="YEST, 18:15" test="Pattern Lock" result="Slow Rev" status="low" delay={0.2} />
              <HistoryCard date="APR 04, 09:30" test="Reflex Arena" result="258ms" status="optimal" delay={0.3} />
              <HistoryCard date="APR 03, 21:00" test="Focus Streak" result="410ms" status="critical" delay={0.4} />
            </div>
            <div className="mt-auto p-4 rounded-xl bg-accent/10 border border-accent/20">
               <p className="text-xs font-bold text-foreground mb-1 italic">SYSTEM BRIEFING</p>
               <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                 Your neural response time is currently <span className="text-accent">STABLE</span>. Clinical data suggests your metabolic profile is in balance.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NavLinkItem = ({ text, active }: { text: string; active?: boolean }) => (
  <a href="#" className={cn("text-[10px] font-black tracking-widest transition-colors", active ? "text-accent" : "text-muted-foreground hover:text-foreground")}>
    {text}
  </a>
);
