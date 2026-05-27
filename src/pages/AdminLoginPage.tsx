import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 antialiased selection:bg-[#e53935] selection:text-white">
      <div className="max-w-md w-full">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-black text-black mb-6 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO PLATFORM
        </button>

        {/* Login Box */}
        <div className="bg-white border-4 border-black rounded-[12px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-[#e53935]"></div>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#e53935] rounded-[12px] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-center text-black uppercase tracking-tight mb-2">
            Admin Authentication
          </h2>
          <p className="text-center text-gray-500 font-bold text-sm mb-8">
            Secure access to the Cockpit
          </p>

          {errorMsg && (
            <div className="bg-[#ffebee] border-2 border-[#e53935] text-[#e53935] px-4 py-3 rounded-[8px] font-bold text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#e53935] animate-ping shrink-0"></div>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-gray-500 tracking-widest block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-black rounded-[8px] font-bold text-black focus:outline-none focus:border-[#e53935] focus:bg-white transition-colors"
                  placeholder="admin@platform.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-gray-500 tracking-widest block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-black rounded-[8px] font-bold text-black focus:outline-none focus:border-[#e53935] focus:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white border-2 border-black font-black uppercase tracking-widest py-3.5 rounded-[8px] mt-4 shadow-[4px_4px_0px_0px_rgba(229,57,53,1)] hover:bg-gray-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
