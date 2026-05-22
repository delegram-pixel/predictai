"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  BrainCircuit,
  Sparkles,
  X,
  Search,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { GlowCard, RiskBadge, ActionButton } from "@/components/ui/primitives";
import { appointments, type Appointment } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// ─── Canned AI Responses ──────────────────────────────────────────────────────
function generateResponse(input: string, context: Appointment | null): string {
  const q = input.toLowerCase();

  if (context) {
    const riskLabel = context.riskLevel === "HIGH" ? "high" : context.riskLevel === "MEDIUM" ? "moderate" : "low";
    const contextIntro = `Regarding **${context.client}** (${context.service} at ${context.time}): `;

    if (q.includes("risk")) {
      return (
        contextIntro +
        `The no-show risk is **${context.risk}%** — rated ${riskLabel}. Key contributing factors include: ${context.factors.join(", ")}. ` +
        `My recommended action is **${context.recommendation.replace(/_/g, " ")}** to reduce the likelihood of a no-show.`
      );
    }
    if (q.includes("action") || q.includes("should")) {
      return (
        contextIntro +
        `Based on the ${riskLabel} risk score of ${context.risk}%, I recommend **${context.recommendation.replace(/_/g, " ")}**. ` +
        `This typically reduces no-show probability by 18–25% for clients with this risk profile.`
      );
    }
    if (q.includes("pattern") || q.includes("factor")) {
      return (
        contextIntro +
        `The factors driving this risk score are: **${context.factors.join("**, **")}**. ` +
        `Clients with same-day bookings and no prior history are 3.2× more likely to no-show. ` +
        `A confirmation message sent 2 hours before reduces that significantly.`
      );
    }
    return (
      contextIntro +
      `This appointment has a **${context.risk}% no-show risk** (${riskLabel}). ` +
      `The status is currently **${context.status}** and the confidence in this prediction is ${context.confidence}. ` +
      `Let me know if you'd like a breakdown of factors or a specific action recommendation.`
    );
  }

  if (q.includes("risk") && q.includes("marcus")) {
    return (
      "**Marcus Webb** has the highest no-show risk today at **87%**. He's a first-time client with a same-day booking — two of the strongest predictors of no-shows. " +
      "I recommend a **personal call** before 8:30 AM. Select his appointment on the left for the full breakdown."
    );
  }
  if (q.includes("action") || q.includes("today")) {
    return (
      "There are **3 appointments** needing action today:\n\n" +
      "• **Marcus Webb** (87% risk) → Personal call recommended\n" +
      "• **Ava Chen** (74% risk) → Require prepayment\n" +
      "• **Priya Nair** (62% risk) → SMS confirmation sent ✓\n\n" +
      "Jordan Blake's confirmation was also delivered. You're in good shape for today's schedule."
    );
  }
  if (q.includes("pattern") || q.includes("cancel") || q.includes("increase")) {
    return (
      "The top patterns that increase cancellation risk are:\n\n" +
      "1. **Same-day bookings** — 3.2× higher no-show rate\n" +
      "2. **First-time clients** — 2.8× baseline risk\n" +
      "3. **Monday mornings & Friday afternoons** — highest drift periods\n" +
      "4. **Prior no-show history** — strongest single predictor\n\n" +
      "Clients who prepay or book 5+ days in advance show a 41% lower no-show rate."
    );
  }
  if (q.includes("call") || q.includes("text") || q.includes("sms")) {
    return (
      "For **high-risk clients (>70%)** like Marcus Webb, a personal call outperforms SMS by ~22% in reducing no-shows. " +
      "For **medium-risk clients (30–70%)**, SMS confirmation is nearly as effective and scales better. " +
      "For **low-risk clients**, no action is typically needed — over-messaging can actually reduce future engagement."
    );
  }
  if (q.includes("accurate") || q.includes("accuracy") || q.includes("last week") || q.includes("prediction")) {
    return (
      "Last week's predictions achieved **83% overall accuracy** — up from 79% the previous week. " +
      "Precision was 77% and recall 76%. Of 9 flagged high-risk appointments, 7 resulted in actual no-shows or cancellations. " +
      "The model is improving as it learns from your clinic's specific booking patterns."
    );
  }

  return (
    "I'm your AI appointment assistant. I can help you:\n\n" +
    "• Analyze no-show risk for specific clients\n" +
    "• Recommend actions (call, SMS, prepayment)\n" +
    "• Explain the patterns driving a risk score\n" +
    "• Review prediction accuracy over time\n\n" +
    "Try selecting an appointment from the left panel or ask me something specific!"
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--accent-purple)", opacity: 0.9 }}
      >
        <BrainCircuit size={14} color="#fff" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--accent-purple)" }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isAI = message.role === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`flex items-end gap-3 mb-4 ${isAI ? "" : "flex-row-reverse"}`}
    >
      {isAI ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--accent-purple)", opacity: 0.9 }}
        >
          <BrainCircuit size={14} color="#fff" />
        </div>
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg, #7c5cbf, #a78bfa)" }}
        >
          U
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          isAI ? "rounded-bl-sm" : "rounded-br-sm"
        }`}
        style={
          isAI
            ? {
                background: "var(--card-bg)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(12px)",
                color: "var(--text-primary)",
              }
            : {
                background: "linear-gradient(135deg, #7c5cbf, #9d7de8)",
                color: "#fff",
              }
        }
        dangerouslySetInnerHTML={{
          __html: message.content
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br/>"),
        }}
      />
    </motion.div>
  );
}

// ─── Suggested Questions ──────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  "What's the risk for Marcus Webb?",
  "Which appointments need action today?",
  "What patterns increase cancellation risk?",
  "Should I call or text high-risk clients?",
  "How accurate were last week's predictions?",
];

// ─── Chat Page ────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm your AI appointment assistant. I can analyze no-show risk, recommend actions for specific clients, explain prediction patterns, and review accuracy trends.\n\nSelect an appointment from the left panel to give me context, or just ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredApts = appointments.filter(
    (a) =>
      a.client.toLowerCase().includes(query.toLowerCase()) ||
      a.service.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isTyping) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setIsTyping(true);

      setTimeout(() => {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: generateResponse(content, selectedApt),
          timestamp: new Date(),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
      }, 820);
    },
    [input, isTyping, selectedApt]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * 4 + 16;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      {/* ── Left Panel ─────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.05 }}
        className="w-72 flex flex-col flex-shrink-0 h-full overflow-hidden"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid var(--glass-border)",
        }}
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Appointment Context
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Select to add context to your query
          </p>
          {/* Search */}
          <div
            className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(124,92,191,0.07)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <Search size={13} style={{ color: "var(--text-muted)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients…"
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        {/* Appointment List */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {filteredApts.map((apt, i) => {
            const isSelected = selectedApt?.id === apt.id;
            return (
              <motion.button
                key={apt.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.04, type: "spring", stiffness: 260, damping: 22 }}
                onClick={() => setSelectedApt(isSelected ? null : apt)}
                className="w-full text-left px-3 py-2.5 rounded-xl mb-1.5 flex items-center gap-3 transition-all group"
                style={{
                  background: isSelected ? "var(--accent-purple-light)" : "transparent",
                  border: `1px solid ${isSelected ? "var(--accent-purple)" : "transparent"}`,
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: apt.avatar }}
                >
                  {apt.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="text-xs font-semibold truncate"
                      style={{ color: isSelected ? "var(--accent-purple)" : "var(--text-primary)" }}
                    >
                      {apt.client}
                    </span>
                    <RiskBadge level={apt.riskLevel} />
                  </div>
                  <div className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                    {apt.service} · {apt.time}
                  </div>
                </div>
                <ChevronRight
                  size={12}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: "var(--accent-purple)" }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Suggested Questions */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>
            Suggested Questions
          </p>
          <div className="flex flex-col gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <motion.button
                key={q}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 280, damping: 22 }}
                onClick={() => sendMessage(q)}
                className="text-left text-xs px-3 py-2 rounded-lg transition-all hover:scale-[1.01]"
                style={{
                  background: "rgba(124,92,191,0.07)",
                  border: "1px solid rgba(124,92,191,0.15)",
                  color: "var(--text-secondary)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* ── Main Chat Area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TopBar */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-b flex-shrink-0"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            borderColor: "var(--glass-border)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c5cbf, #a78bfa)" }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <h1
              className="text-base font-semibold leading-tight"
              style={{ color: "var(--text-primary)", fontFamily: "'Instrument Serif', serif" }}
            >
              AI Assistant
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Powered by Claude · context-aware
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div
          className="px-5 py-4 border-t flex-shrink-0"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(16px)",
            borderColor: "var(--glass-border)",
          }}
        >
          {/* Context pill */}
          <AnimatePresence>
            {selectedApt && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-center gap-2"
              >
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--accent-purple-light)",
                    color: "var(--accent-purple)",
                    border: "1px solid rgba(124,92,191,0.25)",
                  }}
                >
                  <MessageSquare size={11} />
                  Context: {selectedApt.client}
                  <button
                    onClick={() => setSelectedApt(null)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                  >
                    <X size={11} />
                  </button>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea + Send */}
          <div
            className="flex items-end gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about no-show risk, patterns, or actions…"
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm leading-6"
              style={{
                color: "var(--text-primary)",
                maxHeight: "112px",
                overflowY: "auto",
              }}
            />
            <ActionButton
              variant="primary"
              onClick={() => sendMessage()}
              small
            >
              <Send size={14} />
            </ActionButton>
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: "var(--text-muted)" }}>
            Press <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">Enter</kbd> to send ·{" "}
            <kbd className="px-1 py-0.5 rounded bg-gray-100 text-gray-500 font-mono text-[10px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
