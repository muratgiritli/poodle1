/**
 * YourPoodle — kategoriye göre ürün özellik şemaları.
 * Admin form + PDP aynı kaynağı kullanır.
 */

export type AttrFieldType = "select" | "multiselect" | "text" | "number" | "boolean";

export type AttrOption = { value: string; label: string };

export type AttrField = {
  key: string;
  label: string;
  type: AttrFieldType;
  options?: AttrOption[];
  placeholder?: string;
  /** Mama Bul / filtre ile ortak anahtarlar için ipucu */
  hint?: string;
};

export type CategoryAttrSchema = {
  group: string;
  label: string;
  showSkt: boolean;
  showMamaType: boolean;
  showMamaBulCta: boolean;
  showIngredients: boolean;
  showNutrition: boolean;
  /** PDP breadcrumb hedefi */
  listPath: string;
  listLabel: string;
  fields: AttrField[];
};

const YES_NO: AttrOption[] = [
  { value: "yes", label: "Evet" },
  { value: "no", label: "Hayır" },
];

const SIZE_OPTS: AttrOption[] = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

const COLOR_OPTS: AttrOption[] = [
  { value: "siyah", label: "Siyah" },
  { value: "gri", label: "Gri" },
  { value: "bej", label: "Bej" },
  { value: "kahve", label: "Kahverengi" },
  { value: "pembe", label: "Pembe" },
  { value: "mavi", label: "Mavi" },
  { value: "kirmizi", label: "Kırmızı" },
  { value: "yesil", label: "Yeşil" },
  { value: "coklu", label: "Çok renkli" },
];

const BREED_SIZE_OPTS: AttrOption[] = [
  { value: "micro", label: "Micro (1–2 kg)" },
  { value: "toy", label: "Toy (2–4 kg)" },
  { value: "mini", label: "Minyatür (4–9 kg)" },
  { value: "standard", label: "Standart (9+ kg)" },
];

const FOOD_SUBS = new Set([
  "kopek-kuru-mama", "mama-markalari", "acik-mama", "yas-mama", "uygun-cuval",
]);

const SKT_SUBS = new Set([
  ...FOOD_SUBS,
  "bakim-saglik", "sampuan-banyo", "agiz-dis-bakim", "sut-tozu-biberon",
  "bit-pire-parazit", "goz-kulak-bakim", "odul-kemik", "cigneti-kemik",
]);

const FOOD_SCHEMA: CategoryAttrSchema = {
  group: "food",
  label: "Mama Özellikleri",
  showSkt: true,
  showMamaType: true,
  showMamaBulCta: true,
  showIngredients: true,
  showNutrition: true,
  listPath: "/kuru-mama",
  listLabel: "Kuru Mama",
  fields: [
    { key: "age", label: "Yaş grubu", type: "select", options: [
      { value: "puppy", label: "Yavru (0–12 ay)" },
      { value: "adult", label: "Yetişkin (1–7 yaş)" },
      { value: "senior", label: "Yaşlı (7+ yaş)" },
    ]},
    { key: "weight", label: "Hedef kilo / boyut", type: "select", options: BREED_SIZE_OPTS },
    { key: "breedSize", label: "Irk boyutu", type: "select", options: BREED_SIZE_OPTS },
    { key: "proteinType", label: "Ana protein", type: "select", options: [
      { value: "chicken", label: "Tavuk" },
      { value: "lamb", label: "Kuzu" },
      { value: "salmon", label: "Somon" },
      { value: "rabbit", label: "Tavşan" },
      { value: "beef", label: "Sığır" },
      { value: "duck", label: "Ördek" },
      { value: "turkey", label: "Hindi" },
      { value: "mixed", label: "Karma" },
    ]},
    { key: "grainFree", label: "Tahıl", type: "select", options: [
      { value: "true", label: "Tahılsız" },
      { value: "false", label: "Tahıllı" },
    ]},
    { key: "allergy", label: "Alerji profili", type: "select", options: [
      { value: "none", label: "Yok" },
      { value: "chicken", label: "Tavuk" },
      { value: "grain", label: "Tahıl" },
      { value: "fish", label: "Balık" },
      { value: "other", label: "Diğer" },
    ]},
    { key: "digestion", label: "Sindirim", type: "select", options: [
      { value: "none", label: "Normal" },
      { value: "sensitive", label: "Hassas" },
      { value: "very_sensitive", label: "Çok hassas" },
    ]},
    { key: "coat", label: "Tüy & deri", type: "select", options: [
      { value: "none", label: "İyi" },
      { value: "dull", label: "Mat" },
      { value: "scratch", label: "Kaşıntı" },
      { value: "shedding", label: "Dökülme" },
    ]},
    { key: "budgetTier", label: "Bütçe", type: "select", options: [
      { value: "economy", label: "Ekonomik" },
      { value: "mid", label: "Orta" },
      { value: "premium", label: "Premium" },
    ]},
    { key: "package", label: "Paket boyutu", type: "select", options: [
      { value: "small", label: "1–2 kg" },
      { value: "medium", label: "3–5 kg" },
      { value: "large", label: "7–12 kg" },
      { value: "xlarge", label: "15+ kg" },
    ]},
    { key: "ingredients", label: "İçindekiler", type: "text", placeholder: "Tavuk eti, pirinç, ..." },
    { key: "dailyPortionGuide", label: "Günlük porsiyon", type: "text", placeholder: "2 kg: 50 g/gün · ..." },
    { key: "benefit1", label: "Fayda 1 (başlık)", type: "text", placeholder: "Irklara özel beslenme" },
    { key: "benefit1Desc", label: "Fayda 1 (açıklama)", type: "text", placeholder: "Toy Poodle formülü" },
    { key: "benefit2", label: "Fayda 2 (başlık)", type: "text", placeholder: "Özel mama taneleri" },
    { key: "benefit2Desc", label: "Fayda 2 (açıklama)", type: "text" },
    { key: "benefit3", label: "Fayda 3 (başlık)", type: "text", placeholder: "Tüy sağlığı" },
    { key: "benefit3Desc", label: "Fayda 3 (açıklama)", type: "text" },
  ],
};

