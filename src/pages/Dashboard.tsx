import { motion } from "framer-motion";
import { Heart, Activity, Droplets, AlertTriangle, Mic, Camera, Zap, MessageCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useCountUp } from "@/hooks/use-count-up";

const chartData = [
  { time: "6AM", glucose: 95, activity: 20, risk: 10 },
  { time: "8AM", glucose: 140, activity: 40, risk: 15 },
  { time: "10AM", glucose: 110, activity: 60, risk: 8 },
  { time: "12PM", glucose: 85, activity: 50, risk: 20 },
  { time: "2PM", glucose: 65, activity: 30, risk: 45 },
  { time: "4PM", glucose: 78, activity: 70, risk: 30 },
  { time: "6PM", glucose: 120, activity: 45, risk: 12 },
  { time: "8PM", glucose: 105, activity: 25, risk: 10 },
  { time: "10PM", glucose: 90, activity: 10, risk: 8 },
];

const metrics = [
  { title: "Heart Rate", value: 72, unit: "bpm", status: "stable", icon: Heart, color: "text-secondary" },
  { title: "Blood Pressure", value: 120, extra: "/80", unit: "mmHg", status: "optimal", icon: Activity, color: "text-success" },
  { title: "SpO2", value: 99, unit: "%", status: "perfect", icon: Droplets, color: "text-primary" },
];

const quickActions = [
  { label: "Run Voice Check", icon: Mic, path: "/voice" },
  { label: "Upload Meal", icon: Camera, path: "/vision" },
  { label: "Start Reflex Test", icon: Zap, path: "/reflex" },
  { label: "Open Chatbot", icon: MessageCircle, path: "/chatbot" },
];

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeInOut" } },
};

function MetricCard({ m, index }: { m: typeof metrics[0]; index: number }) {
  const animatedValue = useCountUp(m.value, 1200, 200 + index * 150);

  return (
    <motion.div variants={fadeUp} className="glass-card-hover p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{m.title}</span>
        <m.icon className={`h-5 w-5 ${m.color} hover-icon-scale`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold text-foreground tabular-nums">{animatedValue}</span>
        {"extra" in m && <span className="text-3xl font-semibold text-foreground">{m.extra}</span>}
        <span className="text-sm text-muted-foreground">{m.unit}</span>
      </div>
      <span className={`mt-2 inline-block text-xs font-medium ${m.status === "stable" ? "text-primary" : m.status === "optimal" ? "text-success" : "text-primary"}`}>
        {m.status}
      </span>
    </motion.div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const animatedScore = useCountUp(score, 1500, 300);
  const dashLength = (score / 100) * 264;

  return (
    <div className="hidden md:flex h-24 w-24 items-center justify-center relative">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r="42" fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 264" }}
          animate={{ strokeDasharray: `${dashLength} 264` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <span className="absolute text-lg font-semibold text-foreground">{animatedScore}</span>
    </div>
  );
}

export default function Dashboard() {
  const riskScore = 24;
  const riskLevel = riskScore < 30 ? "Low" : riskScore < 60 ? "Moderate" : "High";
  const riskColor = riskScore < 30 ? "text-success" : riskScore < 60 ? "text-warning" : "text-secondary";

  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      {/* Risk Overview */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Hypoglycemia Risk Score</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-semibold ${riskColor} glow-text-primary tabular-nums`}>
                {useCountUp(riskScore, 1500, 200)}
              </span>
              <span className="text-lg text-muted-foreground">/ 100</span>
            </div>
            <motion.div
              className="mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${riskScore < 30 ? "bg-success/15 text-success" : riskScore < 60 ? "bg-warning/15 text-warning" : "bg-secondary/15 text-secondary"}`}>
                <AlertTriangle className="h-3 w-3" />
                {riskLevel} Risk
              </span>
              <span className="text-sm text-muted-foreground">All vitals within normal range. No alerts.</span>
            </motion.div>
          </div>
          <RiskGauge score={riskScore} />
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={stagger}>
        {metrics.map((m, i) => (
          <MetricCard key={m.title} m={m} index={i} />
        ))}
      </motion.div>

      {/* Activity Chart */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Activity & Glucose Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 100%, 65%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0, 100%, 65%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 20%)" />
              <XAxis dataKey="time" stroke="hsl(215, 20%, 45%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 45%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220, 40%, 14%)", border: "1px solid hsl(220, 30%, 22%)", borderRadius: "12px", color: "hsl(210, 30%, 92%)" }}
                cursor={{ stroke: "hsl(187, 100%, 50%)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="glucose" stroke="hsl(187, 100%, 50%)" fill="url(#glucoseGrad)" strokeWidth={2} animationDuration={2000} animationEasing="ease-out" />
              <Area type="monotone" dataKey="risk" stroke="hsl(0, 100%, 65%)" fill="url(#riskGrad)" strokeWidth={2} animationDuration={2000} animationEasing="ease-out" animationBegin={400} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger}>
        {quickActions.map((a) => (
          <motion.div key={a.label} variants={fadeUp}>
            <Link to={a.path} className="glass-card-hover p-4 flex flex-col items-center gap-3 text-center cursor-pointer block">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary hover-icon-scale">
                <a.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
