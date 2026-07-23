import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Menu, X, ShoppingBag, PawPrint, MessageCirclePlus, BookOpen,
  ChevronRight, Heart, ShoppingCart, CreditCard,
  Home as HomeIcon, Users, Bot,
} from "lucide-react";

/* ── Design Tokens ── */
const P   = "#6200EE";
const GB  = "#E5E7EB";
const FBG = "#1A0052";

/* ── Category metadata ── */
interface CatMeta {
  title: string;
  subtitle: string;
  count: number;
  slug: string;
}

const CAT_META: Record<string, CatMeta> = {
  "tuvalet":           { title:"Tuvalet Malzemeleri",       subtitle:"Köpek tuvalet ürünleri",         count:24, slug:"tuvalet" },
  "yas-mama":          { title:"Yaş Mama",                  subtitle:"Islak ve konserve mamalar",       count:31, slug:"yas-mama" },
  "odul-cesitleri":    { title:"Ödül Çeşitleri",            subtitle:"Atıştırmalık ve ödüller",         count:28, slug:"odul-cesitleri" },
  "tasima-cantalari":  { title:"Taşıma Çantaları",          subtitle:"Kedi ve köpek taşıma ürünleri",  count:18, slug:"tasima-cantalari" },
  "kulubeler":         { title:"Kulübeler",                  subtitle:"Köpek evi ve kulübeleri",         count:15, slug:"kulubeler" },
  "oyuncaklar":        { title:"Oyuncaklar",                 subtitle:"Eğlence ve aktivite oyuncakları", count:42, slug:"oyuncaklar" },
  "mama-su-kaplari":   { title:"Mama ve Su Kapları",         subtitle:"Beslenme ekipmanları",            count:22, slug:"mama-su-kaplari" },
  "bel-boyun-tasmalari":{ title:"Bel ve Boyun Tasmaları",   subtitle:"Tasma, gerdanlık ve kayışlar",    count:35, slug:"bel-boyun-tasmalari" },
  "bakim-saglik":      { title:"Bakım ve Sağlık",            subtitle:"Vitamin, takviye ve bakım",       count:29, slug:"bakim-saglik" },
  "makas-taraklar":    { title:"Makas ve Taraklar",          subtitle:"Tıraş ve bakım aletleri",        count:20, slug:"makas-taraklar" },
  "sampuan-parfum":    { title:"Şampuan ve Parfüm",          subtitle:"Banyo ve koku ürünleri",         count:26, slug:"sampuan-parfum" },
  "agiz-dis-bakimi":   { title:"Ağız ve Diş Bakımı",        subtitle:"Diş macunu, fırça ve gargara",   count:17, slug:"agiz-dis-bakimi" },
  "sut-tozu-biberon":  { title:"Süt Tozu ve Biberon",        subtitle:"Yavru besleme ürünleri",         count:12, slug:"sut-tozu-biberon" },
  "bit-pire-parazit":  { title:"Bit, Pire ve Parazit",       subtitle:"Parazit önleme ve tedavi",       count:19, slug:"bit-pire-parazit" },
  "goz-kulak-bakimi":  { title:"Göz ve Kulak Bakımı",        subtitle:"Hijyen ve bakım damlaları",      count:14, slug:"goz-kulak-bakimi" },
  "tiras-ekipmanlari": { title:"Tıraş Ekipmanları",          subtitle:"Profesyonel bakım makineleri",   count:11, slug:"tiras-ekipmanlari" },
};

/* ── Product types ── */
interface Product {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discountPct: number;
  installments: number;
  color: string; // background color for image placeholder
  emoji: string;
}

interface BrandGroup {
  brand: string;
  products: Product[];
}

