import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

const data = [
  { time: "6AM", glucose: 95, insulin: 5, steps: 200 },
  { time: "7AM", glucose: 88, insulin: 4, steps: 800 },
  { time: "8AM", glucose: 140, insulin: 12, steps: 1200 },
  { time: "9AM", glucose: 120, insulin: 8, steps: 600 },
  { time: "10AM", glucose: 105, insulin: 6, steps: 400 },
  { time: "11AM", glucose: 90, insulin: 5, steps: 300 },
  { time: "12PM", glucose: 85, insulin: 4, steps: 200 },
  { time: "1PM", glucose: 150, insulin: 14, steps: 500 },
  { time: "2PM", glucose: 130, insulin: 10, steps: 700 },
  { time: "3PM", glucose: 65, insulin: 3, steps: 100 },
  { time: "4PM", glucose: 78, insulin: 6, steps: 1500 },
  { time: "5PM", glucose: 110, insulin: 7, steps: 2000 },
  { time: "6PM", glucose: 125, insulin: 9, steps: 800 },
];

const annotations = [
  { time: "3PM", label: "⚠ Missed meal — glucose dropped to 65", color: "text-secondary" },
  { time: "4PM", label: "🏃 High activity — 1500 steps", color: "text-primary" },
  { time: "11AM", label: "💤 Sleep deficit flagged (5.2h last night)", color: "text-warning" },
];

export default function Timeline() {
  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Explainable Timeline</h2>
        <p className="text-sm text-muted-foreground mb-6">Multi-data overlay with auto-annotations for clinical context.</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 20%)" />
              <XAxis dataKey="time" stroke="hsl(215, 20%, 45%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 45%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(220, 40%, 14%)", border: "1px solid hsl(220, 30%, 22%)", borderRadius: "12px", color: "hsl(210, 30%, 92%)" }} />
              <Legend />
              <Line type="monotone" dataKey="glucose" stroke="hsl(187, 100%, 50%)" strokeWidth={2} dot={false} animationDuration={2000} />
              <Line type="monotone" dataKey="insulin" stroke="hsl(263, 84%, 52%)" strokeWidth={2} dot={false} animationDuration={2000} animationBegin={300} />
              <Line type="monotone" dataKey="steps" stroke="hsl(142, 70%, 45%)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" animationDuration={2000} animationBegin={600} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Auto-Annotations</h3>
        <div className="space-y-3">
          {annotations.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="flex items-start gap-3 py-2 border-b border-border last:border-0"
            >
              <span className="text-xs text-muted-foreground w-12 shrink-0 pt-0.5">{a.time}</span>
              <span className={`text-sm ${a.color}`}>{a.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
