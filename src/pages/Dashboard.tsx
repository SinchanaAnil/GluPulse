import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Droplet, ShieldAlert } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const chartData = [
  { time: "6AM", glucose: 95, activity: 5 },
  { time: "8AM", glucose: 138, activity: 15 },
  { time: "10AM", glucose: 110, activity: 20 },
  { time: "12PM", glucose: 90, activity: 10 },
  { time: "2PM", glucose: 95, activity: 35 },
  { time: "4PM", glucose: 105, activity: 25 },
  { time: "6PM", glucose: 120, activity: 30 },
  { time: "8PM", glucose: 110, activity: 10 },
  { time: "10PM", glucose: 95, activity: 5 },
];

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

function GaugeCard({ title, value, unit, status, icon: Icon, color, range, percentage }: any) {
  const dashArray = (percentage / 100) * 251.2;
  
  return (
    <motion.div variants={fadeUp} className="glass-card p-5 flex flex-col justify-between h-full min-h-[160px]">
      <div className="flex items-center justify-between mb-2">
        <Icon className={cn("h-[18px] w-[18px]", color)} />
      </div>
      <div className="flex justify-center relative my-1">
        <svg fill="none" viewBox="0 0 100 100" className="w-[120px] h-[120px] rotate-[-90deg]">
          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="10" strokeLinecap="round" />
          <motion.circle
            cx="50" cy="50" r="40"
            stroke="#22C55E"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 251.2" }}
            animate={{ strokeDasharray: `${251.2 * (percentage/100)} 251.2` }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as any }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-[28px] font-extrabold text-foreground leading-none">{value}</span>
          <span className="text-[12px] text-muted-foreground font-medium mt-1">{unit}</span>
        </div>
      </div>
      <div className="text-center mt-1">
        <span className="text-[13px] font-bold uppercase tracking-wider text-[#22C55E] block">{status}</span>
        <div className="flex justify-between items-center mt-2 text-[11px] text-muted-foreground font-medium px-2">
          <span>{range[0]}</span>
          <span>{range[1]}</span>
        </div>
      </div>
    </motion.div>
  );
}

const tableData = [
  { id: 1, indicator: "SpO2", category: "Respiratory", low: "<95%", result: "99%", high: ">100%", status: "Perfect" },
  { id: 2, indicator: "Blood Pressure", category: "Cardiovascular", low: "<90/60", result: "120/80 mmHg", high: ">140/90", status: "Optimal" },
  { id: 3, indicator: "Heart Rate", category: "Cardiovascular", low: "<60 bpm", result: "72 bpm", high: ">100 bpm", status: "Stable" },
  { id: 4, indicator: "Glucose (Fast)", category: "Metabolic", low: "<70 mg/dL", result: "95 mg/dL", high: ">126 mg/dL", status: "Normal" },
  { id: 5, indicator: "Glucose (Meal)", category: "Metabolic", low: "<70 mg/dL", result: "138 mg/dL", high: ">180 mg/dL", status: "Normal" },
];

import { cn } from "@/lib/utils";

export default function Dashboard() {
  const profile = JSON.parse(localStorage.getItem("gluPulseProfile") || '{}');
  const isProfileIncomplete = !profile.fullName || !profile.physicianEmail || !profile.emergencyPhone;

  return (
    <div className="relative w-full min-h-screen pt-4">
      {/* Blinking Red Warning */}
      <AnimatePresence>
        {isProfileIncomplete && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="bg-rose-600 p-2 rounded-2xl flex items-center justify-center gap-2 border-2 border-white/50 shadow-2xl animate-pulse">
               <ShieldAlert className="w-5 h-5 text-white" />
               <span className="text-[10px] font-black italic uppercase text-white tracking-widest text-center">
                 ⚠️ EMERGENCY CONTACT NOT CONFIGURED
                 <a href="/profile" className="ml-2 underline text-white/80">FIX NOW</a>
               </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anatomical Figure - Pure Element */}
      <img 
        src="/assets/anatomical_figure.png" 
        alt="Anatomical Figure" 
        className="fixed left-[80px] top-[64px] h-[calc(100vh-64px)] w-auto max-w-[42%] object-contain object-top z-0 pointer-events-none select-none body-figure"
      />

      <motion.div 
        className="relative z-10 w-full flex justify-end pr-2"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <div className="w-full lg:w-[58%] flex flex-col gap-4">
          
          {/* Row 1: Heading + Patient Stats */}
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
            <h1 className="text-[56px] font-[800] text-foreground tracking-[-2px] leading-[1.0] font-sans">
              Medical<br />Dashboard
            </h1>
            
            <div className="flex gap-2.5">
              {[
                { label: "BLOOD", value: "O+" },
                { label: "HEIGHT", value: "186 cm" },
                { label: "WEIGHT", value: "90 kg" }
              ].map((stat) => (
                <div key={stat.label} className="glass-card px-[18px] py-[10px] min-w-[100px]">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">{stat.label}</span>
                  <span className="text-[20px] font-bold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Row 2: 3 Metric Gauge Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GaugeCard 
              title="Heart Rate" value="72" unit="bpm" status="stable"
              icon={Heart} color="text-[#EF4444]" percentage={30} range={["60", "100"]}
            />
            <GaugeCard 
              title="Blood Pressure" value="120/80" unit="mmHg" status="optimal"
              icon={Activity} color="text-muted-foreground" percentage={80} range={["90/60", "140/90"]}
            />
            <GaugeCard 
              title="Glucose Level" value="95" unit="mg/dL" status="normal"
              icon={Droplet} color="text-[#06B6D4]" percentage={25} range={["70", "126"]}
            />
          </div>

          {/* Row 3: Activity & Glucose Trends */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-3">
                <h3 className="text-[15px] font-bold text-foreground">Activity & Glucose Trends</h3>
                <span className="text-[12px] text-muted-foreground">Today · 6AM – 10PM</span>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  <span className="text-[11px] font-bold text-foreground uppercase">Glucose</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                  <span className="text-[11px] font-bold text-foreground uppercase">Activity</span>
                </div>
              </div>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dx={-10} ticks={[0, 35, 70, 105, 140]} />
                  <Tooltip 
                    contentStyle={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px" }}
                  />
                  <Area type="monotone" dataKey="glucose" stroke="#06B6D4" strokeWidth={2.5} fill="transparent" />
                  <Area type="monotone" dataKey="activity" stroke="#F97316" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Row 4: Lab Indicators Table */}
          <motion.div variants={fadeUp} className="glass-card overflow-hidden">
            <div className="p-5 pb-3 border-b border-white/20">
              <h3 className="text-[15px] font-bold text-foreground">Lab Indicators</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Indicator</th>
                    <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</th>
                    <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Low</th>
                    <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">Result</th>
                    <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">High</th>
                    <th className="py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right pr-8">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-5 text-[13px] font-bold text-foreground">{row.indicator}</td>
                      <td className="py-4 px-5">
                        <span className="px-2 py-0.5 rounded-md bg-white/30 text-[10px] font-bold text-foreground uppercase border border-white/20">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[12px] font-medium text-muted-foreground text-center">{row.low}</td>
                      <td className="py-4 px-5 text-[13px] font-[800] text-foreground text-center">{row.result}</td>
                      <td className="py-4 px-5 text-[12px] font-medium text-muted-foreground text-center">{row.high}</td>
                      <td className="py-4 px-5 text-right pr-8">
                        <span className="px-3 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] text-[11px] font-bold uppercase tracking-wide border border-[#16A34A]/20 backdrop-blur-sm">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
