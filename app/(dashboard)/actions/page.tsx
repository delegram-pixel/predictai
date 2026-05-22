"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MessageSquare,
  CreditCard,
  Mail,
  Bell,
  RefreshCw,
  Check,
  X,
  Clock,
  Zap,
  ChevronRight,
  AlertTriangle,
  Users,
  Send,
} from "lucide-react";
import {
  GlowCard,
  ActionButton,
  RiskBadge,
  StatusChip,
  AnimatedCounter,
} from "@/components/ui/primitives";
import { pendingActions, appointments } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActionStatus = "pending" | "sent" | "delivered" | "failed";

interface ActionItem {
  id: string;
  aptId: string;
  client: string;
  initials: string;
  avatar: string;
  type: string;
  label: string;
  icon: string;
  scheduledFor: string;
  status: ActionStatus;
  risk: number;
  riskLevel?: "HIGH" | "MEDIUM" | "LOW";
}

// ─── Extra mock items ─────────────────────────────────────────────────────────
const extraActions: ActionItem[] = [
  {
    id: "ACT-005",
    aptId: "APT-004",
    client: "Ava Chen",
    initials: "AC",
    avatar: "#f59e0b",
    type: "SEND_EMAIL_REMINDER",
    label: "Email Reminder",
    icon: "mail",
    scheduledFor: "11:00 AM",
    status: "pending",
    risk: 74,
    riskLevel: "HIGH",
  },
  {
    id: "ACT-006",
    aptId: "BATCH-001",
    client: "Low-Risk Batch (2 clients)",
    initials: "LR",
    avatar: "#10b981",
    type: "SEND_SMS_CONFIRMATION",
    label: "SMS Batch · 2 clients",
    icon: "sms",
    scheduledFor: "04:00 PM",
    status: "pending",
    risk: 22,
    riskLevel: "LOW",
  },
  {
    id: "ACT-007",
    aptId: "FRI-EVE",
    client: "Friday Evening Slots",
    initials: "OB",
    avatar: "#ef4444",
    type: "OVERBOOKING_ALERT",
    label: "Overbooking Alert",
    icon: "alert",
    scheduledFor: "Pending Review",
    status: "pending",
    risk: 91,
    riskLevel: "HIGH",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRiskLevel(risk: number): "HIGH" | "MEDIUM" | "LOW" {
  if (risk >= 70) return "HIGH";
  if (risk >= 35) return "MEDIUM";
  return "LOW";
}

function buildActions(): ActionItem[] {
  const base: ActionItem[] = pendingActions.map((a) => ({
    ...a,
    status: a.status as ActionStatus,
    riskLevel: getRiskLevel(a.risk),
  }));
  return [...base, ...extraActions];
}

const actionIconMap: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  PERSONAL_CALL: {
    icon: <Phone size={16} />,
    color: "#7c5cbf",
    bg: "rgba(124,92,191,0.12)",
  },
  SEND_SMS_CONFIRMATION: {
    icon: <MessageSquare size={16} />,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
  },
  REQUIRE_PREPAYMENT: {
    icon: <CreditCard size={16} />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  SEND_EMAIL_REMINDER: {
    icon: <Mail size={16} />,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
  },
  OVERBOOKING_ALERT: {
    icon: <AlertTriangle size={16} />,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

// ─── Action Log mock data ─────────────────────────────────────────────────────
const actionLog = [
  { time: "08:45 AM", type: "SMS Sent", client: "Jordan Blake", result: "delivered", color: "#10b981" },
  { time: "09:30 AM", type: "SMS Sent", client: "Priya Nair", result: "sent", color: "#3b82f6" },
  { time: "10:05 AM", type: "Call Attempted", client: "Marcus Webb", result: "pending", color: "#f59e0b" },
  { time: "10:50 AM", type: "Prepayment Req.", client: "Ava Chen", result: "pending", color: "#7c5cbf" },
  { time: "11:20 AM", type: "Email Reminder", client: "Sam Rivera", result: "delivered", color: "#10b981" },
  { time: "12:00 PM", type: "Call Failed", client: "Dev Patel", result: "failed", color: "#ef4444" },
];

const resultConfig: Record<string, { bg: string; color: string }> = {
  delivered: { bg: "#d1fae5", color: "#059669" },
  sent: { bg: "#e0e7ff", color: "#4f46e5" },
  pending: { bg: "#fef3c7", color: "#d97706" },
  failed: { bg: "#fee2e2", color: "#dc2626" },
};

// ─── Toast component ──────────────────────────────────────────────────────────
function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        minWidth: 260,
      }}
    >
      <span
        className="flex items-center justify-center w-7 h-7 rounded-full"
        style={{ background: "rgba(16,185,129,0.15)" }}
      >
        <Zap size={14} color="#10b981" />
      </span>
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {message}
      </span>
      <button
        onClick={onDismiss}
        className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={14} color="var(--text-muted)" />
      </button>
    </motion.div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({
  label,
  count,
  icon,
  accentColor,
  trend,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  accentColor: string;
  trend: string;
}) {
  return (
    <GlowCard className="flex-1 p-5" glowColor={`${accentColor}22`}>
      <div className="flex items-start justify-between mb-3">
        <span
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {icon}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${accentColor}18`, color: accentColor }}>
          {trend}
        </span>
      </div>
      <p className="text-3xl font-bold mb-0.5" style={{ fontFamily: "'Instrument Serif', serif", color: "var(--text-primary)" }}>
        <AnimatedCounter value={count} />
      </p>
      <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
    </GlowCard>
  );
}

// ─── Action Card ──────────────────────────────────────────────────────────────
function ActionCard({
  action,
  onExecute,
}: {
  action: ActionItem;
  onExecute: (id: string) => void;
}) {
  const meta = actionIconMap[action.type] ?? {
    icon: <Zap size={16} />,
    color: "#6b7280",
    bg: "rgba(107,114,128,0.12)",
  };

  return (
    <GlowCard className="p-4" glowColor={`${meta.color}18`}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: action.avatar }}
        >
          {action.initials}
        </div>

        {/* Client info */}
        <div className="flex-shrink-0 min-w-0 w-36">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {action.client}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {action.aptId}
          </p>
        </div>

        {/* Action type */}
        <div className="flex items-center gap-2 flex-shrink-0 w-44">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.icon}
          </span>
          <span className="text-xs font-semibold" style={{ color: meta.color }}>
            {action.label}
          </span>
        </div>

        {/* Risk badge */}
        <div className="flex-shrink-0 w-20">
          <RiskBadge level={action.riskLevel ?? getRiskLevel(action.risk)} />
        </div>

        {/* Scheduled time */}
        <div className="flex items-center gap-1 flex-shrink-0 w-28">
          <Clock size={12} color="var(--text-muted)" />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {action.scheduledFor}
          </span>
        </div>

        {/* Status chip */}
        <div className="flex-shrink-0 w-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={action.status}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
            >
              <StatusChip status={action.status} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {action.status === "pending" && (
            <>
              <ActionButton variant="primary" small onClick={() => onExecute(action.id)}>
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  Execute Now
                </span>
              </ActionButton>
              <ActionButton variant="ghost" small>
                Dismiss
              </ActionButton>
            </>
          )}
          {action.status === "sent" && (
            <>
              <ActionButton variant="ghost" small>
                Resend
              </ActionButton>
              <button
                className="flex items-center gap-1 text-xs font-medium hover:underline"
                style={{ color: "var(--accent-purple)" }}
              >
                Check status <ChevronRight size={12} />
              </button>
            </>
          )}
          {action.status === "delivered" && (
            <>
              <span
                className="flex items-center justify-center w-7 h-7 rounded-full"
                style={{ background: "#d1fae5" }}
              >
                <Check size={14} color="#10b981" />
              </span>
              <button
                className="flex items-center gap-1 text-xs font-medium hover:underline"
                style={{ color: "var(--accent-purple)" }}
              >
                View <ChevronRight size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </GlowCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS = ["All", "Pending", "Sent", "Delivered", "Failed"] as const;
type Tab = (typeof TABS)[number];

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>(buildActions);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [toast, setToast] = useState<string | null>(null);

  const pending = actions.filter((a) => a.status === "pending").length;
  const sent = actions.filter((a) => a.status === "sent").length;
  const delivered = actions.filter((a) => a.status === "delivered").length;

  const filtered =
    activeTab === "All"
      ? actions
      : actions.filter((a) => a.status === activeTab.toLowerCase());

  function executeAction(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "sent" } : a))
    );
    const action = actions.find((a) => a.id === id);
    setToast(`Action executed for ${action?.client ?? "client"}`);
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast} onDismiss={() => setToast(null)} />
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 min-w-0">
        {/* TopBar */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "'Instrument Serif', serif", color: "var(--text-primary)" }}
            >
              Actions
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {pending} pending · {sent} sent · {delivered} delivered
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}
            >
              <Bell size={16} color="var(--text-muted)" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}
            >
              <RefreshCw size={16} color="var(--text-muted)" />
            </motion.button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="flex gap-4 mb-6">
          <SummaryCard label="Pending Actions" count={pending} icon={<Clock size={18} />} accentColor="#f59e0b" trend="↑ 2 new" />
          <SummaryCard label="Sent Today" count={sent} icon={<Send size={18} />} accentColor="#3b82f6" trend="on track" />
          <SummaryCard label="Delivered" count={delivered} icon={<Check size={18} />} accentColor="#10b981" trend="100% rate" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: "var(--card-bg)", border: "1px solid var(--glass-border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: activeTab === tab ? "#fff" : "var(--text-muted)" }}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--accent-purple)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        {/* Action queue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {filtered.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 280, damping: 24 }}
              >
                <ActionCard action={action} onExecute={executeAction} />
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-3">
                <span style={{ color: "var(--text-muted)" }}>
                  <Check size={32} />
                </span>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No {activeTab.toLowerCase()} actions
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Right panel ───────────────────────────────────────────── */}
      <div
        className="w-80 flex-shrink-0 border-l overflow-y-auto py-6 px-4 flex flex-col gap-6"
        style={{ borderColor: "var(--glass-border)", background: "rgba(255,255,255,0.015)" }}
      >
        {/* Action Log */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "'Instrument Serif', serif", color: "var(--text-primary)" }}
            >
              Action Log
            </h2>
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Last 24h
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {actionLog.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 22 }}
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--glass-border)",
                  borderLeft: `3px solid ${entry.color}`,
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {entry.type}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: resultConfig[entry.result]?.bg ?? "#f3f4f6",
                        color: resultConfig[entry.result]?.color ?? "#6b7280",
                      }}
                    >
                      {entry.result}
                    </span>
                  </div>
                  <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                    {entry.client} · {entry.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Batch Actions */}
        <div>
          <h2
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "'Instrument Serif', serif", color: "var(--text-primary)" }}
          >
            Batch Actions
          </h2>
          <div className="flex flex-col gap-3">
            <GlowCard className="p-4" glowColor="rgba(59,130,246,0.15)">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
                >
                  <MessageSquare size={15} />
                </span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    Send all pending SMS
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Batch send confirmations
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6" }}
                >
                  {actions.filter((a) => a.type === "SEND_SMS_CONFIRMATION" && a.status === "pending").length}
                </span>
              </div>
              <ActionButton variant="ghost" small>
                <span className="flex items-center gap-1.5">
                  <Send size={12} /> Send Batch
                </span>
              </ActionButton>
            </GlowCard>

            <GlowCard className="p-4" glowColor="rgba(239,68,68,0.15)">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
                >
                  <Phone size={15} />
                </span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    Schedule HIGH risk calls
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Call all high-risk clients
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}
                >
                  {actions.filter((a) => (a.riskLevel === "HIGH" || getRiskLevel(a.risk) === "HIGH") && a.status === "pending").length}
                </span>
              </div>
              <ActionButton variant="ghost" small>
                <span className="flex items-center gap-1.5">
                  <Users size={12} /> Schedule Calls
                </span>
              </ActionButton>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
