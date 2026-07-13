import { db, pool } from "./storage";
import { brandCategories, products, breedStats, crossSellSections, crossSellItems, subcategories, deliveryNeighborhoods } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import brandDataJson from "./brand_data.json";

interface BrandProductData {
  brandName: string;
  brandSlug: string;
  animal: string;
  subcategory: string;
  products: {
    name: string;
    price: number;
    originalPrice?: number;
    skt?: string;
    img?: string;
    stock?: number;
  }[];
}

const EXTRA_BRAND_DATA: BrandProductData[] = brandDataJson as BrandProductData[];

const SEED_BRAND_DATA: BrandProductData[] = [
  // Köpek verileri brand_data.json ve ayrı const'lar üzerinden gelir
  // Kedi/kemirgen/kuş/akvaryum verileri kaldırıldı
];

const ECONATURE_KOPEK: BrandProductData = {
  brandName: "Econature",
  brandSlug: "econature",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Econature Plus Kuzu Etli Yetişkin Köpek Maması 13+2 Kg", price: 981, originalPrice: 1499, skt: "08.2026", img: "https://www.mamatoptancisi.com/econature-plus-kuzu-etli-yetiskin-kopek-mamasi-13-kg-2-kg-bonus-paket-1066089-67-O.jpg", stock: 10 },
    { name: "Econature Kuzu Etli Yavru Köpek Maması 13+2 Kg", price: 1193, originalPrice: 1540, skt: "08.2026", img: "https://www.mamatoptancisi.com/econature-fish-formula-gurme-yavru-kopek-mamasi-15-kg-1073071-59-O.jpg", stock: 10 },
    { name: "Econature Plus Somonlu Yetişkin Köpek Maması 15 kg", price: 1184, originalPrice: 1671, skt: "05.2027", img: "https://www.mamatoptancisi.com/econature-somonlu-yetiskin-kopek-mamasi-15-kg-1044399-59-O.jpg", stock: 10 },
    { name: "Econature Lamb Formula Kuzu Etli Yetişkin Köpek Maması 15 kg", price: 565, originalPrice: 1650, skt: "04.2027", img: "https://www.mamatoptancisi.com/econature-lamb-formula-kuzu-etli-yetiskin-kopek-mamasi-15-kg-1077756-59-O.jpg", stock: 10 },
  ],
};

const FELICIA_KOPEK: BrandProductData = {
  brandName: "Felicia",
  brandSlug: "felicia",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Felicia Kuzu Etli Küçük Irk Yavru ve Hamile Köpek Maması 2X3 Kg", price: 1015, originalPrice: 1650, skt: "01.2027", img: "https://www.mamatoptancisi.com/felicia-kuzu-etli-kucuk-irk-yavru-ve-hamile-kopek-mamasi-6-kg-1044683-12-O.jpg", stock: 10 },
    { name: "Felicia Mini Somonlu Düşük Tahıllı Hipoalerjenik Köpek Maması 3 kg", price: 586, originalPrice: 715, skt: "02.2027", img: "https://www.mamatoptancisi.com/felicia-mini-somonlu-dusuk-tahilli-hipoalerjenik-kopek-mamasi-3-kg-1044676-12-O.jpg", stock: 10 },
    { name: "Felicia Kuzulu Pirinçli Düşük Tahıllı Hipoalerjenik Köpek Maması 15 kg", price: 2715, originalPrice: 3500, skt: "11.2027", img: "https://www.mamatoptancisi.com/felicia-kuzulu-pirincli-dusuk-tahilli-hipoalerjenik-kopek-mamasi-15-kg-1044639-10-O.jpg", stock: 10 },
    { name: "Felicia Somon Balıklı Düşük Tahıllı Hipoalerjenik Yetişkin Köpek Maması 15 kg", price: 2715, originalPrice: 3190, skt: "01.2027", img: "https://www.mamatoptancisi.com/felicia-somon-balikli-dusuk-tahilli-hipoalerjenik-yetiskin-kopek-mamasi-15-kg-1044627-98-O.jpg", stock: 10 },
    { name: "Felicia Kuzulu Küçük Irk Düşük Tahıllı Köpek Maması 6 kg (2X3 Kg)", price: 1072, originalPrice: 1750, skt: "03.2027", img: "https://www.mamatoptancisi.com/felicia-kuzulu-kucuk-irk-dusuk-tahilli-kopek-mamasi-6-kg-1056887-95-O.jpg", stock: 10 },
    { name: "Felicia Mini Somonlu Düşük Tahıllı Hipoalerjenik Köpek Maması 6 kg (3X2 Kg)", price: 1072, originalPrice: 1750, skt: "03.2027", img: "https://www.mamatoptancisi.com/felicia-mini-somonlu-dusuk-tahilli-hipoalerjenik-kopek-mamasi-6-kg-1057405-95-O.jpg", stock: 10 },
    { name: "Felicia Kuzu Etli Küçük Irk Yavru ve Hamile Köpek Maması 3 kg", price: 650, originalPrice: 825, skt: "03.2027", img: "https://www.mamatoptancisi.com/felicia-kuzu-etli-kucuk-irk-yavru-ve-hamile-kopek-mamasi-3-kg-1044623-95-O.jpg", stock: 10 },
    { name: "Felicia Kuzulu Pirinçli Yetişkin Düşük Tahıllı Hipoalerjenik Köpek Maması 3 kg", price: 591, originalPrice: 950, skt: "01.2027", img: "https://www.mamatoptancisi.com/felicia-kuzulu-pirincli-yetiskin-dusuk-tahilli-hipoalerjenik-kopek-mamasi-3-kg-1024987-95-O.jpg", stock: 10 },
    { name: "Felicia Kuzulu Küçük ve Orta Irk Düşük Tahıllı Köpek Maması 3 kg", price: 588, originalPrice: 935, skt: "03.2027", img: "https://www.mamatoptancisi.com/felicia-kuzulu-kucuk-ve-orta-irk-dusuk-tahilli-kopek-mamasi-3-kg-1070343-12-O.jpg", stock: 0 },
    { name: "Felicia Kuzulu Yavru Köpek Maması Orta ve Büyük Irk İçin 3 kg", price: 474, originalPrice: 825, skt: "09.2026", img: "https://www.mamatoptancisi.com/felicia-kuzulu-yavru-kopek-mamasi-orta-ve-buyuk-irk-icin-3-kg-1058119-95-O.jpg", stock: 0 },
    { name: "Felicia Somon Balıklı Düşük Tahıllı Hipoalerjenik Köpek Maması 3 kg", price: 469, originalPrice: 715, skt: "06.2026", img: "https://www.mamatoptancisi.com/felicia-somon-balikli-dusuk-tahilli-hipoalerjenik-kopek-mamasi-3-kg-1054620-95-O.jpg", stock: 0 },
  ],
};

