import { useState } from "react";
import { MapPin, Phone, Star, Navigation, Clock, ChevronRight } from "lucide-react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

type ServiceType = "hepsi" | "kuafor" | "veteriner" | "petshop" | "egitim";
type City = "hepsi" | "istanbul" | "ankara" | "izmir" | "bursa" | "antalya" | "samsun";

interface Venue {
  id: string;
  name: string;
  type: ServiceType;
  city: City;
  district: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  distance: string;
  hours: string;
  tags: string[];
}

const VENUES: Venue[] = [
  { id:"v1",  name:"Poodle Palace Kuaför",       type:"kuafor",    city:"istanbul", district:"Beşiktaş",  address:"Sinanpaşa Mah. Beşiktaş Cad. No:12",       phone:"0212 555 01 01", rating:4.9, reviews:218, distance:"0.8 km", hours:"09:00–19:00", tags:["Toy Poodle uzmanı","Online randevu"] },
  { id:"v2",  name:"PetCare Veteriner Kliniği",  type:"veteriner", city:"istanbul", district:"Kadıköy",   address:"Moda Cad. No:47 Kadıköy",                   phone:"0216 444 02 02", rating:4.8, reviews:312, distance:"1.2 km", hours:"08:00–20:00", tags:["24 saat acil","Ultrason"] },
  { id:"v3",  name:"Fluffy Paws Pet Shop",       type:"petshop",   city:"istanbul", district:"Şişli",     address:"Halaskargazi Cad. No:98 Şişli",              phone:"0212 333 03 03", rating:4.7, reviews:145, distance:"1.5 km", hours:"10:00–21:00", tags:["Royal Canin bayi","Taze mama"] },
  { id:"v4",  name:"Poodle Akademi Eğitim",      type:"egitim",    city:"istanbul", district:"Ataşehir",  address:"Küçükbakkalköy Mah. Bostancı Yolu No:5",     phone:"0216 777 04 04", rating:4.9, reviews:89,  distance:"3.2 km", hours:"09:00–18:00", tags:["Bireysel eğitim","Temel-ileri"] },
  { id:"v5",  name:"Nişantaşı Pet Kuaför",       type:"kuafor",    city:"istanbul", district:"Nişantaşı", address:"Teşvikiye Cad. No:60 Nişantaşı",            phone:"0212 888 05 05", rating:4.6, reviews:173, distance:"2.1 km", hours:"10:00–19:00", tags:["SPA bakım","Bandana"] },
  { id:"v6",  name:"Veteriner Dr. Ayşe Kaya",    type:"veteriner", city:"ankara",   district:"Çankaya",   address:"Tunalı Hilmi Cad. No:34 Çankaya",            phone:"0312 222 06 06", rating:4.8, reviews:267, distance:"0.6 km", hours:"09:00–18:00", tags:["Köpek uzmanı","Aşı"] },
  { id:"v7",  name:"Başkent Poodle Bakım",       type:"kuafor",    city:"ankara",   district:"Keçiören",  address:"Atatürk Bulvarı No:120 Keçiören",            phone:"0312 444 07 07", rating:4.5, reviews:92,  distance:"4.1 km", hours:"09:00–19:00", tags:["Toy Poodle","Renklendirme"] },
  { id:"v8",  name:"İzmir PetLife Kliniği",      type:"veteriner", city:"izmir",    district:"Konak",     address:"Cumhuriyet Bul. No:78 Konak",                phone:"0232 555 08 08", rating:4.7, reviews:184, distance:"1.0 km", hours:"08:30–19:30", tags:["Ortopedi","Diş temizliği"] },
  { id:"v9",  name:"Karadeniz Pet Shop",          type:"petshop",   city:"samsun",   district:"Atakum",    address:"Atatürk Bulvarı No:42 Atakum",              phone:"0362 444 09 09", rating:4.8, reviews:156, distance:"—",       hours:"09:00–21:00", tags:["YourPoodle ortağı","Ücretsiz kargo"] },
  { id:"v10", name:"Poodle Karadeniz Kuaför",    type:"kuafor",    city:"samsun",   district:"İlkadım",   address:"19 Mayıs Cad. No:22 İlkadım",               phone:"0362 555 10 10", rating:4.7, reviews:78,  distance:"—",       hours:"10:00–19:00", tags:["Toy Poodle uzmanı"] },
  { id:"v11", name:"Antalya VetKlinik",          type:"veteriner", city:"antalya",  district:"Muratpaşa", address:"Atatürk Cad. No:55 Muratpaşa",              phone:"0242 333 11 11", rating:4.6, reviews:203, distance:"1.8 km", hours:"09:00–18:00", tags:["Tatil sezonu","İngilizce konuşuluyor"] },
  { id:"v12", name:"Bursa Köpek Akademisi",      type:"egitim",    city:"bursa",    district:"Nilüfer",   address:"Özlüce Mah. İnönü Cad. No:14",             phone:"0224 666 12 12", rating:4.9, reviews:61,  distance:"5.0 km", hours:"09:00–17:00", tags:["Davranış terapisi","Yavru eğitimi"] },
];

const SERVICE_TYPES: { value: ServiceType; label: string; emoji: string }[] = [
  { value:"hepsi",     label:"Hepsi",      emoji:"🏪" },
  { value:"kuafor",    label:"Kuaför",     emoji:"✂️" },
  { value:"veteriner", label:"Veteriner",  emoji:"🩺" },
  { value:"petshop",   label:"Pet Shop",   emoji:"🛍️" },
  { value:"egitim",    label:"Eğitim",     emoji:"🎓" },
];

