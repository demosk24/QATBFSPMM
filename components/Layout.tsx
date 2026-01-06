
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Database,
  Activity,
  Fingerprint
} from 'lucide-react';

interface LayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<LayoutProps> = ({ onLogout }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const mainNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Attack Surface', icon: Globe, path: '/users' },
    { name: 'Dark Web', icon: Database, path: '/licenses' },
    { name: 'Signals', icon: Zap, path: '/signals' },
    { name: 'Logs', icon: ShieldAlert, path: '/security' },
  ];

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-black">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md md:hidden flex flex-col p-6 animate-in fade-in">
          <div className="flex justify-between items-center mb-10">
            <Fingerprint className="text-cyber-cyan w-8 h-8" />
            <button onClick={() => setMobileMenuOpen(false)}><X className="text-white w-6 h-6" /></button>
          </div>
          <nav className="space-y-4">
            {mainNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-4 rounded-xl font-orbitron text-xs font-bold uppercase tracking-widest border ${
                    isActive ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan' : 'text-slate-500 border-transparent'
                  }`
                }
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Institutional Sidebar */}
      <aside className={`hidden md:flex flex-col bg-cyber-deep border-r border-white/[0.03] transition-all duration-300 ease-in-out z-30 ${isSidebarCollapsed ? 'w-16' : 'w-60'}`}>
        <div className="p-4 mb-2 flex items-center justify-center">
          <div className="w-9 h-9 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Fingerprint className="text-cyber-cyan w-5 h-5" />
          </div>
          {!isSidebarCollapsed && <span className="ml-3 font-orbitron font-black text-base tracking-tight text-white uppercase">ANARISK</span>}
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group border ${
                  isActive 
                    ? 'bg-cyber-cyan/5 text-cyber-cyan border-cyber-cyan/10' 
                    : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.02]'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="font-space text-xs font-semibold truncate uppercase tracking-tighter">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.03]">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-cyber-red hover:bg-cyber-red/5 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span className="font-space text-xs font-semibold uppercase">Exit</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-cyber-black relative">
        <header className="h-14 flex items-center justify-between px-4 md:px-8 border-b border-white/[0.03] z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(true)}><Menu className="w-5 h-5" /></button>
            <h1 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.3em] hidden sm:block">Nexus Terminal // v7.2</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:block text-slate-600 hover:text-cyber-cyan transition-colors"><Activity className="w-4 h-4" /></button>
            <div className="flex items-center gap-3 pl-3 border-l border-white/[0.05]">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-white uppercase">Abdulmonem</span>
                <span className="text-[8px] font-mono text-cyber-cyan tracking-widest">S_ADMIN</span>
              </div>
              <img src="https://picsum.photos/seed/admin/64/64" className="w-8 h-8 rounded-lg border border-white/10" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
