
import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Cpu, 
  Lock, 
  Globe, 
  Save,
  AlertCircle
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [riskLevel, setRiskLevel] = useState('Medium');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-white tracking-tight">System Configuration</h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Global Parameters & API Gateway Control</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-cyber-cyan text-cyber-black font-orbitron font-bold text-xs rounded-lg hover:shadow-[0_0_20px_#22d3ee] transition-all transform active:scale-95">
          <Save className="w-4 h-4" /> COMMIT CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: General & Bot Config */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-cyber-cyan" />
              <h3 className="font-orbitron text-sm font-bold tracking-wider text-slate-200 uppercase">Trading Engine Core</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Global Risk Protocol</label>
                <select 
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="w-full bg-cyber-navy/50 border border-cyber-cyan/10 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyber-cyan/40 appearance-none font-mono"
                >
                  <option>Conservative</option>
                  <option>Moderate</option>
                  <option>Aggressive</option>
                  <option>Institutional (MAX)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Default Stop Loss %</label>
                <input 
                  type="number" 
                  defaultValue={2.5}
                  className="w-full bg-cyber-navy/50 border border-cyber-cyan/10 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-cyber-cyan/40 font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Max Concurrent Trades</label>
                <input 
                  type="number" 
                  defaultValue={10}
                  className="w-full bg-cyber-navy/50 border border-cyber-cyan/10 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-cyber-cyan/40 font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1">Execution Engine</label>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono text-cyber-green">V3.4-STABLE</span>
                  <button className="text-[10px] font-mono bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-slate-400">UPDATE</button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-cyber-cyan" />
              <h3 className="font-orbitron text-sm font-bold tracking-wider text-slate-200 uppercase">Exchange API Connectors</h3>
            </div>
            
            <div className="space-y-4">
              {['Binance Main', 'Kraken Institutional', 'Coinbase Pro'].map((exchange) => (
                <div key={exchange} className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyber-green" />
                    <span className="text-sm font-semibold text-slate-300">{exchange}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-600">CONNECTED</span>
                    <button className="text-[10px] font-mono text-cyber-cyan hover:underline">CONFIGURE</button>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 rounded-xl border border-dashed border-cyber-cyan/20 text-cyber-cyan/60 text-xs font-mono hover:bg-cyber-cyan/5 transition-all">
                + ATTACH NEW EXCHANGE GATEWAY
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security & Misc */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-cyber-red/20 bg-cyber-red/5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-cyber-red" />
              <h3 className="font-orbitron text-sm font-bold tracking-wider text-white uppercase">Critical Controls</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Maintenance Mode</p>
                  <p className="text-[10px] text-slate-500">Lock all users out of the system</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-12 h-6 rounded-full transition-all relative ${maintenanceMode ? 'bg-cyber-red' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Emergency Liquidation</p>
                  <p className="text-[10px] text-slate-500">Close all active bot positions</p>
                </div>
                <button className="px-3 py-1.5 bg-cyber-red text-white text-[10px] font-bold rounded hover:shadow-[0_0_15px_#ef4444] transition-all">EXECUTE</button>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="white w-5 h-5 text-cyber-cyan" />
              <h3 className="font-orbitron text-sm font-bold tracking-wider text-slate-200 uppercase">Security Policy</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-cyber-cyan/30 bg-cyber-navy" />
                <span className="text-xs text-slate-400">Enforce hardware 2FA for all admins</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-cyber-cyan/30 bg-cyber-navy" />
                <span className="text-xs text-slate-400">Geo-IP restriction (Whitelist only)</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-cyber-cyan/30 bg-cyber-navy" />
                <span className="text-xs text-slate-400">Strict API Key IP Binding</span>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl border border-white/5 text-center">
            <Globe className="w-8 h-8 text-cyber-cyan mx-auto mb-2 opacity-50" />
            <p className="text-[10px] font-mono text-slate-600 uppercase">System Region: US-EAST-1</p>
            <p className="text-[10px] font-mono text-slate-600 uppercase">Uptime: 99.998%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
