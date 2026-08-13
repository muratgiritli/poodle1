import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Eye, Loader2, Radio, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type HubTab =
  | "overview"
  | "realtime"
  | "visitors"
  | "sources"
  | "campaigns"
  | "funnel"
  | "products"
  | "integrations";

type DatePreset = "today" | "7d" | "30d" | "custom";

type IntegrationProvider =
  | "ga4"
  | "gtm"
  | "google_ads"
  | "meta_pixel"
  | "meta_capi"
  | "tiktok"
  | "clarity"
  | "yandex_metrica"
  | "hotjar";

type IntegrationForm = {
  enabled: boolean;
  publicId: string;
  secret?: string;
  hasSecret?: boolean;
};

const TABS: { key: HubTab; label: string }[] = [
  { key: "overview", label: "Genel Bakış" },
  { key: "realtime", label: "Canlı" },
  { key: "visitors", label: "Ziyaretçiler" },
  { key: "sources", label: "Kaynaklar" },
  { key: "campaigns", label: "Kampanyalar" },
  { key: "funnel", label: "Huni" },
  { key: "products", label: "Ürünler" },
  { key: "integrations", label: "Entegrasyonlar" },
];

const INTEGRATION_META: {
  provider: IntegrationProvider;
  title: string;
  hint: string;
  placeholder: string;
}[] = [
  { provider: "ga4", title: "Google Analytics 4", hint: "Measurement ID", placeholder: "G-XXXXXXXXXX" },
  { provider: "gtm", title: "Google Tag Manager", hint: "Container ID", placeholder: "GTM-XXXXXXX" },
  { provider: "google_ads", title: "Google Ads", hint: "Conversion / Ads ID", placeholder: "AW-XXXXXXXXXX" },
  { provider: "meta_pixel", title: "Meta Pixel", hint: "Pixel ID", placeholder: "Pixel ID" },
  { provider: "meta_capi", title: "Meta Conversions API", hint: "Pixel ID + Access Token", placeholder: "Pixel ID" },
  { provider: "tiktok", title: "TikTok Pixel", hint: "Pixel ID", placeholder: "TikTok Pixel ID" },
  { provider: "clarity", title: "Microsoft Clarity", hint: "Project ID", placeholder: "Clarity Project ID" },
  { provider: "yandex_metrica", title: "Yandex Metrica", hint: "Counter ID", placeholder: "Sayaç ID" },
  { provider: "hotjar", title: "Hotjar", hint: "Site ID", placeholder: "Hotjar Site ID" },
];

