"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  TrendingUp,
  BarChart2,
  Zap,
  Target,
  Moon,
  Sun,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/appointments", icon: CalendarDays, label: "Appointments" },
  { href: "/predictions", icon: Target, label: "Predictions" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/actions", icon: Zap, label: "Actions" },
  { href: "/accuracy", icon: TrendingUp, label: "Accuracy" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside
      style={{ width: 200, background: "var(--sidebar)", borderRight: "1px solid var(--border)" }}
      className="flex flex-col h-full shrink-0"
    >
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[var(--border)]">
        <div className="text-xs font-mono font-semibold tracking-widest uppercase text-[var(--foreground)]">
          PredictAI
        </div>
        <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
          No-Show Intelligence
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-4 py-2 text-xs transition-colors"
              style={{
                color: active ? "var(--foreground)" : "var(--muted-foreground)",
                background: active ? "var(--muted)" : "transparent",
              }}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer: user + theme toggle */}
      <div className="px-4 py-3 space-y-3">
        {/* User */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-semibold"
            style={{ background: "var(--border)", color: "var(--foreground)" }}
          >
            SR
          </div>
          <div>
            <div className="text-xs text-[var(--foreground)]">Sarah R.</div>
            <div className="text-[10px] text-[var(--muted-foreground)]">Studio Manager</div>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)]">
            {theme === "dark" ? <Moon size={11} /> : <Sun size={11} />}
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </div>
          <Switch
            checked={theme === "light"}
            onCheckedChange={toggleTheme}
            aria-label="Toggle theme"
          />
        </div>
      </div>
    </aside>
  );
}
