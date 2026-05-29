"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Phone,
  MessageCircle,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { appointments } from "@/lib/data";
import type { Appointment } from "@/lib/data";

// ── Helpers ────────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: string }) {
  if (level === "HIGH")
    return (
      <Badge variant="high" className="rounded-none">
        HIGH
      </Badge>
    );
  if (level === "MEDIUM")
    return (
      <Badge variant="medium" className="rounded-none">
        MED
      </Badge>
    );
  return (
    <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>
      LOW
    </span>
  );
}

function ActionLabel({ rec }: { rec: string }) {
  if (rec === "PERSONAL_CALL")
    return (
      <>
        <Phone size={11} className="mr-1" /> Call
      </>
    );
  if (rec === "SEND_SMS_CONFIRMATION")
    return (
      <>
        <MessageCircle size={11} className="mr-1" /> SMS
      </>
    );
  if (rec === "REQUIRE_PREPAYMENT")
    return (
      <>
        <CreditCard size={11} className="mr-1" /> Prepay
      </>
    );
  return (
    <>
      <CheckCircle size={11} className="mr-1" /> No Action
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [alertIndex, setAlertIndex] = useState(0);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const highRisk = appointments.filter((a) => a.riskLevel === "HIGH");
  const todayAppts = appointments.filter((a) => a.date === "2025-05-21");
  const currentAlert = highRisk[alertIndex];

  const filtered =
    search.length > 0
      ? appointments.filter(
          (a) =>
            a.client.toLowerCase().includes(search.toLowerCase()) ||
            a.service.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  const STATS = [
    { label: "Accuracy", value: "94.2%", sub: "+1.3% vs last week" },
    { label: "Predictions Today", value: "18", sub: `${highRisk.length} high risk` },
    { label: "Cancelled Caught", value: "7", sub: "87% recall rate" },
  ];

  const INSIGHTS = [
    { label: "Same-day bookings", stat: "3.2×", sub: "higher no-show rate" },
    { label: "First-time clients", stat: "67%", sub: "cancel without notice" },
  ];

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header
        className="flex items-center gap-3 px-5 h-11 shrink-0 relative"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="text-xs font-mono uppercase tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          Dashboard
        </span>
        <div className="ml-auto w-52 relative">
          <Command>
            <CommandInput
              placeholder="Search clients..."
              value={search}
              onValueChange={setSearch}
            />
          </Command>
          {search.length > 0 && (
            <div
              className="absolute top-full right-0 z-50 w-52 mt-1"
              style={{ border: "1px solid var(--border)", background: "var(--card)" }}
            >
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                {filtered.map((a) => (
                  <CommandItem
                    key={a.id}
                    onSelect={() => {
                      setSelectedAppt(a);
                      setSearch("");
                    }}
                  >
                    <span className="mr-2">{a.client}</span>
                    <span style={{ color: "var(--muted-foreground)" }}>{a.time}</span>
                  </CommandItem>
                ))}
              </CommandList>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-5 space-y-5">

        {/* ── 3 Stat Cards ─────────────────────────────────── */}
        <div
          className="grid grid-cols-3"
          style={{ border: "1px solid var(--border)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="p-4"
              style={{
                background: "var(--card)",
                borderRight: i < 2 ? "1px solid var(--border)" : undefined,
              }}
            >
              <div
                className="text-[10px] uppercase tracking-widest font-mono"
                style={{ color: "var(--muted-foreground)" }}
              >
                {s.label}
              </div>
              <div className="font-mono text-3xl font-semibold mt-1">
                {s.value}
              </div>
              <div
                className="text-[11px] font-mono mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── Priority Alert ───────────────────────────────── */}
        {currentAlert && (
          <Card
            className="rounded-none"
            style={{ borderLeft: "2px solid #ef4444" }}
          >
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={12} className="text-red-500 shrink-0" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-500">
                    Priority Alert
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {alertIndex + 1}/{highRisk.length}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{currentAlert.client}</span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {currentAlert.service} · {currentAlert.time}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-sm font-semibold text-red-500">
                    {currentAlert.risk}%
                  </span>
                  <Progress value={currentAlert.risk} className="w-24 h-px" />
                  <span
                    className="text-[11px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {currentAlert.factors[0]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button variant="outline" size="sm" className="rounded-none text-xs">
                  <ActionLabel rec={currentAlert.recommendation} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() => setAlertIndex((i) => Math.max(0, i - 1))}
                  disabled={alertIndex === 0}
                >
                  <ChevronLeft size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  onClick={() =>
                    setAlertIndex((i) => Math.min(highRisk.length - 1, i + 1))
                  }
                  disabled={alertIndex === highRisk.length - 1}
                >
                  <ChevronRight size={13} />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Today's Appointments ─────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] uppercase tracking-widest font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              Today&apos;s Appointments
            </span>
            <span
              className="text-[10px] font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              {todayAppts.length} scheduled
            </span>
          </div>

          <div style={{ border: "1px solid var(--border)" }}>
            {todayAppts.map((appt, i) => (
              <div
                key={appt.id}
                onClick={() => setSelectedAppt(appt)}
                className="flex items-center px-4 py-2.5 cursor-pointer transition-colors"
                style={{
                  borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                  background: "var(--card)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "var(--muted)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "var(--card)")
                }
              >
                <div
                  className="w-5 h-5 flex items-center justify-center text-[10px] font-mono shrink-0"
                  style={{
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {appt.initials}
                </div>
                <span className="ml-3 text-sm flex-1">{appt.client}</span>
                <span
                  className="font-mono text-xs mr-4"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {appt.time}
                </span>
                <RiskBadge level={appt.riskLevel} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Pattern Insights (collapsible, max 2) ────────── */}
        <div>
          <button
            className="flex items-center justify-between w-full mb-2"
            onClick={() => setInsightsOpen((o) => !o)}
          >
            <span
              className="text-[10px] uppercase tracking-widest font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              Pattern Insights
            </span>
            <ChevronRight
              size={13}
              style={{
                color: "var(--muted-foreground)",
                transform: insightsOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 150ms",
              }}
            />
          </button>

          {insightsOpen && (
            <div
              className="grid grid-cols-2"
              style={{ border: "1px solid var(--border)" }}
            >
              {INSIGHTS.map((ins, i) => (
                <div
                  key={ins.label}
                  className="p-4"
                  style={{
                    background: "var(--card)",
                    borderRight: i === 0 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <div
                    className="text-[11px]"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {ins.label}
                  </div>
                  <div className="font-mono text-2xl font-semibold mt-1">
                    {ins.stat}
                  </div>
                  <div
                    className="text-[11px] font-mono"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {ins.sub}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Floating Chat ────────────────────────────────────────── */}
      <button
        className="fixed bottom-5 right-5 w-9 h-9 flex items-center justify-center transition-colors"
        title="Open chat"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--muted-foreground)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "var(--muted)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = "var(--card)")
        }
      >
        <MessageSquare size={15} />
      </button>

      {/* ── Appointment Detail Sheet ─────────────────────────────── */}
      <Sheet open={!!selectedAppt} onOpenChange={() => setSelectedAppt(null)}>
        <SheetContent>
          {selectedAppt && (
            <div className="space-y-4">
              <SheetTitle className="sr-only">Appointment Detail</SheetTitle>

              {/* client header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center text-xs font-mono font-semibold shrink-0"
                  style={{ background: "var(--muted)", color: "var(--foreground)" }}
                >
                  {selectedAppt.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{selectedAppt.client}</div>
                  <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {selectedAppt.service}
                  </div>
                </div>
                <RiskBadge level={selectedAppt.riskLevel} />
              </div>

              <Separator />

              {/* meta grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Time", value: selectedAppt.time },
                  { label: "Date", value: selectedAppt.date },
                  { label: "Industry", value: selectedAppt.industry },
                  { label: "Status", value: selectedAppt.status },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div
                      className="text-[10px] uppercase tracking-widest font-mono"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {label}
                    </div>
                    <div className="font-mono text-sm mt-0.5">{value}</div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* risk score */}
              <div>
                <div
                  className="text-[10px] uppercase tracking-widest font-mono mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Risk Score
                </div>
                <div
                  className="font-mono text-2xl font-semibold mb-2"
                  style={{
                    color:
                      selectedAppt.riskLevel === "HIGH"
                        ? "#ef4444"
                        : selectedAppt.riskLevel === "MEDIUM"
                        ? "#f59e0b"
                        : "var(--foreground)",
                  }}
                >
                  {selectedAppt.risk}%
                </div>
                <Progress value={selectedAppt.risk} className="h-1" />
              </div>

              {/* factors */}
              <div>
                <div
                  className="text-[10px] uppercase tracking-widest font-mono mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Risk Factors
                </div>
                <div className="space-y-1">
                  {selectedAppt.factors.map((f) => (
                    <div
                      key={f}
                      className="text-xs font-mono px-2 py-1"
                      style={{
                        border: "1px solid var(--border)",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* recommended action */}
              <div>
                <div
                  className="text-[10px] uppercase tracking-widest font-mono mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Recommended Action
                </div>
                <Button
                  className="w-full rounded-none text-xs"
                  variant={selectedAppt.riskLevel === "HIGH" ? "default" : "outline"}
                >
                  <ActionLabel rec={selectedAppt.recommendation} />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
