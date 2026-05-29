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
  ActionButton,
  RiskBadge,
  StatusChip,
  AnimatedCounter,
} from "@/components/ui/primitives";
import { pendingActions } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActionStatus = "pending" | "sent" | "delivered" | "failed";

interface ActionItem {
  id: string;
  aptId: string;
  client: string;
  initials: string;
  type: string;
  label: string;
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
    type: "SEND_EMAIL_REMINDER",
    label: "Email Reminder",
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
    type: "SEND_SMS_CONFIRMATION",
    label: "SMS Batch · 2 clients",
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
    type: "OVERBOOKING_ALERT",
    label: "Overbooking Alert",
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
    id: a.id,
    aptId: a.aptId,
    client: a.client,
    initials: a.initials,
    type: a.type,
    label: a.label,
    scheduledFor: a.scheduledFor,
    status: a.status as ActionStatus,
    risk: a.risk,
    riskLevel: getRiskLevel(a.risk),
  }));
  return [...base, ...extraActions];
}

// All icons use muted foreground; only OVERBOOKING_ALERT uses red
const actionIconMap: Record<string, { icon: React.ReactNode; isRed?: boolean }> = {
  PERSONAL_CALL:         { icon: <Phone size={14} /> },
  SEND_SMS_CONFIRMATION: { icon: <MessageSquare size={14} /> },
  REQUIRE_PREPAYMENT:    { icon: <CreditCard size={14} /> },
  SEND_EMAIL_REMINDER:   { icon: <Mail size={14} /> },
  OVERBOOKING_ALERT:     { icon: <AlertTriangle size={14} />, isRed: true },
};

