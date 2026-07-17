-- YourPoodle Mağaza — 7 kategori × 20 ürün seed
-- Kategori brand_category_id referansları (kopek/animal):
--  Mama kuru    : 94=Pro Plan, 95=Royal Canin, 96=Hill's, 97=N&D, 98=Econature, 99=Felicia, 100=Enjoy
--  Mama yaş     : 53=Yaş Mama, 33=RC Acık, 34=Hill's Açık, 35=RC Açık
--  Ödül         : 51=Köpek Ödülleri, 156=Çiğneti ve Kemikler
--  Tasma        : 141=Bel Boyun Tasmaları
--  Taşıma       : 49=Taşıma ve Kulübeler
--  Oyuncak      : 134=Köpek Oyuncak
--  Bakım        : 147=Şampuan, 50=Bakım Sağlık, 159=Tıraş, 145=Tırnak, 155=Göz/Kulak, 143=Tüy Toplayıcı, 149=Ağız/Diş
--  Sağlık       : 153=Bit Pire, 151=Süt Tozu Biberon

-- ══════════════════════════════════════════════════════
-- 1. MAMA (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Royal Canin Toy Poodle Adult 1.5kg',         699,  849, 95, 25, true, 'Toy Poodle yetişkinleri için özel geliştirilmiş köpek maması. Küçük çene yapısına uygun özel kibble şekli, sağlıklı tüy ve deri için Omega 3-6 içeriği.'),
('Royal Canin Toy Poodle Puppy 500g',          399,  499, 95, 20, true, 'Toy Poodle yavruları için özel besin profili. Bağışıklık sistemini güçlendiren antioxidantlar ve sağlıklı gelişim için yüksek protein içeriği.'),
('Pro Plan Small & Mini Adult Tavuklu 3kg',    749,  899, 94, 20, true, 'Küçük ırk köpekler için Pro Plan Small formülü. Yüksek kaliteli tavuk proteini, sağlıklı sindirim için prebiyotikler.'),
('Pro Plan Puppy Small & Mini Tavuklu 3kg',    799,  949, 94, 15, true, 'Küçük ırk yavrular için Pro Plan Puppy. DHA içeriği beyin gelişimini destekler, kolostrum bağışıklığı güçlendirir.'),
('Hill''s Science Plan Small & Mini Adult 3kg', 829, 999, 96, 15, true, 'Veteriner tavsiyeli Hill''s Science Plan. Küçük ırk yetişkin köpekler için özel formül, kalp sağlığına destek için taurin.'),
('N&D Quinoa Skin & Coat 2.5kg',               949, 1149, 97, 12, true, 'Tüy ve deri sağlığı için özel N&D formülü. Glutensiz quinoa tabanı, soğuk sıkım balık yağı, tüy kıvırma ve parlaklık için.'),
('Royal Canin Mini Adult 4kg',                 899,  null, 95, 20, true, 'Mini ırk köpekler için Royal Canin Mini Adult. Eklem sağlığını destekleyen glukozamin ve kondroitin.'),
('Econature Small Breed Tavuklu 3kg',           449,  599, 98, 18, true, 'Küçük ırk köpekler için ekonomik Econature formülü. Doğal malzemeler, tahıl içerikli dengeli beslenme.'),
('Felicia Küçük Irk Somonlu 3kg',               499,  649, 99, 15, true, 'Somon proteinli Felicia küçük ırk maması. Omega 3 açısından zengin, parlak tüy ve sağlıklı deri için idealdir.'),
('Enjoy Small Breed Kuzu Etli 3kg',             469,  599, 100, 15, true, 'Kuzu eti proteinli Enjoy Small Breed. Hassas sindirim sistemi olan küçük ırk köpekler için uygun formül.'),
('Royal Canin Mini Puppy 2kg',                  599,  749, 95, 20, true, 'Mini ırk yavrular için Royal Canin Mini Puppy. İlk 10 ay için ideal beslenme desteği ve güçlü bağışıklık.'),
('Hill''s Puppy Small & Mini Tavuklu 1.5kg',   599,   null, 96, 12, true, 'Hill''s Science Plan Puppy Small. Yüksek kaliteli protein ve DHA içeriği ile sağlıklı yavru gelişimi.'),
('N&D Pumpkin Düşük Tahıllı Ördekli 2.5kg',   1049, 1249, 97, 10, true, 'Az tahıllı N&D Pumpkin formülü. Ördek ve balkabağı içeriği, hassas sindirim için L-carnitine.'),
('Yaş Mama Royal Canin Mini Pouch 12x85g',     349,   null, 53, 25, true, 'Royal Canin Mini ıslak mama pouch paketi 12 adet. Günlük ıslak mama takviyesi veya tek başına beslenme için.'),
('Royal Canin Puppy Açık Mama 100g',            49,    null, 35, 50, true, 'Royal Canin Puppy açık mama 100g dilimli satış. Deneme veya takviye beslenme için uygun.'),
('Hill''s Science Plan Açık Mama 156g',          79,    null, 34, 40, true, 'Hill''s Science Plan konserve 156g. Gerçek tavuk içeriği, doğal malzemeler ve dengeli beslenme.'),
('Econature Mini Breed Biftekli 3kg',           429,  549, 98, 18, true, 'Biftek proteinli Econature Mini formülü. Yetişkin küçük ırk köpekler için ekonomik ve dengeli beslenme.'),
('Pro Plan Sensitive Skin Somonlu 3kg',         849,  999, 94, 12, true, 'Hassas deri ve sindirim için Pro Plan Sensitive. Somon ve pirinç içeriği, doğal besinler ve antioksidanlar.'),
('N&D Ocean Balıklı & Portakallı 2.5kg',        999, 1199, 97, 10, true, 'Deniz ürünleri bazlı N&D Ocean formülü. Atlantik ringa balığı, portakal ve Goji berry içeriği.'),
('Royal Canin X-Small Adult 1.5kg',             649,   null, 95, 15, true, 'X-Small ırk yetişkin köpekler için Royal Canin. 4kg altı köpekler için optimize edilmiş kibble boyutu ve besin profili.');

-- ══════════════════════════════════════════════════════
-- 2. ÖDÜL & ATIŞTIRMALIK (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Wanpy Chicken Rolls Tavuk Sarmalı 100g',       99,  null, 51, 40, true, 'Gerçek tavuk etinden yapılmış yumuşak sarma ödüller. Küçük ırk köpeklere uygun boyut, katkısız doğal içerik.'),
('Zuke''s Mini Naturals Tavuklu 170g',           149,   179, 51, 30, true, 'Eğitim için ideal küçük boy ödüller. Her biri yaklaşık 3 kalori, tavuk ve kiraz içeriği ile besleyici atıştırmalık.'),
('Brit Care Soft Snack Ringa Balıklı 100g',       89,  null, 51, 35, true, 'Yumuşak dokulu Brit Care ödül. Ringa balığı ve ıspanak içeriği, sindirim dostlu formül.'),
('Trixie Biftekyü Cips Kurutulmuş 50g',          79,   null, 51, 45, true, 'Doğal kurutulmuş biftek cipsi. Tek içerikli, katkısız, eğitim ödülü olarak idealdir.'),
('Alberta Tavuk Göğsü Kurutulmuş 80g',          119,   149, 51, 30, true, 'Saf kurutulmuş tavuk göğsü. Yüksek protein, düşük yağ içeriği, eğitim ve günlük ödül için uygun.'),
('Bosch Soft Snack Tavuklu & Mango 100g',        99,   null, 51, 30, true, 'Yumuşak Bosch ödül. Tropikal mango ve tavuk içeriği, yumuşak dokusu ile yaşlı köpeklere de uygun.'),
('Pedigree Dentastix Small 7''li Paket',          89,   null, 51, 50, true, 'Diş sağlığını destekleyen Dentastix çiğneti. Küçük ırk köpekler için özel boyut, günlük kullanım.'),
('GimDog Natural Atlantic Somon Şeritler 70g',  109,   null, 51, 25, true, 'Tek içerikli Atlantic somon şeritleri. Omega 3 açısından zengin, parlak tüy için günlük takviye.'),
('Rafi Tavuk & Pirinç Çubukları 80g',            79,   null, 51, 35, true, 'Yumuşak dokulu tavuk ve pirinç çubukları. Tahıl içerikli, hassas sindirim için uygun ödül atıştırmalığı.'),
('Vitakraft Beef Stick Biftek Çubuğu 12g',       29,   null, 51, 80, true, 'Tek adet biftek çubuğu ödül. Yoğun et aroması, köpeklerin sevdiği kıvam, pratik ambalaj.'),
('Köpek Çiğneme Kemiği Naturel Büyük 1 adet',   49,   null, 156, 50, true, 'Doğal kurutulmuş çiğneme kemiği. Diş sağlığını destekler, sıkılganlığı azaltır, uzun süre çiğneme keyfi.'),
('Rawhide Preslenmiş Kemik 10cm',                39,   null, 156, 60, true, 'Preslenmiş rawhide kemik. Diş taşı ve plak oluşumunu azaltır, uzun süre ilgi çeker.'),
('Whimzees Diş Temizleme Çiğneti S Boy 7 adet', 149,   179, 156, 25, true, 'Bitkisel bazlı Whimzees diş çiğnetisi. Nişasta ve gliserin içerikli, boyasız ve katkısız formül.'),
('Brit Premium Köpek Kulaklı Köpek Kulağı 50g', 129,   null, 156, 20, true, 'Doğal kurutulmuş sığır kulağı. Yüksek protein, düşük yağ içeriği, diş ve diş eti sağlığını destekler.'),
('Trixie Tavuk Ayağı Kurutulmuş 5 adet',         69,   null, 156, 35, true, 'Doğal kurutulmuş tavuk ayağı. Glukozamin kaynağı, eklem sağlığını destekler, tek içerikli.'),
('Barkoo Sığır Derisi Rulo 12cm 3''lü',           79,   null, 156, 40, true, 'Sığır derisinden yapılmış doğal rulo çiğneti. Uzun süre ilgi çeker, diş sağlığı için faydalı.'),
('Nobby Ördek Şerit Kurutulmuş 100g',           119,   149, 51, 20, true, 'Kurutulmuş ördek etinden şeritler. Tahılsız, katkısız, alerjisi olan köpekler için uygun.'),
('Carnilove Somon & İspanak Bisküvi 200g',       129,  null, 51, 25, true, 'Tahılsız somon ve ıspanak bisküvisi. Doğal malzemeler, antioksidan zengin formül ve hoş tat.'),
('Alberta Küçük Ödül Çeşit Paket 100g',         109,  null, 51, 30, true, 'Çeşit ödül paketi: tavuk, somon ve biftek aroması. Eğitim sırasında çeşitlilik için ideal seçim.'),
('Pedigree Rodeo Sığır & Tavuk 7''li Çiğneti',   79,  null, 156, 45, true, 'Çift aromalı Rodeo çiğneti. Sığır ve tavuk içeriği, diş eti sağlığını destekleyen spiral tasarım.');

-- ══════════════════════════════════════════════════════
-- 3. TASMA & GEZDİRME (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Trixie Premium Deri Boyun Tasma XS Bej',      149,  null, 141, 20, true, 'İtalyan deri işçiliği XS boyun tasma. Toy Poodle boyut (20-25cm), ayarlanabilir toka, 10mm genişlik.'),
('Ruffwear Flat Out Boyun Tasma XS',             299,  379, 141, 12, true, 'Dayanıklı Ruffwear naylon tasma. Reflektif şerit gece görünürlüğü, güvenli çift toka, XS 28-36cm.'),
('Hunter Neopren Boyun Tasma XXS Renkli',        189,  null, 141, 15, true, 'Neopren iç yüzey yumuşak boyun tasma. XXS boyut küçük ırklar için uygun 20-30cm, hafif yapı.'),
('Julius K9 Powerharness IDC Göğüs Tasma XS',   449,  549, 141, 10, true, 'Profesyonel IDC göğüs harness. Ergonomik tasarım, interchangeable patchler, kırmızı/siyah seçenek.'),
('Flexi New Classic Otomatik Gezdirme Kayışı 3m',199,  null, 141, 25, true, 'Flexi otomatik kayış 3 metre. Fren düğmesi ve kilit mekanizması, S beden 12kg''a kadar, kordur tel.'),
('Trixie Doğal Kumaş Gezdirme Tasma Takım',     249,  299, 141, 15, true, 'Eşleşen tasma ve gezdirme seti. %100 doğal pamuk kumaş, boyasız, 120cm kayış + XS tasma.'),
('Anka Deri El Yapımı Küçük Irk Tasma',         349,  null, 141, 8,  true, 'El yapımı gerçek deri boyun tasma. Türk derisi, pirinç toka, Toy Poodle için özel boyut 18-24cm.'),
('Redor Neon Renkli Göğüs Harness XS',          179,  219, 141, 18, true, 'Neon renkli göğüs harness. Yüksek görünürlük, çekmeye karşı ergonomik tasarım, 3 renk seçeneği.'),
('Trixie Reflektif Kayış 1.5m S/M',             129,  null, 141, 22, true, 'Reflektif şeritli gezdirme kayışı. 1.5 metre sabit uzunluk, konforlu köpük saplı tutamak, S/M halka.'),
('Hunter Aalborg Deri Boyun Tasma XXS Kırmızı', 219,  null, 141, 12, true, 'Hunter Aalborg saffiano deri tasma. Metalik kırmızı finish, XXS 18-26cm, paslanmaz çelik toka.'),
('RC Pets Primo Göğüs Harness Üçgen XS Mor',    279,  null, 141, 10, true, 'Üçgen tasarım göğüs harness. Çekme direnci olmayan yapı, ön ve sırt halka, XS beden pastel mor.'),
('Paw5 Cloud Seven Soft Harness XS Bej',        329,  399, 141, 8,  true, 'Bulut dokusu yumuşak göğüs harness. Yıkanabilir, hızlı kilitleme toka, XS 30-38cm beden.'),
('Zolux Katlanabilir Gezinti Tasması 2m',        159,  null, 141, 20, true, 'Bungee özellikli esnek gezdirme kayışı. Ani çekişleri absorbe eder, 2m uzunluk, S beden köpekler için.'),
('BioThane Kaplı Su Geçirmez Kayış 120cm',       169,  null, 141, 15, true, 'BioThane kaplı su geçirmez gezdirme kayışı. Temizlemesi kolay, yıkanabilir, sahil ve yağmur için ideal.'),
('Trixie Köpek Pati Koruyucu Botlar S 4''lü',    199,  249, 141, 12, true, 'Köpek patisi koruyucu bot takımı. Kauçuk taban kaplama, elastik bilek bağı, XS-S beden 4''lü set.'),
('Hunter Deri Çift Saplı Çift Güvenlik Kayış',  249,  null, 141, 10, true, 'Çift tutamalı güvenlik gezdirme kayışı. Yakın kontrol için kısa tutaç, ekstra halkalar ve klips.'),
('Morso Twist Halka Kayış 120cm Gri',            179,  null, 141, 15, true, 'Örgülü deri halka ile şık gezdirme kayışı. Paslanmaz çelik toka, gri deri, İtalyan işçiliği.'),
('EzyDog Zero Shock Amortisörlü Kayış 56cm',     229,  299, 141, 10, true, 'Şok emici EzyDog amortisörlü kayış. Köpek ve sahibinin bilek ve omuzunu korur, S/M beden.'),
('Trixie Mini Stop Tıkayıcı Göğüs Harness XS',  189,  null, 141, 15, true, 'Çekmesi durduran anti-pull göğüs harness. Öne çekme davranışını azaltır, eğitim için ideal XS beden.'),
('Flexi Explore T Otomatik Kayış Şerit 3m XS',  249,  null, 141, 12, true, 'Şerit tipi Flexi Explore T serisi. Geniş şerit daha güçlü, kilit sistemi, LED ışık aksesuarı uyumlu.');

-- ══════════════════════════════════════════════════════
-- 4. TAŞIMA (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Trixie Foldable Katlanır Kedi Köpek Çantası S', 299, 379, 49, 12, true, 'Katlanabilir yumuşak taşıma çantası. S boyut 28x28x43cm, 6kg''a kadar, havalandırma pencereli.'),
('Ruffwear Approach Pack Sırt Çantası',           599, null, 49, 8,  true, 'Ergonomik köpek taşıma sırt çantası. Üst havalandırma paneli, köpek güvenlik klipsi, 7kg''a kadar.'),
('Pet Carrier Premium Kumaş Kabin Çantası',       449, 549, 49, 10, true, 'Uçak kabin uyumlu yumuşak taşıma çantası. 40x25x25cm boyut, hava yastıklı alt panel, su geçirmez taban.'),
('BabyBjörn Mini Benzeri Kanguru Taşıyıcı 5kg',  549, null, 49, 8,  true, 'Eller serbest kanguru tipi taşıyıcı. Nefes alabilen file örgüsü, bel desteği, 5kg''a kadar.'),
('Trixie Minou Taşıma Kutusu S Bej',              349, null, 49, 12, true, 'Havalandırmalı plastik taşıma kutusu. S beden 32x31x48cm, çıkarılabilir üst kapak, kilitli kapı.'),
('Savic Globetrotter Box S Seyahat Kafesi',       449, 549, 49, 8,  true, 'IATA onaylı seyahat kafesi S beden. Hava delikli panel, kilitli kapı, 8kg''a kadar onaylı.'),
('Touchdog Original Kumaş Çanta Bej/Kahve M',    379, null, 49, 10, true, 'Moda çanta tasarımı köpek taşıyıcı. Canvas kumaş, fermuar güvenlik kilidi, omuz ve el askısı.'),
('Innopet Sporty Stroller Puset S Mavi',          899, 1099, 49, 5, true, 'Köpek puseti 3 tekerlekli katlanabilir. Suni deri koltuk, güvenlik kayışı, saklama çantası.'),
('Outward Hound Pouch Göğüs Taşıyıcı',           299, 379, 49, 12, true, 'Önde taşıma kanguru tipi. Neopren vücut bandı, fermuarlı cep, 3kg''a kadar küçük köpekler için.'),
('Ibiyaya Flap Kapaklı Kumaş Çanta Çiçek',       419, null, 49, 8,  true, 'Üst kapaklı şık taşıma çantası. Bambu saplar, iç güvenlik klipsi, 5kg''a kadar.'),
('Paws & Pals Üç Kapılı Katlanır Kasa M',        349, 449, 49, 10, true, 'Üç kapılı katlanır tel kasa. Plastik taban, taşıma kolu ve tekerlekler, M boyut 8kg''a kadar.'),
('Hundefreund Nefes Alan Sırt Çantası Şeffaf',   479, null, 49, 8,  true, 'Şeffaf uzay kapsülü sırt çantası. Hava girişli kapaklı baloncuk, 5kg''a kadar köpekler için.'),
('Trixie Be Nordic Kapaklı Sepet Taşıyıcı',      529, null, 49, 6,  true, 'Doğal rattan sepet köpek taşıyıcı. Yıkanabilir iç yastık, güvenlik kayışı, kilitli kapak.'),
('K&H Pet Buckle N Go Araba Koltuğu Küçük',      349, 429, 49, 10, true, 'Araba koltuğuna bağlanan köpek koltuğu. S beden 6kg''a kadar, güvenlik kayışı dahil, yıkanabilir.'),
('Petcare Ön Koltuk Örtüsü ve Güvenlik Kemeri',  199, null, 49, 20, true, 'Araba ön koltuğu köpek örtüsü. Kaymaz taban, güvenlik kemeri halkası, tüm araçlara uyumlu.'),
('Airline Kabin Onaylı Çanta Siyah 40x25x25cm',  399, 499, 49, 10, true, 'Çoğu havayolu kabin uyumlu çanta. 40x25x25cm, 5kg''a kadar, metal çerçeve, havalandırma paneli.'),
('Ferplast Atlas 10 Seyahat Kutusu S',            289, null, 49, 12, true, 'Ferplast Atlas plastik taşıma kutusu S. 6kg''a kadar, hava delikli kapak, kolay montaj toka.'),
('Vitakraft Köpek Taşıma Çantası Neon Sarı',      249, null, 49, 15, true, 'Neon renkli yüksek görünürlüklü taşıma çantası. Hafif yapı, ıslak mendil cep, 4kg''a kadar.'),
('Trixie Foldable Travel Bag Katlanır 35x25x25', 199, 249, 49, 15, true, 'Ultra hafif katlanabilir yolculuk çantası. Fermuarlı yan pencere, yumuşak taban minderi dahil.'),
('Zolux Walkabout Köpek Arabası 4 Tekerlekli',   1299, null, 49, 4, true, '4 tekerlekli köpek arabası. Büyük bagaj bölümü, yağmur siperi dahil, 15kg''a kadar, tek el katlanır.');

-- ══════════════════════════════════════════════════════
-- 5. OYUNCAK (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Kong Classic Kauçuk Oyuncak S Kırmızı',        149, null, 134, 25, true, 'Efsanevi Kong kauçuk oyuncak S beden. İçi mama veya kong dolgusuyla doldurulabilir, uzun saatler meşguliyet.'),
('Outward Hound Gıcırtılı Peluş Oyuncak Kıvırcık', 99, null, 134, 30, true, 'Poodle temalı gıcırtılı peluş oyuncak. Yumuşak dokular, güvenli sızıntısız gıcırtı, yıkanabilir.'),
('Trixie Activity Zeka Oyuncağı Bungalow',        249, 299, 134, 15, true, 'Seviye 2 köpek zeka oyuncağı. Gizli bölmeler, döner kapaklar, köpeği aktif ve mutlu tutar.'),
('Nina Ottosson Brick Zeka Oyuncağı',             199, 249, 134, 12, true, 'Nina Ottosson Brick puzzle oyuncağı. Sürgülü kapaklı gizli bölmeler, dishwasher safe plastik.'),
('Chuckit! Ultra Ball S Tenis Topu',              79, null, 134, 40, true, 'Standart tenis topundan 2x dayanıklı Ultra Ball. S beden küçük ırk için, su geçirmez kauçuk.'),
('ZippyPaws Burrow Sincap & Kütük Set',           129, null, 134, 20, true, 'İçinden sincap çıkan kütük oyuncak. 3 adet peluş sincap, doğal renkli kütük ev oyuncağı.'),
('Trixie Rope Toy Halat Seti 5''li',              119, null, 134, 25, true, '5 parçalı renkli halat oyuncak seti. Diş sağlığına yardımcı doğal pamuk halat, çekme ve çiğneme için.'),
('West Paw Zogoflex Tux S Köpek Oyuncağı',       199, null, 134, 12, true, 'ABD yapımı Zogoflex esnek oyuncak. İçi gıda ile doldurulabilir, bulaşık makinesinde yıkanabilir.'),
('Kong Squeakair Sesli Tenis Topu S',             69, null, 134, 40, true, 'Kong marka gıcırtılı tenis topu. S beden, ses çıkaran hava deliği, küçük ırk köpekler için uygun.'),
('Beco Things George Geri Dönüşümlü Oyuncak',    149, null, 134, 15, true, 'Çevre dostu Beco Things peluş oyuncak. Geri dönüştürülmüş plastik şişelerden üretilmiş, George fil.'),
('Trixie Doy Pack Dereceli Mama Topu S',          129, 159, 134, 20, true, 'Dereceli zorluk mama dispenserı topu. Dönerek mama dağıtır, zihni ve vücudu aktif tutar.'),
('Petstages Mini Chew-A-Lot Köpek Yapboz',       179, null, 134, 12, true, 'Çiğneme destekli zeka yapbozu. Kahverengi ağız geliştirici plastik parçalar, XS/S beden için.'),
('PetSafe Busy Buddy Bouncy Bone S',              159, null, 134, 15, true, 'Çiğneme oyuncağı ve ödül dispenserı. Saklanabilir ödüller, 2 adet nylon çiğneti halkası dahil.'),
('Trixie Flip Board Flip Oyun Tahtası',           219, 279, 134, 10, true, 'Eğlenceli çevirme tahtalı zeka oyuncağı. Farklı şekilli kapaklar, seviye 2 zorluk, ABS plastik.'),
('Lambchop Klasik Peluş Lamb Kuzu Oyuncak',      119, null, 134, 20, true, 'Orijinal Lambchop peluş kuzu oyuncak. Boyalı kumaş yüz, gıcırtılı kuyruk, yıkanabilir peluş.'),
('Ruffwear Gnawt-a-Rock Kaya Şekli Oyuncak S',   179, null, 134, 12, true, 'Kaya şekilli doğal kauçuk oyuncak. Şişirilmiş kauçuk, suda yüzer, fırlatma oyunları için ideal.'),
('Buster Food Cube Mama Dispenserı S',            149, 189, 134, 15, true, 'Küp şekilli mama dispenserı. Ayarlanabilir delik boyutu, ABS plastik, günlük mama için çalıştırma.'),
('Jolly Pets Romp N Roll Top S',                  99, null, 134, 20, true, 'Halatlı kauçuk fırlatma topu. S beden, sağlam kauçuk top + renkli halat, su oyunları için.'),
('Trixie Runic Dog Activity Game',               229, 299, 134, 8,  true, 'Runik sembollü aktivite oyunu. Seviye 3 zorluk, ahşap ve plastik kombinasyonu, uzun süre meşguliyet.'),
('P.L.A.Y. Fido''s Finery Peluş Kravatlı Köpek', 139, null, 134, 15, true, 'Kravatlı takım elbiseli peluş köpek oyuncak. Gıcırtılı, eğlenceli tasarım, ABD''de tasarlandı.');

-- ══════════════════════════════════════════════════════
-- 6. BAKIM & HİJYEN (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Bio-Groom Super White Beyaz Tüy Şampuanı 237ml', 229, null, 147, 15, true, 'Beyaz ve krem tüylü köpekler için özel şampuan. Sararmayı önleyen optik aydınlatıcı, parfümsüz formül.'),
('Espree Luxury Remoisturizer Saç Kremi 250ml',    199, null, 147, 12, true, 'Poodle tüyü için özelleştirilmiş nem kremi. Çözülmez düğümler, yumuşaklık ve parlaklık için aloe vera.'),
('Chris Christensen Ice on Ice Sprey 473ml',       299, 379, 147, 10, true, 'Profesyonel tüy açma spreyi. Anında düğüm çözer, statik elektriği önler, show hazırlık için ideal.'),
('Iv San Bernard Fruit of the Groomer Şampuan 500ml', 249, null, 147, 12, true, 'ISB meyve serisi tüy onarım şampuanı. Hasarlı tüy için keratin proteinleri, hoş meyve kokusu.'),
('Artero Cosmos All-in-One Şampuan 250ml',        199, 249, 147, 12, true, 'Çok amaçlı Artero Cosmos şampuan. Temizlik, nem ve parlaklık tek üründe, hafif köpüklü formül.'),
('Geiger Köpek Traş Makinesi Pro 5 Hız',         549, 699, 159, 8,  true, 'Profesyonel köpek traş makinesi 5 hız ayarlı. Seramik bıçaklar, şarj edilebilir pil, tarak seti dahil.'),
('Moser Arco Şarjlı Mini Traş Makinesi',          899, null, 159, 5,  true, 'Alman yapımı Moser Arco profesyonel şarjlı traş makinesi. Titanyum bıçak, 90dk çalışma süresi.'),
('Chris Christensen Slicker Fırça Büyük',         249, null, 159, 15, true, 'Oval headed slicker fırça büyük boy. Dayanıklı paslanmaz tel diş, kauçuk taban köpük sap, poodle tüyü için.'),
('GripSoft Çift Taraflı Tarak Poodle',            149, null, 159, 20, true, 'Çift taraflı sık/seyrek diş poodle tarakı. Dönen dişler düğüm açar, paslanmaz çelik, ergonomik sap.'),
('Andis Steel Comb 7.5" Profesyonel Tarak',       129, null, 159, 20, true, 'Andis paslanmaz çelik profesyonel tarak. 7.5 inç, ince ve orta diş aralığı, tüm tüy tipleri için.'),
('Trixie Tırnak Makası Küçük Irklar',              99, null, 145, 25, true, 'Küçük ırk köpekler için tırnak makası. Kaymaz sap, emniyet kilidi, paslanmaz çelik bıçak.'),
('Resco Original Köpek Tırnak Makası Gümüş',       149, null, 145, 15, true, 'Amerikan yapımı Resco guillotine tırnak makası. 70+ yıllık güven, değiştirilebilir bıçak, gümüş renk.'),
('Zymox Kulak Temizleme Losyonu 118ml',           149, 179, 155, 20, true, 'Veteriner tavsiyeli Zymox kulak temizleyici. Enzim bazlı formül, antibiyotik içermez, günlük kullanım.'),
('Virbac Epi-Otic Kulak Temizleme Solüsyonu 125ml', 179, null, 155, 15, true, 'Klinik kanıtlı Virbac Epi-Otic. Kuru kulak kanalı için kurutucu ve temizleyici, haftalık kullanım.'),
('Optixcare Göz Temizleme Spreyi 120ml',          129, null, 155, 20, true, 'Göz altı lekeleri için optixcare temizleyici. pH dengeli, alerjisiz formül, göz çevresi için güvenli.'),
('Tropiclean Nefes Ferahlatıcı Jel 59ml',         99, null, 149, 30, true, 'Çürük ve kötü koku engelleyen Tropiclean diş jeli. Fırçasız uygulama, yeşil çay özlü formül.'),
('Vet''s Best Diş Fırçası Seti 3''lü',             89, null, 149, 25, true, 'Köpek için 3 farklı boy diş fırçası seti. Yumuşak kıl, parmak fırçası dahil, günlük diş bakımı için.'),
('Fur Fighter Çift Taraflı Tüy Toplayıcı',         79, null, 143, 40, true, 'Çift taraflı köpek tüyü toplayıcı. Kumaş ve düz yüzey için iki farklı yüz, yeniden kullanılabilir.'),
('ChomChom Roller Silindirli Tüy Toplayıcı',      149, null, 143, 30, true, 'Bantlanmayan silindir tüy toplayıcı. Yeniden kullanılabilir, temizlenmesi kolay, her yüzeye uygun.'),
('Pet Magasin Kıyafet Silindiri 60 Yaprak',        49, null, 143, 50, true, 'Yapışkanlı kıyafet tüy silindiri 60 yaprak. Yedek rulo uyumlu, köpek sahipleri için vazgeçilmez.');

-- ══════════════════════════════════════════════════════
-- 7. SAĞLIK & VİTAMİN (20 ürün)
-- ══════════════════════════════════════════════════════
INSERT INTO products (name, price, original_price, brand_category_id, stock, is_active, long_description) VALUES
('Biocanina Omega 3 Somon Yağı 300ml',            199, null, 50, 20, true, 'Saf somon yağı Omega 3 takviyesi. Tüy parlaklığı, eklem ve beyin sağlığı için günlük damlatma yöntemi.'),
('Beaphar Köpek Multi-Vitamin Tablet 50 adet',    149, null, 50, 25, true, 'Çok vitaminli günlük takviye tablet. A, B kompleks, C, D, E vitaminleri, etli aromalı kolay verim.'),
('Nutrolin Coat & Skin Deri ve Tüy Yağı 500ml',  279, 349, 50, 12, true, 'Finlandiya yapımı premium tüy yağı. Yüksek EPA/DHA oranı, soğuk sıkım, dermatit desteği.'),
('Canvit Biotine Tüy Sağlığı Tableti 100 adet',   129, null, 50, 20, true, 'Biotin + çinko + metiyonin tüy sağlığı tableti. Tüy dökülmesini azaltır, sağlıklı tüy büyümesini destekler.'),
('VetriScience Glycoflex S Eklem Tableti 60 adet', 249, 299, 50, 15, true, 'Veteriner tavsiyeli Glycoflex eklem desteği. Glukozamin, perna mussel özü, eklem hareketliliği için.'),
('NaturVet Senior Advanced Eklem Kürü 60 tablet',  219, null, 50, 12, true, 'Yaşlı köpekler için eklem bakım tableti. Hyalüronik asit, glukozamin ve MSM içeriği, büyük küçük her ırk.'),
('Beaphar Probi-Zyme Sindirim Takviyesi 50 tablet', 129, null, 50, 20, true, 'Probiyotik ve enzim kombinasyonu sindirim desteği. Laktik asit bakterisi, hassas mide için, etli aroma.'),
('Forza10 Diet Stone&Crystal Üriner Destekçi 390g', 229, null, 50, 10, true, 'Üriner sistem sağlığı için özel takviye. Cranberry özlü, idrar yolu bakteri gelişimini engeller.'),
('Bogadent Dental Fit Enzim Tablet 70g',           149, null, 149, 20, true, 'Enzim bazlı diş bakım tableti. Plak ve taşı çözen formül, ağız kokusunu engeller, çiğneme tableti.'),
('Frontline Spot On Pire & Kene Damlası S 3''lü',  299, null, 153, 15, true, 'Veteriner tavsiyeli Frontline Spot On. S beden 2-10kg köpekler için, 1 ay etkili pire ve kene önleyici.'),
('Advantage II Spot On Küçük Köpek 3''lü',         289, null, 153, 12, true, 'Advantage II pire önleyici damlası. 3 aylık koruma, yumurta ve larvalara da etkili, su geçirmez formül.'),
('Bravecto Spot On Küçük Irk 250mg',              549, null, 153, 8,  true, 'Tek dozda 12 hafta pire ve kene koruması. Bravecto spot on S 2-4.5kg için, veteriner onaylı.'),
('Seresto Bit Pire Kene Önleyici Tasma S',         549, 649, 153, 10, true, 'Seresto 8 aylık kene ve pire önleyici tasma. S beden 8kg altı köpekler, su geçirmez, kırılır emniyet toka.'),
('Drontal Köpek İç Parazit Tableti S 2 adet',      129, null, 153, 20, true, 'Bayer Drontal geniş spektrumlu bağırsak kurdu tableti. Küçük ırk 2 adet, veteriner tavsiyeli formül.'),
('Milbemax Küçük Köpek İç Parazit 2 tablet',       149, null, 153, 20, true, 'Milbemax küçük köpekler için iç parazit ilacı. Yuvarlak ve şerit kurtlara etkili, 0.5-5kg için.'),
('Welpenmilch Yavru Köpek Süt Tozu 200g',          199, null, 151, 15, true, 'Yeni doğan yavru köpek süt tozu. Anne sütüne yakın formül, kolay sindirilen laktozlu içerik, 200g.'),
('Royal Canin BabyDog Milk Yavru Sütü 400g',       299, null, 151, 12, true, 'Royal Canin yavru köpek süt tozu 400g. 0-6 hafta yenidoğanlar için, DHA destekli beyin gelişimi.'),
('Trixie Biberon Seti 57ml + Fırça',               79, null, 151, 25, true, 'Yavru köpek biberon seti. 57ml şişe, 2 farklı boyut emzik, temizleme fırçası dahil.'),
('Beaphar Calcium Kalsiyum Tablet 180 adet',       129, null, 50, 20, true, 'Köpek kalsiyum takviyesi 180 tablet. Kemik ve diş gelişimi, hamileler ve yavrular için idealdir.'),
('Vetoquinol Suplasyn Eklem Sıvısı 30ml',          249, null, 50, 10, true, 'Hyalüronik asit bazlı eklem sıvısı takviyesi. Ağız yoluyla alım, eklem kıkırdak sağlığı için 30ml.');
