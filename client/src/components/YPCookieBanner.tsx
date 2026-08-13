import { useState, useEffect } from "react";

const STORAGE_KEY = "yp_cookie_consent";

type ConsentLevel = "all" | "required" | null;

function getStored(): ConsentLevel {
  try { return (localStorage.getItem(STORAGE_KEY) as ConsentLevel) || null; }
  catch { return null; }
}
function setStored(v: ConsentLevel) {
  try { localStorage.setItem(STORAGE_KEY, v!); } catch {}
}

const CSS = `
  .yp-cookie {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(72px + env(safe-area-inset-bottom, 0px));
    z-index: 9999;
    max-width: var(--yp-shell-max, 480px);
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    padding: 12px 14px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.16);
    font-family: Inter, system-ui, sans-serif;
    border: 1px solid #EDE6DC;
  }
  .yp-cookie-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .yp-cookie-copy {
    flex: 1;
    min-width: 0;
  }
  .yp-cookie-title {
    font-size: 13px;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.25;
    margin: 0 0 2px;
  }
  .yp-cookie-text {
    font-size: 11.5px;
    color: #666;
    line-height: 1.4;
    margin: 0;
  }
  .yp-cookie-text button {
    background: none;
    border: none;
    color: #5D3A1A;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    font-family: inherit;
  }
  .yp-cookie-accept {
    flex-shrink: 0;
    height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    background: #5D3A1A;
    color: #fff;
    border: none;
    font-size: 12.5px;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
  }
  .yp-cookie-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
    flex-wrap: wrap;
  }
  .yp-cookie-actions button {
    background: none;
    border: none;
    padding: 0;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    color: #5D3A1A;
  }
  .yp-cookie-actions button.muted { color: #888; }
  .yp-cookie-detail {
    margin-top: 10px;
    max-height: 28vh;
    overflow: auto;
    background: #F5F0E6;
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 11.5px;
    color: #555;
    line-height: 1.55;
  }
  .yp-cookie-detail p { margin: 0 0 8px; }
  .yp-cookie-detail p:last-child { margin: 0; }
  .yp-cookie-detail strong { color: #333; font-weight: 700; }
  .yp-cookie-legal {
    margin: 8px 0 0;
    font-size: 10.5px;
    color: #aaa;
    text-align: center;
    line-height: 1.35;
  }
  .yp-cookie-legal a { color: #5D3A1A; text-decoration: none; }
  @media (min-width: 768px) {
    .yp-cookie {
      left: 24px;
      right: auto;
      bottom: 24px;
      width: min(420px, calc(100vw - 48px));
      max-width: 420px;
      padding: 16px 18px;
      border-radius: 18px;
    }
    .yp-cookie-title { font-size: 14px; }
    .yp-cookie-text { font-size: 12.5px; }
    .yp-cookie-accept { height: 42px; font-size: 13px; padding: 0 16px; }
    .yp-cookie-detail { max-height: 220px; font-size: 12px; }
  }
`;

export default function YPCookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!getStored()) setShow(true);
  }, []);

  const accept = (level: ConsentLevel) => {
    setStored(level);
    setShow(false);
    try {
      window.dispatchEvent(new CustomEvent("yp-cookie-consent", { detail: { level } }));
    } catch {}
  };

  if (!show) return null;

  return (
    <>
      <style>{CSS}</style>
      <div
        className="yp-cookie"
        role="dialog"
        aria-label="Çerez tercihleri"
        aria-modal="false"
      >
        <div className="yp-cookie-row">
          <div className="yp-cookie-copy">
            <p className="yp-cookie-title">Çerezler</p>
            <p className="yp-cookie-text">
              Deneyimi iyileştirmek için çerez kullanıyoruz.{" "}
              <button type="button" onClick={() => setShowDetail((v) => !v)}>
                {showDetail ? "Gizle" : "Detay"}
              </button>
            </p>
          </div>
          <button
            type="button"
            className="yp-cookie-accept"
            onClick={() => accept("all")}
            aria-label="Tüm çerezleri kabul et"
          >
            Kabul Et
          </button>
        </div>

        <div className="yp-cookie-actions">
          <button type="button" onClick={() => accept("required")}>
            Yalnızca zorunlu
          </button>
          <button
            type="button"
            className="muted"
            onClick={() => setShowDetail((v) => !v)}
          >
            Tercihleri yönet
          </button>
        </div>

        {showDetail && (
          <div className="yp-cookie-detail">
            <p><strong>Zorunlu çerezler</strong> — Oturum ve güvenlik için gerekli; kapatılamaz.</p>
            <p><strong>İşlevsel çerezler</strong> — Dil, arama ve profil tercihlerini hatırlar.</p>
            <p><strong>Analitik çerezler</strong> — İçerik performansını anlamamıza yardım eder; kişisel veri içermez.</p>
          </div>
        )}

        <p className="yp-cookie-legal">
          <a href="/kvkk">KVKK</a>
          {" · "}
          <a href="/cerez-politikasi">Çerez Politikası</a>
        </p>
      </div>
    </>
  );
}
