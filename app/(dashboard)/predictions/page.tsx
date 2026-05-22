"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Bell, RefreshCw, Search, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Clock, Filter, BrainCircuit,
} from "lucide-react";
import { GlowCard, AnimatedCounter, RiskBadge, StatusChip } from "@/components/ui/primitives";
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
  { label: "Total Predictions", value: 1250, color: "var(--accent-purple)" },
  { label: "Correct", value: 1037, color: "var(--risk-low)", suffix: " (83%)" },
  { label: "Wrong", value: 213, color: "var(--risk-high)", suffix: " (17%)" },
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
        style={{ borderBottom: "1px solid var(--glass-border)" }}
      >
        <div>
          <h1 style={{ fontFamily: "Instrument Serif, Georgia, serif", color: "var(--text-primary)" }}
            className="text-2xl font-bold">
            Predictions
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            1,250 total · 83% accuracy · prompt v2.3
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <Bell size={18} style={{ color: "var(--text-secondary)" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--risk-high)" }} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
            <RefreshCw size={14} /> Sync
          </motion.button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Stat strip */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-3 gap-3">
          {statCards.map((s) => (
            <motion.div key={s.label} variants={row}>
              <GlowCard className="p-4">
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color }}>
                  <AnimatedCounter value={s.value} suffix={s.suffix ?? ""} />
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client or service…"
              className="pl-8 pr-3 py-2 rounded-xl text-xs outline-none w-52"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
          </div>
          {/* Risk filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <Filter size={12} className="ml-1" style={{ color: "var(--text-muted)" }} />
            {(["all", "HIGH", "MEDIUM", "LOW"] as FilterRisk[]).map((f) => (
              <button key={f} onClick={() => setRiskFilter(f)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                style={riskFilter === f ? { background: "var(--accent-purple)", color: "#fff" } : { color: "var(--text-muted)" }}>
                {f === "all" ? "All Risk" : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          {/* Correct filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            {(["all", "correct", "wrong", "pending"] as FilterCorrect[]).map((f) => (
              <button key={f} onClick={() => setCorrectFilter(f)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                style={correctFilter === f ? { background: "var(--accent-purple)", color: "#fff" } : { color: "var(--text-muted)" }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <GlowCard className="overflow-hidden">
          {/* Header */}
          <div className="grid text-[10px] font-semibold uppercase tracking-wider px-4 py-3"
            style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr", color: "var(--text-muted)", borderBottom: "1px solid var(--glass-border)" }}>
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
                  <motion.div
                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    whileHover={{ backgroundColor: "rgba(124,92,191,0.04)" }}
                    className="grid items-center px-4 py-3 cursor-pointer"
                    style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid var(--glass-border)" }}>
                    {/* Client */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: p.avatar }}>
                        {p.initials}
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{p.client}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>#{p.id}</div>
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.service}</span>
                    <RiskBadge level={p.predictedRisk} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{p.confidence}</span>
                    <StatusChip status={p.actualOutcome} />
                    {/* Correct */}
                    <span>
                      {p.correct === null ? (
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                          <Clock size={10} /> Pending
                        </span>
                      ) : p.correct ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "var(--risk-low)" }}>
                          <CheckCircle2 size={12} /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: "var(--risk-high)" }}>
                          <XCircle size={12} /> Wrong
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{p.date}</span>
                      <motion.div animate={{ rotate: expandedId === p.id ? 90 : 0 }}>
                        <ChevronRight size={12} style={{ color: "var(--text-muted)" }} />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Expanded reasoning */}
                  <AnimatePresence>
                    {expandedId === p.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                        style={{ borderBottom: "1px solid var(--glass-border)", background: "var(--accent-purple-light)" }}>
                        <div className="px-6 py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BrainCircuit size={14} style={{ color: "var(--accent-purple)" }} />
                            <span className="text-xs font-semibold" style={{ color: "var(--accent-purple)" }}>
                              Claude&apos;s Reasoning · {p.promptVersion}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            {p.reasoning}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {p.factors.map((f) => (
                              <span key={f} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                style={{ background: "rgba(124,92,191,0.12)", color: "var(--accent-purple)" }}>
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
        </GlowCard>
      </div>
    </main>
  );
}
