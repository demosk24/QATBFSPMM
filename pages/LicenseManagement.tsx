
import React, { useState, useEffect } from 'react';
import { Key, Copy, X, Edit3, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

const LicenseManagement: React.FC = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ token: '', email: '', expiration: '' });

  const isSuperAdmin = auth.currentUser?.email === 'dokkustic@admin.com';

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'qx-autoTrading-bot-access-key'), (snap) => {
      setLicenses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'QX-';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 3 || i === 7) result += '-';
    }
    setForm(prev => ({ ...prev, token: result }));
  };

  const openEdit = (license: any) => {
    let expDate = '';
    if (license.endDate) {
      const date = license.endDate instanceof Timestamp ? license.endDate.toDate() : new Date(license.endDate);
      const tzOffset = date.getTimezoneOffset() * 60000;
      expDate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    }
    setForm({ token: license.todayUserAccessKey || '', email: license.email || '', expiration: expDate });
    setCurrentId(license.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'qx-autoTrading-bot-access-key', currentId), {
        todayUserAccessKey: form.token.toUpperCase(), 
        endDate: Timestamp.fromDate(new Date(form.expiration)),
        updatedAt: Timestamp.now(),
      }, { merge: true });
      setSuccess('REGISTRY UPDATED');
      setTimeout(() => { setSuccess(''); setIsModalOpen(false); }, 1000);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const removeLicense = async (id: string) => {
    if (!isSuperAdmin) return;
    if (window.confirm("PURGE THIS PROTOCOL?")) {
      await deleteDoc(doc(db, 'qx-autoTrading-bot-access-key', id));
      setSuccess('PROTOCOL DELETED');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const copyToClipboard = (txt: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setSuccess('COPIED');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      {success && (
        <div className="fixed bottom-4 right-4 z-[100] px-4 py-2 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-[8px] font-mono font-black uppercase tracking-widest animate-in slide-in-from-right">
          {success}
        </div>
      )}

      <div>
        <h1 className="text-lg md:text-xl font-orbitron font-black text-white tracking-tighter uppercase">Dark Web</h1>
        <p className="text-slate-600 font-mono text-[7px] uppercase tracking-[0.4em] font-black opacity-60">Key Distribution Registry</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {licenses.map((license) => (
          <div key={license.id} className="glass-card p-4 rounded-xl border border-white/5 bg-[#050505]/60 hover:border-cyber-cyan/20 transition-all flex flex-col justify-between h-44 group overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
               <ShieldAlert className="w-16 h-16 text-cyber-cyan" />
             </div>
             
             <div>
               <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 rounded bg-cyber-cyan/5 border border-cyber-cyan/10"><Key className="w-3 h-3 text-cyber-cyan" /></div>
                   <span className="font-orbitron font-bold text-white text-[9px] uppercase tracking-tighter truncate max-w-[80px]">Node_{license.id.slice(0,4)}</span>
                 </div>
                 <span className={`text-[6px] font-black px-1.5 py-0.5 rounded uppercase ${license.todayUserAccessKey ? 'bg-cyber-green/10 text-cyber-green' : 'bg-white/5 text-slate-500'}`}>
                   {license.todayUserAccessKey ? 'active' : 'idle'}
                 </span>
               </div>

               <div className="space-y-2">
                 <div>
                   <label className="text-[6px] font-mono text-slate-600 uppercase font-black block mb-1">Access Token</label>
                   <div className="flex items-center gap-2 bg-black/80 px-2 py-1.5 rounded border border-white/5">
                     <span className={`flex-1 font-mono text-[9px] truncate font-black tracking-widest ${license.todayUserAccessKey ? 'text-cyber-cyan' : 'text-slate-800'}`}>
                       {license.todayUserAccessKey || "NULL_KEY"}
                     </span>
                     <button onClick={() => copyToClipboard(license.todayUserAccessKey)} className="text-slate-600 hover:text-white"><Copy className="w-2.5 h-2.5" /></button>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div>
                     <label className="text-[6px] font-mono text-slate-600 uppercase font-black">Node</label>
                     <p className="text-[8px] font-bold text-slate-300 truncate uppercase">{license.email?.split('@')[0] || "---"}</p>
                   </div>
                   <div>
                     <label className="text-[6px] font-mono text-slate-600 uppercase font-black">Expiry</label>
                     <p className="text-[8px] font-mono text-slate-400 font-bold uppercase">{license.endDate ? (license.endDate instanceof Timestamp ? license.endDate.toDate().toISOString().split('T')[0] : new Date(license.endDate).toISOString().split('T')[0]) : '---'}</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
               <button onClick={() => openEdit(license)} className="flex-1 py-1.5 bg-cyber-cyan/5 border border-cyber-cyan/10 text-cyber-cyan text-[8px] font-orbitron font-black rounded uppercase hover:bg-cyber-cyan/10">Update</button>
               <button onClick={() => removeLicense(license.id)} className="px-2 py-1.5 border border-white/5 text-slate-700 hover:text-cyber-red hover:bg-cyber-red/5 rounded"><Trash2 className="w-2.5 h-2.5" /></button>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-xs glass-card p-6 rounded-2xl border border-cyber-cyan/20 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-600 hover:text-white"><X className="w-4 h-4" /></button>
            <h2 className="font-orbitron text-base font-black text-white mb-6 uppercase tracking-tighter">Protocol Injection</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input type="text" value={form.token} onChange={(e) => setForm({...form, token: e.target.value.toUpperCase()})} placeholder="Access Key" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 pr-10 text-white text-[11px] font-mono outline-none" />
                <button type="button" onClick={generateRandomKey} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyber-cyan hover:bg-cyber-cyan/10 rounded"><Sparkles className="w-3 h-3" /></button>
              </div>
              <input type="datetime-local" required value={form.expiration} onChange={(e) => setForm({...form, expiration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-[11px] font-mono outline-none" />
              <button type="submit" className="w-full py-3.5 bg-cyber-cyan text-black font-orbitron font-black text-[10px] rounded-lg uppercase">{loading ? 'Working...' : 'Commit Protocol'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseManagement;
