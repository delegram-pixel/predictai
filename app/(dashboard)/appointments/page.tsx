"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  RefreshCw,
  Search,
  Phone,
  MessageSquare,
  CreditCard,
  Scissors,
  HeartPulse,
  Dumbbell,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
} from "lucide-react";
import { GlowCard, RiskBadge, StatusChip, ActionButton, RiskRing } from "@/components/ui/primitives";
import { appointments, weekSlots, type Appointment } from "@/lib/data";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const RISK_COLOR: Record<string, string> = {
  HIGH: "var(--risk-high)",
  MEDIUM: "var(--risk-medium)",
  LOW: "var(--risk-low)",
};

const RISK_BG: Record<string, string> = {
  HIGH: "var(--risk-high-bg)",
  MEDIUM: "var(--risk-medium-bg)",
  LOW: "var(--risk-low-bg)",
};

const RECOMMENDATION_LABEL: Record<string, string> = {
  PERSONAL_CALL: "Personal Call Recommended",
  SEND_SMS_CONFIRMATION: "Send SMS Confirmation",
  REQUIRE_PREPAYMENT: "Require Prepayment",
  NO_ACTION: "No Action Needed",
};

const RECOMMENDATION_COLOR: Record<string, string> = {
  PERSONAL_CALL: "var(--risk-high)",
  SEND_SMS_CONFIRMATION: "var(--risk-medium)",
  REQUIRE_PREPAYMENT: "#7c5cbf",
  NO_ACTION: "var(--risk-low)",
};

