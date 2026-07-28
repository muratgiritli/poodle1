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
import { CURRENT_STORE, IS_YP } from "@/lib/store";
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
const YPHesabimPage = lazy(() => import("@/pages/yp-hesabim"));
const YPPoodleProfilDuzenlePage = lazy(() => import("@/pages/yp-poodle-profili-duzenle"));
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
const YourPoodleV2Page    = lazy(() => import("@/pages/yourpoodle-v2"));
const YourPoodleV3Page    = lazy(() => import("@/pages/yourpoodle-v3"));
const YourPoodleV4Page    = lazy(() => import("@/pages/yourpoodle-v4"));
const YourPoodleV5Page    = lazy(() => import("@/pages/yourpoodle-v5"));
const YourPoodleDemoPage  = lazy(() => import("@/pages/yourpoodle-demo"));
const YourPoodleDemo2Page = lazy(() => import("@/pages/yourpoodle-demo2"));
const YourPoodleDemo3Page = lazy(() => import("@/pages/yourpoodle-demo3"));
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
const YPKuruMamaPage      = lazy(() => import("@/pages/yp-kuru-mama"));
const YPMamaSonuclarPage  = lazy(() => import("@/pages/yp-mama-sonuclar"));
const YPMamaUrunPage      = lazy(() => import("@/pages/yp-mama-urun"));
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
const YPClubMesajlarPage  = lazy(() => import("@/pages/yp-club-mesajlar"));
const YPOdemePage         = lazy(() => import("@/pages/yp-odeme"));
const YPTesekkurlerPage   = lazy(() => import("@/pages/yp-tesekkurler"));
const YPSiparislerimPage  = lazy(() => import("@/pages/yp-siparislerim"));
const YPHesabimSiparislerimPage = lazy(() => import("@/pages/yp-hesabim-siparislerim"));
const YPHesabimFavorilerimPage  = lazy(() => import("@/pages/yp-hesabim-favorilerim"));
const YPHesabimAdreslerimPage         = lazy(() => import("@/pages/yp-hesabim-adreslerim"));
const YPHesabimClubPaylasimlarimPage  = lazy(() => import("@/pages/yp-hesabim-club-paylasimlarim"));
const YPHesabimBildirimlerPage        = lazy(() => import("@/pages/yp-hesabim-bildirimler"));
const YPHesabimAyarlarPage            = lazy(() => import("@/pages/yp-hesabim-ayarlar"));
const YPHesabimYardimPage             = lazy(() => import("@/pages/yp-hesabim-yardim"));
const YPYeniTalepPage                 = lazy(() => import("@/pages/yp-hesabim-yeni-talep"));
const YPTalepDetayPage                = lazy(() => import("@/pages/yp-hesabim-talep-detay"));
const YPDestekTalepleriPage           = lazy(() => import("@/pages/yp-hesabim-destek-talepleri"));
const YPDegerlendirPage               = lazy(() => import("@/pages/yp-hesabim-degerlendir"));
const YPPoodlePuanlariPage            = lazy(() => import("@/pages/yp-hesabim-poodle-puanlari"));
const YPOdulMerkeziPage               = lazy(() => import("@/pages/yp-hesabim-odul-merkezi"));
const YPOdulOnaylaPage                = lazy(() => import("@/pages/yp-hesabim-odul-onayla"));
const YPOdulHazirPage                 = lazy(() => import("@/pages/yp-hesabim-odul-hazir"));
const YPPuanKazanPage                 = lazy(() => import("@/pages/yp-hesabim-puan-kazan"));
const YPGecmisOnerilerPage = lazy(() => import("@/pages/yp-gecmis-oneriler"));
const YPKategoriPage       = lazy(() => import("@/pages/yp-kategori"));
const YPUyeOlPage          = lazy(() => import("@/pages/yp-uye-ol"));
// New pages — Phase 1-6
const YPSiparisOnayPage    = lazy(() => import("@/pages/yp-siparis-onay"));
const YPSiparisDetayPage   = lazy(() => import("@/pages/yp-siparis-detay"));
const YPSiparisTakipPage   = lazy(() => import("@/pages/yp-siparis-takip"));
const YPAraPage            = lazy(() => import("@/pages/yp-ara"));
const YPKategoriSayfasiPage= lazy(() => import("@/pages/yp-kategori-sayfasi"));
const YPMarkaSayfasiPage   = lazy(() => import("@/pages/yp-marka-sayfasi"));
const YPAtakumMagazaPage   = lazy(() => import("@/pages/yp-atakum-magaza"));
const YPRehberMakalePage   = lazy(() => import("@/pages/yp-rehber-makale"));
const YPAraclarPage        = lazy(() => import("@/pages/yp-araclar"));
const YPMamaHesaplamaPage  = lazy(() => import("@/pages/yp-mama-hesaplama"));
const YPYasHesaplamaPage   = lazy(() => import("@/pages/yp-yas-hesaplama"));
const YPTirasTakvimiPage   = lazy(() => import("@/pages/yp-tiras-takvimi"));
const YPGonderiDetayPage   = lazy(() => import("@/pages/yp-gonderi-detay"));
const YPEtkinliklerListePage = lazy(() => import("@/pages/yp-etkinlikler-liste"));
const YPEtkinlikDetayPage  = lazy(() => import("@/pages/yp-etkinlik-detay"));
const YPSifremiUnuttumPage = lazy(() => import("@/pages/yp-sifremi-unuttum"));
const YPSifreSifirlaPage   = lazy(() => import("@/pages/yp-sifre-sifirla"));
const YPLegalPage          = lazy(() => import("@/pages/yp-legal"));
const YPKampanyalarPage    = lazy(() => import("@/pages/yp-kampanyalar"));
const YPIletisimPage       = lazy(() => import("@/pages/yp-iletisim"));
const YPHakkimizdaPage     = lazy(() => import("@/pages/yp-hakkimizda"));
const YPHizmetlerPage      = lazy(() => import("@/pages/yp-hizmetler"));
const YPBenimPoodleimPage  = lazy(() => import("@/pages/yp-benim-poodleim"));
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
        <Route path="/giris" component={YPGirisPage} />
        <Route path="/sokak-canlari" component={SokakCanlariPage} />
        <Route path="/hesabim" component={YPHesabimPage} />
        <Route path="/hesabim/siparisler" component={YPHesabimSiparislerimPage} />
        <Route path="/hesabim/favoriler"  component={YPHesabimFavorilerimPage} />
        <Route path="/hesabim/adresler"              component={YPHesabimAdreslerimPage} />
        <Route path="/hesabim/club-paylasimlarim"   component={YPHesabimClubPaylasimlarimPage} />
        <Route path="/hesabim/bildirimler"          component={YPHesabimBildirimlerPage} />
        <Route path="/hesabim/ayarlar"              component={YPHesabimAyarlarPage} />
        <Route path="/hesabim/yardim"               component={YPHesabimYardimPage} />
        <Route path="/hesabim/yardim/yeni-talep"    component={YPYeniTalepPage} />
        <Route path="/hesabim/yardim/talep/:ticketId" component={YPTalepDetayPage} />
        <Route path="/hesabim/destek-talepleri"     component={YPDestekTalepleriPage} />
        <Route path="/hesabim/destek-talepleri/degerlendir/:ticketId" component={YPDegerlendirPage} />
        <Route path="/hesabim/poodle-puanlari"  component={YPPoodlePuanlariPage} />
        <Route path="/hesabim/poodle-puanlari/odul-merkezi" component={YPOdulMerkeziPage} />
        <Route path="/hesabim/poodle-puanlari/odul-onayla/:rewardId" component={YPOdulOnaylaPage} />
        <Route path="/hesabim/poodle-puanlari/odul-hazir/:rewardId" component={YPOdulHazirPage} />
        <Route path="/hesabim/poodle-puanlari/kazan" component={YPPuanKazanPage} />
        <Route path="/yourpoodle/poodle-profili-duzenle" component={YPPoodleProfilDuzenlePage} />
        <Route path="/abone" component={AbonePage} />
        {/* Task 6: Demo routes blocked in production — code kept, access disabled */}
        {import.meta.env.DEV && <Route path="/demo" component={DemoLanding} />}
        {import.meta.env.DEV && <Route path="/demo1" component={Demo1Page} />}
        {import.meta.env.DEV && <Route path="/demo2" component={Demo2Page} />}
        {import.meta.env.DEV && <Route path="/demo-anasayfa" component={DemoAnasayfaPage as any} />}
        <Route path="/yourpoodle/v2"             component={YourPoodleV2Page} />
        <Route path="/yourpoodle/v3"             component={YourPoodleV3Page} />
        <Route path="/yourpoodle/v4"             component={YourPoodleV4Page} />
        <Route path="/yourpoodle/v5"             component={YourPoodleV5Page} />
        <Route path="/yourpoodle/demo"           component={YourPoodleDemoPage} />
        <Route path="/yourpoodle/demo2"          component={YourPoodleDemo2Page} />
        <Route path="/yourpoodle/demo3"          component={YourPoodleDemo3Page} />
        <Route path="/yourpoodle"                component={YourPoodleHomePage} />
        <Route path="/yourpoodle/rehber/:category/:slug" component={YPRehberMakalePage} />
        <Route path="/yourpoodle/rehber/:slug">
          {(params) => <YPRehberPage routeSlug={params?.slug} />}
        </Route>
        <Route path="/yourpoodle/rehber"         component={YPRehberPage} />
        <Route path="/yourpoodle/club/hakkimizda" component={YPClubHakkimizdaPage} />
        <Route path="/yourpoodle/club/mesajlar"  component={YPClubMesajlarPage} />
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
        <Route path="/yourpoodle/ara"             component={YPAraPage} />
        <Route path="/yourpoodle/magaza"         component={YPMagazaPage} />
        <Route path="/yourpoodle/kategori/:slug">
          {(params) => <YPKategoriPage routeSlug={params?.slug} />}
        </Route>
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
        <Route path="/yourpoodle/kuru-mama"      component={YPKuruMamaPage} />
        <Route path="/yourpoodle/mama-sonuclar"  component={YPMamaSonuclarPage} />
        <Route path="/yourpoodle/mama-urun/:slug" component={YPMamaUrunPage} />
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
        <Route path="/yourpoodle/hizmetler"             component={YPHizmetlerPage} />
        <Route path="/yourpoodle/benim-poodleim"       component={YPBenimPoodleimPage} />
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
        {/* ─── Top-level canonical YP routes (yourpoodle.com) ─── */}
        {/* Order flow */}
        <Route path="/siparis/onay/:orderId" component={YPSiparisOnayPage} />
        <Route path="/hesabim/siparisler/:orderId" component={YPSiparisDetayPage} />
        <Route path="/siparis-takip" component={YPSiparisTakipPage} />
        {/* Search */}
        <Route path="/ara" component={YPAraPage} />
        {/* Catalog */}
        <Route path="/magaza/kategori/:slug" component={YPKategoriSayfasiPage} />
        <Route path="/magaza/marka/:slug"    component={YPMarkaSayfasiPage} />
        <Route path="/magaza"                component={YPMagazaPage} />
        {/* Club */}
        <Route path="/club/gonderi/:postId"  component={YPGonderiDetayPage} />
        <Route path="/club/profil/:username" component={YPProfilPage} />
        <Route path="/club/hakkimizda"       component={YPClubHakkimizdaPage} />
        <Route path="/club/mesajlar"         component={YPClubMesajlarPage} />
        <Route path="/club/kesfet"           component={YPClubKesfetPage} />
        <Route path="/club/kopekler"         component={YPClubKopeklerPage} />
        <Route path="/club"                  component={YPClubPage} />
        {/* Bildirimler */}
        <Route path="/bildirimler"           component={YPBildirimlerPage} />
        {/* Rehber */}
        <Route path="/rehber/:category/:slug" component={YPRehberMakalePage} />
        <Route path="/rehber/:slug">
          {(params: any) => <YPRehberPage routeSlug={params?.slug} />}
        </Route>
        <Route path="/rehber"                component={YPRehberPage} />
        {/* Araçlar */}
        <Route path="/araclar/mama-hesaplama" component={YPMamaHesaplamaPage} />
        <Route path="/araclar/yas-hesaplama"  component={YPYasHesaplamaPage} />
        <Route path="/araclar/tiras-takvimi"  component={YPTirasTakvimiPage} />
        <Route path="/araclar"                component={YPAraclarPage} />
        {/* Events */}
        <Route path="/etkinlikler/:slug"     component={YPEtkinlikDetayPage} />
        <Route path="/etkinlikler"           component={YPEtkinliklerListePage} />
        {/* Auth */}
        <Route path="/sifremi-unuttum/dogrulama" component={YPSifreSifirlaPage} />
        <Route path="/sifremi-unuttum"       component={YPSifremiUnuttumPage} />
        <Route path="/ai-asistan"            component={YPAiAsistanPage} />
        <Route path="/mama-bul"              component={YPMamaBulPage} />
        <Route path="/uye-ol"                component={YPUyeOlPage} />
        <Route path="/sepet"                 component={YPSepetPage} />
        <Route path="/odeme"                 component={YPOdemePage} />
        <Route path="/tesekkurler"           component={YPTesekkurlerPage} />
        {/* Hizmetler & profil */}
        <Route path="/hizmetler"             component={YPHizmetlerPage} />
        <Route path="/benim-poodleim"        component={YPBenimPoodleimPage} />
        {/* Marketing & static */}
        <Route path="/kampanyalar"           component={YPKampanyalarPage} />
        <Route path="/hakkimizda"            component={YPHakkimizdaPage} />
        <Route path="/iletisim"              component={YPIletisimPage} />
        {/* Legal — canonical */}
        <Route path="/kullanim-sartlari">
          {() => <YPLegalPage variant="kullanim-sartlari" />}
        </Route>
        <Route path="/mesafeli-satis-sozlesmesi">
          {() => <YPLegalPage variant="mesafeli-satis" />}
        </Route>
        {/* Physical store */}
        <Route path="/magazalar/atakum"      component={YPAtakumMagazaPage} />
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
  // On the live yourpoodle.com domain ALL routes are YP → suppress legacy chrome.
  // On dev hosts, /yourpoodle/* and the canonical top-level YP paths are YP.
  const YP_TOP = ["/magaza", "/club", "/rehber", "/ai-asistan", "/mama-bul", "/uye-ol", "/sepet", "/odeme", "/tesekkurler", "/giris", "/ara", "/araclar", "/etkinlikler", "/kampanyalar", "/hakkimizda", "/iletisim", "/sifremi-unuttum", "/siparis", "/kullanim-sartlari", "/mesafeli-satis-sozlesmesi", "/magazalar"];
  const isYP = IS_YP || location === "/" || location.startsWith("/yourpoodle") ||
    YP_TOP.some(p => location === p || location.startsWith(p + "/") || location.startsWith(p + "?"));
  const isDemo = isYP || location === "/demo" || location.startsWith("/demo-kampanya") || location === "/demo1" || location === "/demo2" || location === "/demo-anasayfa";
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
