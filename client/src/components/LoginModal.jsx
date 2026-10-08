import React, { useState } from 'react';
import { X, User, Phone } from 'lucide-react';
import { loginUser } from '../utils/api';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('player');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg('يرجى إدخال رقم الهاتف');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await loginUser(phone, role);
    setSubmitting(false);

    if (res.success) {
      onLoginSuccess(res.data);
    } else {
      setErrorMsg(res.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: 'min(440px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>تسجيل الدخول ⚽</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          أدخل رقم محمولك لمتابعة وإدارة حجوزاتك بسهولة
        </p>

        {errorMsg && (
          <div style={{ background: '#fde8e8', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>نوع الحساب</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('player')}
                style={{
                  background: role === 'player' ? 'var(--primary-light)' : '#ffffff',
                  color: role === 'player' ? 'var(--primary)' : 'var(--text-dark)',
                  border: role === 'player' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                🏃 لاعب كرة
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                style={{
                  background: role === 'owner' ? 'var(--primary-light)' : '#ffffff',
                  color: role === 'owner' ? 'var(--primary)' : 'var(--text-dark)',
                  border: role === 'owner' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                🏟️ مالك ملعب
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>رقم المحمول *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="010XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', marginTop: '10px', fontSize: '15px' }}
          >
            {submitting ? 'جاري الدخول...' : 'تسجيل الدخول / إنشاء حساب'}
          </button>
        </form>
      </div>
    </div>
  );
}
