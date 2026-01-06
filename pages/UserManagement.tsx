
import React, { useState, useEffect } from 'react';
import { Plus, X, Lock, Mail, Trash2, Shield, User as UserIcon, AlertTriangle, Fingerprint, Activity, Clock, Key } from 'lucide-react';
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
  
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const isSuperAdmin = auth.currentUser?.email === 'dokkustic@admin.com';

  useEffect(() => {
    if (!isSuperAdmin) return;

    const qUsers = query(collection(db, 'qx-autoTrading-bot-access-key'), orderBy('provisionedAt', 'desc'));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setIdentities(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      if (err.message.includes("api-key")) setError("CRITICAL: Firebase API Key Invalid.");
    });

    const qLogs = query(collection(db, 'qx-activity-logs'), orderBy('timestamp', 'desc'), limit(15));
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubUsers();
      unsubLogs();
    };
  }, [isSuperAdmin]);

  const logActivity = async (action: string, detail: string) => {
    try {
      await addDoc(collection(db, 'qx-activity-logs'), {
        action,
        detail,
        timestamp: serverTimestamp(),
        admin: auth.currentUser?.email
      });
    } catch (e) {
      console.error("Log entry failed", e);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    setLoading(true);
    setError('');
    setSuccess('');

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
      setSuccess('PROVISIONING SUCCESSFUL');
      setTimeout(() => setIsModalOpen(false), 2000);
      setForm({ email: '', password: '' });
    } catch (err: any) {
      setError(`ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !selectedUserId) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'qx-autoTrading-bot-access-key', selectedUserId), {
        password: newPassword,
        lastPasswordUpdate: serverTimestamp()
      });
      setSuccess('PASSWORD OVERRIDE COMMITTED');
      setTimeout(() => setIsPassModalOpen(false), 1500);
      setNewPassword('');
    } catch (err: any) {
      setError(`FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id: string, email: string) => {
    if (!isSuperAdmin) return;
    if (window.confirm(`PURGE ${email} FROM TERMINAL?`)) {
      await deleteDoc(doc(db, 'qx-autoTrading-bot-access-key', id));
      setSuccess('NODE PURGED');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="h-[60vh] flex items-center justify-center p-4">
        <div className="glass-card p-6 rounded-2xl border border-cyber-red/30 text-center max-w-sm">
          <AlertTriangle className="w-10 h-10 text-cyber-red mx-auto mb-4 animate-pulse" />
          <h2 className="font-orbitron text-lg text-white mb-2 uppercase">Restricted</h2>
          <p className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">Super Admin Only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      {(error || success) && (
        <div className={`fixed bottom-4 right-4 z-[100] p-4 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-500 max-w-xs ${
          error ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red' : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green'
        }`}>
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-cyber-red' : 'bg-cyber-green'} shrink-0 animate-pulse`} />
          <span className="text-[9px] font-mono font-black uppercase tracking-tight truncate">{error || success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-orbitron font-black text-white tracking-tighter uppercase">Attack Surface</h1>
          <p className="text-slate-500 font-mono text-[7px] uppercase tracking-[0.4em] font-black opacity-60">Identity Core</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-cyber-cyan text-black font-orbitron font-black text-[9px] rounded-lg shadow-lg uppercase"
        >
          <Plus className="w-3.5 h-3.5" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {identities.map((user) => (
              <div key={user.id} className="glass-card p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:border-cyber-cyan/30 transition-all group flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-cyber-cyan">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white truncate font-orbitron uppercase">{user.email.split('@')[0]}</p>
                    <p className="text-[7px] font-mono text-slate-600 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex justify-between items-center mb-4">
                  <div className="overflow-hidden">
                    <p className="text-[7px] font-mono text-slate-700 uppercase font-black mb-0.5">Password</p>
                    <p className="text-[9px] font-mono text-cyber-cyan/60 font-black tracking-widest truncate">••••••••</p>
                  </div>
                  <button onClick={() => { setSelectedUserId(user.id); setIsPassModalOpen(true); }} className="p-1.5 text-slate-600 hover:text-cyber-cyan transition-colors bg-white/5 rounded-md">
                    <Key className="w-3 h-3" />
                  </button>
                </div>
                <button onClick={() => removeUser(user.id, user.email)} className="w-full py-2 bg-cyber-red/5 border border-cyber-red/10 rounded-lg text-[8px] text-cyber-red/60 hover:text-cyber-red hover:bg-cyber-red/10 transition-all font-mono font-black uppercase flex items-center justify-center gap-1.5">
                  <Trash2 className="w-3 h-3" /> Purge
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 glass-card rounded-xl border border-white/5 bg-[#050505] p-4 h-[300px] lg:h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Activity className="w-3 h-3 text-cyber-cyan" />
            <h2 className="font-orbitron text-[9px] font-black text-white uppercase tracking-widest">Journal</h2>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1 text-[8px]">
            {logs.map((log) => (
              <div key={log.id} className="border-l border-white/5 pl-2.5 py-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-[6px] font-mono font-black px-1 rounded uppercase ${log.action === 'PROVISION' ? 'text-cyber-cyan' : 'text-cyber-yellow'}`}>{log.action}</span>
                  <span className="text-[6px] font-mono text-slate-700">{log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-500 font-medium leading-tight truncate">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reusable Mobile-Friendly Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-xs glass-card p-6 rounded-2xl border border-cyber-cyan/30 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-500 p-2"><X className="w-5 h-5" /></button>
            <h2 className="font-orbitron text-lg font-black text-white mb-6 uppercase">New Node</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-[11px] outline-none" />
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-[11px] outline-none" />
              <button type="submit" className="w-full py-3 bg-cyber-cyan text-black font-orbitron font-black text-[10px] rounded-lg uppercase">{loading ? '...' : 'Deploy'}</button>
            </form>
          </div>
        </div>
      )}

      {isPassModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="w-full max-w-xs glass-card p-6 rounded-2xl border border-cyber-yellow/30 relative">
            <button onClick={() => setIsPassModalOpen(false)} className="absolute top-4 right-4 text-slate-500 p-2"><X className="w-5 h-5" /></button>
            <h2 className="font-orbitron text-base font-black text-white mb-6 uppercase">Override</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white text-[11px] outline-none" />
              <button type="submit" className="w-full py-3 bg-cyber-yellow text-black font-orbitron font-black text-[10px] rounded-lg uppercase">{loading ? '...' : 'Commit'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
