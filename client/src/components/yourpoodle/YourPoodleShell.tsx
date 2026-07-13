import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, ShoppingCart, Menu, Home, Users, ShoppingBag, User,
} from "lucide-react";

interface Props {
  children: ReactNode;
  activeTab?: "home" | "guide" | "knowledge" | "shop";
}

export default function YourPoodleShell({ children, activeTab = "home" }: Props) {
  const [location] = useLocation();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `.yp-no-scrollbar::-webkit-scrollbar{display:none}.yp-no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`;
    document.head.appendChild(style);
    return () => {
      try { document.head.removeChild(link); } catch {}
      try { document.head.removeChild(style); } catch {}
    };
  }, []);

  const tab = (id: "home" | "guide" | "knowledge" | "shop", label: string, href: string) => {
    const active = activeTab === id;
    return (
      <Link href={href}>
        <div className={`px-4 py-3.5 text-sm font-extrabold cursor-pointer whitespace-nowrap ${active ? "text-purple-600 border-b-[3px] border-purple-600" : "text-gray-500"}`}>
          {label}
        </div>
      </Link>
    );
  };

  const navItem = (id: "home" | "guide" | "knowledge" | "shop", icon: ReactNode, label: string, href: string) => {
    const active = activeTab === id;
    return (
      <Link href={href}>
        <div className={`flex flex-col items-center justify-center w-16 cursor-pointer ${active ? "text-purple-600" : "text-gray-400"}`}>
          {icon}
          <span className="text-[10px] font-bold mt-1">{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center" style={{ background: "#FAF7FF", fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-full max-w-[430px] min-h-screen relative pb-28 shadow-2xl" style={{ background: "#FAF7FF" }}>

        {/* STICKY HEADER */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100">
            <Link href="/yourpoodle">
              <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl font-bold text-gray-900 cursor-pointer">YourPoodle</span>
            </Link>
            <div className="flex items-center gap-3 text-gray-700">
              <Search size={20} />
              <ShoppingCart size={20} />
              <span className="text-sm font-bold">🇬🇧 EN</span>
              <Menu size={24} />
            </div>
          </div>
          <div className="flex px-4 overflow-x-auto yp-no-scrollbar border-b border-gray-100">
            {tab("home",      "Home",           "/yourpoodle")}
            {tab("guide",     "Guide",          "/yourpoodle/rehber")}
            {tab("knowledge", "Knowledge Base", "/yourpoodle/bilgi")}
            {tab("shop",      "Shop",           "/yourpoodle")}
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}

        {/* FIXED BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-50">
          <div className="flex justify-around items-center h-20 px-2 pb-2">
            {navItem("home", <Home className="h-[22px] w-[22px]" strokeWidth={2.5} />, "Home", "/yourpoodle")}
            {navItem("guide", <Users className="h-[22px] w-[22px]" strokeWidth={2.5} />, "Club", "/yourpoodle/rehber")}
            <Link href="/yourpoodle">
              <div className="flex flex-col items-center justify-center w-16 -mt-8 cursor-pointer">
                <div className="bg-purple-600 text-white p-4 rounded-full shadow-[0_8px_20px_rgba(124,58,237,0.4)]">
                  <ShoppingCart className="h-6 w-6" strokeWidth={2.5} />
                </div>
              </div>
            </Link>
            {navItem("shop", <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={2.5} />, "Shop", "/yourpoodle")}
            <div className="flex flex-col items-center justify-center w-16 text-gray-400 cursor-pointer">
              <User className="h-[22px] w-[22px]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold mt-1">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
