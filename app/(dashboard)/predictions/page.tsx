"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Bell, RefreshCw, Search, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Clock, Filter, BrainCircuit,
} from "lucide-react";
import { AnimatedCounter, RiskBadge, StatusChip } from "@/components/ui/primitives";
import { appointments } from "@/lib/data";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

// Enrich appointments with prediction metadata
const predictions = appointments.map((a, i) => ({
  ...a,
  predictedRisk: a.riskLevel,
  actualOutcome: a.status,
  correct:
    a.status === "pending"
      ? null
      : a.status === "cancelled" || a.status === "no_show"
      ? a.riskLevel === "HIGH" || a.riskLevel === "MEDIUM"
      : a.riskLevel === "LOW",
  reasoning: `Based on ${a.factors.join(", ").toLowerCase()}, the model assessed a ${a.risk}% cancellation probability with ${a.confidence.toLowerCase()} confidence. ${a.riskLevel === "HIGH" ? "Strong indicators of cancellation risk were found, particularly around booking recency and client history." : a.riskLevel === "MEDIUM" ? "Mixed signals present — some risk factors offset by positive indicators such as prior engagement." : "Client history and booking patterns strongly suggest reliable attendance."}`,
  date: i < 6 ? "2025-05-21" : `2025-05-${20 - (i - 6)}`,
  promptVersion: i < 3 ? "v2.3" : "v2.1",
}));

const statCards = [
  { label: "Total Predictions", value: 1250 },
  { label: "Correct", value: 1037, suffix: " (83%)" },
  { label: "Wrong", value: 213, suffix: " (17%)", red: true },
];

type FilterRisk = "all" | "HIGH" | "MEDIUM" | "LOW";
type FilterCorrect = "all" | "correct" | "wrong" | "pending";

export default function PredictionsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<FilterRisk>("all");
  const [correctFilter, setCorrectFilter] = useState<FilterCorrect>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = predictions.filter((p) => {
    const matchSearch =
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || p.riskLevel === riskFilter;
    const matchCorrect =
      correctFilter === "all"
        ? true
        : correctFilter === "pending"
        ? p.correct === null
        : correctFilter === "correct"
        ? p.correct === true
        : p.correct === false;
    return matchSearch && matchRisk && matchCorrect;
  });

  return (
    <main className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* TopBar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Predictions
          </h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            1,250 total · 83% accuracy · prompt v2.3
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="relative p-2"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <Bell size={18} style={{ color: "var(--muted-foreground)" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
            <RefreshCw size={14} /> Sync
          </button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Stat strip */}
        <div className="flex gap-0" style={{ border: "1px solid var(--border)" }}>
          {statCards.map((s, i) => (
            <div key={s.label} className="flex-1">
              {i > 0 && <div style={{ width: "1px", background: "var(--border)" }} />}
              <div className="p-4" style={{ background: "var(--card)" }}>
                <p className="text-xs font-mono mb-1" style={{ color: "var(--muted-foreground)" }}>{s.label}</p>
                <p className="text-2xl font-mono font-semibold" style={{ color: s.red ? "#ef4444" : "var(--foreground)" }}>
                  <AnimatedCounter value={s.value} suffix={s.suffix ?? ""} />
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client or service…"
              className="pl-8 pr-3 py-2 text-xs outline-none w-52"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
          </div>
          {/* Risk filter */}
          <div className="flex items-center gap-1 p-1" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <Filter size={12} className="ml-1" style={{ color: "var(--muted-foreground)" }} />
            {(["all", "HIGH", "MEDIUM", "LOW"] as FilterRisk[]).map((f) => (
              <button key={f} onClick={() => setRiskFilter(f)}
                className="px-2.5 py-1 text-xs font-medium capitalize"
                style={riskFilter === f
                  ? { background: "var(--foreground)", color: "var(--card)" }
                  : { color: "var(--muted-foreground)" }}>
                {f === "all" ? "All Risk" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {/* Correct filter */}
          <div className="flex items-center gap-1 p-1" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            {(["all", "correct", "wrong", "pending"] as FilterCorrect[]).map((f) => (
              <button key={f} onClick={() => setCorrectFilter(f)}
                className="px-2.5 py-1 text-xs font-medium capitalize"
                style={correctFilter === f
                  ? { background: "var(--foreground)", color: "var(--card)" }
                  : { color: "var(--muted-foreground)" }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="overflow-hidden">
          {/* Header */}
          <div className="grid text-[10px] font-mono font-semibold uppercase tracking-wider px-4 py-3"
            style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr", color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)" }}>
            <span>Client</span>
            <span>Service</span>
            <span>Predicted</span>
            <span>Confidence</span>
            <span>Outcome</span>
            <span>Correct?</span>
            <span>Date</span>
          </div>

          {/* Rows */}
          <motion.div variants={container} initial="hidden" animate="show">
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div key={p.id} variants={row} layout exit={{ opacity: 0, height: 0 }}>
                  {/* Main row */}
                  <div
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    className="grid items-center px-4 py-3 cursor-pointer"
                    style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid var(--border)" }}>
                    {/* Client */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                        {p.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{p.client}</div>
                        <div className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>#{p.id}</div>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{p.service}</span>
                    <RiskBadge level={p.predictedRisk} />
                    <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>{p.confidence}</span>
                    <StatusChip status={p.actualOutcome} />
                    {/* Correct */}
                    <span>
                      {p.correct === null ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>
                          <Clock size={10} /> Pending
                        </span>
                      ) : p.correct ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "var(--foreground)" }}>
                          <CheckCircle2 size={12} /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "#ef4444" }}>
                          <XCircle size={12} /> Wrong
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{p.date}</span>
                      <motion.div animate={{ rotate: expandedId === p.id ? 90 : 0 }}>
                        <ChevronRight size={12} style={{ color: "var(--muted-foreground)" }} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded reasoning */}
                  <AnimatePresence>
                    {expandedId === p.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                        style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
                        <div className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BrainCircuit size={14} style={{ color: "var(--muted-foreground)" }} />
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
                              Claude&apos;s Reasoning · {p.promptVersion}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                            {p.reasoning}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {p.factors.map((f) => (
                              <span key={f} className="text-[10px] px-2 py-0.5 font-mono font-medium"
                                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
