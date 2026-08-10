// Shared wrapper for all YourPoodle static/legal/support pages
import { useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";

export const staticCSS = `
  .sp-wrap { max-width: var(--yp-read-max); margin: 0 auto; padding: 32px 20px 72px; font-family: Inter, sans-serif; width: 100%; }
  @media (min-width: 768px) { .sp-wrap { padding: 40px 32px 80px; } }
  @media (min-width: 1024px) { .sp-wrap { padding: 48px 40px 96px; } }
  .sp-section { margin-bottom: 32px; }
  .sp-section h2 { font-size: 17px; font-weight: 800; color: #1a1a1a; margin-bottom: 10px; padding-top: 8px; border-top: 1px solid #f0f0f0; }
  .sp-section p, .sp-section li { font-size: 14px; color: #555; line-height: 1.75; }
  .sp-section ul, .sp-section ol { padding-left: 20px; margin-top: 8px; }
  .sp-section li { margin-bottom: 6px; }
  .sp-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
  .sp-table th, .sp-table td { padding: 10px 12px; text-align: left; border: 1px solid #f0f0f0; }
  .sp-table th { background: #F5F0E6; color: #5D3A1A; font-weight: 700; }
  .sp-alert { background: #FFF7ED; border: 1.5px solid #FED7AA; border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; font-size: 13.5px; color: #92400E; line-height: 1.6; }
  .sp-cta-btn { display: inline-flex; align-items: center; gap: 8px; height: 48px; padding: 0 24px; border-radius: 14px; border: none; background: #5D3A1A; color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; text-decoration: none; font-family: Inter, sans-serif; }
  .sp-cta-btn:hover { background: #3D2612; }
`;

interface Crumb { label: string; href?: string; }

interface Props {
  title: string;
  description: string;
  updatedDate?: string;
  breadcrumb?: Crumb[];
  children: React.ReactNode;
  noindex?: boolean;
}

export default function YPStaticPage({ title, description, updatedDate, breadcrumb, children, noindex }: Props) {
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = `${title} | YourPoodle`;
    const setMeta = (attr: string, key: string, val: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = val;
    };
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  }, [title, description, noindex]);

  const crumbs: Crumb[] = breadcrumb ?? [{ label: "Ana Sayfa", href: "/yourpoodle" }, { label: title }];

  return (
    <YPLayout activeLink="" constrain={false}>
      <style>{staticCSS}</style>
      <main>
        <div className="sp-wrap">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" style={{ display:"flex", alignItems:"center", gap:4, marginBottom:24, flexWrap:"wrap" }}>
            {crumbs.map((c, i) => (
              <span key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
                {i > 0 && <ChevronRight size={12} color="#ccc"/>}
                {c.href
                  ? <a href={c.href} style={{ fontSize:12, color:"#5D3A1A", textDecoration:"none", fontWeight:600 }}>{c.label}</a>
                  : <span style={{ fontSize:12, color:"#888", fontWeight:600 }}>{c.label}</span>
                }
              </span>
            ))}
          </nav>

          <h1 style={{ fontSize:28, fontWeight:900, color:"#1a1a1a", marginBottom:8, letterSpacing:"-0.3px" }}>{title}</h1>
          {updatedDate && <p style={{ fontSize:13, color:"#aaa", marginBottom:32 }}>Son güncelleme: {updatedDate}</p>}

          {children}
        </div>
      </main>
    </YPLayout>
  );
}
