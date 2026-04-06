import { motion } from "framer-motion";
import { Shield, Activity, Database, BrainCircuit } from "lucide-react";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};
const rowFade = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
};

const auditData = [
  { timestamp: "Today 3:14 PM", event: "Glucose dropped to 65 mg/dL", risk: 72, action: "SOS modal shown" },
  { timestamp: "Today 2:45 PM", event: "Reflex test: 520ms reaction", risk: 58, action: "Risk score +2" },
  { timestamp: "Today 12:00 PM", event: "Missed meal detected (>4h)", risk: 45, action: "Push notification sent" },
  { timestamp: "Today 8:30 AM", event: "Voice biomarker: normal", risk: 12, action: "No action" },
  { timestamp: "Yesterday 10 PM", event: "Sleep deficit: 5.2h", risk: 30, action: "Risk score +1" },
  { timestamp: "Yesterday 6 PM", event: "Post-meal glucose: 160", risk: 15, action: "Logged" },
];

const riskColor = (r: number) => r >= 60 ? "text-rose-500" : r >= 30 ? "text-orange-500" : "text-emerald-500";

export default function PhysicianPortal() {
  return (
    <motion.div 
      className="p-8 space-y-8 max-w-6xl mx-auto" 
      variants={stagger} 
      initial="initial" 
      animate="animate"
    >
      <div className="flex flex-col md:flex-row items-baseline justify-between gap-4">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Physician Vault</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Clinical Audit & ML Transparency Engine</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Audit Table */}
        <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
             </div>
             <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Clinical Audit Log</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                  <th className="py-4 px-2">Timestamp</th>
                  <th className="py-4 px-2">Event</th>
                  <th className="py-4 px-2 text-center">Risk</th>
                  <th className="py-4 px-2 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody>
                {auditData.map((row, i) => (
                  <motion.tr
                    key={i}
                    variants={rowFade}
                    className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="py-4 px-2 text-[11px] font-bold text-zinc-500">{row.timestamp}</td>
                    <td className="py-4 px-2 text-[13px] font-bold text-zinc-200">{row.event}</td>
                    <td className={`py-4 px-2 text-[13px] font-black text-center ${riskColor(row.risk)}`}>{row.risk}</td>
                    <td className="py-4 px-2 text-[11px] font-bold text-zinc-600 text-right uppercase tracking-tighter">{row.action}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ML Transparency Card */}
        <div className="space-y-6">
          <motion.div variants={fadeUp} className="glass-card p-8 bg-primary/5 border-primary/20">
             <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-black italic uppercase tracking-tight text-white">ML Intelligence</h2>
             </div>
             
             <div className="space-y-6">
                <div>
                   <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-3">Feature Weights (Ensemble)</p>
                   <div className="space-y-4">
                      {[
                        { label: "Synaptic Latency", weight: 40, color: "bg-primary" },
                        { label: "Acoustic Jitter", weight: 35, color: "bg-orange-500" },
                        { label: "Amplitude Shimmer", weight: 25, color: "bg-blue-500" }
                      ].map((f) => (
                        <div key={f.label} className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-black uppercase italic">
                              <span className="text-zinc-200">{f.label}</span>
                              <span className="text-primary">{f.weight}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${f.weight}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full ${f.color}`}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-3">Model Architecture</p>
                   <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 space-y-2">
                      <div className="flex items-center gap-2">
                         <Database className="w-3 h-3 text-zinc-600" />
                         <span className="text-[10px] font-bold text-zinc-400">1D-CNN + Gradient Boosting</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Activity className="w-3 h-3 text-zinc-600" />
                         <span className="text-[10px] font-bold text-zinc-400">Real-time Inference (HOG)</span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Clinical Intervention Panel */}
          <motion.div variants={fadeUp} className="glass-card p-8 border-rose-500/20">
             <h3 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-4 italic">Emergency Override</h3>
             <button className="w-full py-4 bg-rose-600 text-white font-black italic uppercase tracking-widest rounded-2xl hover:bg-rose-500 active:scale-95 transition-all shadow-xl shadow-rose-900/40">
                Remote Intervention
             </button>
             <p className="text-[9px] text-zinc-600 font-bold text-center mt-3 uppercase tracking-tighter">Forces SOS sequence on device</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
