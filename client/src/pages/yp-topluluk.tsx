// Topluluk → Club redirect (Seçenek A: tek topluluk merkezi = /club)
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Topluluk() {
  const [, navigate] = useLocation();
  useEffect(() => {
    // 301-style client redirect — Club is the single community hub
    navigate("/yourpoodle/club?tab=akis", { replace: true });
  }, []);
  return null;
}
