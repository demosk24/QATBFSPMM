
import React, { useState, useEffect } from 'react';
import { Plus, X, Lock, Mail, Trash2, Shield, User as UserIcon, AlertTriangle, Fingerprint, Activity, Key } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy, limit, addDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth, firebaseConfig } from '../firebase';

const UserManagement: React.FC = () => {
  const [identities, setIdentities] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState({ email: '', password: '' });

  const isSuperAdmin = auth.currentUser?.email === 'dokkustic@admin.com';

  useEffect(() => {
    if (!isSuperAdmin) return;
    if (!firebaseConfig.apiKey) {
      setError("CRITICAL ERROR: Environment variables missing. Check Vercel Settings.");
      return;
    }

    const qUsers = query(collection(db, 'qx-autoTrading-bot-access-key'), orderBy('provisionedAt', 'desc'));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setIdentities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error(err);
      setError("SECURITY EXCEPTION: Registry connection failed.");
    });

    const qLogs = query(collection(db, 'qx-activity-logs'), orderBy('timestamp', 'desc'), limit(20));
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubUsers(); unsubLogs(); };
  }, [isSuperAdmin]);

  const logActivity = async (action: string, detail: string) => {
    try {
      await addDoc(collection(db, 'qx-activity-logs'), {
        action, detail, timestamp: serverTimestamp(), admin: auth.currentUser?.email
      });
    } catch (e) { console.error(e); }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setLoading(true); setError(''); setSuccess('');

    try {
      let secondaryApp;
      if (getApps().find(app => app.name === 'SecondaryProvisioning')) {
        secondaryApp = getApp('SecondaryProvisioning');
      } else {
        secondaryApp = initializeApp(firebaseConfig, 'SecondaryProvisioning');
      }
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password);
      const uid = userCredential.user.uid;
      await signOut(secondaryAuth);

      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 30);

      await setDoc(doc(db, 'qx-autoTrading-bot-access-key', uid), {
        email: form.email,
        uid: uid,
        todayUserAccessKey: "", 
        password: form.password, 
        endDate: Timestamp.fromDate(defaultExpiry),
        provisionedAt: serverTimestamp(),
        status: 'ACTIVE'
      });

      await logActivity('PROVISION', `Node Deployed: ${form.email}`);
      setSuccess('NODE AUTHORIZED');
      setTimeout(() => setIsModalOpen(false), 1500);
      setForm({ email: '', password: '' });
    } catch (err: any) { setError(`FAILED: ${err.message}`); } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedUserId) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'qx-autoTrading-bot-access-key', selectedUserId), {
        password: newPassword, lastPasswordUpdate: serverTimestamp()
      });
      setSuccess('PASSWORD OVERRIDE SUCCESSFUL');
      setTimeout(() => setIsPassModalOpen(false), 1000);
      setNewPassword('');
    } catch (err: any) { setError(`FAILED: ${err.message}`); } finally { setLoading(false); }
  };

  const removeUser = async (id: string, email: string) => {
    if (!isSuperAdmin) return;
    if (window.confirm(`PURGE TERMINAL FOR ${email}?`)) {
      await deleteDoc(doc(db, 'qx-autoTrading-bot-access-key', id));
      setSuccess('DATA SHARD PURGED');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="h-[60vh] flex items-center justify-center p-4">
        <div className="glass-card p-6 rounded-2xl border border-cyber-red/20 text-center max-w-xs">
          <AlertTriangle className="w-8 h-8 text-cyber-red mx-auto mb-3 animate-pulse" />
          <h2 className="font-orbitron text-sm font-bold text-white mb-2 uppercase">Unauthorized Access</h2>
          <p className="text-slate-500 font-mono text-[8px] uppercase tracking-widest leading-relaxed">Identity verification required for terminal access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      {(error || success) && (
        <div className={`fixed bottom-4 right-4 z-[100] p-3 rounded-lg border shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300 max-w-xs ${
          error ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red' : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-cyber-red' : 'bg-cyber-green'} shrink-0 animate-pulse`} />
          <span className="text-[8px] font-mono font-black uppercase tracking-tight truncate">{error || success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-orbitron font-black text-white tracking-tighter uppercase">Attack Surface</h1>
          <p className="text-slate-600 font-mono text-[7px] uppercase tracking-[0.4em] font-black opacity-60">Provisioning Core</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-cyber-cyan text-black font-orbitron font-black text-[9px] rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all uppercase"
        >
          <Plus className="w-3.5 h-3.5" /> Deploy Node
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {identities.map((user) => (
              <div key={user.id} className="glass-card p-3.5 rounded-xl border border-white/5 bg-[#050505]/40 hover:border-cyber-cyan/20 transition-all group flex flex-col justify-between h-36">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-cyber-cyan">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-orbitron font-bold text-white truncate uppercase">{user.email.split('@')[0]}</p>
                      <p className="text-[7px] font-mono text-slate-600 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/5 flex justify-between items-center mb-3">
                    <p className="text-[8px] font-mono text-cyber-cyan/40 tracking-widest truncate uppercase">••••••••</p>
                    <button onClick={() => { setSelectedUserId(user.id); setIsPassModalOpen(true); }} className="p-1 text-slate-600 hover:text-cyber-cyan transition-colors rounded-md">
                      <Key className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeUser(user.id, user.email)} className="w-full py-1.5 bg-cyber-red/5 border border-cyber-red/10 rounded-lg text-[7px] text-cyber-red/50 hover:text-cyber-red hover:bg-cyber-red/10 transition-all font-mono font-black uppercase flex items-center justify-center gap-1.5">
                  <Trash2 className="w-2.5 h-2.5" /> Purge
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 glass-card rounded-xl border border-white/5 bg-[#030303] p-4 h-[300px] lg:h-full flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3 h-3 text-cyber-cyan" />
            <h2 className="font-orbitron text-[8px] font-black text-white uppercase tracking-widest">Journal</h2>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {logs.map((log) => (
              <div key={log.id} className="border-l border-white/5 pl-2.5 py-0.5 mb-2">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[6px] font-mono font-black px-1 rounded-sm uppercase ${log.action === 'PROVISION' ? 'text-cyber-cyan bg-cyber-cyan/5' : 'text-cyber-yellow bg-cyber-yellow/5'}`}>{log.action}</span>
                  <span className="text-[6px] font-mono text-slate-700 tracking-tighter">{log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-500 font-medium text-[8px] leading-tight truncate">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-xs glass-card p-6 rounded-2xl border border-cyber-cyan/20 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-600 hover:text-white"><X className="w-4 h-4" /></button>
            <h2 className="font-orbitron text-base font-black text-white mb-6 uppercase tracking-tighter">New Node Deployment</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Operator Email" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-[11px] outline-none focus:border-cyber-cyan/30" />
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Access Password" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-[11px] outline-none focus:border-cyber-cyan/30" />
              <button type="submit" className="w-full py-3.5 bg-cyber-cyan text-black font-orbitron font-black text-[10px] rounded-lg uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">{loading ? 'Working...' : 'Provision Node'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-xs glass-card p-6 rounded-2xl border border-cyber-yellow/20 relative shadow-2xl">
            <button onClick={() => setIsPassModalOpen(false)} className="absolute top-4 right-4 text-slate-600 hover:text-white"><X className="w-4 h-4" /></button>
            <h2 className="font-orbitron text-base font-black text-white mb-6 uppercase tracking-tighter text-cyber-yellow">Manual Override</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Cipher" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-[11px] outline-none focus:border-cyber-yellow/30" />
              <button type="submit" className="w-full py-3.5 bg-cyber-yellow text-black font-orbitron font-black text-[10px] rounded-lg uppercase transition-all">{loading ? 'Updating...' : 'Commit Change'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
