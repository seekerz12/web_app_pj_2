import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  fee: { type: Number, required: true },
  availableDays: { type: String, default: 'Mon-Fri' }, // e.g., "Mon, Wed, Fri"
}, { timestamps: true });

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);