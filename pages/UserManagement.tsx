
import React, { useState, useEffect } from 'react';
/* Added Terminal to the imports from lucide-react to fix the "Cannot find name 'Terminal'" error */
import { Plus, X, Lock, Mail, Trash2, Shield, User as UserIcon, AlertTriangle, Fingerprint, Activity, Key, Terminal } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy, limit, addDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth, firebaseConfig, isConfigValid } from '../firebase';

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

  const isSuperAdmin = auth?.currentUser?.email === 'dokkustic@admin.com';

  useEffect(() => {
    if (!isSuperAdmin || !db || !isConfigValid) return;

    const qUsers = query(collection(db, 'qx-autoTrading-bot-access-key'), orderBy('provisionedAt', 'desc'));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setIdentities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error(err);
      setError("SECURITY EXCEPTION: Registry connection dropped.");
    });

    const qLogs = query(collection(db, 'qx-activity-logs'), orderBy('timestamp', 'desc'), limit(20));
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubUsers(); unsubLogs(); };
  }, [isSuperAdmin]);

  const logActivity = async (action: string, detail: string) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'qx-activity-logs'), {
        action, detail, timestamp: serverTimestamp(), admin: auth?.currentUser?.email
      });
    } catch (e) { console.error(e); }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !db) return;
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
    if (!isSuperAdmin || !selectedUserId || !db) return;
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
    if (!isSuperAdmin || !db) return;
    if (window.confirm(`PURGE TERMINAL FOR ${email}?`)) {
      await deleteDoc(doc(db, 'qx-autoTrading-bot-access-key', id));
      setSuccess('DATA SHARD PURGED');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="h-[60vh] flex items-center justify-center p-4">
        <div className="glass-card p-10 rounded-3xl border border-cyber-red/20 text-center max-w-xs space-y-4">
          <AlertTriangle className="w-10 h-10 text-cyber-red mx-auto animate-pulse" />
          <div className="space-y-1">
            <h2 className="font-orbitron text-base font-black text-white uppercase">Unauthorized Access</h2>
            <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest leading-relaxed">Identity verification required for terminal access.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      {(error || success) && (
        <div className={`fixed bottom-8 right-8 z-[110] p-4 rounded-2xl border shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300 max-w-xs ${
          error ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red shadow-cyber-red/10' : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green shadow-cyber-green/10'
        }`}>
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-cyber-red' : 'bg-cyber-green'} shrink-0 animate-pulse`} />
          <span className="text-[9px] font-mono font-black uppercase tracking-widest truncate">{error || success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-orbitron font-black text-white tracking-tighter uppercase">Attack Surface</h1>
          <p className="text-slate-600 font-mono text-[8px] uppercase tracking-[0.4em] font-black opacity-60">Provisioning Core Alpha</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-cyber-cyan text-black font-orbitron font-black text-[10px] rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" /> Deploy Node
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {identities.map((user) => (
              <div key={user.id} className="glass-card p-5 rounded-2xl border border-white/5 bg-[#050505]/60 hover:border-cyber-cyan/30 transition-all group flex flex-col justify-between h-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Fingerprint className="w-16 h-16 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-cyber-cyan shadow-inner">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-orbitron font-black text-white truncate uppercase tracking-tighter">{user.email.split('@')[0]}</p>
                      <p className="text-[8px] font-mono text-slate-600 truncate font-bold">{user.email}</p>
                    </div>
                  </div>
                  <div className="bg-black/80 px-4 py-2 rounded-xl border border-white/5 flex justify-between items-center mb-4">
                    <p className="text-[9px] font-mono text-cyber-cyan/30 tracking-[0.3em] font-black">••••••••</p>
                    <button onClick={() => { setSelectedUserId(user.id); setIsPassModalOpen(true); }} className="p-1.5 text-slate-600 hover:text-cyber-cyan transition-colors hover:bg-white/5 rounded-lg">
                      <Key className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeUser(user.id, user.email)} className="w-full py-2.5 bg-cyber-red/5 border border-cyber-red/10 rounded-xl text-[8px] text-cyber-red/60 hover:text-cyber-red hover:bg-cyber-red/10 transition-all font-mono font-black uppercase flex items-center justify-center gap-2 tracking-widest">
                  <Trash2 className="w-3 h-3" /> Purge Shard
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 glass-card rounded-3xl border border-white/5 bg-[#030303] p-6 h-[400px] lg:h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            <h2 className="font-orbitron text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Journal</h2>
          </div>
          <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {logs.map((log) => (
              <div key={log.id} className="border-l border-white/10 pl-4 py-1 relative">
                <div className="absolute top-1 -left-[3px] w-1.5 h-1.5 rounded-full bg-cyber-cyan/30 border border-cyber-cyan/50" />
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[7px] font-mono font-black px-1.5 py-0.5 rounded uppercase ${log.action === 'PROVISION' ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-cyber-yellow bg-cyber-yellow/10'}`}>{log.action}</span>
                  <span className="text-[7px] font-mono text-slate-700 font-bold">{log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-500 font-bold text-[9px] leading-relaxed uppercase tracking-tight">{log.detail}</p>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-10">
                <Terminal className="w-12 h-12 mb-4" />
                <p className="font-mono text-[8px] uppercase tracking-widest text-center">Awaiting Entry...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-sm glass-card p-10 rounded-[3rem] border border-cyber-cyan/30 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-600 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            <div className="mb-8">
              <h2 className="font-orbitron text-xl font-black text-white uppercase tracking-tighter">Node Deployment</h2>
              <p className="text-slate-500 font-mono text-[8px] uppercase tracking-widest mt-1">Registry Protocol 7.2</p>
            </div>
            <form onSubmit={handleAddUser} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest pl-2">Operator Identity</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="EMAIL_OR_UID" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-mono outline-none focus:border-cyber-cyan/40 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest pl-2">Access Cipher</label>
                <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] font-mono outline-none focus:border-cyber-cyan/40 transition-all" />
              </div>
              <button type="submit" className="w-full py-5 bg-cyber-cyan text-black font-orbitron font-black text-[11px] rounded-2xl uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] active:scale-95">{loading ? 'Processing...' : 'Provision Node'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="w-full max-w-sm glass-card p-10 rounded-[3rem] border border-cyber-yellow/30 relative shadow-2xl">
            <button onClick={() => setIsPassModalOpen(false)} className="absolute top-6 right-6 text-slate-600 hover:text-white"><X className="w-6 h-6" /></button>
            <div className="mb-8">
              <h2 className="font-orbitron text-xl font-black text-cyber-yellow uppercase tracking-tighter">Manual Override</h2>
              <p className="text-slate-500 font-mono text-[8px] uppercase tracking-widest mt-1">Cipher Re-Injection</p>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-600 uppercase tracking-widest pl-2">New Access Cipher</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-[11px] outline-none focus:border-cyber-yellow/40 transition-all" />
              </div>
              <button type="submit" className="w-full py-5 bg-cyber-yellow text-black font-orbitron font-black text-[11px] rounded-2xl uppercase tracking-[0.2em]">{loading ? 'Committing...' : 'Confirm Override'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
