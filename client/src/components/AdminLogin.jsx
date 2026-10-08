import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('malaeb_admin', 'true');
      window.location.href = '/admin';
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-page)',
      direction: 'rtl'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-md)',
        width: 'min(400px, 90%)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 900,
            color: 'var(--dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <span>مَلعبك</span>
            <span style={{ color: 'var(--primary)' }}>⚽</span>
          </div>
          <h1 style={{ fontSize: '20px', color: 'var(--text-muted)' }}>تسجيل دخول لوحة التحكم</h1>
        </div>

        {error && (
          <div style={{
            background: '#fde8e8',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>اسم المستخدم</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingRight: '40px' }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
            <span>دخول للوحة التحكم</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
