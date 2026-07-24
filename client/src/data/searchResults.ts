import { MOCK_ARTICLES } from "./articles";
import { MOCK_POSTS } from "./clubPosts";

export interface SearchProduct {
  id: number; name: string; price: number; originalPrice?: number;
  img: string; slug: string;
}

export const MOCK_SEARCH_PRODUCTS: SearchProduct[] = [
  { id: 2706, name: "Royal Canin Poodle Adult 3 Kg", price: 1500, originalPrice: 2000, img: "/api/product-image/2706", slug: "royal-canin-poodle-adult-3kg" },
  { id: 2709, name: "Reflex Plus Poodle Yetişkin 2 Kg", price: 800, originalPrice: 1000, img: "/api/product-image/2709", slug: "reflex-plus-poodle-2kg" },
  { id: 2710, name: "Trixie Toy Poodle Oyuncak Seti", price: 350, img: "/api/product-image/2710", slug: "trixie-oyuncak-seti" },
  { id: 2711, name: "Hill's Science Plan Mini Adult Küçük Irk 3 Kg", price: 1200, img: "/api/product-image/2711", slug: "hills-mini-adult-3kg" },
  { id: 2712, name: "Pedigree Dentastix Küçük Irk Diş Bakım Ödülü", price: 180, img: "/api/product-image/2712", slug: "pedigree-dentastix" },
  { id: 2713, name: "Catit Design Senses Oyun Matı", price: 290, img: "/api/product-image/2713", slug: "catit-oyun-mati" },
];

export const POPULAR_SEARCHES = ["Poodle maması", "Tuvalet eğitimi", "Royal Canin", "Toy Poodle oyuncak", "Poodle bakım"];

export function searchProducts(q: string): SearchProduct[] {
  if (!q) return MOCK_SEARCH_PRODUCTS;
  const lq = q.toLowerCase();
  return MOCK_SEARCH_PRODUCTS.filter(p => p.name.toLowerCase().includes(lq));
}

export function searchArticles(q: string) {
  if (!q) return MOCK_ARTICLES;
  const lq = q.toLowerCase();
  return MOCK_ARTICLES.filter(a => a.title.toLowerCase().includes(lq) || a.excerpt.toLowerCase().includes(lq));
}

export function searchPosts(q: string) {
  if (!q) return MOCK_POSTS;
  const lq = q.toLowerCase();
  return MOCK_POSTS.filter(p => p.caption.toLowerCase().includes(lq));
}
