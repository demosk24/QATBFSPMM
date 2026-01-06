
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

const SUPER_ADMIN_EMAIL = 'dokkustic@admin.com';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email !== SUPER_ADMIN_EMAIL) {
        // If logged in user is not the super admin, sign them out immediately
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

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#020203] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-2 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin shadow-[0_0_30px_rgba(34,211,238,0.3)]"></div>
          <p className="font-orbitron text-[10px] text-cyber-cyan animate-pulse tracking-[0.5em] uppercase">Initializing Nexus...</p>
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
