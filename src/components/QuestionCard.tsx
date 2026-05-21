import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: any;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string;
  onSelect: (answer: string) => void;
  onClear: () => void;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const QuestionCard = ({ question, questionNumber, totalQuestions, selectedAnswer, onSelect, onClear }: QuestionCardProps) => {
  if (!question) return null;

  const hasAnswered = selectedAnswer !== '' && selectedAnswer !== undefined;
  const isCorrectAnswer = hasAnswered && selectedAnswer === question.answer;

  return (
    <div className="minimal-card p-6 md:p-8 flex-1 flex flex-col min-h-[400px]">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          Question <span className="text-[#e53935]">{questionNumber}</span> 
          <span className="text-gray-400 font-medium text-sm">/ {totalQuestions}</span>
        </h2>
        {hasAnswered && (
          <button 
            onClick={onClear}
            className="text-xs font-semibold px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-black"
          >
            Clear Response
          </button>
        )}
      </div>

      <div className="text-lg md:text-xl font-semibold text-black mb-8 leading-relaxed">
        {question.question}
      </div>

      <div className="space-y-4 mt-auto">
        {question.options.map((option: string, idx: number) => {
          const isSelected = selectedAnswer === option;
          const isThisCorrect = option === question.answer;
          const letter = String.fromCharCode(65 + idx);

          // Determine styling based on answer state
          let optionStyle = "bg-white border-black text-black hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]";
          let letterStyle = "bg-gray-50 border-black text-black";
          let Icon = null;

          if (hasAnswered) {
            if (isSelected && isCorrectAnswer) {
              // User picked the correct answer — green
              optionStyle = "bg-[#f0fdf4] border-green-500 text-green-800 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)]";
              letterStyle = "bg-green-500 border-green-600 text-white";
              Icon = <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto shrink-0" />;
            } else if (isSelected && !isCorrectAnswer) {
              // User picked the wrong answer — red
              optionStyle = "bg-[#fff1f2] border-[#e53935] text-[#b91c1c] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]";
              letterStyle = "bg-[#e53935] border-[#b91c1c] text-white";
              Icon = <XCircle className="w-5 h-5 text-[#e53935] ml-auto shrink-0" />;
            } else if (!isSelected && isThisCorrect && !isCorrectAnswer) {
              // Highlight the correct answer when user got it wrong
              optionStyle = "bg-[#f0fdf4] border-green-500 text-green-800 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)]";
              letterStyle = "bg-green-500 border-green-600 text-white";
              Icon = <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto shrink-0" />;
            } else {
              // Unselected, non-correct option — dim it
              optionStyle = "bg-gray-50 border-gray-200 text-gray-400 cursor-default";
              letterStyle = "bg-gray-100 border-gray-200 text-gray-400";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !hasAnswered && onSelect(option)}
              disabled={hasAnswered}
              className={cn(
                "w-full text-left p-4 rounded-[8px] border-[1.5px] transition-all duration-200 flex items-center group relative overflow-hidden",
                hasAnswered ? "cursor-default" : "cursor-pointer",
                optionStyle
              )}
            >
              <div className={cn(
                "w-8 h-8 flex items-center justify-center mr-4 text-sm font-bold border-[1.5px] rounded transition-colors shrink-0",
                letterStyle
              )}>
                {letter}
              </div>
              <span className="text-base font-medium">{option}</span>
              {Icon}
            </button>
          );
        })}
      </div>

      {/* Feedback message after answering */}
      {hasAnswered && (
        <div className={cn(
          "mt-6 p-4 rounded-[8px] border-[1.5px] text-sm font-semibold flex items-center gap-3",
          isCorrectAnswer 
            ? "bg-[#f0fdf4] border-green-400 text-green-700" 
            : "bg-[#fff1f2] border-[#fca5a5] text-[#b91c1c]"
        )}>
          {isCorrectAnswer ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              Correct! Well done.
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-[#e53935] shrink-0" />
              Incorrect. The correct answer is: <span className="font-bold text-black">{question.answer}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
