"use client";

import { motion } from "framer-motion";
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  BarChart3,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Settings,
  Scissors,
  Stethoscope,
  Dumbbell,
  Briefcase,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Appointments", href: "/appointments" },
  { icon: BrainCircuit, label: "Predictions", href: "/predictions" },
  { icon: MessageSquare, label: "Chat", href: "/chat" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Zap, label: "Actions", href: "/actions" },
  { icon: ShieldCheck, label: "Accuracy", href: "/accuracy" },
];

const industries = [
  { icon: Scissors, label: "Salon" },
  { icon: Stethoscope, label: "Medical" },
  { icon: Dumbbell, label: "Fitness" },
  { icon: Briefcase, label: "Consulting" },
  { icon: Ticket, label: "Events" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 280, damping: 24 } },
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="w-64 flex-shrink-0 flex flex-col h-full z-20 relative"
      style={{
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid var(--glass-border)",
      }}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c5cbf, #e85d8a)" }}
          >
            <HeartPulse size={16} color="#fff" />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Predict<span style={{ color: "var(--accent-purple)" }}>AI</span>
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              No-Show Intelligence
            </div>
          </div>
        </motion.div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <motion.ul
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-1"
        >
          {navItems.map((nav) => {
            const active = pathname === nav.href;
            return (
              <motion.li key={nav.label} variants={item}>
                <Link href={nav.href}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                    style={
                      active
                        ? { background: "var(--accent-purple-light)", color: "var(--accent-purple)" }
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    <nav.icon size={17} />
                    {nav.label}
                    {active && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent-purple)" }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Industry filter */}
        <div className="mt-6 px-3">
          <div className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            Industry
          </div>
          {industries.map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ x: 3 }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              <Icon size={13} />
              {label}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="p-4 mx-3 mb-4 rounded-2xl" style={{ background: "var(--accent-purple-light)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7c5cbf,#e85d8a)" }}
          >
            SR
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              Sarah R.
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Studio Manager
            </div>
          </div>
          <Settings size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        </div>
      </div>
    </motion.aside>
  );
}
