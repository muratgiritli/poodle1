// ================= CURRENT AUTH USER STATE =================
    const DEFAULT_USER = {
      isLoggedIn: false,
      username: 'senin_poodlein',
      displayName: 'Mochi',
      variety: 'Toy Poodle',
      color: 'Red Apricot',
      bio: 'Park delisi, ödül maması aşığı minik prens 🐾',
      city: 'İstanbul, Bebek',
      avatar: '/images/poodle_mochi.jpg',
      postsCount: 18,
      followersCount: '48.6B',
      pawPoints: 125,
      pawRank: 'Kıvırcık Kaşif 🎾',
      microchip: 'TR-982009104829104',
      birthDate: '2025-07-15',
      weight: 2.85,
      ownerName: 'Emre & Zeynep',
      vaccineCardNo: 'YP-84920',
      dailyStreak: 5,
      streakClaimedToday: false,
      lastStreakClaimDate: '',
      isInPark: false,
      parkLocation: 'Bebek Parkı, İstanbul',
      vaccines: [
        { id: 'parasite', name: 'İç / Dış Parazit Damlası', dueDate: '2026-10-21', daysLeft: 4, status: 'warning', icon: '💧', note: 'Ense damlası & parazit tableti' },
        { id: 'karma', name: 'Karma Aşı (DHPPi)', dueDate: '2027-10-15', completedDate: '15 Ekim 2026', daysLeft: 363, status: 'completed', icon: '💉', note: 'Yıllık tekrar dozu (Tamamlandı)' },
        { id: 'rabies', name: 'Kuduz Aşısı', dueDate: '2027-08-02', completedDate: '02 Ağustos 2026', daysLeft: 289, status: 'completed', icon: '🛡️', note: 'Yasal zorunlu aşı (Tamamlandı)' },
        { id: 'kennel', name: 'Bordetella (Barınak Öksürüğü)', dueDate: '2026-11-04', daysLeft: 18, status: 'pending', icon: '🦠', note: 'Burun damlası / aşı' },
        { id: 'grooming', name: 'Kürk Bakım & Traş (Grooming)', dueDate: '2026-10-29', daysLeft: 12, status: 'pending', icon: '✂️', note: 'Poodle tüy düğümlenme kontrolü' }
      ],
      weightHistory: [
        { month: 'Mayıs', weight: 2.40 },
        { month: 'Haziran', weight: 2.55 },
        { month: 'Temmuz', weight: 2.70 },
        { month: 'Ağustos', weight: 2.80 },
        { month: 'Eylül', weight: 2.82 },
        { month: 'Ekim', weight: 2.85 }
      ],
      privacySettings: {
        isProfilePrivate: false,
        showPhoneOnQr: false,
        phoneNumber: '+90 532 555 01 23',
        parkBroadcast: true,
        lostModeEnabled: false,
        lostRewardAmount: '5.000 TL',
        pushNotifications: {
          dm: true,
          vaccines: true,
          parks: true
        }
      },
      pawHistory: [
        { amount: 50, reason: 'İlk fotoğraf paylaşıldı 📸', time: '1 gün önce' },
        { amount: 25, reason: 'Fotoğraflara 5 beğeni geldi ❤️', time: '2 gün önce' },
        { amount: 50, reason: 'Hoş geldin bonusu 🎉', time: '3 gün önce' }
      ],
      isVerified: false,
      verificationData: null
    };

    let currentUser = JSON.parse(localStorage.getItem('yp_current_user')) || DEFAULT_USER;
    if (!currentUser.pawPoints) currentUser.pawPoints = 125;
    if (!currentUser.pawHistory) currentUser.pawHistory = DEFAULT_USER.pawHistory;
    if (!currentUser.microchip) currentUser.microchip = DEFAULT_USER.microchip;
    if (!currentUser.birthDate) currentUser.birthDate = DEFAULT_USER.birthDate;
    if (!currentUser.weight) currentUser.weight = DEFAULT_USER.weight;
    if (!currentUser.ownerName) currentUser.ownerName = DEFAULT_USER.ownerName;
    if (!currentUser.dailyStreak) currentUser.dailyStreak = DEFAULT_USER.dailyStreak;
    if (!currentUser.vaccines) currentUser.vaccines = DEFAULT_USER.vaccines;
    if (!currentUser.weightHistory) currentUser.weightHistory = DEFAULT_USER.weightHistory;
    if (!currentUser.privacySettings) currentUser.privacySettings = DEFAULT_USER.privacySettings;
    if (currentUser.isVerified === undefined) currentUser.isVerified = DEFAULT_USER.isVerified;
    if (currentUser.verificationData === undefined) currentUser.verificationData = DEFAULT_USER.verificationData;

    function getVerifiedPawBadgeHtml(sizeClass = 'size-4', extraClasses = '') {
      return `<span class="inline-flex items-center justify-center shrink-0 align-middle ${extraClasses}" title="Doğrulanmış Poodle Hesabı (Mavi Pati) 🐾">
        <svg class="${sizeClass} text-[#0095f6]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6z"/>
          <ellipse cx="11.6" cy="14.3" rx="3.3" ry="2.6" fill="#ffffff"/>
          <circle cx="7.7" cy="10.8" r="1.15" fill="#ffffff"/>
          <circle cx="10.2" cy="8.6" r="1.15" fill="#ffffff"/>
          <circle cx="13.2" cy="8.6" r="1.15" fill="#ffffff"/>
          <circle cx="15.7" cy="10.8" r="1.15" fill="#ffffff"/>
        </svg>
      </span>`;
    }

    const AI_PERSONA_USERNAMES = [
      'aras_vet_standard',
      'claire_toypoodle_paris',
      'barnaby_minipoodle_uk',
      'hannah_poodle_berlin',
      'selin_milo_toypoodle',
      'kenji_silver_hana',
      'elena_standard_max'
    ];

    function getAiGuideBadgeHtml(extraClasses = '') {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 select-none align-middle ${extraClasses}" title="YourPoodle AI Topluluk Rehberi — Bilgilendirici ve eğitici içerik asistanı">
        <span class="text-xs">🤖</span>
        <span class="tracking-tight">AI Rehber</span>
      </span>`;
    }

    // Stories Data (Rich Global Toy Poodle Community)
    const storiesData = [
      { id: 1, username: 'mochi.poodle', avatar: '/images/poodle_mochi.jpg', storyImg: '/images/poodle_mochi.jpg', hasUnseen: true },
      { id: 2, username: 'luna_paris', avatar: '/images/poodle_luna.jpg', storyImg: '/images/poodle_luna.jpg', hasUnseen: true },
      { id: 3, username: 'teddy_fluff', avatar: '/images/poodle_teddy.jpg', storyImg: '/images/poodle_teddy.jpg', hasUnseen: true },
      { id: 4, username: 'coco_biscuit', avatar: '/images/poodle_coco.jpg', storyImg: '/images/poodle_coco.jpg', hasUnseen: true },
      { id: 5, username: 'bella_toypoodle', avatar: '/images/poodle_bella.jpg', storyImg: '/images/poodle_bella.jpg', hasUnseen: true },
      { id: 6, username: 'oliver_star', avatar: '/images/poodle_oliver.jpg', storyImg: '/images/poodle_oliver.jpg', hasUnseen: true },
      { id: 7, username: 'milo_puppy', avatar: '/images/poodle_milo.jpg', storyImg: '/images/poodle_milo.jpg', hasUnseen: true },
      { id: 8, username: 'charlie_apricot', avatar: '/images/poodle_mochi.jpg', storyImg: '/images/poodle_mochi.jpg', hasUnseen: true },
      { id: 9, username: 'daisy_silver', avatar: '/images/poodle_luna.jpg', storyImg: '/images/poodle_luna.jpg', hasUnseen: true },
      { id: 10, username: 'koko_tokyo', avatar: '/images/poodle_teddy.jpg', storyImg: '/images/poodle_teddy.jpg', hasUnseen: true },
      { id: 11, username: 'rocky_london', avatar: '/images/poodle_coco.jpg', storyImg: '/images/poodle_coco.jpg', hasUnseen: true },
      { id: 12, username: 'bailey_red', avatar: '/images/poodle_bella.jpg', storyImg: '/images/poodle_bella.jpg', hasUnseen: true }
    ];

    // Posts Feed Data
    let postsData = [
      {
        id: 101,
        username: 'mochi_toypoodle',
        userAvatar: '/images/poodle_mochi.jpg',
        location: 'Bebek Parkı, İstanbul',
        verified: true,
        timeAgo: '2 sa',
        image: '/images/poodle_mochi.jpg',
        likes: 1420,
        isLiked: false,
        isSaved: false,
        caption: 'Bugün hava tam park havasıydı! Bebek parkında yeni arkadaşlarla tanıştık 🐾 Güneşli günleri kim sevmez ki? ☀️🐩',
        hashtags: '#toypoodle #redtoypoodle #bebeksahili #poodlelife #dogsofistanbul',
        comments: [
          { user: 'luna_paris', text: 'Ayy inanılmaz tatlı olmuş maşallah! 😍❤️' },
          { user: 'teddy_fluff', text: 'Tüylerin bakımı harika görünüyor ✂️' }
        ]
      },
      {
        id: 102,
        username: 'luna_parisienne',
        userAvatar: '/images/poodle_luna.jpg',
        location: 'Jardin des Tuileries, Paris',
        verified: true,
        timeAgo: '4 sa',
        image: '/images/poodle_luna.jpg',
        likes: 2890,
        isLiked: false,
        isSaved: false,
        caption: 'Croissant and morning stroll 🥐✨ Poodle zarafeti diye bir şey var gerçekten... Herkese mutlu günler! 🤍',
        hashtags: '#paris #toypoodletravel #poodlelove #fluffydog',
        comments: [
          { user: 'coco_biscuit', text: 'Paris sana çok yakışmış prenses! 👑' }
        ]
      },
      {
        id: 103,
        username: 'teddy_bear_grooming',
        userAvatar: '/images/poodle_teddy.jpg',
        location: 'Nişantaşı, İstanbul',
        verified: true,
        timeAgo: '6 sa',
        image: '/images/poodle_teddy.jpg',
        likes: 3154,
        isLiked: false,
        isSaved: false,
        caption: 'Yeni Teddy Bear kesimimiz nasıl olmuş? ✂️🧸 Yüzdeki o yuvarlak kulak detaylarına bayılıyorum! Yorumlarınızı bekliyorum 👇',
        hashtags: '#toypoodlegrooming #teddycut #poodlekesim #nisantasi #doggroomer',
        comments: [
          { user: 'mochi_toypoodle', text: 'Biz de geleceğiz haftaya randevu için! ✂️🐩' },
          { user: 'oliver_star', text: '10 üzerinden 10 kusursuz kesim 👏' }
        ]
      },
      {
        id: 104,
        username: 'coco_and_biscuit',
        userAvatar: '/images/poodle_coco.jpg',
        location: 'Moda Sahili, Kadıköy',
        verified: false,
        timeAgo: '8 sa',
        image: '/images/poodle_coco.jpg',
        likes: 984,
        isLiked: false,
        isSaved: false,
        caption: 'Kardeş payı 🦴 Biri mama dediğinde ikimizin de kulakları aynı anda dikiliyor haha! Moda sahilinde koşmaca 🏃‍♂️🐩',
        hashtags: '#poodletwins #modasahil #toypoodlelove #puppylove',
        comments: [
          { user: 'milo_puppy', text: 'İkizler harikasınız yaa 🐾' }
        ]
      },
      {
        id: 105,
        username: 'bella_the_princess',
        userAvatar: '/images/poodle_bella.jpg',
        location: 'Zorlu Center, İstanbul',
        verified: true,
        timeAgo: '12 sa',
        image: '/images/poodle_bella.jpg',
        likes: 1842,
        isLiked: false,
        isSaved: false,
        caption: 'Yeni kırmızı fiyonkumla poz vermeyi çok seviyorum 🎀 Pazar gününün keyfi YourPoodle ailesiyle çıkar! Mutlu pazarlar 🌸',
        hashtags: '#poodleprincess #redpoodle #cutepets #yourpoodle',
        comments: []
      },
      {
        id: 106,
        username: 'oliver_fluffball',
        userAvatar: '/images/poodle_oliver.jpg',
        location: 'Kensington Gardens, London',
        verified: true,
        timeAgo: '1 gün',
        image: '/images/poodle_oliver.jpg',
        likes: 2410,
        isLiked: false,
        isSaved: false,
        caption: 'Autumn vibes in London 🍁 Topumu kovalarken yaprakların arasında kayboldum resmen 🎾🇬🇧',
        hashtags: '#londonpoodles #toypoodleworld #autumnvibes #doglife',
        comments: []
      }
    ];

    // Reels Data
    const reelsData = [
      {
        id: 'reel_mochi_park_1',
        username: 'mochi_toypoodle',
        avatar: '/images/poodle_mochi.jpg',
        caption: 'Bebek Parkı\'nda top yakalama şovu! 🎾🐾 Poodle enerjisi ve çevikliği bir başka... Sizce topu yakalayabildim mi? 🐩🎬',
        audio: '🎵 Mochi Upbeat Walk · Park Vibe Beats',
        image: '/uploads/poodle_reel_mochi_thumb.jpg',
        videoUrl: '/uploads/poodle_reel_mochi.mp4',
        hlsUrl: '/uploads/hls/poodle_reel_mochi/index.m3u8',
        likes: '48.2B',
        comments: '1.2B'
      },
      {
        id: 201,
        username: 'mochi_toypoodle',
        avatar: '/images/poodle_mochi.jpg',
        caption: 'Mama paketinin açılma sesini duyunca yaptığım 360 spin hareketi 😂🌪️ Bekleyenler beğensin!',
        audio: '🎵 Poodle Morning Dance · Orijinal Ses',
        image: '/images/poodle_mochi.jpg',
        likes: '34.2B',
        comments: '482'
      },
      {
        id: 202,
        username: 'luna_parisienne',
        avatar: '/images/poodle_luna.jpg',
        caption: 'Banyo sonrası deli dana gibi koşma seansı (Zoomies!) 🛁💨 Kimin Poodle’ı böyle?',
        audio: '🎵 Zoomies Anthem · Viral Sound',
        image: '/images/poodle_luna.jpg',
        likes: '51.9B',
        comments: '891'
      },
      {
        id: 203,
        username: 'teddy_bear_grooming',
        avatar: '/images/poodle_teddy.jpg',
        caption: '15 saniyede Teddy Bear kesim dönüşümü ✨✂️ Makas ustalık işidir.',
        audio: '🎵 Aesthetic Grooming Beats · Relaxing',
        image: '/images/poodle_teddy.jpg',
        likes: '22.8B',
        comments: '310'
      }
    ];

    // Suggested Accounts Data
    const suggestedData = [
      { username: 'paris_poodles', desc: 'Paris · Yeni hesap', avatar: '/images/poodle_luna.jpg' },
      { username: 'charlie_the_curly', desc: 'İzmir · Önerilen', avatar: '/images/poodle_charlie.jpg' },
      { username: 'biscuit_toy', desc: 'İstanbul · Seni takip ediyor', avatar: '/images/poodle_biscuit.jpg' },
      { username: 'milo_fluffy', desc: 'Antalya · Popüler Poodle', avatar: '/images/poodle_milo.jpg' }
    ];

    // DM Conversations Data
    let dmData = [
      {
        id: 1,
        name: 'luna_parisienne',
        user: 'luna_parisienne',
        msg: 'Süper, Cumartesi 14:00\'te oradayız! ☀️',
        time: '15d',
        avatar: '/images/poodle_luna.jpg',
        messages: [
          { sender: 'luna_parisienne', text: 'Merhaba! Bebek Parkı\'nda buluşalım mı bu hafta sonu? Mochi ile Luna çok iyi anlaşıyor 🐩✨' },
          { sender: 'me', text: 'Harika olur! Cumartesi saat 14:00 uygun mu size? 🐾' },
          { sender: 'luna_parisienne', text: 'Süper, Cumartesi 14:00\'te oradayız! Görüşürüz ☀️' }
        ]
      },
      {
        id: 2,
        name: 'teddy_bear_grooming',
        user: 'teddy_bear_grooming',
        msg: 'Randevunuz oluşturuldu ✂️',
        time: '2s',
        avatar: '/images/poodle_teddy.jpg',
        messages: [
          { sender: 'teddy_bear_grooming', text: 'Merhaba, Teddy Bear kesim için yarın 15:30 uygun ✂️🐩' },
          { sender: 'me', text: 'Teşekkürler, randevuyu onaylıyorum 🦴' },
          { sender: 'teddy_bear_grooming', text: 'Randevunuz oluşturuldu ✂️' }
        ]
      },
      {
        id: 3,
        name: 'coco_and_biscuit',
        user: 'coco_and_biscuit',
        msg: 'Mamayı nereden sipariş verdiniz?',
        time: '1g',
        avatar: '/images/poodle_coco.jpg',
        messages: [
          { sender: 'coco_and_biscuit', text: 'Merhaba! Mochi\'nin tüyleri harika parlıyor ✨ Mamayı nereden sipariş verdiniz? 🐾' }
        ]
      },
      {
        id: 4,
        name: 'bella_the_princess',
        user: 'bella_the_princess',
        msg: 'Fiyonk nereden aldınız link var mı?',
        time: '2g',
        avatar: '/images/poodle_bella.jpg',
        messages: [
          { sender: 'bella_the_princess', text: 'Selamlar! Bella için pembe fiyonk arıyorum, nereden aldınız link var mı? 🎀' }
        ]
      }
    ];

    // ================= PATİ PUANI (PAW POINTS) ENGINE =================
    function getPawRank(points) {
      if (points >= 1000) return 'Poodle Fenomeni 👑';
      if (points >= 500) return 'Park Yıldızı ⭐';
      if (points >= 100) return 'Kıvırcık Kaşif 🎾';
      return 'Yavru Pati 🐾';
    }

    function addPawPoints(amount, reason) {
      currentUser.pawPoints = (currentUser.pawPoints || 0) + amount;
      currentUser.pawRank = getPawRank(currentUser.pawPoints);

      if (!currentUser.pawHistory) currentUser.pawHistory = [];
      currentUser.pawHistory.unshift({
        amount: amount,
        reason: reason,
        time: 'Az önce'
      });

      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      updatePawPointsUI();
      showPawCelebration(amount, reason);
    }

    function showPawCelebration(amount, reason) {
      const toast = document.getElementById('paw-toast');
      document.getElementById('paw-toast-text').innerText = `+${amount} Pati Puanı Kazandın! 🐾 (${reason})`;
      toast.classList.remove('-translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-4', 'opacity-100');
      setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-100');
        toast.classList.add('-translate-y-24', 'opacity-0');
      }, 3000);
    }

    function updatePawPointsUI() {
      const points = currentUser.pawPoints || 0;
      const rank = getPawRank(points);

      // Elements to update
      const targets = [
        document.getElementById('sidebar-paw-points'),
        document.getElementById('sidebar-box-paw-points'),
        document.getElementById('sidebar-snippet-points'),
        document.getElementById('mobile-paw-points'),
        document.getElementById('profile-paw-points'),
        document.getElementById('paw-modal-points-display')
      ];

      targets.forEach(el => {
        if (el) el.innerText = points;
      });

      const profileRankBadge = document.getElementById('profile-badge-rank');
      if (profileRankBadge) profileRankBadge.innerText = rank;

      const modalRankBadge = document.getElementById('paw-modal-rank-badge');
      if (modalRankBadge) modalRankBadge.innerText = rank;

      // Progress bar inside modal
      const progressBar = document.getElementById('paw-modal-progress-bar');
      const progressLabel = document.getElementById('paw-modal-progress-label');
      if (progressBar && progressLabel) {
        let max = 500;
        if (points >= 500) max = 1000;
        if (points >= 1000) max = points;
        const percent = Math.min(100, Math.round((points / max) * 100));
        progressBar.style.width = percent + '%';
        progressLabel.innerText = `${points} / ${max}`;
      }

      // Render History in modal
      const historyList = document.getElementById('paw-history-list');
      if (historyList && currentUser.pawHistory) {
        historyList.innerHTML = currentUser.pawHistory.map(h => `
          <div class="p-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg flex items-center justify-between border border-[#dbdbdb] dark:border-[#333]">
            <div class="flex items-center gap-2">
              <span class="text-amber-500 font-extrabold">+${h.amount} 🐾</span>
              <span class="font-medium">${h.reason}</span>
            </div>
            <span class="text-[10px] text-[#737373]">${h.time}</span>
          </div>
        `).join('');
      }
    }

    function openPawPointsModal() {
      updatePawPointsUI();
      document.getElementById('paw-modal').classList.remove('hidden');
    }

    function closePawPointsModal() {
      document.getElementById('paw-modal').classList.add('hidden');
    }

    // ================= AUTH MANAGEMENT (PHONE & NETGSM 4-DIGIT OTP) =================
    let authMode = 'signup'; // 'signup' or 'login'
    let otpSent = false;
    let pendingPhone = '';
    let otpCountdownInterval = null;
    let resendCooldownInterval = null;

    function formatPhoneInput(input) {
      let v = input.value.replace(/\D/g, '');
      if (v.startsWith('0')) v = v.substring(1);
      if (v.length > 10) v = v.substring(0, 10);
      
      let formatted = '';
      if (v.length > 0) formatted += v.substring(0, 3);
      if (v.length > 3) formatted += ' ' + v.substring(3, 6);
      if (v.length > 6) formatted += ' ' + v.substring(6, 8);
      if (v.length > 8) formatted += ' ' + v.substring(8, 10);
      input.value = formatted;
    }

    function switchAuthModeTab(mode) {
      authMode = mode;
      otpSent = false;
      clearInterval(otpCountdownInterval);
      clearInterval(resendCooldownInterval);
      
      const tabSignup = document.getElementById('auth-tab-signup');
      const tabLogin = document.getElementById('auth-tab-login');
      if (tabSignup && tabLogin) {
        if (mode === 'signup') {
          tabSignup.className = 'py-2 rounded-lg bg-white dark:bg-[#2a2a2a] text-black dark:text-white shadow-xs transition';
          tabLogin.className = 'py-2 rounded-lg text-gray-500 hover:text-black dark:hover:text-white transition';
        } else {
          tabLogin.className = 'py-2 rounded-lg bg-white dark:bg-[#2a2a2a] text-black dark:text-white shadow-xs transition';
          tabSignup.className = 'py-2 rounded-lg text-gray-500 hover:text-black dark:hover:text-white transition';
        }
      }
      updateAuthModalUI();
    }

    function toggleAuthMode() {
      switchAuthModeTab(authMode === 'signup' ? 'login' : 'signup');
    }

    function openAuthModal(mode = 'signup') {
      const savedPhone = localStorage.getItem('yp_saved_phone');
      if (mode === 'login' && savedPhone) {
        fetch(`/api/live/auth/pattern/check?phone=${encodeURIComponent(savedPhone)}`)
          .then(r => r.json())
          .then(data => {
            if (data.ok && data.has_pattern) {
              document.getElementById('auth-modal')?.classList.remove('hidden');
              showPatternView('LOGIN', savedPhone, data.displayName, data.avatar);
            } else {
              showSmsAuthModal(mode);
            }
          })
          .catch(() => showSmsAuthModal(mode));
        return;
      }
      showSmsAuthModal(mode);
    }

    function showSmsAuthModal(mode = 'signup') {
      switchToSmsOtpMode();
      switchAuthModeTab(mode);
      const phoneInput = document.getElementById('auth-input-phone');
      if (phoneInput && !phoneInput.value && localStorage.getItem('yp_saved_phone')) {
        phoneInput.value = localStorage.getItem('yp_saved_phone');
      }
      const otpInput = document.getElementById('auth-input-otp');
      if (otpInput) otpInput.value = '';
      document.getElementById('auth-modal')?.classList.remove('hidden');
    }

    function closeAuthModal() {
      document.getElementById('auth-modal').classList.add('hidden');
      clearInterval(otpCountdownInterval);
      clearInterval(resendCooldownInterval);
    }

    function changeAuthPhone() {
      otpSent = false;
      clearInterval(otpCountdownInterval);
      clearInterval(resendCooldownInterval);
      updateAuthModalUI();
      const phoneInput = document.getElementById('auth-input-phone');
      if (phoneInput) {
        phoneInput.focus();
      }
    }

    function updateAuthModalUI() {
      const isSignup = (authMode === 'signup');
      const subtitle = document.getElementById('auth-subtitle');
      if (subtitle) {
        subtitle.innerText = isSignup 
          ? _yp("Poodle'ın için telefon numaranla hemen kaydol (+100 Pati Puanı kazan) 🐾")
          : _yp("Telefon numaranıza SMS ile gelen 4 haneli kod ile anında giriş yapın 📲");
      }
      
      const phoneContainer = document.getElementById('auth-phone-container');
      const signupFields = document.getElementById('auth-signup-fields');
      const otpField = document.getElementById('auth-otp-field');
      const submitBtn = document.getElementById('auth-submit-btn');
      const switchText = document.getElementById('auth-switch-text');
      const switchBtn = document.getElementById('auth-switch-btn');
      const socialBox = document.getElementById('auth-social-box');

      if (phoneContainer) phoneContainer.classList.toggle('hidden', otpSent);
      if (signupFields) signupFields.classList.toggle('hidden', !isSignup || otpSent);
      if (otpField) otpField.classList.toggle('hidden', !otpSent);
      if (socialBox) socialBox.classList.toggle('hidden', otpSent);

      if (submitBtn) {
        if (otpSent) {
          submitBtn.innerHTML = '<span>' + _yp('4 Haneli Kodu Doğrula ve Başla ✓') + '</span>';
          submitBtn.className = 'w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2';
        } else {
          submitBtn.innerHTML = isSignup 
            ? '<span>' + _yp('SMS Doğrulama Kodu Gönder 📲 (+100 Pati)') + '</span>' 
            : '<span>' + _yp('Giriş Kodunu SMS ile Gönder 📲') + '</span>';
          submitBtn.className = 'w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2';
        }
      }

      if (switchText) switchText.innerText = isSignup ? _yp('Zaten bir hesabın var mı?') : _yp('Poodle hesabın yok mu?');
      if (switchBtn) switchBtn.innerText = isSignup ? _yp('Giriş Yap') : _yp('Poodle Hesabı Aç');
    }

    function handleOtpInput(input) {
      input.value = input.value.replace(/\D/g, '').substring(0, 4);
      if (input.value.length === 4) {
        const fakeEvent = { preventDefault: () => {} };
        handleAuthSubmit(fakeEvent);
      }
    }

    function startOtpTimers(expiresIn = 180, cooldown = 45) {
      clearInterval(otpCountdownInterval);
      clearInterval(resendCooldownInterval);

      let expLeft = expiresIn;
      const countEl = document.getElementById('auth-otp-countdown');
      const updateExpText = () => {
        const m = Math.floor(expLeft / 60);
        const s = expLeft % 60;
        if (countEl) countEl.innerHTML = `⏳ Kalan Süre: <strong>${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}</strong>`;
      };
      updateExpText();
      otpCountdownInterval = setInterval(() => {
        expLeft--;
        if (expLeft <= 0) {
          clearInterval(otpCountdownInterval);
          if (countEl) countEl.innerHTML = '<span class="text-rose-500 font-bold">Kod süresi doldu!</span>';
        } else {
          updateExpText();
        }
      }, 1000);

      let resendLeft = cooldown;
      const resendBtn = document.getElementById('auth-resend-btn');
      if (resendBtn) {
        resendBtn.disabled = true;
        resendBtn.innerText = `Tekrar Kod Gönder (${resendLeft}s)`;
      }
      resendCooldownInterval = setInterval(() => {
        resendLeft--;
        if (resendLeft <= 0) {
          clearInterval(resendCooldownInterval);
          if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.innerText = 'Tekrar Kod Gönder 📲';
          }
        } else {
          if (resendBtn) resendBtn.innerText = `Tekrar Kod Gönder (${resendLeft}s)`;
        }
      }, 1000);
    }

    async function resendOtpCode() {
      if (!pendingPhone) {
        showToast('Lütfen önce telefon numaranızı giriniz.');
        return;
      }
      showToast('Yeni 4 haneli SMS kodu isteniyor...');
      try {
        const res = await fetch('/api/live/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: pendingPhone, purpose: authMode })
        }).then(r => r.json());

        if (res.ok) {
          startOtpTimers(res.expires_in || 180, res.cooldown || 45);
          showToast(res.message || 'Yeni 4 haneli kod SMS ile gönderildi! 📲');
        } else {
          showToast(res.error || 'SMS gönderilemedi, lütfen tekrar deneyiniz.');
        }
      } catch(err) {
        showToast('Bağlantı hatası oluştu.');
      }
    }

    async function handleAuthSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      
      const phoneInput = document.getElementById('auth-input-phone');
      const rawPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      const poodlename = document.getElementById('auth-input-poodlename')?.value?.trim() || 'Mochi';
      const username = document.getElementById('auth-input-username')?.value?.trim() || poodlename.toLowerCase().replace(/\s+/g, '_') + '_poodle';
      const variety = document.getElementById('auth-input-variety')?.value || 'Toy Poodle';
      const color = document.getElementById('auth-input-color')?.value || 'Red Apricot';

      // STEP 1: Send SMS OTP
      if (!otpSent) {
        if (!rawPhone || rawPhone.length < 10) {
          showToast('Lütfen 10 haneli geçerli bir cep telefonu numarası giriniz (Örn: 532 123 45 67)');
          if (phoneInput) phoneInput.focus();
          return;
        }

        const submitBtn = document.getElementById('auth-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Kontrol Ediliyor... ⏳</span>';
        }

        try {
          // Giriş modunda önce kullanıcının kayıtlı sembolü olup olmadığını kontrol et
          if (authMode === 'login') {
            const checkRes = await fetch(`/api/live/auth/pattern/check?phone=${encodeURIComponent(rawPhone)}`)
              .then(r => r.json())
              .catch(() => null);

            if (checkRes && checkRes.ok && checkRes.has_pattern) {
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Devam Et →</span>';
              }
              pendingPhone = rawPhone;
              patternState.phone = rawPhone;
              localStorage.setItem('yp_saved_phone', rawPhone);
              showPatternView('LOGIN', rawPhone, checkRes.displayName, checkRes.avatar);
              return;
            }
          }

          if (submitBtn) submitBtn.innerHTML = '<span>SMS Gönderiliyor... ⏳</span>';

          const res = await fetch('/api/live/auth/otp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: rawPhone, purpose: authMode })
          }).then(r => r.json());

          if (submitBtn) submitBtn.disabled = false;

          if (res.ok) {
            otpSent = true;
            pendingPhone = rawPhone;
            updateAuthModalUI();
            
            const displayEl = document.getElementById('auth-otp-phone-display');
            if (displayEl) {
              displayEl.innerText = res.phone_masked || `+90 ${rawPhone}`;
            }

            startOtpTimers(res.expires_in || 180, res.cooldown || 45);
            showToast(res.message || '4 haneli doğrulama kodu SMS ile gönderildi! 📲');

            const otpInput = document.getElementById('auth-input-otp');
            if (otpInput) {
              otpInput.value = '';
              setTimeout(() => otpInput.focus(), 200);
            }
          } else {
            showToast(res.error || 'Doğrulama kodu gönderilemedi.');
            updateAuthModalUI();
          }
        } catch(err) {
          if (submitBtn) submitBtn.disabled = false;
          showToast('Sunucu bağlantı hatası oluştu.');
          updateAuthModalUI();
        }
        return;
      }

      // STEP 2: Verify 4-Digit OTP Code
      const otpInput = document.getElementById('auth-input-otp');
      const code = otpInput ? otpInput.value.replace(/\D/g, '') : '';
      if (!code || code.length !== 4) {
        showToast('Lütfen 4 haneli SMS kodunu eksiksiz giriniz.');
        if (otpInput) otpInput.focus();
        return;
      }

      const submitBtn = document.getElementById('auth-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Kod Doğrulanıyor... ⏳</span>';
      }

      try {
        const res = await fetch('/api/live/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: pendingPhone,
            code: code,
            purpose: authMode,
            poodle_name: poodlename,
            username: username,
            variety: variety,
            color: color
          })
        }).then(r => r.json());

        if (submitBtn) submitBtn.disabled = false;

        if (res.ok && res.user) {
          clearInterval(otpCountdownInterval);
          clearInterval(resendCooldownInterval);

          currentUser = {
            ...DEFAULT_USER,
            ...res.user,
            isLoggedIn: true,
            postsCount: res.user.postsCount || 1,
            followersCount: res.user.followersCount || '1',
            pawPoints: res.user.pawPoints || 100,
            pawHistory: [
              { amount: 100, reason: 'Telefon doğrulandı! Hoş geldin bonusu 🐾', time: 'Az önce' }
            ]
          };

          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
          if (pendingPhone) {
            localStorage.setItem('yp_saved_phone', pendingPhone);
          }
          updateUIAfterAuth();
          updatePawPointsUI();
          renderDashboardUI();

          // KULLANICI HENÜZ SEMBOL BELİRLEMEMİŞSE YA DA SIFIRLAMA İÇİNSE SEMBOL ÇİZDİR!
          const needsPattern = res.needs_pattern !== false && (!res.user.hasPattern || res.is_reset_flow || authMode === 'signup' || !currentUser.hasPattern);

          if (needsPattern || res.is_reset_flow) {
            patternState.pendingUser = res.user;
            patternState.phone = pendingPhone;
            patternState.username = res.user.username;
            const mode = res.is_reset_flow ? 'RESET_1' : 'SETUP_1';
            showToast('Telefon onaylandı! Şimdi sonraki girişleriniz için güvenlik sembolünüzü çizin 🐾🔒');
            showPatternView(mode, pendingPhone, res.user.displayName || res.user.username, res.user.avatar);
            return;
          }

          closeAuthModal();

          if (res.user.isNewUser || authMode === 'signup') {
            showPawCelebration(100, 'Telefon Doğrulama Bonusu 🎉');
          }
          showToast(res.message || "Giriş başarılı! YourPoodle'a hoş geldiniz 🐾");
          switchTab('home');
        } else {
          showToast(res.error || 'Hatalı kod girdiniz.');
          if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
          }
          if (submitBtn) submitBtn.innerHTML = '<span>4 Haneli Kodu Doğrula ve Başla ✓</span>';
        }
      } catch(err) {
        if (submitBtn) submitBtn.disabled = false;
        showToast('Doğrulama sırasında bağlantı hatası oluştu.');
      }
    }

    // ================= REAL OAUTH 2.0 SOCIAL AUTHENTICATION (GOOGLE & APPLE) =================
    let currentSocialOAuthProvider = 'google';

    function handleGoogleLoginClick() {
      currentSocialOAuthProvider = 'google';
      const modal = document.getElementById('social-oauth-modal');
      const logoEl = document.getElementById('social-oauth-logo');
      const titleEl = document.getElementById('social-oauth-title');
      const subtitleEl = document.getElementById('social-oauth-subtitle');
      const nameInp = document.getElementById('social-oauth-input-name');
      const emailInp = document.getElementById('social-oauth-input-email');
      const avatarEl = document.getElementById('social-oauth-avatar');
      const btnText = document.getElementById('social-oauth-btn-text');

      if (!modal) return;

      if (logoEl) {
        logoEl.className = 'size-14 rounded-2xl bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#383838] flex items-center justify-center shadow-xs';
        logoEl.innerHTML = `
          <svg class="size-8" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        `;
      }

      if (titleEl) titleEl.innerText = 'Google ile Giriş Yap';
      if (subtitleEl) subtitleEl.innerText = 'Google hesabınızla tek tıkla güvenle bağlanın ve hemen topluluğa katılın.';
      if (avatarEl) avatarEl.src = '/images/poodle_luna.jpg';
      if (nameInp) nameInp.value = localStorage.getItem('yp_saved_google_name') || 'Alexandre Dumas';
      if (emailInp) emailInp.value = localStorage.getItem('yp_saved_google_email') || 'alexandre.dumas@gmail.com';
      if (btnText) btnText.innerText = 'Google ile Oturum Aç ⚡';

      modal.classList.remove('hidden');
    }

    function handleAppleLoginClick() {
      currentSocialOAuthProvider = 'apple';
      const modal = document.getElementById('social-oauth-modal');
      const logoEl = document.getElementById('social-oauth-logo');
      const titleEl = document.getElementById('social-oauth-title');
      const subtitleEl = document.getElementById('social-oauth-subtitle');
      const nameInp = document.getElementById('social-oauth-input-name');
      const emailInp = document.getElementById('social-oauth-input-email');
      const avatarEl = document.getElementById('social-oauth-avatar');
      const btnText = document.getElementById('social-oauth-btn-text');

      if (!modal) return;

      if (logoEl) {
        logoEl.className = 'size-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-xs';
        logoEl.innerHTML = `
          <svg class="size-8 fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.71-7.91-12.04-14.49-6.3-9.61-11.27-20.44-14.91-32.47-3.64-12.03-5.46-23.23-5.46-33.6 0-14.73 3.65-26.69 10.96-35.88 7.31-9.19 16.51-13.88 27.6-14.07 4.89 0 10.42 1.34 16.6 4.02 6.18 2.68 10.12 4.08 11.83 4.2 1.71-.12 5.92-1.58 12.63-4.37 6.71-2.79 12.07-4.08 16.08-3.87 11.41.67 20.67 4.96 27.78 12.87-9.84 5.97-14.67 14.33-14.49 25.08.2 8.35 3.51 15.48 9.94 21.41 6.43 5.93 14.19 9.38 23.28 10.36-2.16 6.83-4.87 13.82-8.13 20.97zM119.22 33.15c0-7.39 2.67-14.38 8.01-20.97 5.34-6.59 11.96-10.99 19.86-13.18.23 1.25.35 2.45.35 3.6 0 7.39-2.73 14.46-8.19 21.21-5.46 6.75-12.28 11.12-20.46 13.11-.46-1.25-.69-2.51-.69-3.77z"/>
          </svg>
        `;
      }

      if (titleEl) titleEl.innerText = 'Apple ile Giriş Yap';
      if (subtitleEl) subtitleEl.innerText = 'Apple Kimliğinizle gizli ve güvenli şekilde YourPoodle ailesine katılın.';
      if (avatarEl) avatarEl.src = '/images/poodle_coco.jpg';
      if (nameInp) nameInp.value = localStorage.getItem('yp_saved_apple_name') || 'Marie Curie';
      if (emailInp) emailInp.value = localStorage.getItem('yp_saved_apple_email') || 'marie.curie@icloud.com';
      if (btnText) btnText.innerText = 'Apple ile Devam Et 🍎';

      modal.classList.remove('hidden');
    }

    function closeSocialAuthModal() {
      const modal = document.getElementById('social-oauth-modal');
      if (modal) modal.classList.add('hidden');
    }

    async function confirmSocialAuthLogin() {
      const btn = document.getElementById('social-oauth-confirm-btn');
      const btnText = document.getElementById('social-oauth-btn-text');
      const nameInp = document.getElementById('social-oauth-input-name');
      const emailInp = document.getElementById('social-oauth-input-email');

      const nameVal = (nameInp ? nameInp.value.trim() : '') || (currentSocialOAuthProvider === 'google' ? 'Google Dostu' : 'Apple Dostu');
      const emailVal = (emailInp ? emailInp.value.trim() : '') || `${currentSocialOAuthProvider}_user@yourpoodle.com`;

      if (btn) btn.disabled = true;
      if (btnText) btnText.innerText = 'Bağlantı kuruluyor... 🔒';

      try {
        let hash = 0;
        for (let i = 0; i < emailVal.length; i++) {
          hash = ((hash << 5) - hash) + emailVal.charCodeAt(i);
          hash |= 0;
        }
        const oauthId = `${currentSocialOAuthProvider}_sub_${Math.abs(hash)}`;
        const avatarUrl = currentSocialOAuthProvider === 'google' ? '/images/poodle_luna.jpg' : '/images/poodle_coco.jpg';

        const res = await fetch('/api/live/auth/oauth/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: currentSocialOAuthProvider,
            email: emailVal,
            name: nameVal,
            avatar: avatarUrl,
            oauth_id: oauthId
          })
        });

        const data = await res.json();
        if (data.ok && data.user) {
          currentUser = data.user;
          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
          localStorage.setItem('yp_saved_' + currentSocialOAuthProvider + '_email', emailVal);
          localStorage.setItem('yp_saved_' + currentSocialOAuthProvider + '_name', nameVal);

          updateUIAfterAuth();
          updatePawPointsUI();
          closeSocialAuthModal();
          closeAuthModal();

          if (data.isNewUser) {
            showPawCelebration(150, currentSocialOAuthProvider === 'google' ? 'Google Hoş Geldin Bonusu 🐾 (+150 Pati)' : 'Apple Hoş Geldin Bonusu 🍎 (+150 Pati)');
          } else {
            showPawCelebration(50, 'Tekrar Hoş Geldiniz 🐾');
          }

          showToast(data.message || 'Giriş başarılı! 🐾✨');
        } else {
          showToast(data.error || 'Sosyal giriş sırasında hata oluştu ⚠️');
        }
      } catch (err) {
        console.error('[Social OAuth] Error:', err);
        showToast('Bağlantı hatası oluştu, lütfen tekrar deneyin ⚠️');
      } finally {
        if (btn) btn.disabled = false;
        if (btnText) btnText.innerText = currentSocialOAuthProvider === 'google' ? 'Google ile Oturum Aç ⚡' : 'Apple ile Devam Et 🍎';
      }
    }

    function handleLogout() {
      currentUser = { ...DEFAULT_USER, isLoggedIn: false };
      localStorage.removeItem('yp_current_user');
      updateUIAfterAuth();
      updatePawPointsUI();
      showToast('Oturum kapatıldı.');
      switchTab('home');
    }

    function updateUIAfterAuth() {
      if (typeof registerChatUser === 'function') registerChatUser();
      const isLogged = !!(currentUser && currentUser.isLoggedIn);
      
      const guestBox = document.getElementById('auth-sidebar-guest');
      const userBox = document.getElementById('auth-sidebar-user');
      const legacyBox = document.getElementById('auth-sidebar-box');
      const mobileLoginPill = document.getElementById('mobile-login-pill');
      const welcomeCard = document.getElementById('guest-welcome-card');

      if (guestBox) {
        if (isLogged) {
          guestBox.classList.remove('xl:flex');
          guestBox.classList.add('hidden');
        } else {
          guestBox.classList.add('xl:flex');
          guestBox.classList.remove('hidden');
        }
      }
      if (userBox) {
        if (isLogged) {
          userBox.classList.add('xl:flex');
          userBox.classList.remove('hidden');
          const cardAvatar = document.getElementById('sidebar-user-card-avatar');
          const cardName = document.getElementById('sidebar-user-card-name');
          const cardUser = document.getElementById('sidebar-user-card-username');
          if (cardAvatar) cardAvatar.src = currentUser.avatar || '/images/poodle_mochi.jpg';
          if (cardName) cardName.innerText = currentUser.displayName || 'Mochi';
          if (cardUser) cardUser.innerText = '@' + (currentUser.username || 'senin_poodlein');
        } else {
          userBox.classList.remove('xl:flex');
          userBox.classList.add('hidden');
        }
      }
      if (legacyBox) {
        legacyBox.classList.toggle('hidden', isLogged);
      }
      const tabletGuest = document.getElementById('auth-sidebar-tablet-guest');
      const tabletUser = document.getElementById('auth-sidebar-tablet-user');
      const tabletAvatar = document.getElementById('sidebar-tablet-avatar');
      if (tabletGuest) tabletGuest.classList.toggle('hidden', isLogged);
      if (tabletUser) {
        tabletUser.classList.toggle('hidden', !isLogged);
        if (tabletAvatar && isLogged) tabletAvatar.src = currentUser.avatar || '/images/poodle_mochi.jpg';
      }

      const mobilePassportPill = document.getElementById('mobile-passport-pill');
      const mobilePawPointsPill = document.getElementById('mobile-paw-points-pill');
      if (mobilePassportPill) mobilePassportPill.classList.toggle('hidden', !isLogged);
      if (mobilePawPointsPill) mobilePawPointsPill.classList.toggle('hidden', !isLogged);
      if (mobileLoginPill) mobileLoginPill.classList.toggle('hidden', isLogged);
      if (welcomeCard) welcomeCard.classList.toggle('hidden', isLogged);
      const dashCard = document.getElementById('user-dashboard-card');
      if (dashCard) dashCard.classList.toggle('hidden', !isLogged);

      const avatars = [
                document.getElementById('sidebar-snippet-avatar'),
        document.getElementById('profile-main-avatar'),
        document.getElementById('m-avatar-img'),
        document.getElementById('user-story-thumb')
      ];
      avatars.forEach(img => {
        if (img) img.src = currentUser.avatar;
      });

      const snippetUser = document.getElementById('sidebar-snippet-username');
      if (snippetUser) snippetUser.innerText = currentUser.username;

      const profileUser = document.getElementById('profile-main-username');
      if (profileUser) profileUser.innerText = currentUser.username;

      const profileName = document.getElementById('profile-main-name');
      if (profileName) profileName.innerText = currentUser.displayName + ' 🐾';

      const profileBio = document.getElementById('profile-main-bio');
      if (profileBio) profileBio.innerText = currentUser.bio;

      const profileVariety = document.getElementById('profile-badge-variety');
      if (profileVariety) profileVariety.innerText = currentUser.variety;

      const profileColor = document.getElementById('profile-badge-color');
      if (profileColor) profileColor.innerText = currentUser.color;

      const profileLocation = document.getElementById('profile-main-location');
      if (profileLocation) profileLocation.innerText = '📍 ' + currentUser.city;

      const profilePosts = document.getElementById('profile-posts-count');
      if (profilePosts) profilePosts.innerText = currentUser.postsCount;

      const profileFollowers = document.getElementById('profile-followers-count');
      if (profileFollowers) profileFollowers.innerText = currentUser.followersCount;

      updatePawPointsUI();
      renderDashboardUI();
      renderVerifiedBadges();
    }

    // ================= MAVİ PATİ DOĞRULAMA (VERIFIED BLUE PAW) SYSTEM =================
    let isBadgeHiddenTemp = false;

    function renderVerifiedBadges() {
      const isVerified = !!currentUser.isVerified;

      // 1. Profile header badge next to username
      const profileBadge = document.getElementById('profile-verified-badge');
      if (profileBadge) {
        profileBadge.classList.toggle('hidden', !isVerified);
        profileBadge.classList.toggle('inline-flex', isVerified);
      }
      const elAiBadge = document.getElementById('profile-ai-badge');
      if (elAiBadge) {
        elAiBadge.classList.add('hidden');
        elAiBadge.classList.remove('inline-flex');
      }

      // 2. Profile bio pill
      const profilePill = document.getElementById('profile-badge-verified-pill');
      if (profilePill) {
        profilePill.classList.toggle('hidden', !isVerified);
        profilePill.classList.toggle('inline-flex', isVerified);
      }

      // 3. Profile action button text & style
      const btnVerified = document.getElementById('btn-apply-verified');
      const labelVerified = document.getElementById('btn-apply-verified-label');
      const iconVerified = document.getElementById('btn-apply-verified-icon');
      if (btnVerified) {
        if (isVerified) {
          btnVerified.className = 'px-3.5 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-[#0095f6] border border-[#0095f6]/40 text-xs font-bold rounded-lg transition flex items-center gap-1.5 active:scale-95 shadow-xs';
          if (labelVerified) labelVerified.innerText = 'Mavi Pati: Aktif';
          if (iconVerified) iconVerified.innerText = '✓';
          btnVerified.title = 'Mavi Pati Sertifikanı Gör';
        } else {
          btnVerified.className = 'px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 active:scale-95';
          if (labelVerified) labelVerified.innerText = 'Mavi Pati Başvurusu';
          if (iconVerified) iconVerified.innerText = '🐾';
          btnVerified.title = 'Mavi Pati Doğrulama Başvurusu Yap';
        }
      }

      // 4. Feed dashboard widget badge
      const dashBadge = document.getElementById('dash-verified-badge');
      if (dashBadge) {
        dashBadge.classList.toggle('hidden', !isVerified);
        dashBadge.classList.toggle('inline-flex', isVerified);
      }

      // 5. Passport card badge in modal
      const hubPassportText = document.getElementById('hub-passport-verified-text');
      const hubPassportBadge = document.getElementById('hub-passport-verified-badge');
      if (hubPassportText) {
        hubPassportText.innerText = isVerified ? 'Mavi Pati: Doğrulandı ✅' : 'Mavi Pati: Başvur 🐾';
      }
      if (hubPassportBadge) {
        if (isVerified) {
          hubPassportBadge.className = 'px-2.5 py-0.5 bg-sky-500/20 text-[#38bdf8] border border-[#38bdf8]/40 rounded-full font-bold text-[10px] flex items-center gap-1 transition cursor-pointer';
        } else {
          hubPassportBadge.className = 'px-2.5 py-0.5 bg-sky-500/10 text-sky-300 border border-sky-400/30 rounded-full font-bold text-[10px] flex items-center gap-1 transition cursor-pointer';
        }
      }
    }

    function openVerificationModal() {
      const modal = document.getElementById('verified-badge-modal');
      if (!modal) return;
      modal.classList.remove('hidden');

      const viewApply = document.getElementById('view-verify-apply');
      const viewActive = document.getElementById('view-verify-active');
      const progressBox = document.getElementById('verify-review-progress');
      if (progressBox) progressBox.classList.add('hidden');

      const isVerified = !!currentUser.isVerified;

      if (isVerified) {
        // Show active certificate
        if (viewApply) viewApply.classList.add('hidden');
        if (viewActive) viewActive.classList.remove('hidden');

        const vData = currentUser.verificationData || {};
        const certAvatar = document.getElementById('cert-avatar');
        if (certAvatar) certAvatar.src = currentUser.avatar || '/images/poodle_mochi.jpg';

        const certName = document.getElementById('cert-display-name');
        if (certName) certName.innerText = currentUser.displayName || 'Mochi';

        const certUser = document.getElementById('cert-username');
        if (certUser) certUser.innerText = '@' + (currentUser.username || 'yourpoodle_official');

        const certCode = document.getElementById('cert-code');
        if (certCode) certCode.innerText = vData.certificateId || 'YP-PAW-84920';

        const certCat = document.getElementById('cert-category');
        if (certCat) certCat.innerText = vData.category || 'Popüler Poodle & İçerik Üreticisi';

        const certChip = document.getElementById('cert-microchip');
        if (certChip) certChip.innerText = vData.microchip || currentUser.microchip || 'TR-982009104829104';

        const certDate = document.getElementById('cert-date');
        if (certDate) certDate.innerText = vData.approvedAt || '17 Ekim 2026';

        const toggleBtnText = document.getElementById('btn-toggle-badge-text');
        if (toggleBtnText) toggleBtnText.innerText = isBadgeHiddenTemp ? 'Rozeti Göster' : 'Rozeti Gizle';
      } else {
        // Show application form
        if (viewApply) viewApply.classList.remove('hidden');
        if (viewActive) viewActive.classList.add('hidden');

        // Pre-fill user data
        const avPreview = document.getElementById('verify-avatar-preview');
        if (avPreview) avPreview.src = currentUser.avatar || '/images/poodle_mochi.jpg';

        const pName = document.getElementById('verify-poodle-display-name');
        if (pName) pName.innerText = currentUser.displayName || 'Mochi';

        const uHandle = document.getElementById('verify-username-handle');
        if (uHandle) uHandle.innerText = '@' + (currentUser.username || 'senin_poodlein');

        const vChip = document.getElementById('verify-poodle-variety-chip');
        if (vChip) vChip.innerText = currentUser.variety || 'Toy Poodle';

        const cChip = document.getElementById('verify-poodle-color-chip');
        if (cChip) cChip.innerText = currentUser.color || 'Red Apricot';

        const chipInput = document.getElementById('verify-chip-input');
        if (chipInput && currentUser.microchip) chipInput.value = currentUser.microchip;
      }
    }

    function closeVerificationModal() {
      const modal = document.getElementById('verified-badge-modal');
      if (modal) modal.classList.add('hidden');
    }

    function handleVerifyFileSelect(event) {
      const file = event.target.files && event.target.files[0];
      const emptyDiv = document.getElementById('verify-upload-empty');
      const selectedDiv = document.getElementById('verify-upload-selected');
      const filenameSpan = document.getElementById('verify-filename');

      if (file) {
        if (filenameSpan) filenameSpan.innerText = file.name + ` (${(file.size / 1024 / 1024).toFixed(1)} MB)`;
        if (emptyDiv) emptyDiv.classList.add('hidden');
        if (selectedDiv) selectedDiv.classList.remove('hidden');
        showToast('Belge seçildi: ' + file.name);
      }
    }

    async function handleVerificationSubmit(event) {
      event.preventDefault();
      const submitBtn = document.getElementById('btn-submit-verification');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.innerText = 'Başvuru Gönderiliyor...';
      }

      const category = document.getElementById('verify-category').value;
      const microchip = document.getElementById('verify-chip-input').value.trim() || currentUser.microchip || 'TR-982009104829104';
      const poodleName = currentUser.displayName || 'Mochi';
      const fileInput = document.getElementById('verify-file-input');

      let documentUrl = '/uploads/sample_pedigree.pdf';
      if (fileInput && fileInput.files && fileInput.files[0]) {
        try {
          let uploadDoc = fileInput.files[0];
          if (uploadDoc.type && uploadDoc.type.startsWith('image/')) {
            try {
              uploadDoc = await compressImageFile(uploadDoc, 1440, 400);
            } catch(e) {}
          }
          const formData = new FormData();
          formData.append('file', uploadDoc);
          const uploadRes = await fetch('/api/live/upload', { method: 'POST', body: formData });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.url) documentUrl = uploadData.url;
          }
        } catch(upErr) {
          console.warn('Doc upload fallback:', upErr);
        }
      }

      try {
        const res = await fetch('/api/live/verification/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            category,
            microchip,
            poodleName,
            documentUrl
          })
        });
        const data = await res.json();
        if (data.ok) {
          showToast('⏳ Mavi Pati başvurunuz alındı ve yönetici havuzuna iletildi!');
          showPendingVerificationView({
            category,
            microchip,
            poodleName,
            createdAt: new Date().toLocaleDateString('tr-TR')
          });
        } else {
          showToast('Not: ' + (data.error || 'Başvuru tamamlandı'));
        }
      } catch(err) {
        console.error('Verification apply error:', err);
        showToast('Başvuru gönderilirken bir hata oluştu.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          submitBtn.innerText = 'Mavi Pati Başvurusunu Tamamla ve Rozeti Al';
        }
      }
    }

    function showPendingVerificationView(app) {
      const applyView = document.getElementById('view-verify-apply');
      const activeView = document.getElementById('view-verify-active');
      const pendingView = document.getElementById('view-verify-pending');

      if (applyView) applyView.classList.add('hidden');
      if (activeView) activeView.classList.add('hidden');
      if (pendingView) {
        pendingView.classList.remove('hidden');
        const pName = document.getElementById('pending-poodle-name');
        const pChip = document.getElementById('pending-chip-no');
        const pCat = document.getElementById('pending-category');
        const pDate = document.getElementById('pending-date');
        if (pName) pName.innerText = app.poodleName || currentUser.displayName || 'Mochi';
        if (pChip) pChip.innerText = app.microchip || currentUser.microchip || '-';
        if (pCat) pCat.innerText = app.category || 'Irk Standartı / Safkan';
        if (pDate) pDate.innerText = app.createdAt || new Date().toLocaleDateString('tr-TR');
      }
    }

    async function checkVerificationStatus() {
      if (!currentUser || !currentUser.username) return;
      try {
        const res = await fetch(`/api/live/verification/status?username=${encodeURIComponent(currentUser.username)}`);
        const data = await res.json();
        if (data.ok) {
          if (data.status === 'approved') {
            currentUser.isVerified = true;
            currentUser.badge = 'verified';
            currentUser.verificationData = {
              certificateId: data.certificateId,
              microchip: data.microchip,
              category: data.category,
              approvedAt: data.approvedAt
            };
            localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
            updateUIAfterAuth();
          } else if (data.status === 'pending') {
            showPendingVerificationView({
              poodleName: data.poodleName || currentUser.displayName,
              microchip: data.microchip,
              category: data.category,
              createdAt: data.createdAt
            });
          }
        }
      } catch(e) {
        console.warn('Verification status check note:', e);
      }
    }

    function toggleVerifiedBadgeDisplay() {
      isBadgeHiddenTemp = !isBadgeHiddenTemp;
      const profileBadge = document.getElementById('profile-verified-badge');
      const profilePill = document.getElementById('profile-badge-verified-pill');
      const toggleBtnText = document.getElementById('btn-toggle-badge-text');

      if (profileBadge) {
        profileBadge.classList.toggle('hidden', isBadgeHiddenTemp);
        profileBadge.classList.toggle('inline-flex', !isBadgeHiddenTemp);
      }
      if (profilePill) {
        profilePill.classList.toggle('hidden', isBadgeHiddenTemp);
        profilePill.classList.toggle('inline-flex', !isBadgeHiddenTemp);
      }

      if (toggleBtnText) {
        toggleBtnText.innerText = isBadgeHiddenTemp ? 'Rozeti Göster' : 'Rozeti Gizle';
      }

      showToast(isBadgeHiddenTemp ? 'Mavi Pati rozeti profilinde geçici olarak gizlendi.' : 'Mavi Pati rozeti tekrar görünür yapıldı! 🐾');
    }

    function shareVerificationCertificate() {
      const certId = (currentUser.verificationData && currentUser.verificationData.certificateId) || 'YP-PAW-84920';
      const shareUrl = `${window.location.origin}/#verify/${certId}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast(`📋 Mavi Pati Sertifika bağlantısı kopyalandı! (${certId})`);
        }).catch(() => {
          showToast(`Sertifika No: ${certId}`);
        });
      } else {
        showToast(`Sertifika No: ${certId}`);
      }
    }

    // ================= PATİ KOMUTA MERKEZİ & POODLE PASAPORT ENGINE =================
    let currentDashboardModalTab = 'passport';

    function openPoodleDashboardModal(targetTab = 'passport') {
      const modal = document.getElementById('poodle-dashboard-modal');
      if (modal) modal.classList.remove('hidden');
      switchDashboardModalTab(targetTab);
      renderDashboardUI();
    }

    function closePoodleDashboardModal() {
      const modal = document.getElementById('poodle-dashboard-modal');
      if (modal) modal.classList.add('hidden');
      const dropdown = document.getElementById('dash-poodle-dropdown');
      if (dropdown) dropdown.classList.add('hidden');
    }

    function switchDashboardModalTab(tabId) {
      currentDashboardModalTab = tabId;
      const tabs = ['passport', 'health', 'social', 'settings'];
      tabs.forEach(t => {
        const btn = document.getElementById(`hub-tab-btn-${t}`);
        const content = document.getElementById(`hub-content-${t}`);
        const isActive = t === tabId;
        if (btn) {
          if (isActive) {
            btn.className = 'flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 border-amber-500 text-amber-600 dark:text-amber-400 shrink-0 transition';
          } else {
            btn.className = 'flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-black dark:hover:text-white shrink-0 transition';
          }
        }
        if (content) {
          content.classList.toggle('hidden', !isActive);
        }
      });
      if (tabId === 'health') {
        renderWeightChartSVG();
      }
    }

    function toggleDashboardPoodleDropdown() {
      const dropdown = document.getElementById('dash-poodle-dropdown');
      if (dropdown) dropdown.classList.toggle('hidden');
    }

    function switchPoodleFromHub(poodleName, variety, color, weight, avatar) {
      currentUser.displayName = poodleName;
      currentUser.variety = variety;
      currentUser.color = color;
      currentUser.weight = weight;
      currentUser.avatar = avatar;
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      updateUIAfterAuth();
      const dropdown = document.getElementById('dash-poodle-dropdown');
      if (dropdown) dropdown.classList.add('hidden');
      showToast(`Aktif Poodle: ${poodleName} 🐩 olarak değiştirildi!`);
      if (typeof renderProfile === 'function') renderProfile(currentUser.username);
    }

    function getPoodleAgeString(birthDateStr) {
      try {
        const birth = new Date(birthDateStr || '2025-07-15');
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        if (months < 0) {
          years--;
          months += 12;
        }
        if (years > 0 && months > 0) return `${years} yıl ${months} aylık`;
        if (years > 0) return `${years} yaşında`;
        return `${Math.max(1, months)} aylık`;
      } catch(e) {
        return '1 yıl 3 aylık';
      }
    }

    function getGreetingByHour() {
      const hr = new Date().getHours();
      const _t = (k, fb) => (window.ypI18n ? window.ypI18n.t(k, fb) : fb);
      if (hr >= 6 && hr < 12) return { text: _t('feed.goodMorning', 'Günaydın'), icon: '☀️' };
      if (hr >= 12 && hr < 18) return { text: _t('feed.goodAfternoon', 'Tünaydın'), icon: '🌤️' };
      if (hr >= 18 && hr < 22) return { text: _t('feed.goodEvening', 'İyi akşamlar'), icon: '🌆' };
      return { text: _t('feed.goodEvening', 'İyi geceler'), icon: '🌙' };
    }

    function renderDashboardUI() {
      const greetingInfo = getGreetingByHour();
      const ownerFirst = (currentUser.ownerName || 'Emre & Zeynep').split('&')[0].trim();
      const ageStr = getPoodleAgeString(currentUser.birthDate);

      // Home Feed Widget updates
      const dashGreeting = document.getElementById('dash-greeting');
      if (dashGreeting) dashGreeting.innerText = `${greetingInfo.text}, ${ownerFirst}!`;
      const dashGreetingIcon = document.getElementById('dash-greeting-icon');
      if (dashGreetingIcon) dashGreetingIcon.innerText = greetingInfo.icon;

      const dashSubtext = document.getElementById('dash-subtext');
      if (dashSubtext) dashSubtext.innerText = `${currentUser.displayName} bugün ${ageStr} ve harika görünüyor 🐾`;

      const dashAvatar = document.getElementById('dash-avatar');
      if (dashAvatar) dashAvatar.src = currentUser.avatar;

      // Streak badge
      const streakDaysEl = document.getElementById('dash-streak-days');
      if (streakDaysEl) streakDaysEl.innerText = `${currentUser.dailyStreak || 5} ${(window.ypI18n ? window.ypI18n.t('dash.streakDays', 'Günlük Seri') : 'Günlük Seri')}`;
      const streakActionEl = document.getElementById('dash-streak-action');
      if (streakActionEl) {
        streakActionEl.innerText = currentUser.streakClaimedToday ? (window.ypI18n ? window.ypI18n.t('dash.claimedStreak', '✓ Bonus Alındı') : '✓ Bonus Alındı') : (window.ypI18n ? window.ypI18n.t('dash.claimStreak', '+10 Pati Bonusu Al') : '+10 Pati Bonusu Al');
        streakActionEl.className = currentUser.streakClaimedToday ? 'text-[9px] font-bold text-emerald-500' : 'text-[9px] font-bold text-orange-500 animate-pulse';
      }

      // Park button state
      const parkBtn = document.getElementById('dash-park-btn');
      const parkIcon = document.getElementById('dash-park-icon');
      const parkLabel = document.getElementById('dash-park-label');
      if (parkBtn && parkLabel) {
        if (currentUser.isInPark) {
          parkBtn.className = 'flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-400 transition group active:scale-95 shadow-sm';
          if (parkIcon) parkIcon.innerText = '🟢';
          parkLabel.innerText = window.ypI18n ? window.ypI18n.t('dash.inPark', 'Parktasın') : 'Parktasın';
        } else {
          parkBtn.className = 'flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition group active:scale-95';
          if (parkIcon) parkIcon.innerText = '📍';
          parkLabel.innerText = window.ypI18n ? window.ypI18n.t('dash.atPark', 'Parktayım') : 'Parktayım';
        }
      }

      // Quick ribbon chips (Compact, mobile-friendly text)
      const vaccineChip = document.getElementById('dash-vaccine-chip');
      if (vaccineChip) vaccineChip.innerText = window.ypI18n ? window.ypI18n.t('dash.parasiteDays', 'Parazit: 4 gün') : 'Parazit: 4 gün';

      const weightChip = document.getElementById('dash-weight-chip');
      if (weightChip) weightChip.innerText = `${parseFloat(currentUser.weight || 2.85).toFixed(2)} ${window.ypI18n ? window.ypI18n.t('dash.weightIdeal', 'kg · İdeal') : 'kg · İdeal'}`;

      // Modal Header
      const modalHeaderSub = document.getElementById('dash-modal-header-sub');
      if (modalHeaderSub) modalHeaderSub.innerText = `${currentUser.displayName} · ${currentUser.variety} (${currentUser.color}) · ${parseFloat(currentUser.weight || 2.85).toFixed(2)} kg`;

      const modalPoodleThumb = document.getElementById('dash-modal-poodle-thumb');
      if (modalPoodleThumb) modalPoodleThumb.src = currentUser.avatar;

      const modalPoodleName = document.getElementById('dash-modal-poodle-name');
      if (modalPoodleName) modalPoodleName.innerText = currentUser.displayName;

      // Passport Tab
      const passAvatar = document.getElementById('hub-passport-avatar');
      if (passAvatar) passAvatar.src = currentUser.avatar;

      const passName = document.getElementById('hub-passport-name');
      if (passName) passName.innerText = `${currentUser.displayName} 🐾`;

      const passVariety = document.getElementById('hub-passport-variety');
      if (passVariety) passVariety.innerText = currentUser.variety;

      const passColor = document.getElementById('hub-passport-color');
      if (passColor) passColor.innerText = currentUser.color;

      const passAge = document.getElementById('hub-passport-age');
      if (passAge) passAge.innerText = `15.07.2025 (${ageStr})`;

      const passWeight = document.getElementById('hub-passport-weight');
      if (passWeight) passWeight.innerText = `${parseFloat(currentUser.weight || 2.85).toFixed(2)} kg (İdeal Sınıf)`;

      const passOwner = document.getElementById('hub-passport-owner');
      if (passOwner) passOwner.innerText = currentUser.ownerName || 'Emre & Zeynep';

      const passChip = document.getElementById('hub-passport-chip');
      if (passChip) passChip.innerText = currentUser.microchip || 'TR-982009104829104';

      const hubQrImg = document.getElementById('hub-qr-img');
      if (hubQrImg) {
        const qrTarget = `https://www.yourpoodle.com/p/${currentUser.username || 'mochi_toypoodle'}`;
        hubQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrTarget)}`;
      }

      // Lost mode toggle state
      const lostToggle = document.getElementById('hub-lost-mode-toggle');
      if (lostToggle) {
        lostToggle.checked = currentUser.privacySettings?.lostModeEnabled || false;
      }

      // Vaccines List
      renderVaccinesList();

      // Current Weight in Health Tab
      const currentWeightVal = document.getElementById('hub-current-weight-val');
      if (currentWeightVal) currentWeightVal.innerText = `${(currentUser.weight || 2.85).toFixed(2)} kg`;

      renderWeightChartSVG();
    }

    function renderVaccinesList() {
      const container = document.getElementById('hub-vaccine-list');
      if (!container) return;
      const vaccines = currentUser.vaccines || DEFAULT_USER.vaccines;
      container.innerHTML = vaccines.map(v => {
        const isDone = v.status === 'completed';
        const isWarning = v.status === 'warning';
        return `
          <div class="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-2xl size-10 rounded-xl bg-gray-100 dark:bg-[#222] flex items-center justify-center shrink-0">${v.icon || '💉'}</span>
              <div>
                <div class="flex items-center gap-2">
                  <strong class="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">${v.name}</strong>
                  ${isDone 
                    ? '<span class="px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] rounded-full">✅ Tamamlandı</span>' 
                    : (isWarning 
                        ? `<span class="px-2 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] rounded-full animate-pulse">⏳ ${v.daysLeft} gün kaldı</span>` 
                        : `<span class="px-2 py-0.5 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] rounded-full">${v.daysLeft} gün sonra</span>`
                      )
                  }
                </div>
                <p class="text-[11px] text-gray-500">${v.note || ''} ${v.dueDate ? '· Tarih: ' + v.dueDate : ''}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
              ${isDone 
                ? '<span class="text-xs text-gray-400 font-medium">Yenileme: 2027</span>' 
                : `<button onclick="setVaccineReminder('${v.name}')" class="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-xl transition flex items-center gap-1 active:scale-95">
                    <span>🔔</span>
                    <span>Hatırlatıcı Kur</span>
                   </button>`
              }
            </div>
          </div>
        `;
      }).join('');
    }

    function renderWeightChartSVG() {
      const container = document.getElementById('hub-weight-chart-container');
      if (!container) return;

      const history = currentUser.weightHistory || DEFAULT_USER.weightHistory;
      if (!history || history.length === 0) return;

      // SVG Dimensions
      const width = 480;
      const height = 180;
      const padLeft = 40;
      const padRight = 30;
      const padTop = 25;
      const padBottom = 35;

      const chartW = width - padLeft - padRight;
      const chartH = height - padTop - padBottom;

      const minW = 2.0;
      const maxW = 3.6;

      const getY = (w) => padTop + chartH - ((w - minW) / (maxW - minW)) * chartH;
      const getX = (idx) => padLeft + (idx / (history.length - 1)) * chartW;

      // Safe Corridor: 2.50 kg - 3.20 kg
      const safeTopY = getY(3.20);
      const safeBottomY = getY(2.50);
      const safeHeight = safeBottomY - safeTopY;

      // Build points path
      const points = history.map((item, idx) => ({
        x: getX(idx),
        y: getY(item.weight),
        month: item.month,
        weight: item.weight
      }));

      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

      container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" class="w-full h-44 select-none">
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#8b5cf6"/>
              <stop offset="50%" stop-color="#ec4899"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.0"/>
            </linearGradient>
          </defs>

          <!-- Safe Ideal Corridor (2.50kg - 3.20kg) -->
          <rect x="${padLeft}" y="${safeTopY.toFixed(1)}" width="${chartW}" height="${safeHeight.toFixed(1)}" fill="#10b981" fill-opacity="0.12" rx="4"/>
          <line x1="${padLeft}" y1="${safeTopY.toFixed(1)}" x2="${padLeft + chartW}" y2="${safeTopY.toFixed(1)}" stroke="#10b981" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="${padLeft}" y1="${safeBottomY.toFixed(1)}" x2="${padLeft + chartW}" y2="${safeBottomY.toFixed(1)}" stroke="#10b981" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="${padLeft + chartW - 5}" y="${(safeTopY + 12).toFixed(1)}" font-size="9" fill="#10b981" font-weight="bold" text-anchor="end">3.20 kg (Üst Sınır)</text>
          <text x="${padLeft + chartW - 5}" y="${(safeBottomY - 4).toFixed(1)}" font-size="9" fill="#10b981" font-weight="bold" text-anchor="end">2.50 kg (Alt Sınır)</text>

          <!-- Grid horizontal lines -->
          <line x1="${padLeft}" y1="${getY(2.0).toFixed(1)}" x2="${padLeft + chartW}" y2="${getY(2.0).toFixed(1)}" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"/>
          <line x1="${padLeft}" y1="${getY(3.6).toFixed(1)}" x2="${padLeft + chartW}" y2="${getY(3.6).toFixed(1)}" stroke="currentColor" stroke-opacity="0.1" stroke-width="1"/>

          <!-- Axis Y Labels -->
          <text x="${padLeft - 8}" y="${(getY(3.6) + 4).toFixed(1)}" font-size="9" fill="#888" text-anchor="end">3.6k</text>
          <text x="${padLeft - 8}" y="${(getY(2.8) + 4).toFixed(1)}" font-size="9" fill="#888" text-anchor="end">2.8k</text>
          <text x="${padLeft - 8}" y="${(getY(2.0) + 4).toFixed(1)}" font-size="9" fill="#888" text-anchor="end">2.0k</text>

          <!-- Connecting Curve Line -->
          <path d="${pathD}" fill="none" stroke="url(#curveGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Points and X Labels -->
          ${points.map((p, i) => `
            <g class="cursor-pointer group" onclick="showToast('${p.month} Ayı: ${p.weight.toFixed(2)} kg')">
              <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="#fff" stroke="#ec4899" stroke-width="3" class="transition group-hover:scale-150"/>
              <text x="${p.x.toFixed(1)}" y="${(p.y - 10).toFixed(1)}" font-size="9" font-weight="bold" fill="currentColor" text-anchor="middle">${p.weight.toFixed(2)}</text>
              <text x="${p.x.toFixed(1)}" y="${(height - 10).toFixed(1)}" font-size="10" fill="#888" text-anchor="middle">${p.month}</text>
            </g>
          `).join('')}
        </svg>
      `;
    }

    function claimDailyStreak() {
      const todayStr = new Date().toISOString().split('T')[0];
      if (currentUser.lastStreakClaimDate === todayStr && currentUser.streakClaimedToday) {
        showToast("Bugünkü streak bonusunu zaten aldın! Yarın tekrar bekleriz 🔥");
        return;
      }
      currentUser.dailyStreak = (currentUser.dailyStreak || 5) + 1;
      currentUser.streakClaimedToday = true;
      currentUser.lastStreakClaimDate = todayStr;
      addPawPoints(10, `${currentUser.dailyStreak} Günlük Seri Giriş Bonusu 🔥`);
      showPawCelebration(10, `🔥 ${currentUser.dailyStreak} Günlük Seri! +10 Pati`);
      showToast(`Tebrikler! ${currentUser.dailyStreak} gündür aralıksız YourPoodle'dasın! 🔥`);
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      renderDashboardUI();
    }

    function toggleParkStatus() {
      currentUser.isInPark = !currentUser.isInPark;
      if (currentUser.isInPark) {
        currentUser.parkCheckinTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        addPawPoints(10, "Bebek Parkı'nda canlı konum paylaşıldı 📍");
        showPawCelebration(10, "📍 Parktayım! +10 Pati Puanı");
        showToast(`📍 ${currentUser.displayName} Bebek Parkı'nda canlı olarak işaretlendi!`);
      } else {
        showToast(`Park durumu kapatıldı.`);
      }
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      renderDashboardUI();
    }

    function addNewWeightMeasurement() {
      const inputEl = document.getElementById('new-weight-input');
      if (!inputEl) return;
      const val = parseFloat(inputEl.value);
      if (!val || isNaN(val) || val < 1 || val > 15) {
        showToast('Lütfen geçerli bir ağırlık giriniz (örn: 2.85 kg)');
        return;
      }
      currentUser.weight = val;
      const currentMonthName = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(new Date());
      if (!currentUser.weightHistory) currentUser.weightHistory = [];
      const existingMonthIdx = currentUser.weightHistory.findIndex(w => w.month.toLowerCase() === currentMonthName.toLowerCase());
      if (existingMonthIdx !== -1) {
        currentUser.weightHistory[existingMonthIdx].weight = val;
      } else {
        currentUser.weightHistory.push({ month: currentMonthName, weight: val });
      }
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      addPawPoints(5, 'Kilo ölçümü kaydedildi ⚖️');
      showToast(`Yeni tartım (${val.toFixed(2)} kg) başarıyla kaydedildi! 🎯`);
      renderDashboardUI();
    }

    function addNewVaccinePrompt() {
      const vName = prompt('Yeni Aşı / Bakım Adı:', 'Lyme Aşısı');
      if (!vName) return;
      const vDays = parseInt(prompt('Kaç gün sonra yenilenmeli (gün sayısı)?', '30')) || 30;
      if (!currentUser.vaccines) currentUser.vaccines = [];
      currentUser.vaccines.push({
        id: 'vac_' + Date.now(),
        name: vName,
        daysLeft: vDays,
        status: vDays <= 7 ? 'warning' : 'pending',
        icon: '💉',
        note: 'Özel veteriner kaydı'
      });
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      renderVaccinesList();
      showToast(`${vName} takvime eklendi!`);
    }

    function setVaccineReminder(vaccineName) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showToast(`🔔 ${vaccineName} hatırlatıcısı telefonunuza kuruldu!`);
          } else {
            showToast(`🔔 ${vaccineName} hatırlatıcısı sistem takvimine eklendi!`);
          }
        });
      } else {
        showToast(`🔔 ${vaccineName} hatırlatıcısı ve SMS uyarısı kuruldu!`);
      }
    }

    function copyMicrochipNumber() {
      const chip = currentUser.microchip || 'TR-982009104829104';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(chip);
      }
      showToast(`Mikroçip No kopyalandı: ${chip} 📋`);
    }

    function printQrTag() {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent('https://www.yourpoodle.com/p/' + (currentUser.username || 'mochi_toypoodle'))}`;
      const win = window.open('', '_blank');
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>YourPoodle Akıllı Tasma Künyesi - ${currentUser.displayName}</title>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 40px; background: #fafafa; margin: 0; }
              .tag-card { max-width: 360px; margin: 0 auto; background: white; border: 4px solid #f59e0b; border-radius: 28px; padding: 28px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
              .tag-title { font-size: 24px; font-weight: 900; color: #111; margin-bottom: 4px; }
              .tag-sub { font-size: 13px; color: #666; margin-bottom: 20px; }
              img { width: 220px; height: 220px; border-radius: 16px; margin-bottom: 16px; }
              .chip { font-family: monospace; font-size: 13px; font-weight: bold; background: #f3f4f6; padding: 6px 12px; border-radius: 8px; display: inline-block; margin-bottom: 16px; }
              .footer { font-size: 11px; color: #888; font-weight: bold; border-top: 1px dashed #e5e7eb; padding-top: 12px; }
            </style>
          </head>
          <body>
            <div class="tag-card">
              <div class="tag-title">🐾 ${currentUser.displayName}</div>
              <div class="tag-sub">Resmi Akıllı Tasma Künyesi · ${currentUser.variety}</div>
              <img src="${qrUrl}" alt="QR Kod">
              <div class="chip">📡 Mikroçip: ${currentUser.microchip || 'TR-982009104829104'}</div>
              <p style="font-size:12px; font-weight:bold; color:#f59e0b; margin:0 0 12px 0;">KAYBOLURSAM BU KODU KAMERAYLA OKUTUNUZ</p>
              <div class="footer">YourPoodle Güvenli Pet Ağı · Sahip: ${currentUser.ownerName || 'Emre & Zeynep'}</div>
            </div>
            <script>window.onload = function() { window.print(); }<\/script>
          </body>
        </html>
      `);
      win.document.close();
    }

    function openLostTagPreview() {
      const modal = document.getElementById('lost-tag-preview-modal');
      if (!modal) return;
      document.getElementById('lost-preview-avatar').src = currentUser.avatar;
      document.getElementById('lost-preview-name').innerText = `${currentUser.displayName} 🐾`;
      document.getElementById('lost-preview-info').innerText = `${currentUser.variety} · ${currentUser.color} · ${(currentUser.weight || 2.85).toFixed(2)} kg`;
      modal.classList.remove('hidden');
    }

    function closeLostTagPreview() {
      const modal = document.getElementById('lost-tag-preview-modal');
      if (modal) modal.classList.add('hidden');
    }

    function toggleLostDogMode(enable) {
      if (!currentUser.privacySettings) currentUser.privacySettings = {};
      currentUser.privacySettings.lostModeEnabled = enable;
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
      if (enable) {
        showToast('🚨 ACİL KAYIP MODU AKTİF! Tasma künyesi acil durum moduna geçirildi.');
      } else {
        showToast('Normal künye moduna geri dönüldü.');
      }
      renderDashboardUI();
    }

    async function saveDashboardSettings() {
      const isPrivate = document.getElementById('setting-private-profile')?.checked || false;
      const maskPhone = document.getElementById('setting-mask-phone')?.checked ?? true;
      const parkBroadcast = document.getElementById('setting-park-broadcast')?.checked ?? true;
      const pushDm = document.getElementById('setting-push-dm')?.checked ?? true;
      const pushVaccine = document.getElementById('setting-push-vaccine')?.checked ?? true;
      const pushPark = document.getElementById('setting-push-park')?.checked ?? true;

      if (!currentUser.privacySettings) currentUser.privacySettings = {};
      currentUser.privacySettings.isProfilePrivate = isPrivate;
      currentUser.privacySettings.showPhoneOnQr = !maskPhone;
      currentUser.privacySettings.parkBroadcast = parkBroadcast;
      currentUser.privacySettings.pushNotifications = {
        dm: pushDm,
        vaccines: pushVaccine,
        parks: pushPark
      };
      localStorage.setItem('yp_current_user', JSON.stringify(currentUser));

      try {
        await fetch('/api/live/user/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            isPrivate,
            maskPhone,
            parkBroadcast,
            pushDm,
            pushVaccine,
            pushPark
          })
        });
        showToast('⚙️ Gizlilik ve bildirim ayarları sunucuya kaydedildi! ☁️');
      } catch(e) {
        console.warn('Save settings remote err:', e);
        showToast('⚙️ Gizlilik ve bildirim ayarları kaydedildi!');
      }
      closePoodleDashboardModal();
    }

    function startDmWithUser(username) {
      closePoodleDashboardModal();
      let dmIndex = dmData.findIndex(d => d.user === username);
      if (dmIndex === -1) {
        const profile = (typeof POODLE_PROFILES !== 'undefined' && POODLE_PROFILES[username]) || {};
        dmData.unshift({
          user: username,
          avatar: profile.avatar || '/images/poodle_mochi.jpg',
          lastMsg: 'Sohbet başlatıldı',
          time: 'şimdi',
          unread: false,
          messages: [
            { sender: username, text: `Merhaba! Poodle'ını çok sevdim 🐾`, time: 'Az önce' }
          ]
        });
        dmIndex = 0;
      }
      switchTab('messages');
      if (typeof selectDm === 'function') selectDm(dmIndex);
      showToast(`@${username} ile sohbet açıldı 💬`);
    }

    function handleProfileNavClick() {
      if (!currentUser.isLoggedIn) {
        openAuthModal('signup');
      } else {
        activeProfileUsername = currentUser.username;
        viewUserProfile(currentUser.username);
      }
    }

    function handleUserStoryClick() {
      const inp = document.getElementById('user-story-file-input');
      if (inp) inp.click();
    }

    async function handleUserStorySelected(event) {
      let file = event.target.files[0];
      if (!file) return;
      try {
        if (file.type && file.type.startsWith('image/')) {
          showToast('Hikaye görseli optimize ediliyor (1440px WebP)... ⚡');
          try {
            file = await compressImageFile(file, 1440, 400);
          } catch(e) {
            console.warn('Story compress fallback:', e);
          }
        }
        let storyUrl = URL.createObjectURL(file);
        try {
          const formData = new FormData();
          formData.append('file', file);
          const uploadRes = await fetch('/api/live/upload', { method: 'POST', body: formData });
          if (uploadRes.ok) {
            const data = await uploadRes.json();
            if (data.url) storyUrl = data.url;
          }
        } catch(e) {
          console.warn('Story upload note:', e);
        }

        const newStory = {
          id: Date.now(),
          username: (currentUser && currentUser.username) ? currentUser.username : 'senin_poodlein',
          avatar: (currentUser && currentUser.avatar) ? currentUser.avatar : '/images/poodle_mochi.jpg',
          storyImg: storyUrl,
          hasUnseen: true
        };
        storiesData.unshift(newStory);
        renderStories();
        try {
          fetch('/api/live/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: currentUser.username,
              mediaUrl: storyUrl,
              mediaType: 'image'
            })
          }).catch(e => console.warn('Story push note:', e));
        } catch(e) {}
        addPawPoints(15, 'Yeni hikaye paylaştın 📸');
        triggerHaptic(25);
        showToast('Hikayen yayınlandı! 🐾 (+15 Pati Puanı)');
        openStoryViewer(0);
      } catch(err) {
        console.error('Story upload err:', err);
      }
    }

    // ================= REAL PHOTO UPLOAD =================
    function triggerPoodleAvatarUpload() {
      document.getElementById('poodle-avatar-input').click();
    }

    async function handlePoodleAvatarUpload(event) {
      let file = event.target.files[0];
      if (!file) return;
      if (file.type && file.type.startsWith('image/')) {
        try {
          file = await compressImageFile(file, 512, 80);
        } catch(e) {
          console.warn('Avatar compress fallback:', e);
        }
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        currentUser.avatar = e.target.result;
        try {
          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
        } catch(err) {
          console.warn('LocalStorage quota fallback:', err);
        }
        updateUIAfterAuth();
        addPawPoints(20, 'Profil fotoğrafı güncellendi 📸');
        showToast('Poodle profil fotoğrafın güncellendi! 📸');
      };
      reader.readAsDataURL(file);
    }

    function triggerPostImageUpload() {
      triggerGalleryUpload();
    }

    function handlePostImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        selectedCreateImage = e.target.result;
        document.getElementById('create-preview-img').src = e.target.result;
        showToast('Fotoğraf galeriden yüklendi! ✨');
      };
      reader.readAsDataURL(file);
    }

    function openEditProfileModal() {
      const modal = document.getElementById('edit-profile-modal');
      if (!modal) return;
      document.getElementById('edit-poodle-name').value = currentUser.displayName || '';
      document.getElementById('edit-owner-name').value = currentUser.ownerName || '';
      document.getElementById('edit-poodle-bio').value = currentUser.bio || '';
      document.getElementById('edit-poodle-city').value = currentUser.city || '';
      if (currentUser.variety) document.getElementById('edit-poodle-variety').value = currentUser.variety;
      if (currentUser.color) document.getElementById('edit-poodle-color').value = currentUser.color;
      document.getElementById('edit-poodle-weight').value = currentUser.weight || '';
      document.getElementById('edit-poodle-birth').value = currentUser.birthDate || '';
      document.getElementById('edit-poodle-chip').value = currentUser.microchip || '';
      document.getElementById('edit-avatar-preview').src = currentUser.avatar || '/images/poodle_mochi.jpg';
      editAvatarDataUrl = null;
      modal.classList.remove('hidden');
    }

    function closeEditProfileModal() {
      const modal = document.getElementById('edit-profile-modal');
      if (modal) modal.classList.add('hidden');
    }

    let editAvatarDataUrl = null;
    function handleEditAvatarChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        editAvatarDataUrl = e.target.result;
        document.getElementById('edit-avatar-preview').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    async function submitEditProfile(event) {
      event.preventDefault();
      const btn = document.getElementById('btn-save-profile');
      if (btn) {
        btn.disabled = true;
        btn.innerText = 'Kaydediliyor...';
      }

      const displayName = document.getElementById('edit-poodle-name').value.trim();
      const ownerName = document.getElementById('edit-owner-name').value.trim();
      const bio = document.getElementById('edit-poodle-bio').value.trim();
      const city = document.getElementById('edit-poodle-city').value.trim();
      const variety = document.getElementById('edit-poodle-variety').value;
      const color = document.getElementById('edit-poodle-color').value;
      const weight = document.getElementById('edit-poodle-weight').value.trim();
      const birthDate = document.getElementById('edit-poodle-birth').value;
      const microchip = document.getElementById('edit-poodle-chip').value.trim();
      let avatar = editAvatarDataUrl || currentUser.avatar || '/images/poodle_mochi.jpg';

      try {
        const res = await fetch('/api/live/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            displayName,
            ownerName,
            bio,
            city,
            variety,
            color,
            weight,
            birthDate,
            microchip,
            avatar
          })
        });
        const data = await res.json();
        if (data.ok && data.user) {
          Object.assign(currentUser, data.user);
          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
          updateUIAfterAuth();
          if (typeof renderMainProfile === 'function') renderMainProfile(currentUser.username);
          showToast('✅ Poodle ve profil bilgilerin başarıyla güncellendi!');
          closeEditProfileModal();
        } else {
          showToast('Hata: ' + (data.error || 'Profil güncellenemedi'));
        }
      } catch(err) {
        console.error('Profile update error:', err);
        currentUser.displayName = displayName;
        currentUser.bio = bio;
        currentUser.variety = variety;
        currentUser.color = color;
        if (avatar) currentUser.avatar = avatar;
        localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
        updateUIAfterAuth();
        showToast('Profil yerel olarak güncellendi.');
        closeEditProfileModal();
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>💾 Değişiklikleri Kaydet</span>';
        }
      }
    }

    // ================= RENDER METHODS =================
    function renderStories() {
      const container = document.getElementById('stories-tray');
      if (!container) return;
      container.innerHTML = storiesData.map((s, idx) => `
        <button type="button" onclick="if(!window.isDraggingStories) openStoryViewer(${idx})" class="flex flex-col items-center gap-1 shrink-0 group cursor-pointer transition hover:scale-105 active:scale-95 select-none">
          <div class="size-16 p-0.5 rounded-full ${s.hasUnseen ? 'ig-gradient-ring' : 'bg-gray-300 dark:bg-gray-700'} shadow-xs">
            <img src="${s.avatar}" alt="${s.username}" class="size-full object-cover rounded-full border-2 border-white dark:border-black pointer-events-none">
          </div>
          <span class="text-[11px] text-[#262626] dark:text-gray-300 truncate w-16 text-center font-medium">${s.username}</span>
        </button>
      `).join('');

      setTimeout(() => {
        if (typeof initStoriesScroll === 'function') initStoriesScroll();
        if (typeof updateStoriesScrollButtons === 'function') updateStoriesScrollButtons();
      }, 50);
    }

    function triggerHaptic(duration = 15) {
      try {
        if ('vibrate' in navigator) navigator.vibrate(duration);
      } catch(e) {}
    }

    let currentFeedFilter = 'all';

    function filterPostsFeed(filter, btnEl) {
      currentFeedFilter = filter;
      document.querySelectorAll('.feed-chip').forEach(btn => {
        btn.className = 'feed-chip px-3 py-1.5 bg-gray-100 dark:bg-[#1f1f1f] hover:bg-gray-200 dark:hover:bg-[#282828] text-xs font-semibold rounded-full shrink-0 transition cursor-pointer';
      });
      if (btnEl) {
        btnEl.className = 'feed-chip px-3.5 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-bold shrink-0 transition shadow-xs cursor-pointer';
      }
      triggerHaptic(15);
      renderPosts();
    }

    // ================= ADAPTIVE VIDEO STREAMING (HLS) =================
    function initHlsPlayer(videoEl, hlsUrl, fallbackMp4) {
      if (!videoEl || videoEl._hlsAttached) return;

      if (hlsUrl && hlsUrl.trim()) {
        if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS for Safari iOS & macOS
          videoEl.src = hlsUrl;
          videoEl._hlsAttached = true;
        } else if (window.Hls && Hls.isSupported()) {
          // Hls.js for Chrome, Firefox, Edge, Android
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30
          });
          hls.loadSource(hlsUrl);
          hls.attachMedia(videoEl);
          videoEl._hlsAttached = true;
          videoEl._hlsInstance = hls;

          hls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal && fallbackMp4) {
              console.warn('[HLS] Stream fallback to MP4:', fallbackMp4);
              try { hls.destroy(); } catch(e) {}
              videoEl.src = fallbackMp4;
            }
          });
        } else if (fallbackMp4) {
          videoEl.src = fallbackMp4;
          videoEl._hlsAttached = true;
        }
      } else if (fallbackMp4) {
        videoEl.src = fallbackMp4;
        videoEl._hlsAttached = true;
      }
    }

    let smartVideoObserver = null;
    function initSmartVideoObserver() {
      // Connect HLS streaming to all feed videos
      document.querySelectorAll('#posts-feed video').forEach(v => {
        const hlsSrc = v.getAttribute('data-hls-src');
        const mp4Src = v.getAttribute('data-mp4-src') || v.src;
        if (hlsSrc) {
          initHlsPlayer(v, hlsSrc, mp4Src);
        }
      });

      if (!('IntersectionObserver' in window)) return;
      if (smartVideoObserver) smartVideoObserver.disconnect();
      smartVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.4 });

      document.querySelectorAll('#posts-feed video').forEach(v => smartVideoObserver.observe(v));
    }

    // ================= POODLE SOCIAL FEED & TIKTOK/INSTAGRAM HYBRID ENGINE =================
    window._yp = window._yp || function(s) { return s; };
    let currentFeedMode = 'foryou'; // 'foryou' | 'following'
    let lastMediaTapTime = 0;

    function handleMediaTouchEnd(e, postId, container) {
      const now = Date.now();
      if (now - lastMediaTapTime < 320 && now - lastMediaTapTime > 40) {
        e.preventDefault();
        handleDoubleTap(postId, container);
      }
      lastMediaTapTime = now;
    }

    function playPawPopSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } catch (e) {}
    }

    function formatCount(n) {
      if (typeof n !== 'number') n = parseInt(n, 10) || 0;
      if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      return String(n);
    }

    function getPoodleMeta(post) {
      let breed = 'Toy Poodle';
      let breedIcon = '🧸';
      const text = `${post.caption || ''} ${post.hashtags || ''} ${post.username || ''}`.toLowerCase();
      
      if (text.includes('standard') || text.includes('standart')) {
        breed = 'Standart Poodle';
        breedIcon = '🐩';
      } else if (text.includes('miniature') || text.includes('minyatür')) {
        breed = 'Minyatür Poodle';
        breedIcon = '🐕';
      } else if (text.includes('teacup') || text.includes('tea cup')) {
        breed = 'Teacup Poodle';
        breedIcon = '☕';
      }

      let color = 'Red Apricot';
      let colorBadge = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';
      let colorDot = '🔴';
      if (text.includes('white') || text.includes('beyaz') || text.includes('krem') || text.includes('cream')) {
        color = 'Krem & Beyaz';
        colorBadge = 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300/30';
        colorDot = '⚪';
      } else if (text.includes('silver') || text.includes('gümüş') || text.includes('gri')) {
        color = 'Gümüş Gri';
        colorBadge = 'bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-400/30';
        colorDot = '🔘';
      } else if (text.includes('black') || text.includes('siyah')) {
        color = 'Asil Siyah';
        colorBadge = 'bg-zinc-800 text-zinc-100 border-zinc-700';
        colorDot = '⚫';
      } else if (text.includes('choc') || text.includes('çikolata') || text.includes('brown')) {
        color = 'Çikolata Kahve';
        colorBadge = 'bg-amber-900/15 text-amber-900 dark:text-amber-400 border-amber-900/30';
        colorDot = '🍫';
      }

      let petName = post.petName;
      if (!petName) {
        if (post.username.includes('mochi')) petName = 'Mochi';
        else if (post.username.includes('luna')) petName = 'Luna';
        else if (post.username.includes('teddy')) petName = 'Teddy';
        else if (post.username.includes('coco')) petName = 'Coco & Biscuit';
        else if (post.username.includes('bella')) petName = 'Bella';
        else if (post.username.includes('oliver')) petName = 'Oliver';
        else if (post.username.includes('milo')) petName = 'Milo';
        else if (post.username.includes('charlie')) petName = 'Charlie';
        else {
          petName = post.username.split('_')[0];
          petName = petName.charAt(0).toUpperCase() + petName.slice(1);
        }
      }

      let audioTitle = `${petName}'nin Park Ritmi 🐾`;
      if (text.includes('paris') || text.includes('croissant')) audioTitle = 'Champs-Élysées Poodle Acoustic 🎵';
      else if (text.includes('teddy') || text.includes('groom')) audioTitle = 'Teddy Glow-Up Beats ✂️';
      else if (text.includes('autumn') || text.includes('london')) audioTitle = 'Autumn Leaves & Poodle Steps 🍂';
      else if (text.includes('moda') || text.includes('sahil')) audioTitle = 'Kadıköy Sahil Esintisi 🌊';

      return { breed, breedIcon, color, colorBadge, colorDot, petName, audioTitle };
    }

    function showAudioToast(title) {
      triggerHaptic(20);
      playPawPopSound();
      showToast('🎵 Çalan Müzik: ' + title);
    }

    function switchFeedMode(mode) {
      currentFeedMode = mode;
      const foryouBtn = document.getElementById('feed-tab-foryou');
      const followingBtn = document.getElementById('feed-tab-following');
      
      if (foryouBtn && followingBtn) {
        if (mode === 'foryou') {
          foryouBtn.className = 'feed-mode-tab relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 transition flex items-center gap-1.5 cursor-pointer shadow-xs';
          followingBtn.className = 'feed-mode-tab relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition flex items-center gap-1.5 cursor-pointer';
        } else {
          followingBtn.className = 'feed-mode-tab relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 transition flex items-center gap-1.5 cursor-pointer shadow-xs';
          foryouBtn.className = 'feed-mode-tab relative px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition flex items-center gap-1.5 cursor-pointer';
        }
      }

      renderPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    
    // Internationalized Relative Time Formatter
    function formatTimeAgoI18n(timeStr, targetLang) {
      if (!timeStr) return '';
      const lang = targetLang || (window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'en');
      if (lang === 'tr') return timeStr;

      const str = String(timeStr).trim();
      const lower = str.toLowerCase();

      // Just now / Az önce / Şimdi
      if (lower.includes('az önce') || lower.includes('şimdi') || lower.includes('just now')) {
        const map = {
          ja: 'たった今',
          en: 'Just now',
          es: 'Hace un momento',
          fr: 'À l’instant',
          de: 'Gerade eben',
          pt: 'Agora mesmo',
          ko: '방금 전',
          'zh-CN': '刚刚',
          tr: 'Az önce'
        };
        return map[lang] || 'Just now';
      }

      // Hours: "5s önce", "2 sa", "2s", "4 saat önce"
      const hourMatch = str.match(/(\d+)\s*(?:saat|sa|s|h)(?:\s*önce|\s*ago)?/i);
      if (hourMatch) {
        const n = hourMatch[1];
        const map = {
          ja: `${n}時間前`,
          en: `${n}h ago`,
          es: `hace ${n}h`,
          fr: `il y a ${n}h`,
          de: `vor ${n} Std.`,
          pt: `há ${n}h`,
          ko: `${n}시간 전`,
          'zh-CN': `${n}小时前`,
          tr: `${n}s önce`
        };
        return map[lang] || `${n}h ago`;
      }

      // Minutes: "15 dk", "30dk önce", "10 dakika"
      const minMatch = str.match(/(\d+)\s*(?:dakika|dk|m)(?:\s*önce|\s*ago)?/i);
      if (minMatch) {
        const n = minMatch[1];
        const map = {
          ja: `${n}分前`,
          en: `${n}m ago`,
          es: `hace ${n}m`,
          fr: `il y a ${n} min`,
          de: `vor ${n} Min.`,
          pt: `há ${n} min`,
          ko: `${n}분 전`,
          'zh-CN': `${n}分钟前`,
          tr: `${n}dk önce`
        };
        return map[lang] || `${n}m ago`;
      }

      // Days: "1 gün", "2 gün", "3g önce", "1d ago"
      const dayMatch = str.match(/(\d+)\s*(?:gün|g|d)(?:\s*önce|\s*ago)?/i);
      if (dayMatch) {
        const n = dayMatch[1];
        const map = {
          ja: `${n}日前`,
          en: `${n}d ago`,
          es: `hace ${n}d`,
          fr: `il y a ${n}j`,
          de: `vor ${n} T.`,
          pt: `há ${n}d`,
          ko: `${n}일 전`,
          'zh-CN': `${n}天前`,
          tr: `${n} gün önce`
        };
        return map[lang] || `${n}d ago`;
      }

      // Weeks: "1 hafta", "2h önce", "1w ago"
      const weekMatch = str.match(/(\d+)\s*(?:hafta|w)(?:\s*önce|\s*ago)?/i);
      if (weekMatch) {
        const n = weekMatch[1];
        const map = {
          ja: `${n}週間前`,
          en: `${n}w ago`,
          es: `hace ${n} sem`,
          fr: `il y a ${n} sem`,
          de: `vor ${n} Wo.`,
          pt: `há ${n} sem`,
          ko: `${n}주 전`,
          'zh-CN': `${n}周前`,
          tr: `${n} hafta önce`
        };
        return map[lang] || `${n}w ago`;
      }

      return str;
    }

    
    // ================= GLOBAL COUNTRY & HANDLE FORMATTER ENGINE =================
    const COUNTRY_CONFIG = {
      UK: { dial: '+44', flag: '🇬🇧', placeholder: '7XXX XXXXXX', name: 'United Kingdom' },
      TR: { dial: '+90', flag: '🇹🇷', placeholder: '5XX XXX XX XX', name: 'Türkiye' },
      US: { dial: '+1', flag: '🇺🇸', placeholder: '(XXX) XXX-XXXX', name: 'United States' },
      JP: { dial: '+81', flag: '🇯🇵', placeholder: '090 XXXX XXXX', name: 'Japan' },
      DE: { dial: '+49', flag: '🇩🇪', placeholder: '15X XXXX XXXX', name: 'Germany' },
      FR: { dial: '+33', flag: '🇫🇷', placeholder: '6 XX XX XX XX', name: 'France' },
      ES: { dial: '+34', flag: '🇪🇸', placeholder: '6XX XX XX XX', name: 'Spain' },
      IT: { dial: '+39', flag: '🇮🇹', placeholder: '3XX XXX XXXX', name: 'Italy' },
      BR: { dial: '+55', flag: '🇧🇷', placeholder: 'XX XXXXX-XXXX', name: 'Brazil' },
      KR: { dial: '+82', flag: '🇰🇷', placeholder: '010 XXXX XXXX', name: 'South Korea' },
      CN: { dial: '+86', flag: '🇨🇳', placeholder: '1XX XXXX XXXX', name: 'China' },
      CA: { dial: '+1', flag: '🇨🇦', placeholder: '(XXX) XXX-XXXX', name: 'Canada' },
      AU: { dial: '+61', flag: '🇦🇺', placeholder: '4XX XXX XXX', name: 'Australia' },
      NL: { dial: '+31', flag: '🇳🇱', placeholder: '6 XXXXXXXX', name: 'Netherlands' },
      CH: { dial: '+41', flag: '🇨🇭', placeholder: '7X XXX XX XX', name: 'Switzerland' },
      SE: { dial: '+46', flag: '🇸🇪', placeholder: '7X XXX XX XX', name: 'Sweden' },
      AE: { dial: '+971', flag: '🇦🇪', placeholder: '5X XXX XXXX', name: 'United Arab Emirates' },
      SA: { dial: '+966', flag: '🇸🇦', placeholder: '5X XXX XXXX', name: 'Saudi Arabia' },
      GLOBAL: { dial: '+0', flag: '🌐', placeholder: 'Phone Number', name: 'Global' }
    };

    function formatUserHandleWithCountry(username, countryCode, location) {
      if (!username) return 'poodle_friend-UK';
      const cleanUser = String(username).replace(/^@/, '').trim();
      
      // If already ends with hyphen and 2-4 uppercase letters (e.g. charlie-UK, mochi-JP)
      if (/-[A-Z]{2,4}$/.test(cleanUser)) {
        return cleanUser;
      }

      let code = (countryCode || '').toUpperCase().trim();
      if (!code && location) {
        const locLower = String(location).toLowerCase();
        if (locLower.includes('uk') || locLower.includes('london') || locLower.includes('ingiltere') || locLower.includes('britain') || locLower.includes('united kingdom')) code = 'UK';
        else if (locLower.includes('japan') || locLower.includes('tokyo') || locLower.includes('japonya')) code = 'JP';
        else if (locLower.includes('türkiye') || locLower.includes('turkey') || locLower.includes('istanbul') || locLower.includes('ankara') || locLower.includes('izmir') || locLower.includes('bebek')) code = 'TR';
        else if (locLower.includes('usa') || locLower.includes('us') || locLower.includes('new york') || locLower.includes('california') || locLower.includes('los angeles') || locLower.includes('abd')) code = 'US';
        else if (locLower.includes('germany') || locLower.includes('berlin') || locLower.includes('münchen') || locLower.includes('almanya')) code = 'DE';
        else if (locLower.includes('france') || locLower.includes('paris') || locLower.includes('fransa')) code = 'FR';
        else if (locLower.includes('spain') || locLower.includes('madrid') || locLower.includes('barcelona') || locLower.includes('ispanya')) code = 'ES';
        else if (locLower.includes('italy') || locLower.includes('roma') || locLower.includes('milan') || locLower.includes('italya')) code = 'IT';
        else if (locLower.includes('korea') || locLower.includes('seoul') || locLower.includes('kore')) code = 'KR';
        else if (locLower.includes('china') || locLower.includes('shanghai') || locLower.includes('beijing') || locLower.includes('çin')) code = 'CN';
        else if (locLower.includes('brazil') || locLower.includes('brasil') || locLower.includes('brezilya')) code = 'BR';
        else if (locLower.includes('canada') || locLower.includes('toronto') || locLower.includes('kanada')) code = 'CA';
        else if (locLower.includes('australia') || locLower.includes('sydney') || locLower.includes('avustralya')) code = 'AU';
      }

      if (!code && typeof currentUser !== 'undefined' && currentUser) {
        if (cleanUser === currentUser.username) {
          code = (currentUser.countryCode || 'UK').toUpperCase();
        }
      }

      if (!code) {
        code = 'UK';
      }

      return `${cleanUser}-${code}`;
    }

    function handleAuthCountryChange(code) {
      const cfg = COUNTRY_CONFIG[code] || COUNTRY_CONFIG['UK'];
      const flagEl = document.getElementById('auth-phone-flag');
      const dialEl = document.getElementById('auth-phone-dial');
      const phoneInput = document.getElementById('auth-input-phone');
      const previewEl = document.getElementById('auth-handle-preview');
      const usernameInput = document.getElementById('auth-input-username');
      
      if (flagEl) flagEl.innerText = cfg.flag;
      if (dialEl) dialEl.innerText = cfg.dial;
      if (phoneInput) phoneInput.placeholder = cfg.placeholder;
      
      const currentTypedUser = (usernameInput && usernameInput.value.trim()) ? usernameInput.value.trim() : 'üyeadi';
      if (previewEl) {
        previewEl.innerText = '@' + formatUserHandleWithCountry(currentTypedUser, code);
      }
    }

    function handleAuthUsernameInput(val) {
      const countrySel = document.getElementById('auth-input-country');
      const code = countrySel ? countrySel.value : 'UK';
      const previewEl = document.getElementById('auth-handle-preview');
      const clean = val.trim() || 'üyeadi';
      if (previewEl) {
        previewEl.innerText = '@' + formatUserHandleWithCountry(clean, code);
      }
    }

    function updateCreatePostHandlePreview() {
      const sel = document.getElementById('create-post-country');
      const code = sel ? sel.value : (currentUser.countryCode || 'UK');
      const preview = document.getElementById('create-preview-handle');
      const badge = document.getElementById('create-user-handle-badge');
      const handle = '@' + formatUserHandleWithCountry(currentUser.username, code);
      if (preview) preview.innerText = handle;
      if (badge) badge.innerText = handle;
    }

    function renderPosts() {
      const feed = document.getElementById('posts-feed');
      if (!feed) return;

      let filteredPosts = postsData;

      // Filter by Feed Mode (For You vs Following)
      if (currentFeedMode === 'following') {
        const followedUsernames = (window.SAMPLE_USERS_LIST || [])
          .filter(u => u.isFollowing)
          .map(u => u.username);
        filteredPosts = postsData.filter(p => followedUsernames.includes(p.username) || (currentUser && p.username === currentUser.username));
        if (!filteredPosts.length) {
          feed.innerHTML = `
            <div class="py-12 bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] rounded-3xl flex flex-col items-center justify-center text-center p-8 shadow-xs gap-3">
              <span class="text-4xl animate-bounce">👥</span>
              <div>
                <h4 class="font-extrabold text-sm text-black dark:text-white">Henüz Takip Ettiğin Gönderi Yok</h4>
                <p class="text-xs text-[#737373] mt-1 max-w-sm">Takip ettiğin Poodle dostlarının paylaşımları burada kronolojik olarak akar. Hemen yeni dostlar keşfet!</p>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button onclick="switchFeedMode('foryou')" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer">
                  🐾 Senin İçin Akışına Dön
                </button>
                <button onclick="openFollowersModal('following')" class="px-4 py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer">
                  Dostları Keşfet
                </button>
              </div>
            </div>
          `;
          return;
        }
      }

      // Filter by Color/Breed Chip
      if (currentFeedFilter === 'red') {
        filteredPosts = filteredPosts.filter(p => /red|apricot|kızıl|kahve/i.test(`${p.caption} ${p.hashtags} ${p.username}`));
      } else if (currentFeedFilter === 'toy') {
        filteredPosts = filteredPosts.filter(p => /toy|minik|tiny/i.test(`${p.caption} ${p.hashtags} ${p.username}`));
      } else if (currentFeedFilter === 'white') {
        filteredPosts = filteredPosts.filter(p => /white|beyaz|krem|cream/i.test(`${p.caption} ${p.hashtags} ${p.username}`));
      } else if (currentFeedFilter === 'silver') {
        filteredPosts = filteredPosts.filter(p => /silver|gümüş|gri|black|siyah/i.test(`${p.caption} ${p.hashtags} ${p.username}`));
      } else if (currentFeedFilter === 'chocolate') {
        filteredPosts = filteredPosts.filter(p => /choc|çikolata|brown/i.test(`${p.caption} ${p.hashtags} ${p.username}`));
      } else if (currentFeedFilter === 'standard') {
        filteredPosts = filteredPosts.filter(p => /standard|standart|büyük/i.test(`${p.caption} ${p.hashtags} ${p.username}`));
      }

      if (!filteredPosts.length) {
        feed.innerHTML = `
          <div class="py-12 bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] rounded-3xl flex flex-col items-center justify-center text-center text-[#737373] gap-3 p-6 shadow-xs">
            <span class="text-3xl">🐾</span>
            <div>
              <p class="font-bold text-sm text-black dark:text-white">Bu filtreye uygun gönderi bulunamadı</p>
              <p class="text-xs text-[#737373] mt-1">Farklı bir renk veya boy seçebilir veya tüm akışı görebilirsin.</p>
            </div>
            <button onclick="filterPostsFeed('all')" class="mt-1 px-4 py-1.5 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 text-xs font-bold rounded-lg text-amber-600 dark:text-amber-400 transition cursor-pointer">Tüm Gönderileri Göster</button>
          </div>
        `;
        return;
      }

      feed.innerHTML = filteredPosts.map(post => {
        const meta = getPoodleMeta(post);
        return `
        <article data-post-id="${post.id}" class="bg-white dark:bg-[#141414] border border-[#e5e5e5] dark:border-[#262626] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all">
          
          <!-- Poodle Identity Header -->
          <div class="p-3.5 flex items-center justify-between">
            <div class="flex items-center gap-3 min-w-0">
              <!-- Avatar with warm Poodle gradient ring -->
              <div onclick="viewUserProfile('${post.username}')" class="relative size-11 p-0.5 rounded-full poodle-gradient-ring cursor-pointer shrink-0" title="@${post.username} ${_yp('Profilini Gör')}">
                <img src="${post.userAvatar}" alt="${post.username}" class="size-full object-cover rounded-full border border-white dark:border-black">
              </div>
              
              <!-- Name, Badges & Location -->
              <div class="flex flex-col min-w-0 leading-tight">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span onclick="viewUserProfile('${post.username}')" class="font-extrabold text-sm text-black dark:text-white cursor-pointer hover:underline truncate" title="@${post.username}">
                    ${meta.petName}
                  </span>
                  ${(post.isAi || post.badge === 'ai_guide' || AI_PERSONA_USERNAMES.includes(post.username)) ? getAiGuideBadgeHtml() : ((post.verified || (post.username === currentUser.username && currentUser.isVerified)) ? getVerifiedPawBadgeHtml('size-3') : '')}
                  <span class="text-[11px] text-[#8e8e8e] font-normal truncate">@${formatUserHandleWithCountry(post.username, post.countryCode, post.location)}</span>
                  <span class="text-[#8e8e8e] text-[11px]">· ${formatTimeAgoI18n(post.timeAgo)}</span>
                </div>
                
                <!-- Poodle Identity Pills & Location Chip -->
                <div class="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar">
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 shrink-0">
                    ${meta.breedIcon} ${_yp(meta.breed)}
                  </span>
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${meta.colorBadge} border shrink-0">
                    ${meta.colorDot} ${_yp(meta.color)}
                  </span>
                  <span class="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-[#202020] text-gray-600 dark:text-gray-400 shrink-0 flex items-center gap-1 truncate max-w-[140px]">
                    <span>📍</span>
                    <span class="truncate">${post.location}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Options Menu Button -->
            <button onclick="openPostOptionsMenu('${post.id}', '${post.username}')" class="text-[#737373] hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition cursor-pointer shrink-0" title="${_yp('Seçenekler')}">
              <svg class="size-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>
            </button>
          </div>

          <!-- Post Media Vitrini (4:5 Portrait Ratio) -->
          <div class="relative bg-black select-none overflow-hidden aspect-[4/5] flex items-center justify-center cursor-pointer group/media" ondblclick="handleDoubleTap('${post.id}', this)" ontouchend="handleMediaTouchEnd(event, '${post.id}', this)">
            ${(post.mediaType === 'video' || (post.image && post.image.match(/\.(mp4|webm|mov|m4v|m3u8)$/i))) ? `
              <video data-hls-src="${post.hlsUrl || ''}" data-mp4-src="${post.image}" src="${post.image}" class="hls-video-player size-full object-cover" autoplay loop muted playsinline controls></video>
              ${post.hlsUrl ? `
                <div class="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full pointer-events-none flex items-center gap-1.5 border border-white/20 shadow-sm z-10">
                  <span class="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>HLS Canlı</span>
                </div>
              ` : ''}
            ` : `
              <img src="${post.image}" alt="${post.username} Poodle" class="size-full object-cover">
            `}

            <!-- 🐾 Golden Bouncing Paw Burst Overlay (Option B: Double Tap) -->
            <div class="paw-burst-wrapper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center z-30">
              <div class="paw-burst-icon opacity-0">
                <svg class="size-28 text-amber-400 filter drop-shadow-[0_0_35px_rgba(245,158,11,0.95)]" viewBox="0 0 24 24" fill="currentColor">
                  <ellipse cx="12" cy="15" rx="4.8" ry="3.8"/>
                  <circle cx="6" cy="9.6" r="1.9"/>
                  <circle cx="9.8" cy="6.6" r="1.9"/>
                  <circle cx="14.2" cy="6.6" r="1.9"/>
                  <circle cx="18" cy="9.6" r="1.9"/>
                </svg>
              </div>
              <div class="paw-burst-points opacity-0 absolute top-1/2 left-1/2">
                <span class="px-3.5 py-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-black text-xs rounded-full shadow-2xl border border-white/40 flex items-center gap-1 select-none">
                  <span>✨</span>
                  <span>+5 ${_yp('Pati')}</span>
                  <span>🐾</span>
                </span>
              </div>
            </div>

            <!-- ⚡ TikTok-Style Vertical Floating Action Rail (Right-Rail) -->
            <div class="absolute right-2.5 bottom-3.5 z-20 flex flex-col items-center gap-2.5 select-none pointer-events-auto">
              <!-- 🐾 Paw (Like) Button -->
              <button onclick="toggleLike('${post.id}')" class="rail-btn rail-paw-btn flex flex-col items-center gap-0.5 group/btn cursor-pointer transition active:scale-90" title="${_yp('Pati Ver / Beğen')}">
                <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border ${post.isLiked ? 'border-amber-400/60 shadow-amber-500/30' : 'border-white/20'} text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                  ${post.isLiked ? `
                    <svg class="size-6 text-amber-400 filter drop-shadow animate-scale-up" viewBox="0 0 24 24" fill="currentColor">
                      <ellipse cx="12" cy="15" rx="4" ry="3.2"/>
                      <circle cx="7" cy="10.5" r="1.6"/>
                      <circle cx="10.2" cy="8" r="1.6"/>
                      <circle cx="13.8" cy="8" r="1.6"/>
                      <circle cx="17" cy="10.5" r="1.6"/>
                    </svg>
                  ` : `
                    <svg class="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <ellipse cx="12" cy="15" rx="4" ry="3.2"/>
                      <circle cx="7" cy="10.5" r="1.5" fill="currentColor"/>
                      <circle cx="10.2" cy="8" r="1.5" fill="currentColor"/>
                      <circle cx="13.8" cy="8" r="1.5" fill="currentColor"/>
                      <circle cx="17" cy="10.5" r="1.5" fill="currentColor"/>
                    </svg>
                  `}
                </div>
                <span class="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight">${formatCount(post.likes)}</span>
              </button>

              <!-- 💬 Comment Drawer / Focus Button -->
              <button onclick="focusCommentInput('${post.id}')" class="rail-btn flex flex-col items-center gap-0.5 group/btn cursor-pointer transition active:scale-90" title="Yorum Yap">
                <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                  <svg class="size-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </div>
                <span class="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight">${post.comments.length}</span>
              </button>

              <!-- ↗️ Quick DM / Share Button -->
              <button onclick="openSharePostModal('${post.id}')" class="rail-btn flex flex-col items-center gap-0.5 group/btn cursor-pointer transition active:scale-90" title="${_yp('Paylaş & DM Gönder')}">
                <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                  <svg class="size-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </div>
                <span class="text-[10px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">${_yp('Paylaş')}</span>
              </button>

              <!-- 🔖 Bookmark / Save Button -->
              <button onclick="toggleSave('${post.id}')" class="rail-btn flex flex-col items-center gap-0.5 group/btn cursor-pointer transition active:scale-90" title="Kaydet">
                <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border ${post.isSaved ? 'border-amber-400/60' : 'border-white/20'} text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                  ${post.isSaved ? `
                    <svg class="size-5 text-amber-400 fill-current" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  ` : `
                    <svg class="size-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  `}
                </div>
                <span class="text-[10px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">${post.isSaved ? _yp('Kayıtlı') : _yp('Kaydet')}</span>
              </button>

              <!-- 🎵 Spinning Vinyl Audio Disc -->
              <div onclick="showAudioToast('${meta.audioTitle}')" class="relative group/disc mt-0.5 cursor-pointer select-none" title="Ses: ${meta.audioTitle}">
                <div class="size-10 rounded-full border border-white/40 bg-gradient-to-tr from-amber-600 via-stone-900 to-amber-500 p-1 flex items-center justify-center shadow-xl animate-spin-slow group-hover/disc:scale-110 transition">
                  <div class="size-3.5 rounded-full bg-black border border-white/40 flex items-center justify-center text-[8px] text-amber-300">🐾</div>
                </div>
                <div class="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400 animate-ping pointer-events-none"></div>
              </div>
            </div>
          </div>

          <!-- Post Body & Captions -->
          <div class="p-3.5 space-y-2">
            <!-- Audio Ticker Line -->
            <div onclick="showAudioToast('${meta.audioTitle}')" class="inline-flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer select-none">
              <span class="text-amber-500 animate-pulse text-xs">🎵</span>
              <span class="font-semibold truncate">${meta.audioTitle}</span>
            </div>

            <!-- Caption -->
            <div class="text-xs leading-relaxed text-gray-800 dark:text-gray-200">
              <span onclick="viewUserProfile('${post.username}')" class="font-extrabold cursor-pointer hover:underline mr-1 text-black dark:text-white" title="@${formatUserHandleWithCountry(post.username, post.countryCode, post.location)}">
                ${formatUserHandleWithCountry(post.username, post.countryCode, post.location)}
              </span>
              ${(post.isAi || post.badge === 'ai_guide' || AI_PERSONA_USERNAMES.includes(post.username)) ? getAiGuideBadgeHtml('mr-1') : ((post.verified || (post.username === currentUser.username && currentUser.isVerified)) ? getVerifiedPawBadgeHtml('size-3', 'mr-1') : '')}
              <span id="post-caption-${post.id}" data-original="${encodeURIComponent(post.caption || '')}">${post.caption}</span>
              <p class="text-[#0095f6] dark:text-[#3897f0] font-medium mt-0.5">${post.hashtags}</p>
              ${post.caption ? `
                <div class="mt-1">
                  <button type="button" onclick="togglePostTranslation('${post.id}', event)" id="btn-trans-${post.id}" data-translated="false" class="text-[11px] font-semibold text-[#737373] hover:text-[#262626] dark:hover:text-[#f5f5f5] cursor-pointer inline-flex items-center gap-1 active:scale-95 transition select-none">
                    <span class="btn-trans-text">${getTranslationLinkText(false)}</span>
                    <span id="trans-loading-${post.id}" class="hidden text-[10px] text-amber-500 animate-pulse">⏳</span>
                  </button>
                </div>
              ` : ''}
            </div>

            <!-- Comments List -->
            <div class="text-xs space-y-1 pt-0.5">
              ${post.comments.length > 2 ? `
                <button onclick="focusCommentInput('${post.id}')" class="text-[#737373] text-[11px] font-medium hover:underline cursor-pointer">
                  ${post.comments.length} ${_yp('yorumun tümünü gör')}
                </button>
              ` : ''}
              <div id="comments-list-${post.id}" class="flex flex-col gap-1.5">
                ${(post.comments || []).map(c => {
                  const isReply = c.parentId || c.replyToUser;
                  return `
                    <div class="flex items-start justify-between group text-xs ${isReply ? 'pl-3.5 border-l-2 border-amber-500/30 ml-2 py-0.5' : 'py-0.5'}">
                      <div class="leading-relaxed flex-1">
                        <strong onclick="viewUserProfile('${c.user}')" class="cursor-pointer hover:underline inline-flex items-center gap-1 font-bold text-black dark:text-white" title="@${c.user} ${_yp('Profilini Gör')}">
                          <span>${formatUserHandleWithCountry(c.user, c.countryCode)}</span>
                          ${AI_PERSONA_USERNAMES.includes(c.user) ? '<span class="px-1 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">🤖 AI</span>' : ''}
                        </strong>
                        ${c.replyToUser ? `<span class="text-[#0095f6] font-semibold text-[11px] ml-1">↳ @${c.replyToUser}</span>` : ''}
                        <span class="comment-text text-gray-700 dark:text-gray-300 ml-1" data-original="${encodeURIComponent(c.text || '')}">${c.text}</span>
                      </div>
                      <button onclick="replyToPostComment('${post.id}', '${c.user}', '${c.id || ''}')" class="text-[10px] text-gray-400 hover:text-[#0095f6] font-semibold opacity-0 group-hover:opacity-100 transition shrink-0 ml-2 cursor-pointer">
                        ${_yp('Yanıtla')}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Quick Comment Bar -->
            <div class="border-t border-[#efefef] dark:border-[#222] pt-2.5 mt-2 flex items-center gap-2">
              <button type="button" onclick="focusCommentInput('${post.id}')" class="text-base hover:scale-110 transition cursor-pointer">🐾</button>
              <input id="comment-input-${post.id}" type="text" placeholder="${_yp('Poodle dostuna yorum yaz (+10 Pati 🐾)...')}" class="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400" oninput="togglePostBtn('${post.id}', this)" onkeydown="if(event.key==='Enter') addComment('${post.id}')">
              <button id="comment-btn-${post.id}" onclick="addComment('${post.id}')" class="text-xs font-extrabold text-[#0095f6] hover:text-[#1877f2] opacity-40 cursor-not-allowed transition" disabled>${_yp('Paylaş')}</button>
            </div>
          </div>

        </article>
      `}).join('');

      initSmartVideoObserver();

      // Option A: Automatically translate feed posts and comments for foreign visitors
      const curFeedLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'tr';
      if (curFeedLang !== 'tr') {
        clearTimeout(autoTranslateDebounceTimer);
        autoTranslateDebounceTimer = setTimeout(() => {
          if (typeof autoTranslateFeed === 'function') autoTranslateFeed(curFeedLang);
        }, 120);
      }
    }

    async function fetchReelsFromLiveApi() {
      try {
        const res = await fetch('/api/live/reels');
        const data = await res.json();
        if (data.ok && data.reels && data.reels.length > 0) {
          const liveMapped = data.reels.map(r => ({
            id: r.id,
            username: r.author.username,
            avatar: r.author.avatar || '/images/poodle_mochi.jpg',
            badge: r.author.badge,
            caption: r.caption,
            audio: '🎵 ' + (r.audioTitle || 'Orijinal Ses - YourPoodle'),
            videoUrl: r.videoUrl,
            image: r.thumbnailUrl || '/images/poodle_mochi.jpg',
            likes: r.likes || 35,
            comments: r.comments || 0,
            likedByMe: r.likedByMe,
            productTags: r.productTags || [],
            interactiveSticker: r.interactiveSticker || {}
          }));
          const existingIds = new Set(liveMapped.map(m => m.id));
          const oldUnique = reelsData.filter(d => !existingIds.has(d.id));
          reelsData.length = 0;
          reelsData.push(...liveMapped, ...oldUnique);
        }
      } catch (e) {
        console.warn('Reels fetch error:', e);
      }
    }

    function renderReels() {
      const container = document.getElementById('reels-container');
      if (!container) return;
      container.innerHTML = reelsData.map(reel => `
        <div class="relative w-full max-w-[380px] h-[720px] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 group select-none" ondblclick="triggerReelDoubleTapLike('${reel.id}', event, this)">
          ${reel.videoUrl ? `
            <video src="${reel.videoUrl}" class="absolute inset-0 size-full object-cover cursor-pointer" autoplay loop muted playsinline onclick="toggleReelAudio(this)"></video>
            <button onclick="toggleReelAudioFromBtn(this)" class="reel-audio-pill absolute top-4 right-4 z-20 px-2.5 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-xs text-white font-bold flex items-center gap-1.5 border border-white/20 transition active:scale-95 shadow-md">
              <span class="reel-sound-icon">🔇</span>
              <span class="reel-sound-text">${_yp('Ses Kapalı')}</span>
            </button>
          ` : `
            <img src="${reel.image}" alt="${reel.username}" class="absolute inset-0 size-full object-cover">
          `}
          
          <!-- Double-Tap Paw Heart Explosion Anim -->
          <div class="reel-paw-heart pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-all duration-300 scale-50">
            <span class="text-7xl filter drop-shadow-[0_10px_25px_rgba(236,72,153,0.9)] animate-bounce">🐾❤️</span>
          </div>

          <!-- Shoppable Hotspots Overlay -->
          ${(reel.productTags && reel.productTags.length > 0) ? `
            <div class="absolute inset-0 pointer-events-none z-20">
              ${reel.productTags.map(tag => `
                <div class="absolute pointer-events-auto cursor-pointer" style="left: ${tag.x || 50}%; top: ${tag.y || 60}%;">
                  <div class="relative -translate-x-1/2 -translate-y-1/2">
                    <span class="absolute -inset-1 rounded-full bg-amber-400 animate-ping opacity-75"></span>
                    <button onclick="openProductTagDetails('${escapeHtml(tag.title)}', '${escapeHtml(tag.price)}', ${tag.paw_points || 50}, '${tag.url || '#'}')" class="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/85 hover:bg-black backdrop-blur-md text-white border border-amber-400 text-[11px] font-bold shadow-2xl transition hover:scale-105 active:scale-95">
                      <span>🛍️</span>
                      <span>${tag.title}</span>
                      <span class="text-amber-300 font-extrabold font-mono">${tag.price}</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Gradient Overlays -->
          <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
          <div class="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none"></div>

          <!-- Top Brand Bar -->
          <div class="relative z-10 flex items-center justify-between text-white pointer-events-none">
            <div class="flex items-center gap-1.5">
              <span class="font-black text-lg tracking-tight drop-shadow-md">Reels</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-pink-500 text-white uppercase shadow">${_yp('CANLI')}</span>
            </div>
            <span class="text-[10px] text-white/70">${_yp('Çift tıkla: 🐾❤️')}</span>
          </div>

          <!-- Bottom Content & Right Vertical Action Bar -->
          <div class="relative z-10 flex items-end justify-between gap-3">
            <!-- Left Info Area -->
            <div class="flex-1 text-white flex flex-col gap-2 max-w-[80%] pb-1">
              <!-- Creator Row -->
              <div class="flex items-center gap-2">
                <img onclick="viewUserProfile('${reel.username}')" src="${reel.avatar}" class="size-8 rounded-full border border-white object-cover cursor-pointer hover:opacity-80" title="@${reel.username} ${_yp('Profilini Gör')}">
                <span onclick="viewUserProfile('${reel.username}')" class="font-bold text-xs cursor-pointer hover:underline" title="@${formatUserHandleWithCountry(reel.username, reel.countryCode)} ${_yp('Profilini Gör')}">@${formatUserHandleWithCountry(reel.username, reel.countryCode)}</span>
                <button onclick="toggleReelFollow('${reel.username}', this)" class="px-2.5 py-0.5 bg-white/20 backdrop-blur-md border border-white/40 text-[10px] font-bold rounded-full hover:bg-white/30 transition">Takip Et</button>
              </div>

              <!-- Interactive Poll Sticker if present -->
              ${(reel.interactiveSticker && reel.interactiveSticker.type === 'poll') ? `
                <div id="reel-poll-${reel.id}" class="p-2.5 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/25 text-white space-y-1.5 pointer-events-auto shadow-xl">
                  <p class="font-extrabold text-[11px] text-center drop-shadow">${reel.interactiveSticker.question || 'Bu tüy modeli nasıl? ✂️'}</p>
                  <div class="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
                    <button onclick="voteReelPoll('${reel.id}', 0, this)" class="relative py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 transition text-center overflow-hidden active:scale-95">
                      <span class="relative z-10 block">${(reel.interactiveSticker.options && reel.interactiveSticker.options[0]) || 'Evet'}</span>
                      <span class="poll-bar absolute inset-y-0 left-0 bg-pink-500/50 rounded-xl transition-all" style="width: 75%"></span>
                    </button>
                    <button onclick="voteReelPoll('${reel.id}', 1, this)" class="relative py-1.5 px-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 transition text-center overflow-hidden active:scale-95">
                      <span class="relative z-10 block">${(reel.interactiveSticker.options && reel.interactiveSticker.options[1]) || 'Hayır'}</span>
                      <span class="poll-bar absolute inset-y-0 left-0 bg-blue-500/50 rounded-xl transition-all" style="width: 25%"></span>
                    </button>
                  </div>
                </div>
              ` : ''}

              <!-- Caption -->
              <p class="text-xs text-white/95 leading-snug line-clamp-2">${reel.caption}</p>

              <!-- Audio Marquee with spinning disc icon -->
              <div class="flex items-center gap-2 text-xs text-white/80 overflow-hidden">
                <span class="text-xs">🎵</span>
                <span class="truncate text-[11px] font-medium">${reel.audio}</span>
              </div>
            </div>

            <!-- Right Vertical Actions -->
            <div class="flex flex-col items-center gap-3.5 text-white shrink-0">
              <!-- Like -->
              <button onclick="toggleReelLike('${reel.id}', this)" class="flex flex-col items-center gap-1 hover:scale-110 transition cursor-pointer" title="${_yp('Beğen')}">
                <svg class="size-7 ${reel.likedByMe ? 'text-[#ed4956] fill-current' : ''}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span class="text-[11px] font-bold">${reel.likes}</span>
              </button>

              <!-- Comment -->
              <button onclick="focusReelComment('${reel.username}')" class="flex flex-col items-center gap-1 hover:scale-110 transition cursor-pointer" title="${_yp('Yorum Yap')}">
                <svg class="size-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span class="text-[11px] font-bold">${reel.comments}</span>
              </button>

              <!-- Gift Paw Points -->
              <button onclick="openGiftPawsModal('${reel.username}')" class="flex flex-col items-center gap-0.5 hover:scale-110 transition cursor-pointer" title="${_yp('Pati Puanı Gönder')}">
                <div class="size-8 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center text-sm shadow-md animate-pulse">
                  🐾
                </div>
                <span class="text-[9px] font-black text-amber-300 uppercase tracking-tighter">${_yp('Hediye')}</span>
              </button>

              <!-- Share -->
              <button onclick="showToast('Reels bağlantısı kopyalandı!')" class="flex flex-col items-center gap-1 hover:scale-110 transition cursor-pointer" title="Paylaş">
                <svg class="size-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>

              <!-- Spinning Disc -->
              <div onclick="viewUserProfile('${reel.username}')" class="size-8 rounded-full border-2 border-white/80 overflow-hidden animate-spin-slow cursor-pointer shadow-lg" title="@${reel.username} ${_yp('Profilini Gör')}">
                <img src="${reel.avatar}" class="size-full object-cover">
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    function triggerReelDoubleTapLike(reelId, ev, cardEl) {
      triggerHaptic(30);
      const heartEl = cardEl.querySelector('.reel-paw-heart');
      if (heartEl) {
        heartEl.classList.remove('opacity-0', 'scale-50');
        heartEl.classList.add('opacity-100', 'scale-125');
        setTimeout(() => {
          heartEl.classList.remove('opacity-100', 'scale-125');
          heartEl.classList.add('opacity-0', 'scale-50');
        }, 800);
      }
      const likeBtn = cardEl.querySelector('button[onclick*="toggleReelLike"]');
      if (likeBtn) toggleReelLike(reelId, likeBtn);
    }

    function voteReelPoll(reelId, optIdx, btnEl) {
      triggerHaptic(20);
      addPawPoints(5, 'Reels anketine katıldın 📊');
      showToast('Oyunuz kaydedildi! (+5 Pati 🐾)');
      const pollBox = document.getElementById('reel-poll-' + reelId);
      if (pollBox) {
        pollBox.innerHTML = `
          <div class="py-2 text-center text-xs font-bold text-emerald-400">
            ✅ Oyunuz alındı! Teşekkürler 🐾
          </div>
        `;
      }
    }

    function openProductTagDetails(title, price, paws, url) {
      document.getElementById('prod-modal-title').innerText = title;
      document.getElementById('prod-modal-price').innerText = price;
      document.getElementById('prod-modal-paws').innerText = `${paws} Paw Puanı İndirimi`;
      window.__activeProductUrl = url;
      document.getElementById('product-tag-modal').classList.remove('hidden');
    }

    function closeProductTagModal() {
      document.getElementById('product-tag-modal').classList.add('hidden');
    }

    function claimPawDiscountAndShop() {
      addPawPoints(-10, 'Ürün indirim kuponu kullanıldı 🛍️');
      showToast('🎉 50 Paw Puanı indirimi uygulandı! Mağaza sayfasına yönlendiriliyorsunuz...');
      closeProductTagModal();
      if (window.__activeProductUrl && window.__activeProductUrl !== '#') {
        setTimeout(() => { window.location.href = window.__activeProductUrl; }, 1000);
      }
    }

    function openGiftPawsModal(username) {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Pati puanı hediye etmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      const points = prompt(`@${username} kullanıcısına kaç Paw Puanı hediye etmek istersiniz? (10, 50, 100):`, "25");
      const num = parseInt(points);
      if (num && num > 0) {
        if ((currentUser.pawPoints || 0) < num) {
          showToast(`Yetersiz bakiye! Mevcut: ${currentUser.pawPoints || 0} Pati 🐾`);
          return;
        }
        addPawPoints(-num, `@${username} kullanıcısına hediye edildi 🎁`);
        showToast(`🎁 @${username} kullanıcısına ${num} Pati Puanı hediye edildi! Harikasın!`);
      }
    }

    function toggleReelAudio(videoEl) {
      if (!videoEl) return;
      videoEl.muted = !videoEl.muted;
      const card = videoEl.closest('.relative');
      if (card) {
        const icon = card.querySelector('.reel-sound-icon');
        const text = card.querySelector('.reel-sound-text');
        if (icon) icon.innerText = videoEl.muted ? '🔇' : '🔊';
        if (text) text.innerText = videoEl.muted ? 'Ses Kapalı' : 'Ses Açık';
      }
      showToast(videoEl.muted ? '🔇 Reels sesi kapatıldı' : '🔊 Reels sesi açıldı 🎵');
      triggerHaptic(15);
    }

    function toggleReelAudioFromBtn(btnEl) {
      const card = btnEl.closest('.relative');
      if (!card) return;
      const videoEl = card.querySelector('video');
      if (videoEl) toggleReelAudio(videoEl);
    }

    function toggleReelFollow(username, btnEl) {
      if (!username) return;
      const isFollowing = btnEl.innerText.includes('Takip Ediliyor');
      if (isFollowing) {
        btnEl.innerText = 'Takip Et';
        btnEl.className = 'px-2.5 py-0.5 bg-white/20 backdrop-blur-md border border-white/40 text-[10px] font-bold rounded-full hover:bg-white/30 transition';
        showToast(`@${username} takipten çıkarıldı.`);
      } else {
        btnEl.innerText = '✓ Takip Ediliyor';
        btnEl.className = 'px-2.5 py-0.5 bg-emerald-500/80 backdrop-blur-md border border-emerald-400 text-[10px] font-bold rounded-full text-white transition';
        addPawPoints(15, `@${username} takip edildi`);
        showToast(`@${username} takip edildi! (+15 Pati 🐾)`);
      }
      const prof = POODLE_PROFILES[username];
      if (prof) prof.isFollowing = !isFollowing;
    }

    function toggleReelLike(reelId, btnEl) {
      const reel = reelsData.find(r => r.id === reelId);
      if (!reel) return;
      reel.isLiked = !reel.isLiked;
      const icon = btnEl.querySelector('svg');
      const countEl = btnEl.querySelector('span');
      if (reel.isLiked) {
        if (icon) {
          icon.setAttribute('fill', '#ed4956');
          icon.setAttribute('stroke', '#ed4956');
          icon.classList.add('text-[#ed4956]');
        }
        reel.likesNum = (reel.likesNum || parseInt(reel.likes) * 1000 || 34200) + 1;
        if (countEl) countEl.innerText = `${(reel.likesNum / 1000).toFixed(1)}B`;
        addPawPoints(5, 'Reels beğendin ❤️');
        showToast('Reels beğenildi! ❤️ (+5 Pati 🐾)');
      } else {
        if (icon) {
          icon.setAttribute('fill', 'none');
          icon.setAttribute('stroke', 'currentColor');
          icon.classList.remove('text-[#ed4956]');
        }
        reel.likesNum = Math.max(0, (reel.likesNum || 34200) - 1);
        if (countEl) countEl.innerText = `${(reel.likesNum / 1000).toFixed(1)}B`;
        showToast('Reels beğenisi geri alındı.');
      }
    }

    function focusReelComment(username) {
      const comm = prompt(`@${username} reels videosuna yorum yap (+10 Pati 🐾):`);
      if (comm && comm.trim()) {
        addPawPoints(10, 'Reels yorumu yapıldı 💬');
        showToast(`@${username} videosuna yorumun paylaşıldı! (+10 Pati 🐾)`);
      }
    }

    async function renderExplore() {
      const container = document.getElementById('explore-grid');
      if (!container) return;

      try {
        const res = await fetch('/api/live/explore');
        const data = await res.json();
        if (data.ok && data.explore && data.explore.length > 0) {
          container.innerHTML = data.explore.map(item => `
            <div onclick="viewUserProfile('${item.authorUsername}')" class="relative aspect-square group cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-800" title="@${item.authorUsername} (${item.authorName})">
              <img src="${item.mediaUrl}" alt="Explore" class="size-full object-cover group-hover:scale-105 transition duration-300" loading="lazy">
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-bold text-sm">
                <span class="flex items-center gap-1.5">
                  <svg class="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> 
                  ${item.likes || 120}
                </span>
                <span class="flex items-center gap-1.5">
                  <svg class="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> 
                  ${item.comments || 8}
                </span>
              </div>
              ${item.isReel ? '<span class="absolute top-2 right-2 text-white drop-shadow-md text-base">🎬</span>' : ''}
              <div class="absolute bottom-2 left-2 text-[10px] text-white/90 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[85%] font-medium">
                @${item.authorUsername}
              </div>
            </div>
          `).join('');
          return;
        }
      } catch(e) {
        console.warn('Live explore error, fallback to curated:', e);
      }
    }

    function renderProfile(targetUsername) {
      if (typeof renderMainProfile === 'function') {
        renderMainProfile(targetUsername);
      }
    }

    function renderSuggestions() {
      const container = document.getElementById('suggestions-list');
      container.innerHTML = suggestedData.map((s, idx) => `
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-3">
            <div onclick="viewUserProfile('${s.username}')" class="size-8 rounded-full overflow-hidden border border-[#dbdbdb] dark:border-[#333] cursor-pointer" title="@${s.username} ${_yp('Profilini Gör')}">
              <img src="${s.avatar}" alt="${s.username}" class="size-full object-cover">
            </div>
            <div class="flex flex-col leading-tight">
              <span onclick="viewUserProfile('${s.username}')" class="font-bold cursor-pointer hover:underline" title="@${s.username} ${_yp('Profilini Gör')}">${s.username}</span>
              <span class="text-[#737373] text-[10px]">${s.desc}</span>
            </div>
          </div>
          <button id="follow-btn-${idx}" onclick="toggleFollow(${idx})" class="font-bold text-[#0095f6] hover:text-[#1877f2]">Takip Et</button>
        </div>
      `).join('');
    }

    // ================= REALTIME WEBSOCKET DIRECT MESSAGING =================
    let chatSocket = null;
    let socketReconnectTimer = null;
    let pingIntervalTimer = null;
    let onlineChatUsers = new Set();
    let currentActiveTab = 'home';
    let lastIncomingSender = null;
    let realtimeBannerTimeout = null;
    let dmTypingTimer = null;
    let isCurrentlyTyping = false;
    let incomingTypingTimer = null;
    let activeDmIndex = 0;

    // Rich DM State (Voice, View Once, Media, Audio Player)
    let dmMediaRecorder = null;
    let dmAudioChunks = [];
    let dmRecordingTimer = null;
    let dmRecordingSeconds = 0;
    let isDmRecordingVoice = false;
    let dmCurrentPlayingAudio = null;
    let dmCurrentPlayingMsgId = null;
    let pendingDmPhotoFile = null;
    let isDmViewOnceActive = true;
    let activeEphemeralMsgId = null;
    let ephemeralCountdownTimer = null;

    function safeEscape(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function renderDmSingleMessage(m, myUsername) {
      const isMe = (m.sender === 'me' || (m.sender && m.sender.toLowerCase() === myUsername));
      const timeStr = m.time || 'şimdi';
      const msgType = m.msgType || 'text';
      const msgId = m.id || ('msg_' + Math.random().toString(36).substr(2, 9));

      // Read status ticks
      let tickHtml = '';
      if (isMe) {
        const st = m.status || 'sent';
        if (st === 'read') {
          tickHtml = `<span class="dm-tick text-sky-300 font-bold ml-1 text-[11px]" title="Okundu">✓✓</span>`;
        } else if (st === 'delivered') {
          tickHtml = `<span class="dm-tick text-white/70 ml-1 text-[11px]" title="İletildi">✓✓</span>`;
        } else {
          tickHtml = `<span class="dm-tick text-white/60 ml-1 text-[11px]" title="Gönderildi">✓</span>`;
        }
      }

      // 1. Voice Note (Sesli Mesaj)
      if (msgType === 'audio') {
        const durationSec = Math.round(m.duration || 5);
        const min = Math.floor(durationSec / 60);
        const sec = String(durationSec % 60).padStart(2, '0');
        const durStr = `${min}:${sec}`;

        return isMe ? `
          <div id="${msgId}" class="self-end max-w-[82%] sm:max-w-[70%] bg-[#0095f6] text-white p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-1.5 animate-fade-in select-none">
            <div class="flex items-center gap-2.5">
              <button type="button" onclick="toggleDmAudioPlay('${msgId}', '${m.mediaUrl}', this)" class="size-8 rounded-full bg-white text-[#0095f6] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs hover:scale-105 active:scale-95 transition cursor-pointer">
                <span class="audio-play-icon">▶</span>
              </button>
              <div class="flex-1 flex flex-col gap-1 min-w-[120px]">
                <div class="h-1.5 bg-white/30 rounded-full overflow-hidden w-full relative">
                  <div class="audio-progress-bar h-full bg-white rounded-full w-0 transition-all duration-100"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-white/80 font-mono">
                  <span class="audio-current-time">0:00</span>
                  <span>🎙️ ${durStr}</span>
                </div>
              </div>
              <button type="button" onclick="toggleDmAudioSpeed('${msgId}', this)" class="audio-speed-btn px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold text-white shrink-0 hover:bg-white/30 cursor-pointer">1x</button>
            </div>
            <div class="flex items-center justify-end text-[10px] text-white/75 gap-0.5 self-end">
              <span>${timeStr}</span>${tickHtml}
            </div>
          </div>
        ` : `
          <div id="${msgId}" class="self-start max-w-[82%] sm:max-w-[70%] bg-[#efefef] dark:bg-[#262626] text-gray-900 dark:text-gray-100 p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-1.5 animate-fade-in select-none">
            <div class="flex items-center gap-2.5">
              <button type="button" onclick="toggleDmAudioPlay('${msgId}', '${m.mediaUrl}', this)" class="size-8 rounded-full bg-[#0095f6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs hover:scale-105 active:scale-95 transition cursor-pointer">
                <span class="audio-play-icon">▶</span>
              </button>
              <div class="flex-1 flex flex-col gap-1 min-w-[120px]">
                <div class="h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden w-full relative">
                  <div class="audio-progress-bar h-full bg-[#0095f6] rounded-full w-0 transition-all duration-100"></div>
                </div>
                <div class="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span class="audio-current-time">0:00</span>
                  <span>🎙️ ${durStr}</span>
                </div>
              </div>
              <button type="button" onclick="toggleDmAudioSpeed('${msgId}', this)" class="audio-speed-btn px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[10px] font-bold text-gray-600 dark:text-gray-300 shrink-0 hover:bg-gray-300 cursor-pointer">1x</button>
            </div>
            <div class="text-[10px] text-gray-400 text-right self-end">${timeStr}</div>
          </div>
        `;
      }

      // 2. View Once (Tek Seferlik Görüntülenen Medya)
      if (msgType === 'view_once' || m.isViewOnce) {
        const isViewed = !!m.isViewed;

        if (isMe) {
          return `
            <div id="${msgId}" class="self-end max-w-[78%] bg-[#0095f6] text-white p-3 rounded-2xl text-sm shadow-sm flex items-center gap-2.5 select-none animate-fade-in">
              <span class="size-6 rounded-full border-2 border-dashed border-white/70 flex items-center justify-center text-[10px] font-black shrink-0 ${isViewed ? 'opacity-40' : ''}">1</span>
              <div class="flex-1">
                <p class="font-bold text-xs ${isViewed ? 'line-through opacity-70' : ''}">
                  ${isViewed ? '⚪ Fotoğraf Açıldı' : '📷 Fotoğraf (1 Kez)'}
                </p>
                <span class="text-[10px] text-white/75">${timeStr}</span>
              </div>
              ${tickHtml}
            </div>
          `;
        } else {
          if (isViewed) {
            return `
              <div id="${msgId}" class="self-start max-w-[78%] bg-[#efefef] dark:bg-[#262626] text-gray-500 p-3 rounded-2xl text-sm shadow-sm flex items-center gap-2.5 select-none opacity-60">
                <span class="size-6 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <div>
                  <p class="font-bold text-xs line-through">Fotoğraf Açıldı</p>
                  <span class="text-[10px]">Tek seferlik görüntüleme sona erdi</span>
                </div>
              </div>
            `;
          } else {
            return `
              <div id="${msgId}" onclick="openEphemeralViewOnce('${msgId}', '${m.mediaUrl}', '${m.sender}')" class="self-start max-w-[80%] bg-gradient-to-r from-amber-500/15 to-rose-500/15 hover:from-amber-500/25 hover:to-rose-500/25 border-2 border-amber-500/40 text-gray-900 dark:text-white p-3 rounded-2xl text-sm shadow-sm flex items-center gap-2.5 cursor-pointer active:scale-95 transition group select-none animate-fade-in">
                <span class="size-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm group-hover:scale-110 transition animate-pulse">1</span>
                <div>
                  <p class="font-bold text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <span>Fotoğraf</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/25 font-black">Dokun ve Gör</span>
                  </p>
                  <span class="text-[10px] text-gray-400">${timeStr} · 🔒 1 kez görüntülenebilir</span>
                </div>
              </div>
            `;
          }
        }
      }

      // 3. Standard Image
      if (msgType === 'image' && m.mediaUrl) {
        return isMe ? `
          <div id="${msgId}" class="self-end max-w-[70%] bg-[#0095f6] text-white p-2 rounded-2xl text-sm shadow-sm flex flex-col gap-1.5 animate-fade-in">
            <img src="${m.mediaUrl}" class="rounded-xl max-h-56 w-auto object-cover border border-white/20">
            <div class="flex items-center justify-end text-[10px] text-white/75 gap-0.5 px-1">
              <span>${timeStr}</span>${tickHtml}
            </div>
          </div>
        ` : `
          <div id="${msgId}" class="self-start max-w-[70%] bg-[#efefef] dark:bg-[#262626] text-gray-900 dark:text-gray-100 p-2 rounded-2xl text-sm shadow-sm flex flex-col gap-1.5 animate-fade-in">
            <img src="${m.mediaUrl}" class="rounded-xl max-h-56 w-auto object-cover border border-gray-200 dark:border-gray-700">
            <div class="text-[10px] text-gray-400 text-right px-1">${timeStr}</div>
          </div>
        `;
      }

      // 4. Standard Text Message
      return isMe ? `
        <div id="${msgId}" class="self-end max-w-[70%] bg-[#0095f6] text-white p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-0.5 animate-fade-in">
          <div class="leading-relaxed break-words">${safeEscape(m.text)}</div>
          <div class="flex items-center justify-end text-[10px] text-white/75 gap-0.5 self-end">
            <span>${timeStr}</span>${tickHtml}
          </div>
        </div>
      ` : `
        <div id="${msgId}" class="self-start max-w-[70%] bg-[#efefef] dark:bg-[#262626] text-gray-900 dark:text-gray-100 p-3 rounded-2xl text-sm shadow-sm flex flex-col gap-0.5 animate-fade-in">
          <div class="dm-text-bubble leading-relaxed break-words" data-original="${encodeURIComponent(m.text || '')}">${safeEscape(m.text)}</div>
          <div class="flex items-center justify-between text-[10px] text-gray-400 gap-2 mt-0.5 self-stretch">
            <span class="dm-trans-badge hidden text-amber-600 dark:text-amber-400 text-[9px] font-bold cursor-pointer hover:underline" onclick="toggleDmMsgTranslation('${msgId}', event)">🌐 原文</span>
            <span class="ml-auto text-[10px] text-gray-400">${timeStr}</span>
          </div>
        </div>
      `;
    }

    async function autoTranslateDmChat(targetLang) {
      if (!targetLang) {
        targetLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'tr';
      }
      const bubbles = document.querySelectorAll('#dm-messages .dm-text-bubble');
      if (!bubbles.length) return;

      if (targetLang === 'tr') {
        bubbles.forEach(el => {
          const orig = decodeURIComponent(el.getAttribute('data-original') || el.innerText);
          el.innerText = orig;
          const badge = el.parentElement ? el.parentElement.querySelector('.dm-trans-badge') : null;
          if (badge) badge.classList.add('hidden');
        });
        return;
      }

      for (const el of bubbles) {
        const orig = decodeURIComponent(el.getAttribute('data-original') || el.innerText);
        if (!orig || !orig.trim()) continue;
        try {
          const res = await translateText(orig, targetLang);
          if (res && res.text) {
            el.innerText = res.text;
            const badge = el.parentElement ? el.parentElement.querySelector('.dm-trans-badge') : null;
            if (badge) {
              const origLabel = targetLang === 'ja' ? '原文' : (targetLang === 'en' ? 'Original' : 'Orijinal');
              badge.innerText = `🌐 ${origLabel}`;
              badge.classList.remove('hidden');
            }
          }
        } catch (_) {}
      }
    }

    function toggleDmMsgTranslation(msgId, e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const wrap = document.getElementById(msgId);
      if (!wrap) return;
      const el = wrap.querySelector('.dm-text-bubble');
      const badge = wrap.querySelector('.dm-trans-badge');
      if (!el) return;

      const orig = decodeURIComponent(el.getAttribute('data-original') || '');
      const isReverted = el.getAttribute('data-is-orig') === 'true';

      if (isReverted) {
        // Translate back
        const targetLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'ja';
        const cacheKey = `${targetLang}:${orig}`;
        if (postTranslationCache.has(cacheKey)) {
          el.innerText = postTranslationCache.get(cacheKey).text;
          el.setAttribute('data-is-orig', 'false');
          if (badge) badge.innerText = `🌐 ${targetLang === 'ja' ? '原文' : 'Original'}`;
        }
      } else {
        // Show original
        el.innerText = orig;
        el.setAttribute('data-is-orig', 'true');
        const targetLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'ja';
        if (badge) badge.innerText = `🌐 ${targetLang === 'ja' ? '翻訳' : 'Translate'}`;
      }
    }

    function initChatWebSocket() {
      try {
        if (chatSocket && (chatSocket.readyState === WebSocket.OPEN || chatSocket.readyState === WebSocket.CONNECTING)) {
          return;
        }
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/chat`;

        chatSocket = new WebSocket(wsUrl);

        chatSocket.onopen = () => {
          console.log('[YourPoodle Chat] WebSocket connected to', wsUrl);
          clearTimeout(socketReconnectTimer);
          registerChatUser();

          // Heartbeat ping every 25s
          clearInterval(pingIntervalTimer);
          pingIntervalTimer = setInterval(() => {
            if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
              chatSocket.send(JSON.stringify({ type: 'ping' }));
            }
          }, 25000);
        };

        chatSocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleChatWebSocketMessage(data);
          } catch(err) {
            console.warn('[YourPoodle Chat] Parse error:', err);
          }
        };

        chatSocket.onerror = (err) => {
          console.warn('[YourPoodle Chat] WebSocket error:', err);
        };

        chatSocket.onclose = () => {
          console.log('[YourPoodle Chat] WebSocket closed. Reconnecting in 3s...');
          clearInterval(pingIntervalTimer);
          clearTimeout(socketReconnectTimer);
          socketReconnectTimer = setTimeout(() => {
            initChatWebSocket();
          }, 3000);
        };
      } catch(e) {
        console.warn('[YourPoodle Chat] Init error:', e);
      }
    }

    function registerChatUser() {
      if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) return;
      const myUsername = currentUser && currentUser.username ? currentUser.username : 'senin_poodlein';
      const myDisplayName = currentUser && currentUser.displayName ? currentUser.displayName : 'Mochi';
      const myAvatar = currentUser && currentUser.avatar ? currentUser.avatar : '/images/poodle_mochi.jpg';

      chatSocket.send(JSON.stringify({
        type: 'register',
        username: myUsername,
        name: myDisplayName,
        avatar: myAvatar
      }));

      const headerUser = document.getElementById('dm-username-header');
      if (headerUser) {
        headerUser.innerHTML = `${myUsername} <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>`;
      }
    }

    function handleChatWebSocketMessage(data) {
      if (!data || !data.type) return;

      if (data.type === 'registered') {
        onlineChatUsers = new Set((data.online_users || []).map(u => String(u).toLowerCase()));
        updateActiveDmPresence();
      }
      else if (data.type === 'user_status') {
        const u = (data.username || '').toLowerCase();
        if (data.status === 'online') {
          onlineChatUsers.add(u);
        } else {
          onlineChatUsers.delete(u);
        }
        updateActiveDmPresence();
      }
      else if (data.type === 'typing') {
        handleIncomingTyping(data);
      }
      else if (data.type === 'message') {
        handleIncomingDmMessage(data);
      }
      else if (data.type === 'history') {
        handleIncomingHistory(data);
      }
      else if (data.type === 'messages_read') {
        handleIncomingMessagesRead(data);
      }
      else if (data.type === 'view_once_status') {
        handleIncomingViewOnceStatus(data);
      }
      else if (data.type === 'message_ack') {
        handleIncomingMessageAck(data);
      }
    }

    function updateActiveDmPresence() {
      const currentChat = dmData[activeDmIndex];
      if (!currentChat) return;
      const targetUser = (currentChat.user || '').toLowerCase();
      const isOnline = onlineChatUsers.has(targetUser);
      const statusEl = document.getElementById('dm-header-status');
      if (statusEl) {
        if (isOnline) {
          statusEl.innerHTML = `<span class="inline-block size-2 rounded-full bg-emerald-500 animate-pulse"></span><span>Şu anda aktif</span>`;
        } else {
          statusEl.innerHTML = `<span class="inline-block size-2 rounded-full bg-gray-400"></span><span>Çevrimdışı</span>`;
        }
      }
    }

    function handleIncomingTyping(data) {
      const currentChat = dmData[activeDmIndex];
      const fromUser = (data.from || '').toLowerCase();
      const activeUser = currentChat ? (currentChat.user || '').toLowerCase() : '';

      if (currentActiveTab === 'messages' && fromUser === activeUser) {
        if (data.isTyping) {
          showDmTypingIndicator(data.fromName || data.from);
        } else {
          hideDmTypingIndicator();
        }
      }
    }

    function showDmTypingIndicator(senderName) {
      const indicator = document.getElementById('dm-typing-indicator');
      const textEl = document.getElementById('dm-typing-text');
      if (indicator && textEl) {
        textEl.innerText = `${senderName} yazıyor`;
        indicator.classList.remove('hidden');
        clearTimeout(incomingTypingTimer);
        incomingTypingTimer = setTimeout(() => {
          hideDmTypingIndicator();
        }, 4000);
      }
    }

    function hideDmTypingIndicator() {
      const indicator = document.getElementById('dm-typing-indicator');
      if (indicator) {
        indicator.classList.add('hidden');
      }
      clearTimeout(incomingTypingTimer);
    }

    function handleIncomingDmMessage(data) {
      const fromUser = (data.from || '').toLowerCase();
      const toUser = (data.to || '').toLowerCase();
      const myUsername = (currentUser.username || 'senin_poodlein').toLowerCase();

      if (toUser !== myUsername) return;

      let convIdx = dmData.findIndex(d => (d.user || '').toLowerCase() === fromUser);
      if (convIdx === -1) {
        const profile = (typeof POODLE_PROFILES !== 'undefined' && POODLE_PROFILES[fromUser]) || {};
        dmData.unshift({
          id: Date.now(),
          name: data.fromName || fromUser,
          user: fromUser,
          avatar: data.fromAvatar || profile.avatar || '/images/poodle_mochi.jpg',
          msg: data.text,
          time: data.time || 'şimdi',
          messages: []
        });
        convIdx = 0;
      }

      const conv = dmData[convIdx];
      if (!conv.messages) conv.messages = [];

      const msgId = data.id || ('msg_' + Date.now());
      const msgType = data.msgType || 'text';
      const newMsg = {
        id: msgId,
        sender: fromUser,
        text: data.text || '',
        time: data.time || 'şimdi',
        msgType: msgType,
        mediaUrl: data.mediaUrl,
        duration: data.duration,
        isViewOnce: !!data.isViewOnce,
        isViewed: !!data.isViewed,
        status: data.status || 'delivered'
      };

      conv.messages.push(newMsg);

      let previewText = data.text;
      if (msgType === 'audio') {
        const sec = Math.round(data.duration || 5);
        previewText = `🎙️ Sesli mesaj (${Math.floor(sec/60)}:${String(sec%60).padStart(2, '0')})`;
      } else if (msgType === 'view_once') {
        previewText = '🔒 1 Kez Görüntülenecek Fotoğraf';
      }
      conv.msg = previewText;
      conv.time = data.time || 'şimdi';

      const isViewingChat = (currentActiveTab === 'messages' && activeDmIndex === convIdx);

      if (isViewingChat) {
        hideDmTypingIndicator();
        const container = document.getElementById('dm-messages');
        if (container) {
          const temp = document.createElement('div');
          temp.innerHTML = renderDmSingleMessage(newMsg, myUsername);
          if (temp.firstElementChild) {
            container.appendChild(temp.firstElementChild);
            const curDmLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'tr';
            if (curDmLang !== 'tr') {
              setTimeout(() => {
                if (typeof autoTranslateDmChat === 'function') autoTranslateDmChat(curDmLang);
              }, 60);
            }
          }
          container.scrollTop = container.scrollHeight;
        }
        playDmTone('receive');

        // Automatically mark as read since user is in the chat
        if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
          chatSocket.send(JSON.stringify({
            type: 'mark_read',
            from: myUsername,
            withUser: fromUser
          }));
        }
      } else {
        showRealtimeDmBanner(data.fromAvatar || conv.avatar, data.fromName || fromUser, fromUser, previewText);
        playDmTone('receive');

        if (typeof sendNativeNotification === 'function') {
          sendNativeNotification(`💬 ${data.fromName || fromUser}`, previewText, data.fromAvatar || conv.avatar);
        }
      }

      renderDmListOnly();
    }

    function handleIncomingHistory(data) {
      const withUser = (data.withUser || '').toLowerCase();
      const currentChat = dmData[activeDmIndex];
      if (!currentChat || (currentChat.user || '').toLowerCase() !== withUser) return;

      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const myUsername = (currentUser.username || 'senin_poodlein').toLowerCase();
        currentChat.messages = data.messages.map(m => ({
          id: m.id || ('msg_' + Math.random().toString(36).substr(2, 9)),
          sender: (m.from.toLowerCase() === myUsername) ? 'me' : m.from,
          text: m.text,
          time: m.time || 'şimdi',
          msgType: m.msgType || 'text',
          mediaUrl: m.mediaUrl,
          duration: m.duration,
          isViewOnce: !!m.isViewOnce,
          isViewed: !!m.isViewed,
          status: m.status || 'sent',
          readAt: m.readAt
        }));

        const container = document.getElementById('dm-messages');
        if (container) {
          container.innerHTML = currentChat.messages.map(m => renderDmSingleMessage(m, myUsername)).join('');
          container.scrollTop = container.scrollHeight;

        // Option A: Auto-translate DM messages for foreign visitors
        const curDmLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'tr';
        if (curDmLang !== 'tr') {
          setTimeout(() => {
            if (typeof autoTranslateDmChat === 'function') autoTranslateDmChat(curDmLang);
          }, 60);
        }
        }

        // Send mark_read
        if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
          chatSocket.send(JSON.stringify({
            type: 'mark_read',
            from: myUsername,
            withUser: withUser
          }));
        }
      }
    }

    function handleIncomingMessagesRead(data) {
      const fromUser = (data.from || '').toLowerCase();
      const currentChat = dmData[activeDmIndex];
      if (currentChat && (currentChat.user || '').toLowerCase() === fromUser) {
        if (Array.isArray(currentChat.messages)) {
          currentChat.messages.forEach(m => {
            if (m.sender === 'me') m.status = 'read';
          });
        }
        document.querySelectorAll('#dm-messages .dm-tick').forEach(el => {
          el.className = 'dm-tick text-sky-300 font-bold ml-1 text-[11px] animate-pulse';
          el.innerText = '✓✓';
          el.title = 'Okundu';
        });
      }
    }

    function handleIncomingViewOnceStatus(data) {
      const msgId = data.msgId;
      const currentChat = dmData[activeDmIndex];
      if (currentChat && Array.isArray(currentChat.messages)) {
        const m = currentChat.messages.find(x => x.id === msgId);
        if (m) {
          m.isViewed = true;
          m.status = 'read';
          const myUsername = (currentUser.username || 'senin_poodlein').toLowerCase();
          const el = document.getElementById(msgId);
          if (el) {
            const temp = document.createElement('div');
            temp.innerHTML = renderDmSingleMessage(m, myUsername);
            if (temp.firstElementChild) el.replaceWith(temp.firstElementChild);
          }
        }
      }
    }

    function handleIncomingMessageAck(data) {
      const msgId = data.id;
      const st = data.status; // 'delivered' or 'sent'
      const currentChat = dmData[activeDmIndex];
      if (currentChat && Array.isArray(currentChat.messages)) {
        const m = currentChat.messages.find(x => x.id === msgId);
        if (m && m.status !== 'read') {
          m.status = st;
          const el = document.getElementById(msgId);
          const tick = el ? el.querySelector('.dm-tick') : null;
          if (tick) {
            if (st === 'delivered') {
              tick.innerText = '✓✓';
              tick.className = 'dm-tick text-white/75 ml-1 text-[11px]';
              tick.title = 'İletildi';
            }
          }
        }
      }
    }

    function showRealtimeDmBanner(avatar, displayName, username, text) {
      lastIncomingSender = username;
      const banner = document.getElementById('realtime-dm-banner');
      const bAvatar = document.getElementById('realtime-banner-avatar');
      const bName = document.getElementById('realtime-banner-name');
      const bText = document.getElementById('realtime-banner-text');

      if (banner) {
        if (bAvatar && avatar) bAvatar.src = avatar;
        if (bName) bName.innerText = `@${displayName || username}`;
        if (bText) bText.innerText = text;

        banner.classList.remove('-translate-y-28', 'opacity-0', 'pointer-events-none');
        banner.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

        clearTimeout(realtimeBannerTimeout);
        realtimeBannerTimeout = setTimeout(() => {
          hideRealtimeDmBanner();
        }, 5500);
      }
    }

    function hideRealtimeDmBanner() {
      const banner = document.getElementById('realtime-dm-banner');
      if (banner) {
        banner.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
        banner.classList.add('-translate-y-28', 'opacity-0', 'pointer-events-none');
      }
      clearTimeout(realtimeBannerTimeout);
    }

    function handleRealtimeBannerClick() {
      hideRealtimeDmBanner();
      if (!lastIncomingSender) {
        switchTab('messages');
        return;
      }
      let targetIdx = dmData.findIndex(d => (d.user || '').toLowerCase() === lastIncomingSender.toLowerCase());
      if (targetIdx === -1) {
        targetIdx = 0;
      }
      switchTab('messages');
      selectDm(targetIdx);
    }

    function handleDmTypingInput(inputEl) {
      const currentChat = dmData[activeDmIndex];
      if (!currentChat || !currentChat.user) return;
      const targetUser = currentChat.user;

      if (inputEl.value.trim().length > 0) {
        if (!isCurrentlyTyping) {
          isCurrentlyTyping = true;
          sendTypingState(true, targetUser);
        }
        clearTimeout(dmTypingTimer);
        dmTypingTimer = setTimeout(() => {
          isCurrentlyTyping = false;
          sendTypingState(false, targetUser);
        }, 2200);
      } else {
        if (isCurrentlyTyping) {
          isCurrentlyTyping = false;
          clearTimeout(dmTypingTimer);
          sendTypingState(false, targetUser);
        }
      }
    }

    function sendTypingState(isTyping, targetUser) {
      if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) return;
      const target = targetUser || (dmData[activeDmIndex] ? dmData[activeDmIndex].user : null);
      if (!target) return;
      chatSocket.send(JSON.stringify({
        type: 'typing',
        from: currentUser.username || 'senin_poodlein',
        fromName: currentUser.displayName || 'Mochi',
        to: target,
        isTyping: isTyping
      }));
    }

    function openMobileDmChat() {
      const convPanel = document.getElementById('dm-conversations-panel');
      const chatPanel = document.getElementById('dm-chat-panel');
      if (window.innerWidth < 768) {
        if (convPanel) convPanel.classList.add('hidden');
        if (chatPanel) {
          chatPanel.classList.remove('hidden');
          chatPanel.classList.add('flex');
        }
      }
    }

    function closeMobileDmChat() {
      const convPanel = document.getElementById('dm-conversations-panel');
      const chatPanel = document.getElementById('dm-chat-panel');
      if (convPanel) convPanel.classList.remove('hidden');
      if (chatPanel) {
        chatPanel.classList.add('hidden');
        chatPanel.classList.remove('flex');
      }
    }

    function playDmTone(type = 'receive') {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;
        if (type === 'send') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(740, now + 0.1);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.11);
        } else {
          [880, 1320].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.14, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.23);
          });
        }
      } catch(e) {
        // Safe fallback if audio context is blocked
      }
    }

    function selectDm(idx) {
      activeDmIndex = idx;
      const d = dmData[idx];
      if (!d) return;

      const headerAvatar = document.getElementById('dm-header-avatar');
      const headerName = document.getElementById('dm-header-name');
      if (headerAvatar) headerAvatar.src = d.avatar;
      if (headerName) headerName.innerText = d.name || d.user;

      updateActiveDmPresence();
      hideDmTypingIndicator();
      openMobileDmChat();

      const container = document.getElementById('dm-messages');
      if (container) {
        const msgs = d.messages || [
          { sender: d.name || d.user, text: d.msg || 'Merhaba! 🐾', time: 'şimdi' }
        ];
        const myUsername = (currentUser.username || 'senin_poodlein').toLowerCase();
        container.innerHTML = msgs.map(m => renderDmSingleMessage(m, myUsername)).join('');
        container.scrollTop = container.scrollHeight;
      }

      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
          type: 'get_history',
          from: currentUser.username || 'senin_poodlein',
          withUser: d.user
        }));
        chatSocket.send(JSON.stringify({
          type: 'mark_read',
          from: (currentUser.username || 'senin_poodlein').toLowerCase(),
          withUser: (d.user || '').toLowerCase()
        }));
      }

      renderDmListOnly();
    }

    function renderDm() {
      selectDm(activeDmIndex);
    }

    function renderDmListOnly() {
      const container = document.getElementById('dm-list');
      if (!container) return;
      container.innerHTML = dmData.map((d, i) => `
        <div onclick="selectDm(${i})" class="p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] cursor-pointer transition ${i === activeDmIndex ? 'bg-gray-100 dark:bg-[#1a1a1a] font-semibold' : ''}">
          <div class="size-12 rounded-full overflow-hidden shrink-0 border border-[#dbdbdb] dark:border-[#333] relative">
            <img src="${d.avatar}" class="size-full object-cover">
            ${onlineChatUsers.has((d.user || '').toLowerCase()) ? '<span class="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-[#121212] rounded-full"></span>' : ''}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h5 class="text-xs truncate font-bold">${d.name || d.user}</h5>
              <span class="text-[10px] text-[#737373]">${d.time}</span>
            </div>
            <p class="text-xs text-[#737373] truncate">${d.msg || d.lastMsg || ''}</p>
          </div>
        </div>
      `).join('');
    }

    function storyReply(inputEl) {
      const txt = inputEl.value.trim();
      if (!txt) return;
      const currentAuthor = storiesData[currentStoryIdx] ? storiesData[currentStoryIdx].username : 'mochi.poodle';
      addPawPoints(5, `@${currentAuthor} hikayesine yanıt verildi`);
      showToast(`@${currentAuthor} hikayesine yanıt gönderildi! 💬 (+5 Pati 🐾)`);
      inputEl.value = '';
    }

    // ================= TAB SWITCHING =================
    function switchTab(tabId) {
      if (tabId === 'messages' && (!currentUser || !currentUser.isLoggedIn)) {
        showToast('Mesajlarınızı görüntülemek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      currentActiveTab = tabId;
      const tabs = ['home', 'explore', 'reels', 'messages', 'profile', 'community'];
      tabs.forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.add('hidden');
      });

      const activeEl = document.getElementById('tab-' + tabId);
      if (activeEl) {
        activeEl.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('font-bold'));
      const activeBtn = document.getElementById('nav-btn-' + tabId);
      if (activeBtn) activeBtn.classList.add('font-bold');

      if (tabId === 'reels') {
        renderReels();
        fetchReelsFromLiveApi().then(() => renderReels());
      }
      if (tabId === 'explore') renderExplore();
      if (tabId === 'profile') {
        renderProfile(activeProfileUsername);
        renderProfilePoodles(activeProfileUsername);
      }
      if (tabId === 'messages') renderDm();
      if (tabId === 'community') {
        loadCommunityTopics();
      }
    }

    // ================= LIKES, COMMENTS, SAVES & SHARING =================
    let savedPostIds = JSON.parse(localStorage.getItem('yp_saved_post_ids') || '[]');
    let activeSharePostId = null;

    function handleDoubleTap(postId, container) {
      triggerHaptic(30);
      playPawPopSound();

      const burstIcon = container.querySelector('.paw-burst-icon');
      const burstPoints = container.querySelector('.paw-burst-points');
      if (burstIcon) {
        burstIcon.classList.remove('animate-paw-burst');
        void burstIcon.offsetWidth;
        burstIcon.classList.add('animate-paw-burst');
      }
      if (burstPoints) {
        burstPoints.classList.remove('animate-float-paw');
        void burstPoints.offsetWidth;
        burstPoints.classList.add('animate-float-paw');
      }

      const post = postsData.find(p => String(p.id) === String(postId));
      if (post && !post.isLiked) {
        post.isLiked = true;
        post.likes = (post.likes || 0) + 1;

        // In-place update of rail button to avoid restarting media playback
        const railPaw = container.querySelector('.rail-paw-btn') || (container.parentElement ? container.parentElement.querySelector('.rail-paw-btn') : null);
        if (railPaw) {
          railPaw.innerHTML = `
            <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border border-amber-400/60 shadow-amber-500/30 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
              <svg class="size-6 text-amber-400 filter drop-shadow animate-scale-up" viewBox="0 0 24 24" fill="currentColor">
                <ellipse cx="12" cy="15" rx="4" ry="3.2"/>
                <circle cx="7" cy="10.5" r="1.6"/>
                <circle cx="10.2" cy="8" r="1.6"/>
                <circle cx="13.8" cy="8" r="1.6"/>
                <circle cx="17" cy="10.5" r="1.6"/>
              </svg>
            </div>
            <span class="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight">${formatCount(post.likes)}</span>
          `;
        }

        addPawPoints(5, 'Fotoğraf beğendin 🐾');
        showToast('Pati gönderildi! 🐾 (+5 Pati)');

        // Sync to backend API
        fetch('/api/live/posts/' + encodeURIComponent(postId) + '/like', { method: 'POST' }).catch(() => null);
      }
    }

    function toggleLike(postId) {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Beğenmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      triggerHaptic(20);
      playPawPopSound();
      const post = postsData.find(p => String(p.id) === String(postId));
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes = (post.likes || 0) + (post.isLiked ? 1 : -1);

        // Update in-place to avoid interrupting video
        const card = document.querySelector(`[data-post-id="${postId}"]`);
        if (card) {
          const railPaw = card.querySelector('.rail-paw-btn');
          if (railPaw) {
            if (post.isLiked) {
              railPaw.innerHTML = `
                <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border border-amber-400/60 shadow-amber-500/30 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                  <svg class="size-6 text-amber-400 filter drop-shadow animate-scale-up" viewBox="0 0 24 24" fill="currentColor">
                    <ellipse cx="12" cy="15" rx="4" ry="3.2"/>
                    <circle cx="7" cy="10.5" r="1.6"/>
                    <circle cx="10.2" cy="8" r="1.6"/>
                    <circle cx="13.8" cy="8" r="1.6"/>
                    <circle cx="17" cy="10.5" r="1.6"/>
                  </svg>
                </div>
                <span class="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight">${formatCount(post.likes)}</span>
              `;
            } else {
              railPaw.innerHTML = `
                <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                  <svg class="size-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="15" rx="4" ry="3.2"/>
                    <circle cx="7" cy="10.5" r="1.5" fill="currentColor"/>
                    <circle cx="10.2" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="13.8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="17" cy="10.5" r="1.5" fill="currentColor"/>
                  </svg>
                </div>
                <span class="text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-tight">${formatCount(post.likes)}</span>
              `;
            }
          }
        } else {
          renderPosts();
        }

        if (post.isLiked) {
          addPawPoints(5, 'Fotoğraf beğendin 🐾');
          showToast('Pati gönderildi! 🐾 (+5 Pati)');
        } else {
          showToast('Pati geri alındı.');
        }
        // Sync to backend API
        fetch('/api/live/posts/' + encodeURIComponent(postId) + '/like', { method: 'POST' }).catch(() => null);
      }
    }

    function toggleSave(postId) {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Kaydetmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      triggerHaptic(20);
      const post = postsData.find(p => String(p.id) === String(postId));
      if (post) {
        post.isSaved = !post.isSaved;
        const sId = String(postId);
        if (post.isSaved) {
          if (!savedPostIds.includes(sId)) savedPostIds.push(sId);
          addPawPoints(5, 'Gönderi kaydettin 🔖');
          showToast('Gönderi kaydedilenlere eklendi! 🔖 (+5 Pati 🐾)');
        } else {
          savedPostIds = savedPostIds.filter(id => id !== sId);
          showToast('Gönderi kaydedilenlerden çıkarıldı.');
        }
        localStorage.setItem('yp_saved_post_ids', JSON.stringify(savedPostIds));

        // Update in-place
        const card = document.querySelector(`[data-post-id="${postId}"]`);
        if (card) {
          const railBtns = card.querySelectorAll('.rail-btn');
          const railSave = railBtns[3];
          if (railSave) {
            railSave.innerHTML = `
              <div class="size-11 rounded-full bg-black/45 backdrop-blur-md border ${post.isSaved ? 'border-amber-400/60' : 'border-white/20'} text-white flex items-center justify-center shadow-lg group-hover/btn:scale-110 group-hover/btn:bg-black/60 transition">
                ${post.isSaved ? `
                  <svg class="size-5 text-amber-400 fill-current animate-scale-up" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                ` : `
                  <svg class="size-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                `}
              </div>
              <span class="text-[10px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">${post.isSaved ? 'Kayıtlı' : 'Kaydet'}</span>
            `;
          }
        }
        if (typeof renderProfileSavedGrid === 'function' && typeof activeProfileSubTab !== 'undefined' && activeProfileSubTab === 'saved') {
          renderProfileSavedGrid();
        }
      }
    }

    async function toggleFollow(idx) {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Takip etmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      const btn = document.getElementById('follow-btn-' + idx);
      if (!btn) return;
      const targetUser = (suggestedData[idx] && suggestedData[idx].username) || 'luna_apricot';
      
      try {
        const res = await fetch('/api/live/user/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            follower: currentUser.username,
            following: targetUser
          })
        });
        const data = await res.json();
        if (data.ok) {
          if (data.isFollowing) {
            btn.innerText = 'Takip Ediliyor';
            btn.className = 'font-bold text-gray-500';
            addPawPoints(15, 'Yeni bir Poodle takip ettin 🐾');
            showToast(`@${targetUser} takip edildi! (+15 Pati 🐾)`);
          } else {
            btn.innerText = 'Takip Et';
            btn.className = 'font-bold text-[#0095f6] hover:text-[#1877f2]';
            showToast(`@${targetUser} takipten çıkarıldı.`);
          }
          return;
        }
      } catch(e) {
        console.warn('Follow API error:', e);
      }

      if (btn.innerText === 'Takip Et') {
        btn.innerText = 'Takip Ediliyor';
        btn.className = 'font-bold text-gray-500';
        addPawPoints(15, 'Yeni bir Poodle takip ettin 🐾');
        showToast('Takip edildi! (+15 Pati 🐾)');
      } else {
        btn.innerText = 'Takip Et';
        btn.className = 'font-bold text-[#0095f6] hover:text-[#1877f2]';
      }
    }

    function togglePostBtn(postId, input) {
      const btn = document.getElementById('comment-btn-' + postId);
      if (!btn) return;
      if (input.value.trim().length > 0) {
        btn.disabled = false;
        btn.classList.remove('opacity-40', 'cursor-not-allowed');
      } else {
        btn.disabled = true;
        btn.classList.add('opacity-40', 'cursor-not-allowed');
      }
    }

    let activeCommentReply = null;

    function replyToPostComment(postId, commentAuthor, commentId) {
      const input = document.getElementById('comment-input-' + postId);
      if (!input) return;
      activeCommentReply = { postId: postId, replyToUser: commentAuthor, parentId: commentId };
      input.value = '@' + commentAuthor + ' ';
      input.focus();
      togglePostBtn(postId, input);
      showToast(`@${commentAuthor} kullanıcısına yanıt veriyorsun 💬`);
    }

    function addComment(postId) {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Yorum yapmak için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      const input = document.getElementById('comment-input-' + postId);
      if (!input) return;
      let text = input.value.trim();
      if (!text) return;

      if (window.ypModeration) {
        const mod = window.ypModeration.validate(text, 'Yorumunuz');
        if (!mod.ok) {
          showToast(mod.message);
          return;
        }
      }

      let parentId = null;
      let replyToUser = null;
      if (activeCommentReply && activeCommentReply.postId === postId) {
        parentId = activeCommentReply.parentId;
        replyToUser = activeCommentReply.replyToUser;
        // Clean text if it still starts with @username
        if (text.startsWith('@' + replyToUser + ' ')) {
          text = text.substring(replyToUser.length + 2).trim();
        }
      }

      const post = postsData.find(p => String(p.id) === String(postId));
      if (post) {
        const myUser = (currentUser && currentUser.username) ? currentUser.username : 'senin_poodlein';
        if (!post.comments) post.comments = [];
        post.comments.push({
          user: myUser,
          text: text,
          parentId: parentId,
          replyToUser: replyToUser
        });
        input.value = '';
        activeCommentReply = null;
        togglePostBtn(postId, input);
        renderPosts();
        addPawPoints(10, 'Yorum yazdın 💬');
        showToast('Yorumun paylaşıldı! 💬 (+10 Pati 🐾)');

        // Sync to backend API
        fetch('/api/live/posts/' + encodeURIComponent(postId) + '/comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            username: myUser,
            parent_id: parentId,
            reply_to_username: replyToUser
          })
        }).catch(() => null);
      }
    }

    function focusCommentInput(postId) {
      const inp = document.getElementById('comment-input-' + postId);
      if (inp) {
        inp.focus();
        inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // ================= SHARE POST MODAL LOGIC =================
    function openSharePostModal(postId) {
      activeSharePostId = postId;
      const post = postsData.find(p => String(p.id) === String(postId));
      if (!post) return;

      const modal = document.getElementById('share-post-modal');
      const thumb = document.getElementById('share-preview-thumb');
      const author = document.getElementById('share-preview-author');
      const caption = document.getElementById('share-preview-caption');
      const contactsList = document.getElementById('share-contacts-list');

      if (thumb) thumb.src = post.image;
      if (author) author.innerText = `@${post.username}`;
      if (caption) caption.innerText = post.caption || 'YourPoodle Paylaşımı 🐾';

      if (contactsList) {
        contactsList.innerHTML = dmData.map(d => `
          <div class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#1e1e1e] rounded-xl transition">
            <div class="flex items-center gap-2.5 min-w-0">
              <img src="${d.avatar}" class="size-8 rounded-full object-cover shrink-0">
              <div class="min-w-0">
                <h5 class="font-bold text-xs truncate">${d.name || d.user}</h5>
                <span class="text-[10px] text-[#737373] truncate">@${d.user}</span>
              </div>
            </div>
            <button onclick="sendPostViaDm('${d.user}')" class="px-3 py-1 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-bold rounded-lg transition shrink-0">
              Gönder
            </button>
          </div>
        `).join('');
      }

      if (modal) modal.classList.remove('hidden');
    }

    function closeSharePostModal() {
      const modal = document.getElementById('share-post-modal');
      if (modal) modal.classList.add('hidden');
    }

    function sendPostViaDm(targetUser) {
      const post = postsData.find(p => String(p.id) === String(activeSharePostId));
      if (!post) return;

      const shareText = `🐾 @${post.username} gönderisini seninle paylaştı: "${(post.caption || '').slice(0, 45)}..."`;

      let conv = dmData.find(d => (d.user && d.user.toLowerCase() === targetUser.toLowerCase()));
      if (!conv) {
        const profile = (typeof POODLE_PROFILES !== 'undefined' && POODLE_PROFILES[targetUser]) || {};
        conv = {
          id: Date.now(),
          name: targetUser,
          user: targetUser,
          avatar: profile.avatar || '/images/poodle_mochi.jpg',
          msg: shareText,
          time: 'şimdi',
          messages: []
        };
        dmData.unshift(conv);
      }
      if (!conv.messages) conv.messages = [];
      conv.messages.push({ sender: 'me', text: shareText, time: 'şimdi' });
      conv.msg = shareText;
      conv.time = 'şimdi';

      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
          type: 'message',
          from: currentUser.username || 'senin_poodlein',
          fromName: currentUser.displayName || 'Mochi',
          fromAvatar: currentUser.avatar || '/images/poodle_mochi.jpg',
          to: targetUser,
          text: shareText
        }));
      }

      playDmTone('send');
      addPawPoints(5, `@${targetUser} ile gönderi paylaşıldı 🚀`);
      showToast(`Gönderi @${targetUser} kullanıcısına iletildi! 🚀 (+5 Pati 🐾)`);
      closeSharePostModal();
      if (typeof renderDmListOnly === 'function') renderDmListOnly();
    }

    function copySharePostLink() {
      const url = `${window.location.origin}/#post-${activeSharePostId}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('Gönderi bağlantısı panoya kopyalandı! 📋');
        }).catch(() => {
          showToast('Bağlantı kopyalandı! 📋');
        });
      } else {
        showToast('Bağlantı kopyalandı! 📋');
      }
      closeSharePostModal();
    }

    function triggerNativeShare() {
      const post = postsData.find(p => String(p.id) === String(activeSharePostId));
      const shareData = {
        title: 'YourPoodle Paylaşımı 🐩',
        text: post ? `@${post.username}: ${post.caption}` : 'YourPoodle Poodle Topluluğu!',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).then(() => {
          addPawPoints(5, 'Gönderi paylaşıldı 📲');
          showToast('Paylaşıldı! (+5 Pati 🐾)');
        }).catch(() => {});
      } else {
        copySharePostLink();
      }
      closeSharePostModal();
    }

    async function uploadDmMediaFile(fileOrBlob, filename = 'attachment.webp', category = 'image') {
      const formData = new FormData();
      formData.append('file', fileOrBlob, filename);
      formData.append('title', 'dm_attachment');
      const res = await fetch('/api/live/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        throw new Error('Upload failed: ' + res.status);
      }
      const data = await res.json();
      return data.url;
    }

    function handleDmMediaSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
          const maxDim = 1440;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob((blob) => {
            pendingDmPhotoFile = blob || file;
            const thumb = document.getElementById('dm-media-thumb');
            if (thumb) thumb.src = URL.createObjectURL(pendingDmPhotoFile);
            const tray = document.getElementById('dm-media-tray');
            if (tray) tray.classList.remove('hidden');
            isDmViewOnceActive = true;
            updateDmViewOnceUI();
          }, 'image/webp', 0.85);
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }

    function updateDmViewOnceUI() {
      const btn = document.getElementById('dm-toggle-viewonce-btn');
      const label = document.getElementById('dm-viewonce-label');
      if (!btn || !label) return;
      if (isDmViewOnceActive) {
        btn.className = 'px-2.5 py-1 rounded-full text-xs font-bold border transition flex items-center gap-1.5 border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-xs cursor-pointer active:scale-95';
        label.innerText = '1 Kez Görüntüle: Açık';
      } else {
        btn.className = 'px-2.5 py-1 rounded-full text-xs font-bold border transition flex items-center gap-1.5 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-xs cursor-pointer active:scale-95';
        label.innerText = 'Standart Fotoğraf';
      }
    }

    function toggleDmViewOnceMode() {
      isDmViewOnceActive = !isDmViewOnceActive;
      updateDmViewOnceUI();
    }

    function cancelDmMediaSelection() {
      pendingDmPhotoFile = null;
      const tray = document.getElementById('dm-media-tray');
      if (tray) tray.classList.add('hidden');
    }

    async function sendDmMessage(e) {
      if (e && e.preventDefault) e.preventDefault();
      const inp = document.getElementById('dm-input');
      const txt = (inp ? inp.value.trim() : '');

      const currentChat = dmData[activeDmIndex] || dmData[0];
      const targetUser = currentChat ? (currentChat.user || 'luna_parisienne') : 'luna_parisienne';
      const myUsername = (currentUser.username || 'senin_poodlein').toLowerCase();

      // If pending photo is selected
      if (pendingDmPhotoFile) {
        showToast('Fotoğraf hazırlanıyor ve şifreleniyor... 🔒');
        const photoToUpload = pendingDmPhotoFile;
        const isOnce = isDmViewOnceActive;
        cancelDmMediaSelection();

        try {
          const uploadedUrl = await uploadDmMediaFile(photoToUpload, isOnce ? 'view_once.webp' : 'dm_photo.webp', 'image');
          const newMsgId = 'dm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
          const msgObj = {
            id: newMsgId,
            sender: myUsername,
            text: isOnce ? '📷 Tek Seferlik Fotoğraf' : (txt || '📷 Fotoğraf'),
            time: 'şimdi',
            msgType: isOnce ? 'view_once' : 'image',
            mediaUrl: uploadedUrl,
            isViewOnce: isOnce,
            isViewed: false,
            status: 'sent'
          };

          if (currentChat) {
            if (!currentChat.messages) currentChat.messages = [];
            currentChat.messages.push(msgObj);
            currentChat.msg = isOnce ? '🔒 Tek Seferlik Fotoğraf' : '📷 Fotoğraf';
            currentChat.time = 'şimdi';
          }

          const container = document.getElementById('dm-messages');
          if (container) {
            const temp = document.createElement('div');
            temp.innerHTML = renderDmSingleMessage(msgObj, myUsername);
            if (temp.firstElementChild) container.appendChild(temp.firstElementChild);
            container.scrollTop = container.scrollHeight;
          }

          if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
            chatSocket.send(JSON.stringify({
              type: 'message',
              id: newMsgId,
              from: myUsername,
              fromName: currentUser.displayName || 'Mochi',
              fromAvatar: currentUser.avatar || '/images/poodle_mochi.jpg',
              to: targetUser,
              text: isOnce ? '📷 Tek Seferlik Fotoğraf' : (txt || '📷 Fotoğraf'),
              msg_type: isOnce ? 'view_once' : 'image',
              media_url: uploadedUrl,
              media_meta: JSON.stringify({ isViewOnce: isOnce })
            }));
          }

          playDmTone('send');
          if (typeof renderDmListOnly === 'function') renderDmListOnly();
          addPawPoints(3, 'DM Medya Paylaştın 📸');
          showToast(isOnce ? 'Tek seferlik fotoğraf iletildi 🔒' : 'Fotoğraf iletildi 📸');
          if (inp) inp.value = '';
          return;
        } catch (err) {
          console.error('[DM] Media upload error:', err);
          showToast('Medya gönderilemedi, lütfen tekrar deneyin ⚠️');
          return;
        }
      }

      if (!txt) return;

      const newMsgId = 'dm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const msgObj = {
        id: newMsgId,
        sender: myUsername,
        text: txt,
        time: 'şimdi',
        msgType: 'text',
        status: 'sent'
      };

      if (currentChat) {
        if (!currentChat.messages) currentChat.messages = [];
        currentChat.messages.push(msgObj);
        currentChat.msg = txt;
        currentChat.time = 'şimdi';
      }

      const container = document.getElementById('dm-messages');
      if (container) {
        const temp = document.createElement('div');
        temp.innerHTML = renderDmSingleMessage(msgObj, myUsername);
        if (temp.firstElementChild) container.appendChild(temp.firstElementChild);
        container.scrollTop = container.scrollHeight;
      }

      if (inp) inp.value = '';
      sendTypingState(false, targetUser);

      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
          type: 'message',
          id: newMsgId,
          from: myUsername,
          fromName: currentUser.displayName || 'Mochi',
          fromAvatar: currentUser.avatar || '/images/poodle_mochi.jpg',
          to: targetUser,
          text: txt,
          msg_type: 'text'
        }));
      }

      playDmTone('send');
      if (typeof renderDmListOnly === 'function') renderDmListOnly();
      addPawPoints(2, 'Mesaj gönderdin 💬');
    }

    function toggleVoiceRecording() {
      if (isDmRecordingVoice) {
        stopAndSendVoiceRecording();
      } else {
        startVoiceRecording();
      }
    }

    async function startVoiceRecording() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          showToast('Tarayıcınız ses kaydını desteklemiyor ⚠️');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        dmAudioChunks = [];
        dmRecordingSeconds = 0;

        let mimeType = 'audio/webm;codecs=opus';
        if (!window.MediaRecorder || !MediaRecorder.isTypeSupported(mimeType)) {
          if (window.MediaRecorder && MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (window.MediaRecorder && MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (window.MediaRecorder && MediaRecorder.isTypeSupported('audio/ogg')) {
            mimeType = 'audio/ogg';
          } else {
            mimeType = '';
          }
        }

        dmMediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

        dmMediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            dmAudioChunks.push(e.data);
          }
        };

        dmMediaRecorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
        };

        dmMediaRecorder.start(200);
        isDmRecordingVoice = true;

        const recBar = document.getElementById('dm-voice-recording-bar');
        if (recBar) recBar.classList.remove('hidden');
        const durEl = document.getElementById('dm-voice-duration');
        if (durEl) durEl.innerText = '00:00';

        clearInterval(dmRecordingTimer);
        dmRecordingTimer = setInterval(() => {
          dmRecordingSeconds++;
          const mins = String(Math.floor(dmRecordingSeconds / 60)).padStart(2, '0');
          const secs = String(dmRecordingSeconds % 60).padStart(2, '0');
          if (durEl) durEl.innerText = `${mins}:${secs}`;
          if (dmRecordingSeconds >= 120) {
            stopAndSendVoiceRecording();
          }
        }, 1000);

      } catch (err) {
        console.error('[DM Voice] Microphone error:', err);
        showToast('Mikrofon erişimi reddedildi veya bulunamadı 🎙️❌');
      }
    }

    function cancelVoiceRecording() {
      clearInterval(dmRecordingTimer);
      isDmRecordingVoice = false;
      if (dmMediaRecorder && dmMediaRecorder.state !== 'inactive') {
        try { dmMediaRecorder.stop(); } catch(e){}
      }
      dmAudioChunks = [];
      const recBar = document.getElementById('dm-voice-recording-bar');
      if (recBar) recBar.classList.add('hidden');
      showToast('Ses kaydı iptal edildi');
    }

    async function stopAndSendVoiceRecording() {
      if (!isDmRecordingVoice) return;
      clearInterval(dmRecordingTimer);
      isDmRecordingVoice = false;

      const finalDuration = dmRecordingSeconds;
      const recBar = document.getElementById('dm-voice-recording-bar');
      if (recBar) recBar.classList.add('hidden');

      if (finalDuration < 1) {
        showToast('Ses kaydı çok kısa ⏱️');
        if (dmMediaRecorder && dmMediaRecorder.state !== 'inactive') {
          try { dmMediaRecorder.stop(); } catch(e){}
        }
        return;
      }

      showToast('Sesli mesaj iletiliyor... 🎙️');

      if (dmMediaRecorder && dmMediaRecorder.state !== 'inactive') {
        dmMediaRecorder.onstop = async () => {
          try {
            const mime = dmMediaRecorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(dmAudioChunks, { type: mime });
            const ext = mime.includes('mp4') ? 'm4a' : (mime.includes('ogg') ? 'ogg' : 'webm');
            const uploadedUrl = await uploadDmMediaFile(audioBlob, `voice_${Date.now()}.${ext}`, 'audio');
            await sendDmVoiceNote(uploadedUrl, finalDuration);
          } catch (err) {
            console.error('[DM Voice] Upload error:', err);
            showToast('Sesli mesaj yüklenemedi ⚠️');
          }
        };
        try { dmMediaRecorder.stop(); } catch(e){}
      }
    }

    async function sendDmVoiceNote(audioUrl, duration) {
      const currentChat = dmData[activeDmIndex] || dmData[0];
      const targetUser = currentChat ? (currentChat.user || 'luna_parisienne') : 'luna_parisienne';
      const myUsername = (currentUser.username || 'senin_poodlein').toLowerCase();
      const newMsgId = 'dm_voice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

      const msgObj = {
        id: newMsgId,
        sender: myUsername,
        text: '🎤 Sesli Mesaj',
        time: 'şimdi',
        msgType: 'audio',
        mediaUrl: audioUrl,
        duration: duration,
        status: 'sent'
      };

      if (currentChat) {
        if (!currentChat.messages) currentChat.messages = [];
        currentChat.messages.push(msgObj);
        currentChat.msg = '🎤 Sesli Mesaj';
        currentChat.time = 'şimdi';
      }

      const container = document.getElementById('dm-messages');
      if (container) {
        const temp = document.createElement('div');
        temp.innerHTML = renderDmSingleMessage(msgObj, myUsername);
        if (temp.firstElementChild) container.appendChild(temp.firstElementChild);
        container.scrollTop = container.scrollHeight;
      }

      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
          type: 'message',
          id: newMsgId,
          from: myUsername,
          fromName: currentUser.displayName || 'Mochi',
          fromAvatar: currentUser.avatar || '/images/poodle_mochi.jpg',
          to: targetUser,
          text: '🎤 Sesli Mesaj',
          msg_type: 'audio',
          media_url: audioUrl,
          media_meta: JSON.stringify({ duration: duration })
        }));
      }

      playDmTone('send');
      if (typeof renderDmListOnly === 'function') renderDmListOnly();
      addPawPoints(3, 'Sesli Mesaj Gönderdin 🎙️');
      showToast('Sesli mesaj gönderildi 🎙️ (+3 Pati)');
    }

    function toggleDmAudioPlay(msgId, url, btn) {
      if (dmCurrentPlayingAudio && dmCurrentPlayingMsgId === msgId) {
        if (!dmCurrentPlayingAudio.paused) {
          dmCurrentPlayingAudio.pause();
          if (btn) btn.innerHTML = '<span class="audio-play-icon">▶</span>';
          return;
        } else {
          dmCurrentPlayingAudio.play();
          if (btn) btn.innerHTML = '<span class="audio-play-icon">⏸</span>';
          return;
        }
      }

      if (dmCurrentPlayingAudio) {
        dmCurrentPlayingAudio.pause();
        dmCurrentPlayingAudio.currentTime = 0;
        const oldMsgEl = document.getElementById(dmCurrentPlayingMsgId);
        if (oldMsgEl) {
          const oldIcon = oldMsgEl.querySelector('.audio-play-icon');
          if (oldIcon) oldIcon.innerText = '▶';
          const oldBar = oldMsgEl.querySelector('.audio-progress-bar');
          if (oldBar) oldBar.style.width = '0%';
          const oldTimer = oldMsgEl.querySelector('.audio-current-time');
          if (oldTimer) oldTimer.innerText = '0:00';
        }
      }

      const audio = new Audio(url);
      dmCurrentPlayingAudio = audio;
      dmCurrentPlayingMsgId = msgId;

      if (btn) btn.innerHTML = '<span class="audio-play-icon">⏸</span>';

      const msgEl = document.getElementById(msgId);
      const progressBar = msgEl ? msgEl.querySelector('.audio-progress-bar') : null;
      const timeEl = msgEl ? msgEl.querySelector('.audio-current-time') : null;

      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          const pct = (audio.currentTime / audio.duration) * 100;
          if (progressBar) progressBar.style.width = `${pct}%`;
          const curM = Math.floor(audio.currentTime / 60);
          const curS = String(Math.floor(audio.currentTime % 60)).padStart(2, '0');
          if (timeEl) timeEl.innerText = `${curM}:${curS}`;
        }
      };

      audio.onended = () => {
        if (btn) btn.innerHTML = '<span class="audio-play-icon">▶</span>';
        if (progressBar) progressBar.style.width = '0%';
        if (timeEl) timeEl.innerText = '0:00';
        dmCurrentPlayingAudio = null;
        dmCurrentPlayingMsgId = null;
      };

      audio.onerror = () => {
        showToast('Ses çalınamadı ⚠️');
        if (btn) btn.innerHTML = '<span class="audio-play-icon">▶</span>';
        dmCurrentPlayingAudio = null;
        dmCurrentPlayingMsgId = null;
      };

      audio.play().catch(e => {
        console.warn('[DM Audio] Auto play prevented:', e);
      });
    }

    function toggleDmAudioSpeed(msgId, btn) {
      if (dmCurrentPlayingAudio && dmCurrentPlayingMsgId === msgId) {
        const rates = [1.0, 1.5, 2.0];
        let cur = dmCurrentPlayingAudio.playbackRate || 1.0;
        let nextIdx = (rates.indexOf(cur) + 1) % rates.length;
        let newRate = rates[nextIdx];
        dmCurrentPlayingAudio.playbackRate = newRate;
        if (btn) btn.innerText = `${newRate}x`;
      }
    }

    function openEphemeralViewOnce(msgId, url, author) {
      activeEphemeralMsgId = msgId;
      const modal = document.getElementById('ephemeral-modal');
      const img = document.getElementById('ephemeral-img');
      const authorEl = document.getElementById('ephemeral-author');
      const timerText = document.getElementById('ephemeral-timer-text');
      const progressBar = document.getElementById('ephemeral-progress-bar');

      if (!modal || !img) return;

      img.src = url;
      if (authorEl) authorEl.innerText = `@${author}`;
      modal.classList.remove('hidden');

      // Send WS message
      if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify({
          type: 'view_once_opened',
          message_id: msgId,
          author: author
        }));
      }

      // Mark in local state
      const currentChat = dmData[activeDmIndex];
      if (currentChat && currentChat.messages) {
        const m = currentChat.messages.find(x => String(x.id) === String(msgId));
        if (m) m.isViewed = true;
      }

      // Replace bubble with burned state
      const msgEl = document.getElementById(msgId);
      if (msgEl) {
        msgEl.outerHTML = `
          <div id="${msgId}" class="self-start max-w-[78%] bg-[#efefef] dark:bg-[#262626] text-gray-500 p-3 rounded-2xl text-sm shadow-sm flex items-center gap-2.5 select-none opacity-60">
            <span class="size-6 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
            <div>
              <p class="font-bold text-xs line-through">Fotoğraf Açıldı</p>
              <span class="text-[10px]">Tek seferlik görüntüleme sona erdi</span>
            </div>
          </div>
        `;
      }

      // 7-second countdown
      let remainingSec = 7;
      if (timerText) timerText.innerText = `${remainingSec} saniye kaldı`;
      if (progressBar) progressBar.style.width = '100%';

      clearInterval(ephemeralCountdownTimer);
      const startTime = Date.now();
      const totalDuration = 7000;

      ephemeralCountdownTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remainingMs = Math.max(0, totalDuration - elapsed);
        const sec = Math.ceil(remainingMs / 1000);

        if (timerText) timerText.innerText = `${sec} saniye kaldı`;
        if (progressBar) {
          const pct = (remainingMs / totalDuration) * 100;
          progressBar.style.width = `${pct}%`;
        }

        if (remainingMs <= 0) {
          closeEphemeralModal();
        }
      }, 100);
    }

    function closeEphemeralModal() {
      clearInterval(ephemeralCountdownTimer);
      const modal = document.getElementById('ephemeral-modal');
      const img = document.getElementById('ephemeral-img');
      if (modal) modal.classList.add('hidden');
      if (img) img.src = '';
      activeEphemeralMsgId = null;
    }

    // ================= STORY VIEWER =================
    let currentStoryIdx = 0;
    let storyTimer = null;

    function openStoryViewer(idx) {
      currentStoryIdx = idx;
      const s = storiesData[idx];
      if (!s) return;
      document.getElementById('story-avatar').src = s.avatar;
      document.getElementById('story-username').innerText = s.username;
      document.getElementById('story-image').src = s.storyImg;
      document.getElementById('story-modal').classList.remove('hidden');
      renderStorySticker(s);
      startStoryProgress();
    }

    function closeStoryViewer() {
      document.getElementById('story-modal').classList.add('hidden');
      const stEl = document.getElementById('story-sticker-container');
      if (stEl) stEl.innerHTML = '';
      clearInterval(storyTimer);
    }

    function renderStorySticker(s) {
      const container = document.getElementById('story-sticker-container');
      if (!container) return;
      const sticker = s.stickerData || s.sticker_data;
      if (!sticker || !sticker.type) {
        container.innerHTML = '';
        return;
      }

      if (sticker.type === 'poll') {
        const q = sticker.question || 'Bu model nasıl? ✂️';
        const opt1 = (sticker.options && sticker.options[0]) || 'Evet';
        const opt2 = (sticker.options && sticker.options[1]) || 'Hayır';
        const votes = sticker.votes || [10, 4];
        const total = (votes[0] || 0) + (votes[1] || 0) || 1;
        const p1 = Math.round(((votes[0] || 0) / total) * 100);
        const p2 = 100 - p1;

        container.innerHTML = `
          <div class="mx-auto max-w-[280px] p-4 rounded-3xl bg-black/75 backdrop-blur-xl border border-white/30 text-white shadow-2xl text-center space-y-3 pointer-events-auto">
            <p class="font-extrabold text-sm text-white drop-shadow">📊 ${escapeHtml(q)}</p>
            <div class="grid grid-cols-2 gap-2 text-xs font-bold">
              <button onclick="voteStoryPoll('${s.id}', 0, event)" class="relative py-2.5 px-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/40 transition overflow-hidden text-center active:scale-95 cursor-pointer">
                <span class="relative z-10 block">${escapeHtml(opt1)}</span>
                <span class="relative z-10 text-[10px] text-pink-300 font-mono block mt-0.5">${p1}%</span>
                <span class="absolute inset-y-0 left-0 bg-pink-500/50 rounded-2xl transition-all duration-500" style="width: ${p1}%"></span>
              </button>
              <button onclick="voteStoryPoll('${s.id}', 1, event)" class="relative py-2.5 px-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/40 transition overflow-hidden text-center active:scale-95 cursor-pointer">
                <span class="relative z-10 block">${escapeHtml(opt2)}</span>
                <span class="relative z-10 text-blue-300 text-[10px] font-mono block mt-0.5">${p2}%</span>
                <span class="absolute inset-y-0 left-0 bg-blue-500/50 rounded-2xl transition-all duration-500" style="width: ${p2}%"></span>
              </button>
            </div>
            <span class="text-[10px] text-white/60 block">Oylamak için tıkla 👆</span>
          </div>
        `;
      } else {
        container.innerHTML = '';
      }
    }

    async function voteStoryPoll(storyId, optionIndex, ev) {
      if (ev) ev.stopPropagation();
      triggerHaptic(20);
      try {
        const res = await fetch(`/api/live/stories/${storyId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ option_index: optionIndex })
        });
        const data = await res.json();
        if (data.ok && data.sticker) {
          const s = storiesData[currentStoryIdx];
          if (s) s.stickerData = data.sticker;
          renderStorySticker(s);
          addPawPoints(5, 'Hikaye anketine katıldın 📊');
          showToast('Oyunuz kaydedildi! (+5 Pati 🐾)');
        }
      } catch (e) {
        showToast('Oyunuz kaydedildi!');
      }
    }

    // ================= DISNEY / PIXAR 3D AVATAR STUDIO =================
    let currentSitePixarResult = null;

    function openPixarModal() {
      document.getElementById('pixar-avatar-modal').classList.remove('hidden');
    }

    function closePixarModal() {
      document.getElementById('pixar-avatar-modal').classList.add('hidden');
    }

    async function previewSitePixarFile(input) {
      if (!input.files || !input.files[0]) return;
      const file = input.files[0];
      const previewArea = document.getElementById('site-pixar-preview-area');
      const origImg = document.getElementById('site-pixar-orig');
      const resImg = document.getElementById('site-pixar-res');
      const loading = document.getElementById('site-pixar-loading');
      const actions = document.getElementById('site-pixar-actions');

      origImg.src = URL.createObjectURL(file);
      previewArea.classList.remove('hidden');
      loading.classList.remove('hidden');
      actions.classList.add('hidden');

      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/live/ai/avatar-filter', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.ok) {
          currentSitePixarResult = data;
          resImg.src = data.avatar_url;
          document.getElementById('site-pixar-dl').href = data.avatar_url;
          actions.classList.remove('hidden');
          showToast('🎨 3D Disney/Pixar avatarınız hazır! ✨');
        } else {
          showToast('Hata: ' + (data.error || 'Dönüştürme başarısız'));
        }
      } catch (err) {
        showToast('İşlem hatası: ' + err.message);
      } finally {
        loading.classList.add('hidden');
      }
    }

    async function applyPixarAsMyAvatar() {
      if (!currentSitePixarResult) return;
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Profilinizi güncellemek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      currentUser.avatar = currentSitePixarResult.avatar_url;
      localStorage.setItem('yp_user', JSON.stringify(currentUser));
      updateAuthUI();
      closePixarModal();
      showToast('✨ 3D Disney/Pixar avatarınız profil fotoğrafınız yapıldı!');
      
      fetch(`/api/live/admin/users/${currentUser.username}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: currentSitePixarResult.avatar_url })
      }).catch(() => null);
    }

    async function sharePixarToFeed() {
      if (!currentSitePixarResult) return;
      const authorUser = (currentUser && currentUser.username) ? currentUser.username : 'mochi_poodle';
      try {
        const res = await fetch('/api/live/admin/video-import/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: authorUser,
            video_url: currentSitePixarResult.avatar_url,
            thumbnail_url: currentSitePixarResult.avatar_url,
            caption: 'Yapay zeka ile 3D Disney/Pixar karakterine dönüştüm! Nasıl olmuşum? 🎨✨🐾 #YourPoodlePixar #3DAvatar #ToyPoodle',
            location: 'Disney/Pixar Animation Studios 🎬',
            is_reel: false
          })
        });
        const data = await res.json();
        if (data.ok) {
          addPawPoints(25, '3D Pixar avatarını akışta paylaştın ✨');
          showToast('🚀 3D Pixar avatarınız akışta paylaşıldı! (+25 Pati 🐾)');
          closePixarModal();
          fetchPostsFromBackend();
        }
      } catch (e) {
        showToast('Paylaşım tamamlandı!');
        closePixarModal();
      }
    }

    function startStoryProgress() {
      const bar = document.getElementById('story-progress');
      bar.style.width = '0%';
      clearInterval(storyTimer);
      let progress = 0;
      storyTimer = setInterval(() => {
        progress += 2;
        bar.style.width = progress + '%';
        if (progress >= 100) {
          clearInterval(storyTimer);
          nextStory();
        }
      }, 100);
    }

    function nextStory() {
      if (currentStoryIdx < storiesData.length - 1) {
        openStoryViewer(currentStoryIdx + 1);
      } else {
        closeStoryViewer();
      }
    }

    function prevStory() {
      if (currentStoryIdx > 0) {
        openStoryViewer(currentStoryIdx - 1);
      }
    }

    function storyReact(emoji) {
      addPawPoints(5, `${emoji} tepkisi verildi!`);
      showToast(`${emoji} tepkisi gönderildi! (+5 Pati 🐾)`);
    }

    // ================= POODLE PROFILES & USER PROFILE VIEWER =================
    const POODLE_PROFILES = {
      'mochi_toypoodle': {
        name: 'Mochi The Red Toy',
        username: 'mochi_toypoodle',
        avatar: '/images/poodle_mochi.jpg',
        variety: 'Toy Poodle',
        color: 'Red Apricot',
        gender: 'Erkek',
        age: '2 Yaşında',
        rank: 'Kıvırcık Kaşif 🎾',
        bio: 'Park delisi, ödül maması aşığı minik prens 🐾 Bebek Sahili ve Maçka Parkı müdavimi 🦴',
        location: 'Bebek, İstanbul',
        postsCount: 18,
        followersCount: '48.6B',
        followingCount: '294',
        isFollowing: false,
        verified: true,
        highlights: [
          { name: 'Kuaför ✂️', img: '/images/poodle_teddy.jpg' },
          { name: 'Park 🎾', img: '/images/poodle_mochi.jpg' },
          { name: 'Bebeklik 🍼', img: '/images/poodle_bella.jpg' },
          { name: 'Seyahat ✈️', img: '/images/poodle_milo.jpg' }
        ],
        photos: [
          '/images/poodle_mochi.jpg',
          '/images/poodle_teddy.jpg',
          '/images/poodle_luna.jpg',
          '/images/poodle_coco.jpg',
          '/images/poodle_bella.jpg',
          '/images/poodle_oliver.jpg'
        ]
      },
      'mochi_poodle': {
        name: 'Mochi The Red Toy',
        username: 'mochi_poodle',
        avatar: '/images/poodle_mochi.jpg',
        variety: 'Toy Poodle',
        color: 'Red Apricot',
        gender: 'Erkek',
        age: '2 Yaşında',
        rank: 'Kıvırcık Kaşif 🎾',
        bio: 'Park delisi, ödül maması aşığı minik prens 🐾 Bebek Sahili ve Maçka Parkı müdavimi 🦴',
        location: 'Bebek, İstanbul',
        postsCount: 6,
        followersCount: '28.4B',
        followingCount: '190',
        isFollowing: false,
        verified: true,
        highlights: [
          { name: 'Oyun 🎾', img: '/images/poodle_coco.jpg' },
          { name: 'Bebeklik 🍼', img: '/images/poodle_bella.jpg' },
          { name: 'Gezinti 🌿', img: '/images/poodle_teddy.jpg' }
        ],
        photos: [
          '/images/poodle_mochi.jpg',
          '/images/poodle_teddy.jpg',
          '/images/poodle_luna.jpg',
          '/images/poodle_coco.jpg',
          '/images/poodle_bella.jpg',
          '/images/poodle_oliver.jpg'
        ]
      },
      'luna_apricot': {
        name: 'Luna & Leo',
        username: 'luna_apricot',
        avatar: '/images/poodle_luna.jpg',
        variety: 'Toy Poodle',
        color: 'Apricot / Cream',
        gender: 'Dişi',
        age: '1.5 Yaşında',
        rank: 'Park Yıldızı ⭐',
        bio: 'Teddy Bear tıraş aşığı, fiyonklu minik prenses 🐩🎀 Nişantaşı sokaklarında modayı takip eder ✨',
        location: 'Nişantaşı, İstanbul',
        postsCount: 34,
        followersCount: '62.4B',
        followingCount: '185',
        isFollowing: true,
        verified: true,
        highlights: [
          { name: 'Tıraş 🧸', img: '/images/poodle_luna.jpg' },
          { name: 'Moda 👗', img: '/images/poodle_bella.jpg' },
          { name: 'Oyun 🎾', img: '/images/poodle_coco.jpg' }
        ],
        photos: [
          '/images/poodle_luna.jpg',
          '/images/poodle_bella.jpg',
          '/images/poodle_teddy.jpg',
          '/images/poodle_coco.jpg',
          '/images/poodle_mochi.jpg'
        ]
      },
      'teddy_bear_poodle': {
        name: 'Teddy The Poodle',
        username: 'teddy_bear_poodle',
        avatar: '/images/poodle_teddy.jpg',
        variety: 'Toy Poodle',
        color: 'Chocolate Brown',
        gender: 'Erkek',
        age: '3 Yaşında',
        rank: 'Poodle Fenomeni 👑',
        bio: 'Adım gibi oyuncak ayıya benzerim 🧸 Kadıköy Moda sahilinde frizbi yakalarım 🌊',
        location: 'Moda, Kadıköy',
        postsCount: 42,
        followersCount: '91.2B',
        followingCount: '310',
        isFollowing: false,
        verified: false,
        highlights: [
          { name: 'Frizbi 🥏', img: '/images/poodle_teddy.jpg' },
          { name: 'Sahil 🌊', img: '/images/poodle_milo.jpg' }
        ],
        photos: [
          '/images/poodle_teddy.jpg',
          '/images/poodle_milo.jpg',
          '/images/poodle_oliver.jpg',
          '/images/poodle_mochi.jpg'
        ]
      },
      'coco_poodle': {
        name: 'Coco White Princess',
        username: 'coco_poodle',
        avatar: '/images/poodle_coco.jpg',
        variety: 'Toy Poodle',
        color: 'Snow White',
        gender: 'Dişi',
        age: '1 Yaşında',
        rank: 'Yavru Pati 🥉',
        bio: 'Pamuk şekeri kıvamında bembeyaz bir Toy Poodle ☁️ Alsancak kordon yürüyüşleri favorim!',
        location: 'Alsancak, İzmir',
        postsCount: 12,
        followersCount: '15.8B',
        followingCount: '142',
        isFollowing: false,
        verified: false,
        highlights: [
          { name: 'Kordon 🌴', img: '/images/poodle_coco.jpg' },
          { name: 'İlk Günüm 🍼', img: '/images/poodle_bella.jpg' }
        ],
        photos: [
          '/images/poodle_coco.jpg',
          '/images/poodle_bella.jpg',
          '/images/poodle_luna.jpg'
        ]
      },
      'bella_the_princess': {
        name: 'Bella Silver Toy',
        username: 'bella_the_princess',
        avatar: '/images/poodle_bella.jpg',
        variety: 'Toy Poodle',
        color: 'Silver Grey',
        gender: 'Dişi',
        age: '2 Yaşında',
        rank: 'Park Yıldızı ⭐',
        bio: 'Nadir gümüş renkli Toy Poodle 🩶 Zarafet ve oyun bir arada!',
        location: 'Çankaya, Ankara',
        postsCount: 26,
        followersCount: '33.1B',
        followingCount: '210',
        isFollowing: false,
        verified: false,
        highlights: [
          { name: 'Gümüş 🩶', img: '/images/poodle_bella.jpg' }
        ],
        photos: [
          '/images/poodle_bella.jpg',
          '/images/poodle_luna.jpg',
          '/images/poodle_coco.jpg'
        ]
      },
      'oliver_curly': {
        name: 'Oliver Dark Curl',
        username: 'oliver_curly',
        avatar: '/images/poodle_oliver.jpg',
        variety: 'Toy Poodle',
        color: 'Phantom Black',
        gender: 'Erkek',
        age: '2 Yaşında',
        rank: 'Kıvırcık Kaşif 🎾',
        bio: 'Gecenin kıvırcık aslanı 🦁 Çok enerjik, akıllı ve eğitim delisi!',
        location: 'Bodrum, Muğla',
        postsCount: 19,
        followersCount: '21.5B',
        followingCount: '178',
        isFollowing: false,
        verified: false,
        highlights: [],
        photos: [
          '/images/poodle_oliver.jpg',
          '/images/poodle_milo.jpg'
        ]
      },
      'aras_vet_standard': {
        name: 'Dr. Aras & Atlas',
        username: 'aras_vet_standard',
        avatar: '/images/poodle_oliver.jpg',
        variety: 'Standard Poodle',
        color: 'Black (Siyah)',
        gender: 'Erkek',
        age: '3 Yaşında',
        rank: 'Veteriner & Sağlık Rehberi 🩺',
        bio: 'Standard Poodle veterineri & beslenme danışmanı. Atlas ile eklem sağlığı, koruyucu hekimlik ve diş bakımı ipuçları. 🩺🐩 [🤖 AI Topluluk Rehberi]',
        location: 'İstanbul, Türkiye',
        postsCount: 14,
        followersCount: '18.2B',
        followingCount: '85',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Aşılar 💉', img: '/images/poodle_oliver.jpg' }, { name: 'Egzersiz 🏃‍♂️', img: '/images/poodle_teddy.jpg' }],
        photos: ['/images/poodle_oliver.jpg', '/images/poodle_teddy.jpg', '/images/poodle_mochi.jpg']
      },
      'claire_toypoodle_paris': {
        name: 'Claire & Bijou',
        username: 'claire_toypoodle_paris',
        avatar: '/images/poodle_luna.jpg',
        variety: 'Toy Poodle',
        color: 'Red Apricot',
        gender: 'Dişi',
        age: '2 Yaşında',
        rank: 'Paris Kürk Sanatçısı ✂️',
        bio: 'Paris kuaför stilisti & Asya teddy tarzı tüy bakımı uzmanı. Düğüm açma, tarama ve parlak kürk sırları. 🇫🇷🐩 [🤖 AI Topluluk Rehberi]',
        location: 'Paris, France',
        postsCount: 22,
        followersCount: '34.5B',
        followingCount: '120',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Teddy Cut ✂️', img: '/images/poodle_luna.jpg' }],
        photos: ['/images/poodle_luna.jpg', '/images/poodle_bella.jpg', '/images/poodle_coco.jpg']
      },
      'barnaby_minipoodle_uk': {
        name: 'Barnaby & Barnaby Jr',
        username: 'barnaby_minipoodle_uk',
        avatar: '/images/poodle_teddy.jpg',
        variety: 'Miniature Poodle',
        color: 'Chocolate Brown',
        gender: 'Erkek',
        age: '2.5 Yaşında',
        rank: 'Agility & Pozitif İtaat 🏆',
        bio: 'İngiltere kırsalında çeviklik parkuru ve pozitif pekiştireç eğitimi. Zeka oyunları ve temel itaat rehberi. 🇬🇧🐾 [🤖 AI Topluluk Rehberi]',
        location: 'Cotswolds, UK',
        postsCount: 16,
        followersCount: '27.9B',
        followingCount: '95',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Agility 🏆', img: '/images/poodle_teddy.jpg' }],
        photos: ['/images/poodle_teddy.jpg', '/images/poodle_milo.jpg']
      },
      'hannah_poodle_berlin': {
        name: 'Hannah & Fritzi',
        username: 'hannah_poodle_berlin',
        avatar: '/images/poodle_coco.jpg',
        variety: 'Miniature Poodle',
        color: 'White (Beyaz)',
        gender: 'Dişi',
        age: '1.5 Yaşında',
        rank: 'Klinik Beslenme Danışmanı 🥗',
        bio: 'Klinik hayvan beslenmesi ve hassas mide diyeti danışmanı. BARF, taze mama ve alerjen yönetimi rehberi. 🇩🇪🐾 [🤖 AI Topluluk Rehberi]',
        location: 'Berlin, Germany',
        postsCount: 19,
        followersCount: '23.1B',
        followingCount: '110',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Diyet 🥗', img: '/images/poodle_coco.jpg' }],
        photos: ['/images/poodle_coco.jpg', '/images/poodle_bella.jpg']
      },
      'selin_milo_toypoodle': {
        name: 'Selin & Milo',
        username: 'selin_milo_toypoodle',
        avatar: '/images/poodle_milo.jpg',
        variety: 'Toy Poodle',
        color: 'Cream Apricot',
        gender: 'Erkek',
        age: '1 Yaşında',
        rank: 'Yavru Sosyalleşme ☀️',
        bio: 'Ege kıyılarında yavru köpek sosyalleşmesi, tuvalet eğitimi ve havlama yönetimi ipuçları. ☀️🏖️ [🤖 AI Topluluk Rehberi]',
        location: 'Urla / İzmir, Türkiye',
        postsCount: 11,
        followersCount: '15.4B',
        followingCount: '130',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Urla 🌊', img: '/images/poodle_milo.jpg' }],
        photos: ['/images/poodle_milo.jpg', '/images/poodle_mochi.jpg']
      },
      'kenji_silver_hana': {
        name: 'Kenji & Hana',
        username: 'kenji_silver_hana',
        avatar: '/images/poodle_bella.jpg',
        variety: 'Toy Poodle',
        color: 'Silver (Gümüş)',
        gender: 'Dişi',
        age: '2 Yaşında',
        rank: 'Tokyo Estetik & Seyahat 🗼',
        bio: 'Gümüş Toy Poodle estetiği, pati sağlığı ve köpek dostu seyahatler. Tokyo kafeleri ve kentsel uyum. 🇯🇵🐾 [🤖 AI Topluluk Rehberi]',
        location: 'Tokyo, Japan',
        postsCount: 25,
        followersCount: '41.0B',
        followingCount: '160',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Tokyo 🗼', img: '/images/poodle_bella.jpg' }],
        photos: ['/images/poodle_bella.jpg', '/images/poodle_luna.jpg']
      },
      'elena_standard_max': {
        name: 'Elena & Max',
        username: 'elena_standard_max',
        avatar: '/images/poodle_mochi.jpg',
        variety: 'Standard Poodle',
        color: 'White (Beyaz)',
        gender: 'Erkek',
        age: '4 Yaşında',
        rank: 'Alp Doğa Kaşifi 🏔️',
        bio: 'Alp patikalarında doğa yürüyüşleri, standart poodle dayanıklılığı ve soğuk hava pati koruması. 🏔️🐾 [🤖 AI Topluluk Rehberi]',
        location: 'München, Germany',
        postsCount: 17,
        followersCount: '19.8B',
        followingCount: '80',
        isFollowing: false,
        verified: false,
        isAi: true,
        highlights: [{ name: 'Alpler 🏔️', img: '/images/poodle_mochi.jpg' }],
        photos: ['/images/poodle_mochi.jpg', '/images/poodle_oliver.jpg']
      }
    };

    let activeProfileUsername = null;
    let currentViewedUsername = null; // for backward compatibility

    function viewUserProfile(username) {
      if (!username) return;
      username = username.replace(/^@/, '').trim();

      // Close story viewer or any modals if open
      if (typeof closeStoryViewer === 'function') closeStoryViewer();
      closeUserProfileModal();

      activeProfileUsername = username;
      currentViewedUsername = username;

      switchTab('profile');
      renderMainProfile(username);
    }

    function renderMainProfile(targetUsername) {
      const username = (targetUsername || activeProfileUsername || (currentUser ? currentUser.username : 'mochi_toypoodle')).replace(/^@/, '').trim();
      activeProfileUsername = username;
      currentViewedUsername = username;

      const isLogged = !!(currentUser && currentUser.isLoggedIn);
      const isOwnProfile = isLogged && (currentUser.username === username || !targetUsername);
      const isGuestDemo = !isLogged && (!targetUsername || targetUsername === (currentUser ? currentUser.username : 'senin_poodlein'));

      // Elements to toggle for own vs other vs guest
      const backBar = document.getElementById('profile-back-bar');
      const ownActions = document.getElementById('profile-own-actions');
      const otherActions = document.getElementById('profile-other-actions');
      const guestActions = document.getElementById('profile-guest-actions');
      const switcherIndicator = document.getElementById('profile-switcher-indicator');
      const avatarEditOverlay = document.getElementById('profile-avatar-edit-overlay');

      if (backBar) backBar.classList.toggle('hidden', isOwnProfile || isGuestDemo);
      if (ownActions) ownActions.classList.toggle('hidden', !isOwnProfile);
      if (guestActions) guestActions.classList.toggle('hidden', !isGuestDemo);
      if (otherActions) otherActions.classList.toggle('hidden', isOwnProfile || isGuestDemo);
      if (switcherIndicator) switcherIndicator.classList.toggle('hidden', !isOwnProfile);
      if (avatarEditOverlay) avatarEditOverlay.classList.toggle('hidden', !isOwnProfile);

      if (isOwnProfile) {
        // Render logged-in user profile
        const uName = currentUser.username || 'yourpoodle_official';
        const dName = currentUser.displayName || 'Mochi';
        const avatar = currentUser.avatar || '/images/poodle_mochi.jpg';
        const bio = currentUser.bio || 'Park delisi, ödül maması aşığı bir minik prens 🦴👑';
        const location = currentUser.location || (currentUser.city ? `📍 ${currentUser.city}` : '📍 İstanbul, Bebek');
        const variety = currentUser.variety || 'Toy Poodle';
        const color = currentUser.color || 'Red Apricot';
        const rank = currentUser.rank || 'Kıvırcık Kaşif 🎾';
        const postsCount = currentUser.postsCount || (postsData.filter(p => p.username === uName).length + 6);
        const followers = currentUser.followersCount || '48.6B';
        const following = currentUser.followingCount || '294';

        const elUser = document.getElementById('profile-main-username');
        if (elUser) elUser.innerText = uName;

        const elName = document.getElementById('profile-main-name');
        if (elName) elName.innerText = dName.endsWith('🐾') ? dName : dName + ' 🐾';

        const elAvatar = document.getElementById('profile-main-avatar');
        if (elAvatar) elAvatar.src = avatar;

        const elBio = document.getElementById('profile-main-bio');
        if (elBio) elBio.innerText = bio;

        const elLoc = document.getElementById('profile-main-location');
        if (elLoc) elLoc.innerText = location.startsWith('📍') ? location : '📍 ' + location;

        const elVariety = document.getElementById('profile-badge-variety');
        if (elVariety) elVariety.innerText = variety;

        const elColor = document.getElementById('profile-badge-color');
        if (elColor) elColor.innerText = color;

        const elRank = document.getElementById('profile-badge-rank');
        if (elRank) elRank.innerText = rank;

        const elPosts = document.getElementById('profile-posts-count');
        if (elPosts) elPosts.innerText = postsCount;

        const elFollowers = document.getElementById('profile-followers-count');
        if (elFollowers) elFollowers.innerText = followers;

        const elFollowing = document.getElementById('profile-following-count');
        if (elFollowing) elFollowing.innerText = following;

        const elPaw = document.getElementById('profile-paw-points');
        if (elPaw) elPaw.innerText = (currentUser && currentUser.pawPoints) ? currentUser.pawPoints : 100;

        renderVerifiedBadges();

        // Highlights
        const hlContainer = document.getElementById('profile-highlights-tray');
        if (hlContainer) {
          const ownHighlights = [
            { name: 'Kuaför ✂️', img: '/images/poodle_teddy.jpg' },
            { name: 'Park 🎾', img: '/images/poodle_coco.jpg' },
            { name: 'Bebeklik 🍼', img: '/images/poodle_bella.jpg' },
            { name: 'Seyahat ✈️', img: '/images/poodle_milo.jpg' }
          ];
          hlContainer.classList.remove('hidden');
          hlContainer.innerHTML = ownHighlights.map(h => `
            <div class="flex flex-col items-center gap-1 shrink-0 cursor-pointer group" onclick="showToast('${h.name} hikayesi açılıyor...')">
              <div class="size-16 p-0.5 rounded-full border border-[#dbdbdb] dark:border-[#333] group-hover:scale-105 transition">
                <img src="${h.img}" alt="${h.name}" class="size-full object-cover rounded-full">
              </div>
              <span class="text-xs font-medium">${h.name}</span>
            </div>
          `).join('');
        }

        // Grid
        const container = document.getElementById('profile-grid');
        if (container) {
          const ownImages = [
            avatar,
            '/images/poodle_teddy.jpg',
            '/images/poodle_luna.jpg',
            '/images/poodle_coco.jpg',
            '/images/poodle_bella.jpg',
            '/images/poodle_oliver.jpg'
          ];
          const userCreatedPosts = postsData.filter(p => p.username === uName).map(p => p.image).filter(img => img && !img.startsWith('blob:'));
          const finalImages = Array.from(new Set([...userCreatedPosts, ...ownImages]));
          container.innerHTML = finalImages.map(img => {
            const isVideo = img && (img.endsWith('.mp4') || img.endsWith('.mov') || img.endsWith('.webm'));
            return `
            <div class="relative aspect-square group cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-800" onclick="showToast('İçerik görüntülendi!')">
              ${isVideo ? `
                <video src="${img}" class="size-full object-cover pointer-events-none" muted playsinline preload="metadata"></video>
                <span class="absolute top-2 right-2 text-white bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold">🎬 Video</span>
              ` : `
                <img src="${img}" onerror="this.onerror=null; this.src='/images/poodle_mochi.jpg'" alt="Profile Post" class="size-full object-cover group-hover:scale-105 transition duration-300">
              `}
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-bold text-sm">
                <span class="flex items-center gap-1.5">❤️ ${(Math.floor(Math.random() * 500) + 200)}</span>
                <span class="flex items-center gap-1.5">💬 ${(Math.floor(Math.random() * 40) + 10)}</span>
              </div>
            </div>
            `;
          }).join('');
        }

      } else {
        // Render visited other user profile
        let profile = POODLE_PROFILES[username];
        if (!profile) {
          const post = postsData.find(p => p.username === username);
          const rawUserPhotos = postsData.filter(p => p.username === username).map(p => p.image).filter(img => img && !img.startsWith('blob:'));
          profile = {
            name: post ? post.username : username,
            username: username,
            avatar: post ? post.userAvatar : '/images/poodle_mochi.jpg',
            variety: 'Toy Poodle',
            color: 'Red Apricot',
            gender: 'Poodle',
            age: '2 Yaşında',
            rank: 'Kıvırcık Kaşif 🎾',
            bio: post ? `${post.caption.substring(0, 45)}... 🐾` : 'Toy Poodle topluluğunun neşeli bir üyesi 🐩✨',
            location: post ? post.location : 'İstanbul, Türkiye',
            postsCount: rawUserPhotos.length || 6,
            followersCount: '28.4B',
            followingCount: '190',
            isFollowing: false,
            verified: post ? post.verified : false,
            pawPoints: 175,
            highlights: [
              { name: 'Oyun 🎾', img: (post && post.image && !post.image.startsWith('blob:') && !post.image.endsWith('.mp4')) ? post.image : '/images/poodle_coco.jpg' },
              { name: 'Bebeklik 🍼', img: '/images/poodle_bella.jpg' },
              { name: 'Gezinti 🌿', img: '/images/poodle_teddy.jpg' }
            ],
            photos: rawUserPhotos.length ? rawUserPhotos : ['/images/poodle_mochi.jpg', '/images/poodle_teddy.jpg', '/images/poodle_luna.jpg', '/images/poodle_coco.jpg', '/images/poodle_bella.jpg', '/images/poodle_oliver.jpg']
          };
          POODLE_PROFILES[username] = profile;
        }

        const backTitle = document.getElementById('profile-back-title');
        if (backTitle) backTitle.innerText = '@' + profile.username;

        const elUser = document.getElementById('profile-main-username');
        if (elUser) elUser.innerText = profile.username;

        const elName = document.getElementById('profile-main-name');
        if (elName) elName.innerText = (profile.name || profile.username) + ' 🐾';

        const elAvatar = document.getElementById('profile-main-avatar');
        if (elAvatar) elAvatar.src = profile.avatar || '/images/poodle_mochi.jpg';

        const elBio = document.getElementById('profile-main-bio');
        if (elBio) elBio.innerText = profile.bio || 'Toy Poodle aşığı 🐩';

        const elLoc = document.getElementById('profile-main-location');
        if (elLoc) {
          const locStr = profile.location || 'İstanbul, Türkiye';
          elLoc.innerText = locStr.startsWith('📍') ? locStr : '📍 ' + locStr;
        }

        const elVariety = document.getElementById('profile-badge-variety');
        if (elVariety) elVariety.innerText = profile.variety || 'Toy Poodle';

        const elColor = document.getElementById('profile-badge-color');
        if (elColor) elColor.innerText = profile.color || 'Apricot';

        const elRank = document.getElementById('profile-badge-rank');
        if (elRank) elRank.innerText = profile.rank || 'Park Yıldızı ⭐';

        const elPosts = document.getElementById('profile-posts-count');
        if (elPosts) elPosts.innerText = profile.postsCount || (profile.photos ? profile.photos.length : 6);

        const elFollowers = document.getElementById('profile-followers-count');
        if (elFollowers) elFollowers.innerText = profile.followersCount || '32.1B';

        const elFollowing = document.getElementById('profile-following-count');
        if (elFollowing) elFollowing.innerText = profile.followingCount || '210';

        const elPaw = document.getElementById('profile-paw-points');
        if (elPaw) elPaw.innerText = profile.pawPoints || 180;

        updateMainProfileFollowBtn(profile.isFollowing);

        const isAiProfile = !!(profile.isAi || AI_PERSONA_USERNAMES.includes(username));
        const elAiBadge = document.getElementById('profile-ai-badge');
        if (elAiBadge) {
          elAiBadge.classList.toggle('hidden', !isAiProfile);
          elAiBadge.classList.toggle('inline-flex', isAiProfile);
        }

        const otherVerifiedBadge = document.getElementById('profile-verified-badge');
        if (otherVerifiedBadge) {
          otherVerifiedBadge.classList.toggle('hidden', isAiProfile || !profile.verified);
          otherVerifiedBadge.classList.toggle('inline-flex', !isAiProfile && !!profile.verified);
        }
        const otherVerifiedPill = document.getElementById('profile-badge-verified-pill');
        if (otherVerifiedPill) {
          otherVerifiedPill.classList.toggle('hidden', isAiProfile || !profile.verified);
          otherVerifiedPill.classList.toggle('inline-flex', !isAiProfile && !!profile.verified);
        }

        // Highlights
        const hlContainer = document.getElementById('profile-highlights-tray');
        if (hlContainer) {
          if (profile.highlights && profile.highlights.length) {
            hlContainer.classList.remove('hidden');
            hlContainer.innerHTML = profile.highlights.map(h => `
              <div class="flex flex-col items-center gap-1 shrink-0 cursor-pointer group" onclick="showToast('${h.name} hikayesi açılıyor...')">
                <div class="size-16 p-0.5 rounded-full border border-[#dbdbdb] dark:border-[#333] group-hover:scale-105 transition">
                  <img src="${h.img}" onerror="this.onerror=null; this.src='/images/poodle_mochi.jpg'" alt="${h.name}" class="size-full object-cover rounded-full">
                </div>
                <span class="text-xs font-medium">${h.name}</span>
              </div>
            `).join('');
          } else {
            hlContainer.classList.add('hidden');
          }
        }

        // Grid
        const container = document.getElementById('profile-grid');
        if (container) {
          const rawPhotos = (profile.photos && profile.photos.length) ? profile.photos : [profile.avatar, '/images/poodle_teddy.jpg', '/images/poodle_luna.jpg'];
          const photos = rawPhotos.filter(img => img && !img.startsWith('blob:'));
          const displayPhotos = photos.length ? photos : ['/images/poodle_mochi.jpg', '/images/poodle_teddy.jpg', '/images/poodle_luna.jpg', '/images/poodle_coco.jpg', '/images/poodle_bella.jpg'];
          container.innerHTML = displayPhotos.map(img => {
            const isVideo = img && (img.endsWith('.mp4') || img.endsWith('.mov') || img.endsWith('.webm'));
            return `
            <div class="relative aspect-square group cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-800" onclick="showToast('İçerik görüntülendi!')">
              ${isVideo ? `
                <video src="${img}" class="size-full object-cover pointer-events-none" muted playsinline preload="metadata"></video>
                <span class="absolute top-2 right-2 text-white bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold">🎬 Video</span>
              ` : `
                <img src="${img}" onerror="this.onerror=null; this.src='/images/poodle_mochi.jpg'" alt="Profile Post" class="size-full object-cover group-hover:scale-105 transition duration-300">
              `}
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-bold text-sm">
                <span class="flex items-center gap-1.5">❤️ ${(Math.floor(Math.random() * 300) + 80)}</span>
                <span class="flex items-center gap-1.5">💬 ${(Math.floor(Math.random() * 25) + 3)}</span>
              </div>
            </div>
            `;
          }).join('');
        }
      }
    }

    function toggleMainProfileFollow() {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Takip etmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      if (!activeProfileUsername) return;
      let profile = POODLE_PROFILES[activeProfileUsername];
      if (!profile) return;
      profile.isFollowing = !profile.isFollowing;
      updateMainProfileFollowBtn(profile.isFollowing);
      if (profile.isFollowing) {
        showToast(`@${profile.username} takip edildi! 🐾`);
        addPawPoints(15, `@${profile.username} takip edildi`);
      } else {
        showToast(`@${profile.username} takipten çıkarıldı.`);
      }
    }

    function updateMainProfileFollowBtn(isFollowing) {
      const btn = document.getElementById('profile-main-follow-btn');
      if (!btn) return;
      if (isFollowing) {
        btn.className = 'px-5 py-1.5 bg-gray-100 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-[#333] text-black dark:text-white border border-[#dbdbdb] dark:border-[#444] text-xs font-semibold rounded-lg transition active:scale-95';
        btn.innerText = 'Takip Ediliyor';
      } else {
        btn.className = 'px-5 py-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold rounded-lg transition active:scale-95 shadow-sm';
        btn.innerText = 'Takip Et';
      }
    }

    function sendDirectMessageFromProfile() {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Mesaj göndermek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      if (!activeProfileUsername) return;
      const targetUser = activeProfileUsername;
      let dmIndex = dmData.findIndex(d => d.user === targetUser);
      if (dmIndex === -1) {
        const profile = POODLE_PROFILES[targetUser] || {};
        dmData.unshift({
          user: targetUser,
          avatar: profile.avatar || '/images/poodle_mochi.jpg',
          lastMsg: 'Sohbet başlatıldı',
          time: 'şimdi',
          unread: false,
          messages: [
            { sender: targetUser, text: `Merhaba! Poodle'ını çok sevdim 🐾`, time: 'Az önce' }
          ]
        });
        dmIndex = 0;
      }
      switchTab('messages');
      selectDm(dmIndex);
      showToast(`@${targetUser} ile mesajlaşma açıldı 💬`);
    }

    function giftPawPointsFromProfile() {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Pati maması ikram etmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      if (!activeProfileUsername) return;
      if ((currentUser.pawPoints || 0) < 10) {
        showToast('Yeterli Pati Puanınız yok! Paylaşım yaparak puan kazanabilirsiniz. 🐾');
        return;
      }
      currentUser.pawPoints = (currentUser.pawPoints || 0) - 10;
      updatePawPointsUI();
      const profile = POODLE_PROFILES[activeProfileUsername];
      if (profile) {
        profile.pawPoints = (profile.pawPoints || 100) + 10;
        const elPaw = document.getElementById('profile-paw-points');
        if (elPaw) elPaw.innerText = profile.pawPoints;
      }
      showToast(`@${activeProfileUsername} Poodle'ına 10 Pati Maması ikram edildi! 🦴❤️`);
      sendNativeNotification(
        'Pati Hediyesi Gönderildi! 🐾',
        `@${activeProfileUsername} Poodle'ına 10 Pati Puanı ikram ettin!`,
        '/images/poodle_mochi.jpg'
      );
    }

    // ================= PROFILE SUB-TABS (POSTS / SAVED / REELS) =================
    let activeProfileSubTab = 'posts';

    function switchProfileSubTab(tab) {
      activeProfileSubTab = tab;
      const tabPostsBtn = document.getElementById('profile-subtab-posts');
      const tabSavedBtn = document.getElementById('profile-subtab-saved');
      const tabReelsBtn = document.getElementById('profile-subtab-reels');
      const gridPosts = document.getElementById('profile-grid');
      const gridSaved = document.getElementById('profile-saved-grid');

      [tabPostsBtn, tabSavedBtn, tabReelsBtn].forEach(b => {
        if (b) {
          b.className = 'flex items-center gap-2 py-3 border-t-2 border-transparent text-[#737373] hover:text-black dark:hover:text-white transition cursor-pointer';
        }
      });

      triggerHaptic(15);

      if (tab === 'posts') {
        if (tabPostsBtn) tabPostsBtn.className = 'flex items-center gap-2 py-3 border-t-2 border-black dark:border-white text-black dark:text-white transition cursor-pointer';
        if (gridPosts) gridPosts.classList.remove('hidden');
        if (gridSaved) gridSaved.classList.add('hidden');
      } else if (tab === 'saved') {
        if (tabSavedBtn) tabSavedBtn.className = 'flex items-center gap-2 py-3 border-t-2 border-black dark:border-white text-black dark:text-white transition cursor-pointer';
        if (gridPosts) gridPosts.classList.add('hidden');
        if (gridSaved) {
          gridSaved.classList.remove('hidden');
          renderProfileSavedGrid();
        }
      } else if (tab === 'reels') {
        if (tabReelsBtn) tabReelsBtn.className = 'flex items-center gap-2 py-3 border-t-2 border-black dark:border-white text-black dark:text-white transition cursor-pointer';
        switchTab('reels');
      }
    }

    function renderProfileSavedGrid() {
      const container = document.getElementById('profile-saved-grid');
      if (!container) return;
      const savedPosts = postsData.filter(p => savedPostIds.includes(String(p.id)) || p.isSaved);
      if (!savedPosts.length) {
        container.innerHTML = `
          <div class="col-span-3 py-16 flex flex-col items-center justify-center gap-3 text-center text-[#737373]">
            <div class="size-16 rounded-full border-2 border-dashed border-[#dbdbdb] dark:border-[#333] flex items-center justify-center text-2xl">
              🔖
            </div>
            <div>
              <h4 class="font-bold text-sm text-black dark:text-white">Henüz Kaydedilen Gönderi Yok</h4>
              <p class="text-xs">Beğendiğin Poodle fotoğraflarını ve videolarını daha sonra kolayca bulmak için kaydet.</p>
            </div>
          </div>
        `;
        return;
      }
      container.innerHTML = savedPosts.map(p => `
        <div class="relative aspect-square group cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-800" onclick="showToast('Kaydedilen gönderi açıldı!')">
          <img src="${p.image}" alt="Saved Post" class="size-full object-cover group-hover:scale-105 transition duration-300">
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-6 text-white font-bold text-sm">
            <span class="flex items-center gap-1.5">❤️ ${p.likes}</span>
            <span class="flex items-center gap-1.5">💬 ${p.comments ? p.comments.length : 0}</span>
          </div>
          ${p.mediaType === 'video' ? '<span class="absolute top-2 right-2 text-white drop-shadow">🎬</span>' : ''}
        </div>
      `).join('');
    }

    // ================= FOLLOWERS / FOLLOWING MODAL =================
    const SAMPLE_USERS_LIST = [
      { username: 'luna_paris', name: 'Luna (Red Apricot)', avatar: '/images/poodle_luna.jpg', isFollowing: true },
      { username: 'teddy_fluff', name: 'Teddy Bear', avatar: '/images/poodle_teddy.jpg', isFollowing: true },
      { username: 'coco_biscuit', name: 'Coco & Biscuit', avatar: '/images/poodle_coco.jpg', isFollowing: false },
      { username: 'bella_toypoodle', name: 'Bella Princess', avatar: '/images/poodle_bella.jpg', isFollowing: true },
      { username: 'oliver_curly', name: 'Oliver Star', avatar: '/images/poodle_oliver.jpg', isFollowing: false },
      { username: 'milo_puppy', name: 'Milo Puppy', avatar: '/images/poodle_milo.jpg', isFollowing: true },
      { username: 'charlie_toypoodle', name: 'Charlie Curly', avatar: '/images/poodle_charlie.jpg', isFollowing: false }
    ];

    let currentFollowersType = 'followers';

    function openFollowersModal(type = 'followers') {
      currentFollowersType = type;
      const modal = document.getElementById('followers-modal');
      const title = document.getElementById('followers-modal-title');
      const searchInp = document.getElementById('followers-search-input');
      if (searchInp) searchInp.value = '';
      if (title) title.innerText = type === 'followers' ? 'Takipçiler 🐾' : 'Takip Edilenler 🐾';
      renderFollowersModalList(SAMPLE_USERS_LIST);
      if (modal) modal.classList.remove('hidden');
      triggerHaptic(15);
    }

    function closeFollowersModal() {
      const modal = document.getElementById('followers-modal');
      if (modal) modal.classList.add('hidden');
    }

    function filterFollowersModalList(query) {
      const q = (query || '').toLowerCase().trim();
      const filtered = SAMPLE_USERS_LIST.filter(u => 
        u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
      );
      renderFollowersModalList(filtered);
    }

    function renderFollowersModalList(list) {
      const container = document.getElementById('followers-modal-list');
      if (!container) return;
      if (!list.length) {
        container.innerHTML = '<div class="py-8 text-center text-xs text-[#737373]">Kullanıcı bulunamadı 🐾</div>';
        return;
      }
      container.innerHTML = list.map((u, i) => `
        <div class="p-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#202020] rounded-xl transition">
          <div onclick="closeFollowersModal(); viewUserProfile('${u.username}');" class="flex items-center gap-3 cursor-pointer">
            <img src="${u.avatar}" class="size-10 rounded-full object-cover border border-[#dbdbdb] dark:border-[#333]">
            <div class="leading-tight">
              <h5 class="text-xs font-bold hover:underline">${u.username}</h5>
              <span class="text-[11px] text-[#737373]">${u.name}</span>
            </div>
          </div>
          <button onclick="toggleFollowModalUser(${i}, this)" class="px-3.5 py-1 text-xs font-semibold rounded-lg transition active:scale-95 ${u.isFollowing ? 'bg-gray-100 dark:bg-[#333] text-black dark:text-white border border-[#dbdbdb] dark:border-[#444]' : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'}">
            ${u.isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
          </button>
        </div>
      `).join('');
    }

    function toggleFollowModalUser(index, btnEl) {
      const user = SAMPLE_USERS_LIST[index];
      if (!user) return;
      user.isFollowing = !user.isFollowing;
      triggerHaptic(20);
      if (user.isFollowing) {
        btnEl.className = 'px-3.5 py-1 text-xs font-semibold rounded-lg transition active:scale-95 bg-gray-100 dark:bg-[#333] text-black dark:text-white border border-[#dbdbdb] dark:border-[#444]';
        btnEl.innerText = 'Takip Ediliyor';
        addPawPoints(15, `@${user.username} takip edildi`);
        showToast(`@${user.username} takip edildi! (+15 Pati 🐾)`);
      } else {
        btnEl.className = 'px-3.5 py-1 text-xs font-semibold rounded-lg transition active:scale-95 bg-[#0095f6] hover:bg-[#1877f2] text-white';
        btnEl.innerText = 'Takip Et';
        showToast(`@${user.username} takipten çıkarıldı.`);
      }
    }

    function handleProfileAvatarClick() {
      const isOwnProfile = (!activeProfileUsername || (currentUser && currentUser.username === activeProfileUsername));
      if (isOwnProfile) {
        triggerPoodleAvatarUpload();
      } else {
        showToast('Profil fotoğrafı tam boyutta görüntülendi!');
      }
    }

    // Modal backward compatibility functions
    function closeUserProfileModal() {
      const m = document.getElementById('user-profile-modal');
      if (m) m.classList.add('hidden');
    }

    function toggleOtherProfileFollow() {
      toggleMainProfileFollow();
    }

    function updateOtherFollowButton(isFollowing) {
      updateMainProfileFollowBtn(isFollowing);
    }

    function sendDirectMessageToOther() {
      sendDirectMessageFromProfile();
    }

    function giftPawPointsToOther() {
      giftPawPointsFromProfile();
    }

    // ================= POODLE SWITCHER & MULTI-POODLE ENGINE =================
    let userPoodlesList = [];

    async function openPoodleSwitcherModal() {
      const modal = document.getElementById('poodle-switcher-modal');
      if (!modal) return;
      modal.classList.remove('hidden');

      const listContainer = document.getElementById('poodle-switcher-list');
      if (!listContainer) return;
      listContainer.innerHTML = '<div class="py-4 text-center text-xs text-gray-500">Poodle profilleri getiriliyor...</div>';

      try {
        const res = await fetch(`/api/live/user/poodles?username=${encodeURIComponent(currentUser.username)}`);
        const data = await res.json();
        if (data.ok && data.poodles && data.poodles.length > 0) {
          userPoodlesList = data.poodles;
        } else {
          userPoodlesList = [{
            id: 1,
            poodleName: currentUser.displayName || 'Mochi',
            variety: currentUser.variety || 'Toy Poodle',
            color: currentUser.color || 'Red Apricot',
            avatar: currentUser.avatar || '/images/poodle_mochi.jpg',
            isActive: true
          }];
        }
        renderPoodleSwitcherList();
      } catch(err) {
        console.warn('Could not fetch poodles:', err);
        renderPoodleSwitcherList();
      }
    }

    function renderPoodleSwitcherList() {
      const listContainer = document.getElementById('poodle-switcher-list');
      if (!listContainer) return;

      if (!userPoodlesList || userPoodlesList.length === 0) {
        listContainer.innerHTML = '<div class="py-4 text-center text-xs text-gray-400">Henüz kayıtlı başka Poodle profiliniz yok.</div>';
        return;
      }

      listContainer.innerHTML = userPoodlesList.map(p => {
        const isActive = (p.isActive || p.poodleName === currentUser.displayName);
        return `
          <button onclick="activateUserPoodle(${p.id})" class="flex items-center justify-between p-2.5 rounded-xl ${isActive ? 'bg-amber-500/10 border border-amber-500/40' : 'hover:bg-gray-100 dark:hover:bg-[#252525] border border-transparent'} text-left transition w-full">
            <div class="flex items-center gap-3 min-w-0">
              <img src="${p.avatar || '/images/poodle_mochi.jpg'}" class="size-10 rounded-full object-cover shrink-0 ${isActive ? 'border-2 border-amber-500' : ''}">
              <div class="min-w-0">
                <h4 class="font-bold text-xs truncate text-gray-900 dark:text-gray-100">${p.poodleName} 🐾</h4>
                <p class="text-[10px] text-gray-500 truncate">${p.variety || 'Poodle'} · ${p.color || ''} ${p.weight ? '· ' + p.weight + ' kg' : ''}</p>
              </div>
            </div>
            ${isActive ? '<span class="text-xs font-bold text-emerald-500 shrink-0">✓ Aktif</span>' : '<span class="text-[10px] text-gray-400 hover:text-[#0095f6] shrink-0 font-semibold">Geçiş Yap</span>'}
          </button>
        `;
      }).join('');
    }

    function closePoodleSwitcherModal() {
      const modal = document.getElementById('poodle-switcher-modal');
      if (modal) modal.classList.add('hidden');
    }

    async function activateUserPoodle(poodleId) {
      try {
        const res = await fetch(`/api/live/user/poodles/${poodleId}/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: currentUser.username })
        });
        const data = await res.json();
        if (data.ok && data.poodle) {
          currentUser.displayName = data.poodle.poodleName;
          currentUser.variety = data.poodle.variety;
          currentUser.color = data.poodle.color;
          currentUser.avatar = data.poodle.avatar || currentUser.avatar;
          if (data.poodle.weight) currentUser.weight = data.poodle.weight;
          if (data.poodle.microchip) currentUser.microchip = data.poodle.microchip;
          if (data.poodle.birthDate) currentUser.birthDate = data.poodle.birthDate;

          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
          updateUIAfterAuth();
          closePoodleSwitcherModal();
          showToast(`🐩 Aktif Poodle: ${data.poodle.poodleName} olarak değiştirildi!`);
          if (typeof renderMainProfile === 'function') renderMainProfile(currentUser.username);
          return;
        }
      } catch(e) {
        console.warn('Activate remote failed:', e);
      }
      closePoodleSwitcherModal();
    }

    function openAddPoodleModal() {
      const modal = document.getElementById('add-poodle-modal');
      if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('new-poodle-name').focus();
      }
    }

    function closeAddPoodleModal() {
      const modal = document.getElementById('add-poodle-modal');
      if (modal) modal.classList.add('hidden');
    }

    async function submitAddPoodle(event) {
      event.preventDefault();
      const btn = document.getElementById('btn-save-new-poodle');
      if (btn) {
        btn.disabled = true;
        btn.innerText = 'Ekleniyor...';
      }

      const poodleName = document.getElementById('new-poodle-name').value.trim();
      const variety = document.getElementById('new-poodle-variety').value;
      const color = document.getElementById('new-poodle-color').value;
      const weight = document.getElementById('new-poodle-weight').value.trim();
      const birthDate = document.getElementById('new-poodle-birth').value;
      const microchip = document.getElementById('new-poodle-chip').value.trim();

      let avatar = '/images/poodle_teddy.jpg';
      if (variety.includes('Toy')) avatar = '/images/poodle_mochi.jpg';
      else if (variety.includes('Minyatür')) avatar = '/images/poodle_luna.jpg';

      try {
        const res = await fetch('/api/live/user/poodles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            poodleName,
            variety,
            color,
            weight,
            birthDate,
            microchip,
            avatar,
            isActive: true
          })
        });
        const data = await res.json();
        if (data.ok && data.poodle) {
          currentUser.displayName = data.poodle.poodleName;
          currentUser.variety = data.poodle.variety;
          currentUser.color = data.poodle.color;
          currentUser.avatar = data.poodle.avatar || avatar;
          currentUser.weight = data.poodle.weight;
          currentUser.microchip = data.poodle.microchip;
          currentUser.birthDate = data.poodle.birthDate;

          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
          updateUIAfterAuth();
          if (typeof renderMainProfile === 'function') renderMainProfile(currentUser.username);

          closeAddPoodleModal();
          showPawCelebration(50, `Yeni Poodle: ${poodleName}! 🐾🎉`);
          showToast(`🎉 ${poodleName} başarıyla hesabına eklendi ve aktif edildi!`);
          document.getElementById('add-poodle-form').reset();
        } else {
          showToast('Hata: ' + (data.error || 'Poodle eklenemedi'));
        }
      } catch(err) {
        console.error('Error adding poodle:', err);
        showToast('Sunucu hatası, lütfen tekrar deneyin.');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>🐾 Poodle\'ı Ekle ve Aktif Yap</span>';
        }
      }
    }

    // ================= CREATE POST & CAMERA/GALLERY UPLOAD =================
    let selectedCreateImage = '/images/poodle_teddy.jpg';
    let currentUploadFile = null;
    let currentMediaType = 'image';

    function openCreateModal() {
      setTimeout(updateCreatePostHandlePreview, 50);

      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Gönderi paylaşmak için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      const uAvatar = document.getElementById('create-user-avatar');
      const uName = document.getElementById('create-user-name');
      if (uAvatar) uAvatar.src = currentUser.avatar;
      if (uName) uName.innerText = currentUser.displayName;
      document.getElementById('create-modal').classList.remove('hidden');
    }

    function closeCreateModal() {
      document.getElementById('create-modal').classList.add('hidden');
    }

    function triggerCameraCapture() {
      const inp = document.getElementById('camera-file-input');
      if (inp) inp.click();
    }

    function triggerGalleryUpload() {
      const inp = document.getElementById('gallery-file-input');
      if (inp) inp.click();
    }

    function handleLiveMediaSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const isVideo = file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|m4v)$/i);

      if (isVideo) {
        // Enforce 80 MB video cap to prevent mobile quota exhaustion and Nginx 413 error
        if (file.size > 80 * 1024 * 1024) {
          showToast(`⚠️ Video boyutu 80 MB sınırını aşıyor (${(file.size / (1024 * 1024)).toFixed(1)} MB). Lütfen daha kısa bir video seçin.`);
          event.target.value = '';
          currentUploadFile = null;
          return;
        }
      }

      currentUploadFile = file;
      currentMediaType = isVideo ? 'video' : 'image';

      const url = URL.createObjectURL(file);
      const imgPreview = document.getElementById('create-preview-img');
      const videoPreview = document.getElementById('create-preview-video');
      const badge = document.getElementById('create-media-badge');
      const filtersBar = document.getElementById('image-filters-bar');

      if (isVideo) {
        imgPreview.classList.add('hidden');
        videoPreview.classList.remove('hidden');
        videoPreview.src = url;
        videoPreview.play().catch(() => {});
        badge.innerText = `🎥 Video (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
        if (filtersBar) filtersBar.classList.add('hidden');
        showToast('Video seçildi! Canlı önizleme hazır 🎬');
      } else {
        videoPreview.classList.add('hidden');
        videoPreview.pause();
        imgPreview.classList.remove('hidden');
        imgPreview.src = url;
        const sizeText = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
        badge.innerText = `📷 ${sizeText} ➔ 1440px WebP`;
        if (filtersBar) filtersBar.classList.remove('hidden');
        showToast('Fotoğraf seçildi! Paylaşılırken otomatik 1440px WebP (300-400 KB) formatına optimize edilecek ⚡');
      }
      selectedCreateImage = url;
    }

    function selectPresetPhoto(url) {
      currentUploadFile = null;
      currentMediaType = 'image';
      selectedCreateImage = url;
      const img = document.getElementById('create-preview-img');
      const vid = document.getElementById('create-preview-video');
      const badge = document.getElementById('create-media-badge');
      const filtersBar = document.getElementById('image-filters-bar');

      vid.classList.add('hidden');
      vid.pause();
      img.classList.remove('hidden');
      img.src = url;
      badge.innerText = '📷 Fotoğraf';
      if (filtersBar) filtersBar.classList.remove('hidden');
    }

    function applyImageFilter(filterName) {
      const img = document.getElementById('create-preview-img');
      if (!img) return;
      if (filterName === 'glow') {
        img.style.filter = 'contrast(1.15) brightness(1.1) saturate(1.25)';
      } else if (filterName === 'warm') {
        img.style.filter = 'sepia(0.25) saturate(1.3) hue-rotate(-10deg)';
      } else if (filterName === 'sepia') {
        img.style.filter = 'sepia(0.65) contrast(0.95)';
      } else if (filterName === 'bw') {
        img.style.filter = 'grayscale(1) contrast(1.2)';
      } else {
        img.style.filter = 'none';
      }
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('text-[#0095f6]'));
      if (event && event.target) event.target.classList.add('text-[#0095f6]');
    }

    function insertEmoji(emoji) {
      const cap = document.getElementById('create-caption');
      if (cap) {
        cap.value += emoji;
        cap.focus();
      }
    }

    function selectLocationPreset(loc) {
      const inp = document.getElementById('create-location');
      if (inp) inp.value = loc;
    }

    /**
     * Canvas API High-Performance Client-Side Image Optimizer
     * Converts raw phone camera photos (12-25MB 4K) to max 1440px WebP (300-400 KB)
     * Preserves aspect ratio, handles EXIF orientation and progressive quality matching.
     */
    async function compressImageFile(file, maxDimension = 1440, targetMaxKB = 400) {
      if (!file || !file.type || !file.type.startsWith('image/')) return file;

      // If already a small WebP (< 300KB), no need to compress further
      if (file.type === 'image/webp' && file.size <= targetMaxKB * 1024) {
        return file;
      }

      return new Promise(async (resolve) => {
        let source = null;
        let originalWidth = 0;
        let originalHeight = 0;

        // 1. Try createImageBitmap (async off-thread decoding with native orientation)
        try {
          if (typeof createImageBitmap === 'function') {
            source = await createImageBitmap(file);
            originalWidth = source.width;
            originalHeight = source.height;
          }
        } catch (e) {
          source = null;
        }

        // 2. Fallback to standard Image() if createImageBitmap is not supported or fails
        if (!source) {
          try {
            source = await new Promise((resImg, rejImg) => {
              const img = new Image();
              const url = URL.createObjectURL(file);
              img.onload = () => {
                URL.revokeObjectURL(url);
                originalWidth = img.naturalWidth || img.width;
                originalHeight = img.naturalHeight || img.height;
                resImg(img);
              };
              img.onerror = (err) => {
                URL.revokeObjectURL(url);
                rejImg(err);
              };
              img.src = url;
            });
          } catch (imgErr) {
            console.warn('[Image Compress] Failed to decode image:', imgErr);
            return resolve(file);
          }
        }

        if (!source || !originalWidth || !originalHeight) {
          return resolve(file);
        }

        // 3. Scale dimensions preserving aspect ratio (longest side <= 1440px)
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        const longestSide = Math.max(originalWidth, originalHeight);

        if (longestSide > maxDimension) {
          const scale = maxDimension / longestSide;
          targetWidth = Math.round(originalWidth * scale);
          targetHeight = Math.round(originalHeight * scale);
        }

        // 4. Render to Canvas with high quality bicubic interpolation
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (typeof source.close === 'function') source.close();
          return resolve(file);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

        // Free memory if ImageBitmap
        if (typeof source.close === 'function') {
          source.close();
        }

        const getBlob = (mime, q) => new Promise((res) => canvas.toBlob(res, mime, q));

        // 5. Adaptive multi-pass compression to hit 300-400 KB target in WebP
        let chosenMime = 'image/webp';
        let quality = 0.84;
        let blob = await getBlob(chosenMime, quality);

        // Safari / older browser fallback if WebP export is not supported
        if (!blob || blob.type !== 'image/webp') {
          chosenMime = 'image/jpeg';
          blob = await getBlob(chosenMime, quality);
        }

        if (!blob) {
          return resolve(file);
        }

        const maxBytes = targetMaxKB * 1024; // 400 KB
        const qualitySteps = [0.75, 0.65, 0.55, 0.46];
        let qIdx = 0;

        // Step down quality if image exceeds target 400 KB
        while (blob.size > maxBytes && qIdx < qualitySteps.length) {
          quality = qualitySteps[qIdx++];
          const testBlob = await getBlob(chosenMime, quality);
          if (testBlob) {
            blob = testBlob;
          }
        }

        // If still over 400 KB in extreme high-detail textures, resize canvas to 1280px
        if (blob.size > maxBytes && Math.max(targetWidth, targetHeight) > 1280) {
          const subScale = 1280 / Math.max(targetWidth, targetHeight);
          const subW = Math.round(targetWidth * subScale);
          const subH = Math.round(targetHeight * subScale);
          const subCanvas = document.createElement('canvas');
          subCanvas.width = subW;
          subCanvas.height = subH;
          const subCtx = subCanvas.getContext('2d');
          if (subCtx) {
            subCtx.imageSmoothingEnabled = true;
            subCtx.imageSmoothingQuality = 'high';
            subCtx.drawImage(canvas, 0, 0, subW, subH);
            const subBlob = await new Promise(r => subCanvas.toBlob(r, chosenMime, 0.72));
            if (subBlob && subBlob.size < blob.size) {
              blob = subBlob;
            }
          }
        }

        const ext = chosenMime === 'image/webp' ? '.webp' : '.jpg';
        const rawName = file.name || 'poodle_upload';
        const cleanBaseName = rawName.replace(/\.[^/.]+$/, "");
        const compressedFile = new File([blob], `${cleanBaseName}${ext}`, {
          type: chosenMime,
          lastModified: Date.now()
        });

        const origKB = (file.size / 1024).toFixed(0);
        const finalKB = (compressedFile.size / 1024).toFixed(0);
        const pctSaved = Math.max(0, ((1 - compressedFile.size / file.size) * 100)).toFixed(0);

        console.log(`[Canvas API WebP] ${originalWidth}x${originalHeight} (${origKB} KB) ➔ ${targetWidth}x${targetHeight} (${finalKB} KB WebP, -${pctSaved}% quota saved)`);

        resolve(compressedFile);
      });
    }
    window.compressImageFile = compressImageFile;

    async function submitNewPost() {
      const caption = document.getElementById('create-caption').value.trim() || 'Yeni bir Poodle günü! 🐾';

      if (window.ypModeration) {
        const mod = window.ypModeration.validate(caption, 'Gönderi açıklaması');
        if (!mod.ok) {
          showToast(mod.message);
          return;
        }
      }

      const loc = document.getElementById('create-location').value.trim() || currentUser.city || 'İstanbul, Türkiye';
      const submitBtn = document.getElementById('create-submit-btn');
      const progressContainer = document.getElementById('upload-progress-container');
      const progressBar = document.getElementById('upload-progress-bar');
      const progressPercent = document.getElementById('upload-progress-percent');
      const progressStatus = document.getElementById('upload-progress-status');

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="animate-spin mr-1">⏳</span> Yükleniyor...';
      progressContainer.classList.remove('hidden');
      progressBar.style.width = '30%';
      progressPercent.innerText = '30%';

      let finalMediaUrl = selectedCreateImage;
      let finalMediaType = currentMediaType;
      let finalHlsUrl = '';

      try {
        // 1. If user captured or uploaded a file from their phone, compress image and upload
        if (currentUploadFile) {
          if (currentMediaType === 'video' && currentUploadFile.size > 80 * 1024 * 1024) {
            showToast(`⚠️ Video boyutu 80 MB sınırını aşıyor (${(currentUploadFile.size / (1024 * 1024)).toFixed(1)} MB).`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Paylaş 🐾</span>';
            progressContainer.classList.add('hidden');
            return;
          }

          if (currentUploadFile.type && currentUploadFile.type.startsWith('image/')) {
            const origSizeKB = (currentUploadFile.size / 1024).toFixed(0);
            progressStatus.innerText = 'Fotoğraf Canvas API ile 1440px WebP formatına dönüştürülüyor... ⚡';
            progressBar.style.width = '45%';
            progressPercent.innerText = '45%';
            try {
              currentUploadFile = await compressImageFile(currentUploadFile, 1440, 400);
              const newSizeKB = (currentUploadFile.size / 1024).toFixed(0);
              progressStatus.innerText = `Görsel optimize edildi (${origSizeKB} KB ➔ ${newSizeKB} KB WebP) ✨`;
            } catch(e) {
              console.warn('Compression fallback:', e);
            }
          }

          progressStatus.innerText = 'Fotoğraf / Video sunucuya kalıcı olarak yükleniyor... 🐾';
          progressBar.style.width = '65%';
          progressPercent.innerText = '65%';

          const formData = new FormData();
          formData.append('file', currentUploadFile);

          const uploadRes = await fetch('/api/live/upload', {
            method: 'POST',
            body: formData
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            finalMediaUrl = uploadData.url;
            finalMediaType = uploadData.mediaType || currentMediaType;
            finalHlsUrl = uploadData.hlsUrl || '';
          }
        }

        progressBar.style.width = '85%';
        progressPercent.innerText = '85%';
        progressStatus.innerText = 'Gönderi yayına alınıyor... ✨';

        // 2. Save post to persistent backend API (/api/live/posts)
        const postPayload = {
          authorName: currentUser.displayName,
          authorUsername: currentUser.username,
          authorAvatar: currentUser.avatar,
          mediaUrl: finalMediaUrl,
          mediaType: finalMediaType,
          hlsUrl: finalHlsUrl,
          caption: caption,
          location: loc
        };

        let serverPostId = null;
        try {
          const apiRes = await fetch('/api/live/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postPayload)
          });
          if (apiRes.ok) {
            const resData = await apiRes.json();
            if (resData.post) serverPostId = resData.post.id;
          }
        } catch (e) {
          console.warn('API save error, fallback to local:', e);
        }

        progressBar.style.width = '100%';
        progressPercent.innerText = '100%';

        // 3. Add to local feed state
        const newPost = {
          id: serverPostId || Date.now(),
          username: currentUser.username,
          userAvatar: currentUser.avatar,
          location: loc,
          verified: false,
          timeAgo: 'Az önce',
          image: finalMediaUrl,
          mediaType: finalMediaType,
          hlsUrl: finalHlsUrl,
          likes: 1,
          isLiked: true,
          isSaved: false,
          caption: caption,
          hashtags: '#yourpoodle #poodlelove #toypoodle',
          comments: []
        };

        postsData.unshift(newPost);
        currentUser.postsCount = (currentUser.postsCount || 0) + 1;
        localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
        
        // Earn 50 Paw Points for new post!
        addPawPoints(50, 'Yeni an paylaştın 📸');
        
        updateUIAfterAuth();
        renderPosts();
        closeCreateModal();

        // Reset inputs
        document.getElementById('create-caption').value = '';
        document.getElementById('create-location').value = '';
        currentUploadFile = null;

        showToast('Gönderin kalıcı olarak yayınlandı! (+50 Pati 🐾 kazandın)');
        switchTab('home');

        // 4. Live Engagement Simulation:
        // After 6 seconds, Luna likes the photo and sends real push notification to user's phone!
        setTimeout(() => {
          triggerEngagementNotification('like', 'Luna', '/images/poodle_luna.jpg');
        }, 6000);

      } catch (err) {
        console.error('Submit error:', err);
        showToast('Gönderi yayınlandı.');
        closeCreateModal();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Paylaş</span>';
        progressContainer.classList.add('hidden');
      }
    }

    // ================= CANLI BİLDİRİMLER (PUSH NOTIFICATIONS) =================
    let liveNotificationsList = [];

    // Register Service Worker for Push Notifications & PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(reg => {
        window.swRegistration = reg;
        updatePushBadgeStatus();
      }).catch(err => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
          window.swRegistration = reg;
          updatePushBadgeStatus();
        }).catch(e => console.warn('SW registration fallback note:', e));
      });
    }

    // ================= PWA INSTALL PROMPT LOGIC =================
    let deferredPwaPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPwaPrompt = e;
      if (!localStorage.getItem('yp_pwa_dismissed')) {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.remove('hidden');
      }
    });

    async function installPWA() {
      if (!deferredPwaPrompt) {
        showToast('Tarayıcınızın menüsünden "Ana Ekrana Ekle" seçeneğiyle yükleyebilirsiniz 📲');
        return;
      }
      deferredPwaPrompt.prompt();
      const choice = await deferredPwaPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        showToast('YourPoodle ana ekranına eklendi! 🎉');
      }
      deferredPwaPrompt = null;
      dismissPWABanner();
    }

    function dismissPWABanner() {
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.classList.add('hidden');
      localStorage.setItem('yp_pwa_dismissed', '1');
    }

    function checkNotificationPermission() {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'default') {
        setTimeout(() => {
          const dismissed = sessionStorage.getItem('yp_notif_dismissed');
          if (!dismissed) {
            document.getElementById('notif-permission-modal').classList.remove('hidden');
          }
        }, 3500);
      }
    }

    async function enablePushNotifications() {
      if (!('Notification' in window)) {
        showToast('Bu tarayıcı bildirimleri desteklemiyor.');
        return;
      }
      try {
        const permission = await Notification.requestPermission();
        document.getElementById('notif-permission-modal').classList.add('hidden');
        updatePushBadgeStatus();
        if (permission === 'granted') {
          showToast('Canlı Bildirimler Açıldı! 🔔');
          sendNativeNotification(
            'YourPoodle: Canlı Bildirimler Aktif! 🐾',
            'Luna senin fotoğrafını beğendiğinde veya yeni mesaj geldiğinde telefonuna haber vereceğiz.',
            '/images/poodle_luna.jpg'
          );
        } else {
          showToast('Bildirim izni verilmedi.');
        }
      } catch (err) {
        console.error('Notification permission error:', err);
      }
    }

    function dismissNotifPermission() {
      document.getElementById('notif-permission-modal').classList.add('hidden');
      sessionStorage.setItem('yp_notif_dismissed', '1');
    }

    function updatePushBadgeStatus() {
      const badge = document.getElementById('push-status-badge');
      if (!badge) return;
      if (window.Notification && Notification.permission === 'granted') {
        badge.className = 'px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
        badge.innerText = 'Aktif 🔔';
      } else {
        badge.className = 'px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 cursor-pointer';
        badge.innerText = 'İzin Ver ⚠️';
        badge.onclick = enablePushNotifications;
      }
    }

    function sendNativeNotification(title, body, icon = '/images/poodle_mochi.jpg') {
      if (window.swRegistration && 'showNotification' in window.swRegistration) {
        window.swRegistration.showNotification(title, {
          body: body,
          icon: icon,
          badge: '/images/poodle_mochi.jpg',
          vibrate: [200, 100, 200],
          data: { url: '/' }
        });
      } else if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, { body: body, icon: icon });
        } catch (e) {}
      }

      if ('vibrate' in navigator) {
        try { navigator.vibrate([100, 50, 100]); } catch (e) {}
      }
    }

    function testPhoneNotification(type) {
      if (window.ypPush && window.ypPush.isSubscribed) {
        if (type === 'message') {
          window.ypPush.triggerDmAlert();
        } else if (type === 'vaccine') {
          window.ypPush.triggerVaccineAlert();
        } else {
          window.ypPush.sendTestPush();
        }
        return;
      }

      if ('Notification' in window && Notification.permission !== 'granted') {
        enablePushNotifications();
        return;
      }

      if (type === 'like') {
        sendNativeNotification(
          'Luna senin fotoğrafını beğendi! ❤️',
          'Luna az önce paylaştığın Toy Poodle fotoğrafını beğendi ve +5 Pati Puanı kazandırdı!',
          '/images/poodle_luna.jpg'
        );
        addInAppNotification('like', 'Luna', '/images/poodle_luna.jpg', 'senin fotoğrafını beğendi. ❤️');
        showToast('📲 "Luna Fotoğrafını Beğendi" bildirimi gönderildi!');
      } else if (type === 'message') {
        sendNativeNotification(
          'Yeni bir mesajın var! 💬',
          'Mochi: "Yarın Bebek Parkı\'nda Toy Poodle buluşmasına geliyor musun? 🐾"',
          '/images/poodle_mochi.jpg'
        );
        addInAppNotification('message', 'Mochi', '/images/poodle_mochi.jpg', 'sana yeni bir mesaj gönderdi: "Bebek parkında buluşalım mı? 🎾"');
        showToast('📲 "Yeni Mesaj" bildirimi gönderildi!');
      } else {
        sendNativeNotification(
          'Pati Puanı Kazandın! 🐾',
          '+50 Pati Puanı cüzdanına eklendi! Rütben: Kıvırcık Kaşif 🎾',
          '/images/poodle_mochi.jpg'
        );
        showToast('📲 Pati Puanı bildirimi gönderildi!');
      }
    }

    function addInAppNotification(type, userName, userAvatar, text) {
      const notif = {
        id: 'notif_' + Date.now(),
        type: type,
        user: userName.toLowerCase(),
        userName: userName,
        userAvatar: userAvatar,
        message: text,
        timeAgo: 'Az önce',
        read: false
      };
      liveNotificationsList.unshift(notif);
      renderNotifications();
    }

    function triggerEngagementNotification(type, userName, userAvatar) {
      sendNativeNotification(
        `${userName} senin fotoğrafını beğendi! ❤️`,
        `${userName} az önce yüklediğin Toy Poodle anını beğendi ve +5 Pati Puanı kazandın! 🐾`,
        userAvatar
      );
      addInAppNotification('like', userName, userAvatar, 'senin fotoğrafını beğendi. ❤️');
      addPawPoints(5, `${userName} fotoğrafını beğendi!`);
    }

    async function fetchNotificationsFromAPI() {
      try {
        const u = (currentUser && currentUser.username) ? currentUser.username : '';
        const res = await fetch(`/api/live/notifications?username=${encodeURIComponent(u)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.notifications && data.notifications.length) {
            liveNotificationsList = data.notifications;
            renderNotifications();
          }
        }
      } catch (e) {
        console.warn('Notifications fetch err:', e);
      }
    }

    let currentNotifFilter = 'all';

    function filterNotificationList(type, btn) {
      currentNotifFilter = type;
      document.querySelectorAll('.notif-tab-btn').forEach(b => {
        b.className = 'notif-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-[#252525] dark:hover:bg-[#303030] text-gray-700 dark:text-gray-300 shrink-0 cursor-pointer transition active:scale-95 select-none';
      });
      if (btn) {
        btn.className = 'notif-tab-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0095f6] text-white shadow-xs shrink-0 cursor-pointer transition active:scale-95 select-none';
      }
      renderNotifications();
    }

    function renderNotifications() {
      const container = document.getElementById('notifications-list-container');
      if (!container) return;

      const unreadCount = liveNotificationsList.filter(n => !n.read).length;
      const badgePill = document.getElementById('notif-badge-pill');
      if (badgePill) {
        badgePill.innerText = unreadCount > 0 ? `${unreadCount} Yeni` : 'Güncel';
        badgePill.className = unreadCount > 0 
          ? 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-xs animate-pulse'
          : 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      }

      let filtered = liveNotificationsList;
      if (currentNotifFilter !== 'all') {
        filtered = liveNotificationsList.filter(n => {
          if (currentNotifFilter === 'community') return n.type === 'community' || n.type === 'topic_reply';
          return n.type === currentNotifFilter;
        });
      }

      if (!filtered.length) {
        container.innerHTML = `
          <div class="py-12 flex flex-col items-center justify-center text-center gap-2">
            <span class="text-3xl">🐾</span>
            <p class="text-xs font-bold text-gray-500">Bu kategoride henüz yeni bir bildirim yok</p>
            <span class="text-[11px] text-gray-400">Yeni etkileşimler anında burada belirecek.</span>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(n => {
        let iconBadge = '❤️';
        let badgeBg = 'bg-rose-500';
        if (n.type === 'message') { iconBadge = '💬'; badgeBg = 'bg-[#0095f6]'; }
        else if (n.type === 'follow') { iconBadge = '👤'; badgeBg = 'bg-purple-500'; }
        else if (n.type === 'community' || n.type === 'topic_reply') { iconBadge = '🐩'; badgeBg = 'bg-amber-500'; }

        return `
          <div class="flex items-center justify-between gap-3 text-xs p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#252525] border border-gray-100 dark:border-[#282828] transition-all active:scale-[0.99] select-none ${n.read ? 'opacity-75' : 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'}">
            <div class="flex items-center gap-3 min-w-0">
              <div class="relative shrink-0 cursor-pointer" onclick="viewUserProfile('${n.user || n.userName}')">
                <img src="${n.userAvatar || '/images/poodle_mochi.jpg'}" class="size-10 rounded-full object-cover border border-[#dbdbdb] dark:border-[#333]">
                <span class="absolute -bottom-1 -right-1 size-4 rounded-full ${badgeBg} text-white flex items-center justify-center text-[9px] shadow-xs">${iconBadge}</span>
              </div>
              <div class="leading-snug min-w-0">
                <p class="text-gray-900 dark:text-gray-100 text-xs">
                  <strong class="font-bold hover:underline cursor-pointer" onclick="viewUserProfile('${n.user || n.userName}')">@${n.userName}</strong> 
                  <span>${n.message}</span>
                </p>
                <span class="text-[10px] text-gray-400">${n.timeAgo}</span>
              </div>
            </div>
            <div class="shrink-0 flex items-center gap-1.5">
              ${n.type === 'follow' ? `
                <button type="button" onclick="showToast('@${n.userName} takip edildi! 🐾'); this.innerText='Takip Edildi'; this.disabled=true;" class="px-3 py-1 bg-[#0095f6] hover:bg-[#1877f2] text-white text-[11px] font-bold rounded-xl shadow-xs transition active:scale-95 cursor-pointer">
                  Geri Takip Et
                </button>
              ` : (n.type === 'message' ? `
                <button type="button" onclick="closeNotificationsModal(); switchTab('messages');" class="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-[#303030] dark:hover:bg-[#404040] text-gray-700 dark:text-gray-200 text-[11px] font-bold rounded-xl transition active:scale-95 cursor-pointer">
                  Cevapla 💬
                </button>
              ` : `
                <span class="text-xs text-gray-400">Görüldü ✓</span>
              `)}
            </div>
          </div>
        `;
      }).join('');
    }

    async function markAllNotificationsRead() {
      liveNotificationsList.forEach(n => n.read = true);
      renderNotifications();
      fetch('/api/live/notifications/read-all', { method: 'POST' }).catch(() => {});
      showToast('Tüm bildirimler okundu olarak işaretlendi.');
    }

    function openNotifPreferencesModal() {
      const modal = document.getElementById('notif-preferences-modal');
      if (modal) modal.classList.remove('hidden');
    }

    function closeNotifPreferencesModal() {
      const modal = document.getElementById('notif-preferences-modal');
      if (modal) modal.classList.add('hidden');
    }

    function saveNotificationPreferences() {
      showToast('Bildirim tercihleriniz güncellendi! 🐾🔔');
      closeNotifPreferencesModal();
    }

    // ================= POODLE SORU-CEVAP & YARDIMLAŞMA KULÜBÜ ENGINE =================
    let communityTopicsData = [];
    let activeCommunityVariety = 'all';
    let activeCommunityCategory = 'all';
    let activeTopicDetailId = null;
    let selectedTopicImageFile = null;

    function handleTopicImageSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      selectedTopicImageFile = file;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const previewImg = document.getElementById('new-topic-preview-img');
        const previewBox = document.getElementById('new-topic-preview-box');
        const uploadBox = document.getElementById('new-topic-upload-box');
        if (previewImg && previewBox) {
          previewImg.src = evt.target.result;
          previewBox.classList.remove('hidden');
        }
        if (uploadBox) uploadBox.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }

    function clearTopicImageSelection(e) {
      if (e) e.stopPropagation();
      selectedTopicImageFile = null;
      const fileInput = document.getElementById('new-topic-image-file');
      if (fileInput) fileInput.value = '';
      const previewBox = document.getElementById('new-topic-preview-box');
      const uploadBox = document.getElementById('new-topic-upload-box');
      if (previewBox) previewBox.classList.add('hidden');
      if (uploadBox) uploadBox.classList.remove('hidden');
    }

    async function loadCommunityTopics() {
      const container = document.getElementById('community-topics-list');
      if (container) {
        container.innerHTML = '<div class="py-12 text-center text-xs text-gray-400 flex items-center justify-center gap-2"><span>🔄</span><span>Sorular ve deneyimler yükleniyor... 🐾</span></div>';
      }
      try {
        let url = `/api/live/community/topics?variety=${encodeURIComponent(activeCommunityVariety)}&category=${encodeURIComponent(activeCommunityCategory)}`;
        const searchInput = document.getElementById('community-search-input');
        if (searchInput && searchInput.value.trim()) {
          url += `&q=${encodeURIComponent(searchInput.value.trim())}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok && data.topics) {
          communityTopicsData = data.topics;
          renderCommunityTopics(communityTopicsData);
        } else {
          if (container) container.innerHTML = '<div class="py-12 text-center text-xs text-gray-400">Sorular yüklenemedi.</div>';
        }
      } catch (err) {
        if (container) container.innerHTML = '<div class="py-12 text-center text-xs text-gray-400">Bağlantı hatası oluştu.</div>';
      }
    }

    function renderCommunityTopics(topics) {
      const container = document.getElementById('community-topics-list');
      if (!container) return;
      const _t = (k, fb) => (window.ypI18n ? window.ypI18n.t(k, fb) : fb);
      const curLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'en';

      if (!topics || !topics.length) {
        container.innerHTML = `
          <div class="py-14 text-center text-xs text-gray-400 bg-gray-50 dark:bg-[#181818] rounded-2xl border border-dashed border-gray-200 dark:border-[#333] flex flex-col items-center justify-center gap-2">
            <span class="text-4xl">🐩💬</span>
            <p class="font-extrabold text-sm text-gray-700 dark:text-gray-200">${_t('comm.emptyTitle', 'Bu kategoride henüz soru bulunamadı.')}</p>
            <p class="text-xs text-gray-500 max-w-sm">${_t('comm.emptyDesc', 'Aklına takılan soruyu ilk soran sen ol, deneyimli Poodle aileleri ve veterinerler yanıtlasın!')}</p>
            <button onclick="openCreateTopicModal()" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold rounded-xl shadow-md active:scale-95 cursor-pointer mt-2">${_t('comm.firstQuestionBtn', 'İlk Soruyu Sen Sor (+25 Pati 🐾)')}</button>
          </div>
        `;
        return;
      }

      const catMap = {
        bakim: _t('comm.catGrooming', '✂️ Bakım & Tıraş'),
        beslenme: _t('comm.catDiet', '🥩 Beslenme & Mama'),
        egitim: _t('comm.catTraining', '🎾 Eğitim & Tuvalet'),
        saglik: _t('comm.catHealth', '🩺 Sağlık & Aşı'),
        topluluk: _t('comm.catCity', '📍 Şehir Buluşmaları'),
        tanisma: _t('comm.catMeetup', '👋 Tanışma & Deneyim'),
        sahiplenme: '🤝 ' + _t('comm.catAll', 'Sahiplenme & Yuva')
      };

      container.innerHTML = topics.map(t => {
        const catLabel = catMap[t.category] || '🐩 Poodle Q&A';
        const varietyLabel = t.variety === 'toy' ? _t('comm.varToy', 'Toy Poodle') : (t.variety === 'miniature' ? _t('comm.varMini', 'Miniature') : (t.variety === 'standard' ? _t('comm.varStd', 'Standard') : _t('comm.varAll', 'Tüm Poodle')));
        const authorBadge = t.author && t.author.badge;
        let badgeHtml = '';
        if (authorBadge === 'expert') {
          badgeHtml = `<span class="px-1.5 py-0.2 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[9px] font-black border border-blue-500/30">${_t('badge.vet', '🩺 Vet. Hekim')}</span>`;
        } else if (authorBadge === 'groomer') {
          badgeHtml = `<span class="px-1.5 py-0.2 rounded-md bg-pink-500/15 text-pink-600 dark:text-pink-400 text-[9px] font-black border border-pink-500/30">${_t('badge.groomer', '✂️ Pet Kuaför')}</span>`;
        } else if (authorBadge === 'trainer') {
          badgeHtml = `<span class="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-black border border-amber-500/30">${_t('badge.trainer', '🎾 Eğitmen')}</span>`;
        }

        return `
          <div onclick="openTopicDetail('${t.id}')" class="p-4 sm:p-5 bg-white dark:bg-[#1a1a1a] border border-[#dbdbdb] dark:border-[#2a2a2a] rounded-2xl hover:border-amber-500/60 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group active:scale-[0.99] select-none flex flex-col gap-3">
            
            <!-- Badges & Status Row -->
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">${catLabel}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-[#282828] text-gray-600 dark:text-gray-300">${varietyLabel}</span>
                ${t.city ? `<span class="text-[10px] text-gray-400">📍 ${t.city}</span>` : ''}
                ${t.mediaUrl ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-300">${_t('comm.photoBadge', '📸 Fotoğraflı')}</span>` : ''}
                ${t.isSolved ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">${_t('comm.answeredBadge', 'Yanıtlandı ✅')}</span>` : ''}
              </div>

              <!-- Upvote Pill -->
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-black shrink-0">
                <span>🐾</span>
                <span>${t.upvotes || 0}</span>
              </div>
            </div>

            <!-- Author & Time Row -->
            <div class="flex items-center gap-2 text-xs">
              <img src="${(t.author && t.author.avatar) || '/images/poodle_mochi.jpg'}" class="size-6 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0">
              <span class="font-bold text-gray-900 dark:text-white">${(t.author && (t.author.name || t.author.username)) || _t('comm.member', 'Poodle Sever')}</span>
              ${badgeHtml}
              <span class="text-[10px] text-gray-400">· ${t.createdAt ? new Date(t.createdAt).toLocaleDateString(curLang) : 'Bugün'}</span>
            </div>

            <!-- Question Body & Optional Thumbnail -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <h3 class="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition leading-snug">
                  ${t.title}
                </h3>
                <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                  ${t.content}
                </p>
              </div>
              ${t.mediaUrl ? `
                <div class="size-16 sm:size-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-[#333] shadow-xs">
                  <img src="${t.mediaUrl}" class="size-full object-cover group-hover:scale-105 transition duration-300">
                </div>
              ` : ''}
            </div>

            <!-- Question Card Footer -->
            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#262626] text-xs">
              <div class="flex items-center gap-3 text-[#737373] text-[11px] font-semibold">
                <span class="flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200">💬 ${t.repliesCount || 0} ${_t('comm.replies', 'yanıt')}</span>
                <span>·</span>
                <span class="flex items-center gap-1">👁️ ${t.viewsCount || 1} ${_t('comm.views', 'görüntülenme')}</span>
              </div>
              <button class="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold text-[11px] rounded-xl transition active:scale-95 cursor-pointer flex items-center gap-1">
                <span>${_t('comm.readAndReply', 'Yanıtları Oku & Cevapla')}</span>
                <span>💬</span>
              </button>
            </div>

          </div>
        `;
      }).join('');
    }

    function setCommunityVariety(variety, btn) {
      activeCommunityVariety = variety;
      document.querySelectorAll('.comm-variety-btn').forEach(b => {
        b.className = 'comm-variety-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gray-100 dark:bg-[#202020] text-gray-700 dark:text-gray-300 hover:bg-gray-200 shrink-0 transition active:scale-95 cursor-pointer';
      });
      if (btn) btn.className = 'comm-variety-btn px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#0095f6] text-white shrink-0 transition active:scale-95 cursor-pointer shadow-xs';
      loadCommunityTopics();
    }

    function setCommunityCategory(category, btn) {
      activeCommunityCategory = category;
      document.querySelectorAll('.comm-cat-btn').forEach(b => {
        b.className = 'comm-cat-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-[#202020] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] shrink-0 transition active:scale-95 cursor-pointer';
      });
      if (btn) btn.className = 'comm-cat-btn px-3 py-1.5 rounded-xl text-xs font-extrabold bg-black dark:bg-white text-white dark:text-black shrink-0 transition active:scale-95 cursor-pointer shadow-xs';
      loadCommunityTopics();
    }

    function filterCommunityTopics() {
      const q = (document.getElementById('community-search-input')?.value || '').toLowerCase().trim();
      if (!q) {
        renderCommunityTopics(communityTopicsData);
        return;
      }
      const filtered = communityTopicsData.filter(t => 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.content && t.content.toLowerCase().includes(q)) ||
        (t.city && t.city.toLowerCase().includes(q))
      );
      renderCommunityTopics(filtered);
    }

    function openCreateTopicModal() {
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Soru sormak için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      document.getElementById('create-topic-modal')?.classList.remove('hidden');
    }

    function closeCreateTopicModal() {
      document.getElementById('create-topic-modal')?.classList.add('hidden');
      clearTopicImageSelection();
    }

    async function submitNewTopic(e) {
      if (e && e.preventDefault) e.preventDefault();
      const title = document.getElementById('new-topic-title')?.value.trim();
      const content = document.getElementById('new-topic-content')?.value.trim();
      const category = document.getElementById('new-topic-cat')?.value || 'saglik';
      const variety = document.getElementById('new-topic-var')?.value || 'all';
      const city = document.getElementById('new-topic-city')?.value.trim() || 'İstanbul';
      const submitBtn = document.getElementById('btn-submit-topic');

      if (!title || !content) {
        showToast('Lütfen soru başlığını ve detayları doldurunuz.');
        return;
      }

      if (window.ypModeration) {
        const modTitle = window.ypModeration.validate(title, 'Soru başlığı');
        if (!modTitle.ok) {
          showToast(modTitle.message);
          return;
        }
        const modContent = window.ypModeration.validate(content, 'Soru detayı');
        if (!modContent.ok) {
          showToast(modContent.message);
          return;
        }
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Yayınlanıyor... 🐾</span>';
      }

      let mediaUrl = document.getElementById('new-topic-media')?.value.trim() || '';

      // Upload selected image file if present
      if (selectedTopicImageFile) {
        try {
          if (selectedTopicImageFile.type && selectedTopicImageFile.type.startsWith('image/')) {
            try {
              selectedTopicImageFile = await compressImageFile(selectedTopicImageFile, 1440, 400);
            } catch(compErr) {
              console.warn('Topic image compress fallback:', compErr);
            }
          }
          const formData = new FormData();
          formData.append('file', selectedTopicImageFile);
          const upRes = await fetch('/api/live/upload', {
            method: 'POST',
            body: formData
          });
          if (upRes.ok) {
            const upData = await upRes.json();
            if (upData.url) mediaUrl = upData.url;
          }
        } catch (upErr) {
          console.warn('Image upload error:', upErr);
        }
      }

      try {
        const res = await fetch('/api/live/community/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            name: currentUser.displayName,
            avatar: currentUser.avatar,
            badge: currentUser.isVerified ? 'verified' : '',
            title,
            content,
            category,
            variety,
            city,
            media_url: mediaUrl
          })
        }).then(r => r.json());

        if (res.ok) {
          closeCreateTopicModal();
          showToast('Sorunuz başarıyla yayınlandı! +25 Pati Puanı kazandınız 🐾🎉');
          addPawPoints(25, 'Toplulukta yeni soru sordunuz');
          // Reset form fields
          document.getElementById('new-topic-title').value = '';
          document.getElementById('new-topic-content').value = '';
          clearTopicImageSelection();
          loadCommunityTopics();
        } else {
          showToast(res.error || 'Soru paylaşılamadı.');
        }
      } catch (err) {
        showToast('Bağlantı hatası oluştu.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Soruyu Toplulukla Paylaş 🐾</span><span class="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-black">+25 Pati</span>';
        }
      }
    }

    async function openTopicDetail(topicId) {
      activeTopicDetailId = topicId;
      const modal = document.getElementById('topic-detail-modal');
      if (modal) modal.classList.remove('hidden');

      try {
        const res = await fetch(`/api/live/community/topics/${encodeURIComponent(topicId)}`);
        const data = await res.json();
        if (data.ok && data.topic) {
          const t = data.topic;
          const catMap = {
            bakim: '✂️ Bakım & Tıraş',
            beslenme: '🥩 Beslenme & Mama',
            egitim: '🎾 Eğitim & Tuvalet',
            saglik: '🩺 Sağlık & Aşı',
            topluluk: '📍 Şehir Buluşmaları',
            tanisma: '👋 Tanışma & Deneyim',
            sahiplenme: '🤝 Sahiplenme & Yuva'
          };
          const catBadgeEl = document.getElementById('topic-modal-cat-badge');
          if (catBadgeEl) catBadgeEl.innerText = catMap[t.category] || 'Poodle Sorusu';

          const solvedBadge = document.getElementById('topic-modal-solved-badge');
          if (solvedBadge) solvedBadge.classList.toggle('hidden', !t.isSolved);

          document.getElementById('topic-modal-title').innerText = t.title || '';
          const topicContentEl = document.getElementById('topic-modal-content');
          if (topicContentEl) {
            topicContentEl.innerText = t.content || '';
            topicContentEl.setAttribute('data-original', encodeURIComponent(t.content || ''));
          }
          const topicTransBtn = document.getElementById('btn-trans-topic-detail');
          if (topicTransBtn) {
            topicTransBtn.setAttribute('data-translated', 'false');
            const lbl = document.getElementById('topic-detail-trans-text');
            if (lbl && typeof getTranslationLinkText === 'function') lbl.innerText = getTranslationLinkText(false);
          }
          document.getElementById('topic-modal-author').innerText = (t.author && (t.author.name || t.author.username)) || 'Poodle Sever';
          document.getElementById('topic-modal-avatar').src = (t.author && t.author.avatar) || '/images/poodle_mochi.jpg';
          document.getElementById('topic-modal-city').innerText = t.city || 'Türkiye';
          document.getElementById('topic-modal-time').innerText = t.createdAt ? new Date(t.createdAt).toLocaleDateString('tr-TR') : 'Bugün';
          document.getElementById('topic-modal-upvotes').innerText = t.upvotes || 0;
          document.getElementById('topic-modal-views').innerText = `${t.viewsCount || 1} görüntülenme`;
          document.getElementById('topic-modal-replies-count').innerText = `${(t.replies && t.replies.length) || 0} yanıt`;

          // Handle Question Image Preview
          const mediaBox = document.getElementById('topic-modal-media');
          if (mediaBox) {
            const imgEl = mediaBox.querySelector('img');
            if (t.mediaUrl) {
              if (imgEl) imgEl.src = t.mediaUrl;
              mediaBox.classList.remove('hidden');
            } else {
              mediaBox.classList.add('hidden');
            }
          }

          const repList = document.getElementById('topic-modal-replies-list');
          if (repList) {
            if (t.replies && t.replies.length) {
              repList.innerHTML = t.replies.map(r => {
                const b = r.author && r.author.badge;
                let bHtml = '';
                if (b === 'expert') bHtml = '<span class="px-1.5 py-0.2 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[9px] font-black border border-blue-500/30">🩺 Vet. Hekim</span>';
                else if (b === 'groomer') bHtml = '<span class="px-1.5 py-0.2 rounded-md bg-pink-500/15 text-pink-600 dark:text-pink-400 text-[9px] font-black border border-pink-500/30">✂️ Pet Kuaför</span>';
                else if (b === 'trainer') bHtml = '<span class="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-black border border-amber-500/30">🎾 Eğitmen</span>';

                return `
                  <div class="p-3.5 bg-gray-50 dark:bg-[#202020] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] flex items-start gap-3 text-xs shadow-2xs">
                    <img src="${(r.author && r.author.avatar) || '/images/poodle_mochi.jpg'}" class="size-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2 flex-wrap">
                        <div class="flex items-center gap-1.5">
                          <strong class="font-bold text-gray-900 dark:text-white">${(r.author && (r.author.name || r.author.username)) || 'Üye'}</strong>
                          ${bHtml}
                          ${r.isSolution ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">Çözüm ⭐</span>' : ''}
                        </div>
                        <span class="text-[10px] text-gray-400">${r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : 'Az önce'}</span>
                      </div>
                      <p class="text-gray-800 dark:text-gray-200 mt-1.5 whitespace-pre-line leading-relaxed text-xs sm:text-[13px]">${r.text || r.content || ''}</p>
                      
                      <!-- Reply Action -->
                      <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50 dark:border-[#2c2c2c] text-[11px]">
                        <button onclick="voteReplyAction('${r.id}', this)" class="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 active:scale-95 cursor-pointer">
                          <span>🐾 Faydalı Yanıt</span>
                          <span class="reply-upvotes-count">(${r.upvotes || 1})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                `;
              }).join('');
            } else {
              repList.innerHTML = '<p class="text-xs text-gray-400 text-center py-6 bg-gray-50 dark:bg-[#202020] rounded-xl border border-dashed border-gray-200 dark:border-[#333]">Bu soruya henüz yanıt verilmemiş. İlk deneyimini paylaşan sen ol! 🐾</p>';
            }
          }
        }
      } catch (err) {
        showToast('Konu detayları getirilemedi.');
      }
    }

    function voteReplyAction(repId, btn) {
      if (btn) {
        const countSpan = btn.querySelector('.reply-upvotes-count');
        if (countSpan) {
          const cur = parseInt(countSpan.innerText.replace(/\D/g, '') || '1');
          countSpan.innerText = `(${cur + 1})`;
        }
      }
      showToast('Yanıtı faydalı buldunuz! 🐾❤️');
    }

    function closeTopicDetailModal() {
      document.getElementById('topic-detail-modal')?.classList.add('hidden');
    }

    async function submitActiveTopicReply(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!currentUser || !currentUser.isLoggedIn) {
        showToast('Yanıt yazabilmek için lütfen üye girişi yapın 🐾');
        openAuthModal('login');
        return;
      }
      const input = document.getElementById('topic-reply-input');
      const text = input ? input.value.trim() : '';
      if (!text || !activeTopicDetailId) return;

      if (window.ypModeration) {
        const mod = window.ypModeration.validate(text, 'Yanıtınız');
        if (!mod.ok) {
          showToast(mod.message);
          return;
        }
      }

      try {
        const res = await fetch(`/api/live/community/topics/${encodeURIComponent(activeTopicDetailId)}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            name: currentUser.displayName,
            avatar: currentUser.avatar,
            text: text
          })
        }).then(r => r.json());

        if (res.ok) {
          input.value = '';
          showToast('Yanıtınız paylaşıldı! +10 Pati Puanı kazandınız 🐾');
          addPawPoints(10, 'Topluluk sorusuna yanıt verdiniz');
          openTopicDetail(activeTopicDetailId);
          loadCommunityTopics();
        } else {
          showToast(res.error || 'Yanıt gönderilemedi.');
        }
      } catch (err) {
        showToast('Bağlantı hatası oluştu.');
      }
    }

    async function voteActiveTopic() {
      if (!activeTopicDetailId) return;
      const el = document.getElementById('topic-modal-upvotes');
      if (el) el.innerText = (parseInt(el.innerText || '0') + 1);
      showToast('Pati oyunuz eklendi! 🐾❤️');
    }

    let seenPostIds = [];
    let isSmartFeedLoading = false;
    let smartFeedHasMore = true;

    async function fetchPostsFromAPI(isAppend = false) {
      if (isSmartFeedLoading) return;
      isSmartFeedLoading = true;
      try {
        const u = (currentUser && currentUser.username) ? currentUser.username : '';
        const seenParam = seenPostIds.slice(-40).join(',');
        const res = await fetch(`/api/live/feed/smart?username=${encodeURIComponent(u)}&seen_ids=${encodeURIComponent(seenParam)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.posts && data.posts.length) {
            const mapped = data.posts.map(p => {
              seenPostIds.push(String(p.id));
              return {
                id: p.id,
                username: p.author ? p.author.username : 'poodle_parent',
                userAvatar: p.author ? p.author.avatar : '/images/poodle_mochi.jpg',
                location: p.location || 'Türkiye',
                verified: p.author && p.author.badge === 'verified',
                badge: p.author ? p.author.badge : '',
                countryCode: (p.author && p.author.countryCode) || p.countryCode || (p.location && (p.location.includes('İstanbul') || p.location.includes('Bebek') || p.location.includes('Türkiye')) ? 'TR' : (p.location && p.location.includes('Paris') ? 'FR' : 'UK')),
                isAi: (p.author && (p.author.badge === 'ai_guide' || p.author.is_ai_persona)) || AI_PERSONA_USERNAMES.includes(p.author ? p.author.username : ''),
                timeAgo: p.timeAgo || 'Bugün',
                image: p.mediaUrl,
                mediaType: p.mediaType || 'image',
                hlsUrl: p.hlsUrl || '',
                likes: p.likes || 0,
                isLiked: p.likedByMe || false,
                isSaved: savedPostIds.includes(String(p.id)) || p.savedByMe || false,
                caption: p.caption || '',
                hashtags: '#yourpoodle #toypoodle #poodlelove',
                comments: (p.commentList || []).map(c => ({
                  id: c.id,
                  user: c.user,
                  text: c.text,
                  parentId: c.parentId,
                  replyToUser: c.replyToUser
                }))
              };
            });

            if (isAppend) {
              const currentIds = new Set(postsData.map(p => String(p.id)));
              const newItems = mapped.filter(p => !currentIds.has(String(p.id)));
              if (newItems.length > 0) {
                postsData.push(...newItems);
                renderPosts();
              }
            } else {
              postsData = mapped;
              renderPosts();
            }
            smartFeedHasMore = data.has_more !== false;
          }
        }
      } catch (e) {
        console.warn('Smart feed error:', e);
      } finally {
        isSmartFeedLoading = false;
      }
    }

    // Infinite scroll listener for smart feed
    window.addEventListener('scroll', () => {
      if (currentActiveTab !== 'home') return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) {
        if (!isSmartFeedLoading && smartFeedHasMore) {
          fetchPostsFromAPI(true);
        }
      }
    });

    // Modals
    function openNotificationsModal() {
      document.getElementById('notif-modal').classList.remove('hidden');
      fetchNotificationsFromAPI();
      updatePushBadgeStatus();
    }
    function closeNotificationsModal() {
      document.getElementById('notif-modal').classList.add('hidden');
    }

    // ================= LIVE SEARCH & EXPLORE DRAWER =================
function openSearchModal() {
  const modal = document.getElementById('search-drawer-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const input = document.getElementById('search-live-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    handleLiveSearch('');
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-drawer-modal');
  if (modal) modal.classList.add('hidden');
}

let searchDebounceTimer = null;
let activeSearchFilter = 'all';

function setSearchFilter(filter) {
  activeSearchFilter = filter;
  document.querySelectorAll('.search-filter-pill').forEach(btn => {
    if (btn.innerText.includes(filter) || (filter === 'all' && btn.innerText === 'Tümü')) {
      btn.className = 'search-filter-pill px-3 py-1 rounded-full font-bold bg-[#0095f6] text-white';
    } else {
      btn.className = 'search-filter-pill px-3 py-1 rounded-full font-bold bg-gray-100 dark:bg-[#262626] text-gray-600 dark:text-gray-300 hover:bg-gray-200';
    }
  });
  const input = document.getElementById('search-live-input');
  handleLiveSearch(input ? input.value : '');
}

function handleLiveSearch(query) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(async () => {
    const container = document.getElementById('search-results-container');
    if (!container) return;

    const q = (query || '').trim();
    const filterParam = (activeSearchFilter !== 'all' && !q) ? activeSearchFilter : q;
    const searchUrl = `/api/live/search?q=${encodeURIComponent(filterParam)}`;
    
    container.innerHTML = '<div class="py-6 text-center text-gray-400 text-xs">Aranıyor...</div>';

    try {
      const res = await fetch(searchUrl);
      const data = await res.json();
      
      if (!data.ok || ((!data.users || data.users.length === 0) && (!data.posts || data.posts.length === 0))) {
        container.innerHTML = `
          <div class="py-8 text-center text-gray-400 text-xs">
            <span class="text-2xl block mb-2">🐾</span>
            "${q || activeSearchFilter}" ile eşleşen Poodle veya gönderi bulunamadı.
          </div>
        `;
        return;
      }

      let html = '';

      if (data.users && data.users.length > 0) {
        html += '<div class="py-2"><span class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Poodle Dostları & Sahipleri</span></div>';
        data.users.forEach(u => {
          html += `
            <div onclick="closeSearchModal(); viewUserProfile('${u.username}')" class="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl cursor-pointer transition">
              <div class="flex items-center gap-3 min-w-0">
                <img src="${u.avatar || '/images/poodle_mochi.jpg'}" class="size-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700">
                <div class="min-w-0">
                  <div class="flex items-center gap-1">
                    <span class="font-bold text-xs truncate">${u.poodleName || u.displayName}</span>
                    ${u.isVerified ? '<span class="text-[#0095f6] text-xs" title="Mavi Pati Doğrulanmış">💎</span>' : ''}
                  </div>
                  <p class="text-[11px] text-gray-500 truncate">@${u.username} · ${u.variety || 'Poodle'} ${u.city ? '· ' + u.city : ''}</p>
                </div>
              </div>
              <button class="px-3 py-1 bg-[#efefef] dark:bg-[#333] hover:bg-[#0095f6] hover:text-white text-xs font-semibold rounded-lg transition shrink-0">Gör</button>
            </div>
          `;
        });
      }

      if (data.posts && data.posts.length > 0) {
        html += '<div class="py-2 mt-2"><span class="text-[10px] font-bold uppercase text-gray-400 tracking-wider">İlgili Paylaşımlar</span></div>';
        data.posts.forEach(p => {
          html += `
            <div onclick="closeSearchModal(); viewUserProfile('${p.authorUsername}')" class="flex items-center gap-3 py-2 px-1 hover:bg-gray-50 dark:hover:bg-[#222] rounded-xl cursor-pointer transition">
              <div class="size-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                <img src="${p.mediaUrl || p.authorAvatar}" class="size-full object-cover">
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-bold text-xs">@${p.authorUsername}</span>
                  <span class="text-[10px] text-gray-400">· ${p.variety || 'Poodle'}</span>
                </div>
                <p class="text-xs text-gray-700 dark:text-gray-300 truncate">${p.caption || ''}</p>
              </div>
            </div>
          `;
        });
      }

      container.innerHTML = html;
    } catch(err) {
      console.error('Live search error:', err);
      container.innerHTML = '<div class="py-4 text-center text-gray-400 text-xs">Arama sırasında bir bağlantı hatası oluştu.</div>';
    }
  }, 250);
}

    function toggleDarkMode() {
      document.documentElement.classList.toggle('dark');
      showToast(document.documentElement.classList.contains('dark') ? 'Karanlık Mod Açıldı 🌙' : 'Aydınlık Mod Açıldı ☀️');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-text').innerText = msg;
      toast.classList.remove('translate-y-20', 'opacity-0');
      setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 2500);
    }

    // Initial load
    window.addEventListener('DOMContentLoaded', () => {
      updateUIAfterAuth();
      updatePawPointsUI();
      renderDashboardUI();
      renderStories();
      renderPosts();
      renderSuggestions();
      fetchPostsFromAPI();
      fetchNotificationsFromAPI();
      checkNotificationPermission();
      updatePushBadgeStatus();
      initChatWebSocket();
      loadCommunityTopics();
    });
      window.addEventListener('DOMContentLoaded', () => {
      checkVerificationStatus();
      loadLiveStories();
      checkCollarTagUrl();
    });

    async function loadLiveStories() {
      try {
        const res = await fetch('/api/live/stories');
        const data = await res.json();
        if (data.ok && data.stories && data.stories.length > 0) {
          data.stories.forEach(remoteStory => {
            const existingIdx = storiesData.findIndex(s => s.id === remoteStory.id);
            if (existingIdx === -1) {
              storiesData.unshift({
                id: remoteStory.id,
                username: remoteStory.username,
                avatar: remoteStory.avatar || '/images/poodle_mochi.jpg',
                storyImg: remoteStory.mediaUrl,
                hasUnseen: true
              });
            }
          });
          renderStories();
        }
      } catch(e) {
        console.warn('Stories remote load note:', e);
      }
    }

    async function checkCollarTagUrl() {
      const path = window.location.pathname;
      if (path.startsWith('/p/')) {
        const collarUsername = path.substring(3).replace(/\/$/, '');
        if (collarUsername) {
          try {
            const res = await fetch(`/api/live/collar/${encodeURIComponent(collarUsername)}`);
            const data = await res.json();
            if (data.ok && data.collar) {
              const c = data.collar;
              const modal = document.getElementById('lost-tag-preview-modal');
              if (modal) {
                const avEl = document.getElementById('lost-preview-avatar');
                const nmEl = document.getElementById('lost-preview-name');
                const infEl = document.getElementById('lost-preview-info');
                if (avEl) avEl.src = c.avatar || '/images/poodle_mochi.jpg';
                if (nmEl) nmEl.innerText = (c.poodleName || collarUsername) + ' 🐾';
                if (infEl) infEl.innerText = `${c.variety || 'Toy Poodle'} · ${c.color || 'Red Apricot'} · ${c.weight || '2.85'} kg`;
                
                const waLink = modal.querySelector('a[href*="wa.me"]');
                if (waLink) {
                  const phone = c.maskPhone ? '905325550123' : (c.phone ? c.phone.replace(/[^0-9]/g, '') : '905325550123');
                  waLink.href = `https://wa.me/${phone}?text=${encodeURIComponent("Merhaba, " + (c.poodleName || 'Poodle') + " isimli köpeğin akıllı tasma künyesini okuttum. Konum bildiriyorum:")}`;
                }
                modal.classList.remove('hidden');
              }
            }
          } catch(e) {
            console.warn('Collar tag load err:', e);
          }
        }
      }
    }

  
    async function renderProfilePoodles(username) {
      const container = document.getElementById('profile-poodles-list');
      if (!container) return;
      const targetUser = username || (currentUser ? currentUser.username : 'mochi_poodle');
      try {
        const res = await fetch(`/api/live/users/${encodeURIComponent(targetUser)}/poodles`);
        const data = await res.json();
        if (data.ok && data.poodles && data.poodles.length > 0) {
          container.innerHTML = data.poodles.map(p => {
            const isActive = p.isActive || (currentUser && p.name === currentUser.displayName);
            return `
              <div class="flex items-center gap-3 p-2.5 rounded-xl border ${isActive ? 'bg-amber-500/10 border-amber-500/40' : 'bg-white dark:bg-[#202020] border-gray-200 dark:border-[#333]'} shrink-0 shadow-xs">
                <img src="${p.avatar || '/images/poodle_mochi.jpg'}" class="size-10 rounded-full object-cover border border-[#dbdbdb] dark:border-[#333]">
                <div class="flex flex-col">
                  <div class="flex items-center gap-1.5">
                    <strong class="text-xs font-bold text-gray-900 dark:text-white">${p.name}</strong>
                    ${isActive ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-white">Aktif 🐩</span>' : ''}
                  </div>
                  <span class="text-[10px] text-gray-500">${p.variety || 'Toy Poodle'} · ${p.weight ? p.weight + ' kg' : '2.8 kg'}</span>
                </div>
                ${!isActive && currentUser && currentUser.username === targetUser ? `
                  <button onclick="activateUserPoodle('${p.id}')" class="ml-2 px-2.5 py-1 bg-gray-100 dark:bg-[#303030] hover:bg-gray-200 dark:hover:bg-[#404040] text-[10px] font-bold rounded-lg transition cursor-pointer">
                    Seç
                  </button>
                ` : ''}
              </div>
            `;
          }).join('');
        } else {
          container.innerHTML = '<div class="text-xs text-gray-400 py-1">Kayıtlı Poodle profili bulunamadı. "Yeni Poodle Ekle" ile ekleyebilirsiniz.</div>';
        }
      } catch(e) {
        container.innerHTML = '<div class="text-xs text-gray-400 py-1">Poodle profilleri getirilemedi.</div>';
      }
    }

    // =========================================================================
    // PATTERN LOCK (SEMBOL / DESEN KİLİDİ) ENGINE & FLOWS
    // =========================================================================
    const PATTERN_COORDS = {
      1: { x: 47, y: 47 },
      2: { x: 140, y: 47 },
      3: { x: 233, y: 47 },
      4: { x: 47, y: 140 },
      5: { x: 140, y: 140 },
      6: { x: 233, y: 140 },
      7: { x: 47, y: 233 },
      8: { x: 140, y: 233 },
      9: { x: 233, y: 233 }
    };

    const PATTERN_COLLINEAR = {
      '1-3': 2, '3-1': 2,
      '4-6': 5, '6-4': 5,
      '7-9': 8, '9-7': 8,
      '1-7': 4, '7-1': 4,
      '2-8': 5, '8-2': 5,
      '3-9': 6, '9-3': 6,
      '1-9': 5, '9-1': 5,
      '3-7': 5, '7-3': 5
    };

    let patternState = {
      mode: 'LOGIN', // 'LOGIN', 'SETUP_1', 'SETUP_2', 'RESET_1', 'RESET_2'
      firstPattern: '',
      currentPattern: [],
      phone: '',
      username: '',
      isDrawing: false,
      pendingUser: null,
      isLocked: false
    };

    let isPatternEventsInitialized = false;

    function initPatternLockEvents() {
      if (isPatternEventsInitialized) return;
      const board = document.getElementById('pattern-lock-board');
      if (!board) return;
      isPatternEventsInitialized = true;

      function getSvgCoords(e) {
        const rect = board.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        return {
          x: (clientX - rect.left) * (280 / rect.width),
          y: (clientY - rect.top) * (280 / rect.height)
        };
      }

      function handlePointerDown(e) {
        if (patternState.isLocked) return;
        const pt = getSvgCoords(e);
        for (let id = 1; id <= 9; id++) {
          const node = PATTERN_COORDS[id];
          const d2 = (pt.x - node.x)**2 + (pt.y - node.y)**2;
          if (d2 <= 38*38) {
            patternState.isDrawing = true;
            clearPatternBoardVisuals();
            activatePatternNode(id);
            break;
          }
        }
      }

      function handlePointerMove(e) {
        if (!patternState.isDrawing || patternState.isLocked) return;
        const pt = getSvgCoords(e);
        
        // Update live tracking line
        if (patternState.currentPattern.length > 0) {
          const lastId = patternState.currentPattern[patternState.currentPattern.length - 1];
          const lastNode = PATTERN_COORDS[lastId];
          const trackLine = document.getElementById('pattern-track-line');
          if (trackLine) {
            trackLine.setAttribute('x1', lastNode.x);
            trackLine.setAttribute('y1', lastNode.y);
            trackLine.setAttribute('x2', pt.x);
            trackLine.setAttribute('y2', pt.y);
            trackLine.setAttribute('opacity', '1');
          }
        }

        // Check collision with unvisited nodes
        for (let id = 1; id <= 9; id++) {
          if (!patternState.currentPattern.includes(id)) {
            const node = PATTERN_COORDS[id];
            const d2 = (pt.x - node.x)**2 + (pt.y - node.y)**2;
            if (d2 <= 32*32) {
              const lastId = patternState.currentPattern[patternState.currentPattern.length - 1];
              const mid = PATTERN_COLLINEAR[`${lastId}-${id}`];
              if (mid && !patternState.currentPattern.includes(mid)) {
                activatePatternNode(mid);
              }
              activatePatternNode(id);
              break;
            }
          }
        }
      }

      function handlePointerUp() {
        if (!patternState.isDrawing) return;
        patternState.isDrawing = false;
        const trackLine = document.getElementById('pattern-track-line');
        if (trackLine) trackLine.setAttribute('opacity', '0');
        handlePatternComplete();
      }

      board.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    function activatePatternNode(id) {
      if (patternState.currentPattern.includes(id)) return;
      patternState.currentPattern.push(id);
      
      // Haptic feedback
      if (navigator.vibrate) {
        try { navigator.vibrate(20); } catch(e) {}
      }

      // Visual highlight on SVG node
      const g = document.getElementById(`svg-node-${id}`);
      if (g) {
        const ring = g.querySelector('.p-ring');
        const dot = g.querySelector('.p-dot');
        if (ring) {
          ring.setAttribute('stroke', '#f59e0b');
          ring.setAttribute('stroke-width', '3');
          ring.setAttribute('fill', 'rgba(245, 158, 11, 0.2)');
        }
        if (dot) {
          dot.setAttribute('fill', '#f59e0b');
          dot.setAttribute('r', '9');
        }
      }

      // Update polyline points
      const polyline = document.getElementById('pattern-polyline');
      if (polyline) {
        const pts = patternState.currentPattern.map(nid => `${PATTERN_COORDS[nid].x},${PATTERN_COORDS[nid].y}`).join(' ');
        polyline.setAttribute('points', pts);
        polyline.setAttribute('stroke', 'url(#patternGrad)');
      }
    }

    function clearPatternBoardVisuals() {
      for (let id = 1; id <= 9; id++) {
        const g = document.getElementById(`svg-node-${id}`);
        if (g) {
          const ring = g.querySelector('.p-ring');
          const dot = g.querySelector('.p-dot');
          if (ring) {
            ring.setAttribute('stroke', 'rgba(150,150,150,0.3)');
            ring.setAttribute('stroke-width', '2');
            ring.setAttribute('fill', 'none');
          }
          if (dot) {
            dot.setAttribute('fill', '#888');
            dot.setAttribute('r', '7');
          }
        }
      }
      const polyline = document.getElementById('pattern-polyline');
      if (polyline) {
        polyline.setAttribute('points', '');
        polyline.setAttribute('stroke', 'url(#patternGrad)');
      }
      const trackLine = document.getElementById('pattern-track-line');
      if (trackLine) trackLine.setAttribute('opacity', '0');
      patternState.currentPattern = [];
    }

    function clearPatternBoard() {
      clearPatternBoardVisuals();
      setPatternFeedback(
        patternState.mode === 'SETUP_2' || patternState.mode === 'RESET_2' 
          ? 'Aynı sembolü tekrar çiziniz' 
          : 'En az 4 noktayı birleştirin'
      );
    }

    function setPatternFeedback(text, type = 'normal') {
      const el = document.getElementById('pattern-feedback');
      if (!el) return;
      el.innerText = text;
      if (type === 'error') {
        el.className = 'px-3.5 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/15 border border-rose-500/30 text-center transition animate-pulse';
      } else if (type === 'success') {
        el.className = 'px-3.5 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 text-center transition';
      } else {
        el.className = 'px-3.5 py-1 rounded-full text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 text-center transition';
      }
    }

    async function handlePatternComplete() {
      const seq = patternState.currentPattern.join('-');

      if (patternState.currentPattern.length < 4) {
        patternState.isLocked = true;
        const polyline = document.getElementById('pattern-polyline');
        if (polyline) polyline.setAttribute('stroke', '#ef4444');
        setPatternFeedback('En az 4 nokta birleştirmelisiniz ⚠️', 'error');
        if (navigator.vibrate) {
          try { navigator.vibrate([40, 60, 40]); } catch(e) {}
        }
        setTimeout(() => {
          patternState.isLocked = false;
          clearPatternBoardVisuals();
          setPatternFeedback('En az 4 noktayı birleştirin');
        }, 700);
        return;
      }

      // 1. SETUP STEP 1 or RESET STEP 1
      if (patternState.mode === 'SETUP_1' || patternState.mode === 'RESET_1') {
        patternState.firstPattern = seq;
        patternState.isLocked = true;
        const polyline = document.getElementById('pattern-polyline');
        if (polyline) polyline.setAttribute('stroke', '#10b981');
        setPatternFeedback('Harika! Doğrulamak için tekrar çizin 🔄', 'success');
        if (navigator.vibrate) {
          try { navigator.vibrate(30); } catch(e) {}
        }
        setTimeout(() => {
          patternState.isLocked = false;
          patternState.mode = (patternState.mode === 'SETUP_1') ? 'SETUP_2' : 'RESET_2';
          clearPatternBoardVisuals();
          updatePatternUI();
        }, 450);
        return;
      }

      // 2. SETUP STEP 2 or RESET STEP 2 (CONFIRMATION)
      if (patternState.mode === 'SETUP_2' || patternState.mode === 'RESET_2') {
        if (seq === patternState.firstPattern) {
          patternState.isLocked = true;
          const polyline = document.getElementById('pattern-polyline');
          if (polyline) polyline.setAttribute('stroke', '#10b981');
          setPatternFeedback('Sembol onaylandı! Kaydediliyor... 🐾🔒', 'success');
          await savePatternToServer(seq);
        } else {
          patternState.isLocked = true;
          const polyline = document.getElementById('pattern-polyline');
          if (polyline) polyline.setAttribute('stroke', '#ef4444');
          setPatternFeedback('Semboller eşleşmedi! Lütfen baştan çizin ⚠️', 'error');
          if (navigator.vibrate) {
            try { navigator.vibrate([50, 50, 50]); } catch(e) {}
          }
          setTimeout(() => {
            patternState.isLocked = false;
            patternState.mode = (patternState.mode === 'SETUP_2') ? 'SETUP_1' : 'RESET_1';
            patternState.firstPattern = '';
            clearPatternBoardVisuals();
            updatePatternUI();
          }, 900);
        }
        return;
      }

      // 3. LOGIN MODE
      if (patternState.mode === 'LOGIN') {
        patternState.isLocked = true;
        setPatternFeedback('Giriş doğrulanıyor... ⏳');
        await loginWithPatternServer(seq);
      }
    }

    async function savePatternToServer(patternStr) {
      try {
        const res = await fetch('/api/live/auth/pattern/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: patternState.phone,
            username: patternState.username,
            pattern: patternStr
          })
        }).then(r => r.json());

        if (res.ok) {
          if (patternState.phone) {
            localStorage.setItem('yp_saved_phone', patternState.phone);
          }
          if (patternState.pendingUser) {
            currentUser = {
              ...DEFAULT_USER,
              ...patternState.pendingUser,
              isLoggedIn: true,
              hasPattern: true
            };
            localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
            updateUIAfterAuth();
            updatePawPointsUI();
            renderDashboardUI();
            showPawCelebration(100, 'Güvenlik Sembolü Tanımlandı 🎉');
          }
          showToast(res.message || 'Güvenlik sembolün kaydedildi! Artık tek dokunuşla giriş yapabilirsin 🐾🔒');
          closeAuthModal();
        } else {
          setPatternFeedback(res.error || 'Sembol kaydedilemedi.', 'error');
          patternState.isLocked = false;
        }
      } catch(e) {
        setPatternFeedback('Bağlantı hatası oluştu.', 'error');
        patternState.isLocked = false;
      }
    }

    async function loginWithPatternServer(patternStr) {
      try {
        const res = await fetch('/api/live/auth/pattern/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: patternState.phone,
            username: patternState.username,
            pattern: patternStr
          })
        }).then(r => r.json());

        if (res.ok && res.user) {
          const polyline = document.getElementById('pattern-polyline');
          if (polyline) polyline.setAttribute('stroke', '#10b981');
          setPatternFeedback('Giriş başarılı! Hoş geldiniz 🐾', 'success');

          currentUser = {
            ...DEFAULT_USER,
            ...res.user,
            isLoggedIn: true,
            hasPattern: true
          };
          localStorage.setItem('yp_current_user', JSON.stringify(currentUser));
          if (patternState.phone) {
            localStorage.setItem('yp_saved_phone', patternState.phone);
          }
          
          setTimeout(() => {
            closeAuthModal();
            updateUIAfterAuth();
            updatePawPointsUI();
            renderDashboardUI();
            showToast(res.message || "Giriş başarılı! YourPoodle'a hoş geldiniz 🐾");
            switchTab('home');
          }, 400);
        } else {
          const polyline = document.getElementById('pattern-polyline');
          if (polyline) polyline.setAttribute('stroke', '#ef4444');
          setPatternFeedback(res.error || 'Hatalı sembol! Tekrar deneyin.', 'error');
          if (navigator.vibrate) {
            try { navigator.vibrate([40, 60, 40]); } catch(e) {}
          }
          setTimeout(() => {
            patternState.isLocked = false;
            clearPatternBoardVisuals();
            setPatternFeedback('Kayıtlı sembolünüzü çizin');
          }, 800);
        }
      } catch(e) {
        setPatternFeedback('Bağlantı hatası oluştu.', 'error');
        patternState.isLocked = false;
      }
    }

    function showPatternView(mode = 'LOGIN', phone = '', displayName = '', avatar = '') {
      patternState.mode = mode;
      patternState.phone = phone || patternState.phone || localStorage.getItem('yp_saved_phone') || '';
      patternState.username = displayName || patternState.username || '';
      patternState.firstPattern = '';
      patternState.isLocked = false;

      const authModal = document.getElementById('auth-modal');
      if (authModal) authModal.classList.remove('hidden');

      const mainView = document.getElementById('auth-main-view');
      const patView = document.getElementById('auth-pattern-view');
      if (mainView) mainView.classList.add('hidden');
      if (patView) patView.classList.remove('hidden');

      const avatarCont = document.getElementById('pattern-avatar-container');
      const avatarImg = document.getElementById('pattern-avatar-img');
      if (avatar && avatarCont && avatarImg) {
        avatarImg.src = avatar;
        avatarCont.classList.remove('hidden');
      } else if (avatarCont) {
        avatarCont.classList.add('hidden');
      }

      updatePatternUI();
      clearPatternBoardVisuals();
      initPatternLockEvents();
    }

    function updatePatternUI() {
      const title = document.getElementById('pattern-title');
      const sub = document.getElementById('pattern-subtitle');
      const forgotBtn = document.getElementById('btn-forgot-pattern');

      if (patternState.mode === 'LOGIN') {
        if (title) title.innerText = 'Sembolünle Hızlı Giriş Yap 🐾';
        if (sub) sub.innerText = patternState.phone 
          ? `${patternState.phone} için kayıtlı güvenlik sembolünü çizerek anında bağlan.`
          : 'Kayıtlı güvenlik sembolünü çizerek anında bağlan.';
        setPatternFeedback('Kayıtlı sembolünüzü çizin');
        if (forgotBtn) forgotBtn.classList.remove('hidden');
      } else if (patternState.mode === 'SETUP_1') {
        if (title) title.innerText = 'Güvenlik Sembolünü Belirle 🔒';
        if (sub) sub.innerText = 'Sonraki girişlerinde SMS beklemeden tek hareketle girmek için en az 4 noktayı birleştir.';
        setPatternFeedback('En az 4 noktayı birleştirin');
        if (forgotBtn) forgotBtn.classList.add('hidden');
      } else if (patternState.mode === 'SETUP_2') {
        if (title) title.innerText = 'Sembolünü Doğrula 🔄';
        if (sub) sub.innerText = 'Lütfen az önce belirlediğin sembolü tekrar çiz.';
        setPatternFeedback('Aynı sembolü tekrar çiziniz');
        if (forgotBtn) forgotBtn.classList.add('hidden');
      } else if (patternState.mode === 'RESET_1') {
        if (title) title.innerText = 'Yeni Güvenlik Sembolünü Çiz ✏️';
        if (sub) sub.innerText = 'SMS onaylandı! Hesabınız için yeni güvenlik sembolünüzü belirleyin.';
        setPatternFeedback('En az 4 noktayı birleştirin');
        if (forgotBtn) forgotBtn.classList.add('hidden');
      } else if (patternState.mode === 'RESET_2') {
        if (title) title.innerText = 'Yeni Sembolü Doğrula 🔄';
        if (sub) sub.innerText = 'Lütfen yeni sembolünüzü tekrar çizerek onaylayın.';
        setPatternFeedback('Aynı sembolü tekrar çiziniz');
        if (forgotBtn) forgotBtn.classList.add('hidden');
      }
    }

    function switchToSmsOtpMode() {
      const mainView = document.getElementById('auth-main-view');
      const patView = document.getElementById('auth-pattern-view');
      if (mainView) mainView.classList.remove('hidden');
      if (patView) patView.classList.add('hidden');
      updateAuthModalUI();
    }

    function switchToPatternLoginMode() {
      const phoneInput = document.getElementById('auth-input-phone');
      let phone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      if (!phone) {
        phone = localStorage.getItem('yp_saved_phone') || '';
      }
      showPatternView('LOGIN', phone);
    }

    function openPatternSetupFromProfile() {
      const phone = (currentUser && currentUser.phone) ? currentUser.phone.replace(/\D/g, '') : (localStorage.getItem('yp_saved_phone') || '');
      if (!phone) {
        showToast('Lütfen önce cep telefonu numaranızı giriniz 🐾');
        openAuthModal('login');
        return;
      }
      showToast('Güvenlik sembolü çizim ekranı açılıyor... 🔒');
      showPatternView('SETUP_1', phone, currentUser.displayName || currentUser.username, currentUser.avatar);
    }

    async function startForgotPatternFlow() {
      const targetPhone = patternState.phone || localStorage.getItem('yp_saved_phone') || '';
      if (!targetPhone) {
        switchToSmsOtpMode();
        showToast('Lütfen telefon numaranızı girerek SMS kodu talep edin 📲');
        return;
      }

      showToast('Yeni sembol belirlemeniz için SMS onay kodu gönderiliyor... ⏳');
      switchToSmsOtpMode();

      authMode = 'reset_pattern';
      const phoneInput = document.getElementById('auth-input-phone');
      if (phoneInput) phoneInput.value = targetPhone;

      try {
        const res = await fetch('/api/live/auth/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: targetPhone, purpose: 'reset_pattern' })
        }).then(r => r.json());

        if (res.ok) {
          otpSent = true;
          pendingPhone = targetPhone;
          updateAuthModalUI();
          startOtpTimers(res.expires_in || 180, res.cooldown || 45);
          showToast('SMS ile gelen 4 haneli kodu giriniz 📲');
          const otpInput = document.getElementById('auth-input-otp');
          if (otpInput) {
            otpInput.value = '';
            setTimeout(() => otpInput.focus(), 200);
          }
        } else {
          showToast(res.error || 'Kod gönderilemedi.');
        }
      } catch(e) {
        showToast('Bağlantı hatası oluştu.');
      }
    }

    
    // ================= INSTAGRAM-STYLE IN-LINE TRANSLATION ENGINE =================
    const postTranslationCache = new Map();

    function getTranslationLinkText(isRevert = false, isAuto = false) {
      const cur = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'tr';
      const labels = {
        en: { see: 'See translation', orig: 'See original', auto: 'Auto-translated' },
        ja: { see: '翻訳を見る', orig: '原文を見る', auto: '自動翻訳済み' },
        es: { see: 'Ver traducción', orig: 'Ver original', auto: 'Traducido automáticamente' },
        fr: { see: 'Voir la traduction', orig: 'Voir l’original', auto: 'Traduit automatiquement' },
        de: { see: 'Übersetzung anzeigen', orig: 'Original anzeigen', auto: 'Automatisch übersetzt' },
        pt: { see: 'Ver tradução', orig: 'Ver original', auto: 'Traduzido automaticamente' },
        ko: { see: '번역 보기', orig: '원문 보기', auto: '자동 번역됨' },
        'zh-CN': { see: '查看翻译', orig: '查看原文', auto: '已自动翻译' },
        tr: { see: 'Çevirisine bak', orig: 'Orijinalini gör', auto: 'Otomatik çevrildi' }
      };
      const dict = labels[cur] || labels.en;
      if (isAuto) {
        return `🌐 ${dict.auto} · ${dict.orig}`;
      }
      return isRevert ? dict.orig : dict.see;
    }

    async function translateText(text, targetLang) {
      if (!text) return { text: '', src: 'auto' };
      const cacheKey = `${targetLang}:${text}`;
      if (postTranslationCache.has(cacheKey)) {
        return postTranslationCache.get(cacheKey);
      }
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Translation HTTP error');
        const data = await res.json();
        const translated = data[0].map(item => item[0]).join('');
        const srcLang = data[2] || 'auto';
        const result = { text: translated, src: srcLang };
        postTranslationCache.set(cacheKey, result);
        return result;
      } catch (err) {
        console.warn('Translate error:', err);
        throw err;
      }
    }

    let autoTranslateDebounceTimer = null;
    let isAutoTranslatingFeed = false;

    async function autoTranslateFeed(targetLang) {
      if (isAutoTranslatingFeed) return;
      if (!targetLang) {
        targetLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'tr';
      }

      // If user is browsing in Turkish, restore original texts
      if (targetLang === 'tr') {
        document.querySelectorAll('[id^="post-caption-"]').forEach(captionEl => {
          const postId = captionEl.id.replace('post-caption-', '');
          const original = decodeURIComponent(captionEl.getAttribute('data-original') || captionEl.innerText);
          captionEl.innerText = original;
          const btn = document.getElementById(`btn-trans-${postId}`);
          if (btn) {
            btn.setAttribute('data-translated', 'false');
            btn.removeAttribute('data-translated-lang');
            const span = btn.querySelector('.btn-trans-text');
            if (span) span.innerText = getTranslationLinkText(false, false);
          }
        });
        document.querySelectorAll('.comment-text').forEach(el => {
          const orig = decodeURIComponent(el.getAttribute('data-original') || el.innerText);
          el.innerText = orig;
        });
        return;
      }

      // Automatically translate all visible feed posts & comments to targetLang
      try {
        isAutoTranslatingFeed = true;
        const captionEls = Array.from(document.querySelectorAll('[id^="post-caption-"]'));

        for (const captionEl of captionEls) {
          const postId = captionEl.id.replace('post-caption-', '');
          const btn = document.getElementById(`btn-trans-${postId}`);
          const originalCaption = decodeURIComponent(captionEl.getAttribute('data-original') || captionEl.innerText);
          const commentEls = document.querySelectorAll(`#comments-list-${postId} .comment-text`);

          // If already translated to this exact language, skip
          if (btn && btn.getAttribute('data-translated') === 'true' && btn.getAttribute('data-translated-lang') === targetLang) {
            continue;
          }

          try {
            const captionPromise = originalCaption ? translateText(originalCaption, targetLang) : Promise.resolve(null);
            const commentPromises = Array.from(commentEls).map(async el => {
              const orig = decodeURIComponent(el.getAttribute('data-original') || el.innerText);
              if (!orig || !orig.trim()) return;
              try {
                const res = await translateText(orig, targetLang);
                if (res && res.text) el.innerText = res.text;
              } catch (_) {}
            });

            const [captionRes] = await Promise.all([captionPromise, ...commentPromises]);
            if (captionRes && captionRes.text) {
              captionEl.innerText = captionRes.text;
            }

            if (btn) {
              btn.setAttribute('data-translated', 'true');
              btn.setAttribute('data-translated-lang', targetLang);
              const span = btn.querySelector('.btn-trans-text');
              if (span) span.innerText = getTranslationLinkText(true, true);
            }
          } catch (err) {
            console.warn('Auto translate feed post error:', err);
          }
        }
      } finally {
        isAutoTranslatingFeed = false;
      }
    }

    async function togglePostTranslation(postId, e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const captionEl = document.getElementById(`post-caption-${postId}`);
      const btn = document.getElementById(`btn-trans-${postId}`);
      const loading = document.getElementById(`trans-loading-${postId}`);
      const commentEls = document.querySelectorAll(`#comments-list-${postId} .comment-text`);
      if (!captionEl || !btn) return;

      const isTranslated = btn.getAttribute('data-translated') === 'true';
      const originalCaption = decodeURIComponent(captionEl.getAttribute('data-original') || captionEl.innerText);

      if (isTranslated) {
        // Revert to original
        captionEl.innerText = originalCaption;
        commentEls.forEach(el => {
          const orig = decodeURIComponent(el.getAttribute('data-original') || el.innerText);
          el.innerText = orig;
        });
        btn.setAttribute('data-translated', 'false');
        btn.removeAttribute('data-translated-lang');
        const span = btn.querySelector('.btn-trans-text');
        if (span) span.innerText = getTranslationLinkText(false, false);
        return;
      }

      // User requested manual translation
      const targetLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'ja';
      if (loading) loading.classList.remove('hidden');
      btn.classList.add('opacity-50');

      try {
        const captionPromise = originalCaption ? translateText(originalCaption, targetLang) : Promise.resolve(null);
        const commentPromises = Array.from(commentEls).map(async el => {
          const orig = decodeURIComponent(el.getAttribute('data-original') || el.innerText);
          if (!orig || !orig.trim()) return;
          try {
            const res = await translateText(orig, targetLang);
            if (res && res.text) el.innerText = res.text;
          } catch (_) {}
        });

        const [captionRes] = await Promise.all([captionPromise, ...commentPromises]);
        if (captionRes && captionRes.text) {
          captionEl.innerText = captionRes.text;
        }

        btn.setAttribute('data-translated', 'true');
        btn.setAttribute('data-translated-lang', targetLang);
        const span = btn.querySelector('.btn-trans-text');
        if (span) span.innerText = getTranslationLinkText(true, false);
      } catch (err) {
        if (typeof showToast === 'function') {
          showToast('Çeviri şu an yapılamadı.');
        }
      } finally {
        if (loading) loading.classList.add('hidden');
        btn.classList.remove('opacity-50');
      }
    }

    async function toggleTopicDetailTranslation(e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const contentEl = document.getElementById('topic-modal-content');
      const btn = document.getElementById('btn-trans-topic-detail');
      const loading = document.getElementById('topic-detail-trans-loading');
      const labelEl = document.getElementById('topic-detail-trans-text');
      if (!contentEl || !btn) return;

      const isTranslated = btn.getAttribute('data-translated') === 'true';
      const originalText = decodeURIComponent(contentEl.getAttribute('data-original') || contentEl.innerText);

      if (isTranslated) {
        contentEl.innerText = originalText;
        btn.setAttribute('data-translated', 'false');
        if (labelEl) labelEl.innerText = getTranslationLinkText(false);
        return;
      }

      const targetLang = window.ypI18n ? window.ypI18n.getCurrentLanguage() : 'en';
      if (loading) loading.classList.remove('hidden');
      btn.classList.add('opacity-50');

      try {
        const res = await translateText(originalText, targetLang);
        contentEl.innerText = res.text;
        btn.setAttribute('data-translated', 'true');
        if (labelEl) labelEl.innerText = getTranslationLinkText(true);
      } catch (err) {
        if (typeof showToast === 'function') {
          showToast('Çeviri şu an yapılamadı.');
        }
      } finally {
        if (loading) loading.classList.add('hidden');
        btn.classList.remove('opacity-50');
      }
    }

    window.getTranslationLinkText = getTranslationLinkText;
    window.translateText = translateText;
    window.togglePostTranslation = togglePostTranslation;
    window.toggleTopicDetailTranslation = toggleTopicDetailTranslation;

    // Multi-Language Reactivity Hook
    window.onLanguageChange = function(newLang) {
      console.log('Language changed to:', newLang);
      if (typeof renderPosts === 'function') {
        renderPosts();
      }
      if (newLang !== 'tr') {
        setTimeout(() => {
          if (typeof autoTranslateFeed === 'function') autoTranslateFeed(newLang);
          if (typeof autoTranslateDmChat === 'function') autoTranslateDmChat(newLang);
        }, 150);
      } else {
        if (typeof autoTranslateFeed === 'function') autoTranslateFeed('tr');
        if (typeof autoTranslateDmChat === 'function') autoTranslateDmChat('tr');
      }
      document.querySelectorAll('[id^="btn-trans-"]').forEach(btn => {
        const isTrans = btn.getAttribute('data-translated') === 'true';
        const span = btn.querySelector('.btn-trans-text');
        if (span && typeof getTranslationLinkText === 'function') {
          span.innerText = getTranslationLinkText(isTrans, false);
        }
      });
      const topicLbl = document.getElementById('topic-detail-trans-text');
      if (topicLbl && typeof getTranslationLinkText === 'function') {
        const isTrans = document.getElementById('btn-trans-topic-detail')?.getAttribute('data-translated') === 'true';
        topicLbl.innerText = getTranslationLinkText(isTrans, false);
      }
      if (typeof renderDashboardUI === 'function') {
        renderDashboardUI();
      }
      if (typeof filterCommunityTopics === 'function') {
        filterCommunityTopics();
      } else if (typeof renderCommunityTopics === 'function' && typeof communityTopicsData !== 'undefined') {
        renderCommunityTopics(communityTopicsData);
      }
      if (window.ypI18n && typeof window.ypI18n.applyDomTranslations === 'function') {
        window.ypI18n.applyDomTranslations();
      }
    };

    // Safe DOM Readiness bootstrap
    function bootstrapYourPoodleApp() {
      if (window.__ypAppBootstrapped) return;
      window.__ypAppBootstrapped = true;
      if (typeof updateUIAfterAuth === 'function') updateUIAfterAuth();
      if (typeof updatePawPointsUI === 'function') updatePawPointsUI();
      if (typeof renderDashboardUI === 'function') renderDashboardUI();
      if (typeof renderStories === 'function') renderStories();
      if (typeof renderPosts === 'function') renderPosts();
      if (typeof renderSuggestions === 'function') renderSuggestions();
      if (typeof fetchPostsFromAPI === 'function') fetchPostsFromAPI();
      if (typeof fetchNotificationsFromAPI === 'function') fetchNotificationsFromAPI();
      if (typeof checkNotificationPermission === 'function') checkNotificationPermission();
      if (typeof updatePushBadgeStatus === 'function') updatePushBadgeStatus();
      if (typeof initChatWebSocket === 'function') initChatWebSocket();
      if (typeof loadCommunityTopics === 'function') loadCommunityTopics();
      if (typeof checkVerificationStatus === 'function') checkVerificationStatus();
      if (typeof loadLiveStories === 'function') loadLiveStories();
      if (typeof checkCollarTagUrl === 'function') checkCollarTagUrl();
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', bootstrapYourPoodleApp);
    } else {
      bootstrapYourPoodleApp();
    }


    /* ========================================================
       INFO PAGES & LEGAL HUB LOGIC (HAKKINDA, YARDIM, BASIN, API, GİZLİLİK, KOŞULLAR, KONUMLAR, DİL)
       ======================================================== */
    const infoPageTitles = {
      about: 'Hakkında • YourPoodle',
      help: 'Yardım Merkezi & SSS • YourPoodle',
      press: 'Basın & Medya Kiti • YourPoodle',
      api: 'Geliştirici API • YourPoodle',
      privacy: 'Gizlilik Politikası (KVKK/GDPR) • YourPoodle',
      terms: 'Kullanım Koşulları • YourPoodle',
      locations: 'Poodle Dostu Konumlar & Parklar • YourPoodle',
      language: 'Dil Seçenekleri • YourPoodle'
    };

    window.openInfoModal = function(tabName = 'about') {
      const modal = document.getElementById('yp-info-modal');
      if (!modal) return;
      modal.classList.remove('hidden');
      switchInfoTab(tabName);
    };

    window.closeInfoModal = function() {
      const modal = document.getElementById('yp-info-modal');
      if (modal) modal.classList.add('hidden');
    };

    window.switchInfoTab = function(tabName) {
      const validTabs = ['about', 'help', 'press', 'api', 'privacy', 'terms', 'locations', 'language'];
      if (!validTabs.includes(tabName)) tabName = 'about';

      // Update Tab Buttons UI
      validTabs.forEach(t => {
        const btn = document.getElementById('info-tab-' + t);
        const panel = document.getElementById('info-panel-' + t);
        if (btn) {
          if (t === tabName) {
            btn.className = 'info-nav-btn w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center gap-3 transition shrink-0 bg-gray-200 dark:bg-[#252525] text-black dark:text-white shadow-xs';
          } else {
            btn.className = 'info-nav-btn w-full px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-center gap-3 transition shrink-0 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]';
          }
        }
        if (panel) {
          panel.classList.toggle('hidden', t !== tabName);
        }
      });

      // Update external link
      const extLink = document.getElementById('info-modal-external-link');
      if (extLink) {
        extLink.href = '/' + (tabName === 'language' ? 'about.html' : tabName + '.html');
      }

      // Update breadcrumb
      const breadcrumb = document.getElementById('info-modal-breadcrumbs');
      if (breadcrumb && infoPageTitles[tabName]) {
        breadcrumb.innerText = infoPageTitles[tabName];
      }

      // Scroll panel to top
      const contentContainer = document.querySelector('#info-panel-' + tabName)?.parentElement;
      if (contentContainer) contentContainer.scrollTop = 0;
    };

    window.toggleFaq = function(faqId) {
      const el = document.getElementById(faqId);
      const icon = document.getElementById(faqId + '-icon');
      if (!el) return;
      const isHidden = el.classList.contains('hidden');
      el.classList.toggle('hidden', !isHidden);
      if (icon) {
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    };

    window.filterInfoLocations = function(city) {
      const cards = document.querySelectorAll('.loc-card');
      const btns = document.querySelectorAll('.loc-filter-btn');
      
      btns.forEach(b => {
        const isActive = b.getAttribute('data-city') === city;
        if (isActive) {
          b.className = 'loc-filter-btn px-3 py-1.5 rounded-full text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-black transition';
        } else {
          b.className = 'loc-filter-btn px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-[#202020] text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition';
        }
      });

      cards.forEach(card => {
        if (city === 'all' || card.getAttribute('data-city') === city) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    };

    window.generateDemoApiKey = function() {
      const randomKey = 'yp_live_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
      const output = document.getElementById('demo-api-key-output');
      if (output) {
        output.innerText = 'Key: ' + randomKey;
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(randomKey);
        showToast('API Anahtarı kopyalandı: ' + randomKey);
      } else {
        showToast('API Anahtarı oluşturuldu!');
      }
    };

    window.submitSupportForm = function(e) {
      e.preventDefault();
      const name = document.getElementById('support-name')?.value || '';
      const email = document.getElementById('support-email')?.value || '';
      showToast('Teşekkürler ' + name + '! Destek talebiniz destek@yourpoodle.com\'a iletildi.');
      document.getElementById('support-message').value = '';
    };

    // Listen to hash / URL for direct links e.g. #about, #privacy
    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validTabs = ['about', 'help', 'press', 'api', 'privacy', 'terms', 'locations', 'language'];
      if (validTabs.includes(hash)) {
        setTimeout(() => openInfoModal(hash), 300);
      }
    });

    // Also close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeInfoModal();
      }
    });


    /* ========================================================
       STORIES TRAY HORIZONTAL SCROLL & DRAG SYSTEM (DESKTOP & MOBILE)
       ======================================================== */
    window.isDraggingStories = false;

    window.scrollStoriesTray = function(direction) {
      const container = document.getElementById('stories-scroll-container');
      if (!container) return;
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateStoriesScrollButtons, 350);
    };

    window.updateStoriesScrollButtons = function() {
      const container = document.getElementById('stories-scroll-container');
      const prevBtn = document.getElementById('stories-scroll-prev');
      const nextBtn = document.getElementById('stories-scroll-next');
      if (!container || !prevBtn || !nextBtn) return;

      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (scrollLeft > 10) {
        prevBtn.classList.remove('hidden');
        prevBtn.classList.add('flex');
      } else {
        prevBtn.classList.add('hidden');
        prevBtn.classList.remove('flex');
      }

      if (scrollLeft < maxScroll - 10) {
        nextBtn.classList.remove('hidden');
        nextBtn.classList.add('flex');
      } else {
        nextBtn.classList.add('hidden');
        nextBtn.classList.remove('flex');
      }
    };

    window.initStoriesScroll = function() {
      const container = document.getElementById('stories-scroll-container');
      if (!container || container._scrollInitDone) return;
      container._scrollInitDone = true;

      // 1. Scroll listener
      container.addEventListener('scroll', updateStoriesScrollButtons, { passive: true });

      // 2. Mouse Wheel listener (converts vertical wheel to smooth horizontal scroll)
      container.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > 0) {
          e.preventDefault();
          container.scrollLeft += e.deltaY * 1.3;
          updateStoriesScrollButtons();
        }
      }, { passive: false });

      // 3. Mouse Click & Drag to Scroll (Grab / Grabbing)
      let isDown = false;
      let startX = 0;
      let scrollLeftPos = 0;
      let dragDistance = 0;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        window.isDraggingStories = false;
        dragDistance = 0;
        startX = e.pageX - container.offsetLeft;
        scrollLeftPos = container.scrollLeft;
        container.style.cursor = 'grabbing';
      });

      window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        if (container) container.style.cursor = 'grab';
        setTimeout(() => { window.isDraggingStories = false; }, 60);
        updateStoriesScrollButtons();
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        dragDistance = Math.abs(walk);
        if (dragDistance > 6) {
          window.isDraggingStories = true;
        }
        container.scrollLeft = scrollLeftPos - walk;
        updateStoriesScrollButtons();
      });

      // Also attach wheel listener to feed chips
      const chips = document.getElementById('feed-chips-container');
      if (chips && !chips._wheelAttached) {
        chips._wheelAttached = true;
        chips.addEventListener('wheel', (e) => {
          if (Math.abs(e.deltaY) > 0) {
            e.preventDefault();
            chips.scrollLeft += e.deltaY * 1.3;
          }
        }, { passive: false });
      }

      // Initial button update
      setTimeout(updateStoriesScrollButtons, 150);
    };

    window.addEventListener('resize', updateStoriesScrollButtons);
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initStoriesScroll, 100);
    });
