
import React, { useState, useEffect } from 'react';
import { Key, Copy, Plus, X, User as UserIcon, Calendar, Shield, Edit3, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

const LicenseManagement: React.FC = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    token: '',
    email: '', 
    expiration: '',
  });

  const isSuperAdmin = auth.currentUser?.email === 'dokkustic@admin.com';

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'qx-autoTrading-bot-access-key'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLicenses(data);
    }, (err) => {
      console.error("Firestore error:", err);
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
      // Format to datetime-local
      const tzOffset = date.getTimezoneOffset() * 60000;
      expDate = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    }
    setForm({ 
      token: license.todayUserAccessKey || '', 
      email: license.email || '', 
      expiration: expDate 
    });
    setCurrentId(license.id);
    setIsEdit(true);
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

      setSuccess('REGISTRY UPDATE SUCCESS');
      setTimeout(() => {
        setSuccess('');
        setIsModalOpen(false);
      }, 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeLicense = async (id: string) => {
    if (!isSuperAdmin) return;
    if (window.confirm("PURGE THIS PROTOCOL FROM DATABASE?")) {
      await deleteDoc(doc(db, 'qx-autoTrading-bot-access-key', id));
      setSuccess('PROTOCOL DELETED');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const copyToClipboard = (txt: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    setSuccess('TOKEN COPIED');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {success && (
        <div className="fixed bottom-4 right-4 z-[100] px-5 py-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan shadow-xl animate-in slide-in-from-right">
          <span className="text-[9px] font-mono font-black uppercase tracking-widest">{success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-orbitron font-black text-white tracking-tighter uppercase">Dark Web</h1>
          <p className="text-slate-500 font-mono text-[8px] uppercase tracking-[0.4em] mt-1 font-black opacity-60">Protocol Matrix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {licenses.map((license) => (
          <div key={license.id} className="glass-card p-5 rounded-xl border border-white/5 relative group hover:border-cyber-cyan/30 transition-all bg-[#050505]/60 overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05]">
              <ShieldAlert className="w-20 h-20 text-cyber-cyan" />
            </div>

            <div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20">
                    <Key className="w-4 h-4 text-cyber-cyan" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-orbitron font-black text-white uppercase text-[10px] tracking-tight truncate">Protocol {license.id.substring(0, 4)}</h3>
                    <p className="text-[7px] font-mono text-slate-600 font-black tracking-widest uppercase">NODE: {license.email?.split('@')[0] || "---"}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-full border text-[6px] font-black uppercase tracking-tighter ${license.todayUserAccessKey ? 'bg-cyber-green/5 text-cyber-green border-cyber-green/20' : 'bg-slate-500/10 text-slate-500 border-white/10'}`}>
                  {license.todayUserAccessKey ? 'active' : 'idle'}
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-[7px] font-mono text-slate-600 uppercase font-black pl-1">todayUserAccessKey</label>
                  <div className="flex items-center gap-2 bg-black/60 p-2.5 rounded-lg border border-white/[0.05] group-hover:border-cyber-cyan/30 transition-all shadow-inner relative overflow-hidden">
                    <span className={`flex-1 font-mono text-[10px] tracking-widest truncate uppercase font-black ${license.todayUserAccessKey ? 'text-cyber-cyan' : 'text-slate-800 italic'}`}>
                      {license.todayUserAccessKey || "null"}
                    </span>
                    <button onClick={() => copyToClipboard(license.todayUserAccessKey)} className="p-1 text-slate-600 hover:text-white transition-all bg-white/[0.03] rounded-md border border-white/10 shrink-0">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-4">
                  <div className="space-y-1">
                    <label className="text-[7px] font-mono text-slate-600 uppercase font-black">Identified Node</label>
                    <p className="text-[8px] font-black text-white font-orbitron truncate uppercase">{license.email || "---"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] font-mono text-slate-600 uppercase font-black">Expiry</label>
                    <p className="text-[8px] font-mono text-slate-300 font-black uppercase">
                      {license.endDate ? (license.endDate instanceof Timestamp ? license.endDate.toDate().toISOString().split('T')[0] : new Date(license.endDate).toISOString().split('T')[0]) : '---'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.05] flex gap-2 relative z-10 text-[8px] font-orbitron font-black">
              <button 
                onClick={() => openEdit(license)}
                className="flex-1 py-2 bg-cyber-cyan/5 border border-cyber-cyan/20 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/10 transition-all flex items-center justify-center gap-1.5 uppercase tracking-tighter"
              >
                <Edit3 className="w-3 h-3" /> Update
              </button>
              <button 
                onClick={() => removeLicense(license.id)}
                className="px-2 py-2 border border-cyber-red/20 text-cyber-red/40 rounded-lg hover:bg-cyber-red/10 hover:text-cyber-red transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {licenses.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card rounded-xl border-dashed border-white/10 opacity-30">
            <Key className="w-10 h-10 text-slate-600 mx-auto mb-4 animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">Waiting for Data Shards...</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card p-6 md:p-8 rounded-2xl border border-cyber-cyan/30 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white p-2"><X className="w-5 h-5" /></button>
            <h2 className="font-orbitron text-lg font-black text-white mb-1 uppercase tracking-tighter">Protocol Injection</h2>
            <p className="text-slate-500 font-mono text-[8px] uppercase tracking-widest mb-6 font-black opacity-60 italic truncate">Node: {form.email}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[8px] font-mono text-slate-600 uppercase tracking-widest pl-2">Access Key</label>
                <div className="relative group">
                  <input
                    type="text" value={form.token}
                    onChange={(e) => setForm({...form, token: e.target.value.toUpperCase()})}
                    placeholder="BOT-KEY-XXXXX"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl py-3 px-4 pr-10 text-white focus:outline-none focus:border-cyber-cyan/40 font-mono text-xs uppercase"
                  />
                  <button 
                    type="button"
                    onClick={generateRandomKey}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyber-cyan hover:bg-cyber-cyan/10 rounded-lg transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-mono text-slate-600 uppercase tracking-widest pl-2">Protocol Expiry</label>
                <input
                  type="datetime-local" required value={form.expiration}
                  onChange={(e) => setForm({...form, expiration: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyber-cyan/40 font-mono text-[9px] uppercase"
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-3.5 bg-cyber-cyan text-black font-orbitron font-black text-[10px] rounded-xl shadow-lg transition-all uppercase tracking-[0.3em] mt-2"
              >
                {loading ? 'WAIT...' : 'Commit Protocol'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseManagement;
