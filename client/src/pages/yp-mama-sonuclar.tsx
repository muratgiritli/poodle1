import { useEffect } from "react";
import { useLocation } from "wouter";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

/** Legacy mama results URL — redirect to mama finder wizard. */
export default function YPMamaSonuclarPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate(`${BASE}/mama-bul`, { replace: true });
  }, [navigate]);

  return null;
}
