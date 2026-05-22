"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useInView,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Calendar,
  MessageSquare,
  Settings,
  Search,
  Users,
  Bell,
  ChevronRight,
  Phone,
  Mail,
  Send,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Scissors,
  Dumbbell,
  Stethoscope,
  Briefcase,
  Ticket,
  MoreHorizontal,
  Zap,
  BarChart3,
  BrainCircuit,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const appointments = [
  {
    id: "APT-001",
    client: "Marcus Webb",
    initials: "MW",
    service: "Hair Color",
    time: "09:00 AM",
    risk: 87,
    riskLevel: "HIGH",
    confidence: "HIGH",
    factors: ["First-time client", "Same-day booking", "Monday morning"],
    recommendation: "PERSONAL_CALL",
    avatar: "#7c5cbf",
    industry: "salon",
  },
  {
    id: "APT-002",
    client: "Priya Nair",
    initials: "PN",
    service: "Consultation",
    time: "10:30 AM",
    risk: 62,
    riskLevel: "MEDIUM",
    confidence: "HIGH",
    factors: ["2 reschedules in 3 months", "Friday afternoon"],
    recommendation: "SEND_SMS_CONFIRMATION",
    avatar: "#e85d8a",
    industry: "medical",
  },
  {
    id: "APT-003",
    client: "Tom Erikson",
    initials: "TE",
    service: "Personal Training",
    time: "11:00 AM",
    risk: 23,
    riskLevel: "LOW",
    confidence: "MEDIUM",
    factors: ["Prepaid package", "Regular customer (18 visits)"],
    recommendation: "NO_ACTION",
    avatar: "#2eb88a",
    industry: "fitness",
  },
  {
    id: "APT-004",
    client: "Ava Chen",
    initials: "AC",
    service: "Dermatology",
    time: "01:00 PM",
    risk: 74,
    riskLevel: "HIGH",
    confidence: "MEDIUM",
    factors: ["Last-minute booking", "No-show history (2x)"],
    recommendation: "REQUIRE_PREPAYMENT",
    avatar: "#f59e0b",
    industry: "medical",
  },
  {
    id: "APT-005",
    client: "Jordan Blake",
    initials: "JB",
    service: "Strategy Session",
    time: "02:30 PM",
    risk: 38,
    riskLevel: "MEDIUM",
    confidence: "HIGH",
    factors: ["Booked 1 week ahead", "New client"],
    recommendation: "SEND_SMS_CONFIRMATION",
    avatar: "#3b82f6",
    industry: "consulting",
  },
  {
    id: "APT-006",
    client: "Nina Osei",
    initials: "NO",
    service: "Haircut",
    time: "04:00 PM",
    risk: 15,
    riskLevel: "LOW",
    confidence: "HIGH",
    factors: ["Loyal client (32 visits)", "Prepaid"],
    recommendation: "NO_ACTION",
    avatar: "#8b5cf6",
    industry: "salon",
  },
];

const patterns = [
  {
    icon: Clock,
    title: "Friday Evening Effect",
    desc: "35% cancel rate vs 15% Wed mornings",
    color: "#ef4444",
    bg: "#fff0f0",
  },
  {
    icon: Users,
    title: "First-Time Clients",
    desc: "58% no-show rate for initial bookings",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: CheckCircle2,
    title: "Prepayment Anchor",
    desc: "Prepaid appointments: 94% attendance rate",
    color: "#10b981",
    bg: "#f0fdf8",
  },
  {
    icon: TrendingDown,
    title: "Same-Day Risk",
    desc: "Bookings <6h away carry 2.4× higher risk",
    color: "#7c5cbf",
    bg: "#ede8ff",
  },
];

const metrics = [
  { label: "Accuracy", value: 78, unit: "%", trend: "+3%", up: true },
  { label: "Predictions Today", value: 24, unit: "", trend: "+6", up: true },
  { label: "Cancelled (caught)", value: 8, unit: "", trend: "83%", up: true },
  { label: "Avg Confidence", value: 91, unit: "%", trend: "+2%", up: true },
];

const industryIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  salon: Scissors,
  medical: Stethoscope,
  fitness: Dumbbell,
  consulting: Briefcase,
  events: Ticket,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Animated counter from 21st.dev pattern
function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
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

