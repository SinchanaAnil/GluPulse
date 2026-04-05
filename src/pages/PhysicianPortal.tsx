import { motion } from "framer-motion";
import { Shield } from "lucide-react";

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

const riskColor = (r: number) => r >= 60 ? "text-secondary" : r >= 30 ? "text-warning" : "text-success";

export default function PhysicianPortal() {
  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      <motion.div variants={fadeUp} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Physician Audit Portal</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Event</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Risk Score</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Action Taken</th>
              </tr>
            </thead>
            <motion.tbody variants={stagger}>
              {auditData.map((row, i) => (
                <motion.tr
                  key={i}
                  variants={rowFade}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors duration-200 cursor-default"
                >
                  <td className="py-3 px-4 text-muted-foreground">{row.timestamp}</td>
                  <td className="py-3 px-4 text-foreground">{row.event}</td>
                  <td className={`py-3 px-4 font-medium ${riskColor(row.risk)}`}>{row.risk}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.action}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
