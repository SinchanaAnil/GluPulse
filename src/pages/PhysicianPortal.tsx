import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

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
    <div className="space-y-6">
      <motion.div {...fadeUp} className="glass-card p-6">
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
            <tbody>
              {auditData.map((row, i) => (
                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{row.timestamp}</td>
                  <td className="py-3 px-4 text-foreground">{row.event}</td>
                  <td className={`py-3 px-4 font-medium ${riskColor(row.risk)}`}>{row.risk}</td>
                  <td className="py-3 px-4 text-muted-foreground">{row.action}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