const ENJOY_KOPEK: BrandProductData = {
  brandName: "Enjoy",
  brandSlug: "enjoy",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Enjoy Biftekli Yetişkin Köpek Maması 15 kg", price: 606, originalPrice: 999, skt: "02.2027", img: "https://www.mamatoptancisi.com/enjoy-biftekli-yetiskin-kopek-mamasi-15-kg-1044535-92-O.jpg", stock: 0 },
  ],
};

const LAVITAL_KOPEK: BrandProductData = {
  brandName: "LaVital",
  brandSlug: "lavital",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "LaVital Mini Puppy Kuzulu Küçük Irk Yavru Köpek Maması 6+1 Kg", price: 894.83, originalPrice: 1299, skt: "02.2027", img: "https://www.mamatoptancisi.com/lavital-mini-puppy-kuzulu-kucuk-irk-yavru-kopek-mamasi-61-kg-1068247-91-O.jpg", stock: 10 },
    { name: "LaVital Kuzu Etli Küçük Irk Yetişkin Köpek Maması 2 kg", price: 298.14, originalPrice: 408, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-kuzu-etli-kucuk-irk-yetiskin-kopek-mamasi-2-kg-1052000-60-O.jpg", stock: 10 },
    { name: "LaVital Somonlu Küçük Irk Yetişkin Köpek Maması 2 kg", price: 349.35, originalPrice: 425, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-somonlu-kucuk-irk-yetiskin-kopek-mamasi-2-kg-1073795-60-O.jpg", stock: 10 },
    { name: "LaVital Kuzu Etli Küçük Irk Yetişkin Köpek Maması 7 kg", price: 839.55, originalPrice: 1143, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-kuzu-etli-kucuk-irk-yetiskin-kopek-mamasi-7-kg-1072610-60-O.jpg", stock: 10 },
    { name: "LaVital Somonlu Küçük Irk Yetişkin Köpek Maması 7 kg", price: 923.53, originalPrice: 1210, skt: "05.2027", img: "https://www.mamatoptancisi.com/lavital-somonlu-kucuk-irk-yetiskin-kopek-mamasi-7-kg-1072613-60-O.jpg", stock: 10 },
    { name: "LaVital Kuzu Etli Orta Irk Yetişkin Köpek Maması 3 kg", price: 475.19, originalPrice: 605, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-kuzu-etli-orta-irk-yetiskin-kopek-mamasi-3-kg-1052007-60-O.jpg", stock: 10 },
    { name: "LaVital Kuzu Etli Orta Irk Yetişkin Köpek Maması 12 kg", price: 1356.64, originalPrice: 1760, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-kuzu-etli-orta-irk-yetiskin-kopek-mamasi-12-kg-1072619-60-O.jpg", stock: 10 },
    { name: "LaVital Somonlu Orta Irk Yetişkin Köpek Maması 12 kg", price: 1396.48, originalPrice: 1815, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-somonlu-orta-irk-yetiskin-kopek-mamasi-12-kg-1072622-60-O.jpg", stock: 10 },
    { name: "LaVital Kuzu Etli Büyük Irk Yetişkin Köpek Maması 15 kg", price: 1474.19, originalPrice: 1859, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-kuzu-etli-buyuk-irk-yetiskin-kopek-mamasi-15-kg-1072627-60-O.jpg", stock: 10 },
    { name: "LaVital Somonlu Büyük Irk Yetişkin Köpek Maması 15 kg", price: 1570.33, originalPrice: 2126, skt: "06.2027", img: "https://www.mamatoptancisi.com/lavital-somonlu-buyuk-irk-yetiskin-kopek-mamasi-15-kg-1072628-60-O.jpg", stock: 10 },
  ],
};

const PROCHOICE_KOPEK: BrandProductData = {
  brandName: "ProChoice",
  brandSlug: "prochoice",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Prochoice Proderma Kuzu Etli Yetişkin Köpek Maması 18 kg", price: 1965.01, originalPrice: 2200, skt: "06.2027", img: "https://www.mamatoptancisi.com/prochoice-proderma-kuzu-etli-yetiskin-kopek-mamasi-18-kg-1065597-23-O.jpg", stock: 10 },
    { name: "Prochoice Sardalyalı ve Hamsili Yetişkin Köpek Konservesi 400 gr X 6 Adet", price: 330, originalPrice: 450, skt: "09.2026", stock: 10 },
    { name: "Prochoice Sensitive Skin Hassas Balıklı Yetişkin Köpek Maması 12 kg", price: 1770.88, originalPrice: 2750, skt: "05.2026", stock: 0 },
    { name: "Prochoice Kuzu Etli Yetişkin Köpek Maması 12 kg", price: 1630.42, originalPrice: 2530, skt: "06.2026", stock: 0 },
    { name: "Prochoice Sensitive Balık Etli Yetişkin Köpek Maması 3 kg", price: 603.71, originalPrice: 999.90, skt: "02.2026", stock: 0 },
    { name: "Prochoice Fit & Healthy Kuzulu Yetişkin Köpek Maması 3 kg", price: 570.66, originalPrice: 836, skt: "02.2026", stock: 0 },
    { name: "Prochoice Kuzu Etli Yavru Köpek Maması 3 kg", price: 611.97, originalPrice: 880, skt: "02.2026", stock: 0 },
    { name: "Prochoice Kuzu Etli Yavru Köpek Maması 12 kg", price: 1812.19, originalPrice: 2805, skt: "02.2026", stock: 0 },
  ],
};

const PRONATURE_KOPEK: BrandProductData = {
  brandName: "Pronature",
  brandSlug: "pronature",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Pronature Mother & Baby Kuzu Etli Mini Irk Anne ve Bebek Köpek Maması 3 Kg", price: 505.84, originalPrice: 799, skt: "06.2026", stock: 10 },
    { name: "Pronature Mother&Baby Kuzu Etli Mini Irk Anne ve Yavru Köpek Maması 10+2 kg", price: 1473.84, originalPrice: 1760, skt: "09.2026", img: "https://www.mamatoptancisi.com/pronature-daily-puppy-kuzu-etli-ve-pirincli-yavru-kopek-mamasi-12-kg-1047397-40-O.jpg", stock: 10 },
    { name: "Pronature Kuzu Etli ve Pirinçli Orta ve Büyük Irk Yavru Köpek Maması 10+2 Kg", price: 1066.42, originalPrice: 1595, skt: "05.2027", stock: 10 },
    { name: "Pronature Kuzu Etli Pirinçli Yetişkin Köpek Maması 10+2 Kg", price: 966.20, originalPrice: 1870, skt: "04.2027", stock: 10 },
    { name: "Pronature Hypo-Allergenic Kuzu Etli Enginarlı Patatesli Tahılsız 10+2 kg", price: 1473.84, originalPrice: 2200, skt: "03.2027", stock: 10 },
    { name: "Pronature Daily Kuzu Etli Küçük Irk Yetişkin Köpek Maması 3 kg", price: 353.90, originalPrice: 483.25, skt: "11.2026", stock: 10 },
    { name: "Pronature Daily Kuzu Etli Küçük Irk Yavru Köpek Maması 3 kg", price: 374.85, originalPrice: 509.34, skt: "01.2027", stock: 10 },
    { name: "Pronature Derma Shine Somonlu Pirinçli Yetişkin 10+2 Kg", price: 1051.07, originalPrice: 1650, skt: "05.2027", stock: 0 },
  ],
};

const PROPERFORMANCE_KOPEK: BrandProductData = {
  brandName: "ProPerformance",
  brandSlug: "properformance",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Pro Performance Kuzu Etli Yavru Köpek Maması 18 kg", price: 2895.84, originalPrice: 2500, skt: "12.2026", img: "https://www.mamatoptancisi.com/pro-performance-kuzu-etli-yavru-kopek-mamasi-18-kg-1047466-60-O.jpg", stock: 10 },
    { name: "Pro Performance Premium Kuzulu ve Pirinçli Yetişkin 18 kg", price: 2537.26, originalPrice: 2999, skt: "12.2027", stock: 10 },
    { name: "Pro Performance Mini Irk Kuzulu ve Yaban Mersinli Yetişkin 2 Kg", price: 546.40, originalPrice: 699, skt: "05.2027", stock: 10 },
    { name: "Pro Performance Mini Irk Somonlu ve Yaban Mersinli Yetişkin 2 Kg", price: 592.20, originalPrice: 699, skt: "11.2026", stock: 10 },
    { name: "Pro Performance Light Mini Irk Kuzulu Diyet Kısırlaştırılmış 2 Kg", price: 556.64, originalPrice: 699, skt: "07.2026", stock: 10 },
    { name: "Pro Performance Mini Irk Kuzulu ve Yaban Mersinli Yavru 2 Kg", price: 534.51, originalPrice: 699, skt: "11.2026", stock: 10 },
    { name: "Pro Performance Mini Irk Kuzulu ve Yaban Mersinli Yavru 7 Kg", price: 1356.27, originalPrice: 1699, skt: "11.2026", stock: 10 },
    { name: "Pro Performance Mini Irk Somonlu ve Yaban Mersinli Yetişkin 7 Kg", price: 1538.47, originalPrice: 1699, skt: "11.2026", stock: 10 },
    { name: "Pro Performance Light Mini Irk Kuzulu Diyet Kısırlaştırılmış 7 Kg", price: 1553.37, originalPrice: 1699, skt: "01.2027", stock: 10 },
    { name: "Pro Performance Kuzulu ve Yaban Mersinli Küçük Irk Yetişkin 2 Kg", price: 515.68, originalPrice: 899, skt: "07.2026", stock: 10 },
    { name: "Pro Performance Ultra Premium Orta Büyük Somonlu Yetişkin 12 Kg", price: 1765.76, originalPrice: 2500, skt: "11.2027", stock: 10 },
    { name: "Pro Performance Ultra Premium Orta Büyük Somonlu Yavru 12 Kg", price: 2370.15, originalPrice: 2500, skt: "06.2026", stock: 0 },
    { name: "Pro Performance Ultra Premium Orta Büyük Kuzulu Yavru 12 Kg", price: 2120.21, originalPrice: 2500, skt: "12.2026", stock: 0 },
    { name: "Pro Performance Ultra Premium Kuzulu Küçük Irk Yavru 12 Kg", price: 2933.18, originalPrice: 2700, skt: "10.2027", stock: 0 },
  ],
};

const REFLEX_KOPEK: BrandProductData = {
  brandName: "Reflex",
  brandSlug: "reflex-mama",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Reflex Kuzu Etli Pirinçli ve Sebzeli Yetişkin Köpek Maması 15 Kg", price: 2020.18, originalPrice: 2499, skt: "03.2027", img: "https://www.mamatoptancisi.com/reflex-kuzu-etli-pirincli-ve-sebzeli-yetiskin-kopek-mamasi-15-kg-1052761-92-O.jpg", stock: 10 },
    { name: "Reflex Balıklı ve Pirinçli Yetişkin Köpek Maması 15 kg", price: 1872.74, originalPrice: 2090, skt: "02.2027", img: "https://www.mamatoptancisi.com/reflex-balikli-ve-pirincli-yetiskin-kopek-mamasi-15-kg-1047672-90-O.jpg", stock: 10 },
    { name: "Reflex Duo Protein Somonlu ve Kuzulu Orta ve Büyük Irk Yetişkin Köpek Maması 10 kg", price: 1194.21, originalPrice: 1699, skt: "05.2027", img: "https://www.mamatoptancisi.com/reflex-duo-protein-somonlu-ve-kuzulu-orta-ve-buyuk-irk-yetiskin-kopek-mamasi-10-kg-1060494-94-O.jpg", stock: 0 },
    { name: "Reflex Kuzu Etli ve Pirinçli Yetişkin Köpek Maması 15 kg", price: 1850.25, originalPrice: 2750, skt: "01.2027", img: "https://www.mamatoptancisi.com/reflex-kuzu-etli-ve-pirincli-yetiskin-kopek-mamasi-15-kg-1047675-49-O.jpg", stock: 0 },
    { name: "Reflex High Quality Biftekli ve Pirinçli Yavru Köpek Maması 15 kg", price: 1143, originalPrice: 1870, skt: "08.2025", img: "https://www.mamatoptancisi.com/reflex-high-quality-biftekli-ve-pirincli-yavru-kopek-mamasi-15-kg-1047678-11-O.jpg", stock: 0 },
    { name: "Reflex High Energy Biftekli Yetişkin Köpek Maması 15 kg", price: 1704.57, originalPrice: 1320, skt: "02.2027", img: "https://www.mamatoptancisi.com/reflex-high-energy-biftekli-yetiskin-kopek-mamasi-15-kg-1058170-11-O.jpg", stock: 0 },
    { name: "Reflex Kuzu Etli ve Pirinçli Yavru Köpek Maması 15 kg", price: 1207, originalPrice: 1870, skt: "03.2026", img: "https://www.mamatoptancisi.com/reflex-kuzu-etli-ve-pirincli-yavru-kopek-mamasi-15-kg-1076580-11-O.jpg", stock: 0 },
  ],
};

const REFLEX_PLUS_KOPEK: BrandProductData = {
  brandName: "Reflex Plus",
  brandSlug: "reflex-plus",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Reflex Plus Somonlu Hipoallerjenik Orta ve Büyük Irk Yetişkin Köpek Maması 12 Kg", price: 1529.38, originalPrice: 2500, skt: "02.2027", img: "https://www.mamatoptancisi.com/reflex-plus-somonlu-orta-ve-buyuk-irk-yetiskin-kopek-mamasi-12-kg-1073778-87-O.jpg", stock: 10 },
    { name: "Reflex Plus Somonlu Mini ve Küçük Irk Yetişkin Köpek Maması 8 kg", price: 1267.12, originalPrice: 1540, skt: "04.2027", img: "https://www.mamatoptancisi.com/reflex-plus-somonlu-mini-ve-kucuk-irk-yetiskin-kopek-mamasi-8-kg-1047727-16-O.jpg", stock: 10 },
    { name: "Reflex Plus Hipoalerjenik Labrador Retriever Özel Irk Yetişkin Köpek Maması 8 kg", price: 1990.29, originalPrice: 2499, skt: "04.2027", img: "https://www.mamatoptancisi.com/reflex-plus-hipoalerjenik-labrador-retriever-ozel-irk-yetiskin-kopek-mamasi-8-kg-1047879-97-O.jpg", stock: 10 },
    { name: "Reflex Plus Hipoalerjenik German Shepherd Özel Irk Yavru Köpek Maması 8 kg", price: 1990.29, originalPrice: 2499, skt: "03.2027", stock: 10 },
    { name: "Reflex Plus Hipoalerjenik Labrador Retriever Özel Irk Yavru Köpek Maması 8 kg", price: 1990.29, originalPrice: 2499, skt: "02.2027", stock: 10 },
    { name: "Reflex Plus Hipoalerjenik Golden Retriever Özel Irk Yavru Köpek Maması 8 kg", price: 1990.29, originalPrice: 2499, skt: "03.2027", stock: 10 },
    { name: "Reflex Plus German Shepherd Alman Kurdu Özel Irk Yetişkin Köpek Maması 8 Kg", price: 2045.57, originalPrice: 2599, skt: "04.2027", stock: 10 },
    { name: "Reflex Plus Golden Retriever Özel Irk Yetişkin Köpek Maması 8 kg", price: 2085.40, originalPrice: 2599, skt: "04.2027", stock: 10 },
    { name: "Reflex Plus High Energy Biftekli Yetişkin Köpek Maması 12 kg", price: 1806.43, originalPrice: 2500, skt: "02.2027", stock: 10 },
    { name: "Reflex Plus Hypoallergenic Kuzu Orta ve Büyük Irk Köpek Maması 12 Kg", price: 1467.62, originalPrice: 2500, skt: "11.2026", stock: 10 },
    { name: "Reflex Plus Kuzu & Pirinç Küçük Irk Yetişkin Köpek Maması 8 kg", price: 1267.12, originalPrice: 1649.89, skt: "05.2027", img: "https://www.mamatoptancisi.com/reflex-plus-kuzu-pirinc-kucuk-irk-yetiskin-kopek-mamasi-8-kg-1070345-16-O.jpg", stock: 0 },
    { name: "Reflex Plus Hypoallergenic Pomeranian Özel Irk Yetişkin Köpek Maması 2 kg", price: 452, originalPrice: 699, skt: "04.2026", stock: 0 },
    { name: "Reflex Plus Yorkshire Terrier Yavru Köpek Maması 1,5 kg", price: 407, originalPrice: 407, skt: "04.2026", stock: 0 },
    { name: "Reflex Plus Pomeranian Yavru Köpek Maması 1,5 kg", price: 407, originalPrice: 989.89, skt: "04.2026", stock: 0 },
    { name: "Reflex Plus Light Kuzulu Kısırlaştırılmış Yetişkin Köpek Maması 15 kg", price: 1633.35, originalPrice: 2300, skt: "11.2026", stock: 0 },
    { name: "Reflex Plus Kuzu Etli ve Pirinçli Büyük Irk Yetişkin Köpek Maması 18 kg", price: 2099.54, originalPrice: 2420, skt: "01.2027", stock: 0 },
    { name: "Reflex Plus High Energy Biftekli Yetişkin Köpek Maması 15 kg", price: 1276.90, originalPrice: 1869.89, skt: "05.2026", stock: 0 },
  ],
};

