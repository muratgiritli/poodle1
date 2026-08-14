# JETGO - Hızlı Sipariş

## Overview
JETGO is a pet shop quick ordering application built with React/TypeScript, designed to streamline the pet product purchasing process. It allows customers to browse products, manage their cart, and place orders efficiently. The platform includes a dynamic admin panel for product management and an AI-powered pet care Q&A chatbot. The business vision is to provide an accessible and user-friendly platform for pet owners, offering convenience, personalized services, and efficient delivery options, capitalizing on the growing pet care market. Key capabilities include loyalty programs, pet care tools, campaign systems, delivery management, and robust SEO features.

## User Preferences
I prefer iterative development with clear communication on significant changes. Please ask before making major architectural modifications or adding new external dependencies. For code, I appreciate clean, maintainable TypeScript with a focus on functional components where appropriate. When explaining concepts, use straightforward language, avoiding overly technical jargon.

**Language:** Always respond in Turkish.

## System Architecture
The application employs a modern web architecture:
- **Frontend**: React and TypeScript, utilizing `shadcn/ui`, Tailwind CSS, and `framer-motion` for animations, providing a clean, modern, and responsive design.
- **Backend**: Express-based API with session-based authentication, trusted device support, and multi-layer rate limiting for security.
- **Database**: PostgreSQL with Drizzle ORM for all application data, including products, orders, customer profiles, loyalty points, and delivery configurations. Product images are stored as base64 in PostgreSQL.
- **Key Features**:
    - **Loyalty Program**: "Para Puan" system awarding 5% loyalty points on purchases.
    - **Pet Care Tools**: "Akıllı Mama Hesaplama" for food needs and reorder reminders.
    - **Campaign System**: Dedicated campaign page for product bundles and "frequently bought together" extras.
    - **Delivery Management**: Configurable pricing and selectable time slots.
    - **SEO**: Comprehensive Local SEO including custom metadata, sitemaps, robots.txt, structured data (Schema.org), programmatic page generation, and keyword-optimized content across numerous location and product-based landing pages. Includes a pet care blog and detailed store/location pages.
    - **Product Management**: Low stock alerts, DB-backed product review system, and a full CRUD coupon system.
    - **User Experience**: Signup bonuses, integrated checkout coupon UI, social share options, and a comprehensive user panel for order and profile management.
    - **Admin Panel**: Extensive management features including a Dashboard with real-time stats, product/order/campaign/coupon/customer management, bulk SMS, banner CRUD, detailed reporting, inventory counting (Stok Sayım), Blacklist feature, and settings for loyalty and pet feeding.
    - **Order Enhancements**: SKU validation, Askıda Mama donation option, one-click reorder, voice ordering (WhatsApp-based), pre-order system with stock management, and real-time order notifications (browser sound + SMS).
    - **Payment Gateway Integration**: Multiple payment options including Kapıda Nakit, Kapıda Kredi Kartı (POS), Kapıda QR, Banka Havalesi/EFT, and Online Kredi Kartı via iyzico CheckoutForm and Tosla (İşim Sanal POS).
    - **Gamification & Community**: Virtual pet feeding, pet photo contests, multi-pet dashboard for health records, and a lost/found/adoption board.
    - **Security**: Comprehensive security headers, input validation with Zod schemas, and configurable per-endpoint rate limits.
    - **Analytics**: GA4 E-commerce events for `view_item`, `add_to_cart`, `begin_checkout`, and `purchase`.
    - **Social Proof**: Real-time anonymized recent order toasts for FOMO effect.

## Admin Şifre Kurtarma

Admin paneline erişim kaybedildiğinde üç kurtarma yöntemi vardır:

### Yöntem 1 — ADMIN_BOOTSTRAP_PASSWORD değiştirme (Önerilen)
Sunucu, her başlangıçta `ADMIN_BOOTSTRAP_PASSWORD` değerini kayıtlı hash ile karşılaştırır.
Eğer farklıysa, `admin` kullanıcısının şifresini otomatik olarak günceller.

1. Replit Secrets'ta `ADMIN_BOOTSTRAP_PASSWORD` değerini yeni, güçlü bir şifreyle güncelleyin (min 12 karakter).
2. Sunucuyu yeniden başlatın.
3. Yeni şifreyle giriş yapın.

### Yöntem 2 — Süper admin, başka bir kullanıcının şifresini sıfırlama
Giriş yapabiliyorsanız (örn. başka bir süper admin hesabıyla):
```
POST /api/admin/staff/:id/force-reset-password
Body: { "newPassword": "YeniGüçlüŞifre123!" }
```
Hedef kullanıcı bir sonraki girişte şifresini değiştirmek zorunda kalır (`must_change_password = true`).

### Yöntem 3 — Veritabanı üzerinden manuel güncelleme
Doğrudan PostgreSQL erişiminiz varsa:
```sql
-- Yeni şifre hash'i oluşturun (Node.js):
-- const bcrypt = require('bcryptjs'); bcrypt.hash('YeniŞifre123!', 10).then(console.log)
-- Ardından:
UPDATE users
SET password = '<bcrypt_hash>',
    must_change_password = false
WHERE username = 'admin';
```

## External Dependencies
- **OpenAI**: AI-powered pet care Q&A chatbot.
- **NetGSM**: SMS OTPs for customer authentication and admin order notifications.
- **PostgreSQL**: Primary database.
- **Drizzle ORM**: Database interaction layer.
- **WhatsApp API**: For submitting customer orders and voice ordering.
- **iyzico**: Online credit card payment gateway.
- **Tosla (Aktif Bank / AKÖDE)**: Online credit card payment gateway.