// ─── Industry icon helper ─────────────────────────────────────────────────────
function IndustryIcon({ industry }: { industry: string }) {
  const props = { size: 14, className: "opacity-70" };
  switch (industry) {
    case "salon": return <Scissors {...props} />;
    case "medical": return <HeartPulse {...props} />;
    case "fitness": return <Dumbbell {...props} />;
    case "consulting": return <Briefcase {...props} />;
    default: return <CalendarDays {...props} />;
  }
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-14 h-14 text-lg" }[size];
  return (
    <div
      className={`${dims} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}

// ─── stagger variants ─────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

// ─── Week View ────────────────────────────────────────────────────────────────
function WeekView({ onSelect, selected }: { onSelect: (a: Appointment) => void; selected: Appointment | null }) {
  // Map appointments to time slots (matching first 2 chars of time to slot)
  function aptForSlot(apts: Appointment[], slot: string) {
    return apts.filter((a) => a.time.startsWith(slot.replace(":", ":")));
  }

  return (
    <motion.div
      key="week"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.28 }}
      className="overflow-x-auto"
    >
      {/* Day headers */}
      <div className="grid min-w-[640px]" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
        <div />
        {weekSlots.map((ws) => (
          <div key={ws.day} className="text-center pb-2">
            <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{ws.day}</p>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{ws.date}</p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid min-w-[640px]"
        style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}
      >
        {TIME_SLOTS.map((slot) => (
          <>
            {/* Time label */}
            <div
              key={`label-${slot}`}
              className="text-[10px] font-medium pr-2 pt-1.5 text-right"
              style={{ color: "var(--text-muted)" }}
            >
              {slot}
            </div>
            {/* Day columns */}
            {weekSlots.map((ws) => {
              const matching = aptForSlot(ws.apts, slot);
              return (
                <div key={`${ws.day}-${slot}`} className="border-t px-1 py-1 min-h-[52px]" style={{ borderColor: "rgba(124,92,191,0.08)" }}>
                  {matching.length > 0 ? (
                    matching.map((apt) => (
                      <motion.button
                        key={apt.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(apt)}
                        className="w-full text-left rounded-lg px-2 py-1.5 mb-1 text-[10px] font-medium cursor-pointer"
                        style={{
                          borderLeft: `3px solid ${RISK_COLOR[apt.riskLevel]}`,
                          background: selected?.id === apt.id
                            ? RISK_BG[apt.riskLevel]
                            : "rgba(255,255,255,0.6)",
                          boxShadow: selected?.id === apt.id
                            ? `0 0 0 1.5px ${RISK_COLOR[apt.riskLevel]}40`
                            : "0 1px 4px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ background: apt.avatar, fontSize: 7 }}
                          >
                            {apt.initials}
                          </div>
                          <span className="truncate" style={{ color: "var(--text-primary)" }}>{apt.client.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="truncate" style={{ color: "var(--text-secondary)" }}>{apt.service}</span>
                          <span className="font-bold ml-1 shrink-0" style={{ color: RISK_COLOR[apt.riskLevel] }}>{apt.risk}%</span>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div
                      className="rounded-md border-dashed border h-10 mx-0.5"
                      style={{ borderColor: "rgba(124,92,191,0.1)" }}
                    />
                  )}
                </div>
              );
            })}
          </>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────
type SortKey = "client" | "time" | "risk" | "status";

function ListView({ onSelect, selected }: { onSelect: (a: Appointment) => void; selected: Appointment | null }) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = appointments
    .filter((a) => {
      const q = search.toLowerCase();
      return (
        (riskFilter === "ALL" || a.riskLevel === riskFilter) &&
        (a.client.toLowerCase().includes(q) || a.service.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "client") cmp = a.client.localeCompare(b.client);
      else if (sortKey === "time") cmp = a.time.localeCompare(b.time);
      else if (sortKey === "risk") cmp = a.risk - b.risk;
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortAsc ? cmp : -cmp;
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  }

  const thClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none";

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.28 }}
    >
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or service…"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div className="flex gap-1.5">
          {(["ALL", "HIGH", "MEDIUM", "LOW"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: riskFilter === r
                  ? (r === "ALL" ? "var(--accent-purple)" : RISK_COLOR[r])
                  : "rgba(255,255,255,0.55)",
                color: riskFilter === r ? "#fff" : "var(--text-secondary)",
                border: "1px solid",
                borderColor: riskFilter === r ? "transparent" : "var(--glass-border)",
              }}
            >
              {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(16px)",
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(124,92,191,0.1)" }}>
              <th className={thClass} onClick={() => toggleSort("client")} style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">Client <SortIcon col="client" /></span>
              </th>
              <th className={thClass} style={{ color: "var(--text-muted)" }}>Service</th>
              <th className={thClass} onClick={() => toggleSort("time")} style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">Time <SortIcon col="time" /></span>
              </th>
              <th className={thClass} style={{ color: "var(--text-muted)" }}>Industry</th>
              <th className={thClass} onClick={() => toggleSort("risk")} style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">Risk <SortIcon col="risk" /></span>
              </th>
              <th className={thClass} onClick={() => toggleSort("status")} style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">Status <SortIcon col="status" /></span>
              </th>
              <th className={thClass} style={{ color: "var(--text-muted)" }}>Action</th>
            </tr>
          </thead>
          <motion.tbody variants={containerVariants} initial="hidden" animate="show">
            {filtered.map((apt) => (
              <motion.tr
                key={apt.id}
                variants={itemVariants}
                onClick={() => onSelect(apt)}
                whileHover={{ backgroundColor: "rgba(124,92,191,0.04)" }}
                className="cursor-pointer transition-colors"
                style={{
                  borderBottom: "1px solid rgba(124,92,191,0.06)",
                  background: selected?.id === apt.id ? "rgba(124,92,191,0.06)" : "transparent",
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={apt.initials} color={apt.avatar} size="sm" />
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{apt.client}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{apt.service}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Clock size={12} className="opacity-60" /> {apt.time}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium w-fit"
                    style={{ background: "rgba(124,92,191,0.07)", color: "var(--accent-purple)" }}
                  >
                    <IndustryIcon industry={apt.industry} />
                    {apt.industry.charAt(0).toUpperCase() + apt.industry.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RiskBadge level={apt.riskLevel} />
                </td>
                <td className="px-4 py-3">
                  <StatusChip status={apt.status} />
                </td>
                <td className="px-4 py-3">
                  <ActionButton variant="ghost" small onClick={() => onSelect(apt)}>
                    View
                  </ActionButton>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No appointments match your filters.
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ apt }: { apt: Appointment | null }) {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto"
      style={{ maxHeight: "calc(100vh - 48px)" }}
    >
      <div
        className="rounded-2xl p-5 flex flex-col gap-4"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--glass-shadow)",
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Selected Appointment
        </p>

        <AnimatePresence mode="wait">
          {apt ? (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-4"
            >
              {/* Client info */}
              <div className="flex items-center gap-3">
                <Avatar initials={apt.initials} color={apt.avatar} size="lg" />
                <div>
                  <p className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{apt.client}</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{apt.service}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={11} className="opacity-50" />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{apt.time} · {apt.date}</span>
                  </div>
                </div>
              </div>

              {/* Risk ring */}
              <div className="flex justify-center py-2">
                <RiskRing risk={apt.risk} level={apt.riskLevel} />
              </div>

              {/* Risk factors */}
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Risk Factors
                </p>
                <ul className="flex flex-col gap-1.5">
                  {apt.factors.map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: RISK_COLOR[apt.riskLevel] }}
                      />
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div
                className="rounded-xl px-3 py-2.5 text-xs font-semibold"
                style={{
                  background: `${RECOMMENDATION_COLOR[apt.recommendation]}15`,
                  color: RECOMMENDATION_COLOR[apt.recommendation],
                  border: `1px solid ${RECOMMENDATION_COLOR[apt.recommendation]}30`,
                }}
              >
                {RECOMMENDATION_LABEL[apt.recommendation] ?? apt.recommendation}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <ActionButton variant="primary">
                  <span className="flex items-center gap-2">
                    <Phone size={13} /> Call Client
                  </span>
                </ActionButton>
                <ActionButton variant="ghost">
                  <span className="flex items-center gap-2">
                    <MessageSquare size={13} /> Send SMS
                  </span>
                </ActionButton>
                <ActionButton variant="danger">
                  <span className="flex items-center gap-2">
                    <CreditCard size={13} /> Request Prepay
                  </span>
                </ActionButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--accent-purple-light)" }}
              >
                <User size={20} style={{ color: "var(--accent-purple)" }} />
              </div>
              <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                Click any appointment to see details and AI risk analysis.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const [tab, setTab] = useState<"week" | "list">("week");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [syncing, setSyncing] = useState(false);

  const todayApts = appointments.filter((a) => a.date === "2025-05-21");
  const highRisk = todayApts.filter((a) => a.riskLevel === "HIGH").length;

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1400);
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

          {/* TopBar */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-bold leading-tight"
                style={{ fontFamily: "Instrument Serif, serif", color: "var(--text-primary)" }}
              >
                Appointments
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {todayApts.length} appointments today
                {highRisk > 0 && (
                  <span className="ml-2 font-semibold" style={{ color: "var(--risk-high)" }}>
                    · {highRisk} high-risk alert{highRisk > 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                style={{ background: "rgba(255,255,255,0.65)", border: "1px solid var(--glass-border)" }}
              >
                <Bell size={16} style={{ color: "var(--text-secondary)" }} />
                {highRisk > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{ background: "var(--risk-high)" }}
                  />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSync}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                style={{
                  background: "var(--accent-purple)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(124,92,191,0.3)",
                }}
              >
                <motion.span animate={syncing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.9, ease: "linear", repeat: syncing ? Infinity : 0 }}>
                  <RefreshCw size={13} />
                </motion.span>
                Sync
              </motion.button>
            </div>
          </div>

          {/* Tab switcher */}
          <div
            className="flex gap-1 p-1 rounded-xl w-fit"
            style={{ background: "rgba(255,255,255,0.55)", border: "1px solid var(--glass-border)" }}
          >
            {(["week", "list"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ color: tab === t ? "#fff" : "var(--text-secondary)" }}
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--accent-purple)" }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{t === "week" ? "Week" : "List"}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <GlowCard className="p-5">
            <AnimatePresence mode="wait">
              {tab === "week" ? (
                <WeekView key="week" onSelect={setSelected} selected={selected} />
              ) : (
                <ListView key="list" onSelect={setSelected} selected={selected} />
              )}
            </AnimatePresence>
          </GlowCard>
        </div>
      </div>

      {/* Right detail panel */}
      <div className="px-4 py-6">
        <DetailPanel apt={selected} />
      </div>
    </div>
  );
}
