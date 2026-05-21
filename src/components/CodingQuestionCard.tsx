import { useState } from 'react';
import { Terminal, Code2, Copy, Play, CheckCircle2, BookOpen } from 'lucide-react';
import { cn } from './QuestionCard';

export interface CodingQuestion {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  language: string;
  code: string;
}

interface CodingQuestionCardProps {
  question: CodingQuestion;
}

const highlightC = (code: string) => {
  // First escape HTML
  let res = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Replace numbers FIRST using a unique token to avoid double-replacement
  res = res.replace(/\b([0-9]+)\b/g, '___NUM___$1___ENDNUM___');
  
  // Replace keywords (use single quotes for HTML attributes to avoid matching by the string regex later!)
  res = res.replace(/(#include)/g, "<span style='color:#e53935;font-weight:bold'>$1</span>");
  res = res.replace(/(int|void|char|float|double|bool)\b/g, "<span style='color:#2563eb;font-weight:bold'>$1</span>");
  res = res.replace(/(for|while|if|else|return)\b/g, "<span style='color:#9333ea;font-weight:bold'>$1</span>");
  res = res.replace(/("(?:\\"|[^"])*")/g, "<span style='color:#16a34a'>$1</span>");
  res = res.replace(/(\/\/.*)/g, "<span style='color:#9ca3af;font-style:italic'>$1</span>");
  
  // Restore numbers with span
  res = res.replace(/___NUM___([0-9]+)___ENDNUM___/g, "<span style='color:#f97316'>$1</span>");
  
  return res;
};

const getExplanationForLine = (line: string): string | null => {
  const t = line.trim();
  if (!t) return null;
  if (t.startsWith('#include')) return 'Imports the standard library for input/output operations.';
  if (t.startsWith('int main')) return 'The main function where program execution starts.';
  if (t.includes('scanf') && t.includes('&n')) return 'Reads the inputs (e.g., number of nodes and edges) from the user.';
  if (t.match(/int adj\[.*\]\[.*\];/) || t.match(/int graph\[.*\]\[.*\];/)) return 'Declares an adjacency matrix to store the graph connections.';
  if (t.match(/int adj\[.*\];/)) return 'Declares an adjacency list to store the graph.';
  if (t.includes('for') && t.includes('i = 0') && (t.includes('n') || t.includes('m'))) return 'Loops through the vertices or edges to initialize or process them.';
  if (t.includes('adj[') && t.includes('] = 1')) return 'Sets the matrix cell to 1, indicating an edge exists between the two nodes.';
  if (t.includes('adj[') && t.includes('++] =')) return 'Adds a neighbor to the adjacency list and increments the size counter.';
  if (t.includes('printf')) return 'Prints the output to the console.';
  if (t.startsWith('void dfs') || t.startsWith('int dfs')) return 'Depth-First Search (DFS) function: explores as far as possible along each branch before backtracking.';
  if (t.startsWith('void bfs')) return 'Breadth-First Search (BFS) function: explores the neighbor nodes first, before moving to the next level neighbors.';
  if (t.includes('visited[') && t.includes('= 1')) return "Marks the current node as visited so we don't process it again and get stuck in a loop.";
  if (t.includes('queue[')) return 'Queue operation: used in BFS to keep track of nodes to visit next.';
  if (t.includes('return 0;')) return 'Successfully terminates the program.';
  if (t.startsWith('//')) return 'Code comment: ' + t.replace('//', '').trim();
  return null;
};

export const CodingQuestionCard = ({ question }: CodingQuestionCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(question.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setShowOutput(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1500);
  };

  const lines = question.code.split('\\n');

  // Generate line explanations
  const lineExplanations = lines.map((line, index) => {
    const exp = getExplanationForLine(line);
    return { lineNum: index + 1, code: line, explanation: exp };
  }).filter(item => item.explanation !== null);

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-8">
      
      {/* Code Editor Column */}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <div className="border-4 border-black rounded-[8px] overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col">
          {/* Mac-like Header */}
          <div className="bg-[#e53935] border-b-4 border-black px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-300 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
            </div>
            <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4" /> solution.c
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="p-1.5 bg-white border-2 border-black rounded-[4px] hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-black" />}
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 bg-[#f8f9fa] overflow-auto text-[15px] font-mono leading-relaxed flex-1" style={{ scrollbarWidth: 'thin' }}>
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr 
                    key={i} 
                    className={cn(
                      "transition-colors group",
                      activeLine === i + 1 ? "bg-yellow-100" : "hover:bg-gray-100"
                    )}
                    onMouseEnter={() => setActiveLine(i + 1)}
                    onMouseLeave={() => setActiveLine(null)}
                  >
                    <td className={cn(
                      "pr-4 text-right select-none w-12 font-bold border-r-2 border-gray-200 transition-colors align-top",
                      activeLine === i + 1 ? "text-[#e53935]" : "text-gray-400"
                    )}>
                      {i + 1}
                    </td>
                    <td className="pl-4 whitespace-pre font-medium text-black">
                      <span dangerouslySetInnerHTML={{ __html: highlightC(line) }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleRun}
          className="mt-6 w-full shrink-0 bg-[#e53935] text-white text-xl font-black py-4 border-4 border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          {isRunning ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Run Code <Play className="w-6 h-6 fill-current" />
            </>
          )}
        </button>

        {/* Terminal Output */}
        {showOutput && (
          <div className="mt-6 shrink-0 border-4 border-black rounded-[8px] overflow-hidden bg-black shadow-[4px_4px_0px_0px_rgba(229,57,53,1)] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-gray-900 border-b-2 border-gray-800 px-4 py-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-mono text-xs font-bold uppercase tracking-wider">Terminal Output</span>
            </div>
            <div className="p-4 font-mono text-sm text-white h-32 overflow-y-auto">
              {isRunning ? (
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">root@server:~$</span> ./solution
                  <span className="w-2 h-4 bg-white animate-pulse" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-gray-400">$ gcc solution.c -o solution</div>
                  <div className="text-gray-400">$ ./solution</div>
                  <div className="text-green-400">Execution Successful!</div>
                  <div className="pt-2 border-t border-gray-800">
                    <span className="text-gray-500">Output depends on input graph constraints. Adjacency lists successfully created.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Explanations Column */}
      <div className="w-full xl:w-96 shrink-0 bg-white border-4 border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
        <div className="bg-black text-white p-5 flex items-center gap-3 border-b-4 border-black shrink-0">
          <BookOpen className="w-6 h-6 text-[#e53935]" />
          <h3 className="font-black text-lg uppercase tracking-wider">Line by Line</h3>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-[#fff9fa]" style={{ scrollbarWidth: 'thin' }}>
          {lineExplanations.length > 0 ? (
            lineExplanations.map((item, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveLine(item.lineNum)}
                onMouseLeave={() => setActiveLine(null)}
                className={cn(
                  "p-3 border-2 border-black rounded-[6px] transition-all cursor-crosshair",
                  activeLine === item.lineNum 
                    ? "bg-[#e53935] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1" 
                    : "bg-white text-black hover:border-[#e53935] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                )}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className={cn(
                    "text-[10px] font-black px-1.5 py-0.5 border-2 rounded",
                    activeLine === item.lineNum ? "bg-black text-white border-black" : "bg-gray-100 border-gray-300 text-gray-600"
                  )}>
                    L{item.lineNum}
                  </span>
                  <code className="text-xs font-mono font-bold line-clamp-1 flex-1 opacity-80">{item.code.trim()}</code>
                </div>
                <p className="text-sm font-medium leading-tight">
                  {item.explanation}
                </p>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 font-medium text-center p-4">
              Hover over the code to see explanations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
