import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

/** Legacy marka URL — redirect to kuru mama with brand filter when slug present. */
export default function YPMarkaSayfasiPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug ?? "";

  useEffect(() => {
    const target = slug
      ? `${BASE}/kuru-mama?marka=${encodeURIComponent(slug)}`
      : `${BASE}/magaza`;
    navigate(target, { replace: true });
  }, [slug, navigate]);

  return null;
}
