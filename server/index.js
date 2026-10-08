import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const PITCHES_FILE = path.join(DATA_DIR, 'pitches.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

const getPitches = () => {
  try {
    if (!fs.existsSync(PITCHES_FILE)) return [];
    return JSON.parse(fs.readFileSync(PITCHES_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading pitches:', err);
    return [];
  }
};

const savePitches = (pitches) => {
  fs.writeFileSync(PITCHES_FILE, JSON.stringify(pitches, null, 2), 'utf8');
};

const getBookings = () => {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) return [];
    return JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading bookings:', err);
    return [];
  }
};

const saveBookings = (bookings) => {
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf8');
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Malaeb API', timestamp: new Date().toISOString() });
});

app.get('/api/pitches', (req, res) => {
  const { area, type, search, maxPrice, sortBy } = req.query;
  let pitches = getPitches();

  if (area && area !== 'الكل' && area !== 'all') {
    pitches = pitches.filter(p => p.area === area || p.city === area);
  }

  if (type && type !== 'الكل' && type !== 'all') {
    pitches = pitches.filter(p => p.type === type);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    pitches = pitches.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
      p.area.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  }

  if (maxPrice) {
    pitches = pitches.filter(p => p.pricePerHour <= Number(maxPrice));
  }

  if (sortBy === 'price-asc') {
    pitches.sort((a, b) => a.pricePerHour - b.pricePerHour);
  } else if (sortBy === 'price-desc') {
    pitches.sort((a, b) => b.pricePerHour - a.pricePerHour);
  } else if (sortBy === 'rating') {
    pitches.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: pitches.length, data: pitches });
});

app.get('/api/pitches/:id', (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  const pitches = getPitches();
  const pitch = pitches.find(p => p.id === id);

  if (!pitch) {
    return res.status(404).json({ success: false, message: 'الملعب غير موجود' });
  }

  const bookings = getBookings();
  const targetDate = date || new Date().toISOString().split('T')[0];
  const dayBookings = bookings.filter(b => b.pitchId === id && b.date === targetDate && b.status !== 'cancelled');
  const bookedTimeSlots = dayBookings.flatMap(b => b.timeSlots || []);

  const slotsStatus = (pitch.availableSlots || ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00']).map(time => ({
    time,
    isAvailable: !bookedTimeSlots.includes(time)
  }));

  res.json({
    success: true,
    data: {
      ...pitch,
      selectedDate: targetDate,
      slots: slotsStatus
    }
  });
});

app.post('/api/pitches', (req, res) => {
  const { name, area, city, type, pricePerHour, address, surface, ownerPhone, image, facilities } = req.body;

  if (!name || !area || !type || !pricePerHour || !ownerPhone) {
    return res.status(400).json({ success: false, message: 'يرجى إكمال البيانات الأساسية للملعب' });
  }

  const pitches = getPitches();
  const newPitch = {
    id: 'pitch-' + Date.now(),
    name,
    nameAr: name,
    area,
    city: city || area,
    type,
    pricePerHour: Number(pricePerHour),
    rating: 5.0,
    reviewsCount: 1,
    image: image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1000&q=80',
    address: address || 'عنوان الملعب',
    surface: surface || 'نجيل صناعي ممتازة',
    facilities: facilities || ['إضاءة ليلية', 'غرف تغيير ملابس'],
    description: 'ملعب مميز مضاف جديداً عبر المنصة.',
    ownerPhone,
    availableSlots: ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00']
  };

  pitches.unshift(newPitch);
  savePitches(pitches);

  res.status(201).json({ success: true, message: 'تم إضافة الملعب بنجاح! 🎉', data: newPitch });
});

app.post('/api/bookings', (req, res) => {
  const { pitchId, customerName, customerPhone, date, timeSlots, paymentMethod } = req.body;

  if (!pitchId || !customerName || !customerPhone || !date || !timeSlots || timeSlots.length === 0) {
    return res.status(400).json({ success: false, message: 'بيانات الحجز غير مكتملة' });
  }

  const pitches = getPitches();
  const pitch = pitches.find(p => p.id === pitchId);

  if (!pitch) {
    return res.status(404).json({ success: false, message: 'الملعب غير موجود' });
  }

  const bookings = getBookings();
  const collision = bookings.find(b =>
    b.pitchId === pitchId &&
    b.date === date &&
    b.status !== 'cancelled' &&
    b.timeSlots.some(t => timeSlots.includes(t))
  );

  if (collision) {
    return res.status(409).json({ success: false, message: 'عذراً، هذا الموعد تم حجزه مؤخراً. اختر ميعاداً آخر.' });
  }

  const hours = timeSlots.length;
  const totalAmount = pitch.pricePerHour * hours;
  const bookingRef = 'MLB-' + Math.floor(100000 + Math.random() * 900000);

  const newBooking = {
    id: bookingRef,
    pitchId,
    pitchName: pitch.name,
    pitchArea: pitch.area,
    customerName,
    customerPhone,
    date,
    timeSlots,
    hours,
    pricePerHour: pitch.pricePerHour,
    totalAmount,
    paymentMethod: paymentMethod || 'cash',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  saveBookings(bookings);

  res.status(201).json({
    success: true,
    message: 'تم تأكيد الحجز بنجاح! ⚽🎉',
    data: newBooking
  });
});

app.get('/api/bookings', (req, res) => {
  const { phone } = req.query;
  const bookings = getBookings();

  if (phone) {
    const userBookings = bookings.filter(b => b.customerPhone.trim() === phone.trim());
    return res.json({ success: true, count: userBookings.length, data: userBookings });
  }

  res.json({ success: true, count: bookings.length, data: bookings });
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
  }

  bookings[idx].status = 'cancelled';
  saveBookings(bookings);
  res.json({ success: true, message: 'تم إلغاء الحجز بنجاح', data: bookings[idx] });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, role } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'يرجى إدخال رقم الهاتف' });
  }

  const user = {
    id: 'user-' + Math.floor(Math.random() * 10000),
    phone,
    name: role === 'owner' ? 'صاحب ملعب' : 'لاعب كرة',
    role: role || 'player',
    token: 'jwt-token-demo-' + Date.now()
  };

  res.json({ success: true, message: 'تم تسجيل الدخول بنجاح', data: user });
});

app.listen(PORT, () => {
  console.log('🚀 Rapid Malaeb Express API running on port ' + PORT);
});
