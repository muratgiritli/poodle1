import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Legacy mama product URL — resolve to product page or kuru mama catalog. */
export default function YPMamaUrunPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (slug) {
        try {
          const r = await fetch("/api/yp-products");
          if (r.ok) {
            const products = await r.json();
            if (Array.isArray(products)) {
              const match = products.find((p: { id: number; name: string }) =>
                slugify(p.name || "") === slug || String(p.id) === slug,
              );
              if (match && !cancelled) {
                navigate(`${BASE}/urun/${match.id}/${slugify(match.name)}`, { replace: true });
                return;
              }
            }
          }
        } catch { /* fall through */ }
      }
      if (!cancelled) {
        navigate(`${BASE}/kuru-mama`, { replace: true });
      }
    })();

    return () => { cancelled = true; };
  }, [slug, navigate]);

  return null;
}
