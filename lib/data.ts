// ─── Shared mock data across all dashboard pages ─────────────────────────────

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type Industry = "salon" | "medical" | "fitness" | "consulting" | "events";

export interface Appointment {
  id: string;
  client: string;
  initials: string;
  service: string;
  time: string;
  date: string;
  risk: number;
  riskLevel: RiskLevel;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  factors: string[];
  recommendation: string;
  avatar: string;
  industry: Industry;
  status: "pending" | "confirmed" | "cancelled" | "no_show" | "completed";
}

export const appointments: Appointment[] = [
  {
    id: "APT-001",
    client: "Marcus Webb",
    initials: "MW",
    service: "Hair Color",
    time: "09:00 AM",
    date: "2025-05-21",
    risk: 87,
    riskLevel: "HIGH",
    confidence: "HIGH",
    factors: ["First-time client", "Same-day booking", "Monday morning"],
    recommendation: "PERSONAL_CALL",
    avatar: "#7c5cbf",
    industry: "salon",
    status: "pending",
  },
  {
    id: "APT-002",
    client: "Priya Nair",
    initials: "PN",
    service: "Consultation",
    time: "10:30 AM",
    date: "2025-05-21",
    risk: 62,
    riskLevel: "MEDIUM",
    confidence: "HIGH",
    factors: ["2 reschedules in 3 months", "Friday afternoon"],
    recommendation: "SEND_SMS_CONFIRMATION",
    avatar: "#e85d8a",
    industry: "medical",
    status: "confirmed",
  },
  {
    id: "APT-003",
    client: "Tom Erikson",
    initials: "TE",
    service: "Personal Training",
    time: "11:00 AM",
    date: "2025-05-21",
    risk: 23,
    riskLevel: "LOW",
    confidence: "MEDIUM",
    factors: ["Prepaid package", "Regular customer (18 visits)"],
    recommendation: "NO_ACTION",
    avatar: "#2eb88a",
    industry: "fitness",
    status: "confirmed",
  },
  {
    id: "APT-004",
    client: "Ava Chen",
    initials: "AC",
    service: "Dermatology",
    time: "01:00 PM",
    date: "2025-05-21",
    risk: 74,
    riskLevel: "HIGH",
    confidence: "MEDIUM",
    factors: ["Last-minute booking", "No-show history (2x)"],
    recommendation: "REQUIRE_PREPAYMENT",
    avatar: "#f59e0b",
    industry: "medical",
    status: "pending",
  },
  {
    id: "APT-005",
    client: "Jordan Blake",
    initials: "JB",
    service: "Strategy Session",
    time: "02:30 PM",
    date: "2025-05-21",
    risk: 38,
    riskLevel: "MEDIUM",
    confidence: "HIGH",
    factors: ["Booked 1 week ahead", "New client"],
    recommendation: "SEND_SMS_CONFIRMATION",
    avatar: "#3b82f6",
    industry: "consulting",
    status: "pending",
  },
  {
    id: "APT-006",
    client: "Nina Osei",
    initials: "NO",
    service: "Haircut",
    time: "04:00 PM",
    date: "2025-05-21",
    risk: 15,
    riskLevel: "LOW",
    confidence: "HIGH",
    factors: ["Loyal client (32 visits)", "Prepaid"],
    recommendation: "NO_ACTION",
    avatar: "#8b5cf6",
    industry: "salon",
    status: "confirmed",
  },
  // Past appointments for history/accuracy views
  {
    id: "APT-007",
    client: "Sam Rivera",
    initials: "SR",
    service: "Hair Color",
    time: "10:00 AM",
    date: "2025-05-20",
    risk: 72,
    riskLevel: "HIGH",
    confidence: "HIGH",
    factors: ["Friday booking", "Past cancellation"],
    recommendation: "SEND_SMS_CONFIRMATION",
    avatar: "#ec4899",
    industry: "salon",
    status: "cancelled",
  },
  {
    id: "APT-008",
    client: "Lisa Park",
    initials: "LP",
    service: "Fitness Assessment",
    time: "09:00 AM",
    date: "2025-05-20",
    risk: 18,
    riskLevel: "LOW",
    confidence: "HIGH",
    factors: ["Regular client", "Morning slot"],
    recommendation: "NO_ACTION",
    avatar: "#06b6d4",
    industry: "fitness",
    status: "completed",
  },
  {
    id: "APT-009",
    client: "Dev Patel",
    initials: "DP",
    service: "Legal Consult",
    time: "03:00 PM",
    date: "2025-05-19",
    risk: 55,
    riskLevel: "MEDIUM",
    confidence: "MEDIUM",
    factors: ["New client", "Afternoon booking"],
    recommendation: "SEND_SMS_CONFIRMATION",
    avatar: "#f97316",
    industry: "consulting",
    status: "no_show",
  },
];

