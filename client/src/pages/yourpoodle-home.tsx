import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCustomer } from "@/contexts/CustomerContext";
import { useLocation } from "wouter";
import YPBottomNav from "@/components/YPBottomNav";

/* ─── TOKENS ─── */
const P  = "#7C3AED";
const PD = "#6D28D9";
const PL = "#EDE4FF";
const BORDER = "#E5E7EB";
const TEXT   = "#111827";
const MUTED  = "#6B7280";

/* ─── YP CART (localStorage, same key as yp-urun / yp-odeme) ─── */
const LS_CART = "yp_cart_items";
interface CartItem { id: number; name: string; price: number; img?: string; qty: number; }
function loadCart(): CartItem[] { try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); } catch { return []; } }
function saveCart(items: CartItem[]) { try { localStorage.setItem(LS_CART, JSON.stringify(items)); } catch {} }

/* ─── PRODUCT TYPE ─── */
interface YPProduct {
  id: number; name: string; price: number; originalPrice?: number | null;
  img?: string | null; stock: number; subcategory?: string; brandName?: string;
}

/* ─── ARTICLE TYPE ─── */
interface YPArticle {
  id: number; title: string; tag?: string; min_read?: number;
  emoji?: string; featured?: boolean; body?: string;
}

/* ─── SVG ICONS ─── */
const SearchIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const UserIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const CartIconSvg = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" fill="none" stroke={MUTED} strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg width="16" height="16" fill="none" stroke={P} strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ─── TOAST ─── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{
      position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)",
      background:"#1F2937", color:"#fff", borderRadius:10,
      padding:"11px 22px", fontSize:13, fontWeight:600,
      zIndex:9999, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,0.18)",
      animation:"fadeInUp 0.22s ease",
    }}>{msg}</div>
  );
}

