import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const quickPrompts = ["I feel shaky", "I skipped lunch", "What should I eat?"];

const botResponses: Record<string, string> = {
  "I feel shaky": "Shakiness can be an early sign of low blood sugar. Your last recorded glucose was 85 mg/dL at 4:00 PM. I recommend eating a fast-acting carb like juice or glucose tablets, and retaking your glucose in 15 minutes.",
  "I skipped lunch": "Missing meals increases hypoglycemia risk. Your risk score has been elevated by +2 points. I suggest eating a balanced snack with protein and complex carbs within the next 30 minutes.",
  "What should I eat?": "Based on your current glucose trend (85 mg/dL, slightly declining), I'd recommend: a banana with peanut butter, or whole grain crackers with cheese. This provides ~30g carbs with sustained release.",
};

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl px-4 py-3 bg-muted/50 flex items-center gap-1.5">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

const msgVariants = {
  user: { initial: { opacity: 0, x: 20, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, scale: 0.95 } },
  assistant: { initial: { opacity: 0, x: -20, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, scale: 0.95 } },
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your GluPulse AI assistant. I can help you understand your glucose patterns, suggest meals, and provide real-time guidance. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = botResponses[text] || "I've analyzed your recent data. Your vitals are currently stable. Keep monitoring your glucose levels and don't skip meals. Would you like me to run a voice check or reflex test?";
      setTyping(false);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 1200);
  };

  return (
    <motion.div
      className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm">GluPulse AI Assistant</h2>
              <span className="text-xs text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Online
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((m, i) => {
              const v = msgVariants[m.role];
              return (
                <motion.div
                  key={i}
                  variants={v}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
              );
            })}
          </AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <TypingIndicator />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {quickPrompts.map((p) => (
              <button key={p} onClick={() => send(p)} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 btn-press">
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
              className="flex-1 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            <button onClick={() => send(input)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-press">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