export const weekSlots = [
  { day: "Mon", date: "May 19", apts: [appointments[0], appointments[2]] },
  { day: "Tue", date: "May 20", apts: [appointments[1], appointments[5]] },
  { day: "Wed", date: "May 21", apts: [appointments[3]] },
  { day: "Thu", date: "May 22", apts: [appointments[4], appointments[2]] },
  { day: "Fri", date: "May 23", apts: [appointments[0], appointments[1], appointments[3]] },
  { day: "Sat", date: "May 24", apts: [appointments[5]] },
  { day: "Sun", date: "May 25", apts: [] },
];

export const accuracyHistory = [
  { week: "W1", accuracy: 70, precision: 62, recall: 58 },
  { week: "W2", accuracy: 74, precision: 67, recall: 63 },
  { week: "W3", accuracy: 77, precision: 70, recall: 68 },
  { week: "W4", accuracy: 78, precision: 72, recall: 71 },
  { week: "W5", accuracy: 80, precision: 74, recall: 73 },
  { week: "W6", accuracy: 79, precision: 73, recall: 72 },
  { week: "W7", accuracy: 82, precision: 76, recall: 75 },
  { week: "W8", accuracy: 83, precision: 77, recall: 76 },
];

export const cancellationTrend = [
  { month: "Jan", rate: 28 },
  { month: "Feb", rate: 24 },
  { month: "Mar", rate: 22 },
  { month: "Apr", rate: 19 },
  { month: "May", rate: 17 },
];

export const riskDistribution = [
  { label: "Low (<30%)", value: 40, color: "#10b981" },
  { label: "Medium (30-70%)", value: 35, color: "#f59e0b" },
  { label: "High (>70%)", value: 25, color: "#ef4444" },
];

export const pendingActions = [
  {
    id: "ACT-001",
    aptId: "APT-001",
    client: "Marcus Webb",
    initials: "MW",
    avatar: "#7c5cbf",
    type: "PERSONAL_CALL",
    label: "Personal Call",
    icon: "phone",
    scheduledFor: "08:30 AM",
    status: "pending",
    risk: 87,
  },
  {
    id: "ACT-002",
    aptId: "APT-002",
    client: "Priya Nair",
    initials: "PN",
    avatar: "#e85d8a",
    type: "SEND_SMS_CONFIRMATION",
    label: "SMS Confirmation",
    icon: "sms",
    scheduledFor: "09:30 AM",
    status: "sent",
    risk: 62,
  },
  {
    id: "ACT-003",
    aptId: "APT-004",
    client: "Ava Chen",
    initials: "AC",
    avatar: "#f59e0b",
    type: "REQUIRE_PREPAYMENT",
    label: "Require Prepayment",
    icon: "card",
    scheduledFor: "12:00 PM",
    status: "pending",
    risk: 74,
  },
  {
    id: "ACT-004",
    aptId: "APT-005",
    client: "Jordan Blake",
    initials: "JB",
    avatar: "#3b82f6",
    type: "SEND_SMS_CONFIRMATION",
    label: "SMS Confirmation",
    icon: "sms",
    scheduledFor: "01:30 PM",
    status: "delivered",
    risk: 38,
  },
];
