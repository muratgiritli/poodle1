/**
 * Central loader for optional marketing/analytics pixels.
 * Google (GTM/GA4/Ads) stays SSR-injected via seo-meta — not duplicated here.
 * Respects yp_cookie_consent: marketing pixels only when consent === "all".
 */
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

type PublicProvider = { provider: string; publicId: string };

function consentAllowsMarketing(): boolean {
  try {
    return localStorage.getItem("yp_cookie_consent") === "all";
  } catch {
    return false;
  }
}

function loadScript(src: string, id: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function injectInline(id: string, code: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.text = code;
  document.head.appendChild(s);
}

function bootMeta(pixelId: string) {
  injectInline(
    "yp-meta-pixel-boot",
    `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId.replace(/[^0-9]/g, "")}');fbq('track','PageView');`,
  );
}

function bootTikTok(pixelId: string) {
  const id = pixelId.replace(/[^a-zA-Z0-9]/g, "");
  injectInline(
    "yp-tiktok-boot",
    `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${id}');ttq.page()}(window,document,'ttq');`,
  );
}

function bootClarity(projectId: string) {
  const id = projectId.replace(/[^a-zA-Z0-9]/g, "");
  injectInline(
    "yp-clarity-boot",
    `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${id}");`,
  );
}

function bootYandex(counterId: string) {
  const id = counterId.replace(/[^0-9]/g, "");
  injectInline(
    "yp-yandex-boot",
    `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${id},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`,
  );
}

function bootHotjar(siteId: string) {
  const id = siteId.replace(/[^0-9]/g, "");
  injectInline(
    "yp-hotjar-boot",
    `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${id},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
  );
}

function bootProvider(p: PublicProvider) {
  const id = (p.publicId || "").trim();
  if (!id) return;
  switch (p.provider) {
    case "meta_pixel": bootMeta(id); break;
    case "tiktok": bootTikTok(id); break;
    case "clarity": bootClarity(id); break;
    case "yandex_metrica": bootYandex(id); break;
    case "hotjar": bootHotjar(id); break;
    default: break;
  }
}

export default function TrackingLoader() {
  const booted = useRef(false);
  const { data } = useQuery<{ providers: PublicProvider[] }>({
    queryKey: ["/api/public/tracking-config"],
    queryFn: async () => {
      const r = await fetch("/api/public/tracking-config");
      if (!r.ok) return { providers: [] };
      return r.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data?.providers?.length) return;
    if (!consentAllowsMarketing()) return;
    if (booted.current) return;
    booted.current = true;
    for (const p of data.providers) {
      try { bootProvider(p); } catch { /* never break site */ }
    }
  }, [data]);

  // Re-check after consent banner accept (same tab + storage)
  useEffect(() => {
    const boot = () => {
      if (!data?.providers?.length || !consentAllowsMarketing()) return;
      for (const p of data.providers) {
        try { bootProvider(p); } catch { /* ignore */ }
      }
      booted.current = true;
    };
    const onConsent = (e: Event) => {
      const level = (e as CustomEvent)?.detail?.level;
      if (level === "all") boot();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === "yp_cookie_consent" && e.newValue === "all") boot();
    };
    window.addEventListener("yp-cookie-consent", onConsent as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("yp-cookie-consent", onConsent as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, [data]);

  return null;
}
