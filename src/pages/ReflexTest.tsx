import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer, Target } from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

function ResultPanel({ reactionTime }: { reactionTime: number }) {
  const animatedTime = useCountUp(reactionTime, 800);
  const status = reactionTime < 300 ? "Normal" : reactionTime < 500 ? "Slow" : "Impaired";
  const statusColor = status === "Normal" ? "text-success" : status === "Slow" ? "text-warning" : "text-secondary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <Timer className="h-5 w-5 mx-auto text-primary mb-2 hover-icon-scale" />
          <p className="text-2xl font-semibold text-foreground tabular-nums">{animatedTime}ms</p>
          <p className="text-xs text-muted-foreground">Reaction Time</p>
        </div>
        <div>
          <Target className="h-5 w-5 mx-auto text-primary mb-2 hover-icon-scale" />
          <p className={`text-2xl font-semibold ${statusColor}`}>{status}</p>
          <p className="text-xs text-muted-foreground">Status</p>
        </div>
        <div>
          <Zap className="h-5 w-5 mx-auto text-primary mb-2 hover-icon-scale" />
          <p className="text-2xl font-semibold text-foreground">{reactionTime < 500 ? "+0" : "+2"}</p>
          <p className="text-xs text-muted-foreground">Risk Points</p>
        </div>
      </div>
      <AnimatePresence>
        {reactionTime >= 500 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-lg bg-secondary/10 p-3 text-center"
          >
            <span className="text-sm font-medium text-secondary">⚠ Slow reaction detected — risk score elevated</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

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
      setReactionTime(Date.now() - startRef.current);
      setPhase("done");
    } else if (phase === "waiting") {
      clearTimeout(timerRef.current);
      setPhase("idle");
    }
  }, [phase]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <motion.div className="max-w-xl mx-auto space-y-6" initial="initial" animate="animate">
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Neuro-Cognitive Reflex Test</h2>
        <p className="text-sm text-muted-foreground mb-8">Tap as fast as possible when the signal turns cyan.</p>

        <motion.button
          onClick={phase === "idle" || phase === "done" ? startGame : handleTap}
          whileTap={{ scale: 0.9 }}
          animate={phase === "ready" ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.6 } } : {}}
          className={`mx-auto flex h-40 w-40 items-center justify-center rounded-full transition-all duration-300 text-lg font-semibold ${
            phase === "waiting"
              ? "bg-secondary/20 text-secondary"
              : phase === "ready"
              ? "bg-primary/30 text-primary glow-border-primary"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {phase === "idle" && <Zap className="h-8 w-8" />}
          {phase === "waiting" && <span className="text-sm">Wait...</span>}
          {phase === "ready" && <span className="text-sm font-bold">TAP NOW!</span>}
          {phase === "done" && <span className="text-sm">Again?</span>}
        </motion.button>

        {phase === "waiting" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-secondary"
          >
            Don't tap yet! Wait for cyan...
          </motion.p>
        )}
      </motion.div>

      <AnimatePresence>
        {phase === "done" && reactionTime !== null && (
          <ResultPanel reactionTime={reactionTime} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
