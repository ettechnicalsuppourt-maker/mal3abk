import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { createBooking } from '../utils/api';

export default function BookingModal({ bookingData, onClose, onBookingSuccess }) {
  const { pitch, date, timeSlots, totalPrice } = bookingData || {};

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!bookingData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('يرجى كتابة الاسم ورقم الهاتف لمتابعة الحجز');
      return;
    }

    if (customerPhone.trim().length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف صحبح يتكون من 11 رقم');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const res = await createBooking({
      pitchId: pitch.id,
      customerName,
      customerPhone,
      date,
      timeSlots,
      paymentMethod
    });

    setSubmitting(false);

    if (res.success) {
      onBookingSuccess(res.data);
    } else {
      setErrorMessage(res.message || 'عذراً، حدث خطأ في تأكيد الحجز');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>تأكيد الحجز النهائي ⚽</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Summary Card */}
        <div style={{
          background: '#f4f8f5',
          border: '1px solid #dce8df',
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--dark)' }}>
            {pitch.nameAr || pitch.name}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            📍 {pitch.area} • 📅 {date}
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            margin: '12px 0'
          }}>
            {timeSlots.map((t) => (
              <span key={t} style={{
                background: '#ffffff',
                border: '1px solid #d0e0d5',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '800',
                color: 'var(--primary)'
              }}>
                ⏰ {t}
              </span>
            ))}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid #dce8df', margin: '12px 0' }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '14px' }}>المبلغ الإجمالي المطلـوب:</span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)' }}>
              {totalPrice} ج.م
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: '#fde8e8',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>اسمك بالكامل (صاحب الحجز) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="مثال: أحمد محمود"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>رقم المحمول (لإرسال كود التأكيد) *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="010XXXXXXXX"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>

          {/* Payment Method */}
          <div className="form-group">
            <label>طريقة الدفع الفضلى</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div
                onClick={() => setPaymentMethod('cash')}
                style={{
                  border: paymentMethod === 'cash' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMethod === 'cash' ? 'var(--primary-light)' : '#ffffff',
                  borderRadius: '10px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '12px'
                }}
              >
                <DollarSign size={20} style={{ margin: '0 auto 4px', display: 'block', color: 'var(--primary)' }} />
                <span>كاش بالملعب</span>
              </div>

              <div
                onClick={() => setPaymentMethod('vodafone')}
                style={{
                  border: paymentMethod === 'vodafone' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMethod === 'vodafone' ? 'var(--primary-light)' : '#ffffff',
                  borderRadius: '10px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '12px'
                }}
              >
                <Smartphone size={20} style={{ margin: '0 auto 4px', display: 'block', color: 'var(--primary)' }} />
                <span>فودافون كاش</span>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMethod === 'card' ? 'var(--primary-light)' : '#ffffff',
                  borderRadius: '10px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '12px'
                }}
              >
                <CreditCard size={20} style={{ margin: '0 auto 4px', display: 'block', color: 'var(--primary)' }} />
                <span>فيزا / كارت</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '15px', fontSize: '16px', marginTop: '10px' }}
          >
            {submitting ? 'جاري تأكيد حجزك...' : 'تأكيد الحجز النهائي 🎉'}
          </button>
        </form>
      </div>
    </div>
  );
}
