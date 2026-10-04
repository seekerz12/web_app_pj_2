'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ name: '', phone: '', allergies: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        // Safeguard against API returning unexpected errors instead of arrays
        setPatients(Array.isArray(data) ? data : []);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/patients/${editingId}` : '/api/patients';
    const method = editingId ? 'PUT' : 'POST';
    
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) {
      const saved = await res.json();
      
      // Strictly verify the backend sent a valid object back
      if (saved && saved._id) {
        if (editingId) {
          setPatients(patients.map(p => p?._id === editingId ? saved : p));
        } else {
          setPatients([saved, ...patients]);
        }
      }
      
      setEditingId(null);
      setFormData({ name: '', phone: '', allergies: '' });
    }
  };

  const handleEdit = (p) => { 
    setFormData({ 
      name: p?.name || '', 
      phone: p?.phone || '', 
      allergies: p?.allergies || '' 
    }); 
    setEditingId(p?._id); 
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this patient record?')) return;
    const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
    if (res.ok) setPatients(patients.filter(p => p?._id !== id));
  };

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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Patient Record' : 'Register Patient'}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input required type="text" placeholder="e.g. Jane Doe" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
              <input required type="tel" placeholder="e.g. (555) 123-4567" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Allergies / Medical Alerts</label>
              <input type="text" placeholder="e.g. Penicillin, Peanuts (Optional)" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-sm" 
                value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} />
            </div>
            
            <button type="submit" className="w-full mt-4 bg-teal-600 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:bg-teal-700 transition-colors">
              {editingId ? 'Update Record' : 'Save Patient'}
            </button>
            
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', phone:'', allergies:''})}} 
                className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors mt-2">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* List Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-teal-500 mb-6 flex items-center">
            Patient Directory 
            <span className="ml-3 bg-teal-100 text-teal-800 text-xs py-1 px-2.5 rounded-full font-semibold">{patients.filter(Boolean).length} Total</span>
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {patients.filter(Boolean).map(p => (
              <div key={p?._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-teal-200 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-lg text-teal-500">{p?.name || 'Unknown Patient'}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500 flex items-center mb-2">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    {p?.phone || 'No phone number'}
                  </p>
                  {p?.allergies ? (
                    <div className="inline-flex items-center bg-rose-50 text-rose-600 text-xs font-semibold px-2.5 py-1 rounded-md mt-1 border border-rose-100">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      {p.allergies}
                    </div>
                  ) : (
                    <div className="inline-block bg-slate-50 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-md mt-1">No reported allergies</div>
                  )}
                </div>
                
                <div className="mt-5 flex gap-2 pt-4 border-t border-slate-50">
                  <button onClick={() => handleEdit(p)} className="flex-1 text-xs font-semibold text-teal-700 bg-teal-50 py-2 rounded-lg hover:bg-teal-100 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(p?._id)} className="flex-1 text-xs font-semibold text-rose-600 bg-rose-50 py-2 rounded-lg hover:bg-rose-100 transition-colors">Delete</button>
                </div>
              </div>
            ))}
            {patients.filter(Boolean).length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <p className="text-slate-500 font-medium">No valid patients found. Add a patient to get started.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}