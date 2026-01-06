
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, isConfigValid, firebaseConfig } from './firebase';
import LoginPage from './pages/Login';
import DashboardLayout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import UserManagement from './pages/UserManagement';
import LicenseManagement from './pages/LicenseManagement';
import SignalManagement from './pages/SignalManagement';
import SecurityLogs from './pages/SecurityLogs';
import SystemSettings from './pages/SystemSettings';
import { ScanLines } from './constants';
import { ShieldAlert, Terminal, Cpu, Database, Server, Info, Activity, Fingerprint, Lock } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'dokkustic@admin.com';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If the Firebase configuration is invalid, do not attempt to start Auth listeners.
    if (!isConfigValid || !auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser && currentUser.email !== SUPER_ADMIN_EMAIL) {
          signOut(auth);
          setAuthError('AUTHORIZATION_ERROR: IDENTITY NOT RECOGNIZED IN SUPER ADMIN REGISTRY.');
          setUser(null);
        } else {
          setUser(currentUser);
          setAuthError(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("AUTH_LISTENER_EXCEPTION:", e);
      setLoading(false);
    }
  }, []);

  /**
   * High-Fidelity Diagnostic Terminal
   * Shown when environment variables are missing or incorrect.
   */
  if (!isConfigValid) {
    return (
      <div className="h-screen w-screen bg-[#020204] flex items-center justify-center p-6 font-inter selection:bg-cyber-red selection:text-white">
        <ScanLines />
        <div className="max-w-2xl w-full glass-card p-12 rounded-[4rem] border border-cyber-red/30 space-y-12 shadow-[0_0_150px_rgba(239,68,68,0.1)] relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyber-red/5 rounded-full blur-[120px]" />
          
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-28 h-28 bg-cyber-red/10 rounded-[3rem] border border-cyber-red/40 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-pulse">
              <ShieldAlert className="w-14 h-14 text-cyber-red" />
            </div>
            <div className="space-y-2">
              <h1 className="font-orbitron text-3xl font-black text-white uppercase tracking-tighter">Gateway Offline</h1>
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.6em] font-black">Environmental Integrity Compromised // Protocol 401</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 space-y-5">
              <div className="flex items-center gap-3 text-cyber-cyan border-b border-white/5 pb-4">
                <Terminal className="w-5 h-5" />
                <span className="text-[11px] font-mono font-black uppercase tracking-widest">System Analysis</span>
              </div>
              <p className="text-[12px] font-mono text-slate-400 leading-relaxed uppercase">
                Uplink to <span className="text-white">Firebase Registry</span> failed. 
                Detected missing or malformed <span className="text-cyber-cyan font-bold">Environment Variables</span> in the build environment. 
                Vercel deployment must be synchronized with institutional keys.
              </p>
            </div>

            <div className="bg-black/60 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-cyber-yellow border-b border-white/5 pb-4">
                <Activity className="w-5 h-5" />
                <span className="text-[11px] font-mono font-black uppercase tracking-widest">Shard Status</span>
              </div>
              <div className="space-y-3">
                {Object.entries(firebaseConfig).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-600 truncate mr-4">{key.replace('NEXT_PUBLIC_FIREBASE_', '')}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${value ? 'bg-cyber-green' : 'bg-cyber-red animate-pulse shadow-[0_0_8px_#ef4444]'}`} />
                      <span className={`text-[9px] font-mono font-black ${value ? 'text-cyber-green' : 'text-cyber-red'}`}>
                        {value ? 'LINKED' : 'NULL'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-8">
            <div className="flex items-center gap-10 opacity-30 grayscale hover:grayscale-0 transition-all">
              <Cpu className="w-10 h-10 text-white" />
              <Fingerprint className="w-10 h-10 text-white" />
              <Lock className="w-10 h-10 text-white" />
              <Database className="w-10 h-10 text-white" />
            </div>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em] italic text-center max-w-md leading-relaxed">
              Required Action: Ensure Vercel environment variables match the naming convention and trigger a clean redeploy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#010101] flex items-center justify-center">
        <div className="flex flex-col items-center gap-12">
          <div className="relative w-32 h-32">
             <div className="absolute inset-0 border-[6px] border-cyber-cyan/5 rounded-full"></div>
             <div className="absolute inset-0 border-t-[6px] border-cyber-cyan rounded-full animate-[spin_1s_linear_infinite]"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <Fingerprint className="w-14 h-14 text-cyber-cyan animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-4">
            <p className="font-orbitron text-[14px] text-cyber-cyan animate-pulse tracking-[1em] uppercase font-black">Nexus Decrypt</p>
            <p className="font-mono text-[9px] text-slate-600 uppercase tracking-[0.5em] font-bold">Verifying System Authorization...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="relative min-h-screen bg-[#010101] text-[#FFFFFF] selection:bg-cyber-cyan selection:text-cyber-black overflow-hidden">
        <ScanLines />
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <LoginPage externalError={authError} />} 
          />
          
          <Route 
            path="/" 
            element={user ? <DashboardLayout onLogout={() => auth?.signOut()} /> : <Navigate to="/login" replace />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="licenses" element={<LicenseManagement />} />
            <Route path="signals" element={<SignalManagement />} />
            <Route path="security" element={<SecurityLogs />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