const WANPY_KOPEK: BrandProductData = {
  brandName: "Wanpy",
  brandSlug: "wanpy",
  animal: "kopek",
  subcategory: "mama-markalari",
  products: [
    { name: "Wanpy Sığır Etli Tahılsız Yetişkin Köpek Maması 12 kg", price: 3180, originalPrice: 3800, skt: "02.2027", stock: 10 },
    { name: "Wanpy Ördekli Tahılsız Yetişkin Köpek Maması 12 kg", price: 3180, originalPrice: 3900, skt: "02.2027", stock: 10 },
    { name: "Wanpy Sığır Etli Tahılsız Yetişkin Köpek Maması 1,5 kg", price: 649, originalPrice: 950, skt: "06.2026", stock: 10 },
    { name: "Wanpy Ördekli Tahılsız Yetişkin Köpek Maması 1,5 kg", price: 649, originalPrice: 950, skt: "06.2026", stock: 10 },
    { name: "Wanpy Tavuklu Tahılsız Yetişkin Köpek Maması 1,5 kg", price: 649, originalPrice: 950, skt: "06.2026", stock: 10 },
    { name: "Wanpy Tavuklu Tahılsız Yavru Köpek Maması 1,5 kg", price: 649, originalPrice: 950, skt: "08.2026", stock: 10 },
  ],
};

