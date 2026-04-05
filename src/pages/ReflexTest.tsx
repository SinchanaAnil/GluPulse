import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Timer, Target } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function ReflexTest() {
  const [phase, setPhase] = useState<"idle" | "waiting" | "ready" | "done">("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startGame = useCallback(() => {
    setPhase("waiting");
    setReactionTime(null);
    const delay = 2000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase("ready");
    }, delay);
  }, []);

  const handleTap = useCallback(() => {
    if (phase === "ready") {
      const time = Date.now() - startRef.current;
      setReactionTime(time);
      setPhase("done");
    } else if (phase === "waiting") {
      clearTimeout(timerRef.current);
      setPhase("idle");
    }
  }, [phase]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const status = reactionTime !== null
    ? reactionTime < 300 ? "Normal" : reactionTime < 500 ? "Slow" : "Impaired"
    : null;
  const statusColor = status === "Normal" ? "text-success" : status === "Slow" ? "text-warning" : "text-secondary";

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <motion.div {...fadeUp} className="glass-card p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Neuro-Cognitive Reflex Test</h2>
        <p className="text-sm text-muted-foreground mb-8">Tap as fast as possible when the signal turns cyan. Slow reactions may indicate low glucose.</p>

        <button
          onClick={phase === "idle" || phase === "done" ? startGame : handleTap}
          className={`mx-auto flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 text-lg font-semibold ${
            phase === "waiting"
              ? "bg-secondary/20 text-secondary"
              : phase === "ready"
              ? "bg-primary/30 text-primary glow-border-primary animate-pulse-glow"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {phase === "idle" && <><Zap className="h-8 w-8" /></>}
          {phase === "waiting" && <span className="text-sm">Wait...</span>}
          {phase === "ready" && <span className="text-sm">TAP NOW!</span>}
          {phase === "done" && <span className="text-sm">Again?</span>}
        </button>

        {phase === "waiting" && <p className="mt-4 text-xs text-secondary">Don't tap yet! Wait for cyan...</p>}
      </motion.div>

      {phase === "done" && reactionTime !== null && (
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Timer className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-semibold text-foreground">{reactionTime}ms</p>
              <p className="text-xs text-muted-foreground">Reaction Time</p>
            </div>
            <div>
              <Target className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className={`text-2xl font-semibold ${statusColor}`}>{status}</p>
              <p className="text-xs text-muted-foreground">Status</p>
            </div>
            <div>
              <Zap className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-semibold text-foreground">{reactionTime < 500 ? "+0" : "+2"}</p>
              <p className="text-xs text-muted-foreground">Risk Points</p>
            </div>
          </div>
          {reactionTime >= 500 && (
            <div className="mt-4 rounded-lg bg-secondary/10 p-3 text-center">
              <span className="text-sm font-medium text-secondary">⚠ Slow reaction detected — risk score elevated</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
