import { useStore } from '../store/useStore';
import { cn } from './QuestionCard';

const QuestionPalette = () => {
  const { questions, currentQuestionIndex, questionStatus, goToQuestion } = useStore();

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) return "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]";
    if (status === 'answered') return "bg-[#e53935] text-white border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]";
    if (status === 'review') return "bg-yellow-300 text-black border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]";
    if (status === 'unanswered') return "bg-[#ffebee] text-[#e53935] border-[#e53935] shadow-none";
    return "bg-white text-black border-black shadow-none hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]";
  };

  const getStatusSummary = () => {
    let answered = 0;
    let notAnswered = 0;
    let review = 0;
    let notVisited = 0;

    Object.values(questionStatus).forEach(s => {
      if (s === 'answered') answered++;
      if (s === 'unanswered') notAnswered++;
      if (s === 'review') review++;
    });

    notVisited = questions.length - (answered + notAnswered + review);

    return { answered, notAnswered, review, notVisited };
  };

  const summary = getStatusSummary();

  return (
    <div className="minimal-card p-6 w-full lg:w-72 flex flex-col bg-white relative lg:max-h-[calc(100vh-90px)] lg:overflow-hidden">
      
      <div className="flex items-center gap-2 text-[#e53935] font-bold mb-4 pb-4 border-b-[1.5px] border-gray-100">
        <span className="w-5 h-5 rounded-full border-[1.5px] border-[#e53935] flex items-center justify-center text-xs">!</span>
        Questions
      </div>
      
      <div className="grid grid-cols-5 gap-2.5 mb-4 overflow-y-auto pr-2 flex-1 p-1" style={{ scrollbarWidth: 'thin' }}>
        {questions.map((q, idx) => {
          const status = questionStatus[q.id] || 'unvisited';
          const isCurrent = idx === currentQuestionIndex;
          
          return (
            <button
              key={q.id}
              onClick={() => goToQuestion(idx)}
              className={cn(
                "w-10 h-10 flex items-center justify-center font-bold text-sm border-[1.5px] rounded-[6px] transition-all duration-150",
                getStatusColor(status, isCurrent)
              )}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-auto space-y-3 pt-6 border-t-[1.5px] border-gray-100">
        <div className="flex justify-between items-center text-sm font-medium text-black">
          <div className="flex items-center">
            <div className="w-4 h-4 border-[1.5px] border-black bg-[#e53935] rounded-sm mr-3"></div>
            Answered
          </div>
          <span className="font-bold">{summary.answered}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-black">
          <div className="flex items-center">
            <div className="w-4 h-4 border-[1.5px] border-[#e53935] bg-[#ffebee] rounded-sm mr-3"></div>
            Not Answered
          </div>
          <span className="font-bold">{summary.notAnswered}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-black">
          <div className="flex items-center">
            <div className="w-4 h-4 border-[1.5px] border-black bg-yellow-300 rounded-sm mr-3"></div>
            Review
          </div>
          <span className="font-bold">{summary.review}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-medium text-black">
          <div className="flex items-center">
            <div className="w-4 h-4 border-[1.5px] border-black bg-white rounded-sm mr-3"></div>
            Not Visited
          </div>
          <span className="font-bold">{summary.notVisited}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
