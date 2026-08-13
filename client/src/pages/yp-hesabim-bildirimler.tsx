// Route: /hesabim/bildirimler — redirect to main notifications page
import { useEffect } from "react";
import { useLocation } from "wouter";
import { IS_YP } from "@/lib/store";

export default function YPHesabimBildirimlerPage() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(IS_YP ? "/bildirimler" : "/yourpoodle/bildirimler");
  }, [navigate]);
  return null;
}
