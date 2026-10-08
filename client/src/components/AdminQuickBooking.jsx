import React, { useState, useEffect } from 'react';
import { mockPitches, mockBookings } from '../utils/mockData';
import { createBooking } from '../utils/api';

export default function AdminQuickBooking({ showToast }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPitchId, setSelectedPitchId] = useState('all');
  const [selectedSlots, setSelectedSlots] = useState([]); // Array of { pitchId, time, price }
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // Generate next 7 days
    const nextDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      nextDays.push({
        full: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
        dayNum: d.getDate()
      });
    }
    setDates(nextDays);
  }, []);

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

    for (const [pId, data] of Object.entries(byPitch)) {
      await createBooking({
        pitchId: pId,
        customerName: 'حجز إداري',
        customerPhone: '01000000000',
        date: selectedDate,
        timeSlots: data.slots,
        paymentMethod: 'cash',
        totalPrice: data.price
      });
    }
    
    showToast('تم إضافة الحجز بنجاح');
    setSelectedSlots([]);
  };

  const isSlotBooked = (pitchId, time) => {
    return mockBookings.some(b => b.pitchId === pitchId && b.date === selectedDate && b.timeSlots.includes(time) && b.status !== 'ملغي');
  };

  const pitchesToDisplay = selectedPitchId === 'all' ? mockPitches : mockPitches.filter(p => p.id === selectedPitchId);

  const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  return (
    <div style={{ background: '#121212', color: '#fff', borderRadius: '20px', padding: '20px', minHeight: '600px' }}>
      
      {/* Dates Row */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
        {dates.map((d, i) => (
          <div 
            key={i}
            onClick={() => { setSelectedDate(d.full); setSelectedSlots([]); }}
            style={{
              minWidth: '60px',
              background: selectedDate === d.full ? '#10b981' : '#222',
              color: selectedDate === d.full ? '#000' : '#fff',
              borderRadius: '12px',
              padding: '10px 0',
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            <div style={{ fontSize: '12px', marginBottom: '4px' }}>{d.dayName}</div>
            <div style={{ fontSize: '20px' }}>{d.dayNum}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
        دوس على معاد عشان تختاره - المواعيد اللي ورا بعض بتتحجز حجز واحد.
      </p>

      {/* Pitch Filters */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedPitchId('all')}
          style={{
            background: selectedPitchId === 'all' ? '#10b981' : '#222',
            color: selectedPitchId === 'all' ? '#000' : '#fff',
            border: 'none',
            padding: '8px 16px',
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
              padding: '8px 16px',
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
      <div>
        {pitchesToDisplay.map(pitch => (
          <div key={pitch.id} style={{ background: '#1c1c1e', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>{pitch.nameAr || pitch.name}</div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>{pitch.pricePerHour} ج.م/ساعة</div>
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
                      color: booked ? '#555' : selected ? '#000' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 4px',
                      fontWeight: '800',
                      cursor: booked ? 'not-allowed' : 'pointer',
                      opacity: booked ? 0.5 : 1
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      {selectedSlots.length > 0 && (
        <div style={{
          position: 'sticky',
          bottom: '20px',
          background: '#222',
          padding: '16px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#888' }}>{selectedSlots.length} ساعات محددة</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#10b981' }}>{totalPrice} ج.م</div>
          </div>
          <button 
            onClick={handleConfirmBooking}
            style={{
              background: '#10b981',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            تأكيد الحجز الإداري
          </button>
        </div>
      )}
    </div>
  );
}
