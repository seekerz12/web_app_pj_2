'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [formData, setFormData] = useState({ patientId: '', doctorId: '', appointmentDate: '', status: 'Scheduled' });
  const [editingId, setEditingId] = useState(null);

  // State to control our custom error pop-up modal
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then(async res => res.ok ? await res.json() : []),
      fetch('/api/patients').then(async res => res.ok ? await res.json() : []),
      fetch('/api/doctors').then(async res => res.ok ? await res.json() : [])
    ]).then(([appointmentsData, patientsData, doctorsData]) => {
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    }).catch(err => {
      console.error("Failed to fetch initial data:", err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/appointments/${editingId}` : '/api/appointments';
    const method = editingId ? 'PUT' : 'POST';
    
    const res = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(formData) 
    });

    const data = await res.json();

    if (!res.ok) {
      // Trigger our custom pop-up modal instead of an alert()
      setBookingError(data.error || 'Failed to save appointment');
      return;
    }

    if (data && data._id) {
      if (editingId) {
        setAppointments(appointments.map(a => a?._id === editingId ? data : a));
      } else {
        setAppointments([...appointments, data]);
      }
    }
    cancelEdit();
  };

  const handleEdit = (appt) => {
    if (!appt?.appointmentDate) return;
    const dateObj = new Date(appt.appointmentDate);
    const localIso = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setFormData({ 
      patientId: appt?.patientId?._id || '', 
      doctorId: appt?.doctorId?._id || '', 
      appointmentDate: localIso, 
      status: appt?.status || 'Scheduled' 
    });
    setEditingId(appt?._id);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm('Are you sure you want to permanently delete this appointment?')) return;
    
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAppointments(appointments.filter(a => a?._id !== id));
    } else {
      alert('Failed to delete appointment from database.');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ patientId: '', doctorId: '', appointmentDate: '', status: 'Scheduled' });
  };

  return (
    <div className="pb-10 relative">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="bg-teal-50 text-teal-600 p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Update Booking' : 'Book Session'}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Patient</label>
              <select required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="" disabled>Select Patient</option>
                {patients.filter(Boolean).map(p => <option key={p?._id} value={p?._id}>{p?.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor</label>
              <select required className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                <option value="" disabled>Select Doctor</option>
                {doctors.filter(Boolean).map(d => <option key={d?._id} value={d?._id}>Dr. {d?.name} ({d?.specialty}) - [{d?.availableDays}]</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date & Time</label>
              <input required type="datetime-local" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} />
            </div>

            {editingId && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full mt-4 bg-teal-600 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:bg-teal-700 transition-colors">
              {editingId ? 'Save Changes' : 'Book Appointment'}
            </button>
            
            {editingId && <button type="button" onClick={cancelEdit} className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors mt-2">Cancel</button>}
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-teal-500 mb-6 flex items-center">
            Upcoming Appointments
          </h2>
          
          <div className="flex flex-col gap-4">
            {appointments.filter(Boolean).map(a => (
              <div key={a?._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-teal-200 transition-colors">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-lg text-slate-900">
                      {a?.appointmentDate ? new Date(a.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Invalid Date'}
                    </p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${
                      a?.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      a?.status === 'Completed' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>{a?.status || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium text-slate-600 gap-4 mt-2">
                    <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <svg className="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      Dr. {a?.doctorId?.name || 'Unknown'}
                    </span>
                    <span className="flex items-center bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      {a?.patientId?.name || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="flex w-full md:w-auto gap-2">
                  <button onClick={() => handleEdit(a)} className="flex-1 md:flex-none px-4 text-xs font-semibold text-teal-700 bg-teal-50 py-2 rounded-lg hover:bg-teal-100 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(a?._id)} className="flex-1 md:flex-none px-4 text-xs font-semibold text-rose-600 bg-rose-50 py-2 rounded-lg hover:bg-rose-100 transition-colors">Cancel</button>
                </div>
              </div>
            ))}
            {appointments.filter(Boolean).length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-slate-500 font-medium">No scheduled appointments.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CUSTOM ERROR POP-UP MODAL */}
      {bookingError && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">Booking Conflict</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{bookingError}</p>
            
            <button 
              onClick={() => setBookingError(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}