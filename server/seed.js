import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import Ambassador from './models/Ambassador.js';
import Referral from './models/Referral.js';

const ambassadors = [
  { name: 'Kerlos Maged', email: 'kerlos@ysj.org', password: 'ambassador123', phone: '+20 100 000 0001', referralCode: 'YSJ-001', totalReferrals: 32, rewards: 28, score: 45, country: 'Egypt', state: 'Cairo Governorate', city: 'Cairo', organization: 'Cairo University',  bio: 'Passionate about AI and scientific research. Leading YSJ outreach in Egypt.' },
  { name: 'Seif Elmeneshawy', email: 'seif@ysj.org', password: 'ambassador123', phone: '+20 100 000 0002', referralCode: 'YSJ-002', totalReferrals: 24, rewards: 20, score: 35, country: 'Egypt', state: 'Giza Governorate', city: 'Giza', organization: 'Ain Shams University',  bio: 'Medical student dedicated to bridging clinical research and youth engagement.' },
  { name: 'Mohammed Assem', email: 'assem@ysj.org', password: 'ambassador123', phone: '+20 100 000 0003', referralCode: 'YSJ-003', totalReferrals: 18, rewards: 15, score: 25, country: 'Egypt', state: 'Alexandria Governorate', city: 'Alexandria', organization: 'Alexandria University',  bio: 'Engineering researcher focused on sustainable development and youth mentorship.' },
  { name: 'Zeyad Ahmed', email: 'zeyad@ysj.org', password: 'ambassador123', phone: '+20 100 000 0004', referralCode: 'YSJ-004', totalReferrals: 12, rewards: 10, score: 18, country: 'Saudi Arabia', state: 'Riyadh Province', city: 'Riyadh', organization: 'King Saud University',  bio: 'Biology enthusiast exploring genetics and molecular research.' },
  { name: 'Nourhan Ali', email: 'nourhan@ysj.org', password: 'ambassador123', phone: '+20 100 000 0005', referralCode: 'YSJ-005', totalReferrals: 7, rewards: 5, score: 10, country: 'UAE', state: 'Dubai Emirate', city: 'Dubai', organization: 'University of Sharjah',  bio: 'Chemistry researcher passionate about environmental science and green chemistry.' },
  { name: 'Mariam Youssef', email: 'mariam@ysj.org', password: 'ambassador123', phone: '+20 100 000 0006', referralCode: 'YSJ-006', totalReferrals: 3, rewards: 2, score: 5, country: 'Jordan', state: 'Amman Governorate', city: 'Amman', organization: 'University of Jordan',  bio: 'Pharmacy student interested in pharmacology research and community outreach.' },
  { name: 'Omar Khaled', email: 'omar@ysj.org', password: 'ambassador123', phone: '+20 100 000 0007', referralCode: 'YSJ-007', totalReferrals: 1, rewards: 0, score: 0, country: 'Morocco', state: 'Casablanca-Settat', city: 'Casablanca', organization: 'Hassan II University',  bio: 'Physics enthusiast just starting his YSJ ambassador journey.' },
];

const referredNames = [
  'Ahmed Hassan', 'Mona Ibrahim', 'Yara Mahmoud', 'Kareem Nabil', 'Salma Reda',
  'Ali Shaker', 'Dina Mostafa', 'Hassan Gamil', 'Laila Samir', 'Tamer Hossam',
  'Nadia Fathy', 'Sherif Adel', 'Rana Magdy', 'Youssef Kamal', 'Heba Tarek',
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Ambassador.deleteMany({});
    await Referral.deleteMany({});

    // Create admin
    const admin = await Admin.create({
      email: 'admin@ysj.org',
      password: 'admin123',
    });
    console.log(`Admin created: admin@ysj.org / admin123 (ID: ${admin._id})`);

    // Create ambassadors
    for (const a of ambassadors) {
      const ambassador = await Ambassador.create({
        name: a.name,
        email: a.email,
        password: a.password,
        phone: a.phone,
        referralCode: a.referralCode,
        totalReferrals: a.totalReferrals,
        rewards: a.rewards,
        score: a.score,
        country: a.country,
        state: a.state,
        city: a.city,
        organization: a.organization,

        bio: a.bio,
      });

      // Create referrals for each ambassador
      for (let i = 0; i < a.totalReferrals; i++) {
        const refName = referredNames[Math.floor(Math.random() * referredNames.length)];
        const statuses = ['approved', 'approved', 'approved', 'pending', 'rejected']; // weight toward approved
        const status = i < a.rewards ? 'approved' : statuses[Math.floor(Math.random() * statuses.length)];
        const daysAgo = Math.floor(Math.random() * 90);
        const createdAt = new Date(Date.now() - daysAgo * 86400000);

        await Referral.create({
          ambassadorId: ambassador._id,
          referredName: refName,
          referredEmail: `${refName.toLowerCase().replace(/\s+/g, '.')}${i}@example.com`,
          status,
          notes: status === 'rejected' ? 'Invalid email' : '',
          createdAt,
        });
      }
      console.log(`Ambassador: ${a.name} (${a.referralCode}) — ${a.totalReferrals} referrals, ${a.rewards} rewards, ${a.score} pts`);
    }

    console.log('\n--- Seed complete ---');
    console.log('Admin login:  admin@ysj.org / admin123');
    console.log('Ambassador login (any):  e.g. kerlos@ysj.org / ambassador123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
