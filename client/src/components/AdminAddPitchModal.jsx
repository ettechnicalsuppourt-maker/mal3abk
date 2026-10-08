import React, { useState } from 'react';
import { X } from 'lucide-react';
import { registerPitch } from '../utils/api';

export default function AdminAddPitchModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    city: 'القاهرة',
    type: 'ملعب خماسي',
    pricePerHour: '',
    surface: 'نجيل صناعي',
    description: '',
    ownerPhone: '01000000000',
    facilities: ['إضاءة ليلية', 'غرف ملابس']
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerPitch({
      ...formData,
      pricePerHour: Number(formData.pricePerHour)
    });
    if (res.success) {
      onSuccess(res.data);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      direction: 'rtl'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '30px',
        width: 'min(500px, 95%)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--dark)' }}>إضافة ملعب جديد</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>اسم الملعب</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value, nameAr: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>المنطقة</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>المدينة</label>
              <select className="form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
                <option value="الإسكندرية">الإسكندرية</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>النوع</label>
              <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="ملعب خماسي">ملعب خماسي</option>
                <option value="ملعب سباعي">ملعب سباعي</option>
                <option value="ملعب قانوني">ملعب قانوني</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700' }}>السعر/ساعة</label>
              <input 
                type="number" 
                className="form-input" 
                required 
                value={formData.pricePerHour}
                onChange={e => setFormData({...formData, pricePerHour: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '16px' }}>
            حفظ وإضافة الملعب
          </button>
        </form>
      </div>
    </div>
  );
}
