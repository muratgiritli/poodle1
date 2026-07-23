import React, { useState } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  primary:   '#7C3AED',
  amber:     '#F59E0B',
  bg:        '#F9FAFB',
  text:      '#171717',
  secondary: '#6B7280',
  success:   '#10B981',
  border:    '#EDE9FE',
  cardBg:    '#FFFFFF',
};
const card: React.CSSProperties = {
  background: C.cardBg,
  borderRadius: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  padding: 16,
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const products = [
  { id:1, name:'Royal Canin Poodle Adult 3kg', price:1500, orig:2000, img:'https://placehold.co/120x120/EDE9FE/7C3AED?text=RC' },
  { id:2, name:'Reflex Plus Poodle 2kg',       price:800,  orig:1000, img:'https://placehold.co/120x120/FEF3C7/F59E0B?text=RFX' },
  { id:3, name:'Hills Science Plan Puppy 1kg', price:620,  orig:null,  img:'https://placehold.co/120x120/D1FAE5/10B981?text=HILLS' },
  { id:4, name:'N&D Pumpkin Poodle 2kg',       price:950,  orig:1200, img:'https://placehold.co/120x120/FCE7F3/EC4899?text=N%26D' },
  { id:5, name:'Pro Plan Small Adult 3kg',     price:1100, orig:null,  img:'https://placehold.co/120x120/DBEAFE/3B82F6?text=PP' },
];

const shortcuts = [
  { icon:'🛍️', label:'Mağaza',  sub:'Tüm ürünler' },
  { icon:'⚡',  label:'Araçlar', sub:'Hesapla & bul' },
  { icon:'📖',  label:'Rehber',  sub:'Bakım ipuçları' },
  { icon:'👥',  label:'Topluluk',sub:'Poodle sahipleri' },
];

const quickTools = [
  { icon:'🍽️', label:'Mama Bul',     desc:'Irka özel öneri' },
  { icon:'⚖️', label:'Kilo Takibi',  desc:'İdeal ağırlık' },
  { icon:'💉', label:'Aşı Takvimi',  desc:'Hatırlatıcı kur' },
  { icon:'✂️', label:'Tıraş Planı',  desc:'Sezon rehberi' },
];

const articles = [
  { cat:'Beslenme', title:'Toy Poodle İçin En İyi 5 Mama', time:'3 dk', color:'#FEF3C7' },
  { cat:'Sağlık',   title:'Diş Bakımı Nasıl Yapılır?',      time:'5 dk', color:'#D1FAE5' },
  { cat:'Eğitim',   title:'Tuvalet Eğitiminde 7 Adım',       time:'4 dk', color:'#EDE9FE' },
];

const faqs = [
  { q:'Toy Poodle günde kaç öğün yemeli?',        a:'Yetişkin Toy Poodle genellikle günde 2–3 küçük öğün yer. 3 aylıktan küçük yavrular 4 öğüne çıkabilir.' },
  { q:'Hangi mama markası Toy Poodle\'a uygundur?', a:'Royal Canin Poodle Adult, Hill\'s Science Plan ve Reflex Plus veterinerlerce önerilen başlıca seçeneklerdir.' },
  { q:'Tüy dökülmesi normalmi?',                   a:'Poodle\'lar az döker. Aşırı dökülme beslenme sorunu veya stres işareti olabilir; veterinere danışın.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ title, link, href='#' }: { title: string; link?: string; href?: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
      <span style={{ fontSize:18, fontWeight:700, color:C.text }}>{title}</span>
      {link && <a href={href} style={{ fontSize:13, color:C.primary, fontWeight:600, textDecoration:'none' }}>{link} →</a>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function KartHero() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [cartCount] = useState(1);

  return (
    <div style={{ width:390, margin:'0 auto', background:C.bg, fontFamily:'system-ui,-apple-system,sans-serif', color:C.text, paddingBottom:72 }}>

      {/* ── 0. Duyuru bandı ─────────────────────────────────────── */}
      <div style={{ background:C.primary, color:'#fff', fontSize:12, fontWeight:500, textAlign:'center', padding:'6px 16px', letterSpacing:0.2 }}>
        🎁 Yeni üyelere özel 100 TL bonus — <span style={{ textDecoration:'underline', cursor:'pointer' }}>Hemen kazan</span>
      </div>

      {/* ── 0. Header ───────────────────────────────────────────── */}
      <div style={{ background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', height:52, borderBottom:'1px solid #F3F4F6', position:'sticky', top:0, zIndex:50 }}>
        {/* Sol: hamburger */}
        <button style={{ minWidth:44, minHeight:44, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'flex-start', fontSize:20, color:C.text, padding:0 }}>☰</button>
        {/* Logo */}
        <span style={{ fontSize:16, fontWeight:800, color:C.primary, letterSpacing:-0.3 }}>YourPoodle 🐾</span>
        {/* Sağ: arama + sepet + cta */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <button style={{ minWidth:44, minHeight:44, background:'none', border:'none', cursor:'pointer', fontSize:18, color:C.text, display:'flex', alignItems:'center', justifyContent:'center' }}>🔍</button>
          <button style={{ minWidth:44, minHeight:44, background:'none', border:'none', cursor:'pointer', fontSize:18, color:C.text, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            🛒
            {cartCount > 0 && <span style={{ position:'absolute', top:8, right:8, width:8, height:8, background:'#EF4444', borderRadius:'50%', border:'1.5px solid #fff' }} />}
          </button>
          <button style={{ height:32, padding:'0 12px', background:C.primary, color:'#fff', border:'none', borderRadius:999, fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>Üye Ol</button>
        </div>
      </div>

      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <div style={{ padding:'12px 16px 0' }}>
        <div style={{ background:'linear-gradient(135deg,#F0EAFF,#EAE0FF,#E8DFFF)', borderRadius:20, overflow:'hidden', position:'relative', display:'flex', minHeight:280 }}>
          {/* Sol */}
          <div style={{ flex:'0 0 54%', padding:'20px 8px 20px 18px', display:'flex', flexDirection:'column', zIndex:10, position:'relative' }}>
            <div style={{ fontSize:16, fontWeight:900, color:C.primary, lineHeight:1.25, letterSpacing:-0.3 }}>
              Toy Poodle'ınız için her şey tek yerde <span style={{ color:'#F9A8D4' }}>♡</span>
            </div>
            <div style={{ fontSize:12, color:C.secondary, marginTop:8, marginBottom:14, lineHeight:1.6 }}>
              Beslenme, bakım ve sağlık — hepsi burada.
            </div>
            <button style={{ height:42, borderRadius:999, background:C.primary, color:'#fff', fontSize:15, fontWeight:600, border:'none', boxShadow:'0 4px 14px rgba(124,58,237,0.32)', cursor:'pointer' }}>
              🐾 Mama Bul
            </button>
            {/* Sosyal kanıt — tek satır */}
            <div style={{ marginTop:'auto', paddingTop:12, display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ display:'flex' }}>
                {[1,2,3].map(n => (
                  <img key={n} src={`/__mockup/images/poodle-avatar-${n}.jpg`} style={{ width:20, height:20, borderRadius:'50%', border:'1.5px solid #fff', objectFit:'cover', marginLeft: n>1 ? -6 : 0 }} alt="" />
                ))}
              </div>
              <span style={{ fontSize:11, color:C.secondary }}>
                <span style={{ color:C.amber }}>★★★★★</span> <b style={{ color:C.text }}>50K+</b> güveniyor
              </span>
            </div>
          </div>
          {/* Sağ — poodle fotoğrafı */}
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'48%', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, left:0, width:28, background:'linear-gradient(to right,#EBE1FF,transparent)', zIndex:1 }} />
            <img src="/__mockup/images/poodle-hero_2.jpg" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} alt="Poodle" />
          </div>
        </div>
      </div>

      {/* ── 2. Ürün vitrini ─────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <SectionHeader title="Poodle için Seçilenler" link="Tümünü Gör" href="/magaza" />
        <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8, scrollbarWidth:'none' }}>
          {products.map(p => (
            <div key={p.id} style={{ flex:'0 0 140px', background:'#fff', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
              <img src={p.img} style={{ width:'100%', height:110, objectFit:'cover', display:'block' }} alt={p.name} />
              <div style={{ padding:'10px 10px 12px' }}>
                <div style={{ fontSize:12, color:C.text, fontWeight:600, lineHeight:1.35, marginBottom:6, minHeight:32 }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:8 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.primary }}>₺{p.price.toLocaleString()}</span>
                  {p.orig && <span style={{ fontSize:11, color:C.secondary, textDecoration:'line-through' }}>₺{p.orig.toLocaleString()}</span>}
                </div>
                <button style={{ width:'100%', height:34, borderRadius:10, background:C.primary, color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>Sepete Ekle</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Kısayollar ───────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {shortcuts.map(s => (
            <div key={s.label} style={{ background:'#fff', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', padding:'12px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', textAlign:'center' }}>
              <span style={{ fontSize:22 }}>{s.icon}</span>
              <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{s.label}</span>
              <span style={{ fontSize:10, color:C.secondary, lineHeight:1.3 }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Hızlı Araçlar ────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <SectionHeader title="Hızlı Araçlar" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {quickTools.map(t => (
            <div key={t.label} style={{ ...card, display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
              <span style={{ fontSize:26, flexShrink:0 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{t.label}</div>
                <div style={{ fontSize:12, color:C.secondary, marginTop:2 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. En Çok Okunanlar ─────────────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <SectionHeader title="En Çok Okunanlar" link="Tümü" />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {articles.map((a,i) => (
            <div key={i} style={{ ...card, display:'flex', gap:12, padding:12, cursor:'pointer' }}>
              {/* Kapak fotoğrafı placeholder */}
              <div style={{ width:72, height:54, borderRadius:10, background:a.color, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
                {['🍽️','🦷','🏠'][i]}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ display:'inline-block', fontSize:10, fontWeight:600, color:C.primary, background:'#F3EEFF', borderRadius:999, padding:'2px 8px', marginBottom:4 }}>{a.cat}</span>
                <div style={{ fontSize:14, fontWeight:600, color:C.text, lineHeight:1.35 }}>{a.title}</div>
                <div style={{ fontSize:11, color:C.secondary, marginTop:4 }}>⏱ {a.time} okuma</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. AI Asistan (ince banner) ─────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <div style={{ background:'linear-gradient(135deg,#1E0B3B,#4C1D95)', borderRadius:16, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:32, flexShrink:0 }}>🤖</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:2 }}>Sorunuz mu var? AI Asistan 7/24</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>Poodle'ınız için anında yanıt alın.</div>
          </div>
          <button style={{ height:38, padding:'0 14px', background:'#fff', color:C.primary, borderRadius:999, fontSize:13, fontWeight:700, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            Sor →
          </button>
        </div>
      </div>

      {/* ── 7. Testimonial (1 adet) ─────────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <div style={{ ...card, position:'relative' }}>
          <div style={{ fontSize:32, color:C.amber, lineHeight:1, marginBottom:8 }}>"</div>
          <div style={{ fontSize:14, color:C.text, lineHeight:1.6, fontStyle:'italic' }}>
            YourPoodle sayesinde Charlie'nin mamasını değiştirdik; 3 haftada tüyleri inanılmaz parladı. Artık her şeyi buradan takip ediyoruz.
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}>
            <img src="/__mockup/images/poodle-avatar-2.jpg" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}` }} alt="" />
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Selin K.</div>
              <div style={{ fontSize:11, color:C.amber }}>★★★★★</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8. SSS (3 adet) ─────────────────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <SectionHeader title="Sık Sorulanlar" link="Tümünü Gör" />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {faqs.map((f,i) => (
            <div key={i} style={{ ...card, padding:'14px 16px', cursor:'pointer' }} onClick={() => setOpenFaq(openFaq===i ? null : i)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:14, fontWeight:600, color:C.text, lineHeight:1.4, flex:1 }}>{f.q}</span>
                <span style={{ fontSize:16, color:C.primary, flexShrink:0, transition:'transform 0.2s', transform: openFaq===i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
              {openFaq===i && (
                <div style={{ fontSize:13, color:C.secondary, marginTop:10, lineHeight:1.6, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 9. Üyelik CTA (tek promo) ───────────────────────────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <div style={{ background:'linear-gradient(135deg,#F3EEFF,#FCE7F3)', borderRadius:16, padding:'20px 18px', display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:36, flexShrink:0 }}>🎁</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>100 TL Bonus Bekliyor</div>
            <div style={{ fontSize:13, color:C.secondary, lineHeight:1.5 }}>Ücretsiz hesap aç, hemen kullan.</div>
          </div>
          <button style={{ height:40, padding:'0 16px', background:C.primary, color:'#fff', borderRadius:999, fontSize:14, fontWeight:700, border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
            Üye Ol
          </button>
        </div>
      </div>

      {/* ── 10. Platform Hakkında (görünür, SEO-friendly) ───────── */}
      <div style={{ padding:'20px 16px 0' }}>
        <div style={{ ...card, background:C.bg, boxShadow:'none', border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>YourPoodle Hakkında</div>
          <p style={{ fontSize:13, color:C.secondary, lineHeight:1.7, margin:0 }}>
            YourPoodle, Türkiye'deki Toy Poodle sahipleri için tasarlanmış bir platformdur. Mama önerileri, bakım rehberleri, AI destekli sağlık asistanı ve Poodle topluluğunu tek çatı altında sunar. 50.000'den fazla Poodle sever bu platformu tercih etmektedir.
          </p>
        </div>
      </div>

      {/* ── 11. Güven rozetleri ─────────────────────────────────── */}
      <div style={{ padding:'20px 16px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center' }}>
          {[
            { icon:'🔒', label:'SSL Güvenli' },
            { icon:'🚚', label:'Hızlı Teslimat' },
            { icon:'↩️', label:'Kolay İade' },
            { icon:'💬', label:'7/24 Destek' },
          ].map(b => (
            <div key={b.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:20 }}>{b.icon}</span>
              <span style={{ fontSize:10, color:C.secondary, textAlign:'center', fontWeight:500 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Alt navigasyon ──────────────────────────────────────── */}
      <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:390, background:'#fff', borderTop:'1px solid #F3F4F6', display:'flex', zIndex:60, boxShadow:'0 -2px 12px rgba(0,0,0,0.06)' }}>
        {[
          { icon:'🏠', label:'Ana Sayfa', active:true },
          { icon:'🍽️', label:'Mama',      active:false },
          { icon:'🛒', label:'Sepet',     active:false, badge:cartCount },
          { icon:'📖', label:'Rehber',    active:false },
          { icon:'👤', label:'Profil',    active:false },
        ].map(tab => (
          <div key={tab.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'8px 0 10px', cursor:'pointer', position:'relative', minHeight:56 }}>
            <span style={{ fontSize:24, lineHeight:1 }}>{tab.icon}</span>
            {tab.badge ? <span style={{ position:'absolute', top:6, right:'28%', width:8, height:8, background:'#EF4444', borderRadius:'50%', border:'1.5px solid #fff' }} /> : null}
            <span style={{ fontSize:11, marginTop:3, fontWeight: tab.active ? 700 : 400, color: tab.active ? C.primary : C.secondary, borderBottom: tab.active ? `2px solid ${C.primary}` : 'none', paddingBottom:1 }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
