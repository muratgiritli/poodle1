/**
 * YourPoodle Client-Side Moderation Shield
 * Instant Profanity, Slur, Illegal Pet Sale & Spam Filter
 */
(function() {
  const PROFANITY_ROOTS = [
    'amk', 'aq', 'a.m.k', 'a.q', 'orospu', 'o.ç', 'piç', 'p.i.ç', 'sik', 'sık', 'sikerim',
    'sikiş', 'siktir', 'sktir', 'göt', 'götveren', 'yarak', 'yarrak', 'daşşak', 'taşşak',
    'kahpe', 'pezevenk', 'puşt', 'ibne', 'gavat', 'kavat', 'fahişe', 'ananı', 'bacını',
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'bastard', 'nigger', 'nigga', 'whore', 'slut'
  ];

  const ILLEGAL_SALE_ROOTS = [
    'satılık poodle', 'satılık köpek', 'satılık yavru', 'satılık toy', 'poodle satış',
    'poodle fiyat', 'yavru fiyat', 'fiyatı kaç tl', 'ücretli sahiplendirme', 'satılıktır',
    'ucuz poodle', 'safkan satılık', 'petshop satış', 'köpek dövüşü', 'dövüştürme'
  ];

  const SPAM_PATTERNS = [
    /\b(bahis|casino|kumar|canlı bahis|bonus kazan|kripto kazan)\b/i,
    /t\.me\/[a-zA-Z0-9_+]+/i,
    /wa\.me\/[0-9]+/i,
    /05\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}/
  ];

  function normalize(str) {
    if (!str) return '';
    let s = str.toLowerCase();
    s = s.replace(/1/g, 'i').replace(/!/g, 'i').replace(/0/g, 'o').replace(/3/g, 'e').replace(/@/g, 'a').replace(/\$/g, 's');
    s = s.replace(/(.)\1{2,}/g, '$1$1');
    return s;
  }

  const YpModeration = {
    validate(text, context = 'İçerik') {
      if (!text || !text.trim()) {
        return { ok: true, status: 'APPROVED' };
      }

      const norm = normalize(text);

      // 1. Profanity Check
      for (const word of PROFANITY_ROOTS) {
        const regex = new RegExp(`(^|\\s|[.,;!?'"\\-])${word.replace('.', '\\.')}($|\\s|[.,;!?'"\\-])`, 'i');
        if (regex.test(norm) || norm.includes(word)) {
          return {
            ok: false,
            status: 'BLOCKED',
            reason: 'PROFANITY',
            message: `⚠️ Topluluk Kuralları: ${context} argo, küfür veya hakaret ifadeleri içeremez. Lütfen temiz bir dil kullanın.`
          };
        }
      }

      // 2. Illegal Pet Sale Check
      for (const sale of ILLEGAL_SALE_ROOTS) {
        if (norm.includes(sale)) {
          return {
            ok: false,
            status: 'BLOCKED',
            reason: 'ILLEGAL_SALE',
            message: `⚠️ Yasal Uyarı: YourPoodle'da evcil hayvan satışı veya kaçak üretim teklifleri kesinlikle yasaktır.`
          };
        }
      }

      // 3. Spam Check
      for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(text) || pattern.test(norm)) {
          return {
            ok: false,
            status: 'FLAGGED',
            reason: 'SPAM',
            message: `⚠️ Güvenlik Uyarısı: ${context} harici spam bağlantı veya telefon numarası içeremez.`
          };
        }
      }

      return { ok: true, status: 'APPROVED' };
    },

    attachInputWatcher(inputId, contextName = 'Girdi') {
      const el = document.getElementById(inputId);
      if (!el || el._moderationWatcherAttached) return;
      el._moderationWatcherAttached = true;

      el.addEventListener('blur', () => {
        const res = this.validate(el.value, contextName);
        if (!res.ok) {
          el.classList.add('border-rose-500', 'bg-rose-50/50', 'dark:bg-rose-950/20');
          if (typeof showToast === 'function') {
            showToast(res.message);
          }
        } else {
          el.classList.remove('border-rose-500', 'bg-rose-50/50', 'dark:bg-rose-950/20');
        }
      });
    }
  };

  window.ypModeration = YpModeration;
})();
