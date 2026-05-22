"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import {
  Bell, RefreshCw, TrendingUp, ThumbsUp, ThumbsDown,
  ArrowRight, BrainCircuit, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { GlowCard, AnimatedCounter } from "@/components/ui/primitives";
import { accuracyHistory, appointments } from "@/lib/data";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

const promptVersions = [
  { version: "v1.0", week: "Week 1", accuracy: 70, desc: "Basic prompt — client history + lead time + day of week", color: "#a78bfa" },
  { version: "v1.5", week: "Week 2", accuracy: 73, desc: "Added industry-specific benchmarks and service type context", color: "#818cf8" },
  { version: "v2.0", week: "Week 3", accuracy: 77, desc: "Added multi-factor reasoning framework and confidence scoring", color: "#6366f1" },
  { version: "v2.3", week: "Week 8", accuracy: 83, desc: "Current — optimised for edge cases, refined new-client handling", color: "#7c5cbf", current: true },
];

const errorPatterns = [
  { label: "New clients", pct: 34, desc: "Predicted LOW → actual HIGH", color: "var(--risk-high)" },
  { label: "Friday evenings", pct: 28, desc: "Underestimated cancel rate", color: "#f97316" },
  { label: "Same-day bookings", pct: 22, desc: "Should weight recency harder", color: "var(--risk-medium)" },
  { label: "Medical consults", pct: 19, desc: "Specialty factor not weighted", color: "#06b6d4" },
];

const nextSteps = [
  { label: "Run full pattern analysis", desc: "Surface new trends across 500+ records" },
  { label: "Update prompt for new clients", desc: "Add first-visit penalty factor to v2.4" },
  { label: "Review Friday evening predictions", desc: "28% wrong — highest error cluster" },
];

// Chart helpers
const W = 480;
const H = 140;
const PAD = { t: 16, r: 16, b: 32, l: 36 };
const innerW = W - PAD.l - PAD.r;
const innerH = H - PAD.t - PAD.b;
const minY = 60;
const maxY = 100;

function toX(i: number) { return PAD.l + (i / (accuracyHistory.length - 1)) * innerW; }
function toY(v: number) { return PAD.t + innerH - ((v - minY) / (maxY - minY)) * innerH; }