function todayLocal(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function daysAgoLocal(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return 0;
}

function str(v: unknown, fallback = "-"): string {
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return fallback;
}

function shortId(id: unknown): string {
  const s = str(id, "");
  if (!s) return "-";
  return s.length <= 10 ? s : `${s.slice(0, 8)}…`;
}

function fmtMoney(v: unknown): string {
  const n = num(v);
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " ₺";
}

function fmtPct(v: unknown): string {
  const n = num(v);
  // Accept either 0–1 ratio or 0–100 percent
  const pct = n > 0 && n <= 1 ? n * 100 : n;
  return `${pct.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}%`;
}

function fmtTime(d: unknown): string {
  if (!d) return "-";
  const date = d instanceof Date ? d : new Date(String(d));
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function fmtDuration(seconds: unknown): string {
  const s = Math.max(0, Math.floor(num(seconds)));
  if (s < 60) return `${s} sn`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return `${m} dk ${r} sn`;
  const h = Math.floor(m / 60);
  return `${h} sa ${m % 60} dk`;
}

function metadataSummary(meta: unknown): string {
  if (meta == null) return "-";
  let obj: Record<string, unknown> | null = null;
  if (typeof meta === "string") {
    try {
      obj = JSON.parse(meta);
    } catch {
      return meta.slice(0, 80);
    }
  } else if (typeof meta === "object") {
    obj = meta as Record<string, unknown>;
  }
  if (!obj || Array.isArray(obj)) return "-";
  const keys = Object.keys(obj);
  if (keys.length === 0) return "-";
  return keys
    .slice(0, 4)
    .map((k) => {
      const v = obj![k];
      if (v == null) return k;
      if (typeof v === "object") return `${k}:…`;
      return `${k}=${String(v).slice(0, 24)}`;
    })
    .join(" · ");
}

function asArray(data: unknown, keys: string[] = []): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    for (const k of keys) {
      const v = (data as any)[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function conversionRate(row: any): number {
  if (row?.conversion_rate != null) return num(row.conversion_rate);
  if (row?.conversionRate != null) return num(row.conversionRate);
  const visitors = num(row?.visitors ?? row?.unique_visitors);
  const orders = num(row?.orders ?? row?.purchases);
  if (visitors <= 0) return 0;
  return (orders / visitors) * 100;
}

async function fetchJson(url: string): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(url, { credentials: "include" });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-10 text-sm text-gray-500" data-testid="analytics-empty">
      {text}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = "amber",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "amber" | "blue" | "emerald" | "gray";
}) {
  const color =
    accent === "blue"
      ? "text-blue-600"
      : accent === "emerald"
        ? "text-emerald-700"
        : accent === "gray"
          ? "text-gray-600"
          : "text-amber-900";
  return (
    <div className="rounded-xl border bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub ? <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p> : null}
    </div>
  );
}

function MetricTable({
  rows,
  nameKey,
  nameLabel,
  extraCols,
}: {
  rows: any[];
  nameKey: string;
  nameLabel: string;
  extraCols?: { key: string; label: string; render?: (row: any) => string }[];
}) {
  if (rows.length === 0) {
    return <EmptyState text="Bu tarih aralığında kayıt yok." />;
  }
  return (
    <div className="rounded-xl border bg-white p-4 overflow-auto">
      <table className="w-full text-xs">
        <thead className="text-gray-500 border-b sticky top-0 bg-white">
          <tr>
            <th className="text-left py-1.5 pr-2">{nameLabel}</th>
            {(extraCols || []).map((c) => (
              <th key={c.key} className="text-right py-1.5 pr-2 whitespace-nowrap">
                {c.label}
              </th>
            ))}
            <th className="text-right py-1.5 pr-2">Ziyaretçi</th>
            <th className="text-right py-1.5 pr-2">Oturum</th>
            <th className="text-right py-1.5 pr-2">Ürün Görünt.</th>
            <th className="text-right py-1.5 pr-2">Sepete Ekle</th>
            <th className="text-right py-1.5 pr-2">Ödeme</th>
            <th className="text-right py-1.5 pr-2">Sipariş</th>
            <th className="text-right py-1.5 pr-2">Ciro</th>
            <th className="text-right py-1.5">Dönüşüm</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${str(row[nameKey], "row")}-${i}`} className="border-b last:border-0">
              <td className="py-1.5 pr-2 font-medium whitespace-nowrap">
                {str(row[nameKey] ?? row.label ?? row.name, "Bilinmiyor")}
              </td>
              {(extraCols || []).map((c) => (
                <td key={c.key} className="py-1.5 pr-2 text-right whitespace-nowrap">
                  {c.render ? c.render(row) : str(row[c.key])}
                </td>
              ))}
              <td className="py-1.5 pr-2 text-right">{num(row.visitors ?? row.unique_visitors)}</td>
              <td className="py-1.5 pr-2 text-right">{num(row.sessions)}</td>
              <td className="py-1.5 pr-2 text-right">{num(row.product_views ?? row.productViews)}</td>
              <td className="py-1.5 pr-2 text-right">{num(row.add_to_cart ?? row.addToCart ?? row.add_to_carts)}</td>
              <td className="py-1.5 pr-2 text-right">{num(row.checkout ?? row.begin_checkout ?? row.checkouts)}</td>
              <td className="py-1.5 pr-2 text-right">{num(row.orders ?? row.purchases)}</td>
              <td className="py-1.5 pr-2 text-right whitespace-nowrap">{fmtMoney(row.revenue)}</td>
              <td className="py-1.5 text-right">{fmtPct(conversionRate(row))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AnalyticsHub() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<HubTab>("overview");
  const [preset, setPreset] = useState<DatePreset>("7d");
  const [fromDate, setFromDate] = useState(daysAgoLocal(6));
  const [toDate, setToDate] = useState(todayLocal());
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [integrationForms, setIntegrationForms] = useState<Record<string, IntegrationForm>>({});
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [integrationsMissing, setIntegrationsMissing] = useState(false);

  const applyPreset = useCallback((p: DatePreset) => {
    setPreset(p);
    const to = todayLocal();
    if (p === "today") {
      setFromDate(to);
      setToDate(to);
    } else if (p === "7d") {
      setFromDate(daysAgoLocal(6));
      setToDate(to);
    } else if (p === "30d") {
      setFromDate(daysAgoLocal(29));
      setToDate(to);
    }
  }, []);

  const rangeQs = `from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`;
  const needsRange = tab !== "realtime" && tab !== "integrations";

  const overviewQ = useQuery({
    queryKey: ["/api/admin/analytics/overview", fromDate, toDate],
    enabled: tab === "overview",
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/overview?${rangeQs}`);
      if (!r.ok) throw new Error(r.data?.message || "Genel bakış yüklenemedi");
      return r.data;
    },
  });

  const realtimeQ = useQuery({
    queryKey: ["/api/admin/analytics/realtime"],
    enabled: tab === "realtime",
    refetchInterval: tab === "realtime" ? 15_000 : false,
    queryFn: async () => {
      const r = await fetchJson("/api/admin/analytics/realtime");
      if (!r.ok) throw new Error(r.data?.message || "Canlı veriler yüklenemedi");
      return r.data;
    },
  });

  const visitorsQ = useQuery({
    queryKey: ["/api/admin/analytics/visitors", fromDate, toDate],
    enabled: tab === "visitors",
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/visitors?${rangeQs}`);
      if (!r.ok) throw new Error(r.data?.message || "Ziyaretçiler yüklenemedi");
      return r.data;
    },
  });

  const visitorDetailQ = useQuery({
    queryKey: ["/api/admin/analytics/visitor", selectedVisitorId],
    enabled: tab === "visitors" && !!selectedVisitorId,
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/visitor/${encodeURIComponent(selectedVisitorId!)}`);
      if (!r.ok) throw new Error(r.data?.message || "Ziyaretçi detayı yüklenemedi");
      return r.data;
    },
  });

  const sourcesQ = useQuery({
    queryKey: ["/api/admin/analytics/sources", fromDate, toDate],
    enabled: tab === "sources",
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/sources?${rangeQs}`);
      if (!r.ok) throw new Error(r.data?.message || "Kaynaklar yüklenemedi");
      return r.data;
    },
  });

  const campaignsQ = useQuery({
    queryKey: ["/api/admin/analytics/campaigns", fromDate, toDate],
    enabled: tab === "campaigns",
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/campaigns?${rangeQs}`);
      if (!r.ok) throw new Error(r.data?.message || "Kampanyalar yüklenemedi");
      return r.data;
    },
  });

  const funnelQ = useQuery({
    queryKey: ["/api/admin/analytics/funnel", fromDate, toDate],
    enabled: tab === "funnel",
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/funnel?${rangeQs}`);
      if (!r.ok) throw new Error(r.data?.message || "Huni yüklenemedi");
      return r.data;
    },
  });

  const productsQ = useQuery({
    queryKey: ["/api/admin/analytics/products", fromDate, toDate],
    enabled: tab === "products",
    queryFn: async () => {
      const r = await fetchJson(`/api/admin/analytics/products?${rangeQs}`);
      if (!r.ok) throw new Error(r.data?.message || "Ürün analitiği yüklenemedi");
      return r.data;
    },
  });

  const integrationsQ = useQuery({
    queryKey: ["/api/admin/analytics/integrations"],
    enabled: tab === "integrations",
    retry: false,
    queryFn: async () => {
      const r = await fetchJson("/api/admin/analytics/integrations");
      if (r.status === 404) {
        setIntegrationsMissing(true);
        return { missing: true, items: [] as any[] };
      }
      if (!r.ok) throw new Error(r.data?.message || "Entegrasyonlar yüklenemedi");
      setIntegrationsMissing(false);
      return r.data;
    },
  });

  useEffect(() => {
    if (!integrationsQ.data) return;
    if ((integrationsQ.data as any).missing) {
      setIntegrationForms((prev) => {
        const next: Record<string, IntegrationForm> = { ...prev };
        for (const m of INTEGRATION_META) {
          if (!next[m.provider]) next[m.provider] = { enabled: false, publicId: "" };
        }
        return next;
      });
      return;
    }
    const items = asArray(integrationsQ.data, ["items", "integrations", "providers"]);
    const byProvider = new Map<string, any>();
    for (const it of items) {
      const p = str(it.provider ?? it.id ?? it.key, "");
      if (p) byProvider.set(p, it);
    }
    if (!Array.isArray(integrationsQ.data) && integrationsQ.data && typeof integrationsQ.data === "object") {
      for (const m of INTEGRATION_META) {
        const maybe = (integrationsQ.data as any)[m.provider];
        if (maybe && typeof maybe === "object") byProvider.set(m.provider, maybe);
      }
    }
    const next: Record<string, IntegrationForm> = {};
    for (const m of INTEGRATION_META) {
      const it = byProvider.get(m.provider) || {};
      let rawId = it.publicId ?? it.public_id ?? it.trackingId ?? it.tracking_id ?? it.measurementId ?? "";
      if (typeof rawId !== "string") rawId = "";
      // Mask any accidental secret-looking values returned by API
      const looksSecret =
        /secret|token|access_token|api_key/i.test(String(it.secretField || "")) ||
        (typeof it.secret === "string" && it.secret.length > 0);
      if (looksSecret && rawId && !rawId.includes("•") && rawId.length > 12) {
        rawId = `${rawId.slice(0, 4)}${"•".repeat(Math.min(12, rawId.length - 8))}${rawId.slice(-4)}`;
      }
      const masked = it.secretMasked ?? it.secret_masked;
      if ((!rawId || rawId === "") && typeof masked === "string") rawId = masked;
      next[m.provider] = {
        enabled: !!(it.enabled ?? it.isEnabled ?? it.active),
        publicId: rawId,
        secret: "",
        hasSecret: !!(it.hasSecret ?? it.has_secret),
      };
    }
    setIntegrationForms(next);
  }, [integrationsQ.data]);

  const saveIntegration = useMutation({
    mutationFn: async (provider: IntegrationProvider) => {
      const form = integrationForms[provider] || { enabled: false, publicId: "" };
      const body: Record<string, unknown> = {
        enabled: form.enabled,
        publicId: form.publicId,
      };
      if (provider === "meta_capi" && typeof form.secret === "string" && form.secret.trim()) {
        body.secret = form.secret.trim();
      }
      const res = await fetch(`/api/admin/analytics/integrations/${provider}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      return res.json().catch(() => ({}));
    },
    onSuccess: (_d, provider) => {
      toast({ title: "Kaydedildi", description: `${provider} ayarları güncellendi.` });
      qc.invalidateQueries({ queryKey: ["/api/admin/analytics/integrations"] });
    },
    onError: (e: any) => {
      toast({
        title: "Kayıt başarısız",
        description: e?.message || "Entegrasyon API hazır değil veya hata oluştu.",
        variant: "destructive",
      });
    },
    onSettled: () => setSavingProvider(null),
  });

  const overview = overviewQ.data || {};
  const overviewStats = overview.summary || overview.stats || overview;

  const realtimeRows = asArray(realtimeQ.data, ["sessions", "visitors", "items", "rows", "active"]);
  const visitorRows = asArray(visitorsQ.data, ["visitors", "items", "rows"]);
  const sourceRows = asArray(sourcesQ.data, ["sources", "items", "rows"]);
  const campaignRows = asArray(campaignsQ.data, ["campaigns", "items", "rows"]);
  const productRows = asArray(productsQ.data, ["products", "items", "rows"]);

  const funnelSteps = useMemo(() => {
    const d = funnelQ.data;
    const defaults = [
      { key: "visitors", label: "Ziyaretçi" },
      { key: "product_view", label: "Ürün Görüntüleme" },
      { key: "add_to_cart", label: "Sepete Ekle" },
      { key: "checkout", label: "Ödeme" },
      { key: "purchase", label: "Satın Alma" },
    ];
    if (!d) return defaults.map((s) => ({ ...s, count: 0 }));
    if (Array.isArray(d)) {
      return defaults.map((s, i) => {
        const hit =
          d.find(
            (x: any) =>
              String(x.step || x.name || x.key || "").toLowerCase().includes(s.key.replace("_", "")) ||
              String(x.label || "").toLowerCase() === s.label.toLowerCase()
          ) || d[i];
        return { ...s, count: num(hit?.count ?? hit?.visitors ?? hit?.value) };
      });
    }
    const funnel = d.funnel || d.steps || d;
    return defaults.map((s) => ({
      ...s,
      count: num(
        funnel[s.key] ??
          funnel[s.key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] ??
          (s.key === "visitors" ? funnel.visitor ?? funnel.visitors : undefined) ??
          (s.key === "product_view" ? funnel.productViews ?? funnel.product_views : undefined) ??
          (s.key === "add_to_cart" ? funnel.addToCart ?? funnel.add_to_cart : undefined) ??
          (s.key === "checkout" ? funnel.begin_checkout ?? funnel.checkouts : undefined) ??
          (s.key === "purchase" ? funnel.purchases ?? funnel.orders : undefined)
      ),
    }));
  }, [funnelQ.data]);

  const timelineEvents = useMemo(() => {
    const d = visitorDetailQ.data;
    return asArray(d, ["events", "timeline", "items", "rows"]);
  }, [visitorDetailQ.data]);

  const activeLoading =
    (tab === "overview" && overviewQ.isLoading) ||
    (tab === "realtime" && realtimeQ.isLoading) ||
    (tab === "visitors" && visitorsQ.isLoading) ||
    (tab === "sources" && sourcesQ.isLoading) ||
    (tab === "campaigns" && campaignsQ.isLoading) ||
    (tab === "funnel" && funnelQ.isLoading) ||
    (tab === "products" && productsQ.isLoading) ||
    (tab === "integrations" && integrationsQ.isLoading);

  const activeError =
    (tab === "overview" && overviewQ.error) ||
    (tab === "realtime" && realtimeQ.error) ||
    (tab === "visitors" && visitorsQ.error) ||
    (tab === "sources" && sourcesQ.error) ||
    (tab === "campaigns" && campaignsQ.error) ||
    (tab === "funnel" && funnelQ.error) ||
    (tab === "products" && productsQ.error) ||
    (tab === "integrations" && integrationsQ.error && !integrationsMissing);

  const maxFunnel = Math.max(1, ...funnelSteps.map((s) => s.count));

  return (
    <div className="space-y-4" data-testid="section-analytics-hub">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-800" />
          <h2 className="text-lg font-bold">Analytics Hub</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            First-party
          </span>
        </div>
        {needsRange && (
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { k: "today" as const, label: "Bugün" },
                { k: "7d" as const, label: "7 gün" },
                { k: "30d" as const, label: "30 gün" },
                { k: "custom" as const, label: "Özel" },
              ] as const
            ).map((b) => (
              <button
                key={b.k}
                type="button"
                onClick={() => applyPreset(b.k)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                  preset === b.k
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
                data-testid={`button-analytics-range-${b.k}`}
              >
                {b.label}
              </button>
            ))}
            <label className="flex items-center gap-1 text-xs text-gray-500">
              Başlangıç
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => {
                  setPreset("custom");
                  setFromDate(e.target.value);
                }}
                className="border rounded-lg px-2 py-1.5 text-sm"
                data-testid="input-analytics-from"
              />
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-500">
              Bitiş
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max={todayLocal()}
                onChange={(e) => {
                  setPreset("custom");
                  setToDate(e.target.value);
                }}
                className="border rounded-lg px-2 py-1.5 text-sm"
                data-testid="input-analytics-to"
              />
            </label>
          </div>
        )}
        {tab === "realtime" && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            15 sn’de bir yenilenir
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border bg-white p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setTab(t.key);
              if (t.key !== "visitors") setSelectedVisitorId(null);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              tab === t.key
                ? "bg-amber-800 text-white"
                : "text-gray-600 hover:bg-amber-50"
            }`}
            data-testid={`tab-analytics-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeLoading ? <LoadingBlock /> : null}

      {!activeLoading && activeError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(activeError as Error)?.message || "Veri yüklenemedi. API henüz hazır olmayabilir."}
        </div>
      ) : null}

      {!activeLoading && !activeError && tab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            <StatCard label="Ziyaretçi" value={num(overviewStats.visitors ?? overviewStats.uniqueVisitors)} accent="blue" />
            <StatCard label="Oturum" value={num(overviewStats.sessions)} />
            <StatCard label="Sayfa Görünt." value={num(overviewStats.pageviews ?? overviewStats.pageViews ?? overviewStats.page_views)} />
            <StatCard label="Sipariş" value={num(overviewStats.orders ?? overviewStats.purchases)} accent="emerald" />
            <StatCard label="Ciro" value={fmtMoney(overviewStats.revenue)} accent="emerald" />
            <StatCard
              label="Dönüşüm"
              value={fmtPct(
                overviewStats.conversion_rate ??
                  overviewStats.conversionRate ??
                  (num(overviewStats.visitors ?? overviewStats.uniqueVisitors) > 0
                    ? (num(overviewStats.orders ?? overviewStats.purchases) /
                        num(overviewStats.visitors ?? overviewStats.uniqueVisitors)) *
                      100
                    : 0)
              )}
              accent="blue"
            />
          </div>
          {num(overviewStats.visitors ?? overviewStats.uniqueVisitors ?? overviewStats.sessions) === 0 &&
          asArray(overview, ["topSources", "top_sources", "sources"]).length === 0 ? (
            <EmptyState text="Bu tarih aralığında analitik kaydı yok." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border bg-white p-4">
                <h3 className="text-sm font-bold mb-3">Öne çıkan kaynaklar</h3>
                {asArray(overview, ["topSources", "top_sources", "sources"]).length === 0 ? (
                  <p className="text-xs text-gray-400">Kaynak verisi yok.</p>
                ) : (
                  <div className="space-y-2">
                    {asArray(overview, ["topSources", "top_sources", "sources"])
                      .slice(0, 8)
                      .map((s: any, i: number) => (
                        <div key={`${str(s.source ?? s.label)}-${i}`} className="flex justify-between text-xs">
                          <span className="font-medium">{str(s.source ?? s.label ?? s.name)}</span>
                          <span className="text-gray-500">
                            {num(s.visitors ?? s.sessions ?? s.count)} · {fmtMoney(s.revenue)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
              <div className="rounded-xl border bg-white p-4">
                <h3 className="text-sm font-bold mb-3">Özet notlar</h3>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4">
                  <li>Online şimdi: {num(overviewStats.onlineNow ?? overviewStats.online_now ?? overview.onlineNow)}</li>
                  <li>Yeni ziyaretçi: {num(overviewStats.newVisitors ?? overviewStats.new_visitors)}</li>
                  <li>Dönen ziyaretçi: {num(overviewStats.returningVisitors ?? overviewStats.returning_visitors)}</li>
                  <li>Ort. aktif süre: {fmtDuration(overviewStats.avgActiveSeconds ?? overviewStats.avg_active_seconds)}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {!activeLoading && !activeError && tab === "realtime" && (
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-amber-800" />
            <h3 className="text-sm font-bold">Canlı oturumlar</h3>
            <span className="text-xs text-gray-500">({realtimeRows.length})</span>
          </div>
          {realtimeRows.length === 0 ? (
            <EmptyState text="Şu an aktif ziyaretçi yok." />
          ) : (
            <div className="overflow-auto max-h-[520px]">
              <table className="w-full text-xs">
                <thead className="text-gray-500 border-b sticky top-0 bg-white">
                  <tr>
                    <th className="text-left py-1.5 pr-2">Ziyaretçi</th>
                    <th className="text-left py-1.5 pr-2">Şehir</th>
                    <th className="text-left py-1.5 pr-2">Ülke</th>
                    <th className="text-left py-1.5 pr-2">Cihaz</th>
                    <th className="text-left py-1.5 pr-2">Kaynak</th>
                    <th className="text-left py-1.5 pr-2">Sayfa</th>
                    <th className="text-right py-1.5 pr-2">Sayfa #</th>
                    <th className="text-right py-1.5 pr-2">Süre</th>
                    <th className="text-left py-1.5">Son aktivite</th>
                  </tr>
                </thead>
                <tbody>
                  {realtimeRows.map((r: any, i: number) => (
                    <tr key={str(r.visitorId ?? r.visitor_id ?? r.sessionId ?? i)} className="border-b last:border-0">
                      <td className="py-1.5 pr-2 font-mono whitespace-nowrap">
                        {shortId(r.visitorId ?? r.visitor_id)}
                      </td>
                      <td className="py-1.5 pr-2 whitespace-nowrap">{str(r.city, "Bilinmiyor")}</td>
                      <td className="py-1.5 pr-2 whitespace-nowrap">{str(r.country)}</td>
                      <td className="py-1.5 pr-2 whitespace-nowrap">{str(r.device)}</td>
                      <td className="py-1.5 pr-2 whitespace-nowrap">
                        {str(r.source_label ?? r.sourceLabel ?? r.source)}
                      </td>
                      <td className="py-1.5 pr-2 max-w-[180px] truncate" title={str(r.current_page ?? r.currentPage ?? r.page_url ?? r.landing_page, "")}>
                        {str(r.current_page ?? r.currentPage ?? r.page_url ?? r.landing_page)}
                      </td>
                      <td className="py-1.5 pr-2 text-right">{num(r.pages ?? r.page_count ?? r.pageCount)}</td>
                      <td className="py-1.5 pr-2 text-right whitespace-nowrap">
                        {fmtDuration(r.duration ?? r.session_duration ?? r.active_seconds ?? r.activeSeconds)}
                      </td>
                      <td className="py-1.5 whitespace-nowrap">
                        {fmtTime(r.last_activity ?? r.lastActivity ?? r.last_activity_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!activeLoading && !activeError && tab === "visitors" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <h3 className="text-sm font-bold mb-3">Ziyaretçi listesi</h3>
            {visitorRows.length === 0 ? (
              <EmptyState text="Bu tarih aralığında ziyaretçi yok." />
            ) : (
              <div className="overflow-auto max-h-[520px]">
                <table className="w-full text-xs">
                  <thead className="text-gray-500 border-b sticky top-0 bg-white">
                    <tr>
                      <th className="text-left py-1.5 pr-2">ID</th>
                      <th className="text-left py-1.5 pr-2">Kaynak</th>
                      <th className="text-left py-1.5 pr-2">Son görülme</th>
                      <th className="text-right py-1.5">Oturum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitorRows.map((v: any, i: number) => {
                      const id = str(v.id ?? v.visitorId ?? v.visitor_id, "");
                      const selected = id && id === selectedVisitorId;
                      return (
                        <tr
                          key={id || i}
                          className={`border-b last:border-0 cursor-pointer ${selected ? "bg-amber-50" : "hover:bg-gray-50"}`}
                          onClick={() => id && setSelectedVisitorId(id)}
                          data-testid={`row-analytics-visitor-${id || i}`}
                        >
                          <td className="py-1.5 pr-2 font-mono whitespace-nowrap">{shortId(id)}</td>
                          <td className="py-1.5 pr-2 whitespace-nowrap">
                            {str(v.first_source ?? v.firstSource ?? v.source_label ?? v.source)}
                          </td>
                          <td className="py-1.5 pr-2 whitespace-nowrap">
                            {fmtTime(v.last_seen_at ?? v.lastSeenAt ?? v.last_activity_at)}
                          </td>
                          <td className="py-1.5 text-right">{num(v.sessions ?? v.session_count)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="rounded-xl border bg-white p-4">
            <h3 className="text-sm font-bold mb-3">
              Olay zaman çizelgesi
              {selectedVisitorId ? (
                <span className="ml-2 font-mono text-xs font-normal text-gray-500">{shortId(selectedVisitorId)}</span>
              ) : null}
            </h3>
            {!selectedVisitorId ? (
              <EmptyState text="Detay için bir ziyaretçi satırına tıklayın." />
            ) : visitorDetailQ.isLoading ? (
              <LoadingBlock />
            ) : visitorDetailQ.error ? (
              <p className="text-sm text-red-600">{(visitorDetailQ.error as Error).message}</p>
            ) : timelineEvents.length === 0 ? (
              <EmptyState text="Bu ziyaretçi için olay kaydı yok." />
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto">
                {timelineEvents.map((ev: any, i: number) => (
                  <div key={str(ev.id, String(i))} className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                      <span className="font-semibold text-amber-900">
                        {str(ev.event_name ?? ev.eventName ?? ev.name)}
                      </span>
                      <span className="text-gray-500">{fmtTime(ev.created_at ?? ev.createdAt ?? ev.time)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate" title={str(ev.page_url ?? ev.pageUrl, "")}>
                      {str(ev.page_url ?? ev.pageUrl)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {metadataSummary(ev.metadata ?? ev.meta ?? ev.properties)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!activeLoading && !activeError && tab === "sources" && (
        <MetricTable rows={sourceRows} nameKey="source" nameLabel="Kaynak" />
      )}

      {!activeLoading && !activeError && tab === "campaigns" && (
        <MetricTable
          rows={campaignRows}
          nameKey="campaign"
          nameLabel="Kampanya"
          extraCols={[
            { key: "source", label: "Kaynak" },
            { key: "medium", label: "Medium", render: (r) => str(r.medium ?? r.medium_norm) },
          ]}
        />
      )}

      {!activeLoading && !activeError && tab === "funnel" && (
        <div className="rounded-xl border bg-white p-4 space-y-3">
          <h3 className="text-sm font-bold">Dönüşüm hunisi</h3>
          {funnelSteps.every((s) => s.count === 0) ? (
            <EmptyState text="Bu tarih aralığında huni verisi yok." />
          ) : (
            funnelSteps.map((step, idx) => (
              <div key={step.key}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="font-medium">
                    {idx + 1}. {step.label}
                  </span>
                  <span className="text-gray-500">{step.count.toLocaleString("tr-TR")}</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${idx === funnelSteps.length - 1 ? "bg-emerald-500" : "bg-blue-500"}`}
                    style={{ width: `${(step.count / maxFunnel) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!activeLoading && !activeError && tab === "products" && (
        <div className="rounded-xl border bg-white p-4 overflow-auto">
          {productRows.length === 0 ? (
            <EmptyState text="Bu tarih aralığında ürün analitiği yok." />
          ) : (
            <table className="w-full text-xs">
              <thead className="text-gray-500 border-b sticky top-0 bg-white">
                <tr>
                  <th className="text-left py-1.5 pr-2">Ürün ID</th>
                  <th className="text-right py-1.5 pr-2">Görüntülenme</th>
                  <th className="text-right py-1.5 pr-2">Sepete Ekle</th>
                  <th className="text-right py-1.5 pr-2">Satın Alma</th>
                  <th className="text-right py-1.5">Ciro</th>
                </tr>
              </thead>
              <tbody>
                {productRows.map((p: any, i: number) => (
                  <tr key={str(p.product_id ?? p.productId ?? i)} className="border-b last:border-0">
                    <td className="py-1.5 pr-2 font-mono whitespace-nowrap">
                      {str(p.product_id ?? p.productId ?? p.id)}
                    </td>
                    <td className="py-1.5 pr-2 text-right">{num(p.views ?? p.product_views)}</td>
                    <td className="py-1.5 pr-2 text-right">{num(p.add_to_carts ?? p.add_to_cart ?? p.addToCart)}</td>
                    <td className="py-1.5 pr-2 text-right">{num(p.purchases ?? p.orders)}</td>
                    <td className="py-1.5 text-right whitespace-nowrap">{fmtMoney(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!activeLoading && tab === "integrations" && (
        <div className="space-y-3">
          {integrationsMissing ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed">
              Entegrasyon API henüz hazır değil (404). Kartlar yer tutucu olarak gösteriliyor.
              Google etiketleri için mevcut{" "}
              <span className="font-semibold">Admin → Google</span> bölümünü kullanabilirsiniz.
              Meta, TikTok, Clarity ve Yandex için: Yakında / yapılandırma API bekleniyor.
            </div>
          ) : null}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {INTEGRATION_META.map((m) => {
              const form = integrationForms[m.provider] || { enabled: false, publicId: "" };
              const busy = savingProvider === m.provider && saveIntegration.isPending;
              const placeholderOnly =
                integrationsMissing &&
                ["meta_pixel", "meta_capi", "tiktok", "clarity", "yandex_metrica"].includes(m.provider);
              return (
                <div
                  key={m.provider}
                  className="rounded-xl border bg-white p-4 space-y-3"
                  data-testid={`card-integration-${m.provider}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold">{m.title}</h3>
                      <p className="text-[11px] text-gray-500">{m.hint}</p>
                    </div>
                    <label className="flex items-center gap-1.5 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={form.enabled}
                        disabled={placeholderOnly}
                        onChange={(e) =>
                          setIntegrationForms((prev) => ({
                            ...prev,
                            [m.provider]: { ...form, enabled: e.target.checked },
                          }))
                        }
                        className="rounded border-gray-300"
                        data-testid={`toggle-integration-${m.provider}`}
                      />
                      Aktif
                    </label>
                  </div>
                  {placeholderOnly ? (
                    <p className="text-xs text-gray-500 italic">Yakında / yapılandırma API bekleniyor</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={form.publicId}
                        onChange={(e) =>
                          setIntegrationForms((prev) => ({
                            ...prev,
                            [m.provider]: { ...form, publicId: e.target.value },
                          }))
                        }
                        placeholder={m.placeholder}
                        autoComplete="off"
                        className="w-full border rounded-lg px-2.5 py-1.5 text-sm font-mono"
                        data-testid={`input-integration-${m.provider}`}
                      />
                      {m.provider === "meta_capi" ? (
                        <>
                          <input
                            type="password"
                            value={form.secret || ""}
                            onChange={(e) =>
                              setIntegrationForms((prev) => ({
                                ...prev,
                                [m.provider]: { ...form, secret: e.target.value },
                              }))
                            }
                            placeholder={form.hasSecret ? "•••••••• (değiştirmek için yeni token)" : "Access Token"}
                            autoComplete="new-password"
                            className="w-full border rounded-lg px-2.5 py-1.5 text-sm font-mono"
                            data-testid="input-integration-meta-capi-secret"
                          />
                          <p className="text-[10px] text-gray-400">
                            Access Token sunucuda saklanır; boş bırakırsanız mevcut token korunur.
                            {form.hasSecret ? " (kayıtlı token var)" : ""}
                          </p>
                        </>
                      ) : null}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setSavingProvider(m.provider);
                          saveIntegration.mutate(m.provider);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 disabled:opacity-60"
                        data-testid={`btn-save-integration-${m.provider}`}
                      >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Kaydet
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
