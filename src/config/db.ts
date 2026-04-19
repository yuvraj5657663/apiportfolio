import mongoose from 'mongoose';
import { Admin } from '../models/Admin.js';

export const connectDB = async () => {
  console.log("env file",process.env.MONGODB_URI)
  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed admin user if it doesn't exist
    await seedAdminUser();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    // In a managed environment, we might not want to exit the process
    // process.exit(1);
  }
};

async function seedAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'yuvrajkumar4588@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Yuvraj@123';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new Admin({
        email: adminEmail,
        password: adminPassword,
      });
      await admin.save();
      console.log('Admin user created automatically');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}
