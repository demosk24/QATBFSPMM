
import React, { useState, useEffect } from 'react';
import { 
  Activity, Shield, Terminal, Globe, Cpu, Lock, 
  TrendingUp, AlertCircle, Radio, Database, Server,
  ChevronRight, Binary
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const dummyData = Array.from({ length: 30 }).map((_, i) => ({
  name: i,
  val: Math.floor(Math.random() * 40) + 60
}));

const DashboardHome: React.FC = () => {
  const [load, setLoad] = useState(84.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => Math.max(70, Math.min(99, prev + (Math.random() * 2 - 1))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-2 border-b border-white/[0.05] gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green shadow-[0_0_8px_#4ade80] animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Operational</span>
          </div>
          <div className="h-3 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
            <Radio className="w-2.5 h-2.5 text-cyber-cyan animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Live Sync</span>
          </div>
        </div>
        <span className="text-[8px] md:text-[10px] font-mono font-black text-cyber-cyan/60 uppercase">NODE: NEXUS_01</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="lg:col-span-3 glass-card rounded-2xl md:rounded-3xl border border-white/[0.05] relative overflow-hidden group">
          <div className="p-6 md:p-8 relative z-10 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-orbitron font-black text-white flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-cyber-cyan animate-pulse" /> TOPOLOGY
                </h2>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] mt-1">Neural Analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[8px] font-mono text-slate-600 uppercase font-bold">Latency</p>
                   <p className="text-lg font-orbitron font-black text-cyber-cyan">14ms</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                   <Binary className="text-slate-600 w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[200px] md:min-h-[280px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyData}>
                  <defs>
                    <linearGradient id="neonCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke="#22d3ee" 
                    fill="url(#neonCyan)" 
                    strokeWidth={4} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #22d3ee33', borderRadius: '12px' }} 
                    labelStyle={{ color: '#22d3ee', fontFamily: 'Orbitron', fontSize: '8px' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/[0.05]">
              {[
                { label: 'Throughput', val: '4.2 PB/s' },
                { label: 'Integrity', val: '99.9%' },
                { label: 'Shards', val: '1,024' },
                { label: 'Version', val: 'v7.2' },
              ].map((m, i) => (
                <div key={i}>
                  <p className="text-[7px] font-mono text-slate-600 uppercase font-black">{m.label}</p>
                  <p className="text-xs md:text-sm font-orbitron font-black text-white">{m.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4 md:gap-8">
          <div className="glass-card p-5 md:p-6 rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-cyber-cyan" />
              <h4 className="font-orbitron font-black text-[10px] text-white uppercase tracking-wider">Load Balance</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-mono font-black text-slate-500 uppercase">
                <span>Capacity</span>
                <span>{load.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/[0.05] h-2 rounded-full border border-white/[0.05]">
                <div 
                  className="h-full bg-cyber-cyan shadow-[0_0_10px_#22d3ee] transition-all duration-1000"
                  style={{ width: `${load}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-5 md:p-6 rounded-2xl border border-white/5 bg-[#050505] flex-1 min-h-[300px]">
             <div className="flex items-center justify-between mb-6">
                <h4 className="font-orbitron font-black text-[10px] text-white uppercase tracking-widest">Active Nodes</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
             </div>
             <div className="space-y-3">
               {[
                 { id: 'NODE_X1', status: 'Active', ping: '12ms' },
                 { id: 'NODE_X2', status: 'Active', ping: '15ms' },
                 { id: 'NODE_X3', status: 'Idle', ping: '22ms' },
               ].map(node => (
                 <div key={node.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-[10px]">
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${node.status === 'Active' ? 'bg-cyber-green' : 'bg-cyber-yellow'}`} />
                      <span className="font-mono font-black text-slate-400">{node.id}</span>
                    </div>
                    <span className="font-orbitron font-black text-white">{node.ping}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Database, label: 'Ledger', val: 'Sync', sub: 'Last sync 2s' },
          { icon: Server, label: 'Core', val: 'Active', sub: 'TPS: 1,280' },
          { icon: Terminal, label: 'Console', val: 'Live', sub: 'Listening...' },
        ].map((w, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/[0.02] transition-all">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <w.icon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[7px] font-mono text-slate-500 uppercase font-black tracking-widest">{w.label}</p>
              <p className="text-sm font-orbitron font-black text-white uppercase">{w.val}</p>
              <p className="text-[8px] font-mono text-slate-700 uppercase">{w.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
