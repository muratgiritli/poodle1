const STORAGE_KEY = "yp_pattern_lock";

export type PatternLockRecord = {
  phone: string;
  patternHash: string;
  createdAt: number;
};

export function isMobilePatternDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

export function patternToString(nodes: number[]): string {
  return nodes.join("-");
}

export async function hashPattern(nodes: number[]): Promise<string> {
  const raw = patternToString(nodes);
  const data = new TextEncoder().encode(`yp-pattern:v1:${raw}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getPatternLock(): PatternLockRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PatternLockRecord;
    if (!parsed?.phone || !parsed?.patternHash) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePatternLock(phone: string, patternHash: string): void {
  const digits = phone.replace(/\D/g, "");
  const record: PatternLockRecord = {
    phone: digits,
    patternHash,
    createdAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function clearPatternLock(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/** @deprecated Trusted device is HttpOnly cookie only — always undefined. */
export function getTrustedDeviceToken(_phone: string): string | undefined {
  try {
    localStorage.removeItem("yp_trusted_devices");
    localStorage.removeItem("jetgo_trusted_devices");
  } catch { /* ignore */ }
  return undefined;
}

/** Clear any legacy trusted-device tokens from localStorage. */
export function clearLegacyTrustedDeviceStorage(): void {
  try {
    localStorage.removeItem("yp_trusted_devices");
    localStorage.removeItem("jetgo_trusted_devices");
  } catch { /* ignore */ }
}
