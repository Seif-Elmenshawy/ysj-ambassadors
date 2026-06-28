import 'dotenv/config';
import { connect } from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ysj-ambassadors';

async function createAdmin() {
  try {
    const conn = await connect(MONGO_URI);
    const db = conn.connection.db;

    const existing = await db.collection('admins').findOne({ email: 'admin@ysj.org' });
    if (existing) {
      console.log('Admin already exists. Email: admin@ysj.org');
      await conn.close();
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('admin123', salt);

    await db.collection('admins').insertOne({
      email: 'admin@ysj.org',
      password: hashed,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Admin created: admin@ysj.org / admin123');
    await conn.close();
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

createAdmin();