const KOPEK_ACIK_MAMA_PROPLAN: BrandProductData = {
  brandName: "Pro Plan",
  brandSlug: "pro-plan",
  animal: "kopek",
  subcategory: "acik-mama",
  products: [
    { name: "Pro Plan Yetişkin Köpek Tavuklu Açık Mama 1 KG", price: 189, originalPrice: 250, img: "https://www.mamatoptancisi.com/pro-plan-yetiskin-kopek-tavuklu-acik-mama-1-kg-1060001-10-O.jpg", stock: 10 },
    { name: "Pro Plan Yavru Köpek Tavuklu Açık Mama 1 KG", price: 199, originalPrice: 265, img: "https://www.mamatoptancisi.com/pro-plan-yavru-kopek-tavuklu-acik-mama-1-kg-1060002-10-O.jpg", stock: 10 },
    { name: "Pro Plan Hassas Sindirimli Köpek Kuzulu Açık Mama 1 KG", price: 209, originalPrice: 280, img: "https://www.mamatoptancisi.com/pro-plan-hassas-sindirimli-kopek-kuzulu-acik-mama-1-kg-1060003-10-O.jpg", stock: 10 },
  ],
};

const KOPEK_ACIK_MAMA_HILLS: BrandProductData = {
  brandName: "Hill's",
  brandSlug: "hills",
  animal: "kopek",
  subcategory: "acik-mama",
  products: [
    { name: "Hill's Science Plan Yetişkin Köpek Tavuklu Açık Mama 1 KG", price: 219, originalPrice: 300, img: "https://www.mamatoptancisi.com/hills-yetiskin-kopek-tavuklu-acik-mama-1-kg-1060004-10-O.jpg", stock: 10 },
    { name: "Hill's Science Plan Yavru Köpek Tavuklu Açık Mama 1 KG", price: 229, originalPrice: 310, img: "https://www.mamatoptancisi.com/hills-yavru-kopek-tavuklu-acik-mama-1-kg-1060005-10-O.jpg", stock: 10 },
    { name: "Hill's Science Plan Küçük Irk Köpek Tavuklu Açık Mama 1 KG", price: 239, originalPrice: 320, img: "https://www.mamatoptancisi.com/hills-kucuk-irk-kopek-tavuklu-acik-mama-1-kg-1060006-10-O.jpg", stock: 10 },
  ],
};

