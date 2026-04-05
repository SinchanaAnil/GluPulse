import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, BarChart3 } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

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
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div {...fadeUp} className="glass-card p-8 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">Neural Vocal Biomarker</h2>
        <p className="text-sm text-muted-foreground mb-8">Record a 5-second voice sample to analyze vocal micro-tremors indicative of hypoglycemia.</p>

        <button
          onClick={handleToggle}
          className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 ${
            recording
              ? "bg-secondary/20 text-secondary animate-pulse-glow glow-border-primary ring-4 ring-secondary/30"
              : "bg-primary/15 text-primary hover:bg-primary/25"
          }`}
        >
          {recording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          {recording ? "Recording... tap to stop" : "Tap to start recording"}
        </p>
      </motion.div>

      {analyzed && (
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Analysis Results</h3>
          </div>
          {[
            { label: "Pitch Variation", value: "12.4 Hz", status: "Normal" },
            { label: "Jitter", value: "0.8%", status: "Normal" },
            { label: "MFCC Summary", value: "Stable", status: "No anomalies" },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <div className="text-right">
                <span className="text-sm font-medium text-foreground">{r.value}</span>
                <span className="ml-2 text-xs text-success">{r.status}</span>
              </div>
            </div>
          ))}
          <div className="mt-4 rounded-lg bg-success/10 p-3 text-center">
            <span className="text-sm font-medium text-success">Risk Level: Low</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
