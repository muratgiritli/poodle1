import { useLocation } from "wouter";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface YPBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BASE = "https://www.yourpoodle.com";

/**
 * Renders a visible breadcrumb trail + injects BreadcrumbList JSON-LD schema.
 * Mobile: horizontally scrollable, single-line.
 */
export default function YPBreadcrumb({ items, className = "" }: YPBreadcrumbProps) {
  const [, navigate] = useLocation();

  if (items.length <= 1) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${BASE}${item.href}`,
    })),
  };

  return (
    <>
      {/* JSON-LD schema for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Visible breadcrumb trail */}
      <nav
        aria-label="Sayfa konumu"
        className={className}
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          whiteSpace: "nowrap",
          padding: "8px 16px",
          background: "#FAFAFA",
          borderBottom: "1px solid #F0F0F0",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <ol
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li
                key={item.href}
                style={{ display: "inline-flex", alignItems: "center" }}
                itemScope
                itemType="https://schema.org/ListItem"
                itemProp="itemListElement"
              >
                {!isLast ? (
                  <>
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); navigate(item.href); }}
                      itemProp="item"
                      style={{
                        fontSize: 12,
                        color: "#7C3AFF",
                        textDecoration: "none",
                        fontWeight: 600,
                        padding: "2px 0",
                      }}
                      onMouseEnter={(e) => { (e.target as HTMLElement).style.textDecoration = "underline"; }}
                      onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = "none"; }}
                    >
                      <span itemProp="name">{item.label}</span>
                    </a>
                    <meta itemProp="position" content={String(i + 1)} />
                    <span
                      aria-hidden="true"
                      style={{ fontSize: 11, color: "#CCC", margin: "0 6px" }}
                    >
                      ›
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      itemProp="name"
                      aria-current="page"
                      style={{ fontSize: 12, color: "#888", fontWeight: 500 }}
                    >
                      {item.label}
                    </span>
                    <meta itemProp="position" content={String(i + 1)} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
