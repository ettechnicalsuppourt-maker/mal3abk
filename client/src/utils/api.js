const API_BASE_URL = '/api';

export async function fetchPitches(filters = {}) {
  try {
    const query = new URLSearchParams();
    if (filters.area) query.append('area', filters.area);
    if (filters.type) query.append('type', filters.type);
    if (filters.search) query.append('search', filters.search);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) query.append('sortBy', filters.sortBy);

    const res = await fetch(`${API_BASE_URL}/pitches?${query.toString()}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API fetchPitches error:', error);
    return { success: false, data: [] };
  }
}

export async function fetchPitchDetails(id, date) {
  try {
    const res = await fetch(`${API_BASE_URL}/pitches/${id}?date=${date || ''}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API fetchPitchDetails error:', error);
    return { success: false };
  }
}

export async function createBooking(bookingData) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API createBooking error:', error);
    return { success: false, message: 'حدث خطأ في الاتصال بالسيرفر' };
  }
}

export async function fetchUserBookings(phone) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API fetchUserBookings error:', error);
    return { success: false, data: [] };
  }
}

export async function cancelBooking(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API cancelBooking error:', error);
    return { success: false, message: 'فشل إلغاء الحجز' };
  }
}

export async function registerPitch(pitchData) {
  try {
    const res = await fetch(`${API_BASE_URL}/pitches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pitchData)
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API registerPitch error:', error);
    return { success: false, message: 'حدث خطأ في إضافة الملعب' };
  }
}

export async function loginUser(phone, role) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, role })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API loginUser error:', error);
    return { success: false, message: 'فشل تسجيل الدخول' };
  }
}
