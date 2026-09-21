import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

interface HomeProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  img?: string | null;
  stock?: number | null;
  brandName?: string | null;
}

function fmtPrice(value: number) {
  return `${Number(value).toLocaleString("tr-TR")} TL`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function discountRatio(product: HomeProduct) {
  const original = Number(product.originalPrice) || 0;
  return original > product.price ? 1 - product.price / original : 0;
}

function ProductCard({ product }: { product: HomeProduct }) {
  const { updateQty, basket } = useCart();
  const [added, setAdded] = useState(false);
  const id = String(product.id);
  const inCart = (basket[id] || 0) > 0;
  const outOfStock = !product.stock || product.stock <= 0;
  const ratio = discountRatio(product);

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (outOfStock) return;
    if (updateQty(id, 1) !== false) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    }
  };

  return (
    <a className="yphp-card" href={`${BASE}/urun/${product.id}/${slugify(product.name)}`}>
      <span className="yphp-media">
        {product.img ? (
          <img
            src={product.img}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(event) => {
              const image = event.target as HTMLImageElement;
              image.style.display = "none";
              const fallback = image.parentElement?.querySelector("[data-fallback]") as HTMLElement | null;
              if (fallback) fallback.style.display = "grid";
            }}
          />
        ) : null}
        <span data-fallback style={{ display: product.img ? "none" : "grid" }}>
          <Package size={34} strokeWidth={1.4} />
        </span>
        {ratio > 0 && <span className="yphp-badge">%{Math.round(ratio * 100)}</span>}
        {inCart && !added && (
          <span className="yphp-incart" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
        )}
      </span>

      <span className="yphp-body">
        {product.brandName && !String(product.brandName).toLowerCase().includes("yourpoodle") && (
          <span className="yphp-brand">{product.brandName}</span>
        )}
        <span className="yphp-name">{product.name}</span>
        <span className="yphp-price">
          {ratio > 0 && <s>{fmtPrice(Number(product.originalPrice))}</s>}
          <b>{fmtPrice(product.price)}</b>
        </span>
        <button type="button" onClick={handleAdd} disabled={outOfStock} className="yphp-add">
          {outOfStock ? "Tükendi" : added ? "Eklendi" : "Sepete Ekle"}
        </button>
      </span>
    </a>
  );
}

function Rail({
  eyebrow,
  title,
  href,
  linkLabel,
  products,
  tone,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel: string;
  products: HomeProduct[];
  tone: "cream" | "paper";
}) {
  if (products.length === 0) return null;
  return (
    <section className={tone === "paper" ? "yph-section yph-section-white" : "yph-section"}>
      <div className="yph-container">
        <div className="yph-heading-row">
          <div>
            <p className="yph-eyebrow">{eyebrow}</p>
            <h2 className="yph-section-title yph-serif">{title}</h2>
          </div>
          <a className="yph-text-link" href={href}>{linkLabel} <ArrowRight size={15} /></a>
        </div>
        <div className="yphp-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function YPHomeProducts() {
  const { data: products = [] } = useQuery<HomeProduct[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 5 * 60 * 1000,
  });

  const shoppable = useMemo(
    () =>
      products.filter((product) => {
        if (!product.img) return false;
        return !String(product.brandName || "").toLowerCase().includes("yourpoodle");
      }),
    [products],
  );

  const featured = useMemo(
    () =>
      shoppable
        .filter((product) => (product.stock || 0) > 0)
        .sort((a, b) => discountRatio(b) - discountRatio(a) || b.id - a.id)
        .slice(0, 8),
    [shoppable],
  );

  const deals = useMemo(() => {
    const featuredIds = new Set(featured.map((product) => product.id));
    return shoppable
      .filter((product) => discountRatio(product) > 0 && !featuredIds.has(product.id))
      .sort((a, b) => discountRatio(b) - discountRatio(a))
      .slice(0, 4);
  }, [shoppable, featured]);

  if (featured.length === 0) return null;

  return (
    <>
      <style>{`
        .yphp-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 16px;
        }
        .yphp-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--yph-line);
          border-radius: 18px;
          background: #fff;
          color: inherit;
          text-decoration: none;
          transition: transform .18s ease, border-color .18s ease;
        }
        .yphp-card:hover { transform: translateY(-3px); border-color: #CDBBA8; }
        .yphp-media {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          background: #EFE8DE;
        }
        .yphp-media img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 14px;
          box-sizing: border-box;
        }
        .yphp-media [data-fallback] {
          position: absolute;
          inset: 0;
          place-items: center;
          color: #C9B9A5;
        }
        .yphp-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 3px 8px;
          border-radius: 8px;
          background: #C6452F;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }
        .yphp-incart {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--yph-brown);
          color: #fff;
        }
        .yphp-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 7px;
          padding: 14px;
        }
        .yphp-brand {
          color: var(--yph-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .yphp-name {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          min-height: 38px;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.35;
        }
        .yphp-price {
          display: flex;
          align-items: baseline;
          gap: 7px;
          margin-top: auto;
          padding-top: 4px;
        }
        .yphp-price s { color: #B3A697; font-size: 12px; }
        .yphp-price b { color: var(--yph-brown); font-size: 17px; font-weight: 800; }
        .yphp-add {
          min-height: 40px;
          margin-top: 4px;
          border: 1px solid var(--yph-brown);
          border-radius: 11px;
          background: var(--yph-brown);
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: background .18s ease;
        }
        .yphp-add:hover:not(:disabled) { background: var(--yph-brown-dark); }
        .yphp-add:disabled {
          border-color: var(--yph-line);
          background: var(--yph-cream);
          color: var(--yph-muted);
          cursor: not-allowed;
        }
        @media (max-width: 900px) {
          .yphp-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
        @media (max-width: 620px) {
          .yphp-grid { gap: 10px; }
          .yphp-card { border-radius: 15px; }
          .yphp-media img { padding: 10px; }
          .yphp-body { gap: 6px; padding: 11px; }
          .yphp-name { min-height: 34px; font-size: 12.5px; }
          .yphp-price b { font-size: 15px; }
          .yphp-add { min-height: 36px; font-size: 12px; }
        }
      `}</style>

      <Rail
        eyebrow="Mağazadan"
        title="Öne çıkan ürünler"
        href={`${BASE}/magaza`}
        linkLabel="Tüm ürünler"
        products={featured}
        tone="cream"
      />
      <Rail
        eyebrow="Fırsatlar"
        title="İndirimdeki ürünler"
        href={`${BASE}/kampanyalar`}
        linkLabel="Tüm kampanyalar"
        products={deals}
        tone="paper"
      />
    </>
  );
}
