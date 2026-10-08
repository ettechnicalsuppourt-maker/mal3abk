import React, { useState, useEffect } from 'react';
import { mockBookings, mockPitches } from '../utils/mockData';
import { Users, CalendarCheck, MapPin, LogOut, Search, Activity, Plus, Trash2, Edit, Download, DollarSign } from 'lucide-react';
import AdminQuickBooking from './AdminQuickBooking';
import AdminFinancesTab from './AdminFinancesTab';
import AdminAddPitchModal from './AdminAddPitchModal';
import Toast from './Toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('quick');
  const [toast, setToast] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [showAddPitchModal, setShowAddPitchModal] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setRefresh(prev => prev + 1);
  };

  const handleExportExcel = () => {
    // Generate CSV string
    const headers = ['كود الحجز', 'اسم العميل', 'رقم الهاتف', 'اسم الملعب', 'التاريخ', 'المواعيد', 'طريقة الدفع', 'الإجمالي'];
    const rows = mockBookings.map(b => {
      const pitchName = mockPitches.find(p => p.id === b.pitchId)?.nameAr || 'غير معروف';
      return [
        b.id,
        b.customerName,
        b.customerPhone,
        pitchName,
        b.date,
        b.timeSlots.join(' و '),
        b.paymentMethod === 'cash' ? 'كاش' : b.paymentMethod === 'vodafone' ? 'فودافون كاش' : 'فيزا',
        b.totalPrice
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      headers.join(',') + '\n' + 
      rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    const isAdmin = localStorage.getItem('malaeb_admin');
    if (!isAdmin) {
      window.location.href = '/admin-login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('malaeb_admin');
    window.location.href = '/admin-login';
  };

  const totalRevenue = mockBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', direction: 'rtl' }}>
      {/* Admin Sidebar & Header wrapper */}
      <header style={{
        background: 'var(--dark)',
        color: '#fff',
        padding: '16px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ fontSize: '22px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>لوحة تحكم ملاعبك</span>
            <span style={{ color: 'var(--accent-lime)' }}>⚽</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
            <button 
              onClick={() => setActiveTab('quick')}
              style={{
                background: activeTab === 'quick' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'quick' ? 'var(--accent-lime)' : '#c2dcd0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} />
              حجز سريع
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              style={{
                background: activeTab === 'bookings' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'bookings' ? 'var(--accent-lime)' : '#c2dcd0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CalendarCheck size={18} />
              الحجوزات
            </button>
            <button 
              onClick={() => setActiveTab('pitches')}
              style={{
                background: activeTab === 'pitches' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'pitches' ? 'var(--accent-lime)' : '#c2dcd0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MapPin size={18} />
              الملاعب
            </button>
            <button 
              onClick={() => setActiveTab('finances')}
              style={{
                background: activeTab === 'finances' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === 'finances' ? 'var(--accent-lime)' : '#c2dcd0',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <DollarSign size={18} />
              الماليات
            </button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '600', opacity: 0.8 }}>
            زيارة الموقع
          </a>
          <button 
            onClick={handleLogout}
            style={{
              background: 'rgba(220, 38, 38, 0.2)',
              color: '#fca5a5',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={16} />
            خروج
          </button>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 0' }}>
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
              <CalendarCheck size={20} color="var(--primary)" />
              إجمالي الحجوزات
            </div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--dark)' }}>
              {mockBookings.length}
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
              <MapPin size={20} color="var(--accent-amber)" />
              الملاعب المسجلة
            </div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--dark)' }}>
              {mockPitches.length}
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
              <Activity size={20} color="#10b981" />
              إجمالي الإيرادات
            </div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--dark)' }}>
              {totalRevenue.toLocaleString()} ج.م
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--dark)' }}>
              {activeTab === 'bookings' ? 'إدارة الحجوزات' : activeTab === 'quick' ? 'إضافة حجز جديد' : activeTab === 'finances' ? 'الماليات والمصروفات' : 'إدارة الملاعب'}
            </h2>
            {activeTab === 'bookings' && (
              <button 
                onClick={handleExportExcel}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Download size={18} /> تصدير Excel
              </button>
            )}
            {activeTab === 'pitches' && (
              <button 
                onClick={() => setShowAddPitchModal(true)}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Plus size={18} /> إضافة ملعب
              </button>
            )}
            {activeTab !== 'quick' && (
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="بحث سريع..." 
                  className="form-input"
                  style={{ paddingRight: '40px', width: '250px' }}
                />
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            )}
          </div>

          {activeTab === 'quick' ? (
            <AdminQuickBooking showToast={showToast} />
          ) : activeTab === 'finances' ? (
            <AdminFinancesTab showToast={showToast} />
          ) : activeTab === 'bookings' ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-page)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>كود الحجز</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>العميل</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>الملعب</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>التاريخ والساعات</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>الإجمالي</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>لا توجد حجوزات حتى الآن</td>
                    </tr>
                  ) : mockBookings.map((b, i) => {
                    const pitchName = mockPitches.find(p => p.id === b.pitchId)?.nameAr || 'غير معروف';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '14px', fontWeight: '800', color: 'var(--primary)' }}>{b.id}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700' }}>{b.customerName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                        </td>
                        <td style={{ padding: '14px', fontWeight: '600' }}>{pitchName}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '700' }}>{b.date}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.timeSlots.join(' , ')}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', display: 'block', width: 'fit-content', marginBottom: '8px' }}>
                            {b.paymentMethod === 'cash' ? 'كاش' : b.paymentMethod === 'vodafone' ? 'فودافون كاش' : 'فيزا'}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => showToast('هذه الميزة قيد التطوير', 'info')}
                              style={{ background: '#f0f5f2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary)' }}
                            ><Edit size={16} /></button>
                            <button 
                              onClick={() => {
                                const index = mockBookings.findIndex(bk => bk.id === b.id);
                                if (index > -1) {
                                  mockBookings.splice(index, 1);
                                  showToast('تم حذف الحجز بنجاح', 'success');
                                }
                              }}
                              style={{ background: '#fde8e8', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}
                            ><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-page)', borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>اسم الملعب</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>المنطقة</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>النوع</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>السعر/ساعة</th>
                    <th style={{ padding: '14px', color: 'var(--text-muted)', fontWeight: '700', fontSize: '14px' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPitches.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px', fontWeight: '800' }}>{p.nameAr || p.name}</td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{p.area} - {p.city}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ background: '#f0f5f2', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>
                          {p.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontWeight: '800', color: 'var(--primary)' }}>{p.pricePerHour} ج.م</td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => showToast('هذه الميزة قيد التطوير', 'info')}
                            style={{ background: '#f0f5f2', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary)' }}
                          ><Edit size={16} /></button>
                          <button 
                            onClick={() => {
                              const index = mockPitches.findIndex(pt => pt.id === p.id);
                              if (index > -1) {
                                mockPitches.splice(index, 1);
                                showToast('تم حذف الملعب بنجاح', 'success');
                              }
                            }}
                            style={{ background: '#fde8e8', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}
                          ><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      {showAddPitchModal && (
        <AdminAddPitchModal 
          onClose={() => setShowAddPitchModal(false)}
          onSuccess={(newPitch) => {
            setShowAddPitchModal(false);
            showToast('تم إضافة الملعب بنجاح');
          }}
        />
      )}
      
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
