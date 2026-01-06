
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './pages/Login';
import DashboardLayout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import UserManagement from './pages/UserManagement';
import LicenseManagement from './pages/LicenseManagement';
import SignalManagement from './pages/SignalManagement';
import SecurityLogs from './pages/SecurityLogs';
import SystemSettings from './pages/SystemSettings';
import { ScanLines } from './constants';
import { Fingerprint } from 'lucide-react';

const SUPER_ADMIN_EMAIL = 'dokkustic@admin.com';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email !== SUPER_ADMIN_EMAIL) {
        signOut(auth);
        setAuthError('UNAUTHORIZED: SYSTEM ACCESS RESTRICTED TO SUPER ADMIN.');
        setUser(null);
      } else {
        setUser(currentUser);
        setAuthError(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
            <p className="font-orbitron text-[14px] text-cyber-cyan animate-pulse tracking-[1em] uppercase font-black">Nexus Boot</p>
            <p className="font-mono text-[9px] text-slate-600 uppercase tracking-[0.5em] font-bold">Initializing Institutional Shards...</p>
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
            element={user ? <DashboardLayout onLogout={() => signOut(auth)} /> : <Navigate to="/login" replace />}
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