const KOPEK_ACIK_MAMA_ROYALCANIN: BrandProductData = {
  brandName: "Royal Canin",
  brandSlug: "royal-canin",
  animal: "kopek",
  subcategory: "acik-mama",
  products: [
    { name: "Royal Canin Maxi Adult Yetişkin Köpek Açık Mama 1 KG", price: 199, originalPrice: 270, img: "https://www.mamatoptancisi.com/royal-canin-maxi-adult-kopek-acik-mama-1-kg-1060007-10-O.jpg", stock: 10 },
    { name: "Royal Canin Mini Adult Yetişkin Köpek Açık Mama 1 KG", price: 209, originalPrice: 285, img: "https://www.mamatoptancisi.com/royal-canin-mini-adult-kopek-acik-mama-1-kg-1060008-10-O.jpg", stock: 10 },
    { name: "Royal Canin Medium Puppy Yavru Köpek Açık Mama 1 KG", price: 219, originalPrice: 295, img: "https://www.mamatoptancisi.com/royal-canin-medium-puppy-kopek-acik-mama-1-kg-1060009-10-O.jpg", stock: 10 },
  ],
};

const KOPEK_ACIK_MAMA_REFLEX: BrandProductData = {
  brandName: "Reflex",
  brandSlug: "reflex",
  animal: "kopek",
  subcategory: "acik-mama",
  products: [
    { name: "Reflex Yetişkin Köpek Kuzulu Açık Mama 1 KG", price: 99, originalPrice: 140, img: "https://www.mamatoptancisi.com/reflex-yetiskin-kopek-kuzulu-acik-mama-1-kg-1060010-10-O.jpg", stock: 10 },
    { name: "Reflex Yavru Köpek Tavuklu Açık Mama 1 KG", price: 109, originalPrice: 150, img: "https://www.mamatoptancisi.com/reflex-yavru-kopek-tavuklu-acik-mama-1-kg-1060011-10-O.jpg", stock: 10 },
    { name: "Reflex Yetişkin Köpek Somonlu Açık Mama 1 KG", price: 109, originalPrice: 145, img: "https://www.mamatoptancisi.com/reflex-yetiskin-kopek-somonlu-acik-mama-1-kg-1060012-10-O.jpg", stock: 10 },
  ],
};

const ALL_BRAND_DATA = [...SEED_BRAND_DATA, ...EXTRA_BRAND_DATA.filter((b: BrandProductData) => b.animal === "kopek"), ECONATURE_KOPEK, FELICIA_KOPEK, ENJOY_KOPEK, LAVITAL_KOPEK, PROCHOICE_KOPEK, PRONATURE_KOPEK, PROPERFORMANCE_KOPEK, REFLEX_KOPEK, REFLEX_PLUS_KOPEK, WANPY_KOPEK, KOPEK_ACIK_MAMA_PROPLAN, KOPEK_ACIK_MAMA_HILLS, KOPEK_ACIK_MAMA_ROYALCANIN, KOPEK_ACIK_MAMA_REFLEX];

const KOPEK_CROSS_SELL_SECTIONS = [
  {
    title: "TUVALET MALZEMESİ",
    forAnimal: "kopek",
    sortOrder: 1,
    productNames: [
      "Gimdog Lavanta Kokulu Köpek Çiş Pedi 60x60 cm 50'li",
      "Gimdog Köpek Çiş Pedi 60x60 cm 50'li",
      "Prochoice Yavru Köpek Çiş Eğitim Pedi 60x90 cm 30'lu",
      "Prochoice Yavru Köpek Tuvalet Eğitim Spreyi 100 ml",
      "Supravet Köpek Çiş Eğitim Pedi 60x90 cm 30'lu",
      "Gimdog Köpek Çiş Pedi 60x60 cm 10'lu",
    ],
  },
  {
    title: "YAŞ MAMA",
    forAnimal: "kopek",
    sortOrder: 2,
    productNames: [
      "Reflex Plus Sos İçinde Somonlu Yetişkin Köpek Konservesi 400 Gr",
      "Reflex Plus Sos İçinde Kuzu Etli Yetişkin Köpek Konservesi 400 Gr",
      "Wanpy Biftekli Tahılsız Yetişkin Köpek Konservesi 375 gr",
      "Challenge Pate Kuzu Etli Yavru Köpek Konservesi 400 gr",
      "Bestpet Jöle İçinde Parça Kuzu Etli Yavru Köpek Konservesi 400 gr",
      "Floki Kuzulu Yetişkin Köpek Konservesi 400 gr",
    ],
  },
  {
    title: "ÖDÜL VE KEMİK",
    forAnimal: "kopek",
    sortOrder: 3,
    productNames: [
      "Gnawlers Defense Dental Köpek Ödül Maması 15gr 7.5cm",
      "M-Pets Trusty Extra Biftekli Düğüm Köpek Ödül Kemiği 105 gr 7'li",
      "Dentalight Beefy Stick Sığır Etli Köpek Ödül Çubuğu 70 Gr",
      "Wanpy Kurutulmuş Dana Ciğeri Köpek Ödülü 40 Gr",
      "Pedigree Markies Köpek Ödül Bisküvisi 150 gr",
      "Baffs Naturals Kurutulmuş Dana Et Çubukları Köpek Ödülü 100 gr",
    ],
  },
  {
    title: "BAKIM VE SAĞLIK",
    forAnimal: "kopek",
    sortOrder: 4,
    productNames: [
      "Nunbell Kıtık Açıcı Tarak",
      "M-Pets Uzun Tüylü Köpekler İçin Şampuan 250 Ml",
      "Supravet Dış Parazit Karşıtı Köpek Şampuanı 200 ml",
      "Nunbell Dental Köpek Diş Temizleme Seti 3'lü",
      "Wahlen Kedi ve Köpekler İçin Nano Silver Temizleme Mendili 50'li",
      "Bioline Köpek Parazit Taması 60 cm",
    ],
  },
];

async function seedCrossSellSections() {
  const existingSections = await db.select().from(crossSellSections).where(eq(crossSellSections.forAnimal, "kopek"));
  if (existingSections.length >= 4) {
    console.log("Köpek cross-sell sections already exist, skipping...");
    return;
  }

  console.log("Seeding köpek cross-sell sections...");
  const allProducts = await db.select().from(products);
  const productMap = new Map(allProducts.map(p => [p.name, p.id]));

  for (const sectionData of KOPEK_CROSS_SELL_SECTIONS) {
    const existingSection = await db.select().from(crossSellSections).where(
      and(eq(crossSellSections.title, sectionData.title), eq(crossSellSections.forAnimal, "kopek"))
    );
    if (existingSection.length > 0) continue;

    const [section] = await db.insert(crossSellSections).values({
      title: sectionData.title,
      forAnimal: sectionData.forAnimal,
      sortOrder: sectionData.sortOrder,
      isActive: true,
    }).returning();

    let sortOrder = 1;
    for (const productName of sectionData.productNames) {
      const productId = productMap.get(productName);
      if (productId) {
        await db.insert(crossSellItems).values({
          sectionId: section.id,
          productId,
          sortOrder: sortOrder++,
        });
      } else {
        console.log(`Cross-sell product not found: ${productName}`);
      }
    }
    console.log(`Created cross-sell section "${sectionData.title}" with ${sortOrder - 1} products`);
  }
}

