import { connectToDatabase } from '../lib/mongodb';

export const initializeDatabase = async () => {
  try {
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};