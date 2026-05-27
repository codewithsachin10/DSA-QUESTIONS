import { useNavigate } from 'react-router-dom';
import { Terminal, Database, ArrowRight, Code2 } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans antialiased text-black overflow-hidden relative">
      
      {/* Top Header */}
      <header className="bg-white border-b-4 border-black py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30 shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e53935] rounded-[8px] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight leading-none text-black">
            CodeNest <span className="text-[#e53935]">2.0</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          className="font-black text-sm uppercase tracking-widest bg-black text-white px-5 py-2 rounded-[8px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(229,57,53,1)] hover:bg-gray-900 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          Admin Panel
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#ffebee] border-2 border-[#e53935] text-[#e53935] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Select Your Curriculum
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-black drop-shadow-[4px_4px_0px_rgba(229,57,53,0.2)]">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53935] to-black">Path</span>
          </h2>
          <p className="text-lg md:text-xl font-bold text-gray-500 max-w-2xl mx-auto">
            Master Data Structures or dive deep into Data Science and Logic with Python.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* DSA Card */}
          <button 
            onClick={() => navigate('/dsa')}
            className="group relative bg-white border-4 border-black rounded-[16px] p-8 md:p-12 text-left shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] transition-all active:translate-y-[12px] active:translate-x-[12px] active:shadow-none overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ffebee] rounded-full blur-3xl opacity-50 group-hover:bg-[#ffcdd2] transition-colors pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-black rounded-[12px] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(229,57,53,1)] mb-8">
                <Database className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">
                DSA <br/><span className="text-[#e53935]">Mastery</span>
              </h3>
              <p className="font-bold text-gray-500 text-lg mb-8 leading-relaxed">
                Practice Graph traversals, Trees, Dynamic Programming, and comprehensive MCQs.
              </p>
              
              <div className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black group-hover:text-[#e53935] transition-colors">
                Enter Course <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>

          {/* PYTHON Card */}
          <button 
            onClick={() => navigate('/python')}
            className="group relative bg-white border-4 border-black rounded-[16px] p-8 md:p-12 text-left shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[4px] hover:translate-x-[4px] transition-all active:translate-y-[12px] active:translate-x-[12px] active:shadow-none overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:bg-blue-100 transition-colors pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-[#e53935] rounded-[12px] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                <Terminal className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">
                Python <br/><span className="text-blue-600">Science</span>
              </h3>
              <p className="font-bold text-gray-500 text-lg mb-8 leading-relaxed">
                Learn Dictionaries, Exception Handling, NumPy arrays, and Pandas DataFrames.
              </p>
              
              <div className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black group-hover:text-blue-600 transition-colors">
                Enter Course <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </button>

        </div>
      </main>

    </div>
  );
}
