import { mockPitches, mockBookings } from './mockData';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchPitches(filters = {}) {
  await delay(600);
  let results = [...mockPitches];

  if (filters.area && filters.area !== 'الكل') {
    results = results.filter(p => p.area === filters.area);
  }
  if (filters.type && filters.type !== 'الكل') {
    results = results.filter(p => p.type === filters.type);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(p => 
      (p.nameAr && p.nameAr.toLowerCase().includes(q)) || 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.area && p.area.toLowerCase().includes(q))
    );
  }

  if (filters.sortBy) {
    if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'price-asc') {
      results.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (filters.sortBy === 'price-desc') {
      results.sort((a, b) => b.pricePerHour - a.pricePerHour);
    }
  }

  return { success: true, data: results };
}

export async function fetchPitchDetails(id, date) {
  await delay(500);
  const pitch = mockPitches.find(p => p.id === id);
  if (!pitch) return { success: false, message: 'Pitch not found' };

  // Generate slots for the specific date
  const bookedSlotsForDate = mockBookings
    .filter(b => b.pitchId === id && b.date === date)
    .flatMap(b => b.timeSlots);

  const slots = pitch.availableSlots.map(time => ({
    time,
    isAvailable: !bookedSlotsForDate.includes(time)
  }));

  return { success: true, data: { ...pitch, slots } };
}

export async function createBooking(bookingData) {
  await delay(800);
  const newBooking = {
    ...bookingData,
    id: 'MLB-' + Math.floor(1000 + Math.random() * 9000),
    status: 'مؤكد',
    createdAt: new Date().toISOString()
  };
  mockBookings.push(newBooking);
  return { success: true, data: newBooking };
}

export async function fetchUserBookings(phone) {
  await delay(500);
  const userBookings = mockBookings.filter(b => b.customerPhone === phone);
  // Add pitch details to bookings
  const populated = userBookings.map(b => {
    const p = mockPitches.find(pitch => pitch.id === b.pitchId);
    return { ...b, pitchName: p ? (p.nameAr || p.name) : 'ملعب غير معروف' };
  });
  return { success: true, data: populated };
}

export async function cancelBooking(id) {
  await delay(600);
  const index = mockBookings.findIndex(b => b.id === id);
  if (index > -1) {
    mockBookings[index].status = 'ملغي';
    return { success: true, message: 'تم إلغاء الحجز' };
  }
  return { success: false, message: 'لم يتم العثور على الحجز' };
}

export async function registerPitch(pitchData) {
  await delay(1000);
  const newPitch = {
    ...pitchData,
    id: 'pitch-' + Date.now(),
    rating: 0,
    reviewsCount: 0,
    availableSlots: ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
  };
  mockPitches.push(newPitch);
  return { success: true, data: newPitch };
}

export async function loginUser(phone, role) {
  await delay(500);
  return { success: true, data: { phone, role } };
}
