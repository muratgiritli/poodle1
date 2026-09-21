import { useEffect } from "react";
import YPLayout from "@/components/yourpoodle/YPLayout";
import YPModernHome from "@/components/yourpoodle/YPModernHome";
import { IS_YP } from "@/lib/store";

const BASE = IS_YP ? "" : "/yourpoodle";

export default function YourPoodleHomePage() {
  useEffect(() => {
    document.title = "YourPoodle | Toy Poodle Bakım, Mama ve Eğitim";
    const description =
      "Toy Poodle sahipleri için mama önerileri, seçilmiş ürünler, bakım rehberleri ve AI asistan.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

  return (
    <YPLayout activeLink={BASE || "/"} constrain={false} showMobileFooter>
      <YPModernHome />
    </YPLayout>
  );
}
