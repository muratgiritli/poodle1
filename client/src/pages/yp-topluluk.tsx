// Topluluk — Club gizli; ana sayfaya yönlendir
import { useEffect } from "react";
import { useLocation } from "wouter";
import { IS_YP } from "@/lib/store";

const HOME = IS_YP ? "/" : "/yourpoodle";

export default function Topluluk() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(HOME, { replace: true });
  }, [navigate]);
  return null;
}
