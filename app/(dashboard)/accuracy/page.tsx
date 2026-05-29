"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import {
  Bell, RefreshCw, TrendingUp, ThumbsUp, ThumbsDown,
  ArrowRight, BrainCircuit, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/primitives";
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
  { version: "v1.0", week: "Week 1", accuracy: 70, desc: "Basic prompt — client history + lead time + day of week" },
  { version: "v1.5", week: "Week 2", accuracy: 73, desc: "Added industry-specific benchmarks and service type context" },
  { version: "v2.0", week: "Week 3", accuracy: 77, desc: "Added multi-factor reasoning framework and confidence scoring" },
  { version: "v2.3", week: "Week 8", accuracy: 83, desc: "Current — optimised for edge cases, refined new-client handling", current: true },
];

const errorPatterns = [
  { label: "New clients", pct: 34, desc: "Predicted LOW → actual HIGH" },
  { label: "Friday evenings", pct: 28, desc: "Underestimated cancel rate" },
  { label: "Same-day bookings", pct: 22, desc: "Should weight recency harder" },
  { label: "Medical consults", pct: 19, desc: "Specialty factor not weighted" },
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

const LINE_COLORS = {
  accuracy: "var(--foreground)",
  precision: "var(--muted-foreground)",
  recall: "var(--muted-foreground)",
};

function LineChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });

  const lines = [
    { key: "accuracy" as const, label: "Accuracy", strokeDasharray: "" },
    { key: "precision" as const, label: "Precision", strokeDasharray: "4 3" },
    { key: "recall" as const, label: "Recall", strokeDasharray: "1 3" },
  ];

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {/* Grid lines */}
        {[65, 70, 75, 80, 85, 90].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={toY(v)} y2={toY(v)} stroke="var(--border)" strokeWidth={1} />
            <text x={PAD.l - 6} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{v}%</text>
          </g>
        ))}
        {/* X labels */}
        {accuracyHistory.map((d, i) => (
          <text key={d.week} x={toX(i)} y={H - 4} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{d.week}</text>
        ))}
        {/* Lines */}
        {lines.map(({ key, strokeDasharray }) => {
          const path = linePath(key);
          const totalLen = 600;
          return (
            <motion.path
              key={key}
              d={path}
              fill="none"
              stroke={LINE_COLORS[key]}
              strokeWidth={key === "accuracy" ? 2 : 1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDasharray || undefined}
              style={{ strokeDashoffset: totalLen }}
              animate={inView ? { strokeDashoffset: 0 } : {}}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
            />
          );
        })}
        {/* Dots (accuracy only) */}
        {accuracyHistory.map((d, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={toX(i)}
            cy={toY(d.accuracy)}
            r={3}
            fill="var(--card)"
            stroke="var(--foreground)"
            strokeWidth={1.5}
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 300 }}
            style={{ transformOrigin: `${toX(i)}px ${toY(d.accuracy)}px` }}
          />
        ))}
      </svg>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-center">
        {lines.map(({ label, strokeDasharray }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width={16} height={8}>
              <line x1={0} y1={4} x2={16} y2={4}
                stroke="var(--foreground)"
                strokeWidth={label === "Accuracy" ? 2 : 1.5}
                strokeDasharray={strokeDasharray || undefined} />
            </svg>
            <span className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{label}</span>
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
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Accuracy Tracking</h1>
          <p className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Prompt v2.3 · 8 weeks of data · feedback loop active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2"
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
        {/* Metric strip */}
        <div className="flex gap-0" style={{ border: "1px solid var(--border)" }}>
          {[
            { label: "Current Accuracy", value: 83, suffix: "%", trend: "+13% since start" },
            { label: "Best Prompt", value: 0, suffix: "", trend: "v2.3 active", isText: true },
            { label: "Data Points", value: 1250, suffix: "", trend: "+24 today" },
            { label: "Week-over-week", value: 1, suffix: "%", trend: "↑ improving" },
          ].map((m, i) => (
            <div key={m.label} className="flex-1 flex">
              {i > 0 && <div style={{ width: "1px", background: "var(--border)", flexShrink: 0 }} />}
              <div className="p-4 flex-1" style={{ background: "var(--card)" }}>
                <p className="text-[10px] font-mono mb-1" style={{ color: "var(--muted-foreground)" }}>{m.label}</p>
                <p className="text-2xl font-mono font-semibold" style={{ color: "var(--foreground)" }}>
                  {m.isText ? "v2.3" : <AnimatedCounter value={m.value} suffix={m.suffix} />}
                </p>
                <p className="text-[10px] font-mono mt-1 flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                  <TrendingUp size={9} /> {m.trend}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left */}
          <div className="space-y-4">
            {/* Line chart */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>
                Model Performance Over Time
              </h3>
              <LineChart />
            </div>

            {/* Prompt version log */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted-foreground)" }}>
                Prompt Version History
              </h3>
              <motion.div variants={container} initial="hidden" animate="show" className="relative">
                {/* Connector line */}
                <div className="absolute left-[18px] top-4 bottom-4 w-px" style={{ background: "var(--border)" }} />
                <div className="space-y-4">
                  {promptVersions.map((v) => (
                    <motion.div key={v.version} variants={item} className="flex items-start gap-4">
                      <div className="w-9 h-9 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 z-10"
                        style={{ background: v.current ? "var(--foreground)" : "var(--muted)", border: "1px solid var(--border)", color: v.current ? "var(--card)" : "var(--muted-foreground)" }}>
                        {v.version}
                      </div>
                      <div className="flex-1 pt-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{v.week}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 font-semibold"
                            style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                            {v.accuracy}% {v.current && "· current"}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{v.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Error patterns */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Where the Model Struggles</h3>
                <AlertTriangle size={14} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {errorPatterns.map((e) => (
                  <motion.div key={e.label} variants={item}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{e.label}</span>
                        <span className="text-[10px] font-mono ml-2" style={{ color: "var(--muted-foreground)" }}>{e.desc}</span>
                      </div>
                      <span className="text-xs font-mono font-bold" style={{ color: "var(--foreground)" }}>{e.pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                      <motion.div
                        className="h-full"
                        style={{ background: "var(--foreground)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${e.pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Feedback queue */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>Outcome Feedback</h3>
                <BrainCircuit size={14} style={{ color: "var(--muted-foreground)" }} />
              </div>
              <p className="text-[10px] font-mono mb-4" style={{ color: "var(--muted-foreground)" }}>
                Confirm outcomes to improve future predictions
              </p>
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
                <AnimatePresence>
                  {feedbackItems.map((a) => (
                    <motion.div key={a.id} variants={item} layout
                      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                      className="flex items-center gap-3 p-2.5"
                      style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                      <div className="w-7 h-7 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0"
                        style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}>
                        {a.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>{a.client}</div>
                        <div className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{a.service} · {a.risk}% predicted</div>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setFeedbackItems((f) => f.filter((x) => x.id !== a.id))}
                          className="w-7 h-7 flex items-center justify-center"
                          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                          <ThumbsUp size={12} />
                        </button>
                        <button
                          onClick={() => setFeedbackItems((f) => f.filter((x) => x.id !== a.id))}
                          className="w-7 h-7 flex items-center justify-center"
                          style={{ background: "var(--card)", border: "1px solid var(--border)", color: "#ef4444" }}>
                          <ThumbsDown size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {feedbackItems.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-4">
                    <CheckCircle2 size={24} className="mx-auto mb-2" style={{ color: "var(--muted-foreground)" }} />
                    <p className="text-xs font-mono font-medium" style={{ color: "var(--muted-foreground)" }}>All caught up!</p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Next steps */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted-foreground)" }}>Recommended Next Steps</h3>
              <div style={{ border: "1px solid var(--border)" }}>
                {nextSteps.map((s, i) => (
                  <div key={s.label}>
                    {i > 0 && <div style={{ height: "1px", background: "var(--border)" }} />}
                    <div className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{s.label}</div>
                        <div className="text-[10px] font-mono" style={{ color: "var(--muted-foreground)" }}>{s.desc}</div>
                      </div>
                      <ArrowRight size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
