import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

type Message = { role: "user" | "assistant"; content: string };

const quickPrompts = ["I feel shaky", "I skipped lunch", "What should I eat?"];

const botResponses: Record<string, string> = {
  "I feel shaky": "Shakiness can be an early sign of low blood sugar. Your last recorded glucose was 85 mg/dL at 4:00 PM. I recommend eating a fast-acting carb like juice or glucose tablets, and retaking your glucose in 15 minutes.",
  "I skipped lunch": "Missing meals increases hypoglycemia risk. Your risk score has been elevated by +2 points. I suggest eating a balanced snack with protein and complex carbs within the next 30 minutes.",
  "What should I eat?": "Based on your current glucose trend (85 mg/dL, slightly declining), I'd recommend: a banana with peanut butter, or whole grain crackers with cheese. This provides ~30g carbs with sustained release.",
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your GluPulse AI assistant. I can help you understand your glucose patterns, suggest meals, and provide real-time guidance. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const response = botResponses[text] || "I've analyzed your recent data. Your vitals are currently stable. Keep monitoring your glucose levels and don't skip meals. Would you like me to run a voice check or reflex test?";
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      <motion.div {...fadeUp} className="glass-card flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">GluPulse AI Assistant</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-primary/20 text-foreground"
                  : "bg-muted/50 text-foreground"
              }`}>
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {quickPrompts.map((p) => (
              <button key={p} onClick={() => send(p)} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                {p}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about your health..."
              className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <button onClick={() => send(input)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
