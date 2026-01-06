
import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Radio, Database, Server, Binary, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const dummyData = Array.from({ length: 20 }).map((_, i) => ({
  name: i,
  val: Math.floor(Math.random() * 30) + 70
}));

const DashboardHome: React.FC = () => {
  const [load, setLoad] = useState(84.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => Math.max(80, Math.min(99, prev + (Math.random() * 1.5 - 0.75))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Chart Section - More Compact */}
        <div className="lg:col-span-3 glass-card rounded-xl border border-white/[0.05] p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-base md:text-lg font-orbitron font-black text-white flex items-center gap-2 uppercase">
                <Cpu className="w-5 h-5 text-cyber-cyan" /> Core Topology
              </h2>
              <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">Quantum Data Stream Analysis</p>
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-2 rounded-lg border border-white/5">
              <div className="text-right">
                <p className="text-[7px] font-mono text-slate-600 uppercase">Ping</p>
                <p className="text-xs font-orbitron text-cyber-cyan">0.08ms</p>
              </div>
              <Binary className="text-slate-700 w-4 h-4" />
            </div>
          </div>

          <div className="h-40 md:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <defs>
                  <linearGradient id="neonCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="stepAfter" dataKey="val" stroke="#22d3ee" fill="url(#neonCyan)" strokeWidth={2} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #22d3ee33', borderRadius: '8px', fontSize: '9px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/[0.05]">
            {[
              { label: 'Uplink', val: '9.4 GB/s' },
              { label: 'Integrity', val: '99.9%' },
              { label: 'Nodes', val: '2,048' },
              { label: 'Shards', val: 'L-7' },
            ].map((m, i) => (
              <div key={i} className="bg-white/[0.02] p-2 rounded-lg border border-white/5">
                <p className="text-[6px] font-mono text-slate-600 uppercase tracking-widest">{m.label}</p>
                <p className="text-[10px] font-orbitron font-bold text-white uppercase">{m.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-card p-4 rounded-xl border border-cyber-cyan/10 bg-cyber-cyan/[0.02]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-orbitron font-black text-[9px] text-white uppercase tracking-widest">Network Load</h4>
              <Activity className="w-3 h-3 text-cyber-cyan" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase">
                <span>Utilization</span>
                <span className="text-cyber-cyan">{load.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-cyber-cyan transition-all duration-1000 shadow-[0_0_10px_#22d3ee]" style={{ width: `${load}%` }} />
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-white/5 bg-[#050505] flex-1">
            <h4 className="font-orbitron font-black text-[9px] text-white uppercase tracking-widest mb-4">Protocol Status</h4>
            <div className="space-y-2">
              {[
                { id: 'SHARD_01', stat: 'OK' },
                { id: 'CORE_GATE', stat: 'OK' },
                { id: 'NEURAL_P', stat: 'SCAN' },
              ].map(n => (
                <div key={n.id} className="flex items-center justify-between p-2 bg-white/[0.02] border border-white/5 rounded-lg text-[8px] font-mono">
                  <span className="text-slate-500">{n.id}</span>
                  <span className={n.stat === 'OK' ? 'text-cyber-green' : 'text-cyber-yellow animate-pulse'}>{n.stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Database, label: 'Ledger Registry', sub: 'Last sync 0.4s ago' },
          { icon: Server, label: 'Compute Core', sub: 'Thread count optimal' },
          { icon: Shield, label: 'Firewall Array', sub: 'Monitoring 18.4k ports' },
        ].map((w, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-white/[0.03] transition-all">
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <w.icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-orbitron font-black text-white uppercase truncate">{w.label}</p>
              <p className="text-[7px] font-mono text-slate-700 uppercase truncate">{w.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
