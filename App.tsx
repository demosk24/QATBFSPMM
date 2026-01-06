
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
import { ShieldAlert, Terminal, Cpu, Database, Server, Info, Activity, Fingerprint } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'dokkustic@admin.com';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase isn't properly configured, stop loading and show diagnostic screen
    if (!isConfigValid || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email !== SUPER_ADMIN_EMAIL) {
        signOut(auth);
        setAuthError('SECURITY ALERT: UNAUTHORIZED IDENTITY DETECTED.');
        setUser(null);
      } else {
        setUser(currentUser);
        setAuthError(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Professional Terminal Error for Configuration Issues
  if (!isConfigValid) {
    return (
      <div className="h-screen w-screen bg-[#020204] flex items-center justify-center p-6 font-inter selection:bg-cyber-red selection:text-white">
        <ScanLines />
        <div className="max-w-2xl w-full glass-card p-12 rounded-[3.5rem] border border-cyber-red/30 space-y-10 shadow-[0_0_120px_rgba(239,68,68,0.1)] relative overflow-hidden">
          {/* Background Matrix-like glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyber-red/5 rounded-full blur-[100px]" />
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 bg-cyber-red/10 rounded-[2.5rem] border border-cyber-red/40 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-12 h-12 text-cyber-red animate-pulse" />
            </div>
            <div className="space-y-1">
              <h1 className="font-orbitron text-2xl font-black text-white uppercase tracking-tighter">Secure Gateway Offline</h1>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.5em] font-black">Environmental Handshake Failure // Error 401-CFG</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/60 p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3 text-cyber-cyan border-b border-white/5 pb-3">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-mono font-black uppercase tracking-widest">Diagnostic Report</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 leading-relaxed uppercase">
                The terminal is unable to detect <span className="text-white">Firebase Core</span>. 
                Vercel environment variables must be populated and the project must be 
                <span className="text-cyber-cyan"> Redeployed</span> to inject them into the production build.
              </p>
            </div>

            <div className="bg-black/60 p-6 rounded-3xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3 text-cyber-yellow border-b border-white/5 pb-3">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-mono font-black uppercase tracking-widest">Registry Status</span>
              </div>
              <div className="space-y-2">
                {Object.entries(firebaseConfig).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-slate-600 truncate mr-4">{key.replace('NEXT_PUBLIC_FIREBASE_', '')}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${value ? 'bg-cyber-green' : 'bg-cyber-red shadow-[0_0_5px_#ef4444]'}`} />
                      <span className={`text-[8px] font-mono font-black ${value ? 'text-cyber-green' : 'text-cyber-red'}`}>
                        {value ? 'LINKED' : 'NULL'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 opacity-20">
              <Cpu className="w-8 h-8 text-white" />
              <Fingerprint className="w-8 h-8 text-white" />
              <Database className="w-8 h-8 text-white" />
            </div>
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest italic text-center max-w-sm leading-relaxed">
              Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, etc.
              Verification process initiated...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#010101] flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          <div className="relative w-24 h-24">
             <div className="absolute inset-0 border-4 border-cyber-cyan/5 rounded-full"></div>
             <div className="absolute inset-0 border-t-4 border-cyber-cyan rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <Fingerprint className="w-10 h-10 text-cyber-cyan animate-pulse" />
             </div>
          </div>
          <div className="text-center space-y-3">
            <p className="font-orbitron text-[12px] text-cyber-cyan animate-pulse tracking-[0.8em] uppercase font-black">Accessing Nexus</p>
            <p className="font-mono text-[8px] text-slate-600 uppercase tracking-widest">Scanning Shard Integrity...</p>
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
