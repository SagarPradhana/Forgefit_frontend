export type Role = 'admin' | 'user';
export type Status = 'Active' | 'Expired' | 'Pending' | 'Paid';

export const stats = [
  { label: 'Active Members', value: 2840 },
  { label: 'Elite Trainers', value: 42 },
  { label: 'Years of Excellence', value: 11 },
];

export const pricingPlans = [
  { id: 'basic', name: 'Starter', price: 35, duration: 'Month', features: ['Gym Access', 'Locker', '1 Class / Week'] },
  { id: 'pro', name: 'Performance', price: 59, duration: 'Month', features: ['All Classes', 'Trainer Consult', 'Diet Sheet'] },
  { id: 'elite', name: 'Elite', price: 99, duration: 'Month', features: ['24/7 Access', 'Personal Coach', 'Recovery Lounge'] },
];

export type Plan = (typeof pricingPlans)[number];

export const testimonials = [
  { name: 'Arianna', quote: 'The dashboard keeps me accountable and the trainers are world class.' },
  { name: 'Daniel', quote: 'Premium vibe, clean UI, and I always know when my plan is expiring.' },
  { name: 'Mei', quote: 'I upgraded in two clicks and the attendance tracker is super clear.' },
];

export const userProfile = {
  name: 'Sophia Carter',
  email: 'sophia@example.com',
  phone: '+1 555 011 238',
  trainer: 'Alex Johnson',
  fitnessGoal: 'Lean muscle gain',
  currentPlan: 'Performance',
  daysLeft: 5,
  attendance: 18,
  paymentStatus: 'Pending',
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  trainer: string;
  plan: string;
  status: 'Active' | 'Expired' | 'Pending';
  fitnessGoal: string;
  bodyFat: string;
};

export const attendanceHistory = [
  { date: '2026-04-01', checkIn: '07:15 AM', checkOut: '08:42 AM' },
  { date: '2026-04-03', checkIn: '06:58 AM', checkOut: '08:10 AM' },
  { date: '2026-04-05', checkIn: '07:31 AM', checkOut: '08:34 AM' },
  { date: '2026-04-07', checkIn: '07:00 AM', checkOut: '08:20 AM' },
];

export const payments = [
  { id: 'TXN-1001', user: 'Sophia Carter', amount: '$59', date: '2026-03-01', status: 'Paid' },
  { id: 'TXN-1002', user: 'Sophia Carter', amount: '$59', date: '2026-04-01', status: 'Pending' },
  { id: 'TXN-1003', user: 'Noah Kent', amount: '$99', date: '2026-04-10', status: 'Paid' },
  { id: 'TXN-1004', user: 'Amira Lopez', amount: '$35', date: '2026-04-12', status: 'Pending' },
];

export const products = [
  { name: 'Whey Pro Isolate', category: 'Supplements', price: '$42' },
  { name: 'PowerLift Gloves', category: 'Gear', price: '$18' },
  { name: 'Recovery Foam Roller', category: 'Mobility', price: '$24' },
];

export const adminMetrics = {
  users: 2840,
  subscriptions: 2195,
  revenue: '$184,320',
};

export const expiringUsers = [
  { name: 'Sophia Carter', daysLeft: 5 },
  { name: 'Leo Martin', daysLeft: 2 },
  { name: 'Amira Lopez', daysLeft: 1 },
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 12000, growth: 4 },
  { month: 'Feb', revenue: 16000, growth: 7 },
  { month: 'Mar', revenue: 18400, growth: 10 },
  { month: 'Apr', revenue: 20100, growth: 13 },
  { month: 'May', revenue: 22400, growth: 16 },
];

export const userManagementSeed = [
  {
    id: 1,
    name: 'Sophia Carter',
    email: 'sophia@example.com',
    phone: '+1 555 011 238',
    trainer: 'Alex Johnson',
    plan: 'Performance',
    status: 'Pending',
    fitnessGoal: 'Lean muscle gain',
    bodyFat: '23%',
  },
  {
    id: 2,
    name: 'Noah Kent',
    email: 'noah@example.com',
    phone: '+1 555 874 019',
    trainer: 'Mia Chen',
    plan: 'Elite',
    status: 'Active',
    fitnessGoal: 'Strength + conditioning',
    bodyFat: '18%',
  },
];

export const offersSeed = [
  { id: 1, code: 'SPRING20', discount: '20%', validity: '2026-05-30' },
  { id: 2, code: 'FIT10', discount: '10%', validity: '2026-12-31' },
];

export const services = [
  { title: 'Strength Training', description: 'Progressive overload plans with professional coaching.' },
  { title: 'HIIT + Cardio', description: 'High-intensity formats for stamina and fat-loss goals.' },
  { title: 'Recovery Lounge', description: 'Sauna, mobility stations, and guided recovery routines.' },
  { title: 'Nutrition Support', description: 'Macro plans and weekly diet check-ins.' },
];

export const facilities = ['24/7 Access', 'Steam + Sauna', 'Smart Lockers', 'Group Studio', 'Protein Bar', 'Free Wi-Fi'];