/* ─── HEART ─── */
function Heart({ wished, toggle }: { wished: boolean; toggle: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); toggle(); }}
      style={{ position:"absolute", top:8, right:8, background:"rgba(255,255,255,0.92)",
               border:"none", borderRadius:"50%", width:32, height:32,
               display:"flex", alignItems:"center", justifyContent:"center",
               cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,0.1)" }}>
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill={wished ? P : "none"} stroke={wished ? P : "#9CA3AF"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ p, onAdd, wished, toggleWish }: {
  p: YPProduct; onAdd: (p: YPProduct) => void;
  wished: boolean; toggleWish: () => void;
}) {
  const disc = p.originalPrice && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  const cat = p.subcategory || p.brandName || "Ürün";
  return (
    <div style={{ background:"#fff", border:`1px solid ${BORDER}`, borderRadius:14,
                  overflow:"hidden", display:"flex", flexDirection:"column",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ position:"relative", background:"#F9F8FF", aspectRatio:"1/1" }}>
        <img src={p.img || "/images/poodle-avatar-1.jpg"} alt={p.name}
          style={{ width:"100%", height:"100%", objectFit:"contain", padding:12 }}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = "/images/poodle-avatar-1.jpg"; }} />
        {disc > 0 && (
          <span style={{ position:"absolute", top:8, left:8,
                         background:"#EF4444", color:"#fff", fontSize:10,
                         fontWeight:800, padding:"3px 7px", borderRadius:99 }}>
            %{disc}
          </span>
        )}
        <Heart wished={wished} toggle={toggleWish} />
      </div>
      <div style={{ padding:"10px 11px 13px", flex:1, display:"flex", flexDirection:"column", gap:3 }}>
        <span style={{ fontSize:10, color:P, fontWeight:600, textTransform:"uppercase", letterSpacing:0.4 }}>{cat}</span>
        <span style={{ fontSize:12, fontWeight:700, color:TEXT, lineHeight:1.35,
                       display:"-webkit-box", WebkitLineClamp:2,
                       WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>
          {p.name}
        </span>
        <div style={{ display:"flex", alignItems:"baseline", gap:6, marginTop:4 }}>
          <span style={{ fontSize:16, fontWeight:900, color:TEXT }}>{p.price.toLocaleString("tr-TR")} TL</span>
          {disc > 0 && p.originalPrice && (
            <span style={{ fontSize:11, color:"#9CA3AF", textDecoration:"line-through" }}>
              {p.originalPrice.toLocaleString("tr-TR")} TL
            </span>
          )}
        </div>
        <button onClick={() => onAdd(p)}
          style={{ marginTop:8, width:"100%", background:P, color:"#fff",
                   border:"none", borderRadius:10, padding:"10px 0",
                   fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                   transition:"background 0.15s" }}
          onMouseOver={e => (e.currentTarget.style.background = PD)}
          onMouseOut={e => (e.currentTarget.style.background = P)}>
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

/* ─── SEARCH MODAL ─── */
function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<YPProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [, nav] = useLocation();

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/products/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      .then(r => r.json())
      .then((data: any[]) => {
        setResults((data || []).filter((p: any) => p.animal === "kopek" || !p.animal).slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => ctrl.abort();
  }, [q]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:10000,
                  display:"flex", alignItems:"flex-start", justifyContent:"center" }}
         onClick={onClose}>
      <div style={{ background:"#fff", width:"100%", maxWidth:430, padding:"16px",
                    borderRadius:"0 0 20px 20px", boxShadow:"0 8px 30px rgba(0,0,0,0.15)" }}
           onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Ürün, mama veya rehber ara..."
            style={{ flex:1, border:`1.5px solid ${BORDER}`, borderRadius:10,
                     padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"inherit" }} />
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:MUTED }}>
            <CloseIcon />
          </button>
        </div>
        {loading && <p style={{ textAlign:"center", color:MUTED, fontSize:13, marginTop:12 }}>Aranıyor…</p>}
        {results.length > 0 && (
          <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:8 }}>
            {results.map(p => (
              <div key={p.id} onClick={() => { nav(`/yourpoodle/p/${p.id}`); onClose(); }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"8px",
                          borderRadius:10, border:`1px solid ${BORDER}`, cursor:"pointer" }}>
                <img src={p.img || "/images/poodle-avatar-1.jpg"} alt={p.name}
                  style={{ width:44, height:44, objectFit:"contain", borderRadius:8, background:"#F9F8FF" }}
                  onError={e => { (e.target as HTMLImageElement).src = "/images/poodle-avatar-1.jpg"; }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:P, fontWeight:700 }}>{p.price.toLocaleString("tr-TR")} TL</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {q.length >= 2 && !loading && results.length === 0 && (
          <p style={{ textAlign:"center", color:MUTED, fontSize:13, marginTop:16 }}>Sonuç bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

/* ─── CART DRAWER ─── */
function CartDrawer({ cart, setCart, onClose }: {
  cart: CartItem[]; setCart: (c: CartItem[]) => void; onClose: () => void;
}) {
  const [, nav] = useLocation();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const updateQty = (id: number, qty: number) => {
    const next = qty <= 0 ? cart.filter(i => i.id !== id) : cart.map(i => i.id === id ? { ...i, qty } : i);
    setCart(next); saveCart(next);
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:10000, display:"flex", justifyContent:"flex-end" }}
         onClick={onClose}>
      <div style={{ background:"#fff", width:"100%", maxWidth:380, height:"100%",
                    display:"flex", flexDirection:"column", boxShadow:"-4px 0 30px rgba(0,0,0,0.1)" }}
           onClick={e => e.stopPropagation()}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BORDER}`,
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:16, fontWeight:700 }}>Sepetim</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:MUTED }}><CloseIcon /></button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>
          {cart.length === 0 && <p style={{ color:MUTED, textAlign:"center", marginTop:40 }}>Sepetiniz boş.</p>}
          {cart.map(item => (
            <div key={item.id} style={{ display:"flex", gap:12, alignItems:"center",
                                         borderBottom:`1px solid ${BORDER}`, paddingBottom:12 }}>
              <img src={item.img || "/images/poodle-avatar-1.jpg"} alt={item.name}
                style={{ width:56, height:56, objectFit:"contain", borderRadius:8, background:"#F9F8FF" }}
                onError={e => { (e.target as HTMLImageElement).src = "/images/poodle-avatar-1.jpg"; }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, lineHeight:1.3 }}>{item.name}</div>
                <div style={{ fontSize:14, fontWeight:800, color:P, marginTop:3 }}>
                  {(item.price * item.qty).toLocaleString("tr-TR")} TL
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)}
                  style={{ width:26, height:26, borderRadius:6, border:`1px solid ${BORDER}`,
                           background:"#fff", fontSize:16, cursor:"pointer",
                           display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                <span style={{ fontSize:13, fontWeight:700, minWidth:16, textAlign:"center" }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}
                  style={{ width:26, height:26, borderRadius:6, border:`1px solid ${BORDER}`,
                           background:"#fff", fontSize:16, cursor:"pointer",
                           display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${BORDER}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:700, marginBottom:12 }}>
              <span>Toplam</span>
              <span style={{ color:P }}>{total.toLocaleString("tr-TR")} TL</span>
            </div>
            <button onClick={() => { nav("/yourpoodle/sepet"); onClose(); }}
              style={{ width:"100%", background:P, color:"#fff", border:"none",
                       borderRadius:12, padding:"14px 0", fontSize:14, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit" }}>
              Alışverişi Tamamla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── AI CHAT MODAL ─── */
function AiModal({ onClose }: { onClose: () => void }) {
  const [, nav] = useLocation();
  const [msgs, setMsgs] = useState([
    { from:"ai", text:"Merhaba! 🐩 Toy Poodle'ınız hakkında size nasıl yardımcı olabilirim?" }
  ]);
  const [inp, setInp] = useState("");
  const REPLIES = [
    "Toy Poodle'lar için günlük mama miktarı genellikle vücut ağırlığının %2-3'ü kadardır.",
    "Tüy bakımı için 4-6 haftada bir profesyonel grooming önerilir.",
    "Royal Canin Poodle Adult bu ırk için özel formüle edilmiştir.",
    "Yavru poodle'lar için tuvalet eğitimine 8 haftadan itibaren başlanabilir.",
    "Gözyaşı lekeleri için günlük göz temizliği çok önemlidir.",
    "Daha ayrıntılı cevap için AI Asistan sayfamıza göz atabilirsiniz.",
  ];
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [msgs]);
  const send = () => {
    if (!inp.trim()) return;
    setMsgs(m => [...m,
      { from:"user", text:inp },
      { from:"ai", text:REPLIES[Math.floor(Math.random() * REPLIES.length)] }
    ]);
    setInp("");
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:10000,
                  display:"flex", alignItems:"flex-end", justifyContent:"center" }}
         onClick={onClose}>
      <div style={{ background:"#fff", width:"100%", maxWidth:430, borderRadius:"20px 20px 0 0",
                    height:"60vh", display:"flex", flexDirection:"column" }}
           onClick={e => e.stopPropagation()}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${BORDER}`,
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg, ${P}, #8B5CF6)`,
                          borderRadius:10, display:"flex", alignItems:"center",
                          justifyContent:"center", fontSize:18 }}>✨</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700 }}>AI Asistan</div>
              <div style={{ fontSize:11, color:"#22C55E", fontWeight:600 }}>● Çevrimiçi</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={() => { nav("/yourpoodle/ai-asistan"); onClose(); }}
              style={{ fontSize:12, color:P, fontWeight:600, background:"none",
                       border:`1px solid ${P}`, borderRadius:8, padding:"5px 10px", cursor:"pointer", fontFamily:"inherit" }}>
              Tam ekran
            </button>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:MUTED }}><CloseIcon /></button>
          </div>
        </div>
        <div ref={ref} style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth:"78%", background:m.from === "user" ? P : "#F3F4F6",
                             color:m.from === "user" ? "#fff" : TEXT,
                             padding:"10px 14px",
                             borderRadius:m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                             fontSize:13, lineHeight:1.5 }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${BORDER}`, display:"flex", gap:8 }}>
          <input value={inp} onChange={e => setInp(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Mesajınızı yazın..."
            style={{ flex:1, border:`1.5px solid ${BORDER}`, borderRadius:24,
                     padding:"10px 16px", fontSize:13, outline:"none", fontFamily:"inherit" }} />
          <button onClick={send}
            style={{ background:P, color:"#fff", border:"none", borderRadius:24,
                     padding:"10px 18px", fontSize:13, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit" }}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function YourPoodleHomePage() {
  const { isLoggedIn, customer } = useCustomer();
  const [, nav] = useLocation();

  /* ── Cart state (synced with localStorage) ── */
  const [cart, setCartState] = useState<CartItem[]>(loadCart);
  const setCart = (items: CartItem[]) => { setCartState(items); saveCart(items); };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  /* ── Wishlist ── */
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const toggleWish = (id: number) => {
    setWishlist(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); showToast("Favorilerden çıkarıldı"); }
      else { n.add(id); showToast("Favorilere eklendi ♥"); }
      return n;
    });
  };

  /* ── Modals ── */
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart]     = useState(false);
  const [showAi, setShowAi]         = useState(false);
  const [annVisible, setAnnVisible] = useState(true);

  /* ── Toast ── */
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => setToast(msg);

  /* ── Newsletter ── */
  const [email, setEmail]   = useState("");
  const [nlDone, setNlDone] = useState(false);

  /* ── Real products from DB ── */
  const { data: allProducts = [] } = useQuery<YPProduct[]>({
    queryKey: ["/api/yp-products"],
    staleTime: 60_000,
  });
  const featuredProducts = allProducts.slice(0, 6);

  /* ── Real guide articles from DB ── */
  const { data: articles = [] } = useQuery<YPArticle[]>({
    queryKey: ["/api/yp-articles"],
    staleTime: 120_000,
  });
  const featuredArticle = articles.find(a => a.featured) || articles[0];
  const listArticles = articles.filter(a => a !== featuredArticle).slice(0, 3);

  /* ── Add to cart ── */
  const addToCart = (p: YPProduct) => {
    const next = (() => {
      const ex = cart.find(i => i.id === p.id);
      if (ex) return cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...cart, { id: p.id, name: p.name, price: p.price, img: p.img || undefined, qty: 1 }];
    })();
    setCart(next);
    showToast("Sepete eklendi ✓");
  };

  /* ── Sync cart from storage on focus ── */
  useEffect(() => {
    const sync = () => setCartState(loadCart());
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  /* ── Send newsletter ── */
  const sendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { showToast("Geçerli bir e-posta girin."); return; }
    setNlDone(true); setEmail(""); showToast("Aboneliğiniz alındı!");
  };

  const navItems = [
    { label:"Mağaza",     href:"/yourpoodle/magaza" },
    { label:"Mama Bul",   href:"/yourpoodle/mama-bul" },
    { label:"Rehber",     href:"/yourpoodle/rehber" },
    { label:"AI Asistan", href:"/yourpoodle/ai-asistan" },
    { label:"Club",       href:"/yourpoodle/club" },
  ];

  return (
    <div style={{ minHeight:"100dvh", background:"#F5F5F7",
                  display:"flex", justifyContent:"center",
                  fontFamily:"'Inter','Plus Jakarta Sans',system-ui,-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { display:none; }
        html { scroll-behavior:smooth; }
      `}</style>

      <div style={{ width:"100%", maxWidth:430, background:"#fff", minHeight:"100dvh",
                    position:"relative", boxShadow:"0 0 40px rgba(0,0,0,0.07)" }}>

        {/* ════ ANNOUNCEMENT BAR ════ */}
        {annVisible && (
          <div style={{ background:P, color:"#fff", textAlign:"center",
                        fontSize:13, fontWeight:500, padding:"9px 40px 9px 16px",
                        position:"relative", minHeight:38,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
            🎁 750 TL Üzeri Ücretsiz Kargo
            <button onClick={() => setAnnVisible(false)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                       background:"none", border:"none", color:"rgba(255,255,255,0.8)",
                       cursor:"pointer", fontSize:16, padding:4 }}>✕</button>
          </div>
        )}

        {/* ════ STICKY HEADER ════ */}
        <header style={{ position:"sticky", top:0, zIndex:999, background:"#fff",
                         borderBottom:`1px solid ${BORDER}`,
                         padding:"0 16px", height:60,
                         display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle"
            onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
            style={{ height:36, width:"auto", objectFit:"contain", cursor:"pointer" }} />
          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
            <button onClick={() => setShowSearch(true)}
              aria-label="Ürün ara"
              style={{ background:"none", border:"none", cursor:"pointer", color:TEXT,
                       minWidth:44, minHeight:44, borderRadius:8,
                       display:"flex", alignItems:"center", justifyContent:"center" }}>
              <SearchIcon />
            </button>
            <button onClick={() => nav(isLoggedIn ? "/yourpoodle/profil" : "/yourpoodle/giris")}
              aria-label={isLoggedIn ? "Profilim" : "Giriş yap"}
              style={{ background:"none", border:"none", cursor:"pointer",
                       minWidth:44, minHeight:44, borderRadius:8,
                       display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                       color: isLoggedIn ? P : TEXT }}>
              <UserIcon />
              {isLoggedIn && customer?.name && (
                <span style={{ fontSize:12, fontWeight:600, maxWidth:60,
                               overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {customer.name.split(" ")[0]}
                </span>
              )}
            </button>
            <button onClick={() => setShowCart(true)}
              aria-label="Sepeti aç"
              style={{ background:"none", border:"none", cursor:"pointer", color:TEXT,
                       minWidth:44, minHeight:44, borderRadius:8,
                       display:"flex", alignItems:"center", justifyContent:"center",
                       position:"relative" }}>
              <CartIconSvg />
              {cartCount > 0 && (
                <span style={{ position:"absolute", top:4, right:4,
                               background:P, color:"#fff", borderRadius:"50%",
                               width:18, height:18, fontSize:10, fontWeight:800,
                               display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ════ NAV ════ */}
        <nav aria-label="Kategori menüsü"
          style={{ background:"#fff", borderBottom:`1px solid ${BORDER}`,
                   overflowX:"auto", display:"flex", padding:"0 4px",
                   scrollbarWidth:"none", WebkitOverflowScrolling:"touch" as any }}>
          {navItems.map(n => (
            <a key={n.label} href={n.href}
              style={{ flex:"none", padding:"12px 10px", fontSize:14, fontWeight:500,
                       color:TEXT, textDecoration:"none", whiteSpace:"nowrap",
                       minHeight:44, display:"flex", alignItems:"center",
                       borderBottom:"2.5px solid transparent",
                       transition:"color 0.15s, border-color 0.15s" }}
              onMouseOver={e => { e.currentTarget.style.color = P; e.currentTarget.style.borderBottomColor = P; }}
              onMouseOut={e => { e.currentTarget.style.color = TEXT; e.currentTarget.style.borderBottomColor = "transparent"; }}>
              {n.label}
            </a>
          ))}
        </nav>

        {/* ════ HERO ════ */}
        <section id="hero" style={{ position:"relative", height:460, overflow:"hidden" }}>
          <img src="/images/poodle-hero_2.jpg" alt="Toy Poodle"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                     objectFit:"cover", objectPosition:"center top" }}
            onError={e => {
              (e.target as HTMLImageElement).src = "/images/poodle-hero.jpg";
            }} />
          <div style={{ position:"absolute", inset:0,
                        background:"linear-gradient(to right, rgba(255,255,255,0.96) 42%, rgba(255,255,255,0.05) 100%)" }} />
          <div style={{ position:"relative", padding:"40px 20px 0", maxWidth:240 }}>
            <h1 style={{ fontSize:30, fontWeight:900, color:TEXT, lineHeight:1.2, margin:"0 0 12px" }}>
              Toy Poodle'ınız İçin Her Şey
            </h1>
            <p style={{ fontSize:14, color:MUTED, margin:"0 0 24px", lineHeight:1.5 }}>
              Doğru mama, güvenilir rehber ve size özel bakım desteği.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href="/yourpoodle/mama-bul"
                style={{ background:P, color:"#fff", border:"none", borderRadius:12,
                          padding:"13px 28px", fontSize:14, fontWeight:700,
                          cursor:"pointer", fontFamily:"inherit", width:"fit-content",
                          textDecoration:"none", display:"inline-block",
                          transition:"background 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.background = PD)}
                onMouseOut={e => (e.currentTarget.style.background = P)}>
                Mama Bul
              </a>
              <a href="/yourpoodle/rehber"
                style={{ background:"#fff", color:P, border:`2px solid ${P}`,
                          borderRadius:12, padding:"12px 28px", fontSize:14,
                          fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                          width:"fit-content", textDecoration:"none", display:"inline-block" }}>
                Rehbere Git
              </a>
            </div>
          </div>
          {/* AI Badge → real route */}
          <a href="/yourpoodle/ai-asistan"
            style={{ position:"absolute", bottom:20, right:16,
                     background:`linear-gradient(135deg, ${P}, #8B5CF6)`,
                     color:"#fff", borderRadius:24,
                     padding:"10px 16px", fontSize:12, fontWeight:700,
                     boxShadow:"0 4px 16px rgba(124,58,237,0.35)",
                     display:"flex", alignItems:"center", gap:6,
                     textDecoration:"none",
                     transition:"transform 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}>
            ✨ AI Asistan <span style={{ opacity:0.8, fontWeight:400 }}>7/24 Yanınızda</span>
          </a>
        </section>

        {/* ════ PROMO BANNER ════ */}
        <div style={{ background:PL, padding:"14px 20px",
                      display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:26 }}>🎁</span>
          <span style={{ flex:1, fontSize:14, fontWeight:600, color:TEXT }}>
            Yeni Üye Ol, 100 TL Bonus Kazan
          </span>
          <button onClick={() => nav(isLoggedIn ? "/yourpoodle" : "/yourpoodle/giris")}
            style={{ background:P, color:"#fff", border:"none", borderRadius:10,
                     padding:"9px 14px", fontSize:12, fontWeight:700,
                     cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
                     transition:"background 0.15s" }}
            onMouseOver={e => (e.currentTarget.style.background = PD)}
            onMouseOut={e => (e.currentTarget.style.background = P)}>
            {isLoggedIn ? "Kampanyalar" : "Hemen Üye Ol"}
          </button>
        </div>

        {/* ════ PRODUCTS ════ */}
        <section id="products" style={{ padding:"24px 16px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:TEXT, margin:0 }}>Sizin İçin Seçtiklerimiz</h2>
            <a href="/yourpoodle/magaza"
              style={{ fontSize:13, color:P, fontWeight:600, textDecoration:"none",
                       display:"flex", alignItems:"center", gap:2,
                       minHeight:44, padding:"0 4px" }}>
              Tümünü Gör <ChevronRightIcon />
            </a>
          </div>
          <p style={{ fontSize:12, color:MUTED, margin:"0 0 16px" }}>
            Poodle'ınıza özel seçilmiş ürünler
          </p>
          {featuredProducts.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px 0", color:MUTED, fontSize:13 }}>
              Ürünler yükleniyor…
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {featuredProducts.map(p => (
                <ProductCard key={p.id} p={p}
                  onAdd={addToCart}
                  wished={wishlist.has(p.id)}
                  toggleWish={() => toggleWish(p.id)} />
              ))}
            </div>
          )}
        </section>

        {/* ════ GUIDES ════ */}
        <section id="guides" style={{ padding:"0 16px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:TEXT, margin:0 }}>Poodle Rehberinden</h2>
            <a href="/yourpoodle/rehber"
              style={{ fontSize:13, color:P, fontWeight:600, textDecoration:"none",
                       display:"flex", alignItems:"center", gap:2,
                       minHeight:44, padding:"0 4px" }}>
              Tüm Rehberi Keşfet <ChevronRightIcon />
            </a>
          </div>

          {(() => {
            /* Use DB articles if available, else show hardcoded fallback cards */
            /* Fallback cards → specific deep-link destinations:
               - Tuvalet Eğitimi  → /yourpoodle/rehber#section-egitim  (Eğitim section, first item)
               - Mama Seçim       → /yourpoodle/mama-bul                (dedicated tool)
               - Tüy Bakımı       → /yourpoodle/rehber#section-bakim    (Bakım section, first item) */
            const FALLBACK = [
              { id: "tuvalet-egitimi",    title: "Tuvalet Eğitimi Nasıl Verilir?",  min_read: 5, emoji: "🐾", img: "/images/poodle-avatar-2.jpg", href: "/yourpoodle/rehber#section-egitim" },
              { id: "mama-secim-rehberi", title: "Toy Poodle Mama Seçim Rehberi",   min_read: 7, emoji: "🍗", img: "/images/poodle-avatar-3.jpg", href: "/yourpoodle/mama-bul" },
              { id: "tuy-bakimi",         title: "Tüy Bakımı: Tarak ve Şampuan",    min_read: 4, emoji: "✂️", img: "/images/poodle-avatar-4.jpg", href: "/yourpoodle/rehber#section-bakim" },
            ];
            const useDB     = articles.length > 0;
            const featured  = useDB ? (featuredArticle || articles[0]) : null;
            const listItems = useDB
              ? (listArticles.length > 0 ? listArticles : articles.slice(0, 3))
              : FALLBACK;

            return (
              <div style={{ display:"flex", gap:12 }}>
                {/* Featured image */}
                <a href={useDB && featured ? `/yourpoodle/rehber/${featured.id}` : "/yourpoodle/rehber"}
                  style={{ flex:"0 0 130px", height:196, borderRadius:14,
                           overflow:"hidden", background:PL, cursor:"pointer",
                           textDecoration:"none", display:"block" }}>
                  <img src="/images/poodle-avatar-1.jpg"
                    alt={featured?.title || "Poodle Rehberi"}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e => { (e.target as HTMLImageElement).src="/images/poodle-hero.jpg"; }} />
                </a>
                {/* Article list */}
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:0 }}>
                  {listItems.map((g: any, i: number, arr: any[]) => (
                    <a key={g.id}
                      href={useDB ? `/yourpoodle/rehber/${g.id}` : (g.href || "/yourpoodle/rehber")}
                      style={{ display:"flex", gap:10, alignItems:"center",
                               padding:"11px 0", cursor:"pointer", textDecoration:"none",
                               borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                               minHeight:44 }}>
                      <img src={g.img || `/images/poodle-avatar-${(i % 3) + 2}.jpg`} alt={g.title}
                        style={{ width:46, height:46, borderRadius:10, objectFit:"cover",
                                 background:PL, flexShrink:0 }}
                        onError={e => { (e.target as HTMLImageElement).src="/images/poodle-avatar-1.jpg"; }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:TEXT, lineHeight:1.35,
                                       display:"-webkit-box", WebkitLineClamp:2,
                                       WebkitBoxOrient:"vertical" as any, overflow:"hidden" }}>
                          {g.emoji ? `${g.emoji} ` : ""}{g.title}
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4 }}>
                          <ClockIcon />
                          <span style={{ fontSize:11, color:MUTED }}>{g.min_read || 5} dk okuma</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}
        </section>

        {/* ════ AI BANNER ════ */}
        <section id="ai" style={{ margin:"0 16px 28px" }}>
          <div style={{ background:`linear-gradient(135deg, #F3E8FF, #EDE4FF)`,
                        borderRadius:16, padding:"16px",
                        display:"flex", flexWrap:"wrap", alignItems:"center", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flex:"1 1 180px", minWidth:0 }}>
              <div style={{ width:44, height:44,
                            background:`linear-gradient(135deg, ${P}, #8B5CF6)`,
                            borderRadius:12, display:"flex", alignItems:"center",
                            justifyContent:"center", fontSize:20, flexShrink:0 }}>✨</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:TEXT, marginBottom:2 }}>Cevabını hemen bul</div>
                <div style={{ fontSize:12, color:MUTED, lineHeight:1.4 }}>Poodle'ınızla ilgili her şeyi sorun.</div>
              </div>
            </div>
            <a href="/yourpoodle/ai-asistan"
              style={{ background:P, color:"#fff", borderRadius:10,
                       padding:"11px 16px", fontSize:13, fontWeight:700,
                       cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap",
                       textDecoration:"none", display:"inline-block", flexShrink:0 }}>
              AI Asistan'a Sor
            </a>
          </div>
        </section>

        {/* ════ CLUB ════ */}
        <section id="club" style={{ margin:"0 16px 28px" }}>
          <div style={{ background:P, borderRadius:20, overflow:"hidden" }}>
            <div style={{ padding:"24px 24px 20px" }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 16px" }}>
                YourPoodle Club'a Katıl
              </h2>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                {["Üyelere özel indirimler", "Uzmanlara soru sor", "Poodle severlerle tanış"].map(txt => (
                  <div key={txt} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:20, height:20, borderRadius:"50%",
                                   background:"rgba(255,255,255,0.25)",
                                   display:"flex", alignItems:"center",
                                   justifyContent:"center", flexShrink:0 }}>
                      <CheckIcon />
                    </div>
                    <span style={{ fontSize:14, color:"rgba(255,255,255,0.92)" }}>{txt}</span>
                  </div>
                ))}
              </div>
              <a href="/yourpoodle/club"
                style={{ background:"#fff", color:P, border:"none", borderRadius:12,
                          padding:"12px 24px", fontSize:14, fontWeight:700,
                          cursor:"pointer", fontFamily:"inherit",
                          textDecoration:"none", display:"inline-block" }}>
                Club'ı Keşfet
              </a>
            </div>
            <div style={{ position:"relative", height:180, background:"rgba(255,255,255,0.08)" }}>
              <img src="/images/poodle-avatar-4.jpg" alt="Club"
                style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.85 }}
                onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0,
                             background:"linear-gradient(to top, rgba(109,40,217,0.88) 0%, transparent 100%)",
                             padding:"16px 20px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ display:"flex" }}>
                  {[1,2,3,4].map(n => (
                    <img key={n} src={`/images/poodle-avatar-${n}.jpg`} alt=""
                      style={{ width:28, height:28, borderRadius:"50%",
                               border:"2px solid white", marginLeft: n === 1 ? 0 : -8,
                               objectFit:"cover", background:PL }}
                      onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
                  ))}
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>10.000+ Poodle sever</span>
              </div>
            </div>
          </div>
        </section>

        {/* ════ NEWSLETTER ════ */}
        <section style={{ background:"#1A0A2E", padding:"32px 20px" }}>
          <h3 style={{ fontSize:18, fontWeight:800, color:"#fff", margin:"0 0 6px" }}>
            Poodle dünyasından haberdar ol.
          </h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", margin:"0 0 18px", lineHeight:1.5 }}>
            Yeni rehberler, kampanyalar ve özel fırsatlar e-postanıza gelsin.
          </p>
          {nlDone ? (
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:12,
                          padding:"14px 20px", color:"#fff", fontSize:14,
                          fontWeight:600, textAlign:"center" }}>
              ✓ Aboneliğiniz alındı!
            </div>
          ) : (
            <form onSubmit={sendNewsletter}
              style={{ display:"flex", gap:0, borderRadius:12, overflow:"hidden",
                       border:"1.5px solid rgba(255,255,255,0.15)" }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="E-posta adresiniz"
                style={{ flex:1, background:"rgba(255,255,255,0.07)", border:"none",
                         padding:"13px 16px", fontSize:13, color:"#fff",
                         outline:"none", fontFamily:"inherit" }} />
              <button type="submit"
                style={{ background:P, color:"#fff", border:"none",
                         padding:"13px 18px", fontSize:13, fontWeight:700,
                         cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
                Gönder
              </button>
            </form>
          )}
          <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", margin:"10px 0 0" }}>
            Üye olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
          </p>
        </section>

        {/* ════ FOOTER ════ */}
        <footer style={{ background:"#fff", borderTop:`1px solid ${BORDER}`, padding:"28px 20px 100px" }}>
          <div style={{ marginBottom:20 }}>
            <img src="/images/yourpoodle-logo.jpg" alt="YourPoodle" style={{ height:32, width:"auto", objectFit:"contain" }} />
            <p style={{ fontSize:12, color:MUTED, margin:"6px 0 12px", lineHeight:1.5 }}>
              Toy Poodle'ınızın mutlu ve sağlıklı yaşamı için alışveriş, bilgi ve topluluk platformu.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {[
                { label:"IG", href:"https://instagram.com/yourpoodle" },
                { label:"TK", href:"https://tiktok.com/@yourpoodle" },
                { label:"YT", href:"https://youtube.com/@yourpoodle" },
                { label:"PT", href:"https://pinterest.com/yourpoodle" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  style={{ width:34, height:34, borderRadius:8, border:`1px solid ${BORDER}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:11, fontWeight:700, color:TEXT, textDecoration:"none" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:24 }}>
            {[
              { title:"Keşfet",    links:[["Mağaza","/yourpoodle/magaza"],["Mama Bul","/yourpoodle/mama-bul"],["Rehber","/yourpoodle/rehber"],["Club","/yourpoodle/club"],["AI Asistan","/yourpoodle/ai-asistan"]] },
              { title:"Destek",   links:[["Sipariş Takibi","/yourpoodle/siparis-takip"],["İade & Değişim","/yourpoodle/iade"],["SSS","/yourpoodle/sss"],["İletişim","/iletisim"]] },
              { title:"Kurumsal", links:[["Hakkımızda","/hakkimizda"],["KVKK","/kvkk"],["Kariyer","/yourpoodle/kariyer"],["Gizlilik","/yourpoodle/gizlilik-politikasi"],["Kullanım Şartları","/yourpoodle/kullanim-sartlari"]] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:12, fontWeight:700, color:TEXT, marginBottom:10 }}>{col.title}</div>
                {col.links.map(([lbl, href]) => (
                  <a key={lbl} href={href}
                    style={{ display:"block", fontSize:12, color:MUTED,
                              textDecoration:"none", marginBottom:7,
                              transition:"color 0.15s" }}
                    onMouseOver={e => (e.currentTarget.style.color = P)}
                    onMouseOut={e => (e.currentTarget.style.color = MUTED)}>
                    {lbl}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:16 }}>
            destek@yourpoodle.com &nbsp;·&nbsp; Pzt–Cmt 09.00–18.00
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:16 }}>
            {["VISA","MC","TROY","AMEX"].map(b => (
              <div key={b} style={{ border:`1px solid ${BORDER}`, borderRadius:6,
                                     padding:"4px 8px", fontSize:10, fontWeight:800,
                                     color:MUTED, letterSpacing:0.5 }}>{b}</div>
            ))}
            <div style={{ border:`1px solid ${BORDER}`, borderRadius:6,
                           padding:"4px 8px", fontSize:10, fontWeight:700, color:"#22C55E" }}>
              🔒 PCI DSS
            </div>
          </div>
          <div style={{ fontSize:11, color:"#9CA3AF", textAlign:"center",
                         paddingTop:12, borderTop:`1px solid ${BORDER}` }}>
            © 2026 YourPoodle. Tüm hakları saklıdır. &nbsp;·&nbsp;
            <a href="/yourpoodle/gizlilik-politikasi" style={{ color:"#9CA3AF", textDecoration:"none" }}>Gizlilik</a> &nbsp;·&nbsp;
            <a href="/yourpoodle/cerez-politikasi" style={{ color:"#9CA3AF", textDecoration:"none" }}>Çerezler</a> &nbsp;·&nbsp;
            <a href="/kvkk" style={{ color:"#9CA3AF", textDecoration:"none" }}>KVKK</a>
          </div>
        </footer>
      </div>

      {/* ════ OVERLAYS ════ */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showCart   && <CartDrawer cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />}
      {showAi     && <AiModal onClose={() => setShowAi(false)} />}
      {toast      && <Toast msg={toast} onDone={() => setToast("")} />}

      {/* ════ BOTTOM NAV (same as all YP pages) ════ */}
      <YPBottomNav />
    </div>
  );
}
