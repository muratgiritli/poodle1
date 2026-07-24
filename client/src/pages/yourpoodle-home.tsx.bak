import { useState, useEffect, useRef } from "react";

/* ─── TOKENS ─── */
const P = "#7C3AED";
const PD = "#6D28D9";
const PL = "#EDE4FF";
const BORDER = "#E5E7EB";
const TEXT = "#111827";
const MUTED = "#6B7280";

/* ─── PRODUCTS ─── */
const PRODUCTS = [
  { id: 1, cat: "Kuru Mama",      name: "Royal Canin Poodle Adult",    sub: "1.5 kg",  price: 799,  old: 990,  disc: 19, img: "/product-images/yp-2716.jpg" },
  { id: 2, cat: "Kuru Mama",      name: "Pro Plan Small & Mini Adult", sub: "3 kg",    price: 1249, old: 1549, disc: 19, img: "/product-images/yp-2717.jpg" },
  { id: 3, cat: "Bakım",          name: "Göz Yaşı Bakım Losyonu",      sub: "100 ml",  price: 329,  old: null, disc: 0,  img: "/product-images/yp-2719.jpg" },
  { id: 4, cat: "Bakım",          name: "Buharlı Masaj Tarağı",        sub: "USB şarj", price: 449, old: 599,  disc: 25, img: "/product-images/yp-2721.png" },
  { id: 5, cat: "Gezdirme",       name: "Air Mesh Göğüs Tasması",      sub: "Pembe - S", price: 599, old: null, disc: 0, img: "/product-images/yp-2720.png" },
  { id: 6, cat: "Ödül & İtaatmak", name: "Somonlu Ödül Maması",       sub: "80 g",    price: 189,  old: null, disc: 0,  img: "/product-images/yp-2718.jpg" },
];

const GUIDES = [
  { title: "Tuvalet Eğitimi Nasıl Verilir?",       min: 5, img: "/images/poodle-avatar-1.jpg" },
  { title: "Toy Poodle Mama Seçim Rehberi",        min: 7, img: "/images/poodle-avatar-2.jpg" },
  { title: "Tüy Bakımı: Tarak ve Şampuan",         min: 4, img: "/images/poodle-avatar-3.jpg" },
];

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
const CartIcon = () => (
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
const ChevronIcon = () => (
  <svg width="16" height="16" fill="none" stroke={P} strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ─── TOAST ─── */
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      background: "#1F2937", color: "#fff", borderRadius: 10,
      padding: "11px 22px", fontSize: 13, fontWeight: 600,
      zIndex: 9999, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
      animation: "fadeInUp 0.22s ease"
    }}>{msg}</div>
  );
}

/* ─── HEART ─── */
function Heart({ wished, toggle }: { wished: boolean; toggle: () => void }) {
  return (
    <button onClick={e => { e.stopPropagation(); toggle(); }}
      style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.92)",
               border: "none", borderRadius: "50%", width: 32, height: 32,
               display: "flex", alignItems: "center", justifyContent: "center",
               cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill={wished ? P : "none"} stroke={wished ? P : "#9CA3AF"} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ p, onAdd, wished, toggleWish }: any) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14,
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "relative", background: "#F9F8FF", aspectRatio: "1/1" }}>
        <img src={p.img} alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: 12 }}
          loading="lazy"
          onError={e => { const t = e.target as HTMLImageElement;
            t.src = `https://placehold.co/200x200/F3F4F6/9CA3AF?text=${encodeURIComponent(p.cat)}`; }} />
        {p.disc > 0 && (
          <span style={{ position: "absolute", top: 8, left: 8,
                         background: "#EF4444", color: "#fff", fontSize: 10,
                         fontWeight: 800, padding: "3px 7px", borderRadius: 99 }}>
            %{p.disc}
          </span>
        )}
        <Heart wished={wished} toggle={toggleWish} />
      </div>
      <div style={{ padding: "10px 11px 13px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontSize: 10, color: P, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{p.cat}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, lineHeight: 1.35,
                       display: "-webkit-box", WebkitLineClamp: 2,
                       WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
          {p.name}
        </span>
        <span style={{ fontSize: 11, color: MUTED }}>{p.sub}</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: TEXT }}>{p.price.toLocaleString("tr-TR")} TL</span>
          {p.old && (
            <span style={{ fontSize: 11, color: "#9CA3AF", textDecoration: "line-through" }}>
              {p.old.toLocaleString("tr-TR")} TL
            </span>
          )}
        </div>
        <button onClick={() => onAdd(p)}
          style={{ marginTop: 8, width: "100%", background: P, color: "#fff",
                   border: "none", borderRadius: 10, padding: "10px 0",
                   fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                   transition: "background 0.15s" }}
          onMouseOver={e => (e.currentTarget.style.background = PD)}
          onMouseOut={e => (e.currentTarget.style.background = P)}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

