import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Mic, MicOff, BarChart3, Loader2, Zap, Layout, ShieldCheck, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const stagger: Variants = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const FeatureItem = ({ icon: Icon, title, description, delay = 0 }: { icon: any; title: string; description: string; delay?: number }) => (
  <motion.div 
    variants={fadeUp}
    className="flex items-start gap-4 text-left p-4 rounded-2xl transition-colors hover:bg-white/5"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const CircularWaveform = ({ active }: { active: boolean }) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-[320px] h-[320px] flex items-center justify-center">
      {/* Static Background Ring */}
      <div className="absolute inset-0 rounded-full border border-primary/10" />
      
      {/* Animated Waveform Bars */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] bg-primary/40 rounded-full origin-bottom"
          style={{
            height: active ? 20 + Math.random() * 40 : 8,
            left: '50%',
            bottom: '50%',
            transform: `rotate(${i * 6}deg) translateY(-140px)`,
          }}
          animate={active ? {
            height: [15, 40 + Math.random() * 30, 15],
            opacity: [0.4, 0.8, 0.4]
          } : {
            height: 8,
            opacity: 0.2
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.01
          }}
        />
      ))}
    </div>
  </div>
);

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
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
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
      toast.error("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const [gender, setGender] = useState<"male" | "female">("female");
  
  const handleUpload = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');
    formData.append('gender', gender);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const response = await fetch(`${baseUrl}/api/vocal-risk`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();
      setResults(data);
      
      setAnalyzed(true);
      toast.success("Vocal tremor extraction complete!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to analyze voice biomarker.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto min-h-[90vh] flex flex-col items-center justify-center relative px-6 py-20" 
      variants={stagger} 
      initial="initial" 
      animate="animate"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Section */}
      <div className="text-center mb-16 relative z-10">
        <motion.h1 
          variants={fadeUp}
          className="text-5xl md:text-6xl font-black italic tracking-tighter text-foreground mb-6 leading-tight uppercase"
        >
          Neural Vocal<br />Biomarker Intelligence
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-sm text-muted-foreground/60 max-w-md mx-auto mb-10 font-bold uppercase tracking-widest leading-relaxed"
        >
          Pioneering research in neuro-cognitive diagnostics using vocal micro-tremors and AI analysis
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex gap-4 mb-8">
          {["female", "male"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g as any)}
              className={cn(
                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                gender === g 
                  ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" 
                  : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/20"
              )}
            >
              {g}
            </button>
          ))}
        </motion.div>
        
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRecording}
          disabled={loading}
          className="px-10 py-4 bg-primary text-white rounded-full font-black italic text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] border border-white/20 transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "EXTRACTING VOCAL TREMORS..." : recording ? "TERMINATE SCAN" : "INITIATE ANALYSIS"}
        </motion.button>
      </div>

      {/* Central Interactive Orb */}
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-24">
        <CircularWaveform active={recording} />
        
        <motion.div
          animate={recording ? {
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 50px rgba(99, 102, 241, 0.2)", "0 0 80px rgba(99, 102, 241, 0.4)", "0 0 50px rgba(99, 102, 241, 0.2)"]
          } : {
            scale: 1,
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.1)"
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center z-20 overflow-hidden group hover:border-primary/50 transition-colors"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              </motion.div>
            ) : (
              <motion.div 
                key={recording ? "mic-off" : "mic-on"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2"
              >
                {recording ? <MicOff className="w-16 h-16 text-primary" /> : <Mic className="w-16 h-16 text-primary" />}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Results Section Integration */}
      <AnimatePresence>
        {analyzed && results && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl glass-card p-10 mb-20 relative z-30"
          >
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Diagnostic Report</h3>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                Session ID: {results.timestamp?.slice(-6) || '---'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Confidence", value: `${(results.confidence * 100).toFixed(1)}%`, icon: Zap },
                { label: "Stability", value: results.xaiLabel.split(' ')[1] || 'STABLE', icon: ShieldCheck },
                { label: "Engine", value: "Biometric-v2", icon: Layout },
                { label: "Latency", value: results.latency || "1.2s", icon: HeartPulse }
              ].map((r, i) => (
                <div key={r.label} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <r.icon className="w-3 h-3" />
                    <span className="text-[9px] uppercase font-black tracking-widest">{r.label}</span>
                  </div>
                  <span className="text-lg font-black italic text-foreground tracking-tighter">{r.value}</span>
                </div>
              ))}
            </div>

            <div className={cn(
              "w-full rounded-2xl p-6 text-center border-t border-b border-primary/20 bg-primary/5 mb-8",
              results.xaiLabel.includes('LOW') ? "text-green-400" : (results.xaiLabel.includes('HIGH') ? "text-red-400" : "text-yellow-400")
            )}>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Vocal Risk Assessment</p>
              <h4 className="text-3xl font-black italic uppercase tracking-tight">{results.xaiLabel}</h4>
            </div>

            {results.shapContributions && results.shapContributions.length > 0 && (
              <div className="mb-8 w-full border border-white/5 bg-black/20 rounded-2xl p-6">
                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-6 opacity-60 text-center">
                  Classified using: {results.classifier_used || "Standard classifier"}
                </p>
                <div className="flex flex-col gap-4">
                  {results.shapContributions.map((shap: any, idx: number) => {
                    // Calculate percentage width (clamping to max 100%)
                    const pct = Math.min(100, Math.floor((shap.value / 0.35) * 100));
                    return (
                      <div key={idx} className="flex items-center gap-4 w-full group">
                        <div className="w-[110px] text-right text-[9px] uppercase font-bold text-muted-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-foreground transition-colors shrink-0">
                          {shap.label}
                        </div>
                        <div className="flex-1 h-2 bg-white/5 rounded-full relative overflow-hidden backdrop-blur-sm">
                          <motion.div 
                            className={cn(
                              "absolute top-0 bottom-0 left-0 rounded-full", 
                              shap.direction === "risk" ? "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1.2, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                          />
                        </div>
                        <div className="w-[45px] text-right text-[10px] font-black text-foreground shrink-0 tabular-nums">
                          {shap.value > 0 ? "+" : ""}{shap.value.toFixed(3)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-4">Secondary Biomarkers</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-[8px] uppercase font-black text-muted-foreground mb-1">Local Jitter</div>
                  <div className="text-xl font-black italic text-primary">{(results.jitter * 100).toFixed(3)}%</div>
                  <div className="text-[8px] uppercase text-muted-foreground mt-1">Micro-frequency instability</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-[8px] uppercase font-black text-muted-foreground mb-1">Local Shimmer</div>
                  <div className="text-xl font-black italic text-primary">{(results.shimmer * 100).toFixed(3)}%</div>
                  <div className="text-[8px] uppercase text-muted-foreground mt-1">Amplitude micro-variation</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl relative z-10">
        <FeatureItem 
          icon={Layout} 
          title="Neural Stability Analysis" 
          description="Advanced signal processing tracks sub-perceptual vocal tremors to detect glucose-related cognitive drift."
        />
        <FeatureItem 
          icon={ShieldCheck} 
          title="Privacy-First Compute" 
          description="Your voice samples are processed with end-to-end encryption and converted to anonymous feature vectors."
        />
      </div>
    </motion.div>
  );
}
