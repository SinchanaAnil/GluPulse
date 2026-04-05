import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, BarChart3, AudioWaveform } from "lucide-react";

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

export default function VoiceBiomarker() {
  const [recording, setRecording] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleToggle = () => {
    if (recording) {
      setRecording(false);
      setTimeout(() => setAnalyzed(true), 800);
    } else {
      setRecording(true);
      setAnalyzed(false);
    }
  };

  return (
    <motion.div className="max-w-2xl mx-auto space-y-6" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp} className="glass-card p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Neural Vocal Biomarker</h2>
        <p className="text-sm text-muted-foreground mb-8">Record a 5-second voice sample to analyze vocal micro-tremors indicative of hypoglycemia.</p>

        <motion.button
          onClick={handleToggle}
          whileTap={{ scale: 0.93 }}
          className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 ${
            recording
              ? "bg-secondary/20 text-secondary animate-pulse-glow ring-4 ring-secondary/30"
              : "bg-primary/15 text-primary hover:bg-primary/25"
          }`}
        >
          {recording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
        </motion.button>
        <p className="mt-4 text-sm text-muted-foreground">
          {recording ? "Recording... tap to stop" : "Tap to start recording"}
        </p>

        {recording && (
          <motion.div
            className="mt-6 flex justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-secondary/60"
                animate={{ height: [8, 12 + Math.random() * 24, 8] }}
                transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Analysis Results</h3>
            </div>
            {[
              { label: "Pitch Variation", value: "12.4 Hz", status: "Normal" },
              { label: "Jitter", value: "0.8%", status: "Normal" },
              { label: "MFCC Summary", value: "Stable", status: "No anomalies" },
            ].map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">{r.value}</span>
                  <span className="ml-2 text-xs text-success">{r.status}</span>
                </div>
              </motion.div>
            ))}
            <motion.div
              className="mt-4 rounded-lg bg-success/10 p-3 text-center glow-border-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-sm font-medium text-success">Risk Level: Low</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
