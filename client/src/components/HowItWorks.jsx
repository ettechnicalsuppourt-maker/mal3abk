import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding: '55px 0', background: '#ffffff', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <span className="badge badge-green" style={{ marginBottom: '10px' }}>سلس وسريع</span>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--dark)' }}>
            احجز ملعبك في 3 خطوات بسيطة ⚽
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
            كل العملية بتاخد منك أقل من 60 ثانية بدون أي تعقيد
          </p>
        </div>

        <div className="how-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {/* Step 1 */}
          <div style={{
            background: 'var(--bg-page)',
            borderRadius: '18px',
            padding: '24px 20px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: '900',
              fontSize: '18px',
              marginBottom: '16px'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>اختار الملعب المناسب</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              حدد منطقتك واعرف نوع النجيل وسعر الساعة والخدمات المتاحة لكل ملعب.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{
            background: 'var(--bg-page)',
            borderRadius: '18px',
            padding: '24px 20px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: '900',
              fontSize: '18px',
              marginBottom: '16px'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>حدد الوقت والساعات</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              اختر تاريخ اليوم ومواعيد الساعات الفاضية مباشرة من جدول المواعيد الحي.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{
            background: 'var(--bg-page)',
            borderRadius: '18px',
            padding: '24px 20px',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: '900',
              fontSize: '18px',
              marginBottom: '16px'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>أكّد الحجز وانزل العب</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
              أدخل اسمك ورقمك، اختر طريقة الدفع واستلم كود الحجز الفوري MLB-XXXX.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
