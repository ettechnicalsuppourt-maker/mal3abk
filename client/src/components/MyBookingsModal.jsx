import React, { useState, useEffect } from 'react';
import { X, Calendar, Search, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchUserBookings, cancelBooking } from '../utils/api';

export default function MyBookingsModal({ onClose, user, showToast }) {
  const [phone, setPhone] = useState(user ? user.phone : '01011223344');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async (searchPhone) => {
    if (!searchPhone) return;
    setLoading(true);
    const res = await fetchUserBookings(searchPhone);
    if (res.success) {
      setBookings(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings(phone);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBookings(phone);
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('هل أنت تأكد من رغبتك في إلغاء هذا الحجز؟')) return;
    const res = await cancelBooking(bookingId);
    if (res.success) {
      showToast('تم إلغاء الحجز بنجاح', 'success');
      loadBookings(phone);
    } else {
      showToast(res.message || 'حدث خطأ في إلغاء الحجز', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: 'min(640px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>سجل حجوزاتي ⚽</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Lookup by Phone input */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="tel"
            className="form-input"
            placeholder="أدخل رقم الهاتف للبحث عن حجوزاتك..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
            <Search size={18} />
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            جاري جلب حجوزاتك...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            background: '#f9fbf9',
            border: '1px dashed var(--border)',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <Calendar size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '17px', fontWeight: '800' }}>لا توجد حجوزات مسجلة بهذا الرقم</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              تأكد من إدخال رقم الهاتف الصحيح المستخدم أثناء الحجز
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '60vh', overflowY: 'auto' }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                style={{
                  background: b.status === 'cancelled' ? '#fcf8f8' : '#ffffff',
                  border: b.status === 'cancelled' ? '1px solid #f0d0d0' : '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--dark)' }}>
                      {b.pitchName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      رقم الحجز: <strong style={{ color: 'var(--primary)' }}>{b.id}</strong> • 📍 {b.pitchArea}
                    </div>
                  </div>

                  <span style={{
                    background: b.status === 'cancelled' ? '#fee2e2' : '#eaf7f0',
                    color: b.status === 'cancelled' ? '#dc2626' : 'var(--primary)',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}>
                    {b.status === 'cancelled' ? 'ملغي' : 'مؤكد ✓'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  fontSize: '13px',
                  background: '#f4f7f5',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  margin: '10px 0'
                }}>
                  <div>📅 التاريخ: <strong>{b.date}</strong></div>
                  <div>⏱️ الساعات: <strong>{(b.timeSlots || []).join(', ')}</strong></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--dark)' }}>
                    المبلغ: {b.totalAmount} ج.م <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>({b.paymentMethod === 'cash' ? 'كاش' : 'الكتروني'})</span>
                  </div>

                  {b.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={15} />
                      <span>إلغاء الحجز</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