function linePath(key: "accuracy" | "precision" | "recall") {
  return accuracyHistory.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d[key])}`).join(" ");
}

function LineChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });

  const lines = [
    { key: "accuracy" as const, color: "#7c5cbf", label: "Accuracy" },
    { key: "precision" as const, color: "#e85d8a", label: "Precision" },
    { key: "recall" as const, color: "#2eb88a", label: "Recall" },
  ];

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {/* Grid lines */}
        {[65, 70, 75, 80, 85, 90].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={toY(v)} y2={toY(v)} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
            <text x={PAD.l - 6} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="var(--text-muted)">{v}%</text>
          </g>
        ))}
        {/* X labels */}
        {accuracyHistory.map((d, i) => (
          <text key={d.week} x={toX(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="var(--text-muted)">{d.week}</text>
        ))}
        {/* Lines */}
        {lines.map(({ key, color }) => {
          const path = linePath(key);
          const totalLen = 600;
          return (
            <motion.path
              key={key}
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={totalLen}
              initial={{ strokeDashoffset: totalLen }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
            />
          );
        })}
        {/* Dots */}
        {lines.map(({ key, color }) =>
          accuracyHistory.map((d, i) => (
            <motion.circle
              key={`${key}-${i}`}
              cx={toX(i)}
              cy={toY(d[key])}
              r={3.5}
              fill={color}
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 300 }}
              style={{ transformOrigin: `${toX(i)}px ${toY(d[key])}px` }}
            />
          ))
        )}
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-center">
        {lines.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AccuracyPage() {
  const [feedbackItems, setFeedbackItems] = useState(
    appointments.filter((a) => a.status === "completed" || a.status === "cancelled").slice(0, 4)
  );

  return (
    <main className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* TopBar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <div>
          <h1 style={{ fontFamily: "Instrument Serif, Georgia, serif", color: "var(--text-primary)" }}
            className="text-2xl font-bold">Accuracy Tracking</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Prompt v2.3 · 8 weeks of data · feedback loop active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.05 }} className="relative p-2 rounded-xl"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
            <Bell size={18} style={{ color: "var(--text-secondary)" }} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--risk-high)" }} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
            <RefreshCw size={14} /> Sync
          </motion.button>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Metric strip */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-4 gap-3">
          {[
            { label: "Current Accuracy", value: 83, suffix: "%", trend: "+13% since start", color: "var(--accent-purple)" },
            { label: "Best Prompt", value: 2.3, suffix: "", trend: "v2.3 active", color: "var(--accent-rose)", isText: true },
            { label: "Data Points", value: 1250, suffix: "", trend: "+24 today", color: "#3b82f6" },
            { label: "Week-over-week", value: 1, suffix: "%", trend: "↑ improving", color: "var(--risk-low)" },
          ].map((m) => (
            <motion.div key={m.label} variants={item}>
              <GlowCard className="p-4">
                <p className="text-[10px] font-medium mb-1" style={{ color: "var(--text-muted)" }}>{m.label}</p>
                <p className="text-2xl font-bold" style={{ color: m.color }}>
                  {m.isText ? "v2.3" : <AnimatedCounter value={m.value} suffix={m.suffix} />}
                </p>
                <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: "var(--risk-low)" }}>
                  <TrendingUp size={9} /> {m.trend}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left */}
          <div className="space-y-4">
            {/* Line chart */}
            <GlowCard className="p-5">
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Model Performance Over Time
              </h3>
              <LineChart />
            </GlowCard>

            {/* Prompt version log */}
            <GlowCard className="p-5">
              <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Prompt Version History
              </h3>
              <motion.div variants={container} initial="hidden" animate="show" className="relative">
                {/* Connector line */}
                <div className="absolute left-[18px] top-4 bottom-4 w-px" style={{ background: "var(--glass-border)" }} />
                <div className="space-y-4">
                  {promptVersions.map((v) => (
                    <motion.div key={v.version} variants={item} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 z-10"
                        style={{ background: v.color }}>
                        {v.version}
                      </div>
                      <div className="flex-1 pt-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{v.week}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: v.current ? "var(--accent-purple-light)" : "rgba(0,0,0,0.05)", color: v.current ? "var(--accent-purple)" : "var(--text-muted)" }}>
                            {v.accuracy}% {v.current && "· current"}
                          </span>
                        </div>
                        <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </GlowCard>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Error patterns */}
            <GlowCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Where the Model Struggles</h3>
                <AlertTriangle size={14} style={{ color: "var(--risk-medium)" }} />
              </div>
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {errorPatterns.map((e) => (
                  <motion.div key={e.label} variants={item}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{e.label}</span>
                        <span className="text-[10px] ml-2" style={{ color: "var(--text-muted)" }}>{e.desc}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: e.color }}>{e.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: e.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${e.pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </GlowCard>

            {/* Feedback queue */}
            <GlowCard className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Outcome Feedback</h3>
                <BrainCircuit size={14} style={{ color: "var(--accent-purple)" }} />
              </div>
              <p className="text-[10px] mb-4" style={{ color: "var(--text-muted)" }}>
                Confirm outcomes to improve future predictions
              </p>
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
                <AnimatePresence>
                  {feedbackItems.map((a) => (
                    <motion.div key={a.id} variants={item} layout
                      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl"
                      style={{ background: "rgba(0,0,0,0.03)", border: "1px solid var(--glass-border)" }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{ background: a.avatar }}>
                        {a.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{a.client}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{a.service} · {a.risk}% predicted</div>
                      </div>
                      <div className="flex gap-1.5">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setFeedbackItems((f) => f.filter((x) => x.id !== a.id))}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--risk-low-bg)", color: "var(--risk-low)" }}>
                          <ThumbsUp size={12} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setFeedbackItems((f) => f.filter((x) => x.id !== a.id))}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "var(--risk-high-bg)", color: "var(--risk-high)" }}>
                          <ThumbsDown size={12} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {feedbackItems.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-4">
                    <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "var(--risk-low)" }} />
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>All caught up!</p>
                  </motion.div>
                )}
              </motion.div>
            </GlowCard>

            {/* Next steps */}
            <GlowCard className="p-5">
              <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Recommended Next Steps</h3>
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
                {nextSteps.map((s) => (
                  <motion.div key={s.label} variants={item} whileHover={{ x: 3 }}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    style={{ background: "var(--accent-purple-light)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.desc}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
                  </motion.div>
                ))}
              </motion.div>
            </GlowCard>
          </div>
        </div>
      </div>
    </main>
  );
}
