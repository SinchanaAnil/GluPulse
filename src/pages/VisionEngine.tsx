import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageIcon, Sparkles } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const fadeUp = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeInOut" } },
};

const simData = [
  { h: "0h", glucose: 110 }, { h: "0.5h", glucose: 135 }, { h: "1h", glucose: 160 },
  { h: "1.5h", glucose: 145 }, { h: "2h", glucose: 120 }, { h: "2.5h", glucose: 100 },
  { h: "3h", glucose: 90 }, { h: "3.5h", glucose: 85 }, { h: "4h", glucose: 88 },
];

export default function VisionEngine() {
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  return (
    <motion.div className="max-w-3xl mx-auto space-y-6" initial="initial" animate="animate">
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">Vision-to-Simulation Engine</h2>
        <p className="text-sm text-muted-foreground mb-6">Upload a meal photo to estimate carb content and simulate glucose response.</p>

        <motion.div
          onClick={() => setUploaded(true)}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); setUploaded(true); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
            dragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className={`h-10 w-10 mx-auto mb-3 transition-colors ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-muted-foreground">Click or drag to upload a food image</p>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {uploaded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">AI Analysis</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="rounded-lg bg-muted/50 p-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-xs text-muted-foreground">Food Detected</p>
                  <p className="text-lg font-medium text-foreground mt-1">Pasta with Tomato Sauce</p>
                </motion.div>
                <motion.div
                  className="rounded-lg bg-muted/50 p-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-xs text-muted-foreground">Estimated Carbs</p>
                  <p className="text-lg font-medium text-primary mt-1">62g</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Predicted Glucose Curve (4h)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simData}>
                    <defs>
                      <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(263, 84%, 52%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(263, 84%, 52%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 30%, 20%)" />
                    <XAxis dataKey="h" stroke="hsl(215, 20%, 45%)" fontSize={12} />
                    <YAxis stroke="hsl(215, 20%, 45%)" fontSize={12} domain={[60, 180]} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(220, 40%, 14%)", border: "1px solid hsl(220, 30%, 22%)", borderRadius: "12px", color: "hsl(210, 30%, 92%)" }} />
                    <Area type="monotone" dataKey="glucose" stroke="hsl(263, 84%, 52%)" fill="url(#simGrad)" strokeWidth={2} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