const CARRIER_SCHEMA: CategoryAttrSchema = {
  group: "carrier",
  label: "Taşıma / Kulübe Özellikleri",
  showSkt: false,
  showMamaType: false,
  showMamaBulCta: false,
  showIngredients: false,
  showNutrition: false,
  listPath: "/kategori/tasima-cantalari",
  listLabel: "Taşıma",
  fields: [
    { key: "productKind", label: "Ürün tipi", type: "select", options: [
      { value: "soft-carrier", label: "Yumuşak taşıma çantası" },
      { value: "hard-carrier", label: "Sert taşıma kabini" },
      { value: "wheeled", label: "Tekerlekli taşıma" },
      { value: "backpack", label: "Sırt çantası" },
      { value: "stroller", label: "Köpek arabası" },
      { value: "kennel", label: "Kulübe" },
      { value: "crate", label: "Kafes / crate" },
    ]},
    { key: "maxWeightKg", label: "Maks. kilo (kg)", type: "select", options: [
      { value: "3", label: "3 kg'a kadar" },
      { value: "5", label: "5 kg'a kadar" },
      { value: "8", label: "8 kg'a kadar" },
      { value: "10", label: "10 kg'a kadar" },
      { value: "15", label: "15 kg'a kadar" },
      { value: "20", label: "20 kg'a kadar" },
      { value: "30", label: "30+ kg" },
    ]},
    { key: "suitableSize", label: "Uygun köpek boyutu", type: "select", options: BREED_SIZE_OPTS },
    { key: "material", label: "Malzeme", type: "select", options: [
      { value: "oxford", label: "Oxford kumaş" },
      { value: "polyester", label: "Polyester" },
      { value: "nylon", label: "Naylon" },
      { value: "plastic", label: "Plastik" },
      { value: "abs", label: "ABS plastik" },
      { value: "metal", label: "Metal / tel" },
      { value: "wood", label: "Ahşap" },
      { value: "mixed", label: "Karma" },
    ]},
    { key: "wheels", label: "Tekerlek", type: "select", options: YES_NO },
    { key: "telescopicHandle", label: "Çekilebilir sap", type: "select", options: YES_NO },
    { key: "airlineApproved", label: "Uçak kabini uygun", type: "select", options: YES_NO },
    { key: "ventilation", label: "Havalandırma", type: "select", options: [
      { value: "full", label: "Tam çevresel" },
      { value: "mesh", label: "File / mesh" },
      { value: "side", label: "Yan paneller" },
      { value: "top", label: "Üst açıklık" },
      { value: "limited", label: "Sınırlı" },
    ]},
    { key: "washable", label: "Yıkanabilir", type: "select", options: [
      { value: "machine", label: "Makinede yıkanır" },
      { value: "hand", label: "Elde yıkanır" },
      { value: "wipe", label: "Silinebilir" },
      { value: "no", label: "Yıkanmaz" },
    ]},
    { key: "size", label: "Beden / boyut", type: "select", options: SIZE_OPTS },
    { key: "dimensions", label: "Ölçüler (ExBxY)", type: "text", placeholder: "45 × 30 × 35 cm" },
    { key: "color", label: "Renk", type: "select", options: COLOR_OPTS },
    { key: "safety", label: "Güvenlik", type: "multiselect", options: [
      { value: "leash-clip", label: "Tasma kancası" },
      { value: "lock", label: "Kilitli fermuar" },
      { value: "pad", label: "Yastıklı taban" },
      { value: "rain-cover", label: "Yağmur kılıfı" },
      { value: "reflector", label: "Reflektör" },
    ]},
    { key: "benefit1", label: "Fayda 1", type: "text", placeholder: "Tekerlekli kolay taşıma" },
    { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text", placeholder: "File havalandırma" },
    { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text", placeholder: "Yıkanabilir ped" },
    { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const TOY_SCHEMA: CategoryAttrSchema = {
  group: "toy",
  label: "Oyuncak Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/kategori/oyuncak", listLabel: "Oyuncak",
  fields: [
    { key: "toyType", label: "Oyuncak tipi", type: "select", options: [
      { value: "ball", label: "Top" }, { value: "chew", label: "Çiğneme" }, { value: "plush", label: "Peluş" },
      { value: "rope", label: "İp" }, { value: "interactive", label: "Etkileşimli / IQ" }, { value: "squeaky", label: "Ötümlü" },
      { value: "fetch", label: "Getirme" }, { value: "dental", label: "Diş sağlığı" },
    ]},
    { key: "material", label: "Malzeme", type: "select", options: [
      { value: "rubber", label: "Kauçuk" }, { value: "silicone", label: "Silikon" }, { value: "plush", label: "Peluş" },
      { value: "rope", label: "İp" }, { value: "plastic", label: "Plastik" }, { value: "wood", label: "Ahşap" },
    ]},
    { key: "suitableSize", label: "Uygun boyut", type: "select", options: BREED_SIZE_OPTS },
    { key: "durable", label: "Dayanıklılık", type: "select", options: [
      { value: "soft", label: "Yumuşak" }, { value: "medium", label: "Orta" }, { value: "heavy", label: "Ağır çiğneyici" },
    ]},
    { key: "sound", label: "Ses", type: "select", options: [
      { value: "none", label: "Sessiz" }, { value: "squeak", label: "Ötümlü" }, { value: "crinkle", label: "Hışırtılı" },
    ]},
    { key: "color", label: "Renk", type: "select", options: COLOR_OPTS },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const COLLAR_SCHEMA: CategoryAttrSchema = {
  group: "collar",
  label: "Tasma / Bel Tasması Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/kategori/tasma", listLabel: "Tasma",
  fields: [
    { key: "collarType", label: "Tip", type: "select", options: [
      { value: "collar", label: "Boyun tasması" }, { value: "harness", label: "Göğüs tasması" },
      { value: "leash", label: "Gezdirme ipi" }, { value: "retractable", label: "Otomatik tasma" },
      { value: "set", label: "Set (tasma+ip)" },
    ]},
    { key: "material", label: "Malzeme", type: "select", options: [
      { value: "nylon", label: "Naylon" }, { value: "leather", label: "Deri" }, { value: "mesh", label: "Mesh" },
      { value: "rope", label: "İp" }, { value: "metal", label: "Metal zincir" },
    ]},
    { key: "size", label: "Beden", type: "select", options: SIZE_OPTS },
    { key: "suitableSize", label: "Uygun köpek", type: "select", options: BREED_SIZE_OPTS },
    { key: "adjustable", label: "Ayarlanabilir", type: "select", options: YES_NO },
    { key: "reflective", label: "Reflektörlü", type: "select", options: YES_NO },
    { key: "color", label: "Renk", type: "select", options: COLOR_OPTS },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const BOWL_SCHEMA: CategoryAttrSchema = {
  group: "bowl",
  label: "Mama / Su Kabı Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/kategori/mama-kabi", listLabel: "Kaplar",
  fields: [
    { key: "bowlType", label: "Tip", type: "select", options: [
      { value: "food", label: "Mama kabı" }, { value: "water", label: "Su kabı" },
      { value: "set", label: "Mama+su set" }, { value: "slow", label: "Yavaş yedirme" },
      { value: "elevated", label: "Yükseltilmiş" }, { value: "travel", label: "Seyahat" },
      { value: "fountain", label: "Su çeşmesi" },
    ]},
    { key: "material", label: "Malzeme", type: "select", options: [
      { value: "steel", label: "Çelik" }, { value: "ceramic", label: "Seramik" },
      { value: "plastic", label: "Plastik" }, { value: "silicone", label: "Silikon" },
      { value: "melamine", label: "Melamin" },
    ]},
    { key: "capacityMl", label: "Kapasite", type: "select", options: [
      { value: "200", label: "200 ml" }, { value: "350", label: "350 ml" }, { value: "500", label: "500 ml" },
      { value: "750", label: "750 ml" }, { value: "1000", label: "1 L" }, { value: "2000", label: "2 L+" },
    ]},
    { key: "suitableSize", label: "Uygun boyut", type: "select", options: BREED_SIZE_OPTS },
    { key: "dishwasher", label: "Bulaşık makinesi", type: "select", options: YES_NO },
    { key: "nonSlip", label: "Kaymaz taban", type: "select", options: YES_NO },
    { key: "color", label: "Renk", type: "select", options: COLOR_OPTS },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const CARE_SCHEMA: CategoryAttrSchema = {
  group: "care",
  label: "Bakım / Sağlık Özellikleri",
  showSkt: true, showMamaType: false, showMamaBulCta: false, showIngredients: true, showNutrition: false,
  listPath: "/kategori/bakim", listLabel: "Bakım",
  fields: [
    { key: "careType", label: "Ürün tipi", type: "select", options: [
      { value: "shampoo", label: "Şampuan" }, { value: "conditioner", label: "Krem / balsam" },
      { value: "spray", label: "Sprey" }, { value: "wipe", label: "Islak mendil" },
      { value: "ear", label: "Kulak bakımı" }, { value: "eye", label: "Göz bakımı" },
      { value: "dental", label: "Diş bakımı" }, { value: "parasite", label: "Parazit" },
      { value: "supplement", label: "Takviye" }, { value: "other", label: "Diğer" },
    ]},
    { key: "coatType", label: "Tüy tipi", type: "select", options: [
      { value: "all", label: "Tüm tüyler" }, { value: "curly", label: "Kıvırcık (Poodle)" },
      { value: "long", label: "Uzun" }, { value: "short", label: "Kısa" }, { value: "sensitive", label: "Hassas cilt" },
    ]},
    { key: "scent", label: "Koku", type: "select", options: [
      { value: "unscented", label: "Kokusu" }, { value: "mild", label: "Hafif" },
      { value: "floral", label: "Çiçeksi" }, { value: "fresh", label: "Ferah" },
    ]},
    { key: "volumeMl", label: "Hacim", type: "select", options: [
      { value: "50", label: "50 ml" }, { value: "100", label: "100 ml" }, { value: "250", label: "250 ml" },
      { value: "500", label: "500 ml" }, { value: "1000", label: "1 L" },
    ]},
    { key: "ingredients", label: "İçerik / etken", type: "text", placeholder: "Aloe vera, yulaf..." },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const TOILET_SCHEMA: CategoryAttrSchema = {
  group: "toilet",
  label: "Tuvalet Malzemeleri Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/kategori/tuvalet", listLabel: "Tuvalet",
  fields: [
    { key: "toiletType", label: "Tip", type: "select", options: [
      { value: "pad", label: "Çiş pedi" }, { value: "washable-pad", label: "Yıkanabilir ped" },
      { value: "tray", label: "Tuvalet tepsisi" }, { value: "bag", label: "Kaka poşeti" },
      { value: "spray", label: "Eğitim spreyi" }, { value: "diaper", label: "Köpek bezi" },
    ]},
    { key: "packCount", label: "Paket adedi", type: "select", options: [
      { value: "10", label: "10'lu" }, { value: "20", label: "20'li" }, { value: "30", label: "30'lu" },
      { value: "50", label: "50'li" }, { value: "100", label: "100'lü" },
    ]},
    { key: "dimensions", label: "Ölçü", type: "text", placeholder: "60×90 cm" },
    { key: "scented", label: "Kokulu", type: "select", options: YES_NO },
    { key: "absorbency", label: "Emicilik", type: "select", options: [
      { value: "standard", label: "Standart" }, { value: "high", label: "Yüksek" }, { value: "premium", label: "Premium" },
    ]},
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const GROOM_SCHEMA: CategoryAttrSchema = {
  group: "grooming",
  label: "Tıraş / Tüy Ekipmanı Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/kategori/tiras", listLabel: "Tıraş",
  fields: [
    { key: "toolType", label: "Ekipman", type: "select", options: [
      { value: "clipper", label: "Tıraş makinesi" }, { value: "scissors", label: "Makas" },
      { value: "comb", label: "Tarak" }, { value: "brush", label: "Fırça" },
      { value: "nail", label: "Tırnak makası" }, { value: "deshedder", label: "Tüy toplayıcı" },
      { value: "dryer", label: "Kurutma" },
    ]},
    { key: "power", label: "Güç", type: "select", options: [
      { value: "manual", label: "Manuel" }, { value: "battery", label: "Pilli" },
      { value: "rechargeable", label: "Şarjlı" }, { value: "corded", label: "Kablolu" },
    ]},
    { key: "suitableSize", label: "Uygun boyut", type: "select", options: BREED_SIZE_OPTS },
    { key: "noise", label: "Ses seviyesi", type: "select", options: [
      { value: "quiet", label: "Sessiz" }, { value: "normal", label: "Normal" }, { value: "loud", label: "Yüksek" },
    ]},
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const TREAT_SCHEMA: CategoryAttrSchema = {
  group: "treat",
  label: "Ödül / Çiğneme Özellikleri",
  showSkt: true, showMamaType: false, showMamaBulCta: false, showIngredients: true, showNutrition: false,
  listPath: "/kategori/odul", listLabel: "Ödüller",
  fields: [
    { key: "treatType", label: "Tip", type: "select", options: [
      { value: "soft", label: "Yumuşak ödül" }, { value: "biscuit", label: "Bisküvi" },
      { value: "jerky", label: "Kurutulmuş et" }, { value: "dental", label: "Diş çubuğu" },
      { value: "bone", label: "Kemik" }, { value: "chew", label: "Çiğneme" },
    ]},
    { key: "proteinType", label: "Protein", type: "select", options: [
      { value: "chicken", label: "Tavuk" }, { value: "beef", label: "Sığır" },
      { value: "lamb", label: "Kuzu" }, { value: "salmon", label: "Somon" }, { value: "mixed", label: "Karma" },
    ]},
    { key: "grainFree", label: "Tahıl", type: "select", options: [
      { value: "true", label: "Tahılsız" }, { value: "false", label: "Tahıllı" },
    ]},
    { key: "suitableSize", label: "Uygun boyut", type: "select", options: BREED_SIZE_OPTS },
    { key: "packWeight", label: "Paket", type: "text", placeholder: "200 g" },
    { key: "ingredients", label: "İçindekiler", type: "text" },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const ACCESSORY_SCHEMA: CategoryAttrSchema = {
  group: "accessory",
  label: "Aksesuar Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/kategori/aksesuar", listLabel: "Aksesuar",
  fields: [
    { key: "accessoryType", label: "Tip", type: "select", options: [
      { value: "clothing", label: "Giysi" }, { value: "bed", label: "Yatak" },
      { value: "blanket", label: "Battaniye" }, { value: "bow", label: "Fiyonk / süs" },
      { value: "id-tag", label: "Künye" }, { value: "other", label: "Diğer" },
    ]},
    { key: "size", label: "Beden", type: "select", options: SIZE_OPTS },
    { key: "suitableSize", label: "Uygun köpek", type: "select", options: BREED_SIZE_OPTS },
    { key: "material", label: "Malzeme", type: "select", options: [
      { value: "cotton", label: "Pamuk" }, { value: "polyester", label: "Polyester" },
      { value: "fleece", label: "Polar" }, { value: "leather", label: "Deri" }, { value: "mixed", label: "Karma" },
    ]},
    { key: "color", label: "Renk", type: "select", options: COLOR_OPTS },
    { key: "washable", label: "Yıkanabilir", type: "select", options: YES_NO },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const GENERAL_SCHEMA: CategoryAttrSchema = {
  group: "general",
  label: "Ürün Özellikleri",
  showSkt: false, showMamaType: false, showMamaBulCta: false, showIngredients: false, showNutrition: false,
  listPath: "/magaza", listLabel: "Mağaza",
  fields: [
    { key: "suitableSize", label: "Uygun boyut", type: "select", options: BREED_SIZE_OPTS },
    { key: "color", label: "Renk", type: "select", options: COLOR_OPTS },
    { key: "material", label: "Malzeme", type: "text", placeholder: "Örn: polyester" },
    { key: "dimensions", label: "Ölçüler", type: "text", placeholder: "Örn: 30×20×15 cm" },
    { key: "benefit1", label: "Fayda 1", type: "text" }, { key: "benefit1Desc", label: "Fayda 1 açıklama", type: "text" },
    { key: "benefit2", label: "Fayda 2", type: "text" }, { key: "benefit2Desc", label: "Fayda 2 açıklama", type: "text" },
    { key: "benefit3", label: "Fayda 3", type: "text" }, { key: "benefit3Desc", label: "Fayda 3 açıklama", type: "text" },
  ],
};

const BY_SUBCAT: Record<string, CategoryAttrSchema> = {
  "kopek-kuru-mama": { ...FOOD_SCHEMA, listPath: "/kuru-mama", listLabel: "Kuru Mama" },
  "mama-markalari": { ...FOOD_SCHEMA, listPath: "/kuru-mama", listLabel: "Mama" },
  "acik-mama": { ...FOOD_SCHEMA, listPath: "/kuru-mama", listLabel: "Açık Mama" },
  "yas-mama": { ...FOOD_SCHEMA, listPath: "/kategori/yas-mama", listLabel: "Yaş Mama", showSkt: true },
  "uygun-cuval": { ...FOOD_SCHEMA, listPath: "/kuru-mama", listLabel: "Çuval Mama" },
  "tasima-kulube": CARRIER_SCHEMA,
  "oyuncak": TOY_SCHEMA,
  "bel-boyun-tasma": COLLAR_SCHEMA,
  "mama-su-kabi": BOWL_SCHEMA,
  "bakim-saglik": CARE_SCHEMA,
  "sampuan-banyo": { ...CARE_SCHEMA, listPath: "/kategori/sampuan", listLabel: "Şampuan" },
  "agiz-dis-bakim": { ...CARE_SCHEMA, listPath: "/kategori/dis", listLabel: "Diş Bakım" },
  "goz-kulak-bakim": { ...CARE_SCHEMA, listPath: "/kategori/goz-kulak", listLabel: "Göz & Kulak" },
  "bit-pire-parazit": { ...CARE_SCHEMA, listPath: "/kategori/parazit", listLabel: "Parazit", showSkt: true },
  "sut-tozu-biberon": { ...CARE_SCHEMA, listPath: "/kategori/sut", listLabel: "Süt Tozu", showSkt: true },
  "tuvalet-malzemeleri": TOILET_SCHEMA,
  "tras-ekipmanlari": GROOM_SCHEMA,
  "tirnak-makasi": { ...GROOM_SCHEMA, listPath: "/kategori/tirnak", listLabel: "Tırnak" },
  "tuy-toplayici": { ...GROOM_SCHEMA, listPath: "/kategori/tuy", listLabel: "Tüy Toplayıcı" },
  "odul-kemik": TREAT_SCHEMA,
  "cigneti-kemik": TREAT_SCHEMA,
  "kopek-aksesuari": ACCESSORY_SCHEMA,
};

export function getCategorySchema(subcategory?: string | null): CategoryAttrSchema {
  if (!subcategory) return GENERAL_SCHEMA;
  return BY_SUBCAT[subcategory] || GENERAL_SCHEMA;
}

export function isFoodSubcategory(subcategory?: string | null): boolean {
  return !!subcategory && FOOD_SUBS.has(subcategory);
}

export function categoryShowsSkt(subcategory?: string | null): boolean {
  if (!subcategory) return false;
  return SKT_SUBS.has(subcategory) || getCategorySchema(subcategory).showSkt;
}

/** Form state: string values; multiselect = comma-joined */
export function attrsFromMetadata(meta: Record<string, any> | null | undefined, schema: CategoryAttrSchema): Record<string, string> {
  const out: Record<string, string> = {};
  if (!meta) return out;
  for (const f of schema.fields) {
    const v = meta[f.key];
    if (v === undefined || v === null) continue;
    if (f.key === "grainFree" || typeof v === "boolean") {
      out[f.key] = v === true || v === "true" ? "true" : v === false || v === "false" ? "false" : String(v);
    } else if (Array.isArray(v)) {
      out[f.key] = v.join(",");
    } else {
      out[f.key] = String(v);
    }
  }
  // benefits convenience
  if (Array.isArray(meta.benefits)) {
    meta.benefits.forEach((b: any, i: number) => {
      if (b?.title) out[`benefit${i + 1}`] = String(b.title);
      if (b?.desc) out[`benefit${i + 1}Desc`] = String(b.desc);
    });
  }
  return out;
}

export function metadataFromAttrs(
  attrs: Record<string, string>,
  schema: CategoryAttrSchema,
  extra?: Record<string, any>
): Record<string, any> | null {
  const meta: Record<string, any> = { ...(extra || {}) };
  const benefits: { title: string; desc?: string }[] = [];

  for (const f of schema.fields) {
    const raw = (attrs[f.key] || "").trim();
    if (!raw || raw === "__none__") continue;

    if (f.key.startsWith("benefit") && f.key.endsWith("Desc")) continue;
    if (/^benefit\d+$/.test(f.key)) {
      const idx = Number(f.key.replace("benefit", "")) - 1;
      const desc = (attrs[`${f.key}Desc`] || "").trim();
      benefits[idx] = { title: raw, ...(desc ? { desc } : {}) };
      continue;
    }

    if (f.type === "multiselect") {
      meta[f.key] = raw.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (f.key === "grainFree") {
      meta.grainFree = raw === "true";
    } else if (f.type === "boolean") {
      meta[f.key] = raw === "yes" || raw === "true";
    } else {
      meta[f.key] = raw;
    }
  }

  const cleanBenefits = benefits.filter(Boolean);
  if (cleanBenefits.length) meta.benefits = cleanBenefits;

  return Object.keys(meta).length > 0 ? meta : null;
}

export function formatAttrDisplayValue(field: AttrField, raw: unknown): string | null {
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw === "boolean") return raw ? "Evet" : "Hayır";
  if (Array.isArray(raw)) {
    return raw.map((v) => field.options?.find((o) => o.value === v)?.label || String(v)).join(", ");
  }
  const s = String(raw);
  if (field.key === "grainFree") return s === "true" || raw === true ? "Tahılsız" : "Tahıllı";
  return field.options?.find((o) => o.value === s)?.label || s;
}

export function buildAttrRows(
  meta: Record<string, any> | null | undefined,
  schema: CategoryAttrSchema
): { label: string; value: string }[] {
  if (!meta) return [];
  const rows: { label: string; value: string }[] = [];
  for (const f of schema.fields) {
    if (f.key.startsWith("benefit")) continue;
    if (f.key === "ingredients" || f.key === "dailyPortionGuide") continue;
    const display = formatAttrDisplayValue(f, meta[f.key]);
    if (display) rows.push({ label: f.label, value: display });
  }
  return rows;
}

export function buildBenefitsFromMeta(meta: Record<string, any> | null | undefined): { title: string; desc?: string }[] {
  if (!meta) return [];
  if (Array.isArray(meta.benefits) && meta.benefits.length) {
    return meta.benefits.filter((b: any) => b?.title).slice(0, 3);
  }
  const out: { title: string; desc?: string }[] = [];
  for (let i = 1; i <= 3; i++) {
    const title = meta[`benefit${i}`];
    if (title) out.push({ title: String(title), desc: meta[`benefit${i}Desc`] ? String(meta[`benefit${i}Desc`]) : undefined });
  }
  return out;
}
