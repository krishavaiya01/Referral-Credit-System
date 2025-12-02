import mongoose from 'mongoose';

export const connectDB = async (uri: string) => {
  await mongoose.connect(uri);
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};
