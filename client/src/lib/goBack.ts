/**
 * In-app back: previous history entry, or `fallback` when there is nowhere to go
 * (direct link / new tab).
 */
export function goBack(
  navigate?: (path: string) => void,
  fallback = "/",
): void {
  const state = window.history.state as { idx?: number } | null;
  const hasIdx = typeof state?.idx === "number";
  const canGoBack = hasIdx ? state!.idx! > 0 : window.history.length > 1;

  if (canGoBack) {
    window.history.back();
    return;
  }

  if (navigate) navigate(fallback);
  else window.location.assign(fallback);
}
