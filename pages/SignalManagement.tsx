
import React, { useState, useEffect } from 'react';
import { Plus, X, Clock, Radio, TrendingUp, TrendingDown, Zap, Trash2, Edit2, AlertCircle, Save } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, query, limit, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface TradeSignal {
  pair: string;
  time: string;
  type: 'CALL' | 'PUT';
}

const SignalManagement: React.FC = () => {
  const [currentSignalDoc, setCurrentSignalDoc] = useState<any>(null);
  const [bulkInput, setBulkInput] = useState('');
  const [isAddingBulk, setIsAddingBulk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSuperAdmin = auth.currentUser?.email === 'dokkustic@admin.com';

  useEffect(() => {
    // Listen for the primary signal document
    const q = query(collection(db, 'qx-todaySignal-autoTrading-bot'), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setCurrentSignalDoc({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } else {
        setCurrentSignalDoc(null);
      }
    });
    return () => unsub();
  }, []);

  const handleBulkAdd = async () => {
    if (!isSuperAdmin) {
      setError('ACCESS DENIED: SUPER ADMIN PERMISSION REQUIRED');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate JSON input
      const parsed = JSON.parse(bulkInput);
      if (!Array.isArray(parsed)) throw new Error("Input must be an array of objects");

      // Validate each object in array and ensure they are serialized correctly
      const validatedQueue = parsed.map((item: any, idx: number) => {
        if (!item.pair || !item.time || !item.type) {
          throw new Error(`Item at index ${idx} is missing required fields (pair, time, type)`);
        }
        return {
          pair: String(item.pair).toUpperCase(),
          time: String(item.time),
          type: String(item.type).toUpperCase() as 'CALL' | 'PUT'
        };
      });

      const today = new Date().toISOString().split('T')[0];
      // We use a constant ID or a unique one per day, but here we replace the current document to ensure queue order.
      const docId = currentSignalDoc?.id || `DOC_${Date.now()}`;

      // Overwrite document to guarantee the order of the tradingQueue array exactly as provided in the input
      await setDoc(doc(db, 'qx-todaySignal-autoTrading-bot', docId), {
        signalDate: today,
        tradingQueue: validatedQueue,
        lastUpdated: new Date().toISOString(),
        version: '7.2'
      });

      setSuccess('BROADCAST SUCCESSFUL: SERIAL ORDER COMMITTED');
      setBulkInput('');
      setIsAddingBulk(false);
    } catch (e: any) {
      setError(`INJECTION FAILED: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearQueue = async () => {
    if (!isSuperAdmin || !currentSignalDoc) return;
    if (window.confirm("FLUSH SYSTEM SIGNAL QUEUE? THIS CANNOT BE UNDONE.")) {
      await deleteDoc(doc(db, 'qx-todaySignal-autoTrading-bot', currentSignalDoc.id));
      setSuccess('QUEUE FLUSHED');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {(error || success) && (
        <div className={`fixed top-10 right-10 z-[100] p-6 rounded-[2.5rem] border shadow-2xl flex items-center gap-5 animate-in slide-in-from-right duration-500 ${
          error ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red shadow-cyber-red/20' : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green shadow-cyber-green/20'
        }`}>
          <div className={`w-3 h-3 rounded-full ${error ? 'bg-cyber-red' : 'bg-cyber-green'} animate-pulse`} />
          <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em]">{error || success}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-orbitron font-black text-white uppercase tracking-tighter">Signal Matrix</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em] mt-2 font-black opacity-60">Neural Trade Distribution Core</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={clearQueue}
            className="px-10 py-5 border border-cyber-red/20 text-cyber-red/60 font-orbitron font-black text-[10px] rounded-[2rem] hover:bg-cyber-red/10 hover:text-cyber-red transition-all uppercase tracking-[0.3em]"
          >
            Flush Queue
          </button>
          <button 
            onClick={() => setIsAddingBulk(true)}
            className="flex items-center gap-3 px-10 py-5 bg-cyber-cyan text-black font-orbitron font-black text-[10px] rounded-[2rem] shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all tracking-[0.3em] uppercase transform active:scale-95"
          >
            <Zap className="w-4 h-4" /> Inject Batch Data
          </button>
        </div>
      </div>

      {isAddingBulk && (
        <div className="glass-card p-14 rounded-[5rem] border border-cyber-cyan/30 animate-in slide-in-from-top duration-700 bg-black/95 backdrop-blur-3xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-cyber-cyan/20 overflow-hidden">
             <div className="h-full bg-cyber-cyan w-1/4 animate-[loading-bar_2s_infinite]" />
           </div>
           
           <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-orbitron font-black text-white uppercase tracking-[0.2em]">Matrix Injection</h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-widest opacity-60">Serial ordering will be preserved during broadcast</p>
              </div>
              <button onClick={() => setIsAddingBulk(false)} className="text-slate-500 hover:text-white transition-all bg-white/[0.05] p-4 rounded-[1.5rem] border border-white/10 shadow-lg"><X className="w-8 h-8" /></button>
           </div>
           
           <textarea 
             className="w-full h-80 bg-black/70 border border-white/[0.05] rounded-[2.5rem] p-10 text-[13px] font-mono text-cyber-cyan focus:outline-none focus:border-cyber-cyan/50 mb-10 shadow-inner custom-scrollbar resize-none"
             placeholder='[
  { "pair": "EURUSD", "time": "16:11", "type": "PUT" },
  { "pair": "EURUSD", "time": "16:22", "type": "CALL" }
]'
             value={bulkInput}
             onChange={(e) => setBulkInput(e.target.value)}
           />
           
           <div className="flex items-center gap-8">
             <button 
               onClick={handleBulkAdd} disabled={loading}
               className="flex-1 py-7 bg-cyber-cyan text-black font-orbitron font-black text-[12px] rounded-[2.5rem] shadow-[0_0_80px_rgba(34,211,238,0.4)] hover:shadow-[0_0_100px_rgba(34,211,238,0.6)] transition-all uppercase tracking-[0.6em] transform active:scale-95"
             >
               {loading ? 'SYNCHRONIZING MATRIX...' : 'COMMIT BATCH BROADCAST'}
             </button>
             <div className="text-right">
                <p className="text-[10px] font-mono text-slate-700 uppercase font-black tracking-widest mb-1">Queue Protocol</p>
                <p className="text-sm font-orbitron font-black text-white">QX-SERIAL-V7</p>
             </div>
           </div>
        </div>
      )}

      <div className="glass-card rounded-[4rem] border border-white/5 overflow-hidden bg-[#050505]/80 shadow-[0_50px_150px_rgba(0,0,0,0.6)]">
        <div className="px-14 py-10 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-[1.5rem] bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <Radio className="w-6 h-6 text-cyber-cyan animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-[0.4em]">Active Queue Registry</span>
                <p className="text-[9px] font-mono text-slate-600 uppercase font-bold mt-1">Real-time Shard: Alpha-7 | Status: Verified</p>
              </div>
           </div>
           <div className="px-8 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-[11px] font-mono text-slate-400 font-black tracking-widest">
             NODES DETECTED: {currentSignalDoc?.tradingQueue?.length || 0}
           </div>
        </div>
        
        <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.03]">
                <th className="px-14 py-8 text-[11px] font-mono font-black text-slate-600 uppercase tracking-[0.3em]">Execution Time</th>
                <th className="px-14 py-8 text-[11px] font-mono font-black text-slate-600 uppercase tracking-[0.3em]">Market Cluster</th>
                <th className="px-14 py-8 text-[11px] font-mono font-black text-slate-600 uppercase tracking-[0.3em]">Protocol Type</th>
                <th className="px-14 py-8 text-[11px] font-mono font-black text-slate-600 uppercase tracking-[0.3em] text-right">Matrix Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {currentSignalDoc?.tradingQueue?.map((signal: TradeSignal, i: number) => (
                <tr key={i} className="hover:bg-white/[0.01] transition-all group border-l-4 border-l-transparent hover:border-l-cyber-cyan">
                  <td className="px-14 py-8">
                     <div className="flex items-center gap-5">
                       <Clock className="w-5 h-5 text-slate-700 group-hover:text-cyber-cyan transition-colors" />
                       <span className="text-base font-mono text-slate-100 font-black tracking-[0.2em]">{signal.time}</span>
                     </div>
                  </td>
                  <td className="px-14 py-8">
                     <div className="flex items-center gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan group-hover:shadow-[0_0_10px_#22d3ee] transition-all" />
                       <span className="text-base font-orbitron font-black text-white tracking-[0.25em] uppercase">{signal.pair}</span>
                     </div>
                  </td>
                  <td className="px-14 py-8">
                     <span className={`px-8 py-2.5 rounded-[1.25rem] border text-[11px] font-black tracking-[0.4em] flex items-center gap-4 w-fit shadow-xl ${
                       signal.type === 'CALL' 
                        ? 'text-cyber-green border-cyber-green/20 bg-cyber-green/5 shadow-cyber-green/10' 
                        : 'text-cyber-red border-cyber-red/20 bg-cyber-red/5 shadow-cyber-red/10'
                     }`}>
                       {signal.type === 'CALL' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                       {signal.type}
                     </span>
                  </td>
                  <td className="px-14 py-8 text-right">
                     <div className="flex items-center justify-end gap-5">
                       <button className="p-4 text-slate-700 hover:text-cyber-cyan transition-all bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"><Edit2 className="w-5 h-5" /></button>
                       <button className="p-4 text-slate-700 hover:text-cyber-red transition-all bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"><Trash2 className="w-5 h-5" /></button>
                     </div>
                  </td>
                </tr>
              ))}
              
              {(!currentSignalDoc || currentSignalDoc.tradingQueue?.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-14 py-48 text-center">
                    <div className="flex flex-col items-center gap-10 opacity-20">
                      <div className="relative">
                        <Radio className="w-32 h-32 text-slate-500 animate-pulse" />
                        <div className="absolute inset-0 border-2 border-slate-600 rounded-full animate-ping opacity-10" />
                      </div>
                      <p className="font-mono text-xs uppercase tracking-[0.8em] text-slate-400 font-black">Awaiting Matrix Uplink...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default SignalManagement;
