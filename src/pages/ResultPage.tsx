import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, RefreshCw, BookOpen, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';

const ResultPage = () => {
  const navigate = useNavigate();
  const { questions, answers, timeRemaining, isExamFinished, resetExam } = useStore();

  useEffect(() => {
    if (!isExamFinished) {
      navigate('/');
      return;
    }
    // Exit fullscreen when showing results
    const exitFs = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (e) {
        // ignore
      }
    };
    exitFs();
  }, [isExamFinished, navigate]);

  if (!isExamFinished) return null;

  const totalQuestions = questions.length;
  let correctAnswers = 0;
  
  questions.forEach(q => {
    if (answers[q.id] === q.answer) {
      correctAnswers++;
    }
  });

  const wrongAnswers = Object.keys(answers).length - correctAnswers;
  const score = correctAnswers;
  const accuracy = Object.keys(answers).length > 0 
    ? Math.round((correctAnswers / Object.keys(answers).length) * 100) 
    : 0;

  const timeTaken = (30 * 60) - timeRemaining; 

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const getGreeting = () => {
    const percent = (score / totalQuestions) * 100;
    if (percent >= 90) return "Outstanding Performance!";
    if (percent >= 70) return "Great Job!";
    if (percent >= 50) return "Good Effort!";
    return "Needs Improvement.";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center py-12 px-4 relative font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="minimal-card max-w-4xl w-full p-8 md:p-12 z-10 bg-white relative"
      >
        <div className="text-center mb-12 relative border-b-[1.5px] border-gray-100 pb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 border-[1.5px] border-black bg-[#ffebee] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] rounded-full mb-6">
            <Trophy className="w-10 h-10 text-[#e53935]" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-3 tracking-tight">{getGreeting()}</h1>
          <p className="text-lg font-medium text-gray-600">
            You scored <span className="text-black font-bold">{score}</span> out of <span className="text-black font-bold">{totalQuestions}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-[1.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-[12px] p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black text-black mb-2">{accuracy}%</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1.5"><Target className="w-4 h-4"/> Accuracy</div>
          </div>
          <div className="bg-[#f6fff8] border-[1.5px] border-green-600 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)] rounded-[12px] p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black text-green-700 mb-2">{correctAnswers}</div>
            <div className="text-sm font-bold text-green-600 uppercase tracking-wider flex justify-center items-center gap-1.5"><Flame className="w-4 h-4"/> Correct</div>
          </div>
          <div className="bg-[#fff9fa] border-[1.5px] border-[#e53935] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] rounded-[12px] p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black text-[#e53935] mb-2">{wrongAnswers}</div>
            <div className="text-sm font-bold text-[#e53935] uppercase tracking-wider flex items-center justify-center gap-1.5">Incorrect</div>
          </div>
          <div className="bg-white border-[1.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-[12px] p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black text-black mb-2">{formatTime(timeTaken)}</div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1.5"><Clock className="w-4 h-4"/> Time</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => navigate('/review')}
            className="minimal-btn py-3 px-8 text-base w-full sm:w-auto"
          >
            <BookOpen className="w-5 h-5 mr-2" /> Review Answers
          </button>
          
          <button 
            onClick={() => {
              resetExam();
              navigate('/');
            }}
            className="minimal-btn-primary py-3 px-8 text-base w-full sm:w-auto"
          >
            <RefreshCw className="w-5 h-5 mr-2" /> Retake Practice
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;
