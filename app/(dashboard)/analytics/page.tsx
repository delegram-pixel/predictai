"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Bell, TrendingUp, BarChart3, Target, Activity, ChevronDown } from "lucide-react";
import { GlowCard, AnimatedCounter } from "@/components/ui/primitives";
import { accuracyHistory, cancellationTrend, riskDistribution } from "@/lib/data";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart() {
  const W = 520, H = 180, PAD = { t: 16, r: 16, b: 36, l: 36 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  const minV = 55, maxV = 90;
  const toX = (i: number) => PAD.l + (i / (accuracyHistory.length - 1)) * iW;
  const toY = (v: number) => PAD.t + iH - ((v - minV) / (maxV - minV)) * iH;

  const buildPath = (key: "accuracy" | "precision" | "recall") =>
    accuracyHistory.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d[key])}`).join(" ");

  const lines = [
    { key: "accuracy" as const, color: "#7c5cbf", label: "Accuracy" },
    { key: "precision" as const, color: "#e85d8a", label: "Precision" },
    { key: "recall" as const, color: "#2eb88a", label: "Recall" },
  ];

  return (
    <div className="overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 320 }}>
        {/* Grid lines */}
        {[60, 70, 80, 90].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)}
              stroke="rgba(124,92,191,0.08)" strokeWidth="1" strokeDasharray="4 4"
            />
            <text x={PAD.l - 6} y={toY(v) + 4} textAnchor="end"
              fontSize="9" fill="var(--text-muted)">{v}%</text>
          </g>
        ))}

        {/* X axis labels */}
        {accuracyHistory.map((d, i) => (
          <text key={d.week} x={toX(i)} y={H - 6} textAnchor="middle"
            fontSize="9" fill="var(--text-muted)">{d.week}</text>
        ))}

        {/* Lines */}
        {lines.map(({ key, color }) => {
          const pathD = buildPath(key);
          return (
            <motion.path
              key={key}
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
            />
          );
        })}

        {/* Dots */}
        {lines.map(({ key, color }, li) =>
          accuracyHistory.map((d, i) => (
            <motion.circle
              key={`${key}-${i}`}
              cx={toX(i)} cy={toY(d[key])} r={4}
              fill="#fff" stroke={color} strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + li * 0.1 + i * 0.07 }}
            />
          ))
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 px-1">
        {lines.map(({ key, color, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ background: color }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SVG Area Chart ───────────────────────────────────────────────────────────
function AreaChart() {
  const W = 520, H = 160, PAD = { t: 16, r: 16, b: 36, l: 36 };
  const iW = W - PAD.l - PAD.r;
  const iH = H - PAD.t - PAD.b;

  const minV = 0, maxV = 35;
  const toX = (i: number) => PAD.l + (i / (cancellationTrend.length - 1)) * iW;
  const toY = (v: number) => PAD.t + iH - ((v - minV) / (maxV - minV)) * iH;

  const linePath = cancellationTrend
    .map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.rate)}`).join(" ");

  const areaPath =
    `M${toX(0)},${PAD.t + iH} ` +
    cancellationTrend.map((d, i) => `L${toX(i)},${toY(d.rate)}`).join(" ") +
    ` L${toX(cancellationTrend.length - 1)},${PAD.t + iH} Z`;

  return (
    <div className="overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[10, 20, 30].map((v) => (
          <g key={v}>
            <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)}
              stroke="rgba(239,68,68,0.08)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD.l - 6} y={toY(v) + 4} textAnchor="end"
              fontSize="9" fill="var(--text-muted)">{v}%</text>
          </g>
        ))}

        {/* X labels */}
        {cancellationTrend.map((d, i) => (
          <text key={d.month} x={toX(i)} y={H - 6} textAnchor="middle"
            fontSize="9" fill="var(--text-muted)">{d.month}</text>
        ))}

        {/* Area fill */}
        <motion.path
          d={areaPath} fill="url(#areaGrad)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        {/* Line */}
        <motion.path
          d={linePath} fill="none" stroke="#ef4444" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Dots */}
        {cancellationTrend.map((d, i) => (
          <motion.circle key={d.month}
            cx={toX(i)} cy={toY(d.rate)} r={4}
            fill="#fff" stroke="#ef4444" strokeWidth="2"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Risk Distribution bars ───────────────────────────────────────────────────
function RiskBars() {
  return (
    <div className="space-y-4 mt-2">
      {riskDistribution.map((item, i) => (
        <motion.div key={item.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.12 }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {item.label}
            </span>
            <span className="text-sm font-bold" style={{ color: item.color }}>
              {item.value}%
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + i * 0.15 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Top Risk Factors ─────────────────────────────────────────────────────────
const riskFactors = [
  { label: "Friday evenings", pct: 74, badge: "High" },
  { label: "Same-day bookings", pct: 68, badge: "High" },
  { label: "First-time clients", pct: 61, badge: "High" },
  { label: "No prepayment", pct: 54, badge: "Medium" },
  { label: "Monday mornings", pct: 41, badge: "Medium" },
];

function RiskFactors() {
  const badgeColor = (b: string) => b === "High" ? "#ef4444" : "#f59e0b";
  const badgeBg = (b: string) => b === "High" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";

  return (
    <div className="space-y-3 mt-2">
      {riskFactors.map((f, i) => (
        <motion.div key={f.label}
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "var(--accent-purple-light)", color: "var(--accent-purple)" }}>
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {f.label}
              </span>
              <span className="text-xs font-semibold ml-2 px-2 py-0.5 rounded-full shrink-0"
                style={{ background: badgeBg(f.badge), color: badgeColor(f.badge) }}>
                {f.badge}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, var(--accent-purple), ${badgeColor(f.badge)})` }}
                initial={{ width: 0 }}
                animate={{ width: `${f.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + i * 0.1 }}
              />
            </div>
          </div>
          <span className="text-xs font-bold shrink-0 w-9 text-right"
            style={{ color: "var(--text-muted)" }}>{f.pct}%</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Confusion Matrix ─────────────────────────────────────────────────────────
function ConfusionMatrix() {
  const cells = [
    { label: "True Positive", value: 183, sub: "Correct no-show prediction", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
    { label: "False Positive", value: 42, sub: "Predicted no-show, showed up", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
    { label: "False Negative", value: 38, sub: "Missed no-show prediction", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
    { label: "True Negative", value: 987, sub: "Correct show-up prediction", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {cells.map((c, i) => (
        <motion.div key={c.label}
          className="rounded-xl p-3 text-center"
          style={{ background: c.bg, border: `1px solid ${c.color}22` }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.1 }}
        >
          <div className="text-2xl font-bold" style={{ color: c.color }}>
            <AnimatedCounter value={c.value} />
          </div>
          <div className="text-xs font-semibold mt-0.5" style={{ color: c.color }}>{c.label}</div>
          <div className="text-[10px] mt-0.5 leading-tight" style={{ color: "var(--text-muted)" }}>{c.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({
  icon, label, value, suffix = "%", trend, delay = 0,
}: {
  icon: React.ReactNode; label: string; value: number; suffix?: string;
  trend: string; delay?: number;
}) {
  return (
    <motion.div {...fadeUp(delay)}>
      <GlowCard className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent-purple-light)", color: "var(--accent-purple)" }}>
            {icon}
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
            {trend}
          </span>
        </div>
        <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          <AnimatedCounter value={value} suffix={suffix} />
        </div>
        <div className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>{label}</div>
      </GlowCard>
    </motion.div>
  );
}

// ─── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({
  title, icon, children, delay = 0,
}: {
  title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div {...fadeUp(delay)}>
      <GlowCard className="p-5 h-full">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: "var(--accent-purple)" }}>{icon}</span>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
        </div>
        {children}
      </GlowCard>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <main className="flex-1 overflow-y-auto" style={{ padding: "28px 28px 48px" }}>

      {/* TopBar */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "'Instrument Serif', serif", color: "var(--text-primary)" }}>
            Analytics
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Last 8 weeks · prompt v2.3
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center glass"
            style={{ color: "var(--text-secondary)" }}
          >
            <Bell size={16} />
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-sm font-medium cursor-pointer select-none"
            style={{ color: "var(--text-secondary)" }}
          >
            Last 30 days
            <ChevronDown size={14} />
          </motion.div>
        </div>
      </motion.div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard icon={<Target size={16} />} label="Overall Accuracy" value={83} trend="+13% since start" delay={0.05} />
        <MetricCard icon={<BarChart3 size={16} />} label="Precision" value={77} trend="+15% since start" delay={0.1} />
        <MetricCard icon={<Activity size={16} />} label="Recall" value={76} trend="+18% since start" delay={0.15} />
        <MetricCard icon={<TrendingUp size={16} />} label="F1 Score" value={76} trend="+16% since start" delay={0.2} />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Left column */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Model Performance Over Time" icon={<Activity size={15} />} delay={0.25}>
            <LineChart />
          </SectionCard>

          <SectionCard title="Cancellation Rate Trend" icon={<TrendingUp size={15} />} delay={0.3}>
            <AreaChart />
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Cancellation rate dropped from 28% → 17% over 5 months.
            </p>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <SectionCard title="Risk Distribution" icon={<BarChart3 size={15} />} delay={0.3}>
            <RiskBars />
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              Based on {183 + 42 + 38 + 987} appointments in the last 30 days.
            </p>
          </SectionCard>

          <SectionCard title="Top Risk Factors" icon={<TrendingUp size={15} />} delay={0.35}>
            <RiskFactors />
          </SectionCard>

          <SectionCard title="Confusion Matrix (Last 30 days)" icon={<Target size={15} />} delay={0.4}>
            <ConfusionMatrix />
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
              Total predictions: 1,250 · Overall accuracy 93.6%
            </p>
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
