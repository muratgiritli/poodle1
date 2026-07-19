import { lazy, Suspense, Component, type ReactNode, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { CustomerProvider } from "@/contexts/CustomerContext";
import BottomTabBar from "@/components/BottomTabBar";
import FloatingCartBar from "@/components/FloatingCartBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialProofToast from "@/components/SocialProofToast";
import { CURRENT_STORE } from "@/lib/store";
const Landing = lazy(() => import("@/pages/landing"));
const AdLanding = lazy(() => import("@/pages/ad-landing"));

function Redirect({ to }: { to: string }) {
  const [, nav] = useLocation();
  useEffect(() => { nav(to, { replace: true }); }, [to]);
  return null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; errorMsg: string }> {
  state = { hasError: false, errorMsg: "" };
  static getDerivedStateFromError(error: Error) { return { hasError: true, errorMsg: error?.message || "" }; }
  componentDidCatch(error: Error) { console.error("ErrorBoundary caught:", error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Bir hata oluştu</h2>
          <p className="text-gray-500 mb-4 text-sm">Sayfa yüklenirken bir sorun oluştu.</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }} className="px-4 py-2 bg-[#6B3480] text-white rounded-lg font-medium text-sm" data-testid="btn-error-home">Ana Sayfaya Dön</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const importCheckout = () => import("@/pages/checkout");
const importCategory = () => import("@/pages/category");
const importCategoriesOverview = () => import("@/pages/categories-overview");
const importBrands = () => import("@/pages/brands");
const importBrandProducts = () => import("@/pages/brand-products");

const Checkout = lazy(importCheckout);
const CategoryPage = lazy(importCategory);
const CategoriesOverview = lazy(importCategoriesOverview);
const BrandsPage = lazy(importBrands);
const BrandProductsPage = lazy(importBrandProducts);
const AdminPage = lazy(() => import("@/pages/admin"));
const ProductDetailPage = lazy(() => import("@/pages/product-detail"));
const ProductDetailDemoPage = lazy(() => import("@/pages/product-detail-demo"));
const AcikMamaPage = lazy(() => import("@/pages/acik-mama"));
const VeterinerSubPage = lazy(() => import("@/pages/veteriner-sub"));
const OrderTrackingPage = lazy(() => import("@/pages/order-tracking"));
const FavoritesPage = lazy(() => import("@/pages/favorites"));
const AuthPage = lazy(() => import("@/pages/auth"));
const SokakCanlariPage = lazy(() => import("@/pages/sokak-canlari"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const AbonePage = lazy(() => import("@/pages/abone"));
const NotFound = lazy(() => import("@/pages/not-found"));
const CampaignPage = lazy(() => import("@/pages/campaign"));
const CampaignDemoPage = lazy(() => import("@/pages/campaign-demo"));
const CampaignProductDemoPage = lazy(() => import("@/pages/campaign-product-demo"));
const PetContestPage = lazy(() => import("@/pages/pet-contest"));
const PetDashboardPage = lazy(() => import("@/pages/pet-dashboard"));
const LostFoundPage = lazy(() => import("@/pages/lost-found"));
const PatiBlogPage = lazy(() => import("@/pages/pati-blog"));
const PaymentResultPage = lazy(() => import("@/pages/payment-result"));

const SSSPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.SSSPage })));
const KVKKPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.KVKKPage })));
const GizlilikPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.GizlilikPage })));
const KullanimKosullariPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.KullanimKosullariPage })));
const CerezPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.CerezPage })));
const IslemRehberiPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.IslemRehberiPage })));
const HakkimizdaPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.HakkimizdaPage })));
const IletisimPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.IletisimPage })));
const TeslimatIadePage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.TeslimatIadePage })));
const GizlilikSozlesmesiPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.GizlilikSozlesmesiPage })));
const MesafeliSatisSozlesmesiPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.MesafeliSatisSozlesmesiPage })));
const MagazaPage = lazy(() => import("@/pages/static-pages").then(m => ({ default: m.MagazaPage })));
const DemoLanding = lazy(() => import("@/pages/demo-landing"));
const Demo1Page = lazy(() => import("@/pages/demo1"));
const Demo2Page = lazy(() => import("@/pages/demo2"));
const DemoAnasayfaPage = lazy(() => import("@/pages/demo-anasayfa"));
const YourPoodleHomePage  = lazy(() => import("@/pages/yourpoodle-home"));
const YPRehberPage        = lazy(() => import("@/pages/yp-rehber"));
const YPClubPage          = lazy(() => import("@/pages/yp-club"));
const YPClubHakkimizdaPage= lazy(() => import("@/pages/yp-club-hakkimizda"));
const YPBilgiPage         = lazy(() => import("@/pages/yp-bilgi"));
const YPMagazaPage        = lazy(() => import("@/pages/yp-magaza"));
const YPGirisPage         = lazy(() => import("@/pages/yp-giris"));
const YPToplulukPage      = lazy(() => import("@/pages/yp-topluluk"));
const YPMamaPage          = lazy(() => import("@/pages/yp-mama"));
const YPEgitimPage        = lazy(() => import("@/pages/yp-egitim"));
const YPSaglikPage        = lazy(() => import("@/pages/yp-saglik"));
const YPBakimPage         = lazy(() => import("@/pages/yp-bakim"));
const YPBildirimlerPage   = lazy(() => import("@/pages/yp-bildirimler"));
const YPEtkinliklerPage   = lazy(() => import("@/pages/yp-etkinlikler"));
const YPAiAsistanPage     = lazy(() => import("@/pages/yp-ai-asistan"));
const YPMamaBulPage       = lazy(() => import("@/pages/yp-mama-bul"));
const YPHakkindaPage            = lazy(() => import("@/pages/yp-hakkinda"));
const YPKullanimSartlariPage    = lazy(() => import("@/pages/yp-kullanim-sartlari"));
const YPGizlilikPolitikasiPage  = lazy(() => import("@/pages/yp-gizlilik-politikasi"));
const YPSSSPage                 = lazy(() => import("@/pages/yp-sss"));
const YPKargoPage               = lazy(() => import("@/pages/yp-kargo"));
const YPUluslararasiKargoPage   = lazy(() => import("@/pages/yp-uluslararasi-kargo"));
const YPIadePage                = lazy(() => import("@/pages/yp-iade"));
const YPGuvenliAlisverisPage    = lazy(() => import("@/pages/yp-guvenli-alisveris"));
const YPMesafeliSatisPage       = lazy(() => import("@/pages/yp-mesafeli-satis"));
const YPCerezPolitikasiPage     = lazy(() => import("@/pages/yp-cerez-politikasi"));
const YPKariyerPage             = lazy(() => import("@/pages/yp-kariyer"));
const YPBayiBasvurusuPage       = lazy(() => import("@/pages/yp-bayi-basvurusu"));
const YPFotografYarismasi       = lazy(() => import("@/pages/yp-fotograf-yarismasi"));
const YPOzelTasarimPage         = lazy(() => import("@/pages/yp-ozel-tasarim"));
const YPProfilPage        = lazy(() => import("@/pages/yp-profil"));
const YPSepetPage         = lazy(() => import("@/pages/yp-sepet"));
const YPDogCreatePage     = lazy(() => import("@/pages/yp-dog-create"));
const YPDogProfilePage    = lazy(() => import("@/pages/yp-dog-profile"));
const YPDogEditPage       = lazy(() => import("@/pages/yp-dog-edit"));
const YPClubKesfetPage    = lazy(() => import("@/pages/yp-club-kesfet"));
const YPClubKopeklerPage  = lazy(() => import("@/pages/yp-club-kopekler"));
const YPOdemePage         = lazy(() => import("@/pages/yp-odeme"));
const YPTesekkurlerPage   = lazy(() => import("@/pages/yp-tesekkurler"));
const YPSiparislerimPage  = lazy(() => import("@/pages/yp-siparislerim"));
const YPGecmisOnerilerPage = lazy(() => import("@/pages/yp-gecmis-oneriler"));
const DemoKampanyaPage = lazy(() => import("@/pages/demo-kampanya"));
const DemoKampanyaUrunPage = lazy(() => import("@/pages/demo-kampanya").then(m => ({ default: m.DemoKampanyaUrun })));
const SeoPage = lazy(() => import("@/pages/seo-pages"));
const BlogListRoute = lazy(() => import("@/pages/blog").then(m => ({ default: m.BlogListRoute })));
const BlogPostRoute = lazy(() => import("@/pages/blog").then(m => ({ default: m.BlogPostRoute })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-[#6B3480] rounded-full animate-spin" />
    </div>
  );
}

function useVisitTracking() {
  const [location] = useLocation();
  useEffect(() => {
    try {
      if (/^\/admin/i.test(location)) return;
      let entryReferrer = sessionStorage.getItem("jg_entry_ref");
      let utmSource = sessionStorage.getItem("jg_utm_src");
      if (entryReferrer === null) {
        const params = new URLSearchParams(window.location.search);
        utmSource = params.get("utm_source") || "";
        entryReferrer = document.referrer || "";
        sessionStorage.setItem("jg_entry_ref", entryReferrer);
        sessionStorage.setItem("jg_utm_src", utmSource);
      }
      fetch("/api/track/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: location, referrer: entryReferrer, utmSource }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [location]);
}

function Router() {
  useVisitTracking();
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/">{() => <YourPoodleHomePage />}</Route>
        <Route path="/petshop">{() => <Landing />}</Route>
        <Route path="/en-yakin-petshop" component={AdLanding} />
        <Route path="/en-yakin-petshoplar" component={AdLanding} />
        <Route path="/kapida-odeme-petshop" component={AdLanding} />
        <Route path="/petshop-kapida-odeme" component={AdLanding} />
        <Route path="/getir-petshop" component={AdLanding} />
        <Route path="/kategori" component={CategoriesOverview} />
        <Route path="/acik-mama/:animal" component={AcikMamaPage} />
        <Route path="/veteriner/:subcategory" component={VeterinerSubPage} />
        <Route path="/urun/:id/:slug?" component={ProductDetailPage} />
        <Route path="/urun-demo/:id/:slug?" component={ProductDetailDemoPage} />
        <Route path="/siparis/:animal/:subcategory/:brand" component={BrandProductsPage} />
        <Route path="/kategori/:animal/:subcategory/:brand" component={BrandProductsPage} />
        <Route path="/kategori/:animal/:subcategory" component={BrandsPage} />
        <Route path="/kategori/:animal" component={CategoryPage} />
        <Route path="/odeme" component={Checkout} />
        <Route path="/odeme-sonuc" component={PaymentResultPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/siparis-takip" component={OrderTrackingPage} />
        <Route path="/favoriler" component={FavoritesPage} />
        <Route path="/giris" component={AuthPage} />
        <Route path="/sokak-canlari" component={SokakCanlariPage} />
        <Route path="/hesabim" component={ProfilePage} />
        <Route path="/abone" component={AbonePage} />
        {/* Task 6: Demo routes blocked in production — code kept, access disabled */}
        {import.meta.env.DEV && <Route path="/demo" component={DemoLanding} />}
        {import.meta.env.DEV && <Route path="/demo1" component={Demo1Page} />}
        {import.meta.env.DEV && <Route path="/demo2" component={Demo2Page} />}
        {import.meta.env.DEV && <Route path="/demo-anasayfa" component={DemoAnasayfaPage as any} />}
        <Route path="/yourpoodle"                component={YourPoodleHomePage} />
        <Route path="/yourpoodle/rehber/:slug">
          {(params) => <YPRehberPage routeSlug={params?.slug} />}
        </Route>
        <Route path="/yourpoodle/rehber"         component={YPRehberPage} />
        <Route path="/yourpoodle/club/hakkimizda" component={YPClubHakkimizdaPage} />
        <Route path="/yourpoodle/club/kesfet"    component={YPClubKesfetPage} />
        <Route path="/yourpoodle/club/kopekler"  component={YPClubKopeklerPage} />
        <Route path="/yourpoodle/club"           component={YPClubPage} />
        <Route path="/yourpoodle/p/olustur"      component={YPDogCreatePage} />
        <Route path="/yourpoodle/p/:slug/duzenle">
          {(params) => <YPDogEditPage routeSlug={params?.slug} />}
        </Route>
        <Route path="/yourpoodle/p/:slug">
          {(params) => <YPDogProfilePage routeSlug={params?.slug} />}
        </Route>
        <Route path="/yourpoodle/bilgi"          component={YPBilgiPage} />
        <Route path="/yourpoodle/magaza"         component={YPMagazaPage} />
        <Route path="/yourpoodle/giris"          component={YPGirisPage} />
        <Route path="/yourpoodle/topluluk"       component={YPToplulukPage} />
        <Route path="/yourpoodle/mama"           component={YPMamaPage} />
        <Route path="/yourpoodle/egitim"       component={YPEgitimPage} />
        <Route path="/yourpoodle/saglik"       component={YPSaglikPage} />
        <Route path="/yourpoodle/bakim"        component={YPBakimPage} />
        <Route path="/yourpoodle/bildirimler"  component={YPBildirimlerPage} />
        <Route path="/yourpoodle/etkinlikler"    component={YPEtkinliklerPage} />
        <Route path="/yourpoodle/ai-asistan"     component={YPAiAsistanPage} />
        <Route path="/yourpoodle/mama-bul"       component={YPMamaBulPage} />
        <Route path="/yourpoodle/hakkinda"              component={YPHakkindaPage} />
        <Route path="/yourpoodle/profil"               component={YPProfilPage} />
        <Route path="/yourpoodle/sepet"                component={YPSepetPage} />
        <Route path="/yourpoodle/odeme"               component={YPOdemePage} />
        <Route path="/yourpoodle/tesekkurler"         component={YPTesekkurlerPage} />
        <Route path="/yourpoodle/siparislerim"        component={YPSiparislerimPage} />
        <Route path="/yourpoodle/gecmis-oneriler"     component={YPGecmisOnerilerPage} />
        <Route path="/yourpoodle/kullanim-sartlari"    component={YPKullanimSartlariPage} />
        <Route path="/yourpoodle/gizlilik-politikasi"  component={YPGizlilikPolitikasiPage} />
        <Route path="/yourpoodle/sss"                  component={YPSSSPage} />
        <Route path="/yourpoodle/kargo"                component={YPKargoPage} />
        <Route path="/yourpoodle/uluslararasi-kargo"   component={YPUluslararasiKargoPage} />
        <Route path="/yourpoodle/iade"                 component={YPIadePage} />
        <Route path="/yourpoodle/guvenli-alisveris"    component={YPGuvenliAlisverisPage} />
        <Route path="/yourpoodle/mesafeli-satis"       component={YPMesafeliSatisPage} />
        <Route path="/yourpoodle/cerez-politikasi"     component={YPCerezPolitikasiPage} />
        <Route path="/yourpoodle/kariyer"              component={YPKariyerPage} />
        <Route path="/yourpoodle/bayi-basvurusu"       component={YPBayiBasvurusuPage} />
        <Route path="/yourpoodle/fotograf-yarismasi"   component={YPFotografYarismasi} />
        <Route path="/yourpoodle/ozel-tasarim"         component={YPOzelTasarimPage} />
        <Route path="/yourpoodle/ayarlar"          component={lazy(() => import("@/pages/yp-ayarlar"))} />
        <Route path="/yourpoodle/urun/:id/:slug?" component={lazy(() => import("@/pages/yp-urun"))} />
        {import.meta.env.DEV && <Route path="/demo-kampanya" component={DemoKampanyaPage} />}
        {import.meta.env.DEV && <Route path="/demo-kampanya/urun/:id" component={DemoKampanyaUrunPage} />}
        <Route path="/kampanya" component={CampaignPage} />
        {import.meta.env.DEV && <Route path="/kampanya-demo" component={CampaignDemoPage} />}
        {import.meta.env.DEV && <Route path="/kampanya-urun-demo" component={CampaignProductDemoPage} />}
        <Route path="/yarisma" component={PetContestPage} />
        <Route path="/ozel-patiler" component={PetDashboardPage} />
        <Route path="/kayip-ilan" component={LostFoundPage} />
        <Route path="/pati-blog" component={PatiBlogPage} />
        <Route path="/blog/:slug" component={BlogPostRoute} />
        <Route path="/blog" component={BlogListRoute} />
        <Route path="/sss" component={SSSPage} />
        <Route path="/kvkk" component={KVKKPage} />
        <Route path="/gizlilik" component={GizlilikPage} />
        <Route path="/kullanim-kosullari" component={KullanimKosullariPage} />
        <Route path="/cerez-politikasi" component={CerezPage} />
        <Route path="/islem-rehberi" component={IslemRehberiPage} />
        <Route path="/hakkimizda" component={HakkimizdaPage} />
        <Route path="/iletisim" component={IletisimPage} />
        <Route path="/magaza" component={MagazaPage} />
        <Route path="/teslimat-iade" component={TeslimatIadePage} />
        <Route path="/gizlilik-sozlesmesi" component={GizlilikSozlesmesiPage} />
        <Route path="/mesafeli-satis" component={MesafeliSatisSozlesmesiPage} />
        <Route path="/:slug" component={SeoPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

const LANDING_LIKE_ROUTES = new Set([
  "/",
  "/petshop",
  "/en-yakin-petshop",
  "/en-yakin-petshoplar",
  "/kapida-odeme-petshop",
  "/petshop-kapida-odeme",
  "/getir-petshop",
]);

const YPCookieBanner = lazy(() => import("@/components/YPCookieBanner").then(m => ({ default: m.default })));

function AppShell() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  const isDemo = location === "/" || location === "/demo" || location.startsWith("/demo-kampanya") || location === "/demo1" || location === "/demo2" || location === "/demo-anasayfa" || location.startsWith("/yourpoodle");
  const isYP = location === "/" || location.startsWith("/yourpoodle");
  const isLandingLike = LANDING_LIKE_ROUTES.has(location);

  useEffect(() => {
    if (isLandingLike) {
      const t = setTimeout(() => {
        importCategory();
        importBrands();
        importBrandProducts();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [location, isLandingLike]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return (
    <>
      {!isAdmin && !isDemo && (
        <div className={isLandingLike ? "md:hidden" : ""}>
          <Header />
        </div>
      )}
      <ErrorBoundary><Router /></ErrorBoundary>
      {!isAdmin && !isDemo && isLandingLike && (
        <div className={CURRENT_STORE.id === "jetgo" ? "" : "md:hidden"}><Footer /></div>
      )}
      {!isAdmin && !isDemo && <FloatingCartBar />}
      {!isAdmin && !isDemo && <BottomTabBar />}
      {isYP && <Suspense fallback={null}><YPCookieBanner /></Suspense>}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomerProvider>
          <CartProvider>
            <Toaster />
            <AppShell />
          </CartProvider>
        </CustomerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
