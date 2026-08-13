export const SUPPORT_BRAND = "#5D3A1A";
export const SUPPORT_BRAND_LIGHT = "#F5F0E6";

export type SupportMessage = {
  id: string;
  sender: "user" | "support" | string;
  body: string;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  body?: string;
  orderId?: string | number | null;
  status: string;
  createdAt: string;
  updatedAt?: string;
  messages?: SupportMessage[];
  rating?: number | null;
  evaluated?: boolean;
  attachmentCount?: number;
};

export function formatTicketDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ticketStatusGroup(status: string): "open" | "replied" | "solved" {
  const s = (status || "").toLowerCase();
  if (s.includes("çöz") || s.includes("coz") || s === "solved" || s === "closed") return "solved";
  if (s.includes("yanıt") || s.includes("yanit") || s === "replied") return "replied";
  return "open";
}

export function statusLabelTr(status: string) {
  const g = ticketStatusGroup(status);
  if (g === "solved") return "Çözüldü";
  if (g === "replied") return "Yanıtlandı";
  return "İnceleniyor";
}

export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  const r = await fetch("/api/customer/support-tickets", { credentials: "include" });
  if (!r.ok) return [];
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchSupportTicket(id: string): Promise<SupportTicket | null> {
  const r = await fetch(`/api/customer/support-tickets/${encodeURIComponent(id)}`, {
    credentials: "include",
  });
  if (!r.ok) return null;
  return r.json();
}
