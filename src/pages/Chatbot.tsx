import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const CHAT_API_URL = "http://localhost:3001/api/chat";
const RISK_SCORE = 72;

export type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatApiResponse = {
  reply?: string;
  error?: string;
};

const QUICK_REPLIES = ["I feel shaky 😰", "I just ate 🍛", "Check my risk 📊"];

function stripLeadingAssistantMessages(messages: ChatMessage[]): ChatMessage[] {
  const next = [...messages];
  while (next.length > 0 && next[0].role === "assistant") {
    next.shift();
  }
  return next;
}

function isCriticalAlert(content: string): boolean {
  return content.includes("CRITICAL ALERT");
}

async function postChat(messages: ChatMessage[]): Promise<string> {
  const payloadMessages = stripLeadingAssistantMessages(messages).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const res = await fetch(CHAT_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: payloadMessages,
      riskScore: RISK_SCORE,
    }),
  });

  let data: ChatApiResponse = {};
  try {
    data = (await res.json()) as ChatApiResponse;
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error?.trim() || `Request failed (${res.status})`);
  }

  const reply = typeof data.reply === "string" ? data.reply.trim() : "";
  if (!reply) {
    throw new Error("Empty response from server.");
  }
  return reply;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm GluPulse Co-Pilot. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [awaiting, setAwaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingHistory, setPendingHistory] = useState<ChatMessage[] | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, awaiting, error]);

  async function fetchReply(historyAfterUser: ChatMessage[]) {
    setAwaiting(true);
    setError(null);
    setPendingHistory(null);
    try {
      const reply = await postChat(historyAfterUser);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setPendingHistory(historyAfterUser);
    } finally {
      setAwaiting(false);
    }
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || awaiting) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    void fetchReply(next);
  }

  function retry() {
    if (!pendingHistory || awaiting) return;
    void fetchReply(pendingHistory);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col gap-3 px-1">
      <div className="shrink-0 border-b border-border pb-3">
        <h1 className="text-lg font-semibold text-foreground">GluPulse Co-Pilot</h1>
        <p className="text-sm text-muted-foreground">Chat with your metabolic assistant</p>
      </div>

      <ScrollArea className="h-[min(100%,calc(100vh-16rem))] min-h-[200px] w-full rounded-lg border border-border">
        <div className="space-y-4 p-4">
          {messages.map((m, i) => {
            const critical = m.role === "assistant" && isCriticalAlert(m.content);
            return (
              <div
                key={`${m.role}-${i}`}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-foreground",
                    m.role === "user" && "bg-blue-100 dark:bg-blue-950/50",
                    m.role === "assistant" && !critical && "bg-gray-100 dark:bg-gray-800/80",
                    m.role === "assistant" &&
                      critical &&
                      "border-2 border-red-500 bg-gray-100 dark:bg-gray-800/80",
                  )}
                >
                  {critical && (
                    <div className="mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="text-xs font-semibold uppercase tracking-wide">Critical</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            );
          })}
          {awaiting && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {error && (
        <div className="flex shrink-0 flex-col gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <p>{error}</p>
          <div>
            <Button type="button" variant="outline" size="sm" onClick={retry} disabled={awaiting}>
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="flex shrink-0 gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Type a message…"
          disabled={awaiting}
          className="flex-1"
          autoComplete="off"
        />
        <Button type="button" size="icon" onClick={() => send(input)} disabled={awaiting || !input.trim()} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {QUICK_REPLIES.map((label) => (
          <Button key={label} type="button" variant="outline" size="sm" className="text-xs" onClick={() => send(label)} disabled={awaiting}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}