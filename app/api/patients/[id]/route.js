import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Patient from '@/models/Patient';

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params; 
    const body = await request.json();
    
    const updated = await Patient.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Patient.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}