const SUBCATEGORY_SEED_DATA = [
  { animal: "kopek", slug: "kopek-kuru-mama", displayName: "Köpek Kuru\nMama", color: "#E65100", hasBrands: true, sortOrder: 0 },
  { animal: "kopek", slug: "mama-markalari", displayName: "Köpek\nMaması", color: "#FF5722", hasBrands: true, sortOrder: 1 },
  { animal: "kopek", slug: "acik-mama", displayName: "Açık Mama\nÇeşitleri", color: "#FF9800", hasBrands: true, sortOrder: 2 },
  { animal: "kopek", slug: "tuvalet-malzemeleri", displayName: "Tuvalet\nMalzemeleri", color: "#8BC34A", hasBrands: false, sortOrder: 3 },
  { animal: "kopek", slug: "yas-mama", displayName: "Yaş Mama\nÇeşitleri", color: "#E91E63", hasBrands: false, sortOrder: 4 },
  { animal: "kopek", slug: "odul-kemik", displayName: "Köpek\nÖdülleri", color: "#9C27B0", hasBrands: false, sortOrder: 5 },
  { animal: "kopek", slug: "tasima-kulube", displayName: "Taşıma ve\nKulübeler", color: "#795548", hasBrands: false, sortOrder: 6 },
  { animal: "kopek", slug: "bakim-saglik", displayName: "Bakım ve\nSağlık", color: "#00BCD4", hasBrands: false, sortOrder: 7 },
  { animal: "kopek", slug: "uygun-cuval", displayName: "Uygun Çuval\nMamalar", color: "#607D8B", hasBrands: false, sortOrder: 8 },
  { animal: "kopek", slug: "oyuncak", displayName: "Köpek\nOyuncak", color: "#3F51B5", hasBrands: false, sortOrder: 9 },
  { animal: "kopek", slug: "mama-su-kabi", displayName: "Mama Su\nKapları", color: "#0288D1", hasBrands: false, sortOrder: 10 },
  { animal: "kopek", slug: "bel-boyun-tasma", displayName: "Bel Boyun\nTasmaları", color: "#6D4C41", hasBrands: false, sortOrder: 11 },
  { animal: "kopek", slug: "tuy-toplayici", displayName: "Tüy\nToplayıcı", color: "#AD1457", hasBrands: false, sortOrder: 12 },
  { animal: "kopek", slug: "tirnak-makasi", displayName: "Tırnak\nMakasları", color: "#5D4037", hasBrands: false, sortOrder: 13 },
  { animal: "kopek", slug: "sampuan-banyo", displayName: "Şampuan ve\nBanyo", color: "#1976D2", hasBrands: false, sortOrder: 14 },
  { animal: "kopek", slug: "agiz-dis-bakim", displayName: "Ağız ve Diş\nBakımı", color: "#26A69A", hasBrands: false, sortOrder: 15 },
  { animal: "kopek", slug: "sut-tozu-biberon", displayName: "Süt Tozu ve\nBiberon", color: "#EC407A", hasBrands: false, sortOrder: 16 },
  { animal: "kopek", slug: "bit-pire-parazit", displayName: "Bit Pire\nParazit", color: "#D32F2F", hasBrands: false, sortOrder: 17 },
  { animal: "kopek", slug: "goz-kulak-bakim", displayName: "Göz ve Kulak\nBakımı", color: "#7E57C2", hasBrands: false, sortOrder: 18 },
  { animal: "kopek", slug: "cigneti-kemik", displayName: "Köpek Çiğneti\nve Kemikler", color: "#8D6E63", hasBrands: false, sortOrder: 19 },
  { animal: "kopek", slug: "kopek-aksesuari", displayName: "Köpek\nAksesuarı", color: "#455A64", hasBrands: false, sortOrder: 20 },
  { animal: "kopek", slug: "tras-ekipmanlari", displayName: "Tıraş\nEkipmanları", color: "#37474F", hasBrands: false, sortOrder: 21 },
];

async function seedSubcategories() {
  const animalsWithExisting = new Set(
    (await db.select().from(subcategories)).map(r => r.animal)
  );
  for (const sub of SUBCATEGORY_SEED_DATA) {
    if (animalsWithExisting.has(sub.animal)) continue;
    await db.insert(subcategories).values(sub);
    console.log(`Seeded subcategory: ${sub.animal}/${sub.slug}`);
  }
}

async function seedDefaultBrandCategoriesForSubcategories() {
  const allBrands = await db.select().from(brandCategories);
  const existingKeys = new Set(
    allBrands.map(b => `${b.animal}/${b.subcategory}/${b.brandSlug}`)
  );
  for (const sub of SUBCATEGORY_SEED_DATA) {
    if (sub.hasBrands) continue;
    const displayName = sub.displayName.replace(/\n/g, " ");
    const key = `${sub.animal}/${sub.slug}/${sub.slug}`;
    const existing = allBrands.find(b => b.animal === sub.animal && b.subcategory === sub.slug && b.brandSlug === sub.slug);
    if (existing) {
      if (existing.brandName !== displayName) {
        await db.update(brandCategories).set({ brandName: displayName }).where(eq(brandCategories.id, existing.id));
        console.log(`Updated default brand_category name: ${sub.animal}/${sub.slug} -> ${displayName}`);
      }
      continue;
    }
    await db.insert(brandCategories).values({
      brandName: displayName,
      brandSlug: sub.slug,
      animal: sub.animal,
      subcategory: sub.slug,
    });
    console.log(`Seeded default brand_category: ${sub.animal}/${sub.slug}`);
  }
}

async function cleanupOrphanBrandCategories() {
  const allSubs = await db.select().from(subcategories);
  const validKeys = new Set(allSubs.map(s => `${s.animal}/${s.slug}`));
  const allBrands = await db.select().from(brandCategories);
  for (const b of allBrands) {
    if (!validKeys.has(`${b.animal}/${b.subcategory}`)) {
      await db.delete(brandCategories).where(eq(brandCategories.id, b.id));
      console.log(`Removed orphan brand_category: ${b.animal}/${b.subcategory}/${b.brandSlug}`);
    }
  }
}

