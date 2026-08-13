/**
 * Allow only same-origin relative paths for post-login redirects.
 * Rejects absolute URLs, protocol-relative (//evil), and backslash tricks.
 */
export function safeInternalPath(raw: string | null | undefined, fallback: string): string {
  const fb = fallback.startsWith("/") && !fallback.startsWith("//") ? fallback : "/";
  if (!raw || typeof raw !== "string") return fb;
  let v = raw.trim();
  try {
    v = decodeURIComponent(v);
  } catch {
    /* keep raw */
  }
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\")) return fb;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return fb; // scheme: ...
  if (v.includes("\\")) return fb;
  return v;
}
