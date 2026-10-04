'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ name: '', specialty: '', fee: '', availableDays: '' });
  const [editingId, setEditingId] = useState(null);
  
  // The 7 days of the week for our interactive selector
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetch('/api/doctors').then(res => res.json()).then(data => setDoctors(data));
  }, []);

  // Helper to toggle individual days on/off
  const handleDayToggle = (day) => {
    const currentDays = formData.availableDays 
      ? formData.availableDays.split(', ').filter(Boolean) 
      : [];
    
    let updatedDays;
    if (currentDays.includes(day)) {
      // Remove day if already selected
      updatedDays = currentDays.filter(d => d !== day);
    } else {
      // Add day and sort them logically according to daysOfWeek order
      updatedDays = [...currentDays, day].sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));
    }

    setFormData({ ...formData, availableDays: updatedDays.join(', ') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.availableDays) {
      alert('Please select at least one available day.');
      return;
    }

    const payload = { ...formData, fee: Number(formData.fee) };
    const url = editingId ? `/api/doctors/${editingId}` : '/api/doctors';
    const method = editingId ? 'PUT' : 'POST';
    
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      const savedDoctor = await res.json();
      
      if (savedDoctor && savedDoctor._id) {
        if (editingId) {
          setDoctors(doctors.map(d => d?._id === editingId ? savedDoctor : d));
        } else {
          setDoctors([savedDoctor, ...doctors]);
        }
      }
      
      setEditingId(null);
      setFormData({ name: '', specialty: '', fee: '', availableDays: '' });
    }
  };

  const handleEdit = (d) => { 
    setFormData({ name: d?.name || '', specialty: d?.specialty || '', fee: d?.fee || '', availableDays: d?.availableDays || '' }); 
    setEditingId(d?._id);
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this doctor from the roster?')) return;
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    if (res.ok) setDoctors(doctors.filter(d => d?._id !== id));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', specialty: '', fee: '', availableDays: '' });
  };

  // Convert current availableDays string into an array for checking active styles
  const selectedDaysList = formData.availableDays ? formData.availableDays.split(', ').map(d => d.trim()) : [];

  return (
    <div className="pb-10">
      <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="bg-teal-50 text-teal-600 p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Doctor Profile' : 'Add New Doctor'}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dr. Full Name</label>
              <input required type="text" placeholder="e.g. John Smith" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Specialty</label>
              <input required type="text" placeholder="e.g. Cardiology" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fee ($)</label>
              <input required type="number" placeholder="e.g. 150" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.fee} onChange={e => setFormData({...formData, fee: e.target.value})} />
            </div>

            {/* Interactive 7-Day Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Available Days (Click to select)</label>
              <div className="grid grid-cols-4 gap-2">
                {daysOfWeek.map(day => {
                  const isSelected = selectedDaysList.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Selected: <span className="font-semibold text-teal-700">{formData.availableDays || 'None'}</span>
              </p>
            </div>
            
            <button type="submit" className="w-full mt-2 bg-teal-600 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:bg-teal-700 transition-colors">
              {editingId ? 'Update Profile' : 'Save Doctor'}
            </button>
            
            {editingId && (
              <button type="button" onClick={cancelEdit} 
                className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors mt-2">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-teal-500 mb-6 flex items-center">
            Medical Staff Roster 
            <span className="ml-3 bg-teal-100 text-teal-800 text-xs py-1 px-2.5 rounded-full font-semibold">{doctors.filter(Boolean).length} Active</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {doctors.filter(Boolean).map(d => (
              <div key={d?._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-teal-200 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-lg text-slate-900">Dr. {d?.name || 'Unknown'}</p>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md border border-slate-200">${d?.fee || 0}</span>
                  </div>
                  
                  <div className="inline-flex items-center bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-md mb-3 border border-teal-100">
                    {d?.specialty || 'General'}
                  </div>
                  
                  <p className="text-sm font-medium text-slate-500 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Available: {d?.availableDays || 'Not set'}
                  </p>
                </div>
                
                <div className="mt-5 flex gap-2 pt-4 border-t border-slate-50">
                  <button onClick={() => handleEdit(d)} className="flex-1 text-xs font-semibold text-teal-700 bg-teal-50 py-2 rounded-lg hover:bg-teal-100 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(d?._id)} className="flex-1 text-xs font-semibold text-rose-600 bg-rose-50 py-2 rounded-lg hover:bg-rose-100 transition-colors">Remove</button>
                </div>
              </div>
            ))}
            {doctors.filter(Boolean).length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <p className="text-slate-500 font-medium">No doctors found. Add a doctor to the roster.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}