import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { CodingSection } from '../components/CodingSection';

const CodingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b-[1.5px] border-black py-3 px-6 flex justify-between items-center sticky top-0 z-20 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-black border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 rounded-[6px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <a
          href="/editor"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-black text-black border-2 border-black bg-yellow-300 hover:bg-yellow-400 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 rounded-[6px] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
        >
          Open Editor <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </header>

      <main className="flex-1 flex flex-col">
        <CodingSection />
      </main>
    </div>
  );
};

export default CodingPage;
