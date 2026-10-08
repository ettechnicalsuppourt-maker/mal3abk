import React from 'react';
import PitchCard from './PitchCard';
import { Search, RefreshCw } from 'lucide-react';

export default function PitchGrid({ pitches, loading, filters, setFilters, onSelectPitch, onResetFilters }) {
  const areas = ['الكل', 'مدينة نصر', 'التجمع الخامس', 'المعادي', '6 أكتوبر', 'الشيخ زايد', 'الهرم', 'سموحة'];

  return (
    <section id="pitches" style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Section Title */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--dark)' }}>
              الملاعب المتاحة للحجز ⚽
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              اختر الملعب الأنسب لك ولفريقك وقارن المميزات والأسعار بكل شفافية
            </p>
          </div>

          <div style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '6px 14px',
            borderRadius: '50px',
            fontWeight: '800',
            fontSize: '13px'
          }}>
            {pitches.length} ملعب متاح
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Top row: Search input & Price Sort */}
          <div className="filter-bar-top" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 200px auto',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="ابحث باسم الملعب أو المنطقة..."
                className="form-input"
                style={{ paddingRight: '40px' }}
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Search
                size={17}
                color="var(--text-muted)"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            <select
              className="form-select"
              value={filters.sortBy || 'rating'}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <option value="rating">الأعلى تقييماً ⭐</option>
              <option value="price-asc">الأقل سعراً 💰</option>
              <option value="price-desc">الأعلى سعراً 💎</option>
            </select>

            <button
              className="btn btn-outline"
              onClick={onResetFilters}
              title="إعادة ضبط الفلاتر"
              style={{ padding: '10px 14px' }}
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {/* Bottom row: Filter Pills for Area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch'
          }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              المنطقة:
            </span>
            {areas.map((a) => (
              <button
                key={a}
                onClick={() => setFilters({ ...filters, area: a })}
                style={{
                  background: (filters.area || 'الكل') === a ? 'var(--primary)' : '#f0f5f2',
                  color: (filters.area || 'الكل') === a ? '#ffffff' : 'var(--text-dark)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)'
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e0eae3',
              borderTopColor: 'var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 14px',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ fontWeight: '700', color: 'var(--text-muted)' }}>جاري تحميل الملاعب المتاحة...</p>
          </div>
        ) : pitches.length === 0 ? (
          /* Empty State */
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px dashed var(--border)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚽</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>لم نجد ملاعب تطابق بحثك</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px' }}>جرب اختيار منطقة أخرى أو تغيير نوع الملعب</p>
            <button className="btn btn-primary" onClick={onResetFilters}>
              عرض جميع الملاعب
            </button>
          </div>
        ) : (
          /* Pitch Cards Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {pitches.map((pitch) => (
              <PitchCard
                key={pitch.id}
                pitch={pitch}
                onSelectPitch={onSelectPitch}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
