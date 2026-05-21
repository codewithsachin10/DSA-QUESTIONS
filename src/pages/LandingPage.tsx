import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Clock, FileText, Layers, Trophy, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { useStore, TestHistory } from '../store/useStore';
import ReportModal from '../components/ReportModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { startExam, resetExam, testHistory } = useStore();
  const [selectedReport, setSelectedReport] = useState<TestHistory | null>(null);

  const handleStart = async () => {
    resetExam();
    startExam(30);
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.warn('Fullscreen not supported or denied');
    }
    navigate('/exam');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
      
      {/* Header */}
      <header className="bg-white border-b-[1.5px] border-black py-3 px-6 flex justify-between items-center sticky top-0 z-20 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#e53935] rounded-[6px] border-[1.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Network className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-black">Graph <span className="text-[#e53935]">Practice</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ffebee] border-[1.5px] border-black rounded-full flex items-center justify-center text-xs font-bold text-[#e53935]">
            SG
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1200px] mx-auto w-full p-4 md:p-6 gap-6">
        
        {/* Sidebar — Past Tests */}
        <aside className="w-full lg:w-[280px] shrink-0 order-2 lg:order-1">
          <div className="minimal-card p-5 bg-white lg:sticky lg:top-[72px]">
            <div className="flex items-center gap-2 text-[#e53935] font-bold mb-4 pb-3 border-b-[1.5px] border-gray-100">
              <Trophy className="w-4 h-4" />
              Past Results
            </div>

            {testHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-400">No tests taken yet</p>
                <p className="text-xs text-gray-300 mt-1">Your results will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testHistory.map((entry) => {
                  const percent = Math.round((entry.score / entry.total) * 100);
                  const color = percent >= 70 ? 'text-green-600 bg-[#f0fdf4] border-green-200' : percent >= 50 ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : 'text-[#e53935] bg-[#fff9fa] border-[#fca5a5]';
                  
                  return (
                    <div key={entry.id} onClick={() => setSelectedReport(entry)} className="p-3 border-[1.5px] border-gray-200 rounded-[8px] hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
                          {percent}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-black">{entry.score}</span>
                        <span className="text-sm text-gray-400 font-medium">/ {entry.total}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400 font-medium">{entry.timeTaken}</span>
                        <span className="text-xs text-[#e53935] font-semibold">View Report →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Center — Test Card */}
        <div className="flex-1 flex items-start justify-center order-1 lg:order-2">
          <div className="minimal-card max-w-xl w-full p-8 md:p-10 bg-white">
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b-[1.5px] border-gray-100">
              <div className="w-12 h-12 bg-[#ffebee] border-[1.5px] border-black rounded-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <Network className="w-6 h-6 text-[#e53935]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black tracking-tight">Graph MCQ Practice</h1>
                <p className="text-sm text-gray-500 font-medium">Data Structures & Algorithms</p>
              </div>
            </div>

            {/* Test Details */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-[8px]">
                <FileText className="w-5 h-5 text-[#e53935] mb-2" />
                <span className="text-2xl font-black text-black">150</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Questions</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-[8px]">
                <Clock className="w-5 h-5 text-[#e53935] mb-2" />
                <span className="text-2xl font-black text-black">30</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Minutes</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-[8px]">
                <Layers className="w-5 h-5 text-[#e53935] mb-2" />
                <span className="text-2xl font-black text-black">MCQ</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8 p-4 bg-[#fff9fa] border-[1.5px] border-[#fca5a5] rounded-[8px]">
              <h3 className="text-sm font-bold text-[#e53935] uppercase tracking-wider mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-black font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-[#e53935] mt-0.5">•</span>
                  The test will enter fullscreen mode automatically.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e53935] mt-0.5">•</span>
                  Select the correct option for each question.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e53935] mt-0.5">•</span>
                  Correct answers turn green, wrong answers turn red.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#e53935] mt-0.5">•</span>
                  Click "End Test" to submit and view your report.
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              className="minimal-btn-primary w-full text-lg py-4 justify-center"
            >
              Start Test <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-[1.5px] border-gray-200 py-4 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-400 font-medium">
          <span>Graph MCQ Practice Platform — DSA Unit 4</span>
          <span>Built for exam preparation</span>
        </div>
      </footer>

      {/* Report Modal */}
      {selectedReport && (
        <ReportModal entry={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
};

export default LandingPage;
