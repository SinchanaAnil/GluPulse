import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export interface ChatbotProps {
  riskScore?: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chatbot({ riskScore = 72 }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: `Hi! I'm your GluPulse Co-Pilot. Your current risk score is ${riskScore}/100. How are you feeling right now?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  const submitMessage = async (newMessages: Message[]) => {
    setIsLoading(true);
    setError(null);

    const conversationHistory = newMessages.slice(1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory, riskScore }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError("Failed to reach GluPulse server. Is the backend running?");
      }
    } catch (e) {
      setError("Failed to reach GluPulse server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setInput("");
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    submitMessage(nextMessages);
  };

  const handleRetry = () => {
    submitMessage(messages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <Card className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col gap-3 p-4">
      <ScrollArea className="flex-grow rounded-lg border border-border bg-background">
        <div className="space-y-4 p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === "user"
                    ? "bg-teal-600 text-white dark:bg-teal-700"
                    : "bg-gray-100 dark:bg-gray-800 text-foreground"
                  }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="shrink-0 flex flex-col gap-3">
        {error && (
          <div className="flex shrink-0 flex-col gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <p>{error}</p>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isLoading}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["I feel shaky \ud83d\udea8", "I just ate \ud83c\udf7d\ufe0f", "Check my risk \ud83d\udcca"].map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(reply);
                  handleSend(reply);
                }}
                disabled={isLoading}
                className="whitespace-nowrap rounded-full"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-h-[44px] max-h-32 resize-none flex-1"
            rows={1}
          />
          <Button
            type="button"
            size="icon"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            aria-label="Send"
            className="shrink-0 h-11 w-11"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}