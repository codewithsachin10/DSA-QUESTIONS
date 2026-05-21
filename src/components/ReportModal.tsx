import { useState } from 'react';
import { X, Trophy, Target, Clock, CheckCircle2, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { TestHistory } from '../store/useStore';
import { cn } from './QuestionCard';

interface ReportModalProps {
  entry: TestHistory;
  onClose: () => void;
}

const ReportModal = ({ entry, onClose }: ReportModalProps) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const percent = Math.round((entry.score / entry.total) * 100);
  const details = entry.details || [];
  const wrong = entry.wrong ?? (entry.total - entry.score);
  const skipped = entry.skipped ?? 0;

  // If old entry has no details, show a simpler view
  const hasDetails = details.length > 0;

  const filteredDetails = details.filter(d => {
    if (filter === 'correct') return d.isCorrect;
    if (filter === 'wrong') return d.userAnswer !== null && !d.isCorrect;
    if (filter === 'skipped') return d.userAnswer === null;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white border-[1.5px] border-black rounded-[12px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b-[1.5px] border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffebee] border-[1.5px] border-black rounded-[8px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#e53935]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">Test Report</h2>
              <p className="text-xs text-gray-400 font-medium">{entry.date}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-[1.5px] border-black rounded-[6px] hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score Summary */}
        <div className="p-6 border-b-[1.5px] border-gray-100 shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-[8px] text-center">
              <div className="text-2xl font-black text-black">{entry.score}<span className="text-sm text-gray-400 font-medium">/{entry.total}</span></div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Score</div>
            </div>
            <div className="p-3 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-[8px] text-center">
              <div className={cn("text-2xl font-black", percent >= 70 ? "text-green-600" : percent >= 50 ? "text-yellow-600" : "text-[#e53935]")}>{entry.accuracy}%</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><Target className="w-3 h-3" /> Accuracy</div>
            </div>
            <div className="p-3 bg-[#f0fdf4] border-[1.5px] border-green-200 rounded-[8px] text-center">
              <div className="text-2xl font-black text-green-600">{entry.score}</div>
              <div className="text-xs font-bold text-green-600 uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> Correct</div>
            </div>
            <div className="p-3 bg-[#fff1f2] border-[1.5px] border-red-200 rounded-[8px] text-center">
              <div className="text-2xl font-black text-[#e53935]">{wrong}</div>
              <div className="text-xs font-bold text-[#e53935] uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><XCircle className="w-3 h-3" /> Wrong</div>
            </div>
            <div className="p-3 bg-[#f8f9fa] border-[1.5px] border-gray-200 rounded-[8px] text-center">
              <div className="text-2xl font-black text-gray-500">{skipped}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1 flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Skipped</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden border-[1px] border-gray-200 flex">
            <div className="bg-green-500 h-full transition-all" style={{ width: `${(entry.score / entry.total) * 100}%` }} />
            <div className="bg-[#e53935] h-full transition-all" style={{ width: `${(wrong / entry.total) * 100}%` }} />
            <div className="bg-gray-300 h-full transition-all" style={{ width: `${(skipped / entry.total) * 100}%` }} />
          </div>
          <div className="flex gap-4 mt-2 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Correct</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#e53935]" /> Wrong</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> Skipped</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-6 pt-4 shrink-0">
          {(['all', 'correct', 'wrong', 'skipped'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-[6px] border-[1.5px] transition-all",
                filter === f 
                  ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-black"
              )}
            >
              {f} {f === 'all' ? `(${entry.total})` : f === 'correct' ? `(${entry.score})` : f === 'wrong' ? `(${wrong})` : `(${skipped})`}
            </button>
          ))}
        </div>

        {hasDetails ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-2" style={{ scrollbarWidth: 'thin' }}>
          {filteredDetails.map((d) => {
            const isExpanded = expandedQ === d.qId;
            return (
              <div 
                key={d.qId} 
                className={cn(
                  "border-[1.5px] rounded-[8px] transition-all overflow-hidden",
                  d.isCorrect ? "border-green-200" : d.userAnswer === null ? "border-gray-200" : "border-red-200"
                )}
              >
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : d.qId)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className={cn(
                    "w-7 h-7 flex items-center justify-center text-xs font-bold border-[1.5px] rounded shrink-0",
                    d.isCorrect ? "bg-green-100 border-green-400 text-green-700" :
                    d.userAnswer === null ? "bg-gray-100 border-gray-300 text-gray-500" :
                    "bg-red-50 border-red-300 text-[#e53935]"
                  )}>
                    {d.qId}
                  </div>
                  <span className="text-sm font-medium text-black flex-1 line-clamp-1">{d.question}</span>
                  {d.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : d.userAnswer === null ? (
                    <MinusCircle className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#e53935] shrink-0" />
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-[#f8f9fa]">
                    <p className="text-sm font-semibold text-black mb-3">{d.question}</p>
                    <div className="space-y-2 text-sm">
                      {d.userAnswer !== null && (
                        <div className={cn(
                          "flex items-center gap-2 p-2 rounded-[6px] border-[1px]",
                          d.isCorrect ? "bg-[#f0fdf4] border-green-300" : "bg-[#fff1f2] border-red-200"
                        )}>
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-500 w-20 shrink-0">Your answer:</span>
                          <span className={cn("font-medium", d.isCorrect ? "text-green-700" : "text-[#b91c1c]")}>{d.userAnswer}</span>
                          {d.isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" /> : <XCircle className="w-4 h-4 text-[#e53935] ml-auto shrink-0" />}
                        </div>
                      )}
                      {!d.isCorrect && (
                        <div className="flex items-center gap-2 p-2 rounded-[6px] bg-[#f0fdf4] border-[1px] border-green-300">
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-500 w-20 shrink-0">Correct:</span>
                          <span className="font-medium text-green-700">{d.correctAnswer}</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                        </div>
                      )}
                      {d.userAnswer === null && (
                        <div className="flex items-center gap-2 p-2 rounded-[6px] bg-gray-50 border-[1px] border-gray-200">
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-500 w-20 shrink-0">Status:</span>
                          <span className="font-medium text-gray-500">Skipped</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-gray-400">
              <p className="font-semibold text-sm">Detailed question data is not available for this test.</p>
              <p className="text-xs mt-1">Take a new test to see the full per-question report.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
