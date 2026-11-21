/**
 * YourPoodle Web Push Manager (VAPID / FCM / APNs)
 * Comprehensive Background Lock-Screen Push Notification Engine
 */
class YpPushManager {
  constructor() {
    this.isSupported = ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window);
    this.swRegistration = null;
    this.isSubscribed = false;
    this.vapidPublicKey = null;
    this.subscription = null;
  }

  async init() {
    if (!this.isSupported) {
      console.warn('[PushManager] Web Push is not supported in this browser.');
      this.updateUIState();
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[PushManager] Service Worker registered with scope:', this.swRegistration.scope);

      // Check if user is already subscribed
      this.subscription = await this.swRegistration.pushManager.getSubscription();
      this.isSubscribed = !(this.subscription === null);

      if (this.isSubscribed) {
        console.log('[PushManager] User is already subscribed to Web Push');
        this.syncWithBackend();
      }

      this.updateUIState();
    } catch (err) {
      console.error('[PushManager] Initialization error:', err);
    }
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async fetchVapidKey() {
    if (this.vapidPublicKey) return this.vapidPublicKey;
    const res = await fetch('/api/live/push/vapid-public-key');
    const data = await res.json();
    if (data.status === 'success' && data.publicKey) {
      this.vapidPublicKey = data.publicKey;
      return this.vapidPublicKey;
    }
    throw new Error('VAPID key could not be retrieved from server');
  }

  async requestPermissionAndSubscribe() {
    if (!this.isSupported) {
      if (typeof showToast === 'function') showToast('Tarayıcınız Web Push bildirimlerini desteklemiyor.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        if (typeof showToast === 'function') showToast('Bildirim izni verilmedi. Tarayıcı adres çubuğundaki kilit simgesinden açabilirsiniz.');
        this.updateUIState();
        return false;
      }

      if (typeof showToast === 'function') showToast('Kilit ekranı bildirimleri bağlanıyor...');
      const publicKey = await this.fetchVapidKey();
      const applicationServerKey = this.urlB64ToUint8Array(publicKey);

      this.subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      this.isSubscribed = true;
      await this.syncWithBackend();

      if (typeof showToast === 'function') showToast('🔔 Kilit ekranı bildirimleri başarıyla bağlandı!');
      this.updateUIState();
      return true;
    } catch (err) {
      console.error('[PushManager] Subscription error:', err);
      if (typeof showToast === 'function') showToast('Bildirim kaydı oluşturulurken hata: ' + err.message);
      return false;
    }
  }

  async syncWithBackend() {
    if (!this.subscription) return;
    try {
      const username = (window.currentUser && window.currentUser.username) ? window.currentUser.username : 'guest';
      await fetch('/api/live/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: this.subscription.toJSON(),
          username: username,
          deviceInfo: navigator.userAgent
        })
      });
      console.log('[PushManager] Successfully synced subscription with backend');
    } catch (e) {
      console.error('[PushManager] Failed to sync with backend:', e);
    }
  }

  async unsubscribe() {
    if (!this.subscription) return;
    try {
      const endpoint = this.subscription.endpoint;
      await this.subscription.unsubscribe();
      this.subscription = null;
      this.isSubscribed = false;

      await fetch('/api/live/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: endpoint })
      });

      if (typeof showToast === 'function') showToast('Web Push bildirimleri kapatıldı.');
      this.updateUIState();
    } catch (err) {
      console.error('[PushManager] Unsubscribe error:', err);
    }
  }

  async sendTestPush() {
    if (!this.isSubscribed) {
      if (typeof showToast === 'function') showToast('Lütfen önce bildirimleri aktifleştirin!');
      return;
    }

    try {
      if (typeof showToast === 'function') showToast('Test bildirimi kilit ekranınıza gönderiliyor...');
      const endpoint = this.subscription ? this.subscription.endpoint : null;
      const username = (window.currentUser && window.currentUser.username) ? window.currentUser.username : 'guest';

      const res = await fetch('/api/live/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: endpoint, username: username })
      });
      const data = await res.json();
      if (data.status === 'success') {
        if (typeof showToast === 'function') showToast('✅ Test bildirimi gönderildi! Kilit ekranınızı kontrol edin.');
      } else {
        if (typeof showToast === 'function') showToast('Uyarı: ' + (data.message || 'Gönderilemedi'));
      }
    } catch (err) {
      console.error('[PushManager] Test push error:', err);
      if (typeof showToast === 'function') showToast('Test bildirimi gönderilirken hata oluştu.');
    }
  }

  async triggerVaccineAlert() {
    try {
      if (typeof showToast === 'function') showToast('Aşı hatırlatması gönderiliyor...');
      const res = await fetch('/api/live/push/trigger-vaccine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogName: (window.currentUser && window.currentUser.displayName) || 'Mochi',
          vaccineName: 'İç / Dış Parazit Damlası',
          daysLeft: 3
        })
      });
      const data = await res.json();
      if (typeof showToast === 'function') showToast('💉 Aşı hatırlatması bildirimi kilit ekranına iletildi!');
    } catch (e) {
      if (typeof showToast === 'function') showToast('Hata: ' + e.message);
    }
  }

  async triggerDmAlert() {
    try {
      if (typeof showToast === 'function') showToast('Yeni DM bildirimi gönderiliyor...');
      const res = await fetch('/api/live/push/trigger-dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Luna Parisienne 🐩',
          message: 'Merhaba! Yarın Bebek parkında buluşuyor muyuz? 🐾'
        })
      });
      const data = await res.json();
      if (typeof showToast === 'function') showToast('💬 Yeni DM bildirimi kilit ekranına iletildi!');
    } catch (e) {
      if (typeof showToast === 'function') showToast('Hata: ' + e.message);
    }
  }

  updateUIState() {
    const isGranted = (window.Notification && Notification.permission === 'granted') && this.isSubscribed;
    
    const statusBadges = document.querySelectorAll('.push-status-badge');
    statusBadges.forEach(b => {
      if (isGranted) {
        b.className = 'push-status-badge px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        b.innerText = 'Aktif (Kilit Ekranı Bağlı)';
      } else {
        b.className = 'push-status-badge px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        b.innerText = 'Kapalı';
      }
    });

    const toggleBtns = document.querySelectorAll('.push-toggle-btn');
    toggleBtns.forEach(btn => {
      if (isGranted) {
        btn.innerText = 'Bildirimleri Kapat';
        btn.onclick = () => this.unsubscribe();
        btn.className = 'push-toggle-btn px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer';
      } else {
        btn.innerText = 'Kilit Ekranı Bildirimlerini Aç 🔔';
        btn.onclick = () => this.requestPermissionAndSubscribe();
        btn.className = 'push-toggle-btn px-4 py-2 rounded-xl text-xs font-bold bg-[#0095f6] hover:bg-[#1877f2] text-white transition cursor-pointer shadow-xs';
      }
    });

    const testBtns = document.querySelectorAll('.push-test-btn');
    testBtns.forEach(btn => {
      btn.style.display = isGranted ? 'inline-flex' : 'none';
    });

    const banner = document.getElementById('push-permission-banner');
    if (banner) {
      banner.style.display = isGranted ? 'none' : 'flex';
    }
  }
}

window.ypPush = new YpPushManager();

// Automatically init when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.ypPush.init());
} else {
  window.ypPush.init();
}
