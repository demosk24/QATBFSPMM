
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, isConfigValid } from './firebase';
import LoginPage from './pages/Login';
import DashboardLayout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import UserManagement from './pages/UserManagement';
import LicenseManagement from './pages/LicenseManagement';
import SignalManagement from './pages/SignalManagement';
import SecurityLogs from './pages/SecurityLogs';
import SystemSettings from './pages/SystemSettings';
import { ScanLines } from './constants';
import { ShieldAlert, Terminal, Lock } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'dokkustic@admin.com';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If config is invalid, we don't attempt to connect to Firebase
    if (!isConfigValid) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email !== SUPER_ADMIN_EMAIL) {
        signOut(auth);
        setAuthError('UNAUTHORIZED: ONLY SUPER ADMIN CAN ACCESS THIS TERMINAL.');
        setUser(null);
      } else {
        setUser(currentUser);
        setAuthError(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Professional Error Screen for Missing Configuration
  if (!isConfigValid) {
    return (
      <div className="h-screen w-screen bg-[#020203] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-cyber-red/30 text-center space-y-6">
          <div className="w-20 h-20 bg-cyber-red/10 rounded-3xl flex items-center justify-center mx-auto border border-cyber-red/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <ShieldAlert className="w-10 h-10 text-cyber-red animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="font-orbitron text-xl font-black text-white uppercase tracking-tighter">Secure Gateway Offline</h1>
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-[0.3em]">Critical Handshake Failure</p>
          </div>
          <div className="bg-black/50 rounded-2xl p-4 border border-white/5 text-left space-y-3">
            <div className="flex items-start gap-3">
              <Terminal className="w-4 h-4 text-cyber-red mt-0.5" />
              <p className="text-[10px] font-mono text-slate-400 leading-relaxed uppercase">
                Application failed to detect <span className="text-white">Environment Variables</span>. 
                Ensure Firebase keys are added to Vercel Project Settings.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px] font-mono text-slate-600 uppercase">Error Code:</span>
              <span className="text-[8px] font-mono text-cyber-red uppercase font-black">ENV_KEY_MISSING</span>
            </div>
          </div>
          <p className="text-[8px] font-mono text-slate-600 uppercase italic">Contact System Architect if this persists.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#020203] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-2 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin shadow-[0_0_30px_rgba(34,211,238,0.3)]"></div>
          <p className="font-orbitron text-[10px] text-cyber-cyan animate-pulse tracking-[0.5em] uppercase">Decrypting Nexus Shards...</p>
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
            element={user ? <DashboardLayout onLogout={() => auth.signOut()} /> : <Navigate to="/login" replace />}
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
