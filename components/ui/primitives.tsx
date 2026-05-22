"use client";

import { useRef, useEffect } from "react";
import { motion, useSpring, useInView, useMotionValue, useTransform } from "framer-motion";

// ─── GlowCard ────────────────────────────────────────────────────────────────
export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(124, 92, 191, 0.15)",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow)",
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `radial-gradient(300px circle at ${x}px ${y}px, ${glowColor}, transparent 70%)`,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      {children}
    </motion.div>
  );
}

// ─── AnimatedCounter ─────────────────────────────────────────────────────────
export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  const display = useTransform(spring, (v) => Math.round(v).toString());

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// ─── RiskRing ─────────────────────────────────────────────────────────────────
export function RiskRing({ risk, level }: { risk: number; level: string }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const color =
    level === "HIGH" ? "#ef4444" : level === "MEDIUM" ? "#f59e0b" : "#10b981";
  const offset = circ - (risk / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}` }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.15, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg width="96" height="96" viewBox="0 0 96 96" className="absolute">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="5" />
        <motion.circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{ transformOrigin: "center", rotate: "-90deg" }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-xl font-bold leading-none" style={{ color }}>
          {risk}%
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>
          risk
        </span>
      </div>
    </div>
  );
}

// ─── RiskBadge ────────────────────────────────────────────────────────────────
export function RiskBadge({ level }: { level: string }) {
  const config = {
    HIGH: { bg: "var(--risk-high-bg)", color: "var(--risk-high)", label: "High" },
    MEDIUM: { bg: "var(--risk-medium-bg)", color: "var(--risk-medium)", label: "Medium" },
    LOW: { bg: "var(--risk-low-bg)", color: "var(--risk-low)", label: "Low" },
  }[level] ?? { bg: "#f3f4f6", color: "#6b7280", label: level };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: config.bg, color: config.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.color, display: "inline-block" }} />
      {config.label}
    </motion.span>
  );
}

// ─── ActionButton ─────────────────────────────────────────────────────────────
export function ActionButton({
  children,
  variant = "primary",
  onClick,
  small,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  onClick?: () => void;
  small?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }
  function reset() { x.set(0); y.set(0); }

  const styles = {
    primary: { background: "var(--accent-purple)", color: "#fff" },
    ghost: { background: "rgba(124,92,191,0.08)", color: "var(--accent-purple)" },
    danger: { background: "rgba(239,68,68,0.08)", color: "var(--risk-high)" },
  }[variant];

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x: springX, y: springY, ...styles }}
      whileTap={{ scale: 0.96 }}
      className={`rounded-xl font-semibold transition-shadow hover:shadow-lg ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
    >
      {children}
    </motion.button>
  );
}

// ─── MeshBackground ───────────────────────────────────────────────────────────
export function MeshBackground() {
  return (
    <>
      <div className="mesh-blob w-96 h-96 opacity-50" style={{ background: "#c4b5fd", top: "-5%", left: "10%" }} />
      <div className="mesh-blob w-80 h-80 opacity-40" style={{ background: "#fbcfe8", top: "30%", right: "5%" }} />
      <div className="mesh-blob w-72 h-72 opacity-35" style={{ background: "#a7f3d0", bottom: "5%", left: "30%" }} />
    </>
  );
}

// ─── StatusChip ───────────────────────────────────────────────────────────────
export function StatusChip({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: "#fef3c7", color: "#d97706", label: "Pending" },
    confirmed: { bg: "#d1fae5", color: "#059669", label: "Confirmed" },
    cancelled: { bg: "#fee2e2", color: "#dc2626", label: "Cancelled" },
    no_show: { bg: "#fce7f3", color: "#db2777", label: "No-show" },
    completed: { bg: "#dbeafe", color: "#2563eb", label: "Completed" },
    sent: { bg: "#e0e7ff", color: "#4f46e5", label: "Sent" },
    delivered: { bg: "#d1fae5", color: "#059669", label: "Delivered" },
  };
  const c = config[status] ?? { bg: "#f3f4f6", color: "#6b7280", label: status };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}
