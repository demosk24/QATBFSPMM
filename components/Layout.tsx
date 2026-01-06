
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
  Bell,
  Search,
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

  // Updated navigation: Removed Reports and Risk Score
  const mainNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Attack Surface', icon: Globe, path: '/users' },
    { name: 'Dark Web', icon: Database, path: '/licenses' },
    { name: 'Threat Exposure', icon: ShieldAlert, path: '/security' },
    { name: 'Signals', icon: Zap, path: '/signals' },
  ];

  const bottomNav = [
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-black">
      {/* Institutional Sidebar */}
      <aside 
        className={`hidden md:flex flex-col bg-cyber-deep border-r border-white/[0.03] transition-all duration-500 ease-in-out z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-[260px]'
        }`}
      >
        <div className="p-8 mb-2 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)] flex-shrink-0">
            <Fingerprint className="text-cyber-cyan w-6 h-6" />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-orbitron font-black text-xl tracking-tight text-white">ANARISK</span>
          )}
        </div>

        <div className="px-6 mb-8">
          <div className={`relative flex items-center bg-white/[0.03] border border-white/[0.05] rounded-xl transition-all ${isSidebarCollapsed ? 'justify-center p-2.5' : 'px-4 py-3'}`}>
            <Search className="w-4 h-4 text-slate-500" />
            {!isSidebarCollapsed && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm text-slate-200 ml-3 focus:ring-0 placeholder:text-slate-600 w-full font-space"
              />
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {!isSidebarCollapsed && <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-4 px-4 font-bold">Main Console</p>}
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all group border ${
                  isActive 
                    ? 'bg-cyber-cyan/5 text-cyber-cyan border-cyber-cyan/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                    : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.02]'
                }`
              }
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
              {!isSidebarCollapsed && <span className="font-space text-sm font-semibold truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-6 mt-auto space-y-1.5 border-t border-white/[0.03]">
          {bottomNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-200 hover:bg-white/[0.02] rounded-xl group transition-all"
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {!isSidebarCollapsed && <span className="font-space text-sm font-semibold">{item.name}</span>}
            </NavLink>
          ))}
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-cyber-red/90 hover:bg-cyber-red/5 rounded-xl transition-all group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {!isSidebarCollapsed && <span className="font-space text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Command View */}
      <main className="flex-1 flex flex-col min-w-0 bg-cyber-black relative overflow-hidden">
        <header className="h-[80px] flex items-center justify-between px-10 z-20">
          <div className="flex items-center gap-6">
            <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-space font-bold text-white tracking-tight hidden md:block uppercase">Nexus Terminal</h1>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2.5 text-slate-500 hover:text-cyber-cyan transition-all bg-white/[0.02] border border-white/[0.05] rounded-xl"
            >
              <Activity className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-white/[0.05]">
              <div className="flex flex-col items-end text-right">
                <span className="text-sm font-bold text-white">Abdulmonem</span>
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">SUPER_ADMIN</span>
              </div>
              <img 
                src="https://picsum.photos/seed/admin/64/64" 
                className="w-11 h-11 rounded-xl object-cover border border-white/[0.1]"
                alt="Avatar"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 pt-0 scroll-smooth custom-scrollbar relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
