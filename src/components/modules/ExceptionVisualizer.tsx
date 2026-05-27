import { useState } from 'react';
import { AlertTriangle, Play, ShieldAlert } from 'lucide-react';

export default function ExceptionVisualizer() {
  const [codeType, setCodeType] = useState<'safe' | 'error'>('safe');
  const [status, setStatus] = useState<'idle' | 'running' | 'caught' | 'crashed'>('idle');

  const handleRun = () => {
    setStatus('running');
    setTimeout(() => {
      if(codeType === 'safe') {
        setStatus('idle');
      } else {
        setStatus('caught');
      }
    }, 1500);
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full p-4 md:p-6 bg-white rounded-[12px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 border-b-2 border-black pb-4">
        <div className="w-10 h-10 bg-red-100 border-2 border-black rounded-[8px] flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">Try-Catch Flow Visualizer</h2>
          <p className="text-sm font-medium text-gray-500">Watch how execution flows when an error occurs.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setCodeType('safe')}
          className={`flex-1 py-3 border-2 border-black rounded-[8px] font-black uppercase tracking-widest text-sm transition-all ${codeType === 'safe' ? 'bg-[#f0fdf4] text-green-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          Inject Safe Code
        </button>
        <button 
          onClick={() => setCodeType('error')}
          className={`flex-1 py-3 border-2 border-black rounded-[8px] font-black uppercase tracking-widest text-sm transition-all ${codeType === 'error' ? 'bg-[#fff9fa] text-[#e53935] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          Inject Error (ZeroDivision)
        </button>
      </div>

      <div className="flex-1 bg-[#f8f9fa] border-2 border-black rounded-[8px] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Main Flow Path */}
        <div className="w-1 h-full bg-black absolute top-0 left-1/2 -translate-x-1/2 z-0"></div>

        {/* Try Block */}
        <div className={`relative z-10 w-full max-w-md bg-white border-2 border-black rounded-[8px] p-4 mb-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${status === 'running' ? 'border-[#3b82f6] shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]' : ''}`}>
          <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 border-b-2 border-gray-100 pb-2">Try Block</div>
          <pre className="font-mono text-sm">
            {codeType === 'safe' ? (
              <span className="text-green-600">result = 10 / 2\nprint("Success!")</span>
            ) : (
              <span className={status === 'running' ? 'text-red-600 font-bold' : 'text-gray-800'}>result = 10 / 0  <span className="text-gray-400"># &lt;- Error occurs here</span></span>
            )}
          </pre>
        </div>

        {/* Catch Block */}
        <div className={`relative z-10 w-full max-w-md bg-white border-2 border-black rounded-[8px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${status === 'caught' ? 'border-[#e53935] shadow-[4px_4px_0px_0px_rgba(229,57,53,1)] bg-[#fff9fa]' : ''}`}>
          <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 border-b-2 border-gray-100 pb-2">Except Block</div>
          <pre className="font-mono text-sm text-gray-800">
            except ZeroDivisionError:<br/>
            &nbsp;&nbsp;print("Cannot divide by zero!")
          </pre>
          {status === 'caught' && (
            <div className="mt-4 bg-[#e53935] text-white font-bold text-xs p-2 rounded flex items-center justify-center gap-2 animate-bounce">
              <ShieldAlert className="w-4 h-4" /> ERROR CAUGHT & HANDLED!
            </div>
          )}
        </div>

        {/* Animated Bug/Execution Token */}
        {status === 'running' && (
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-black z-20 animate-[fall_1.5s_ease-in-out_forwards]"></div>
        )}

      </div>

      <button onClick={handleRun} disabled={status === 'running'} className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-[8px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(229,57,53,1)] hover:bg-gray-900 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        <Play className="w-5 h-5 fill-current" /> Execute Code
      </button>

      <style>{`
        @keyframes fall {
          0% { top: 10%; background-color: #3b82f6; }
          50% { top: 35%; background-color: ${codeType === 'error' ? '#ef4444' : '#22c55e'}; }
          100% { top: ${codeType === 'error' ? '70%' : '100%'}; background-color: ${codeType === 'error' ? '#ef4444' : '#22c55e'}; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
