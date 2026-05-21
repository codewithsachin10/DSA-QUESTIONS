import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CodingSection } from '../components/CodingSection';

const CodingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b-[1.5px] border-black py-3 px-6 flex items-center sticky top-0 z-20 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-bold text-black border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 rounded-[6px] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        <CodingSection />
      </main>
    </div>
  );
};

export default CodingPage;
