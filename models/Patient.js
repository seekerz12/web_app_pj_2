import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  allergies: { type: String, default: 'None' },
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);