import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ysj-ambassadors';

const EMAIL = 'seif.ahmed.3849@gmail.com';
const PASSWORD = 'saif2772009';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    const existing = await db.collection('admins').findOne({ email: EMAIL });
    if (existing) {
      console.log('Admin already exists:', EMAIL);
      await mongoose.disconnect();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(PASSWORD, salt);

    await db.collection('admins').insertOne({
      email: EMAIL,
      password: hashed,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Admin created:', EMAIL);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

createAdmin();
