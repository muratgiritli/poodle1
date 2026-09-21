import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";
const P = "#5D3A1A";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function YPRecentlyViewed({
  excludeId,
  title = "Son görüntülenenler",
}: {
  excludeId?: number;
  title?: string;
}) {
  const items = useRecentlyViewed(excludeId).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section className="yprv" aria-label={title}>
      <style>{`
        .yprv { margin: 0 0 28px; }
        .yprv-title { margin: 0 0 12px; font-size: 15px; font-weight: 800; color: #1a1a1a; }
        .yprv-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: thin;
        }
        .yprv-card {
          flex: 0 0 148px;
          overflow: hidden;
          border: 1px solid #E8E0D4;
          border-radius: 14px;
          background: #fff;
          color: inherit;
          text-decoration: none;
        }
        .yprv-media {
          display: grid;
          place-items: center;
          aspect-ratio: 1 / 1;
          background: #FAF8F4;
        }
        .yprv-media img { width: 100%; height: 100%; object-fit: contain; padding: 8px; box-sizing: border-box; }
        .yprv-name {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          min-height: 32px;
          margin: 0;
          padding: 8px 10px 0;
          font-size: 12px;
          font-weight: 650;
          line-height: 1.3;
          color: #2C2118;
        }
        .yprv-price {
          margin: 0;
          padding: 6px 10px 10px;
          font-size: 13px;
          font-weight: 800;
          color: ${P};
        }
      `}</style>
      <h2 className="yprv-title">{title}</h2>
      <div className="yprv-row">
        {items.map((product) => (
          <a
            key={product.id}
            className="yprv-card"
            href={`${BASE}/urun/${product.id}/${slugify(product.name)}`}
          >
            <span className="yprv-media">
              {product.img
                ? <img src={product.img} alt="" loading="lazy" />
                : <span aria-hidden="true">🐾</span>}
            </span>
            <p className="yprv-name">{product.name}</p>
            <p className="yprv-price">{Number(product.price).toLocaleString("tr-TR")} TL</p>
          </a>
        ))}
      </div>
    </section>
  );
}
