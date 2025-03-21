import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

const client = new MongoClient(uri);
const clientPromise = client.connect();

export const connectToDB = async () => {
  try {
    await mongoose.connect(uri, { dbName: 'wavemart' });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default clientPromise;
