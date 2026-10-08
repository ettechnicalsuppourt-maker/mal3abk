import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function PitchOwnerCTA({ onRegisterClick }) {
  return (
    <section style={{ padding: '30px 0 55px' }}>
      <div className="container">
        <div className="cta-banner" style={{
          background: 'linear-gradient(135deg, #092014 0%, #0e4428 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '35px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          boxShadow: '0 20px 45px rgba(5, 23, 14, 0.2)'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <span className="badge" style={{ marginBottom: '12px' }}>أصحاب الملاعب</span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '6px 0 10px' }}>
              عندك ملعب كرة قدم؟ ضيفه على منصتنا الآن ⚽
            </h2>
            <p style={{ color: '#c2dcd0', fontSize: '14px', lineHeight: '1.7' }}>
              انضم لأكثر من 150 ملعب في القاهرة والجيزة والإسكندرية. زوّد نسبة إشغال ملعبك واستقبل حجوزات مؤكدة يومياً!
            </p>
          </div>

          <button
            className="btn btn-lime"
            onClick={onRegisterClick}
            style={{ padding: '14px 26px', fontSize: '15px', borderRadius: '12px', whiteSpace: 'nowrap' }}
          >
            <PlusCircle size={19} />
            <span>سجّل ملعبك الآن مجاناً</span>
          </button>
        </div>
      </div>
    </section>
  );
}