/* ─── SEARCH MODAL ─── */
function SearchModal({ q, setQ, onClose, products }: any) {
  const filtered = q.length > 1
    ? products.filter((p: any) => p.name.toLowerCase().includes(q.toLowerCase()))
    : [];
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 10000,
                  display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 0 }}
         onClick={onClose}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 430, padding: "16px",
                    borderRadius: "0 0 20px 20px", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
           onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Ürün, mama veya rehber ara..."
            style={{ flex: 1, border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px",
                     fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><CloseIcon /></button>
        </div>
        {filtered.length > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((p: any) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10,
                                       padding: "8px", borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <img src={p.img} alt={p.name}
                  style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 8, background: "#F9F8FF" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: P, fontWeight: 700 }}>{p.price.toLocaleString("tr-TR")} TL</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {q.length > 1 && filtered.length === 0 && (
          <p style={{ textAlign: "center", color: MUTED, fontSize: 13, marginTop: 16 }}>Sonuç bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

/* ─── CART DRAWER ─── */
function CartDrawer({ items, onClose, onRemove, onQty }: any) {
  const total = items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 10000, display: "flex", justifyContent: "flex-end" }}
         onClick={onClose}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 380, height: "100%",
                    display: "flex", flexDirection: "column", boxShadow: "-4px 0 30px rgba(0,0,0,0.1)" }}
           onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Sepetim</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><CloseIcon /></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {items.length === 0 && (
            <p style={{ color: MUTED, textAlign: "center", marginTop: 40 }}>Sepetiniz boş.</p>
          )}
          {items.map((item: any) => (
            <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center",
                                         borderBottom: `1px solid ${BORDER}`, paddingBottom: 12 }}>
              <img src={item.img} alt={item.name}
                style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 8, background: "#F9F8FF" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: MUTED }}>{item.sub}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: P, marginTop: 3 }}>
                  {(item.price * item.qty).toLocaleString("tr-TR")} TL
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button onClick={() => onQty(item.id, item.qty - 1)}
                  style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${BORDER}`,
                           background: "#fff", fontSize: 16, cursor: "pointer", display: "flex",
                           alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => onQty(item.id, item.qty + 1)}
                  style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${BORDER}`,
                           background: "#fff", fontSize: 16, cursor: "pointer", display: "flex",
                           alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
              <span>Toplam</span>
              <span style={{ color: P }}>{total.toLocaleString("tr-TR")} TL</span>
            </div>
            <button style={{ width: "100%", background: P, color: "#fff", border: "none",
                             borderRadius: 12, padding: "14px 0", fontSize: 14, fontWeight: 700,
                             cursor: "pointer", fontFamily: "inherit" }}>
              Alışverişi Tamamla
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── SIGNUP MODAL ─── */
function SignupModal({ onClose, onSuccess }: any) {
  const [form, setForm] = useState({ name: "", email: "", pass: "" });
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const submit = (e: any) => {
    e.preventDefault();
    onClose();
    onSuccess("Hoş geldiniz! 100 TL bonus hesabınıza tanımlandı.");
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000,
                  display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
         onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 360 }}
           onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>Üye Ol, 100 TL Kazan 🎁</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><CloseIcon /></button>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["Ad Soyad", "name", "text"], ["E-posta", "email", "email"], ["Şifre", "pass", "password"]].map(([lbl, key, type]) => (
            <input key={key} type={type} placeholder={lbl} required
              value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{ border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "11px 14px",
                       fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          ))}
          <button type="submit"
            style={{ background: P, color: "#fff", border: "none", borderRadius: 12,
                     padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Üye Ol
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── AI CHAT MODAL ─── */
function AiModal({ onClose }: any) {
  const [msgs, setMsgs] = useState([
    { from: "ai", text: "Merhaba! Toy Poodle'ınız hakkında size nasıl yardımcı olabilirim?" }
  ]);
  const [inp, setInp] = useState("");
  const REPLIES = [
    "Toy Poodle'lar için günlük mama miktarı genellikle vücut ağırlığının %2-3'ü kadardır.",
    "Tüy bakımı için 4-6 haftada bir profesyonel grooming önerilir.",
    "Royal Canin Poodle Adult bu ırk için özel formüle edilmiştir.",
    "Yavru poodle'lar için tuvalet eğitimine 8 haftadan itibaren başlanabilir.",
    "Gözyaşı lekeleri için günlük göz temizliği çok önemlidir.",
  ];
  const send = () => {
    if (!inp.trim()) return;
    setMsgs(m => [...m, { from: "user", text: inp },
      { from: "ai", text: REPLIES[Math.floor(Math.random() * REPLIES.length)] }]);
    setInp("");
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [msgs]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000,
                  display: "flex", alignItems: "flex-end", justifyContent: "center" }}
         onClick={onClose}>
      <div style={{ background: "#fff", width: "100%", maxWidth: 430, borderRadius: "20px 20px 0 0",
                    height: "60vh", display: "flex", flexDirection: "column" }}
           onClick={e => e.stopPropagation()}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
                          borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18 }}>✨</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>AI Asistan</div>
              <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 600 }}>● Çevrimiçi</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED }}><CloseIcon /></button>
        </div>
        <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "78%", background: m.from === "user" ? P : "#F3F4F6",
                             color: m.from === "user" ? "#fff" : TEXT,
                             padding: "10px 14px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                             fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORDER}`,
                      display: "flex", gap: 8 }}>
          <input value={inp} onChange={e => setInp(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Mesajınızı yazın..."
            style={{ flex: 1, border: `1.5px solid ${BORDER}`, borderRadius: 24,
                     padding: "10px 16px", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          <button onClick={send}
            style={{ background: P, color: "#fff", border: "none", borderRadius: 24,
                     padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN
══════════════════════════════════ */
export default function YourPoodleDemo3() {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (p: any) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    showToast("Sepete eklendi ✓");
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const toggleWish = (id: number) => {
    setWishlist(prev => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); showToast("Favorilerden çıkarıldı"); }
      else { n.add(id); showToast("Favorilere eklendi ♥"); }
      return n;
    });
  };

  const showToast = (msg: string) => setToast(msg);

  const sendNewsletter = (e: any) => {
    e.preventDefault();
    if (!email.includes("@")) { showToast("Geçerli bir e-posta girin."); return; }
    setNewsletterDone(true);
    setEmail("");
    showToast("Aboneliğiniz alındı!");
  };

  const navItems = [
    { label: "Mağaza", anchor: "#products" },
    { label: "Mama Bul", anchor: "#hero" },
    { label: "Rehber", anchor: "#guides" },
    { label: "AI Asistan", anchor: "#ai" },
    { label: "Club", anchor: "#club" },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "#F5F5F7",
                  display: "flex", justifyContent: "center",
                  fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 430, background: "#fff", minHeight: "100dvh",
                    position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.07)" }}>

        {/* ═══ ANNOUNCEMENT BAR ═══ */}
        {announcementVisible && (
          <div style={{ background: P, color: "#fff", textAlign: "center",
                        fontSize: 13, fontWeight: 500, padding: "9px 40px 9px 16px",
                        position: "relative", minHeight: 38, display: "flex",
                        alignItems: "center", justifyContent: "center" }}>
            🎁 750 TL Üzeri Ücretsiz Kargo
            <button onClick={() => setAnnouncementVisible(false)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                       background: "none", border: "none", color: "rgba(255,255,255,0.8)",
                       cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 4 }}>✕</button>
          </div>
        )}

        {/* ═══ STICKY HEADER ═══ */}
        <header style={{ position: "sticky", top: 0, zIndex: 999, background: "#fff",
                         borderBottom: `1px solid ${BORDER}`,
                         padding: "0 16px", height: 60,
                         display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 26, color: P,
                         lineHeight: 1, cursor: "pointer" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            YourPoodle
          </span>
          {/* Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => setShowSearch(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: TEXT,
                       padding: "8px", borderRadius: 8, display: "flex" }}>
              <SearchIcon />
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: TEXT,
                              padding: "8px", borderRadius: 8, display: "flex" }}>
              <UserIcon />
            </button>
            <button onClick={() => setShowCart(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: TEXT,
                       padding: "8px", borderRadius: 8, display: "flex", position: "relative" }}>
              <CartIcon />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2,
                               background: P, color: "#fff", borderRadius: "50%",
                               width: 18, height: 18, fontSize: 10, fontWeight: 800,
                               display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ═══ NAV BAR ═══ */}
        <nav style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`,
                      overflowX: "auto", display: "flex", padding: "0 4px",
                      scrollbarWidth: "none" }}>
          {navItems.map(n => (
            <a key={n.label} href={n.anchor}
              style={{ flex: "none", padding: "12px 16px", fontSize: 14, fontWeight: 500,
                       color: TEXT, textDecoration: "none", whiteSpace: "nowrap",
                       borderBottom: n.label === "Mağaza" ? `2px solid ${P}` : "2px solid transparent",
                       transition: "color 0.15s" }}
              onMouseOver={e => (e.currentTarget.style.color = P)}
              onMouseOut={e => (e.currentTarget.style.color = TEXT)}>
              {n.label}
            </a>
          ))}
        </nav>

        {/* ═══ HERO ═══ */}
        <section id="hero" style={{ position: "relative", height: 460, overflow: "hidden" }}>
          <img src="/images/poodle-hero.jpg" alt="Toy Poodle"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                     objectFit: "cover", objectPosition: "center top" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          {/* gradient overlay */}
          <div style={{ position: "absolute", inset: 0,
                        background: "linear-gradient(to right, rgba(255,255,255,0.96) 45%, rgba(255,255,255,0.1) 100%)" }} />
          <div style={{ position: "relative", padding: "40px 20px 0", maxWidth: 240 }}>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: TEXT, lineHeight: 1.2,
                         margin: "0 0 12px" }}>
              Toy Poodle'ınız İçin Her Şey
            </h1>
            <p style={{ fontSize: 14, color: MUTED, margin: "0 0 24px", lineHeight: 1.5 }}>
              Doğru mama, güvenilir rehber ve size özel bakım desteği.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={{ background: P, color: "#fff", border: "none", borderRadius: 12,
                               padding: "13px 28px", fontSize: 14, fontWeight: 700,
                               cursor: "pointer", fontFamily: "inherit", width: "fit-content",
                               transition: "background 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.background = PD)}
                onMouseOut={e => (e.currentTarget.style.background = P)}>
                Mama Bul
              </button>
              <button style={{ background: "#fff", color: P, border: `2px solid ${P}`,
                               borderRadius: 12, padding: "12px 28px", fontSize: 14,
                               fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                               width: "fit-content" }}>
                Rehbere Git
              </button>
            </div>
          </div>
          {/* AI Badge */}
          <button onClick={() => setShowAi(true)}
            style={{ position: "absolute", bottom: 20, right: 16,
                     background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
                     color: "#fff", border: "none", borderRadius: 24,
                     padding: "10px 16px", fontSize: 12, fontWeight: 700,
                     cursor: "pointer", fontFamily: "inherit",
                     boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                     display: "flex", alignItems: "center", gap: 6,
                     transform: "translateY(0)", transition: "transform 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}>
            ✨ AI Asistan <span style={{ opacity: 0.8, fontWeight: 400 }}>7/24 Yanınızda</span>
          </button>
        </section>

        {/* ═══ PROMO BANNER ═══ */}
        <div style={{ background: PL, margin: "0", padding: "14px 20px",
                      display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🎁</span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: TEXT }}>
            Yeni Üye Ol, 100 TL Bonus Kazan
          </span>
          <button onClick={() => setShowSignup(true)}
            style={{ background: P, color: "#fff", border: "none", borderRadius: 10,
                     padding: "9px 14px", fontSize: 12, fontWeight: 700,
                     cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                     transition: "background 0.15s" }}
            onMouseOver={e => (e.currentTarget.style.background = PD)}
            onMouseOut={e => (e.currentTarget.style.background = P)}>
            Hemen Üye Ol
          </button>
        </div>

        {/* ═══ PRODUCTS ═══ */}
        <section id="products" style={{ padding: "24px 16px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0 }}>Sizin İçin Seçtiklerimiz</h2>
            <a href="#" style={{ fontSize: 13, color: P, fontWeight: 600, textDecoration: "none",
                                  display: "flex", alignItems: "center", gap: 2 }}>
              Tümünü Gör <ChevronIcon />
            </a>
          </div>
          <p style={{ fontSize: 12, color: MUTED, margin: "0 0 16px" }}>Poodle'ınıza özel seçilmiş ürünler</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {PRODUCTS.map(p => (
              <ProductCard key={p.id} p={p}
                onAdd={addToCart}
                wished={wishlist.has(p.id)}
                toggleWish={() => toggleWish(p.id)} />
            ))}
          </div>
        </section>

        {/* ═══ GUIDE SECTION ═══ */}
        <section id="guides" style={{ padding: "0 16px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: 0 }}>Poodle Rehberinden</h2>
            <a href="#" style={{ fontSize: 13, color: P, fontWeight: 600, textDecoration: "none",
                                  display: "flex", alignItems: "center", gap: 2 }}>
              Tüm Rehberi Keşfet <ChevronIcon />
            </a>
          </div>
          {/* Featured + list */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Featured image */}
            <div style={{ flex: "0 0 140px", height: 200, borderRadius: 14, overflow: "hidden",
                           background: "#F3EEFF" }}>
              <img src="/images/poodle-avatar-1.jpg" alt="Rehber"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.target as HTMLImageElement).src =
                  "https://placehold.co/140x200/EDE4FF/7C3AED?text=Rehber"; }} />
            </div>
            {/* Article list */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
              {GUIDES.map((g, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center",
                                       padding: "11px 0",
                                       borderBottom: i < GUIDES.length - 1 ? `1px solid ${BORDER}` : "none",
                                       cursor: "pointer" }}>
                  <img src={g.img} alt={g.title}
                    style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", background: PL, flexShrink: 0 }}
                    onError={e => { (e.target as HTMLImageElement).src =
                      `https://placehold.co/48x48/EDE4FF/7C3AED?text=${i+1}`; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, lineHeight: 1.35,
                                   display: "-webkit-box", WebkitLineClamp: 2,
                                   WebkitBoxOrient: "vertical" as any, overflow: "hidden" }}>
                      {g.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <ClockIcon />
                      <span style={{ fontSize: 11, color: MUTED }}>{g.min} dk okuma</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ AI BANNER ═══ */}
        <section id="ai" style={{ margin: "0 16px 28px" }}>
          <div style={{ background: `linear-gradient(135deg, #F3E8FF, #EDE4FF)`,
                        borderRadius: 16, padding: "20px", display: "flex",
                        alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${P}, #8B5CF6)`,
                          borderRadius: 14, display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 3 }}>Cevabını hemen bul</div>
              <div style={{ fontSize: 12, color: MUTED }}>Poodle'ınızla merak ettiğiniz her şeyi sorun.</div>
            </div>
            <button onClick={() => setShowAi(true)}
              style={{ background: P, color: "#fff", border: "none", borderRadius: 10,
                       padding: "10px 14px", fontSize: 12, fontWeight: 700,
                       cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              AI Asistan'a Sor
            </button>
          </div>
        </section>

        {/* ═══ CLUB ═══ */}
        <section id="club" style={{ margin: "0 16px 28px" }}>
          <div style={{ background: P, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "24px 24px 20px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
                YourPoodle Club'a Katıl
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {["Üyelere özel indirimler", "Uzmanlara soru sor", "Poodle severlerle tanış"].map(txt => (
                  <div key={txt} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%",
                                   background: "rgba(255,255,255,0.25)",
                                   display: "flex", alignItems: "center", justifyContent: "center",
                                   flexShrink: 0 }}>
                      <CheckIcon />
                    </div>
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.92)" }}>{txt}</span>
                  </div>
                ))}
              </div>
              <button style={{ background: "#fff", color: P, border: "none", borderRadius: 12,
                               padding: "12px 24px", fontSize: 14, fontWeight: 700,
                               cursor: "pointer", fontFamily: "inherit" }}>
                Club'ı Keşfet
              </button>
            </div>
            {/* Group photo */}
            <div style={{ position: "relative", height: 180, background: "rgba(255,255,255,0.08)" }}>
              <img src="/images/poodle-avatar-4.jpg" alt="Club"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
                onError={e => { (e.target as HTMLImageElement).src =
                  "https://placehold.co/400x180/6D28D9/ffffff?text=10.000%2B+Poodle+Sever"; }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
                             background: "linear-gradient(to top, rgba(109,40,217,0.9) 0%, transparent 100%)",
                             padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex" }}>
                  {[1,2,3,4].map(n => (
                    <img key={n} src={`/images/poodle-avatar-${n}.jpg`} alt=""
                      style={{ width: 28, height: 28, borderRadius: "50%",
                               border: "2px solid white", marginLeft: n === 1 ? 0 : -8,
                               objectFit: "cover", background: PL }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>10.000+ Poodle sever</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ NEWSLETTER ═══ */}
        <section style={{ background: "#1A0A2E", padding: "32px 20px", margin: "0 0 0 0" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>
            Poodle dünyasından haberdar ol.
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "0 0 18px" }}>
            Yeni rehberler, kampanyalar ve özel fırsatlar e-postanıza gelsin.
          </p>
          {newsletterDone ? (
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12,
                          padding: "14px 20px", color: "#fff", fontSize: 14, fontWeight: 600,
                          textAlign: "center" }}>
              ✓ Aboneliğiniz alındı!
            </div>
          ) : (
            <form onSubmit={sendNewsletter}
              style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden",
                       border: `1.5px solid rgba(255,255,255,0.15)` }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="E-posta adresiniz"
                style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "none",
                         padding: "13px 16px", fontSize: 13, color: "#fff",
                         outline: "none", fontFamily: "inherit" }} />
              <button type="submit"
                style={{ background: P, color: "#fff", border: "none",
                         padding: "13px 18px", fontSize: 13, fontWeight: 700,
                         cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
                Gönder
              </button>
            </form>
          )}
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "10px 0 0" }}>
            Üye olarak KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
          </p>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "28px 20px 24px" }}>
          {/* Logo + social */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: "'Pacifico', cursive", fontSize: 22, color: P }}>YourPoodle</span>
            <p style={{ fontSize: 12, color: MUTED, margin: "6px 0 12px", lineHeight: 1.5 }}>
              Toy Poodle'ınızın mutlu ve sağlıklı yaşamı için alışveriş, bilgi ve topluluk platformu.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["IG", "TK", "YT", "PT"].map(s => (
                <a key={s} href="#"
                  style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${BORDER}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, color: TEXT, textDecoration: "none" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          {/* Link columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
            {[
              { title: "Keşfet", links: ["Mağaza", "Mama Bul", "Rehber", "Club", "AI Asistan"] },
              { title: "Destek", links: ["Sipariş Takibi", "İade & Değişim", "SSS", "İletişim"] },
              { title: "Kurumsal", links: ["Hakkımızda", "KVKK", "Kariyer", "Gizlilik Politikası", "Kullanım Koşulları"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{col.title}</div>
                {col.links.map(l => (
                  <a key={l} href="#"
                    style={{ display: "block", fontSize: 12, color: MUTED,
                              textDecoration: "none", marginBottom: 7,
                              transition: "color 0.15s" }}
                    onMouseOver={e => (e.currentTarget.style.color = P)}
                    onMouseOut={e => (e.currentTarget.style.color = MUTED)}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
          {/* Contact */}
          <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
            destek@yourpoodle.com &nbsp;·&nbsp; Pzt–Cmt 09.00–18.00
          </div>
          {/* Payments */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {["VISA", "MC", "TROY", "AMEX"].map(b => (
              <div key={b} style={{ border: `1px solid ${BORDER}`, borderRadius: 6,
                                     padding: "4px 8px", fontSize: 10, fontWeight: 800,
                                     color: MUTED, letterSpacing: 0.5 }}>{b}</div>
            ))}
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 6,
                           padding: "4px 8px", fontSize: 10, fontWeight: 700,
                           color: "#22C55E" }}>🔒 PCI DSS</div>
          </div>
          {/* Copyright */}
          <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", paddingTop: 12,
                         borderTop: `1px solid ${BORDER}` }}>
            © 2026 YourPoodle. Tüm hakları saklıdır. &nbsp;·&nbsp;
            <a href="#" style={{ color: "#9CA3AF", textDecoration: "none" }}>Gizlilik</a> &nbsp;·&nbsp;
            <a href="#" style={{ color: "#9CA3AF", textDecoration: "none" }}>Çerezler</a> &nbsp;·&nbsp;
            <a href="#" style={{ color: "#9CA3AF", textDecoration: "none" }}>KVKK</a>
          </div>
        </footer>
      </div>

      {/* ═══ MODALS & OVERLAYS ═══ */}
      {showSearch && <SearchModal q={searchQ} setQ={setSearchQ} onClose={() => { setShowSearch(false); setSearchQ(""); }} products={PRODUCTS} />}
      {showCart && <CartDrawer items={cart} onClose={() => setShowCart(false)} onRemove={(id: number) => setCart(c => c.filter(i => i.id !== id))} onQty={updateQty} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSuccess={showToast} />}
      {showAi && <AiModal onClose={() => setShowAi(false)} />}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}
