import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";

/** Mock kategori page — redirect to real catalog route. */
export default function YPKategoriSayfasiPage() {
  const [, params] = useRoute("/magaza/kategori/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug ?? "";

  useEffect(() => {
    navigate(`/yourpoodle/kategori/${slug}`, { replace: true });
  }, [slug, navigate]);

  return null;
}
