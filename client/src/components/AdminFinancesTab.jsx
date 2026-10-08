import React, { useState } from 'react';
import { mockBookings, mockExpenses, mockEmployees } from '../utils/mockData';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

export default function AdminFinancesTab({ showToast }) {
  const [period, setPeriod] = useState('monthly'); // weekly, monthly, semi-annual, annual
  const [expenseForm, setExpenseForm] = useState({ description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [employeeForm, setEmployeeForm] = useState({ name: '', salary: '' });
  const [refresh, setRefresh] = useState(0);

  // Period math helper (approximate)
  const getPeriodMultiplier = (p) => {
    switch(p) {
      case 'weekly': return 0.25;
      case 'monthly': return 1;
      case 'semi-annual': return 6;
      case 'annual': return 12;
      default: return 1;
    }
  };

  const getDaysInPeriod = (p) => {
    switch(p) {
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'semi-annual': return 180;
      case 'annual': return 365;
      default: return 30;
    }
  };

  const filterByPeriod = (dateString, days) => {
    const d = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= days;
  };

  const days = getDaysInPeriod(period);
  const salaryMultiplier = getPeriodMultiplier(period);

  // Calculates
  const periodBookings = mockBookings.filter(b => filterByPeriod(b.date, days) && b.status !== 'ملغي');
  const periodIncome = periodBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const periodExpensesList = mockExpenses.filter(e => filterByPeriod(e.date, days));
  const periodExpensesAmount = periodExpensesList.reduce((sum, e) => sum + Number(e.amount), 0);

  const totalMonthlySalaries = mockEmployees.reduce((sum, e) => sum + Number(e.salary), 0);
  const periodSalaries = totalMonthlySalaries * salaryMultiplier;

  const netProfit = periodIncome - (periodExpensesAmount + periodSalaries);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount) return;
    mockExpenses.push({
      id: 'exp-' + Date.now(),
      ...expenseForm
    });
    showToast('تم إضافة المصروف بنجاح');
    setExpenseForm({ description: '', amount: '', date: new Date().toISOString().split('T')[0] });
    setRefresh(prev => prev + 1);
  };

  const handleDeleteExpense = (id) => {
    const idx = mockExpenses.findIndex(e => e.id === id);
    if (idx > -1) {
      mockExpenses.splice(idx, 1);
      showToast('تم حذف المصروف');
      setRefresh(prev => prev + 1);
    }
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.salary) return;
    mockEmployees.push({
      id: 'emp-' + Date.now(),
      ...employeeForm
    });
    showToast('تم إضافة الموظف بنجاح');
    setEmployeeForm({ name: '', salary: '' });
    setRefresh(prev => prev + 1);
  };

  const handleDeleteEmployee = (id) => {
    const idx = mockEmployees.findIndex(e => e.id === id);
    if (idx > -1) {
      mockEmployees.splice(idx, 1);
      showToast('تم حذف الموظف');
      setRefresh(prev => prev + 1);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Period Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '10px' }}>
        {[
          { id: 'weekly', label: 'أسبوعي' },
          { id: 'monthly', label: 'شهري' },
          { id: 'semi-annual', label: 'نصف سنوي' },
          { id: 'annual', label: 'سنوي' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            style={{
              background: period === p.id ? '#10b981' : '#fff',
              color: period === p.id ? '#fff' : 'var(--text-muted)',
              border: period === p.id ? 'none' : '1px solid var(--border)',
              padding: '8px 24px',
              borderRadius: '20px',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: period === p.id ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', borderTop: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
            <TrendingUp size={20} color="#10b981" />
            إجمالي الدخل
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--dark)' }}>
            {periodIncome.toLocaleString()} ج.م
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', borderTop: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
            <TrendingDown size={20} color="#ef4444" />
            إجمالي المصروفات (تشغيل + رواتب)
          </div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--dark)' }}>
            {(periodExpensesAmount + periodSalaries).toLocaleString()} ج.م
          </div>
        </div>
        
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', borderTop: netProfit >= 0 ? '4px solid #3b82f6' : '4px solid #ef4444', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>
            <DollarSign size={20} color={netProfit >= 0 ? "#3b82f6" : "#ef4444"} />
            صافي الأرباح
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: netProfit >= 0 ? '#3b82f6' : '#ef4444' }}>
            {netProfit.toLocaleString()} ج.م
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Expenses Section */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)' }}>
            <TrendingDown size={20} color="#ef4444" />
            المصروفات (إيجار، كهرباء، صيانة...)
          </h3>
          
          <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="وصف المصروف" 
              className="form-input" 
              required
              value={expenseForm.description}
              onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
              style={{ flex: '1 1 200px' }}
            />
            <input 
              type="number" 
              placeholder="المبلغ" 
              className="form-input" 
              required
              value={expenseForm.amount}
              onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
              style={{ flex: '1 1 120px' }}
            />
            <input 
              type="date" 
              className="form-input" 
              required
              value={expenseForm.date}
              onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
              style={{ flex: '1 1 120px' }}
            />
            <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', flex: '0 0 auto' }}>
              <Plus size={20} />
            </button>
          </form>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {mockExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>لا توجد مصروفات مسجلة</div>
            ) : mockExpenses.map((exp, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{exp.description}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{exp.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: '800', color: '#ef4444' }}>{exp.amount} ج.م</span>
                  <button onClick={() => handleDeleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employees Section */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)' }}>
            <Users size={20} color="#3b82f6" />
            رواتب الموظفين (شهرياً)
          </h3>
          
          <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="اسم الموظف" 
              className="form-input" 
              required
              value={employeeForm.name}
              onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})}
              style={{ flex: '1 1 200px' }}
            />
            <input 
              type="number" 
              placeholder="الراتب الشهري" 
              className="form-input" 
              required
              value={employeeForm.salary}
              onChange={e => setEmployeeForm({...employeeForm, salary: e.target.value})}
              style={{ flex: '1 1 120px' }}
            />
            <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', flex: '0 0 auto' }}>
              <Plus size={20} />
            </button>
          </form>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {mockEmployees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>لا يوجد موظفين مسجلين</div>
            ) : mockEmployees.map((emp, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: '700' }}>{emp.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: '800', color: '#3b82f6' }}>{emp.salary} ج.م / شهر</span>
                  <button onClick={() => handleDeleteEmployee(emp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
