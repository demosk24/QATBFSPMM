
import React from 'react';
import { ShieldAlert, Terminal, Eye, Filter, Download, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SecurityLog } from '../types';

const LOGS: SecurityLog[] = [
  { id: 'LOG-001', event: 'Super Admin login successful', ip: '185.12.92.1', timestamp: '2024-05-20 14:22:01', status: 'SUCCESS' },
  { id: 'LOG-002', event: 'Multiple failed password attempts detected', ip: '92.118.160.2', timestamp: '2024-05-20 14:15:12', status: 'FAILED' },
  { id: 'LOG-003', event: 'API Key regenerated: Operator #124', ip: 'Localhost', timestamp: '2024-05-20 13:58:33', status: 'WARNING' },
  { id: 'LOG-004', event: 'System core files integrity check', ip: 'Internal', timestamp: '2024-05-20 13:30:00', status: 'SUCCESS' },
  { id: 'LOG-005', event: 'Suspicious IP blocked: Threat Intelligence feed', ip: '45.14.22.8', timestamp: '2024-05-20 12:44:11', status: 'FAILED' },
  { id: 'LOG-006', event: 'New user "Sophia Chen" authorized', ip: '185.12.92.1', timestamp: '2024-05-20 11:20:05', status: 'SUCCESS' },
];

const SecurityLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-white tracking-tight">Security Protocol</h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Event Logs & Threat Monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 glass border border-white/5 text-slate-400 rounded-lg hover:text-cyber-cyan transition-all text-xs font-mono">
            <Download className="w-4 h-4" /> EXPORT LOGS
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyber-red/20 text-cyber-red border border-cyber-red/30 rounded-lg font-orbitron font-bold text-xs hover:bg-cyber-red/30 transition-all">
            <ShieldAlert className="w-4 h-4" /> FLUSH BUFFERS
          </button>
        </div>
      </div>

      {/* Threat Level Indicator */}
      <div className="glass p-6 rounded-2xl border border-cyber-green/20 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full border-4 border-cyber-green/30 border-t-cyber-green animate-spin flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-cyber-green">SCAN</span>
          </div>
          <div>
            <h3 className="font-orbitron text-lg font-bold text-white">System Threat Level: <span className="text-cyber-green">LOW</span></h3>
            <p className="text-sm text-slate-400">Core firewall operational. Active protection shielding 1,284 nodes. Last scan 2 mins ago.</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 h-full flex items-center opacity-10">
          <Terminal className="w-32 h-32" />
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass rounded-2xl border border-white/5 bg-black/40 font-mono">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-cyan" />
            <span className="text-xs font-bold text-cyber-cyan tracking-widest uppercase">System Journal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-cyber-green" /> Success
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-cyber-yellow" /> Warning
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <div className="w-2 h-2 rounded-full bg-cyber-red" /> Alert
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase tracking-widest">Event Description</th>
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase tracking-widest">Source IP</th>
                <th className="px-6 py-4 text-[10px] text-slate-500 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 text-cyber-green" />}
                      {log.status === 'WARNING' && <Info className="w-3 h-3 text-cyber-yellow" />}
                      {log.status === 'FAILED' && <AlertTriangle className="w-3 h-3 text-cyber-red" />}
                      <span className={`text-[11px] ${
                        log.status === 'SUCCESS' ? 'text-slate-200' :
                        log.status === 'WARNING' ? 'text-cyber-yellow/80' :
                        'text-cyber-red/80'
                      }`}>
                        {log.event}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-slate-500">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-slate-600 hover:text-cyber-cyan transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityLogs;