// ─── Action Log mock data ─────────────────────────────────────────────────────
const actionLog = [
  { time: "08:45 AM", type: "SMS Sent",       client: "Jordan Blake", result: "delivered" },
  { time: "09:30 AM", type: "SMS Sent",       client: "Priya Nair",   result: "sent" },
  { time: "10:05 AM", type: "Call Attempted", client: "Marcus Webb",  result: "pending" },
  { time: "10:50 AM", type: "Prepayment Req.",client: "Ava Chen",     result: "pending" },
  { time: "11:20 AM", type: "Email Reminder", client: "Sam Rivera",   result: "delivered" },
  { time: "12:00 PM", type: "Call Failed",    client: "Dev Patel",    result: "failed" },
];

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
      transition={{ duration: 0.18 }}
      className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        minWidth: 260,
        fontFamily: "var(--font-geist-sans)",
      }}
    >
      <Check size={14} style={{ color: "var(--foreground)" }} />
      <span className="text-sm" style={{ color: "var(--foreground)" }}>
        {message}
      </span>
      <button onClick={onDismiss} className="ml-auto" style={{ color: "var(--muted-foreground)" }}>
        <X size={14} />
      </button>
    </motion.div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({
  label,
  count,
  icon,
  trend,
  isRed,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  trend: string;
  isRed?: boolean;
}) {
  return (
    <div
      className="flex-1 p-4"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span style={{ color: isRed ? "#ef4444" : "var(--muted-foreground)" }}>{icon}</span>
        <span
          className="text-[10px] font-mono px-2 py-0.5"
          style={{
            border: "1px solid var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          {trend}
        </span>
      </div>
      <p
        className="text-2xl font-mono font-semibold mb-0.5"
        style={{ color: isRed ? "#ef4444" : "var(--foreground)" }}
      >
        <AnimatedCounter value={count} />
      </p>
      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </p>
    </div>
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
  const meta = actionIconMap[action.type] ?? { icon: <Zap size={14} /> };

  return (
    <div
      className="flex items-center gap-4 px-4 py-3"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderLeft: meta.isRed ? "2px solid #ef4444" : "1px solid var(--border)",
      }}
    >
      {/* Initials square */}
      <div
        className="w-8 h-8 flex items-center justify-center text-xs font-mono font-semibold flex-shrink-0"
        style={{
          background: "var(--muted)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
      >
        {action.initials}
      </div>

      {/* Client info */}
      <div className="flex-shrink-0 min-w-0 w-36">
        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
          {action.client}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--muted-foreground)" }}>
          {action.aptId}
        </p>
      </div>

      {/* Action type */}
      <div className="flex items-center gap-2 flex-shrink-0 w-44">
        <span style={{ color: meta.isRed ? "#ef4444" : "var(--muted-foreground)" }}>
          {meta.icon}
        </span>
        <span
          className="text-xs font-mono"
          style={{ color: meta.isRed ? "#ef4444" : "var(--muted-foreground)" }}
        >
          {action.label}
        </span>
      </div>

      {/* Risk badge */}
      <div className="flex-shrink-0 w-20">
        <RiskBadge level={action.riskLevel ?? getRiskLevel(action.risk)} />
      </div>

      {/* Scheduled time */}
      <div className="flex items-center gap-1 flex-shrink-0 w-28">
        <Clock size={11} style={{ color: "var(--muted-foreground)" }} />
        <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
          {action.scheduledFor}
        </span>
      </div>

      {/* Status */}
      <div className="flex-shrink-0 w-20">
        <StatusChip status={action.status} />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2 flex-shrink-0">
        {action.status === "pending" && (
          <>
            <ActionButton variant="primary" small onClick={() => onExecute(action.id)}>
              <span className="flex items-center gap-1">
                <Zap size={11} /> Execute
              </span>
            </ActionButton>
            <ActionButton variant="ghost" small>
              Dismiss
            </ActionButton>
          </>
        )}
        {action.status === "sent" && (
          <>
            <ActionButton variant="ghost" small>Resend</ActionButton>
            <button
              className="flex items-center gap-1 text-xs font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              Check status <ChevronRight size={11} />
            </button>
          </>
        )}
        {action.status === "delivered" && (
          <>
            <Check size={13} style={{ color: "var(--muted-foreground)" }} />
            <button
              className="flex items-center gap-1 text-xs font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              View <ChevronRight size={11} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS = ["All", "Pending", "Sent", "Delivered", "Failed"] as const;
type Tab = (typeof TABS)[number];

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>(buildActions);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [toast, setToast] = useState<string | null>(null);

  const pending   = actions.filter((a) => a.status === "pending").length;
  const sent      = actions.filter((a) => a.status === "sent").length;
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
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
              Actions
            </h1>
            <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
              {pending} pending · {sent} sent · {delivered} delivered
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center w-8 h-8"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            >
              <Bell size={14} />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <div className="flex gap-0 mb-6" style={{ border: "1px solid var(--border)" }}>
          <SummaryCard label="Pending Actions" count={pending}   icon={<Clock size={16} />} trend="↑ 2 new" />
          <div style={{ width: "1px", background: "var(--border)" }} />
          <SummaryCard label="Sent Today"      count={sent}      icon={<Send size={16} />}  trend="on track" />
          <div style={{ width: "1px", background: "var(--border)" }} />
          <SummaryCard label="Delivered"       count={delivered} icon={<Check size={16} />} trend="100% rate" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0 mb-5" style={{ borderBottom: "1px solid var(--border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-4 py-2 text-xs font-mono transition-colors"
              style={{
                color: activeTab === tab ? "var(--foreground)" : "var(--muted-foreground)",
                borderBottom: activeTab === tab ? "1px solid var(--foreground)" : "1px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action queue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-0"
            style={{ border: "1px solid var(--border)" }}
          >
            {filtered.map((action, i) => (
              <div key={action.id}>
                {i > 0 && <div style={{ height: "1px", background: "var(--border)" }} />}
                <ActionCard action={action} onExecute={executeAction} />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 gap-2">
                <Check size={24} style={{ color: "var(--muted-foreground)" }} />
                <p className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
                  No {activeTab.toLowerCase()} actions
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right panel */}
      <div
        className="w-72 flex-shrink-0 overflow-y-auto py-6 px-4 flex flex-col gap-6"
        style={{ borderLeft: "1px solid var(--border)", background: "var(--card)" }}
      >
        {/* Action Log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
              Action Log
            </h2>
            <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
              Last 24h
            </span>
          </div>
          <div className="flex flex-col gap-0" style={{ border: "1px solid var(--border)" }}>
            {actionLog.map((entry, i) => {
              const isFailed = entry.result === "failed";
              return (
                <div key={i}>
                  {i > 0 && <div style={{ height: "1px", background: "var(--border)" }} />}
                  <div
                    className="flex items-start gap-3 px-3 py-2.5"
                    style={{
                      borderLeft: isFailed ? "2px solid #ef4444" : "2px solid var(--border)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                          {entry.type}
                        </span>
                        <span
                          className="text-[10px] font-mono flex-shrink-0"
                          style={{ color: isFailed ? "#ef4444" : "var(--muted-foreground)" }}
                        >
                          {entry.result}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono truncate" style={{ color: "var(--muted-foreground)" }}>
                        {entry.client} · {entry.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Batch Actions */}
        <div>
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>
            Batch Actions
          </h2>
          <div className="flex flex-col gap-0" style={{ border: "1px solid var(--border)" }}>
            {/* SMS batch */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare size={14} style={{ color: "var(--muted-foreground)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                    Send all pending SMS
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                    Batch send confirmations
                  </p>
                </div>
                <span
                  className="text-xs font-mono px-1.5 py-0.5"
                  style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                >
                  {actions.filter((a) => a.type === "SEND_SMS_CONFIRMATION" && a.status === "pending").length}
                </span>
              </div>
              <ActionButton variant="ghost" small>
                <span className="flex items-center gap-1.5">
                  <Send size={11} /> Send Batch
                </span>
              </ActionButton>
            </div>

            <div style={{ height: "1px", background: "var(--border)" }} />

            {/* High risk calls */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Phone size={14} style={{ color: "#ef4444" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                    Schedule HIGH risk calls
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                    Call all high-risk clients
                  </p>
                </div>
                <span
                  className="text-xs font-mono px-1.5 py-0.5"
                  style={{ border: "1px solid #ef4444", color: "#ef4444" }}
                >
                  {actions.filter((a) => (a.riskLevel === "HIGH" || getRiskLevel(a.risk) === "HIGH") && a.status === "pending").length}
                </span>
              </div>
              <ActionButton variant="ghost" small>
                <span className="flex items-center gap-1.5">
                  <Users size={11} /> Schedule Calls
                </span>
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