/* ── Mock product data per category ── */
function getProductsForCategory(slug: string): BrandGroup[] {
  const data: Record<string, BrandGroup[]> = {
    "tuvalet": [
      { brand:"Simple Solution", products:[
        { id:"t1", name:"Yavru Köpek Çiş Pedi 60×60 cm 30'lu",          originalPrice:529,  salePrice:449,  discountPct:15, installments:3, color:"#E0F2FE", emoji:"🧹" },
        { id:"t2", name:"Yıkanabilir Köpek Tuvalet Pedi",               originalPrice:679,  salePrice:579,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🟦" },
      ]},
      { brand:"Trixie", products:[
        { id:"t3", name:"Köpek Tuvalet Eğitim Pedi 40×60 cm 50'li",    originalPrice:649,  salePrice:529,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"📦" },
        { id:"t4", name:"Çiş Pedi Tutucu Tuvalet Kabı",               originalPrice:899,  salePrice:749,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🏠" },
      ]},
      { brand:"Pawise", products:[
        { id:"t5", name:"Dişi Köpek Çiş Bezi 12'li",                   originalPrice:329,  salePrice:269,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🐕" },
        { id:"t6", name:"Erkek Köpek Bel Bezi 12'li",                  originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🐩" },
      ]},
      { brand:"Flamingo", products:[
        { id:"t7", name:"Kokulu Dışkı Poşeti 8 Rulo",                  originalPrice:249,  salePrice:189,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🟢" },
        { id:"t8", name:"Dışkı Poşeti Taşıma Aparatı",                 originalPrice:299,  salePrice:229,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"💼" },
      ]},
      { brand:"Beaphar", products:[
        { id:"t9",  name:"Tuvalet Eğitim Spreyi 50 ml",                originalPrice:399,  salePrice:329,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🧴" },
        { id:"t10", name:"Leke ve Koku Giderici Sprey",                originalPrice:449,  salePrice:369,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🌿" },
      ]},
      { brand:"Karlie", products:[
        { id:"t11", name:"Yapay Çimli Köpek Tuvaleti",                 originalPrice:1499, salePrice:1249, discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌱" },
        { id:"t12", name:"Kapalı Köpek Tuvalet Kabı",                  originalPrice:1299, salePrice:1499, discountPct:15, installments:3, color:"#F9FAFB", emoji:"🏡" },
      ]},
    ],
    "yas-mama": [
      { brand:"Royal Canin", products:[
        { id:"y1", name:"Poodle Yetişkin Yaş Mama 85g × 12",          originalPrice:579,  salePrice:489,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🥫" },
        { id:"y2", name:"Toy Köpek Yavru Yaş Mama 85g × 12",          originalPrice:629,  salePrice:529,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🍖" },
      ]},
      { brand:"Purina Pro Plan", products:[
        { id:"y3", name:"Küçük Irk Yetişkin Sığır Etli 85g × 10",    originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#E0F2FE", emoji:"🥩" },
        { id:"y4", name:"Hassas Sindirim Somonlu 85g × 10",           originalPrice:549,  salePrice:459,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🐟" },
      ]},
      { brand:"Pedigree", products:[
        { id:"y5", name:"Tavuklu ve Sebzeli Yaş Mama 100g × 12",      originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🍗" },
        { id:"y6", name:"Biftekli ve Sebzeli Yaş Mama 100g × 12",     originalPrice:319,  salePrice:269,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🥦" },
      ]},
      { brand:"Hill's Science Plan", products:[
        { id:"y7", name:"Küçük Irk Yetişkin Tavuklu Konserve 200g",   originalPrice:189,  salePrice:159,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🧪" },
        { id:"y8", name:"Hassas Mide Tavuklu Konserve 200g",           originalPrice:199,  salePrice:169,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"💊" },
      ]},
      { brand:"Brit", products:[
        { id:"y9",  name:"Premium Küçük Irk Dana Etli Konserve 400g", originalPrice:259,  salePrice:219,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🐄" },
        { id:"y10", name:"Care Grain Free Somon + Patates 400g",       originalPrice:289,  salePrice:239,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🥔" },
      ]},
      { brand:"Josera", products:[
        { id:"y11", name:"Pörkelt Konserve Tavuk + Patates 415g",     originalPrice:229,  salePrice:189,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🫙" },
        { id:"y12", name:"Dog Pur Hindili Konserve 415g",              originalPrice:239,  salePrice:199,  discountPct:15, installments:3, color:"#E0F2FE", emoji:"🦃" },
      ]},
    ],
    "odul-cesitleri": [
      { brand:"Trixie", products:[
        { id:"o1", name:"Biftek Dilimleri Köpek Ödülü 100g",           originalPrice:199,  salePrice:169,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🥩" },
        { id:"o2", name:"Tavuk Sarılı Köpek Çubuğu 80g",              originalPrice:189,  salePrice:159,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🍡" },
      ]},
      { brand:"Pedigree", products:[
        { id:"o3", name:"Dentastix Küçük Irk 7'li Diş Çubuğu",        originalPrice:239,  salePrice:199,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🦷" },
        { id:"o4", name:"Jumbone Küçük Irk Sığırlı 4'lü",             originalPrice:179,  salePrice:149,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🦴" },
      ]},
      { brand:"Mera", products:[
        { id:"o5", name:"Vital 14 Ödül 180g Çeşitli Lezzetler",       originalPrice:289,  salePrice:239,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🌟" },
        { id:"o6", name:"Dog Mix Ödül Karışımı 400g",                  originalPrice:319,  salePrice:269,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🎁" },
      ]},
      { brand:"Farmina", products:[
        { id:"o7", name:"N&D Spirulina Köpek Bisküvi 320g",            originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌿" },
        { id:"o8", name:"Cotto Kuzu + Kabak Köpek Ödülü 100g",        originalPrice:219,  salePrice:179,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🥒" },
      ]},
      { brand:"Brit", products:[
        { id:"o9",  name:"Premium Snack Mini Bits 200g Tavuklu",       originalPrice:249,  salePrice:209,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🍪" },
        { id:"o10", name:"Training Snack Extra Mini 200g",              originalPrice:229,  salePrice:189,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🐾" },
      ]},
      { brand:"Josera", products:[
        { id:"o11", name:"Snack Crispy Bites Tavuklu 500g",            originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🎀" },
        { id:"o12", name:"Snack Mini Ödül Köpek 500g",                 originalPrice:329,  salePrice:279,  discountPct:15, installments:3, color:"#E0F2FE", emoji:"✨" },
      ]},
    ],
    "tasima-cantalari": [
      { brand:"Trixie", products:[
        { id:"tc1", name:"Capri Köpek Taşıma Çantası 30×33×50 cm",    originalPrice:1299, salePrice:1099, discountPct:15, installments:3, color:"#DBEAFE", emoji:"👜" },
        { id:"tc2", name:"Savina Omuz Çantası Köpek Taşıyıcı S",      originalPrice:1599, salePrice:1349, discountPct:15, installments:3, color:"#F0FDF4", emoji:"👝" },
      ]},
      { brand:"Karlie", products:[
        { id:"tc3", name:"Smart Trolley Tekerlekli Taşıma Çantası M",  originalPrice:2499, salePrice:2099, discountPct:15, installments:3, color:"#F9FAFB", emoji:"🧳" },
        { id:"tc4", name:"Nylon Köpek Taşıma Çantası 38×25×38 cm",    originalPrice:999,  salePrice:849,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🎒" },
      ]},
      { brand:"Pawise", products:[
        { id:"tc5", name:"Mesh Ventilli Köpek Taşıyıcı S",             originalPrice:899,  salePrice:749,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"💼" },
        { id:"tc6", name:"Fashion Soft Taşıma Çantası Küçük Irk",     originalPrice:1199, salePrice:999,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🛍️" },
      ]},
      { brand:"Hunter", products:[
        { id:"tc7", name:"Hilo Köpek Taşıma Çantası 36×25×35 cm",     originalPrice:2199, salePrice:1849, discountPct:15, installments:3, color:"#EDE9FE", emoji:"🎽" },
        { id:"tc8", name:"Madison Kumaş Taşıyıcı Koyu Gri M",          originalPrice:1899, salePrice:1599, discountPct:15, installments:3, color:"#F3F4F6", emoji:"👟" },
      ]},
      { brand:"Ferplast", products:[
        { id:"tc9",  name:"With Me More Taşıma Çantası S Yuvarlak",   originalPrice:1699, salePrice:1429, discountPct:15, installments:3, color:"#E0F2FE", emoji:"⭕" },
        { id:"tc10", name:"Duo-Carrier Omuz Çantası Plastik Kapı",     originalPrice:1999, salePrice:1679, discountPct:15, installments:3, color:"#DBEAFE", emoji:"🗃️" },
      ]},
      { brand:"Zolux", products:[
        { id:"tc11", name:"Pet Carrier Sert Plastik Taşıyıcı XS",     originalPrice:1099, salePrice:929,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"📦" },
        { id:"tc12", name:"Kangaroo Kanguru Tipi Taşıyıcı Çanta",     originalPrice:1399, salePrice:1179, discountPct:15, installments:3, color:"#FEF9C3", emoji:"🦘" },
      ]},
    ],
    "kulubeler": [
      { brand:"Trixie", products:[
        { id:"k1", name:"Köpek Kulübesi Ahşap M 90×75×77 cm",          originalPrice:2499, salePrice:2099, discountPct:15, installments:3, color:"#FFF7ED", emoji:"🏠" },
        { id:"k2", name:"Köpek Kulübesi Plastik 65×55×60 cm",          originalPrice:1799, salePrice:1529, discountPct:15, installments:3, color:"#F9FAFB", emoji:"🏡" },
      ]},
      { brand:"Karlie", products:[
        { id:"k3", name:"Doghouse Boyalı Ahşap Kulübe L",               originalPrice:3299, salePrice:2799, discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌲" },
        { id:"k4", name:"Classic Köpek Evi M Kahverengi",               originalPrice:2799, salePrice:2349, discountPct:15, installments:3, color:"#FEF9C3", emoji:"🟫" },
      ]},
      { brand:"Ferplast", products:[
        { id:"k5", name:"Dogvilla Plastik Bahçe Kulübesi L",            originalPrice:2199, salePrice:1849, discountPct:15, installments:3, color:"#DBEAFE", emoji:"🏠" },
        { id:"k6", name:"Dog Inn Plastik Köpek Kulübesi XL",            originalPrice:2599, salePrice:2199, discountPct:15, installments:3, color:"#E0F2FE", emoji:"🏘️" },
      ]},
      { brand:"Pawise", products:[
        { id:"k7", name:"Country Home Ahşap Köpek Kulübesi M",          originalPrice:2099, salePrice:1779, discountPct:15, installments:3, color:"#FEF2F2", emoji:"🌾" },
        { id:"k8", name:"Log Cabin Dekoratif Tahta Kulübe L",           originalPrice:2699, salePrice:2279, discountPct:15, installments:3, color:"#FFF7ED", emoji:"🪵" },
      ]},
      { brand:"Savic", products:[
        { id:"k9",  name:"Residence Açık Köpek Kafes + Teras 3XL",     originalPrice:3799, salePrice:3199, discountPct:15, installments:3, color:"#F3F4F6", emoji:"⬜" },
        { id:"k10", name:"Dogpark Köpek Kafes + Çatı 2XL",             originalPrice:4299, salePrice:3649, discountPct:15, installments:3, color:"#EDE9FE", emoji:"🏗️" },
      ]},
      { brand:"Flamingo", products:[
        { id:"k11", name:"Montana Plastik Köpek Kulübesi Gri M",        originalPrice:1899, salePrice:1599, discountPct:15, installments:3, color:"#F9FAFB", emoji:"⛰️" },
        { id:"k12", name:"Tudor Ahşap Köpek Evi L",                    originalPrice:2999, salePrice:2549, discountPct:15, installments:3, color:"#FEF9C3", emoji:"🏰" },
      ]},
    ],
    "oyuncaklar": [
      { brand:"Kong", products:[
        { id:"oy1", name:"Classic Kauçuk Köpek Oyuncağı S",             originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🔴" },
        { id:"oy2", name:"Wobbler Eğlenceli Mama Dispenseri M",         originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🤸" },
      ]},
      { brand:"Trixie", products:[
        { id:"oy3", name:"Nina Ottosson Dog Smart IQ Oyunu Lvl 1",     originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🧩" },
        { id:"oy4", name:"Peluş Köpek Oyuncağı Ses Çıkaran 20 cm",    originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🧸" },
      ]},
      { brand:"Nina Ottosson", products:[
        { id:"oy5", name:"Dog Brick IQ Oyun Matı Lvl 2",               originalPrice:899,  salePrice:749,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🟪" },
        { id:"oy6", name:"Dog Tornado IQ Oyunu Lvl 2",                 originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🌀" },
      ]},
      { brand:"Pawise", products:[
        { id:"oy7", name:"Lateks Kauçuk Köpek Oyuncağı Kemik S",       originalPrice:229,  salePrice:189,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🦴" },
        { id:"oy8", name:"Selamlama Köpek Oyuncağı Peluş Çift Taraflı",originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🐾" },
      ]},
      { brand:"Karlie", products:[
        { id:"oy9",  name:"Happydent Kauçuk Diş Oyuncağı S Mor",       originalPrice:279,  salePrice:229,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"💜" },
        { id:"oy10", name:"Frizzbee Köpek Frizbi 22 cm",               originalPrice:199,  salePrice:169,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🥏" },
      ]},
      { brand:"Flamingo", products:[
        { id:"oy11", name:"Tricky Box İnteraktif Mama Dispenseri",       originalPrice:549,  salePrice:459,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"📦" },
        { id:"oy12", name:"Latex Kauçuk Köpek Topu 8 cm Çıngıraklı",  originalPrice:179,  salePrice:149,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"⚽" },
      ]},
    ],
    "mama-su-kaplari": [
      { brand:"Trixie", products:[
        { id:"ms1", name:"Paslanmaz Köpek Mama Kabı 1.5L Çift",        originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🫙" },
        { id:"ms2", name:"Auto-Watering Otomatik Su Kabı 1.5L",        originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"💧" },
      ]},
      { brand:"Karlie", products:[
        { id:"ms3", name:"Silikon Katlanabilir Mama Kabı S",            originalPrice:279,  salePrice:229,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🟡" },
        { id:"ms4", name:"Bamboo Yükseltilmiş Mama Standı + 2 Kap",   originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌿" },
      ]},
      { brand:"Pawise", products:[
        { id:"ms5", name:"Seramik Köpek Mama + Su Kabı Seti",          originalPrice:329,  salePrice:279,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🍽️" },
        { id:"ms6", name:"Yavaş Beslenme Mama Kabı Anti-Boğulma",      originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🐢" },
      ]},
      { brand:"Hunter", products:[
        { id:"ms7", name:"Lund Paslanmaz Mama + Su Kabı Set",          originalPrice:849,  salePrice:719,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🥣" },
        { id:"ms8", name:"Nuria Seramik Mama Kabı 0.55L",              originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🫗" },
      ]},
      { brand:"Savic", products:[
        { id:"ms9",  name:"Dog-O-Drink Seyahat Su Matarası 1L",        originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🚰" },
        { id:"ms10", name:"Puppy Pet Ahşap Mama Standı 2 Kap",         originalPrice:1099, salePrice:929,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🪵" },
      ]},
      { brand:"Ferplast", products:[
        { id:"ms11", name:"Jolie Çeliklı Köpek Mama Kabı Çift 2×1.2L",originalPrice:549,  salePrice:459,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"⚙️" },
        { id:"ms12", name:"Magnus Micro Otomatik Su + Mama Kabı",       originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🤖" },
      ]},
    ],
    "bel-boyun-tasmalari": [
      { brand:"Hunter", products:[
        { id:"bt1", name:"Oslo Deri Köpek Boyun Tasması XS–S",         originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🟤" },
        { id:"bt2", name:"Wichita Reflektif Naylon Tasma S",           originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🔆" },
      ]},
      { brand:"Trixie", products:[
        { id:"bt3", name:"Premium Köpek Göğüs Tasması Air-Mesh XS",    originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🦺" },
        { id:"bt4", name:"Comfort Köpek Boyun Tasması Yumuşak XS",     originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"💚" },
      ]},
      { brand:"Karlie", products:[
        { id:"bt5", name:"Neon Reflektif Köpek Tasması S Sarı",        originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🔶" },
        { id:"bt6", name:"Fantasia Örgü Köpek Boyun Tasması XS",       originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🎀" },
      ]},
      { brand:"Pawise", products:[
        { id:"bt7", name:"Mesh Neopren Göğüs Tasması XS Mor",          originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"💜" },
        { id:"bt8", name:"Classic Naylon Ayarlı Bel Tasması XS",       originalPrice:249,  salePrice:209,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🔷" },
      ]},
      { brand:"Flamingo", products:[
        { id:"bt9",  name:"Halo LED Yanıp Sönen Güvenlik Tasması XS",  originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"💡" },
        { id:"bt10", name:"Twist Dokuma Kumaş Boyun Tasması S",        originalPrice:329,  salePrice:279,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🌀" },
      ]},
      { brand:"Ruffwear", products:[
        { id:"bt11", name:"Front Range Göğüs Tasması XS Mavi",         originalPrice:1599, salePrice:1349, discountPct:15, installments:3, color:"#DBEAFE", emoji:"🏔️" },
        { id:"bt12", name:"Hi & Light Hafif Tasma S–M",                originalPrice:1299, salePrice:1099, discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌟" },
      ]},
    ],
    "bakim-saglik": [
      { brand:"Beaphar", products:[
        { id:"bs1", name:"Köpek Deri ve Tüy Vitamini 180 Tablet",       originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"💊" },
        { id:"bs2", name:"Laksatone Köpek Malt Özlü Macun 100g",       originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🟩" },
      ]},
      { brand:"Francodex", products:[
        { id:"bs3", name:"Sedatyl Köpek Sakinleştirici 15 Tablet",      originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"😴" },
        { id:"bs4", name:"Renal Köpek Böbrek Desteği 60 Tablet",        originalPrice:529,  salePrice:449,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🩺" },
      ]},
      { brand:"Trixie", products:[
        { id:"bs5", name:"Paw Care Patik Koruyucu Balmumu 50ml",        originalPrice:249,  salePrice:209,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🐾" },
        { id:"bs6", name:"Köpek Kozalak Temizleme Spreyi 175ml",        originalPrice:279,  salePrice:229,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🌲" },
      ]},
      { brand:"Virbac", products:[
        { id:"bs7", name:"Anxitane Köpek Anksiyete Desteği S 30 Tab",  originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🧘" },
        { id:"bs8", name:"Nutribound Köpek Enerji ve İştah 150ml",     originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"⚡" },
      ]},
      { brand:"Vetnique", products:[
        { id:"bs9",  name:"Glandex Anal Kese Desteği 120 Yumuşak Kap", originalPrice:849,  salePrice:719,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🔬" },
        { id:"bs10", name:"Oticbliss AF Kulak Bakım Spreyi 118ml",      originalPrice:749,  salePrice:629,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"👂" },
      ]},
      { brand:"Karlie", products:[
        { id:"bs11", name:"First Aid Köpek İlk Yardım Kiti 18 Parça",   originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🩹" },
        { id:"bs12", name:"Reflekt-O-Belt Kıl Tarayıcı Fırça + Masaj",  originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"💅" },
      ]},
    ],
    "makas-taraklar": [
      { brand:"Artero", products:[
        { id:"mt1", name:"Garden Paslanmaz Çelik Ince Uçlu Makas 20cm", originalPrice:1299, salePrice:1099, discountPct:15, installments:3, color:"#F9FAFB", emoji:"✂️" },
        { id:"mt2", name:"Curly Köpek Kıvırcık Tüy Fırçası + Tarak",  originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"〰️" },
      ]},
      { brand:"Show Tech", products:[
        { id:"mt3", name:"Comfort Wide Paslanmaz Tarak 22.5cm 7.5mm",  originalPrice:549,  salePrice:459,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🪮" },
        { id:"mt4", name:"Salon Magic Grooming Makas 7.5 inç",         originalPrice:1799, salePrice:1529, discountPct:15, installments:3, color:"#F0FDF4", emoji:"💫" },
      ]},
      { brand:"Trixie", products:[
        { id:"mt5", name:"Kıl Giderici Tüy Toplama Eldiveni",           originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🧤" },
        { id:"mt6", name:"Slicker Köpek Fırçası Küçük Irk",            originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🖌️" },
      ]},
      { brand:"Karlie", products:[
        { id:"mt7", name:"Furminator Kalın Tüy Tarak L",               originalPrice:999,  salePrice:849,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🪗" },
        { id:"mt8", name:"Knot Out Düğüm Açıcı Köpek Tarak",           originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🔧" },
      ]},
      { brand:"Master Grooming", products:[
        { id:"mt9",  name:"Poodle Face Makas Seti 3'lü Profesyonel",   originalPrice:2499, salePrice:2099, discountPct:15, installments:3, color:"#EDE9FE", emoji:"🌸" },
        { id:"mt10", name:"Palm Pin Brush Avuç Içi Slicker Fırça M",   originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🤲" },
      ]},
      { brand:"Pawise", products:[
        { id:"mt11", name:"Steel Pin Slicker Fırça S Gri",              originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🩶" },
        { id:"mt12", name:"Dematting Kıl Düğüm Açma Tarağı",           originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🌀" },
      ]},
    ],
    "sampuan-parfum": [
      { brand:"Iv San Bernard", products:[
        { id:"sp1", name:"ISB Traditional Line Köpek Şampuanı 500ml",   originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🧴" },
        { id:"sp2", name:"ISB Magic Mousse Kuru Köpük Şampuan 300ml",   originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🫧" },
      ]},
      { brand:"Show Tech", products:[
        { id:"sp3", name:"Whitening White Pearl Şampuan 250ml",          originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"⬜" },
        { id:"sp4", name:"Tropical Köpek Saç Kremi 300ml",              originalPrice:749,  salePrice:629,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🌺" },
      ]},
      { brand:"Beaphar", products:[
        { id:"sp5", name:"Dry Shampoo Kuru Köpek Şampuanı 150g",        originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"❄️" },
        { id:"sp6", name:"2in1 Köpek Şampuan + Saç Kremi 250ml",        originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🍋" },
      ]},
      { brand:"Francodex", products:[
        { id:"sp7", name:"Aftermoon Köpek Parfümü 75ml Çiçeksi",        originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🌸" },
        { id:"sp8", name:"Odorizing Köpek Koku Gidericisi 250ml",       originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🌿" },
      ]},
      { brand:"Artero", products:[
        { id:"sp9",  name:"Mystic Köpek Parfümü 90ml Ocean Breeze",      originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🌊" },
        { id:"sp10", name:"Nature Pure Köpek Şampuanı Organik 250ml",   originalPrice:549,  salePrice:459,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌱" },
      ]},
      { brand:"Trixie", products:[
        { id:"sp11", name:"Köpek Şampuanı Hassas Cilt Papatya 250ml",   originalPrice:229,  salePrice:189,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🌼" },
        { id:"sp12", name:"Stain Remover Leke Çıkarıcı Sprey 175ml",   originalPrice:279,  salePrice:229,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"✨" },
      ]},
    ],
    "agiz-dis-bakimi": [
      { brand:"Virbac", products:[
        { id:"ad1", name:"C.E.T. Köpek Diş Macunu Tavuklu 70g",         originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🦷" },
        { id:"ad2", name:"VeggieDent Diş Temizleme Çubuğu S 15'li",     originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌿" },
      ]},
      { brand:"Beaphar", products:[
        { id:"ad3", name:"Köpek Diş Macunu Nane Özlü 100g",             originalPrice:279,  salePrice:229,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🦴" },
        { id:"ad4", name:"Ağız Gargarası Köpek 250ml",                  originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"💧" },
      ]},
      { brand:"Trixie", products:[
        { id:"ad5", name:"Köpek Diş Fırçası Çift Taraflı Silikon",      originalPrice:199,  salePrice:169,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🪥" },
        { id:"ad6", name:"Dental Kit Ağız Bakım Seti 3'lü",              originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🎁" },
      ]},
      { brand:"Karlie", products:[
        { id:"ad7", name:"Flamingo Dental Stix Köpek Diş Çubuğu 7'li",  originalPrice:229,  salePrice:189,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🌸" },
        { id:"ad8", name:"Freshy Ağız Koku Önleyici Damla 50ml",         originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🫧" },
      ]},
      { brand:"Francodex", products:[
        { id:"ad9",  name:"Dental Spray Ağız Spreyi 100ml",              originalPrice:329,  salePrice:279,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"💨" },
        { id:"ad10", name:"Köpek Diş Jeli Klorheksidine 50g",            originalPrice:379,  salePrice:319,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🔬" },
      ]},
      { brand:"Petrodex", products:[
        { id:"ad11", name:"Advanced Formula Köpek Diş Macunu 99g",       originalPrice:459,  salePrice:389,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"⭐" },
        { id:"ad12", name:"Enzymatic Diş Temizleme Losyonu 118ml",       originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🧪" },
      ]},
    ],
    "sut-tozu-biberon": [
      { brand:"Beaphar", products:[
        { id:"sb1", name:"Puppy Milk Köpek Yavru Süt Tozu 200g",        originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🍼" },
        { id:"sb2", name:"Sütçü Anne Seti Biberon + Emzik",              originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🤱" },
      ]},
      { brand:"Royal Canin", products:[
        { id:"sb3", name:"BabyDog Milk Yavru Süt Tozu 400g",             originalPrice:999,  salePrice:849,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🥛" },
        { id:"sb4", name:"Starter Köpek Yavru Başlangıç Püresi 195g",   originalPrice:249,  salePrice:209,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🍶" },
      ]},
      { brand:"Caniamyl", products:[
        { id:"sb5", name:"Süt Tozu Köpek Yavrusu 400g",                  originalPrice:1099, salePrice:929,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"📦" },
        { id:"sb6", name:"Mam Bottle Köpek Biberon Seti S 60ml",         originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🧸" },
      ]},
      { brand:"Virbac", products:[
        { id:"sb7", name:"Lactel Puppy Milk Süt Tozu 300g",              originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🐾" },
        { id:"sb8", name:"Starter Mousse Köpek Yavru Maması 195g × 4",  originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌟" },
      ]},
      { brand:"Trixie", products:[
        { id:"sb9",  name:"Küçük Irk Yavru Biberon 60ml Silikon Emzik", originalPrice:199,  salePrice:169,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🍼" },
        { id:"sb10", name:"Mama Isıtıcı Biberon Standı Pil Çalışır",    originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🔋" },
      ]},
      { brand:"Karlie", products:[
        { id:"sb11", name:"Puppy Nursing Kit 5'li Biberon Seti",         originalPrice:279,  salePrice:229,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🎁" },
        { id:"sb12", name:"Yavru Tartı Kiti + Terazi 1kg",               originalPrice:399,  salePrice:339,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"⚖️" },
      ]},
    ],
    "bit-pire-parazit": [
      { brand:"Beaphar", products:[
        { id:"pp1", name:"FiproTec Spot-On Köpek Dış Parazit S 3'lü",  originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🛡️" },
        { id:"pp2", name:"Anti Bit Parazit Sprey Köpek 400ml",          originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🌿" },
      ]},
      { brand:"Francodex", products:[
        { id:"pp3", name:"Parasit Stop Köpek Toz Dış Parazit 150g",    originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🔮" },
        { id:"pp4", name:"Dimethicone Dış Parazit Sprey 200ml",         originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"💉" },
      ]},
      { brand:"Bayer", products:[
        { id:"pp5", name:"Kiltix Tasma Köpek Anti Kene Pire XS–S",     originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🐜" },
        { id:"pp6", name:"Advantage 40 Spot On Köpek S 0.4ml × 4",     originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🧪" },
      ]},
      { brand:"Frontline", products:[
        { id:"pp7", name:"Plus Spot On Köpek S 2–10kg 3'lü Dış Parazit",originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"⚡" },
        { id:"pp8", name:"Combo Spot On Köpek S 3'lü Kene + Pire",     originalPrice:849,  salePrice:719,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🔬" },
      ]},
      { brand:"Virbac", products:[
        { id:"pp9",  name:"Effipro Spot On Köpek S 2–10kg 4'lü",       originalPrice:699,  salePrice:589,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🏥" },
        { id:"pp10", name:"Preventic Anti-Kene Tasma Köpek 25 cm",     originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🐝" },
      ]},
      { brand:"Seresto", products:[
        { id:"pp11", name:"Seresto Kene ve Pire Tasması Küçük Köpek",   originalPrice:1299, salePrice:1099, discountPct:15, installments:3, color:"#FEF9C3", emoji:"💛" },
        { id:"pp12", name:"Seresto Spot On Köpek 8 Ay Koruma",         originalPrice:1099, salePrice:929,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🌙" },
      ]},
    ],
    "goz-kulak-bakimi": [
      { brand:"Beaphar", products:[
        { id:"gk1", name:"Eye Cleansing Pads Köpek Göz Pedi 50'li",    originalPrice:299,  salePrice:249,  discountPct:15, installments:3, color:"#E0F2FE", emoji:"👁️" },
        { id:"gk2", name:"Ear Cleaner Köpek Kulak Temizleyici 50ml",   originalPrice:349,  salePrice:289,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"👂" },
      ]},
      { brand:"Virbac", products:[
        { id:"gk3", name:"Epi-Otic Kulak Temizleyici 125ml",            originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"🔵" },
        { id:"gk4", name:"Ocuvet Köpek Göz Damlası 10ml",              originalPrice:499,  salePrice:419,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"💧" },
      ]},
      { brand:"Francodex", products:[
        { id:"gk5", name:"Opti Clean Göz Çevresi Temizleyici Losyon",  originalPrice:329,  salePrice:279,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"🌿" },
        { id:"gk6", name:"Ear Cleansing Lotion Kulak 100ml",           originalPrice:379,  salePrice:319,  discountPct:15, installments:3, color:"#FFF7ED", emoji:"🍃" },
      ]},
      { brand:"Vetnique", products:[
        { id:"gk7", name:"Opticlear Göz Temizleme Pedi 60'lı",         originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#FEF2F2", emoji:"🎭" },
        { id:"gk8", name:"Zymox Kulak Solüsyonu Enzim 118ml",          originalPrice:799,  salePrice:679,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"🔬" },
      ]},
      { brand:"Trixie", products:[
        { id:"gk9",  name:"Göz Pedi Yırtık Leke Önleyici 50'li",       originalPrice:229,  salePrice:189,  discountPct:15, installments:3, color:"#DBEAFE", emoji:"🟦" },
        { id:"gk10", name:"Kulak Temizleme Pedi Aloe Vera 50'li",      originalPrice:249,  salePrice:209,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🌱" },
      ]},
      { brand:"Karlie", products:[
        { id:"gk11", name:"Flamingo Göz Yaşı Lekeleri Temizleyici 100ml",originalPrice:379, salePrice:319,  discountPct:15, installments:3, color:"#FEF9C3", emoji:"💎" },
        { id:"gk12", name:"Ear Care Kit Kulak Bakım Seti 2'li",         originalPrice:449,  salePrice:379,  discountPct:15, installments:3, color:"#F9FAFB", emoji:"🎁" },
      ]},
    ],
    "tiras-ekipmanlari": [
      { brand:"Wahl", products:[
        { id:"te1", name:"Bravura Köpek Tıraş Makinesi 5'li Başlık",  originalPrice:3999, salePrice:3399, discountPct:15, installments:3, color:"#DBEAFE", emoji:"🪒" },
        { id:"te2", name:"KM10 Profesyonel Kordon Tıraş Makinesi",     originalPrice:5499, salePrice:4679, discountPct:15, installments:3, color:"#F9FAFB", emoji:"⚡" },
      ]},
      { brand:"Andis", products:[
        { id:"te3", name:"AGC2 2 Hız Köpek Tıraş Makinesi",           originalPrice:4799, salePrice:4079, discountPct:15, installments:3, color:"#FEF2F2", emoji:"🔴" },
        { id:"te4", name:"Ultra Edge T84 Köpek Bıçak Seti",            originalPrice:1299, salePrice:1099, discountPct:15, installments:3, color:"#F0FDF4", emoji:"✂️" },
      ]},
      { brand:"Oster", products:[
        { id:"te5", name:"A5 Classic 2 Hız Köpek Tıraş Makinesi",     originalPrice:4299, salePrice:3649, discountPct:15, installments:3, color:"#FFF7ED", emoji:"🐩" },
        { id:"te6", name:"Cryogen-X 10 Bıçak A5 Uyumlu",              originalPrice:1099, salePrice:929,  discountPct:15, installments:3, color:"#EDE9FE", emoji:"❄️" },
      ]},
      { brand:"Show Tech", products:[
        { id:"te7", name:"Vega Cordless Şarjlı Köpek Tıraş Makinesi", originalPrice:3499, salePrice:2979, discountPct:15, installments:3, color:"#FEF9C3", emoji:"🌟" },
        { id:"te8", name:"Ceramic Blade Set #10 #7F Köpek",            originalPrice:899,  salePrice:759,  discountPct:15, installments:3, color:"#F3F4F6", emoji:"💎" },
      ]},
      { brand:"Artero", products:[
        { id:"te9",  name:"Next Generation Köpek Tıraş Makinesi",      originalPrice:2999, salePrice:2549, discountPct:15, installments:3, color:"#DBEAFE", emoji:"🚀" },
        { id:"te10", name:"Blade Cooling Spray Bıçak Soğutucu 500ml", originalPrice:599,  salePrice:499,  discountPct:15, installments:3, color:"#F0FDF4", emoji:"🧴" },
      ]},
      { brand:"Heiniger", products:[
        { id:"te11", name:"Saphir Style Şarjlı Köpek Tıraş Makinesi", originalPrice:6999, salePrice:5949, discountPct:15, installments:3, color:"#EDE9FE", emoji:"💜" },
        { id:"te12", name:"Ceramic #10 Blade Köpek Tıraş Bıçağı",      originalPrice:1499, salePrice:1269, discountPct:15, installments:3, color:"#FEF9C3", emoji:"⚙️" },
      ]},
    ],
  };

  return data[slug] || data["tuvalet"];
}

/* ── Helper: format price ── */
function fmtPrice(n: number) {
  return n.toLocaleString("tr-TR") + " TL";
}

/* ── Toast ── */
function Toast({ message, visible }: { message:string; visible:boolean }) {
  return (
    <div style={{ position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",zIndex:999,
      pointerEvents:"none",opacity:visible?1:0,transition:"opacity 0.3s ease" }}>
      <div style={{ background:FBG,color:"#fff",padding:"12px 24px",borderRadius:999,
        fontSize:14,fontWeight:500,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.25)" }}>
        {message}
      </div>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ product, brand }: { product: Product; brand: string }) {
  const [fav, setFav] = useState(false);
  const [, navigate] = useLocation();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ background:"#fff", border:"1px solid #F3F4F6", borderRadius:12,
      overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", display:"flex",
      flexDirection:"column", position:"relative" }}>

      {/* Discount badge */}
      <div style={{ position:"absolute", top:8, left:8, zIndex:2,
        background:"#DC2626", color:"#fff", fontSize:10, fontWeight:700,
        padding:"2px 6px", borderRadius:6 }}>
        %{product.discountPct} İndirim
      </div>

      {/* Favorite */}
      <button
        onClick={() => setFav(f => !f)}
        aria-label="Favorilere ekle"
        style={{ position:"absolute", top:6, right:6, zIndex:2, background:"#fff",
          border:"none", borderRadius:"50%", width:28, height:28, display:"flex",
          alignItems:"center", justifyContent:"center", cursor:"pointer",
          boxShadow:"0 1px 4px rgba(0,0,0,0.12)" }}>
        <Heart size={14} fill={fav?"#DC2626":"none"} color={fav?"#DC2626":"#9CA3AF"} />
      </button>

      {/* Image placeholder */}
      <div style={{ background:product.color, height:110, display:"flex",
        alignItems:"center", justifyContent:"center", fontSize:36 }}>
        {product.emoji}
      </div>

      {/* Info */}
      <div style={{ padding:"8px 8px 10px", flex:1, display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:10, color:"#6B7280", marginBottom:2 }}>
          Marka: <span style={{ color:"#4A2ED1", fontWeight:600 }}>{brand}</span>
        </div>
        <div style={{ fontSize:11, fontWeight:600, color:"#111827", lineHeight:1.35,
          flex:1, marginBottom:6, display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {product.name}
        </div>
        <div style={{ fontSize:11, color:"#9CA3AF", textDecoration:"line-through", marginBottom:1 }}>
          {fmtPrice(product.originalPrice)}
        </div>
        <div style={{ fontSize:17, fontWeight:700, color:"#3B59FF", marginBottom:1 }}>
          {fmtPrice(product.salePrice)}
        </div>
        <div style={{ fontSize:10, color:"#6B7280", marginBottom:8 }}>
          {product.installments} Taksit
        </div>

        {/* Sepete Ekle */}
        <button
          onClick={handleAdd}
          style={{ width:"100%", background: added ? "#16A34A" : "#4A2ED1",
            color:"#fff", border:"none", borderRadius:8, padding:"7px 0",
            fontSize:12, fontWeight:600, cursor:"pointer", transition:"background 0.2s",
            fontFamily:"inherit" }}>
          {added ? "✓ Eklendi" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}

/* ── Brand Section ── */
function BrandSection({ group }: { group: BrandGroup }) {
  return (
    <div style={{ marginBottom:24 }}>
      {/* Brand header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:10 }}>
        <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{group.brand}</span>
        <span style={{ fontSize:12, color:"#4A2ED1", fontWeight:500, cursor:"pointer" }}>
          Tümünü Gör
        </span>
      </div>
      {/* 2-col grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {group.products.map(p => (
          <ProductCard key={p.id} product={p} brand={group.brand} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Page ── */
interface YPKategoriPageProps { routeSlug?: string; }

export default function YPKategoriPage({ routeSlug }: YPKategoriPageProps) {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomer();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartCount,  setCartCount]  = useState(0);
  const [toast,      setToast]      = useState({ message:"", visible:false });
  const [showAll,    setShowAll]    = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  const slug = routeSlug || "tuvalet";
  const meta = CAT_META[slug] || CAT_META["tuvalet"];
  const allGroups = getProductsForCategory(slug);
  const visibleGroups = showAll ? allGroups : allGroups.slice(0, 4);

  useEffect(() => { document.title = `${meta.title} | YourPoodle`; }, [meta.title]);

  useEffect(() => {
    const read = () => {
      try {
        const c = JSON.parse(localStorage.getItem("yp_cart_items") || "[]");
        setCartCount(Array.isArray(c) ? c.reduce((s: number, i: any) => s + (i.qty || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    window.addEventListener("storage", read);
    const t = setInterval(read, 500);
    return () => { window.removeEventListener("storage", read); clearInterval(t); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const go = (href: string) => { navigate(href); setDrawerOpen(false); };

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message: msg, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  const TOP_TABS = [
    { key:"magaza", label:"Mağaza",     Icon:ShoppingBag,        href:"/yourpoodle/magaza" },
    { key:"club",   label:"Club",       Icon:PawPrint,            href:"/yourpoodle/topluluk" },
    { key:"ai",     label:"AI Asistan", Icon:MessageCirclePlus,   href:"/yourpoodle/ai-asistan" },
    { key:"rehber", label:"Rehber",     Icon:BookOpen,            href:"/yourpoodle/rehber" },
  ];

  const BOT_TABS = [
    { key:"anasayfa", label:"Ana Sayfa", Icon:HomeIcon,    href:"/yourpoodle" },
    { key:"club",     label:"Club",      Icon:Users,        href:"/yourpoodle/topluluk" },
    { key:"magaza",   label:"Mağaza",    Icon:ShoppingBag,  href:"/yourpoodle/magaza" },
    { key:"ai",       label:"AI",        Icon:Bot,          href:"/yourpoodle/ai-asistan" },
  ];

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,sans-serif", background:"#F9FAFB",
      minHeight:"100vh", color:"#111827", maxWidth:480, margin:"0 auto" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; }
      `}</style>

      <Toast message={toast.message} visible={toast.visible} />

      {/* ── Drawer overlay ── */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:500 }} />
      )}
      <div style={{ position:"fixed",top:0,left:0,height:"100%",width:288,background:"#fff",
        zIndex:501,transform:drawerOpen?"translateX(0)":"translateX(-100%)",
        transition:"transform 0.25s ease",boxShadow:"4px 0 24px rgba(0,0,0,0.18)",
        display:"flex",flexDirection:"column" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"20px 16px 14px",borderBottom:`1px solid ${GB}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
              style={{ width:32,height:32,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:16,color:P }}>YourPoodle</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Kapat"
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",
              alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44 }}>
            <X size={20} color="#374151" />
          </button>
        </div>
        <div style={{ flex:1,overflowY:"auto" }}>
          {[
            { label:"Mağaza",     href:"/yourpoodle/magaza" },
            { label:"Club",       href:"/yourpoodle/topluluk" },
            { label:"AI Asistan", href:"/yourpoodle/ai-asistan" },
            { label:"Rehber",     href:"/yourpoodle/rehber" },
          ].map(l => (
            <button key={l.href} onClick={() => go(l.href)}
              style={{ display:"block",width:"100%",padding:"14px 20px",fontSize:15,
                fontWeight:500,color:"#1F2937",background:"none",border:"none",
                borderBottom:`1px solid ${GB}`,cursor:"pointer",textAlign:"left",
                fontFamily:"inherit",minHeight:44 }}>
              {l.label}
            </button>
          ))}
        </div>
        <div style={{ padding:16,borderTop:`1px solid ${GB}`,display:"flex",
          flexDirection:"column",gap:8 }}>
          <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
            style={{ width:"100%",padding:"10px 0",fontSize:14,fontWeight:500,
              color:"#374151",background:"none",border:"none",cursor:"pointer",
              fontFamily:"inherit",textAlign:"center" }}>
            {isLoggedIn ? "Hesabım" : "Giriş Yap"}
          </button>
          <button onClick={() => go("/yourpoodle/giris")}
            style={{ width:"100%",padding:"12px 0",background:P,color:"#fff",
              border:"none",borderRadius:999,fontSize:14,fontWeight:600,
              cursor:"pointer",fontFamily:"inherit" }}>
            Üye Ol
          </button>
        </div>
      </div>

      {/* ── Sticky Header ── */}
      <header style={{ position:"sticky",top:0,zIndex:400,background:"#fff" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          height:56,padding:"0 16px",borderBottom:`1px solid ${GB}` }}>
          <button aria-label="Menü" onClick={() => setDrawerOpen(true)}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",
              alignItems:"center",justifyContent:"center",minWidth:44,minHeight:44,padding:0 }}>
            <Menu size={22} color="#374151" />
          </button>
          <button onClick={() => go("/yourpoodle")} aria-label="Ana sayfa"
            style={{ display:"flex",alignItems:"center",gap:8,background:"none",
              border:"none",cursor:"pointer",padding:0 }}>
            <img src="/images/yp-poodle-hero.png" alt="YourPoodle"
              style={{ width:40,height:40,borderRadius:"50%",objectFit:"cover" }} />
            <span style={{ fontWeight:700,fontSize:18,color:P }}>YourPoodle</span>
          </button>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={() => go(isLoggedIn ? "/hesabim" : "/yourpoodle/giris")}
              style={{ background:"none",border:"none",cursor:"pointer",fontSize:13,
                color:"#374151",fontFamily:"inherit",whiteSpace:"nowrap" }}>
              {isLoggedIn ? "Hesabım" : "Giriş Yap"}
            </button>
            <button onClick={() => go("/yourpoodle/giris")}
              style={{ background:`linear-gradient(135deg,${P} 0%,#4F46E5 100%)`,
                color:"#fff",fontSize:13,fontWeight:500,padding:"6px 16px",
                borderRadius:999,border:"none",cursor:"pointer",
                whiteSpace:"nowrap",fontFamily:"inherit" }}>
              Üye Ol
            </button>
          </div>
        </div>

        {/* Top Tab Nav */}
        <div style={{ display:"flex",borderBottom:`1px solid ${GB}`,background:"#fff" }}>
          {TOP_TABS.map(({ key, label, Icon, href }) => {
            const active = key === "magaza";
            return (
              <button key={key} onClick={() => go(href)}
                style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",
                  gap:4,padding:"10px 0",border:"none",background:"none",cursor:"pointer",
                  fontFamily:"inherit",borderBottom:active?`2px solid ${P}`:"2px solid transparent",
                  color:active?P:"#9CA3AF",fontWeight:active?600:500,transition:"color 0.15s" }}>
                <Icon size={20} />
                <span style={{ fontSize:11 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Page body ── */}
      <div style={{ background:"#fff", borderBottom:`1px solid ${GB}`, padding:"12px 16px 14px" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
          <button onClick={() => go("/yourpoodle/magaza")}
            style={{ background:"none",border:"none",cursor:"pointer",display:"flex",
              alignItems:"center",gap:4,padding:0,color:"#4A2ED1",fontSize:13,fontWeight:500,fontFamily:"inherit" }}>
            ← Mağaza
          </button>
          <ChevronRight size={14} color="#9CA3AF" />
          <span style={{ fontSize:13,color:"#6B7280",fontWeight:400 }}>{meta.title}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize:22,fontWeight:700,color:"#111827",margin:"0 0 3px" }}>
          {meta.title}
        </h1>
        <p style={{ fontSize:13,color:"#6B7280",margin:"0 0 14px" }}>
          {meta.count} ürün bulundu
        </p>

        {/* Installment banner */}
        <div style={{ display:"flex",alignItems:"center",gap:10,background:"#F0F4FF",
          border:"1px solid #DDD6FE",borderRadius:10,padding:"10px 14px" }}>
          <CreditCard size={18} color="#4A2ED1" />
          <span style={{ fontSize:13,fontWeight:600,color:"#1F2937" }}>Peşin fiyatına 3 taksit</span>
        </div>
      </div>

      {/* ── Product sections ── */}
      <div style={{ padding:"16px 12px 24px" }}>
        {visibleGroups.map(group => (
          <BrandSection key={group.brand} group={group} />
        ))}

        {/* Show more button */}
        {!showAll && allGroups.length > 4 && (
          <button
            onClick={() => setShowAll(true)}
            style={{ width:"100%", background:"#fff", border:"2px solid #4A2ED1",
              borderRadius:12, color:"#4A2ED1", fontSize:14, fontWeight:600,
              padding:"13px 0", cursor:"pointer", fontFamily:"inherit",
              transition:"background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F3EEFF"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
            Daha Fazla Ürün Göster
          </button>
        )}
      </div>

      {/* ── Fixed Bottom Nav ── */}
      <nav style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:480,background:"#fff",borderTop:`1px solid ${GB}`,
        boxShadow:"0 -4px 16px rgba(0,0,0,0.08)",display:"flex",alignItems:"flex-end",
        height:64,zIndex:900,paddingBottom:4 }}>

        {BOT_TABS.slice(0, 2).map(({ key, label, Icon, href }) => (
          <button key={key} onClick={() => go(href)}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"flex-end",gap:3,paddingBottom:8,border:"none",
              background:"none",cursor:"pointer",fontFamily:"inherit",color:"#9CA3AF" }}>
            <Icon size={22} strokeWidth={1.5} />
            <span style={{ fontSize:10,fontWeight:500,letterSpacing:0.2,
              borderBottom:"2px solid transparent",paddingBottom:1,lineHeight:1.2 }}>
              {label}
            </span>
          </button>
        ))}

        {/* Center — Sepetim */}
        <button onClick={() => go("/yourpoodle/sepet")}
          style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"flex-end",gap:3,paddingBottom:8,border:"none",
            background:"none",cursor:"pointer",fontFamily:"inherit",
            position:"relative",color:"#111827" }}>
          <div style={{ position:"absolute",bottom:28,width:56,height:56,borderRadius:"50%",
            background:P,boxShadow:`0 0 0 6px rgba(98,0,238,0.15),0 4px 16px rgba(98,0,238,0.35)`,
            display:"flex",alignItems:"center",justifyContent:"center" }}>
            <ShoppingCart size={26} color="#fff" strokeWidth={2} />
            {cartCount > 0 && (
              <span style={{ position:"absolute",top:4,right:4,background:"#EF4444",
                color:"#fff",fontSize:9,fontWeight:800,width:16,height:16,borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff" }}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </div>
          <span style={{ fontSize:10,fontWeight:700,letterSpacing:0.2,marginTop:2 }}>Sepetim</span>
        </button>

        {BOT_TABS.slice(2).map(({ key, label, Icon, href }) => (
          <button key={key} onClick={() => go(href)}
            style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"flex-end",gap:3,paddingBottom:8,border:"none",
              background:"none",cursor:"pointer",fontFamily:"inherit",color:"#9CA3AF" }}>
            <Icon size={22} strokeWidth={1.5} />
            <span style={{ fontSize:10,fontWeight:500,letterSpacing:0.2,
              borderBottom:"2px solid transparent",paddingBottom:1,lineHeight:1.2 }}>
              {label}
            </span>
          </button>
        ))}
      </nav>

    </div>
  );
}