// Glow card — 21st.dev pattern
function GlowCard({
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
      className={`relative rounded-2xl overflow-hidden cursor-pointer ${className}`}
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

// Risk ring — heartbeat SVG animation
function RiskRing({ risk, level }: { risk: number; level: string }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const color =
    level === "HIGH" ? "#ef4444" : level === "MEDIUM" ? "#f59e0b" : "#10b981";
  const offset = circ - (risk / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Pulse ring behind */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}` }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.15, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg width="96" height="96" viewBox="0 0 96 96" className="absolute">
        {/* Track */}
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="5"
        />
        {/* Progress */}
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
        <span
          className="text-xl font-bold leading-none"
          style={{ color }}
        >
          {risk}%
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>
          risk
        </span>
      </div>
    </div>
  );
}

// Risk badge
function RiskBadge({ level }: { level: string }) {
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
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: config.color, display: "inline-block" }}
      />
      {config.label} Risk
    </motion.span>
  );
}

// Action pill button — 21st.dev magnetic style
function ActionButton({
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
  function reset() {
    x.set(0);
    y.set(0);
  }

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

// Quick action icon — from the reference image
function QuickAction({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
      >
        <Icon size={18} />
      </div>
      <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
    </motion.button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [selectedApt, setSelectedApt] = useState(appointments[0]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your prediction assistant. Ask me about any appointment risk, patterns, or what actions to take.",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const topApt = appointments[0]; // highest risk

  const filteredApts = appointments.filter(
    (a) =>
      a.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", text: userMsg }]);
    setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `Based on current appointment data, ${userMsg.toLowerCase().includes("risk") ? `the highest-risk appointment today is ${selectedApt.client} at ${selectedApt.risk}% probability. I'd recommend a ${selectedApt.recommendation.replace(/_/g, " ")} immediately.` : "I see patterns suggesting Friday evenings carry 2.3× the cancellation risk of Wednesday mornings. Should I pull a full pattern report?"}`,
        },
      ]);
    }, 800);
  }

  // Stagger container variant
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
  };

  return (
    <>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 flex items-center justify-between px-6 py-4 z-10 relative"
          style={{ borderBottom: "1px solid var(--glass-border)" }}
        >
          <div>
            <h1
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: "Instrument Serif, Georgia, serif",
                color: "var(--text-primary)",
              }}
            >
              Good morning, Sarah
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              · {filteredApts.filter((a) => a.riskLevel === "HIGH").length} high-risk alerts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <Bell size={18} style={{ color: "var(--text-secondary)" }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "var(--risk-high)" }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-secondary)",
              }}
            >
              <RefreshCw size={14} />
              Sync
            </motion.button>
          </div>
        </motion.header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Metrics strip — bento-style from 21st.dev */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-4 gap-3"
          >
            {metrics.map((m) => (
              <motion.div key={m.label} variants={item}>
                <GlowCard className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {m.label}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                      style={{
                        background: m.up ? "var(--risk-low-bg)" : "var(--risk-high-bg)",
                        color: m.up ? "var(--risk-low)" : "var(--risk-high)",
                      }}
                    >
                      {m.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                      {m.trend}
                    </span>
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <AnimatedCounter value={m.value} suffix={m.unit} />
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Hero card — top risk appointment */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 22 }}
          >
            <GlowCard
              glowColor="rgba(239,68,68,0.12)"
              className="p-5 overflow-visible"
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,92,191,0.08) 0%, rgba(232,93,138,0.08) 100%)",
                }}
              />
              <div className="relative flex items-center gap-5">
                {/* Left: Avatar & info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                    style={{ background: topApt.avatar }}
                  >
                    {topApt.initials}
                  </motion.div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{
                          background: "var(--risk-high-bg)",
                          color: "var(--risk-high)",
                        }}
                      >
                        ⚡ Priority Alert
                      </span>
                    </div>
                    <h2 className="text-xl font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {topApt.client}
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {topApt.service} · {topApt.time} · #{topApt.id}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {topApt.factors.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            color: "var(--risk-high)",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center: Risk ring */}
                <div className="flex-shrink-0">
                  <RiskRing risk={topApt.risk} level={topApt.riskLevel} />
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <ActionButton variant="primary">
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} /> Call Now
                    </span>
                  </ActionButton>
                  <ActionButton variant="ghost">
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} /> Send SMS
                    </span>
                  </ActionButton>
                  <ActionButton variant="danger" small>
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle size={11} /> Require Prepay
                    </span>
                  </ActionButton>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Quick actions row — from reference image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-6 px-2"
          >
            {[
              { icon: Send, label: "Send SMS" },
              { icon: Phone, label: "Schedule Call" },
              { icon: Calendar, label: "Reschedule" },
              { icon: Zap, label: "Batch Action" },
              { icon: BarChart3, label: "Run Report" },
              { icon: MoreHorizontal, label: "More" },
            ].map((a) => (
              <QuickAction key={a.label} icon={a.icon} label={a.label} />
            ))}
          </motion.div>

          {/* Two-column: Appointment queue + Pattern insights */}
          <div className="grid grid-cols-2 gap-4">
            {/* Appointment list */}
            <GlowCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  Today&apos;s Appointments
                </h3>
                <div className="flex gap-1">
                  {(["today", "week"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                      style={
                        activeTab === t
                          ? { background: "var(--accent-purple)", color: "#fff" }
                          : { color: "var(--text-muted)" }
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search client or service…"
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none"
                  style={{
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <motion.ul
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                <AnimatePresence>
                  {filteredApts.map((apt) => {
                    const IndustryIcon = industryIcons[apt.industry] || Scissors;
                    return (
                      <motion.li
                        key={apt.id}
                        variants={item}
                        layout
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => setSelectedApt(apt)}
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all"
                        style={
                          selectedApt.id === apt.id
                            ? { background: "var(--accent-purple-light)" }
                            : { background: "rgba(0,0,0,0.02)" }
                        }
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: apt.avatar }}
                        >
                          {apt.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                              {apt.client}
                            </span>
                            <RiskBadge level={apt.riskLevel} />
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <IndustryIcon size={10} />
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {apt.service} · {apt.time}
                            </span>
                          </div>
                        </div>
                        <div
                          className="text-sm font-bold flex-shrink-0"
                          style={{
                            color:
                              apt.riskLevel === "HIGH"
                                ? "var(--risk-high)"
                                : apt.riskLevel === "MEDIUM"
                                ? "var(--risk-medium)"
                                : "var(--risk-low)",
                          }}
                        >
                          {apt.risk}%
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            </GlowCard>

            {/* Pattern insights */}
            <div className="flex flex-col gap-3">
              <GlowCard className="p-4 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Pattern Insights
                  </h3>
                  <motion.button
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Sparkles size={14} style={{ color: "var(--accent-purple)" }} />
                  </motion.button>
                </div>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {patterns.map((p) => (
                    <motion.div
                      key={p.title}
                      variants={item}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer"
                      style={{ background: p.bg }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${p.color}20` }}
                      >
                        <p.icon size={13} style={{ color: p.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                          {p.title}
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {p.desc}
                        </div>
                      </div>
                      <ArrowUpRight size={12} style={{ color: p.color, flexShrink: 0 }} />
                    </motion.div>
                  ))}
                </motion.div>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>

      {/* ── Right Panel ── */}
      <motion.aside
        initial={{ x: 320 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.15 }}
        className="w-80 flex-shrink-0 flex flex-col h-full overflow-hidden z-20 relative"
        style={{
          background: "var(--sidebar-bg)",
          backdropFilter: "blur(24px)",
          borderLeft: "1px solid var(--glass-border)",
        }}
      >
        {/* Selected appointment detail */}
        <div className="p-5 pb-4" style={{ borderBottom: "1px solid var(--glass-border)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Appointment Detail
          </h3>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedApt.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold"
                  style={{ background: selectedApt.avatar }}
                >
                  {selectedApt.initials}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    {selectedApt.client}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {selectedApt.service} · {selectedApt.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <RiskRing risk={selectedApt.risk} level={selectedApt.riskLevel} />
                <div className="flex-1 pl-4 space-y-2">
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                      Risk Level
                    </div>
                    <RiskBadge level={selectedApt.riskLevel} />
                  </div>
                  <div>
                    <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                      Confidence
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {selectedApt.confidence}
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk factors */}
              <div className="space-y-1 mb-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Risk Factors
                </div>
                {selectedApt.factors.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--risk-high)" }} />
                    <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommendation */}
              <div
                className="p-3 rounded-xl mb-3"
                style={{ background: "var(--accent-purple-light)" }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-purple)" }}>
                  Recommended Action
                </div>
                <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  {selectedApt.recommendation.replace(/_/g, " ")}
                </div>
              </div>

              <div className="flex gap-2">
                <ActionButton variant="primary">
                  <span className="flex items-center gap-1">
                    <Zap size={11} /> Act
                  </span>
                </ActionButton>
                <ActionButton variant="ghost">
                  <span className="flex items-center gap-1">
                    <ChevronRight size={11} /> Details
                  </span>
                </ActionButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chat interface */}
        <div className="flex-1 flex flex-col min-h-0 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit size={14} style={{ color: "var(--accent-purple)" }} />
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              AI Assistant
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
            <AnimatePresence initial={false}>
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-relaxed"
                    style={
                      msg.role === "user"
                        ? { background: "var(--accent-purple)", color: "#fff" }
                        : {
                            background: "rgba(0,0,0,0.04)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--glass-border)",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 rounded-2xl p-1 pl-3"
            style={{
              background: "rgba(0,0,0,0.04)",
              border: "1px solid var(--glass-border)",
            }}
          >
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Ask about any appointment…"
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--text-primary)" }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendChat}
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "var(--accent-purple)" }}
            >
              <Send size={12} color="#fff" />
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}