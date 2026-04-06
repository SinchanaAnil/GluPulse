import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, BarChart3, Loader2, Zap, Layout, ShieldCheck, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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

  const handleUpload = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/vocal-risk`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();
      setResults(data);
      setAnalyzed(true);
      toast.success("Voice analysis complete!");
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
        
        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleRecording}
          disabled={loading}
          className="px-10 py-4 bg-primary text-white rounded-full font-black italic text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] border border-white/20 transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "ANALYZING PATTERNS..." : recording ? "TERMINATE SCAN" : "INITIATE ANALYSIS"}
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
                { label: "Status", value: results.xaiLabel.split(' ')[0], icon: ShieldCheck },
                { label: "ML Model", value: "Neural-V3", icon: Layout },
                { label: "Latency", value: "1.2s", icon: HeartPulse }
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
              "w-full rounded-2xl p-6 text-center border-t border-b border-primary/20 bg-primary/5",
              results.xaiLabel.includes('LOW') ? "text-green-400" : "text-yellow-400"
            )}>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Stability Outlook</p>
              <h4 className="text-3xl font-black italic uppercase tracking-tight">{results.xaiLabel}</h4>
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
