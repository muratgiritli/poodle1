import { useLocation } from "wouter";
import { YP_COMPANY } from "@/lib/yp-company";

const WA_DIGITS = YP_COMPANY.phoneTel.replace(/\D/g, "");

export default function YPWhatsAppButton({ hidden = false }: { hidden?: boolean }) {
  const [path] = useLocation();
  if (hidden) return null;
  if (/\/(giris|uye-ol|odeme|sifre|sifremi-unuttum)/.test(path)) return null;

  const productMatch = path.match(/\/urun\/(\d+)/);
  const text = productMatch
    ? `Merhaba, bu ürün hakkında bilgi almak istiyorum: ${typeof window !== "undefined" ? window.location.href : ""}`
    : "Merhaba, YourPoodle hakkında yardım almak istiyorum.";
  const href = `https://wa.me/${WA_DIGITS}?text=${encodeURIComponent(text)}`;

  return (
    <>
      <style>{`
        .yp-wa {
          position: fixed;
          right: 18px;
          bottom: 22px;
          z-index: 80;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 48px;
          padding: 0 16px 0 12px;
          border-radius: 999px;
          background: #25D366;
          color: #fff;
          box-shadow: 0 8px 22px rgba(18, 90, 48, 0.28);
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 750;
          text-decoration: none;
        }
        .yp-wa:hover { background: #1EBE5A; }
        .yp-wa svg { flex-shrink: 0; }
        @media (max-width: 768px) {
          .yp-wa { right: 14px; bottom: 78px; padding: 0; width: 52px; height: 52px; justify-content: center; }
          .yp-wa span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
        }
      `}</style>
      <a
        className="yp-wa"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile yazın"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          <path d="M12.04 2C6.58 2 2.15 6.42 2.15 11.88c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.89-4.42 9.89-9.88C21.94 6.48 17.5 2 12.04 2zm0 18.06h-.01c-1.5 0-2.97-.4-4.26-1.17l-.3-.18-3.15.82.84-3.07-.2-.32a8.16 8.16 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.85 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8c0 4.53-3.69 8.21-8.21 8.21z" />
        </svg>
        <span>WhatsApp</span>
      </a>
    </>
  );
}
