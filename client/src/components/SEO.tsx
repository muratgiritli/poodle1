import { useEffect } from "react";
import { CURRENT_STORE, brandify } from "@/lib/store";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
  keywords?: string;
}

export const SITE_DOMAIN = CURRENT_STORE.domain;
export const SITE_NAME = CURRENT_STORE.name;
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}${CURRENT_STORE.seo.ogImage}`;
const _isCargo = CURRENT_STORE.commerce.fulfillment === "cargo" || !!CURRENT_STORE.commerce.nationwideSeo;

export default function SEO({ title, description, canonical, ogImage, ogType, jsonLd, noindex, keywords }: SEOProps) {
  useEffect(() => {
    const bTitle = brandify(title);
    const bDescription = brandify(description);
    const bKeywords = keywords ? brandify(keywords) : keywords;
    document.title = bTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.content = content;
    };

    setMeta("name", "description", bDescription);
    if (bKeywords) {
      setMeta("name", "keywords", bKeywords);
    } else {
      const kwEl = document.querySelector('meta[name="keywords"]');
      if (kwEl) kwEl.remove();
    }
    setMeta("property", "og:title", bTitle);
    setMeta("property", "og:description", bDescription);
    setMeta("property", "og:type", ogType || "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "tr_TR");
    setMeta("property", "og:image", ogImage || DEFAULT_OG_IMAGE);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", bTitle);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", bTitle);
    setMeta("name", "twitter:description", bDescription);
    setMeta("name", "twitter:image", ogImage || DEFAULT_OG_IMAGE);
    if (!_isCargo) {
      setMeta("name", "geo.region", "TR-55");
      setMeta("name", "geo.placename", "Samsun");
    } else {
      // Remove any Samsun-forcing static geo tags inherited from index.html
      ["geo.region", "geo.placename", "geo.position", "ICBM"].forEach(n => {
        document.querySelector(`meta[name="${n}"]`)?.remove();
      });
      setMeta("name", "geo.region", "TR");
    }

    if (noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    } else {
      setMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

    if (canonical) {
      setMeta("property", "og:url", canonical);
    }

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!canonicalEl) { canonicalEl = document.createElement("link"); canonicalEl.rel = "canonical"; document.head.appendChild(canonicalEl); }
      canonicalEl.href = canonical;
    }

    let ldScript = document.getElementById("json-ld-seo") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!ldScript) { ldScript = document.createElement("script"); ldScript.id = "json-ld-seo"; ldScript.type = "application/ld+json"; document.head.appendChild(ldScript); }
      // Brandify the JSON-LD so brand name + self-referential URLs follow this
      // domain, BUT preserve contact identifiers (email + sameAs social handles):
      // they point to the single real business shared across every brand, so they
      // must NOT be domain-rewritten (e.g. instagram.com/jetgomarket.com on the
      // jetgo.pet brand must stay jetgomarket.com). Mirrors server/seo-meta.ts.
      const ldRaw = JSON.stringify(jsonLd);
      const origEmail = ldRaw.match(/"email":\s*"[^"]*"/i)?.[0];
      const origSameAs = ldRaw.match(/"sameAs":\s*\[[\s\S]*?\]/i)?.[0];
      let ldOut = brandify(ldRaw);
      if (origEmail) ldOut = ldOut.replace(/"email":\s*"[^"]*"/i, origEmail);
      if (origSameAs) ldOut = ldOut.replace(/"sameAs":\s*\[[\s\S]*?\]/i, origSameAs);
      ldScript.textContent = ldOut;
    }

    return () => {
      document.title = CURRENT_STORE.seo.title;
      if (canonicalEl) canonicalEl.remove();
      if (ldScript) ldScript.remove();
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd, noindex, keywords]);

  return null;
}

// Local-only arrays — only used when fulfillment is NOT cargo (JetGo local)
const ATAKUM_MAHALLELERI = ["Denizevleri","Güzelyalı","Kurupelit","Atakent","İncesu","Mimar Sinan","Körfez","Yeni Mahalle","Altınkum","Balaç","Çakırlar","Soğuksu","Taflan","Çobanlı","Büyükoyumca","Esenevler"];
const ILKADIM_MAHALLELERI = ["Kadıköy","Rasathane","Kılıçdede","Baruthane","Kalkancı","Ulugazi","Derecik","Adalet","Çiftlik"];
const CANIK_MAHALLELERI = ["Karşıyaka","Gaziosmanpaşa","Yenimahalle","Kuzeyyıldızı"];

export const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": _isCargo ? ["OnlineStore", "Store"] : ["PetStore", "LocalBusiness", "Store"],
  "@id": `${SITE_DOMAIN}/#petstore`,
  "name": SITE_NAME,
  "alternateName": CURRENT_STORE.alternateNames,
  "url": SITE_DOMAIN,
  "logo": `${SITE_DOMAIN}${CURRENT_STORE.logo}`,
  "image": [`${SITE_DOMAIN}${CURRENT_STORE.seo.ogImage}`, `${SITE_DOMAIN}${CURRENT_STORE.logo}`],
  "telephone": CURRENT_STORE.phone,
  "email": CURRENT_STORE.email,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Yenimahalle Atatürk 3. Kısım Bulvarı No:113/A",
    "addressLocality": "Atakum",
    "addressRegion": "Samsun",
    "postalCode": "55200",
    "addressCountry": "TR",
  },
  ...(_isCargo ? {} : {
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.2867,
      "longitude": 36.33,
    },
    "hasMap": "https://www.google.com/maps/search/?api=1&query=Yenimahalle+Atatürk+3.+Kısım+Bulvarı+113%2FA+Atakum+Samsun",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 41.2867, "longitude": 36.33 },
      "geoRadius": "20000",
    },
  }),
  "priceRange": "₺₺",
  "currenciesAccepted": "TRY",
  "paymentAccepted": _isCargo
    ? ["Kredi Kartı", "Banka Kartı", "Havale/EFT"]
    : ["Nakit", "Kredi Kartı", "Havale/EFT", "Kapıda Ödeme"],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], "opens": "09:00", "closes": "21:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:00", "closes": "20:00" },
  ],
  "areaServed": _isCargo
    ? { "@type": "Country", "name": "Türkiye", "@id": "https://www.wikidata.org/wiki/Q43" }
    : [
        { "@type": "City", "name": "Samsun", "@id": "https://www.wikidata.org/wiki/Q83171" },
        { "@type": "AdministrativeArea", "name": "Atakum", "containedInPlace": { "@type": "City", "name": "Samsun" } },
        { "@type": "AdministrativeArea", "name": "İlkadım", "containedInPlace": { "@type": "City", "name": "Samsun" } },
        { "@type": "AdministrativeArea", "name": "Canik", "containedInPlace": { "@type": "City", "name": "Samsun" } },
        ...ATAKUM_MAHALLELERI.map(m => ({ "@type": "Place", "name": `${m} Mahallesi, Atakum, Samsun` })),
        ...ILKADIM_MAHALLELERI.map(m => ({ "@type": "Place", "name": `${m} Mahallesi, İlkadım, Samsun` })),
        ...CANIK_MAHALLELERI.map(m => ({ "@type": "Place", "name": `${m} Mahallesi, Canik, Samsun` })),
      ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": CURRENT_STORE.phone,
    "contactType": "customer service",
    "areaServed": "TR",
    "availableLanguage": ["Turkish", "tr-TR"],
    "contactOption": ["TollFree", "HearingImpairedSupported"],
  }],
  "description": CURRENT_STORE.businessDescription,
  "slogan": CURRENT_STORE.slogan,
  "foundingDate": "2024",
  "founder": { "@type": "Organization", "name": "Sizpa İnternet Tic. Ltd. Şti." },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": _isCargo ? `${SITE_NAME} Ürün Kategorileri` : "Samsun Pet Shop Ürün Kategorileri",
    "itemListElement": [
      { "@type": "OfferCatalog", "name": "Köpek Maması", "url": `${SITE_DOMAIN}/kopek-mamasi` },
      { "@type": "OfferCatalog", "name": "Pet Aksesuarları", "url": `${SITE_DOMAIN}/pet-aksesuar` },
    ],
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1",
  },
  "knowsAbout": _isCargo
    ? ["Köpek maması", "Köpek bakımı", "Pet shop", "Evcil hayvan bakımı", "Veteriner ürünleri", "Poodle", "Toy Poodle"]
    : ["Köpek maması", "Köpek bakımı", "Pet shop", "Evcil hayvan bakımı", "Veteriner ürünleri", "Atakum pet shop", "Samsun pet shop"],
  "makesOffer": _isCargo
    ? [{ "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Türkiye Geneli Kargo Teslimat" }, "areaServed": { "@type": "Country", "name": "Türkiye" } }]
    : [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Aynı Gün Teslimat" }, "areaServed": "Samsun" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kapıda Ödeme" }, "areaServed": "Samsun" },
      ],
  "sameAs": CURRENT_STORE.social,
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_DOMAIN,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_DOMAIN}/kategori?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const BREADCRUMB_JSONLD = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url,
  })),
});

export const PRODUCT_JSONLD = (product: {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  url: string;
  inStock: boolean;
  sku?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description || product.name,
  "image": product.image || DEFAULT_OG_IMAGE,
  "url": product.url,
  "sku": product.sku || "",
  "brand": {
    "@type": "Brand",
    "name": SITE_NAME,
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "TRY",
    "price": product.price,
    ...(product.originalPrice && product.originalPrice > product.price ? {
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    } : {}),
    "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": SITE_NAME,
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "89",
        "currency": "TRY",
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "TR",
      },
    },
  },
});

export const FAQ_JSONLD = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
});
