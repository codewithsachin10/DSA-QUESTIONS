import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Home, ArrowLeft, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../components/QuestionCard';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { questions, answers, isExamFinished } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isExamFinished) {
    navigate('/');
    return null;
  }

  const question = questions[currentIndex];
  const userAnswer = answers[question.id];
  const isCorrect = userAnswer === question.answer;
  const isAttempted = userAnswer !== undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] font-sans relative">
      <header className="bg-white border-b-[1.5px] border-black py-3 px-6 flex justify-between items-center sticky top-0 z-20 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/result')}
            className="p-2 hover:bg-[#ffebee] hover:text-[#e53935] rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-black">Review Mode</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="minimal-btn py-2 px-4"
        >
          <Home className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Home</span>
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 mt-4">
        
        <div className="flex justify-between items-center bg-white border-[1.5px] border-black p-4 rounded-[8px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-black font-bold text-lg">
            Question <span className="text-[#e53935]">{currentIndex + 1}</span> of {questions.length}
          </div>
          <div className={cn(
            "px-4 py-1.5 border-[1.5px] rounded-md text-sm font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            isCorrect ? "bg-[#f6fff8] border-green-600 text-green-700" : 
            !isAttempted ? "bg-gray-50 border-gray-400 text-gray-600" : 
            "bg-[#fff9fa] border-[#e53935] text-[#e53935]"
          )}>
            {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : !isAttempted ? null : <XCircle className="w-4 h-4" />}
            {isCorrect ? "Correct" : !isAttempted ? "Skipped" : "Incorrect"}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col gap-6"
          >
            <div className="minimal-card p-6 md:p-8">
              <div className="text-lg md:text-xl font-semibold text-black mb-8 leading-relaxed">
                {question.question}
              </div>

              <div className="space-y-4">
                {question.options.map((option, idx) => {
                  const isUserSelection = userAnswer === option;
                  const isCorrectAnswer = option === question.answer;
                  
                  let optionClass = "bg-white border-[1.5px] border-gray-300 text-black";
                  let Icon = null;
                  
                  if (isCorrectAnswer) {
                    optionClass = "bg-[#f6fff8] border-[1.5px] border-green-500 text-green-800 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)]";
                    Icon = <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />;
                  } else if (isUserSelection && !isCorrect) {
                    optionClass = "bg-[#fff9fa] border-[1.5px] border-[#e53935] text-[#b91c1c] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]";
                    Icon = <XCircle className="w-5 h-5 text-[#e53935] ml-auto" />;
                  }

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "w-full text-left p-4 rounded-[8px] flex items-center transition-all",
                        optionClass
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center mr-4 text-sm font-bold border-[1.5px] rounded shrink-0",
                        isCorrectAnswer ? "bg-green-100 border-green-500 text-green-700" :
                        isUserSelection && !isCorrect ? "bg-[#ffebee] border-[#e53935] text-[#e53935]" :
                        "bg-gray-50 border-gray-300 text-gray-500"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-base font-medium">{option}</span>
                      {Icon}
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div className="mt-8 p-5 bg-[#fff9fa] border-[1.5px] border-[#e53935] rounded-[8px] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]">
                  <h4 className="text-[#e53935] font-bold text-base mb-2 flex items-center gap-2 uppercase tracking-wide">
                    <BookOpen className="w-4 h-4 text-[#e53935]" /> Explanation
                  </h4>
                  <p className="text-black text-sm font-medium leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-auto pt-4 pb-8">
          <button 
            onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
            disabled={currentIndex === 0}
            className="minimal-btn disabled:opacity-50 disabled:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:transform-none"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Prev
          </button>
          
          <button 
            onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
            disabled={currentIndex === questions.length - 1}
            className="minimal-btn-primary disabled:opacity-50 disabled:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:transform-none"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ReviewPage;
