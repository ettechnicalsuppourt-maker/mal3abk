import React, { useState, useEffect } from 'react';
import { mockPitches, mockBookings } from '../utils/mockData';
import { createBooking } from '../utils/api';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function AdminQuickBooking({ showToast }) {
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPitchId, setSelectedPitchId] = useState('all');
  const [selectedSlots, setSelectedSlots] = useState([]); // Array of { pitchId, time, price }
  const [dates, setDates] = useState([]);

  // Recurring booking state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState(4); // 4 weeks = 1 month
  const [customerName, setCustomerName] = useState('حجز إداري');
  const [customerPhone, setCustomerPhone] = useState('01000000000');

  useEffect(() => {
    // Generate 7 days starting from baseDate
    const nextDays = [];
    const start = new Date(baseDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      nextDays.push({
        full: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
        dayNum: d.getDate()
      });
    }
    setDates(nextDays);
    setSelectedDate(baseDate);
  }, [baseDate]);

  const toggleSlot = (pitchId, time, price) => {
    const isSelected = selectedSlots.find(s => s.pitchId === pitchId && s.time === time);
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(s => !(s.pitchId === pitchId && s.time === time)));
    } else {
      setSelectedSlots([...selectedSlots, { pitchId, time, price }]);
    }
  };

  const handleConfirmBooking = async () => {
    if (selectedSlots.length === 0) return;
    
    // Group slots by pitch
    const byPitch = selectedSlots.reduce((acc, slot) => {
      if (!acc[slot.pitchId]) acc[slot.pitchId] = { slots: [], price: 0 };
      acc[slot.pitchId].slots.push(slot.time);
      acc[slot.pitchId].price += slot.price;
      return acc;
    }, {});

    const datesToBook = [];
    if (isRecurring) {
      // Create dates for the next N weeks, on the same weekday as selectedDate
      for (let i = 0; i < recurringWeeks; i++) {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + (i * 7));
        datesToBook.push(d.toISOString().split('T')[0]);
      }
    } else {
      datesToBook.push(selectedDate);
    }

    for (const d of datesToBook) {
      for (const [pId, data] of Object.entries(byPitch)) {
        await createBooking({
          pitchId: pId,
          customerName: customerName || 'حجز إداري',
          customerPhone: customerPhone || '01000000000',
          date: d,
          timeSlots: data.slots,
          paymentMethod: 'cash',
          totalPrice: data.price
        });
      }
    }
    
    showToast(isRecurring ? `تم تأكيد الحجز المتكرر لمدة ${recurringWeeks} أسبوع بنجاح` : 'تم إضافة الحجز بنجاح');
    setSelectedSlots([]);
    setIsRecurring(false);
    setCustomerName('حجز إداري');
  };

  const isSlotBooked = (pitchId, time) => {
    return mockBookings.some(b => b.pitchId === pitchId && b.date === selectedDate && b.timeSlots.includes(time) && b.status !== 'ملغي');
  };

  const pitchesToDisplay = selectedPitchId === 'all' ? mockPitches : mockPitches.filter(p => p.id === selectedPitchId);

  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);
  const finalPrice = isRecurring ? totalPrice * recurringWeeks : totalPrice;

  return (
    <div style={{ background: '#121212', color: '#fff', borderRadius: '20px', padding: '20px', minHeight: '600px' }}>
      
      {/* Date Picker Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={20} color="#10b981" />
          اختر التاريخ
        </h3>
        <div>
          <input 
            type="date" 
            value={baseDate}
            onChange={(e) => {
              if(e.target.value) setBaseDate(e.target.value);
            }}
            style={{
              background: '#222',
              color: '#fff',
              border: '1px solid #333',
              padding: '8px 12px',
              borderRadius: '8px',
              colorScheme: 'dark'
            }}
          />
        </div>
      </div>

      {/* Dates Row */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
        {dates.map((d, i) => (
          <div 
            key={i}
            onClick={() => { setSelectedDate(d.full); setSelectedSlots([]); }}
            style={{
              minWidth: '65px',
              background: selectedDate === d.full ? '#10b981' : '#222',
              color: selectedDate === d.full ? '#000' : '#fff',
              borderRadius: '12px',
              padding: '12px 0',
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '13px', marginBottom: '4px' }}>{d.dayName}</div>
            <div style={{ fontSize: '22px', fontWeight: '900' }}>{d.dayNum}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
        حدد اليوم، ثم اختر الملاعب والمواعيد التي تريد حجزها.
      </p>

      {/* Pitch Filters */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedPitchId('all')}
          style={{
            background: selectedPitchId === 'all' ? '#10b981' : '#222',
            color: selectedPitchId === 'all' ? '#000' : '#fff',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '20px',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          كل الملاعب
        </button>
        {mockPitches.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPitchId(p.id)}
            style={{
              background: selectedPitchId === p.id ? '#10b981' : '#222',
              color: selectedPitchId === p.id ? '#000' : '#fff',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p.nameAr || p.name}
          </button>
        ))}
      </div>

      {/* Pitches Slots */}
      <div style={{ paddingBottom: '180px' }}>
        {pitchesToDisplay.map(pitch => (
          <div key={pitch.id} style={{ background: '#1c1c1e', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid #2c2c2e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{pitch.nameAr || pitch.name}</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{pitch.pricePerHour} ج.م/ساعة</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
              {pitch.availableSlots.map(time => {
                const booked = isSlotBooked(pitch.id, time);
                const selected = selectedSlots.find(s => s.pitchId === pitch.id && s.time === time);
                
                return (
                  <button
                    key={time}
                    disabled={booked}
                    onClick={() => toggleSlot(pitch.id, time, pitch.pricePerHour)}
                    style={{
                      background: booked ? '#333' : selected ? '#10b981' : '#2c2c2e',
                      color: booked ? '#666' : selected ? '#000' : '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 4px',
                      fontWeight: '800',
                      cursor: booked ? 'not-allowed' : 'pointer',
                      opacity: booked ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {pitchesToDisplay.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>لا توجد ملاعب متاحة</div>
        )}
      </div>

      {/* Bottom Action Bar (Fixed) */}
      {selectedSlots.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: '#1a1a1c',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
          border: '1px solid #333',
          zIndex: 100
        }}>
          {/* Booking Config (Recurring & Customer info) */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '6px' }}>اسم العميل</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '8px' }}
                placeholder="اسم العميل (مثال: أحمد)"
              />
            </div>
            
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#222', padding: '8px 12px', borderRadius: '8px', height: '37px' }}>
                <input 
                  type="checkbox" 
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '700' }}>تكرار الحجز أسبوعياً</span>
              </label>

              {isRecurring && (
                <select 
                  value={recurringWeeks}
                  onChange={(e) => setRecurringWeeks(Number(e.target.value))}
                  style={{ background: '#000', border: '1px solid #333', color: '#fff', padding: '8px 12px', borderRadius: '8px', height: '37px', flex: 1 }}
                >
                  <option value={4}>لمدة شهر (4 أسابيع)</option>
                  <option value={8}>لمدة شهرين (8 أسابيع)</option>
                  <option value={24}>لمدة 6 شهور (24 أسبوع)</option>
                  <option value={52}>لمدة سنة (52 أسبوع)</option>
                </select>
              )}
            </div>
          </div>

          {/* Confirm Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#888' }}>
                {selectedSlots.length} ساعات 
                {isRecurring ? ` × ${recurringWeeks} أسبوع = ${selectedSlots.length * recurringWeeks} حجز` : ''}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#10b981' }}>{finalPrice} ج.م</div>
            </div>
            <button 
              onClick={handleConfirmBooking}
              style={{
                background: '#10b981',
                color: '#000',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
            >
              {isRecurring ? 'تأكيد الحجز المتكرر' : 'تأكيد الحجز الإداري'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
