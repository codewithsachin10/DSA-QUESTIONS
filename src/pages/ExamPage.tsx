import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, Clock, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import QuestionCard from '../components/QuestionCard';
import QuestionPalette from '../components/QuestionPalette';

const ExamPage = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    timeRemaining, 
    isExamStarted, 
    isExamFinished,
    tickTimer, 
    setAnswer, 
    clearAnswer, 
    markForReview, 
    nextQuestion, 
    prevQuestion, 
    submitExam 
  } = useStore();

  useEffect(() => {
    if (!isExamStarted) {
      navigate('/');
      return;
    }

    if (isExamFinished) {
      navigate('/result');
      return;
    }

    const timer = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, isExamFinished, navigate, tickTimer]);

  const currentQuestion = questions[currentQuestionIndex];
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining < 300;

  const handleFinish = async () => {
    if (window.confirm("Are you sure you want to submit and end the test?")) {
      submitExam();
      // Exit fullscreen
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (e) {
        console.warn('Could not exit fullscreen');
      }
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] relative font-sans">
      
      <header className="bg-white border-b-[1.5px] border-black py-3 px-6 flex justify-between items-center z-10 sticky top-0 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-black">Graph <span className="text-[#e53935]">Practice</span></span>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 border-[1.5px] rounded-[8px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isLowTime ? 'border-[#e53935] bg-[#ffebee] text-[#e53935]' : 'border-black bg-white text-black'}`}>
            {isLowTime ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            <span className="font-mono text-base font-bold">{formatTime(timeRemaining)}</span>
          </div>
          
          <button onClick={handleFinish} className="minimal-btn-primary py-2">
            End Test
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-[1400px] mx-auto w-full z-10">
        
        {/* Left: Question area — sticky so it stays in view */}
        <div className="flex-1 flex flex-col gap-6 w-full lg:sticky lg:top-[72px] lg:self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <QuestionCard 
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedAnswer={answers[currentQuestion.id] || ''}
                onSelect={(ans) => setAnswer(currentQuestion.id, ans)}
                onClear={() => clearAnswer(currentQuestion.id)}
              />
            </motion.div>
          </AnimatePresence>

          <div className="minimal-card p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-3">
              <button 
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="minimal-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> <span className="hidden sm:inline">Prev</span>
              </button>
              
              <button 
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="minimal-btn bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
            
            <button 
              onClick={() => markForReview(currentQuestion.id)}
              className="minimal-btn text-yellow-600 border-yellow-500 hover:bg-yellow-50"
            >
              <Flag className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Mark for Review</span>
            </button>
          </div>
        </div>

        {/* Right: Question palette — sticky with internal scroll */}
        <div className="w-full lg:w-[300px] lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-90px)]">
          <QuestionPalette />
        </div>
      </main>
    </div>
  );
};

export default ExamPage;
