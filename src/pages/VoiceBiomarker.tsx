import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeInOut" } },
};

export default function VoiceBiomarker() {
  const [recording, setRecording] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setAnalyzed(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Microphone access denied. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    try {
      console.log("[FRONTEND] Uploading audio to API...");
      const response = await fetch('http://localhost:5000/api/vocal-risk', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      console.log("[FRONTEND] Analysis result:", data);
      setResults(data);
      setAnalyzed(true);
      toast.success("Voice analysis complete!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to analyze voice biomarker. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  return (
    <motion.div className="max-w-2xl mx-auto space-y-6" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp} className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <BarChart3 className="h-24 w-24" />
        </div>
        
        <h2 className="text-lg font-semibold text-foreground mb-2">Neural Vocal Biomarker</h2>
        <p className="text-sm text-muted-foreground mb-8">Record a 5-second voice sample to analyze vocal micro-tremors indicative of hypoglycemia.</p>

        <motion.button
          onClick={toggleRecording}
          disabled={loading}
          whileTap={{ scale: 0.93 }}
          className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 shadow-lg ${
            recording
              ? "bg-red-500/20 text-red-500 animate-pulse ring-4 ring-red-500/30"
              : loading 
                ? "bg-primary/10 text-primary cursor-wait"
                : "bg-primary/15 text-primary hover:bg-primary/25"
          }`}
        >
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : recording ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </motion.button>
        
        <p className="mt-4 text-sm font-medium tracking-tight">
          {loading ? "Analyzing neural patterns..." : recording ? "Recording... tap to stop" : "Tap to start recording"}
        </p>

        {recording && (
          <motion.div
            className="mt-6 flex justify-center gap-1 h-8 items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-primary/60"
                animate={{ height: [4, 8 + Math.random() * 20, 4] }}
                transition={{ duration: 0.3 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.02 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {analyzed && results && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Analysis Results</h3>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Model: {results.features?.model}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Confidence Score", value: `${(results.confidence * 100).toFixed(1)}%` },
                { label: "Risk Probability", value: results.riskScore },
                { label: "Embedding Dim", value: results.features?.embedding_dim },
                { label: "Analysis Time", value: new Date(results.timestamp).toLocaleTimeString() }
              ].map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex flex-col p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <span className="text-[10px] uppercase text-muted-foreground font-bold mb-1">{r.label}</span>
                  <span className="text-sm font-medium text-foreground">{r.value}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className={`mt-4 rounded-xl p-4 text-center border-2 transition-all ${
                results.xaiLabel.includes('LOW') 
                  ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]" 
                  : results.xaiLabel.includes('MODERATE')
                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]"
                  : "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-lg font-bold tracking-tight">{results.xaiLabel}</span>
            </motion.div>

            <p className="text-[10px] text-center text-muted-foreground">
              Based on Colive Voice Study dataset. Reference: {results.features?.reference}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