async function seedDeliveryNeighborhoods() {
  const existing = await db.select().from(deliveryNeighborhoods).limit(1);
  if (existing.length > 0) {
    console.log("Delivery neighborhoods already exist, skipping...");
    return;
  }

  const NEIGHBORHOODS = [
    { district: "Atakum", name: "Körfez", distance: 1, sortOrder: 1 },
    { district: "Atakum", name: "Denizevleri", distance: 1.5, sortOrder: 2 },
    { district: "Atakum", name: "Mimar Sinan", distance: 2, sortOrder: 3 },
    { district: "Atakum", name: "Atakent", distance: 2, sortOrder: 4 },
    { district: "Atakum", name: "Güzelyalı", distance: 2.5, sortOrder: 5 },
    { district: "Atakum", name: "Ömürevleri", distance: 2, sortOrder: 6 },
    { district: "Atakum", name: "Mevlana", distance: 2, sortOrder: 7 },
    { district: "Atakum", name: "Kurupelit", distance: 4, sortOrder: 8 },
    { district: "Atakum", name: "Esenevler", distance: 4, sortOrder: 9 },
    { district: "Atakum", name: "Balaç", distance: 5, sortOrder: 10 },
    { district: "Atakum", name: "Alanlı", distance: 6, sortOrder: 11 },
    { district: "Atakum", name: "Çakırlar", distance: 6, sortOrder: 12 },
    { district: "Atakum", name: "Küçükkolpınar", distance: 6, sortOrder: 13 },
    { district: "Atakum", name: "Büyükkolpınar", distance: 7, sortOrder: 14 },
    { district: "Atakum", name: "Atatepe", distance: 7, sortOrder: 15 },
    { district: "Atakum", name: "Kamalı", distance: 9, sortOrder: 16 },
    { district: "Atakum", name: "Çatalçam", distance: 9, sortOrder: 17 },
    { district: "Atakum", name: "Karaoyumca", distance: 8, sortOrder: 18 },
    { district: "Atakum", name: "Taflan", distance: 10.5, sortOrder: 19 },
    { district: "Atakum", name: "Yeni Mahalle", distance: 11.5, sortOrder: 20 },
    { district: "Atakum", name: "İncesu", distance: 12, sortOrder: 21 },
    { district: "İlkadım", name: "19 Mayıs", distance: 9, sortOrder: 1 },
    { district: "İlkadım", name: "Adalet", distance: 7, sortOrder: 2 },
    { district: "İlkadım", name: "Ağabali", distance: 10, sortOrder: 3 },
    { district: "İlkadım", name: "Anadolu", distance: 8, sortOrder: 4 },
    { district: "İlkadım", name: "Bahçelievler", distance: 7, sortOrder: 5 },
    { district: "İlkadım", name: "Baruthane", distance: 6, sortOrder: 6 },
    { district: "İlkadım", name: "Cedit", distance: 10, sortOrder: 7 },
    { district: "İlkadım", name: "Çatalarmut", distance: 11, sortOrder: 8 },
    { district: "İlkadım", name: "Derebahçe", distance: 11, sortOrder: 9 },
    { district: "İlkadım", name: "Fevzi Çakmak", distance: 9, sortOrder: 10 },
    { district: "İlkadım", name: "Gazi", distance: 9, sortOrder: 11 },
    { district: "İlkadım", name: "Hacınabi", distance: 10, sortOrder: 12 },
    { district: "İlkadım", name: "Hançerli", distance: 9, sortOrder: 13 },
    { district: "İlkadım", name: "İlyasköy", distance: 12, sortOrder: 14 },
    { district: "İlkadım", name: "İstasyon", distance: 10, sortOrder: 15 },
    { district: "İlkadım", name: "Kadıköy", distance: 11, sortOrder: 16 },
    { district: "İlkadım", name: "Kale", distance: 10, sortOrder: 17 },
    { district: "İlkadım", name: "Karadeniz", distance: 9, sortOrder: 18 },
    { district: "İlkadım", name: "Kılıçdede", distance: 10, sortOrder: 19 },
    { district: "İlkadım", name: "Liman", distance: 8, sortOrder: 20 },
    { district: "İlkadım", name: "Pazar", distance: 10, sortOrder: 21 },
    { district: "İlkadım", name: "Rasathane", distance: 12, sortOrder: 22 },
    { district: "İlkadım", name: "Selahiye", distance: 10, sortOrder: 23 },
    { district: "İlkadım", name: "Tepecik", distance: 11, sortOrder: 24 },
    { district: "İlkadım", name: "Ulugazi", distance: 10, sortOrder: 25 },
    { district: "İlkadım", name: "Unkapanı", distance: 10, sortOrder: 26 },
    { district: "İlkadım", name: "Yaşardoğu", distance: 11, sortOrder: 27 },
    { district: "İlkadım", name: "Zeytinlik", distance: 8, sortOrder: 28 },
    { district: "Canik", name: "Karşıyaka", distance: 9, sortOrder: 1 },
    { district: "Canik", name: "Gaziosmanpaşa", distance: 10, sortOrder: 2 },
    { district: "Canik", name: "Yavuz Selim", distance: 10, sortOrder: 3 },
    { district: "Canik", name: "Uludağ", distance: 10, sortOrder: 4 },
    { district: "Canik", name: "Orhangazi", distance: 11, sortOrder: 5 },
  ];

  for (const nh of NEIGHBORHOODS) {
    await db.insert(deliveryNeighborhoods).values({
      district: nh.district,
      name: nh.name,
      distance: nh.distance,
      minOrder: 700,
      shippingFee: 89,
      freeShippingLimit: 2000,
      isActive: true,
      sortOrder: nh.sortOrder,
    });
  }
  console.log(`Seeded ${NEIGHBORHOODS.length} delivery neighborhoods.`);
}

export async function seedDatabase() {
  await seedSubcategories();
  await seedDefaultBrandCategoriesForSubcategories();
  await cleanupOrphanBrandCategories();
  await seedDeliveryNeighborhoods();
  console.log("Checking database for missing brand data...");

  for (const brand of ALL_BRAND_DATA) {
    const existing = await db.select().from(brandCategories).where(
      and(
        eq(brandCategories.brandSlug, brand.brandSlug),
        eq(brandCategories.animal, brand.animal),
        eq(brandCategories.subcategory, brand.subcategory)
      )
    );

    if (existing.length > 0) {
      console.log(`Brand ${brand.brandName} (${brand.animal}/${brand.subcategory}) already exists, skipping...`);
      continue;
    }

    const [category] = await db.insert(brandCategories).values({
      brandName: brand.brandName,
      brandSlug: brand.brandSlug,
      animal: brand.animal,
      subcategory: brand.subcategory,
    }).returning();

    for (const product of brand.products) {
      await db.insert(products).values({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        skt: product.skt,
        img: product.img,
        stock: product.stock !== undefined ? product.stock : 10,
        brandCategoryId: category.id,
      });
    }

    console.log(`Seeded ${brand.products.length} products for ${brand.brandName} (${brand.animal}/${brand.subcategory})`);
  }

  await seedBreedStats();
  await seedCrossSellSections();
  await seedCampaignItems();
  console.log("Database seeding complete!");
}

