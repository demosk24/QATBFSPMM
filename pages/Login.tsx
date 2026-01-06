
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Cpu, Mail, AlertTriangle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { MATRIX_CHARS } from '../constants';

interface LoginPageProps {
  externalError?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ externalError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  const [matrixLines, setMatrixLines] = useState<string[]>([]);
  
  useEffect(() => {
    const lines = Array.from({ length: 40 }).map(() => 
      Array.from({ length: 20 }).map(() => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]).join('')
    );
    setMatrixLines(lines);

    const interval = setInterval(() => {
      setMatrixLines(prev => prev.map(line => 
        line.substring(1) + MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setScanning(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('AUTHORIZATION DENIED: INVALID CREDENTIALS');
      setIsLoading(false);
      setScanning(false);
    }
  };

  const displayError = externalError || error;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      <div className="absolute inset-0 opacity-[0.05] flex justify-around pointer-events-none">
        {matrixLines.map((line, i) => (
          <div key={i} className="flex flex-col animate-matrix text-cyber-cyan leading-none text-[8px] font-mono">
            {line}
          </div>
        ))}
      </div>

      <div className={`relative w-full max-w-md glass-card p-12 rounded-[3rem] border border-white/5 transition-all duration-700 ${
        displayError ? 'border-cyber-red shadow-[0_0_60px_rgba(239,68,68,0.15)]' : 'shadow-[0_0_100px_rgba(0,0,0,0.9)]'
      }`}>
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-20 h-20 rounded-[2rem] bg-[#050505] border border-cyber-cyan/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
            <Cpu className="w-10 h-10 text-cyber-cyan" />
            {scanning && (
              <div className="absolute inset-0 bg-cyber-cyan/10 animate-[scan_1.5s_linear_infinite] overflow-hidden rounded-[2rem]">
                <div className="w-full h-0.5 bg-cyber-cyan shadow-[0_0_15px_#22d3ee]" />
              </div>
            )}
          </div>
          <h1 className="font-orbitron text-3xl font-black text-white tracking-tighter uppercase">NEXUS <span className="text-cyber-cyan">OS</span></h1>
          <p className="text-slate-500 text-[10px] font-mono mt-3 tracking-[0.5em] uppercase font-black opacity-60">Identity Verification</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest pl-2 font-black">Operator UID</label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dokkustic@admin.com"
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-cyber-cyan/40 focus:bg-white/[0.04] transition-all font-space"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyber-cyan transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest pl-2 font-black">Access Code</label>
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:outline-none focus:border-cyber-cyan/40 focus:bg-white/[0.04] transition-all font-space"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyber-cyan transition-colors" />
            </div>
          </div>

          {displayError && (
            <div className="bg-cyber-red/5 border border-cyber-red/20 p-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top duration-300">
              <AlertTriangle className="w-5 h-5 text-cyber-red shrink-0" />
              <span className="text-[10px] font-mono text-cyber-red font-bold tracking-widest uppercase leading-relaxed">{displayError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-cyber-cyan text-black font-orbitron font-black text-[11px] rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_60px_rgba(34,211,238,0.5)] transition-all transform active:scale-[0.97] tracking-[0.4em] uppercase"
          >
            {isLoading ? 'Decrypting...' : 'Initiate Uplink'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes scan { 0% { top: 0% } 100% { top: 100% } }
      `}</style>
    </div>
  );
};

export default LoginPage;
