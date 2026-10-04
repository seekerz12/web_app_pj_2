import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient'; // Required for populate

// 1. GET: Fetch all appointments and populate patient/doctor details
export async function GET() {
  try {
    await connectToDatabase();
    const appointments = await Appointment.find({})
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialty');
      
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// 2. POST: Validate schedule and create new appointment
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Fetch the doctor to check available days
    const doctor = await Doctor.findById(body.doctorId);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Safely parse the datetime-local string to avoid timezone shifts
    const [datePart] = body.appointmentDate.split('T'); 
    const [year, month, day] = datePart.split('-').map(Number);
    const apptDate = new Date(year, month - 1, day);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[apptDate.getDay()];

    // Check availability
    const availableDaysString = doctor.availableDays || '';
    const isAvailable = availableDaysString.includes(dayName);

    if (!isAvailable) {
      return NextResponse.json(
        { error: `Doctor ${doctor.name} is only available on: ${doctor.availableDays}. You tried booking on a ${dayName}.` }, 
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await Appointment.create(body);
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name specialty');
      
    return NextResponse.json(populatedAppointment, { status: 201 });
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}