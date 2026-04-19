import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  ip: { type: String },
  userAgent: { type: String },
  country: { type: String },
  device: { type: String },
}, { timestamps: true });

export const Visit = mongoose.model('Visit', visitSchema);