const CITIES: { value: City; label: string }[] = [
  { value:"hepsi",   label:"Tüm Şehirler" },
  { value:"istanbul",label:"İstanbul" },
  { value:"ankara",  label:"Ankara" },
  { value:"izmir",   label:"İzmir" },
  { value:"bursa",   label:"Bursa" },
  { value:"antalya", label:"Antalya" },
  { value:"samsun",  label:"Samsun" },
];

const P = "#7022C4";

function StarRow({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={12}
          fill={s <= Math.round(rating) ? "#FBBF24" : "none"}
          color={s <= Math.round(rating) ? "#FBBF24" : "#E5E7EB"}
          strokeWidth={1.5} />
      ))}
      <span style={{ fontSize:12, color:"#6B7280", marginLeft:2 }}>{rating} ({reviews} değerlendirme)</span>
    </div>
  );
}

export default function YPHizmetlerPage() {
  const [type, setType] = useState<ServiceType>("hepsi");
  const [city, setCity] = useState<City>("hepsi");

  const filtered = VENUES.filter(v =>
    (type === "hepsi" || v.type === type) &&
    (city === "hepsi" || v.city === city)
  );

  const typeInfo = { kuafor:"Kuaför", veteriner:"Veteriner", petshop:"Pet Shop", egitim:"Eğitim", hepsi:"" };

  const openMaps = (v: Venue) => {
    const q = encodeURIComponent(`${v.name} ${v.district}`);
    window.open(`https://www.google.com/maps/search/${q}`, "_blank");
  };

  return (
    <YPLayout activeLink={`${BASE}/hizmetler`}>
      <div style={{ padding:"24px 0 48px" }}>

        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#1F2937", margin:"0 0 6px" }}>
            📍 Yakındaki Hizmetler
          </h1>
          <p style={{ fontSize:14, color:"#6B7280", margin:0 }}>
            Poodle'ınız için kuaför, veteriner, pet shop ve eğitim merkezleri
          </p>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20 }}>
          {/* Service type */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {SERVICE_TYPES.map(t => (
              <button key={t.value} onClick={() => setType(t.value)}
                style={{
                  padding:"7px 16px", borderRadius:999, border:"1.5px solid",
                  borderColor: type === t.value ? P : "#E5E7EB",
                  background: type === t.value ? P : "#fff",
                  color: type === t.value ? "#fff" : "#374151",
                  fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                  transition:"all 0.15s",
                }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          {/* City */}
          <select value={city} onChange={e => setCity(e.target.value as City)}
            style={{ padding:"7px 16px", borderRadius:999, border:"1.5px solid #E5E7EB",
                     background:"#fff", fontSize:13, fontWeight:600, color:"#374151",
                     cursor:"pointer", fontFamily:"inherit", outline:"none" }}>
            {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Results count */}
        <p style={{ fontSize:13, color:"#9CA3AF", marginBottom:16 }}>
          {filtered.length} hizmet bulundu
        </p>

        {/* Venue cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:16, fontWeight:700, color:"#374151", marginBottom:6 }}>Sonuç bulunamadı</div>
            <div style={{ fontSize:13, color:"#9CA3AF" }}>Farklı şehir veya hizmet türü deneyin</div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:14 }}>
            {filtered.map(v => (
              <div key={v.id} style={{
                background:"#fff", borderRadius:16, border:"1px solid #F3F4F6",
                boxShadow:"0 2px 8px rgba(0,0,0,0.06)", padding:"18px 20px",
                display:"flex", alignItems:"flex-start", gap:16,
              }}>
                {/* Icon */}
                <div style={{
                  width:52, height:52, borderRadius:14, flexShrink:0,
                  background: v.type==="kuafor" ? "#F3E8FF" : v.type==="veteriner" ? "#D1FAE5" : v.type==="petshop" ? "#DBEAFE" : "#FEF3C7",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
                }}>
                  {v.type==="kuafor" ? "✂️" : v.type==="veteriner" ? "🩺" : v.type==="petshop" ? "🛍️" : "🎓"}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontSize:15, fontWeight:800, color:"#111827" }}>{v.name}</span>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:999,
                                   background:"#F5F0FF", color:P }}>
                      {typeInfo[v.type]}
                    </span>
                  </div>
                  <StarRow rating={v.rating} reviews={v.reviews} />
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                    <MapPin size={13} color="#9CA3AF" />
                    <span style={{ fontSize:13, color:"#6B7280" }}>{v.address} • {v.district}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:6, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <Navigation size={12} color="#9CA3AF" />
                      <span style={{ fontSize:12, color:"#9CA3AF" }}>{v.distance}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <Clock size={12} color="#9CA3AF" />
                      <span style={{ fontSize:12, color:"#9CA3AF" }}>{v.hours}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                    {v.tags.map(tag => (
                      <span key={tag} style={{ fontSize:11, padding:"2px 10px", borderRadius:999,
                                               background:"#F9FAFB", border:"1px solid #E5E7EB", color:"#6B7280" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0, alignItems:"flex-end" }}>
                  <button onClick={() => openMaps(v)}
                    style={{ display:"flex", alignItems:"center", gap:6, background:P, color:"#fff",
                             border:"none", borderRadius:10, padding:"8px 16px", fontSize:13,
                             fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                             whiteSpace:"nowrap" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#5A32A3")}
                    onMouseLeave={e => (e.currentTarget.style.background = P)}>
                    <Navigation size={14} />
                    Yol Tarifi
                  </button>
                  <a href={`tel:${v.phone.replace(/\s/g, "")}`}
                    style={{ display:"flex", alignItems:"center", gap:6, background:"#fff", color:"#374151",
                             border:"1.5px solid #E5E7EB", borderRadius:10, padding:"7px 14px",
                             fontSize:13, fontWeight:600, textDecoration:"none",
                             whiteSpace:"nowrap" }}>
                    <Phone size={13} />
                    {v.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </YPLayout>
  );
}
