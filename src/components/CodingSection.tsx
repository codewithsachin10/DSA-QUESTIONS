import { useState, useEffect } from 'react';
import { Terminal, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CodingQuestionCard, CodingQuestion } from './CodingQuestionCard';
import { cn } from './QuestionCard';

export const CodingSection = ({ course = 'DSA' }: { course?: string }) => {
  const [questionsData, setQuestionsData] = useState<CodingQuestion[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase.from('coding_challenges').select('*').eq('course', course).order('id');
      if (!error && data && data.length > 0) {
        setQuestionsData(data);
        setActiveQuestionId(data[0].id);
      }
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#e53935]" />
      </div>
    );
  }

  const activeQuestion = questionsData.find(q => q.id === activeQuestionId);

  return (
    <section className="w-full max-w-[1800px] mx-auto p-4 md:p-8 mt-6 mb-12 flex flex-col flex-1 h-full">
      <div className="mb-8 text-center md:text-left shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full mb-4 shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]">
          <Terminal className="w-3 h-3" /> Coding Playground
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-none">
          DSA <span className="text-[#e53935]">Codes</span>
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[600px]">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-80 shrink-0 bg-white border-4 border-black rounded-[12px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
          <div className="bg-[#f8f9fa] p-4 border-b-4 border-black shrink-0">
            <h3 className="font-black text-lg uppercase tracking-wider">Problem List</h3>
          </div>
          <div className="overflow-y-auto p-2 space-y-2 flex-1" style={{ scrollbarWidth: 'thin' }}>
            {questionsData.map((q) => {
              const isActive = q.id === activeQuestionId;
              return (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-[6px] border-2 transition-all flex items-start gap-3 group",
                    isActive 
                      ? "border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(229,57,53,1)]" 
                      : "border-transparent bg-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded shrink-0 flex items-center justify-center text-xs font-black border-2",
                    isActive ? "bg-[#e53935] border-[#e53935] text-white" : "bg-gray-200 border-gray-300 text-gray-500 group-hover:bg-white"
                  )}>
                    {q.id}
                  </div>
                  <div className="flex-1">
                    <div className={cn("text-xs font-bold uppercase tracking-wider mb-1", isActive ? "text-gray-300" : "text-gray-400")}>
                      {q.category}
                    </div>
                    <div className={cn("text-sm font-bold leading-tight", isActive ? "text-white" : "text-black")}>
                      {q.title}
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#e53935] shrink-0 self-center" />}
                </button>
              );
            })}
            
            {questionsData.length === 0 && (
              <div className="p-4 text-center text-gray-500 font-bold text-sm">
                No coding challenges available.
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {activeQuestion ? (
            <CodingQuestionCard key={activeQuestion.id} question={activeQuestion} />
          ) : (
            <div className="w-full h-full bg-white border-4 border-black rounded-[12px] flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-gray-500 font-black">
              SELECT A CHALLENGE TO BEGIN
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
