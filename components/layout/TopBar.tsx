"use client";

import { motion } from "framer-motion";
import { Bell, RefreshCw } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  alertCount?: number;
}

export default function TopBar({ title, subtitle, alertCount = 0 }: TopBarProps) {
  return (
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
          style={{ fontFamily: "Instrument Serif, Georgia, serif", color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          <Bell size={18} style={{ color: "var(--text-secondary)" }} />
          {alertCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "var(--risk-high)" }}
            />
          )}
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
  );
}
