import React from 'react';

export function KartHero() {
  return (
    <div style={{ width: '390px', margin: '0 auto', backgroundColor: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* HERO KARTI */}
      <div style={{ padding: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg,#F0EAFF,#EAE0FF,#E8DFFF)',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          minHeight: '330px'
        }}>
          {/* SOL kısım */}
          <div style={{ flex: '0 0 54%', padding: '22px 8px 22px 20px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '14px', color: '#1a1040', fontWeight: 600, marginBottom: '6px' }}>
              Toy Poodle'ınız için
            </div>
            <div style={{ fontSize: '36px', color: '#6B21A8', fontWeight: 900, lineHeight: 1.05, whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
              Her Şey
            </div>
            <div style={{ fontSize: '36px', color: '#6B21A8', fontWeight: 900, lineHeight: 1.05, whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
              Tek Yerde <span style={{ color: '#F9A8D4', fontSize: '26px', verticalAlign: 'middle' }}>♡</span>
            </div>
            
            <div style={{ fontSize: '11px', color: '#666', marginTop: '10px', marginBottom: '14px', lineHeight: 1.6, paddingRight: '10px' }}>
              Poodle'ınıza özel beslenme rehberleri, eğitim ipuçları ve seçilmiş ürünlerle onun hayatına değer katın.
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', paddingRight: '10px' }}>
              <button style={{
                height: '40px',
                borderRadius: '999px',
                background: '#7C3AED',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: '100%'
              }}>
                🐾 Mama Bul
              </button>
              <button style={{
                height: '40px',
                borderRadius: '999px',
                border: '1.5px solid #C4B5FD',
                background: '#fff',
                color: '#7C3AED',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                width: '100%'
              }}>
                📖 Rehberleri Gör
              </button>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/__mockup/images/poodle-avatar-1.jpg" style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #F0EAFF', objectFit: 'cover' }} alt="Avatar 1" />
                <img src="/__mockup/images/poodle-avatar-2.jpg" style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #F0EAFF', objectFit: 'cover', marginLeft: '-8px' }} alt="Avatar 2" />
                <img src="/__mockup/images/poodle-avatar-3.jpg" style={{ width: '26px', height: '26px', borderRadius: '50%', border: '2px solid #F0EAFF', objectFit: 'cover', marginLeft: '-8px' }} alt="Avatar 3" />
                <div style={{ marginLeft: '6px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', gap: '2px', color: '#EAB308', fontSize: '10px', marginBottom: '1px' }}>
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '9px', marginTop: '4px', lineHeight: 1.3 }}>
                <span style={{ fontWeight: 700, color: '#1a1040' }}>50.000+ Poodle sever</span>
                <span style={{ color: '#666' }}> tarafından güveniliyor</span>
              </div>
            </div>
          </div>
          
          {/* SAĞ kısım */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', overflow: 'hidden' }}>
            {/* Background gradient fade so text is legible if it overlaps, but design implies side-by-side */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '30px', background: 'linear-gradient(to right, #EBE1FF, transparent)', zIndex: 1 }}></div>
            <img 
              src="/__mockup/images/poodle-hero_2.jpg" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} 
              alt="Poodle Hero" 
            />
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '8px',
              background: '#fff',
              borderRadius: '12px',
              padding: '8px 10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
              maxWidth: '130px',
              fontSize: '10px',
              color: '#222',
              lineHeight: 1.5,
              zIndex: 2
            }}>
              "Yeni mamasına bayıldı, tüyleri daha parlak!" 🐾
            </div>
          </div>
        </div>
      </div>

      {/* ÜYELİK BANNER */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{
          background: '#7C3AED',
          borderRadius: '18px',
          padding: '16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 12px rgba(124,58,237,0.2)'
        }}>
          <div style={{ fontSize: '36px', lineHeight: 1 }}>🎁</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>
              🎉 Yeni Üye Ol, 100 TL Bonus Kazan!
            </div>
            <div style={{ color: '#fff', fontSize: '11px', opacity: 0.85, lineHeight: 1.4 }}>
              Üye olarak tüm avantajlardan hemen yararlanmaya başla.
            </div>
          </div>
          <button style={{
            background: '#fff',
            color: '#7C3AED',
            borderRadius: '999px',
            height: '38px',
            padding: '0 14px',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Üye Ol →
          </button>
        </div>
      </div>

      {/* ARAÇ GRİDİ */}
      <div style={{ padding: '20px 16px 0', paddingBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1040', marginBottom: '12px', margin: 0 }}>Araçlar</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '10px' 
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#fff',
            border: '1px solid #EDE9FE',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '24px', lineHeight: 1 }}>🍽️</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1040', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Mama Bul <span style={{ color: '#7C3AED', fontSize: '14px', fontWeight: 400 }}>→</span>
              </div>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>Poodle'ınıza en uygun mamayı bulun.</div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#fff',
            border: '1px solid #EDE9FE',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '24px', lineHeight: 1 }}>📖</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1040', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Rehberler <span style={{ color: '#7C3AED', fontSize: '14px', fontWeight: 400 }}>→</span>
              </div>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>Eğitim ve sağlık hakkında her şey.</div>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#fff',
            border: '1px solid #EDE9FE',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '24px', lineHeight: 1 }}>🤖</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1040', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                AI Asistan <span style={{ color: '#7C3AED', fontSize: '14px', fontWeight: 400 }}>→</span>
              </div>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>Sorularınızı anında yapay zekaya sorun.</div>
            </div>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#fff',
            border: '1px solid #EDE9FE',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '24px', lineHeight: 1 }}>✂️</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1040', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Bakım Araçları <span style={{ color: '#7C3AED', fontSize: '14px', fontWeight: 400 }}>→</span>
              </div>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>Tüy bakımı ve sağlık takibi.</div>
            </div>
          </div>

          {/* Card 5 (Full width) */}
          <div style={{
            background: '#fff',
            border: '1px solid #EDE9FE',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            gridColumn: '1 / -1',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '24px', lineHeight: 1 }}>👥</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1040' }}>
                Topluluk
              </div>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.4 }}>Diğer Poodle sahipleriyle deneyimlerinizi paylaşın.</div>
            </div>
            <div style={{ color: '#7C3AED', fontSize: '16px' }}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
