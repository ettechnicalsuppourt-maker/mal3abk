import React from 'react';
import { MapPin, Star, Zap, ShieldAlert, Award } from 'lucide-react';

export default function PitchCard({ pitch, onSelectPitch }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'var(--transition)',
      display: 'flex',
      flexDirection: 'column'
    }} className="pitch-card-item">
      {/* Pitch Header Image */}
      <div style={{
        height: '200px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0d3d23'
      }}>
        <img
          src={pitch.image}
          alt={pitch.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="pitch-img"
        />

        {/* Price Tag */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          padding: '6px 14px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '900',
          color: 'var(--primary)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {pitch.pricePerHour} ج.م / ساعة
        </div>

        {/* Pitch Type Badge */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          right: '14px',
          background: 'rgba(9, 32, 20, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '5px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '700'
        }}>
          ⚽ {pitch.type}
        </div>
      </div>

      {/* Pitch Content Body */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justify: 'space-between'
      }}>
        <div>
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'start',
            gap: '10px',
            marginBottom: '8px'
          }}>
            <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--dark)' }}>
              {pitch.nameAr || pitch.name}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent-amber)',
              fontWeight: '800',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              <Star size={15} fill="var(--accent-amber)" />
              <span>{pitch.rating}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: '14px'
          }}>
            <MapPin size={15} color="var(--primary)" />
            <span>📍 {pitch.area} — {pitch.city}</span>
          </div>

          {/* Facilities Tags */}
          <div style={{
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginBottom: '18px'
          }}>
            {pitch.facilities && pitch.facilities.slice(0, 3).map((fac, idx) => (
              <span key={idx} style={{
                background: '#f0f5f2',
                color: 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                ✓ {fac}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer Button */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #f0f4f1',
          paddingTop: '14px',
          marginTop: 'auto'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
            أرضية: {pitch.surface || 'نجيل صناعي'}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onSelectPitch(pitch)}
            style={{ padding: '9px 18px', fontSize: '13px', borderRadius: '10px' }}
          >
            احجز الآن ⚽
          </button>
        </div>
      </div>
    </div>
  );
}