const KEDI_BREEDS = [
  { name: "Tekir Kedi", color: "#FF6B35" },
  { name: "British Shorthair", color: "#4A90D9" },
  { name: "Scottish Fold", color: "#7B68EE" },
  { name: "Sarman", color: "#FFA726" },
  { name: "İran (Persian)", color: "#E91E63" },
  { name: "Ankara Kedisi", color: "#26A69A" },
  { name: "Ragdoll", color: "#AB47BC" },
  { name: "Maine Coon", color: "#8D6E63" },
  { name: "Siyam", color: "#42A5F5" },
  { name: "Van Kedisi", color: "#EF5350" },
  { name: "Tuxedo (Smokin) Kedi", color: "#78909C" },
  { name: "Bombay", color: "#333333" },
  { name: "Diğer", color: "#9E9E9E" },
];

const KOPEK_BREEDS = [
  { name: "Golden Retriever", color: "#FFB300" },
  { name: "Labrador", color: "#795548" },
  { name: "Alman Çoban", color: "#424242" },
  { name: "French Bulldog", color: "#E91E63" },
  { name: "Poodle", color: "#7B68EE" },
  { name: "Beagle", color: "#4CAF50" },
  { name: "Husky", color: "#90A4AE" },
  { name: "Border Collie", color: "#FF7043" },
  { name: "Yorkshire Terrier", color: "#AB47BC" },
  { name: "Cocker Spaniel", color: "#26A69A" },
  { name: "Kangal", color: "#D84315" },
  { name: "Diğer", color: "#9E9E9E" },
];

function getBreedDistribution(productName: string, isKopek: boolean): { breedIndex: number; pct: number }[] {
  const name = productName.toLowerCase();
  const breeds = isKopek ? KOPEK_BREEDS : KEDI_BREEDS;
  const total = breeds.length;
  let topIndices: number[];

  if (name.includes("yavru") || name.includes("kitten") || name.includes("puppy")) {
    topIndices = isKopek ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 3, 2, 6, 7, 4];
  } else if (name.includes("kısır") || name.includes("sterilised") || name.includes("kisirlast")) {
    topIndices = isKopek ? [3, 4, 1, 0, 2, 5, 6] : [0, 2, 1, 3, 4, 6, 5];
  } else if (name.includes("hassas") || name.includes("sensitive") || name.includes("delicate")) {
    topIndices = isKopek ? [4, 8, 9, 0, 1, 5, 6] : [4, 8, 6, 0, 1, 2, 3];
  } else if (name.includes("yaşlı") || name.includes("senior") || name.includes("ageing") || name.includes("mature")) {
    topIndices = isKopek ? [0, 1, 2, 4, 9, 5, 3] : [4, 1, 7, 0, 2, 3, 5];
  } else {
    topIndices = isKopek ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 6, 5];
  }

  const hash = productName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const numBreeds = 6 + (hash % 3);
  const selected = topIndices.slice(0, Math.min(numBreeds, topIndices.length));

  const basePcts = [28, 23, 18, 12, 8, 6, 5];
  let result: { breedIndex: number; pct: number }[] = [];
  let sum = 0;

  for (let i = 0; i < selected.length; i++) {
    const variation = ((hash + i * 7) % 5) - 2;
    const pct = Math.max(3, (basePcts[i] || 4) + variation);
    result.push({ breedIndex: selected[i], pct });
    sum += pct;
  }

  const diff = 100 - sum;
  result[0].pct += diff;

  return result;
}

async function seedBreedStats() {
  console.log("Checking breed stats for mama products...");

  const allProducts = await db.select().from(products);
  const allCategories = await db.select().from(brandCategories);
  const catMap = new Map(allCategories.map(c => [c.id, c]));

  const existingStats = await db.select({ productId: breedStats.productId }).from(breedStats);
  const productsWithStats = new Set(existingStats.map(s => s.productId));

  let count = 0;
  for (const product of allProducts) {
    if (productsWithStats.has(product.id)) continue;

    const cat = catMap.get(product.brandCategoryId);
    if (!cat) continue;

    const isKedi = cat.animal === "kedi" && (cat.subcategory === "kedi-mamasi" || cat.subcategory === "acik-mama");
    const isKopek = cat.animal === "kopek" && (cat.subcategory === "mama-markalari" || cat.subcategory === "kopek-mamasi" || cat.subcategory === "kopek-kuru-mama" || cat.subcategory === "acik-mama" || cat.subcategory === "uygun-cuval");
    if (!isKedi && !isKopek) continue;

    const breeds = isKopek ? KOPEK_BREEDS : KEDI_BREEDS;
    const distribution = getBreedDistribution(product.name, isKopek);

    for (let i = 0; i < distribution.length; i++) {
      const d = distribution[i];
      await db.insert(breedStats).values({
        productId: product.id,
        breedName: breeds[d.breedIndex].name,
        percentage: d.pct,
        color: breeds[d.breedIndex].color,
        sortOrder: i + 1,
      });
      count++;
    }
  }

  if (count > 0) {
    console.log(`Seeded ${count} new breed stats for mama products.`);
  } else {
    console.log("All mama products already have breed stats.");
  }
}

async function seedCampaignItems() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaign_items (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      item_type VARCHAR(10) NOT NULL DEFAULT 'main',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      parent_product_id INTEGER
    )
  `);
  await pool.query(`ALTER TABLE campaign_items ADD COLUMN IF NOT EXISTS parent_product_id INTEGER`);
  await pool.query(`ALTER TABLE campaign_items ADD COLUMN IF NOT EXISTS campaign_price NUMERIC`);

  const existing = await pool.query("SELECT COUNT(*) as cnt FROM campaign_items");
  if (parseInt(existing.rows[0].cnt) > 0) {
    console.log("Campaign items already exist, skipping...");
    return;
  }

  const CAMPAIGN_MAIN_PRODUCTS = [86, 103, 25, 197, 204, 28, 30, 98, 337, 365, 362, 354, 294, 292, 323, 298];
  const CAMPAIGN_EXTRA_PRODUCTS = [946, 937, 461, 936, 414, 910, 474, 473, 941, 930];

  let seeded = 0;
  for (let i = 0; i < CAMPAIGN_MAIN_PRODUCTS.length; i++) {
    const pid = CAMPAIGN_MAIN_PRODUCTS[i];
    const productExists = await pool.query("SELECT id FROM products WHERE id = $1", [pid]);
    if (productExists.rows.length > 0) {
      await pool.query(
        "INSERT INTO campaign_items (product_id, item_type, sort_order) VALUES ($1, $2, $3)",
        [pid, "main", i + 1]
      );
      seeded++;
    }
  }
  for (let i = 0; i < CAMPAIGN_EXTRA_PRODUCTS.length; i++) {
    const pid = CAMPAIGN_EXTRA_PRODUCTS[i];
    const productExists = await pool.query("SELECT id FROM products WHERE id = $1", [pid]);
    if (productExists.rows.length > 0) {
      await pool.query(
        "INSERT INTO campaign_items (product_id, item_type, sort_order) VALUES ($1, $2, $3)",
        [pid, "extra", i + 1]
      );
      seeded++;
    }
  }
  console.log(`Seeded ${seeded} campaign items.`);
}
