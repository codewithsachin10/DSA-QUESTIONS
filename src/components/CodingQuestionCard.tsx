import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Code2, 
  Copy, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  AlertTriangle,
  Info,
  Check,
  XCircle,
  Clock
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { cn } from './QuestionCard';
import { codingTemplates } from '../data/coding_templates';

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


const getExplanationForLine = (line: string): string | null => {
  const t = line.trim();
  if (!t) return null;
  if (t.startsWith('#include')) return 'Imports the standard library for input/output operations.';
  if (t.startsWith('int main') || t.startsWith('int main(')) return 'The main function where program execution starts.';
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

// Safe Base64 encoding/decoding helper utilities for Unicode support
const encodeBase64 = (str: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return btoa(str);
  }
};

const decodeBase64 = (str: string | null | undefined): string => {
  if (!str) return '';
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    try {
      return atob(str);
    } catch (err) {
      return str;
    }
  }
};

export const CodingQuestionCard = ({ question }: CodingQuestionCardProps) => {
  const templates = codingTemplates[question.id] || {
    c: question.code,
    cpp: `// C++ Template not found`,
    python: `# Python Template not found`,
    sampleInput: '',
    sampleOutput: ''
  };

  const [copied, setCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'c' | 'cpp' | 'python'>('c');
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Custom draft editor values
  const [drafts, setDrafts] = useState<Record<'c' | 'cpp' | 'python', string>>({
    c: templates.c,
    cpp: templates.cpp,
    python: templates.python
  });

  // Keep track of custom stdin input and panel tabs
  const [customInput, setCustomInput] = useState(templates.sampleInput);
  const [activeTab, setActiveTab] = useState<'terminal' | 'input'>('terminal');

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<{
    stdout: string;
    stderr: string;
    compileOutput?: string;
    exitCode: number;
    duration: number;
  } | null>(null);

  // Validation state (compares stdout to template's sample output)
  const [isValidated, setIsValidated] = useState<boolean | null>(null);

  // Reference visual guides
  const [activeLine, setActiveLine] = useState<number | null>(null);

  // Copy code utility
  const handleCopy = () => {
    navigator.clipboard.writeText(drafts[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset current draft utility
  const handleResetDraft = () => {
    if (window.confirm(`Are you sure you want to reset your ${selectedLanguage.toUpperCase()} code draft back to the default template?`)) {
      setDrafts(prev => ({
        ...prev,
        [selectedLanguage]: templates[selectedLanguage]
      }));
    }
  };

  // Execute Code via Judge0 CE API
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('terminal');
    setRunError(null);
    setExecutionResult(null);
    setIsValidated(null);

    const currentCode = drafts[selectedLanguage];
    
    let languageId = 50; // default C
    if (selectedLanguage === 'cpp') {
      languageId = 54;
    } else if (selectedLanguage === 'python') {
      languageId = 71;
    }

    try {
      const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source_code: encodeBase64(currentCode),
          language_id: languageId,
          stdin: encodeBase64(customInput)
        })
      });

      if (!response.ok) {
        throw new Error(`Execution request failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      
      // Decode Base64 outputs safely
      const stdout = decodeBase64(data.stdout);
      const stderr = decodeBase64(data.stderr || data.message);
      const compileOutput = decodeBase64(data.compile_output);
      
      const isCompiled = data.status && data.status.id !== 6;

      if (!isCompiled) {
        // Compilation failure
        setExecutionResult({
          stdout: '',
          stderr: compileOutput || stderr || 'Compilation error.',
          compileOutput: compileOutput,
          exitCode: 1,
          duration: 0
        });
        setIsValidated(false);
      } else {
        // Successful run
        const exitCode = data.exit_code !== undefined && data.exit_code !== null 
          ? data.exit_code 
          : (data.status.id === 3 ? 0 : 1);
        const duration = data.time ? Math.round(parseFloat(data.time) * 1000) : 0;
        
        setExecutionResult({
          stdout,
          stderr,
          compileOutput: compileOutput || undefined,
          exitCode,
          duration
        });

        // Validate stdout against sample output only if running on the official sample input
        if (customInput.trim() === templates.sampleInput.trim()) {
          const cleanStdout = stdout.trim().replace(/\r\n/g, '\n');
          const cleanExpected = templates.sampleOutput.trim().replace(/\r\n/g, '\n');
          setIsValidated(cleanStdout === cleanExpected && exitCode === 0);
        } else {
          setIsValidated(null); // Run was on custom input
        }
      }
    } catch (err: any) {
      console.error(err);
      setRunError(err.message || 'Unable to connect to the compilation server. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  // Generate Reference C Line explanations
  const cLines = templates.c.split('\n');
  const lineExplanations = cLines.map((line, index) => {
    const exp = getExplanationForLine(line);
    return { lineNum: index + 1, code: line, explanation: exp };
  }).filter(item => item.explanation !== null);

  // Escaping fullscreen modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const editorOptions = {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
    minimap: { enabled: false },
    scrollbar: { vertical: 'visible' as const, horizontal: 'visible' as const },
    lineNumbers: 'on' as const,
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly: false,
    automaticLayout: true,
    tabSize: 4,
    padding: { top: 12, bottom: 12 }
  };

  return (
    <div className={cn(
      "transition-all duration-300",
      isFullscreen 
        ? "fixed inset-0 z-50 bg-[#f8f9fa] p-6 flex flex-col overflow-hidden h-screen w-screen" 
        : "w-full h-full flex flex-col xl:flex-row gap-8"
    )}>
      
      {/* Code Editor and Playground */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <div className="border-4 border-black rounded-[8px] overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col min-h-[450px]">
          
          {/* Editor Header / Neubrutalist Toolbar */}
          <div className="bg-[#e53935] border-b-4 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Dots + Window Title */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-300 border-2 border-black" />
                <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
              </div>
              <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> 
                <span>solution.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'cpp' ? 'cpp' : 'c'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-white text-black text-xs font-black uppercase tracking-wider px-3 py-1.5 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <option value="c">C Language</option>
                <option value="cpp">C++ (STL)</option>
                <option value="python">Python 3</option>
              </select>

              {/* Theme Selector */}
              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value as any)}
                className="bg-white text-black text-xs font-black uppercase tracking-wider px-3 py-1.5 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <option value="vs-dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>

              {/* Reset Draft */}
              <button 
                onClick={handleResetDraft} 
                title="Reset code to original template"
                className="p-1.5 bg-white border-2 border-black rounded-[4px] hover:bg-red-50 text-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Copy Code */}
              <button 
                onClick={handleCopy} 
                title="Copy code to clipboard"
                className="p-1.5 bg-white border-2 border-black rounded-[4px] hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-black" />}
              </button>

              {/* Fullscreen Toggle */}
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)} 
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Code Sandbox"}
                className="p-1.5 bg-white border-2 border-black rounded-[4px] hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-black" /> : <Maximize2 className="w-4 h-4 text-black" />}
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 w-full bg-[#1e1e1e] relative">
            <Editor
              height={isFullscreen ? "calc(100vh - 380px)" : "420px"}
              language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'c' ? 'c' : 'python'}
              theme={editorTheme}
              value={drafts[selectedLanguage]}
              onChange={(val) => {
                setDrafts(prev => ({
                  ...prev,
                  [selectedLanguage]: val || ''
                }));
              }}
              options={editorOptions}
            />
          </div>
        </div>

        {/* Action Run Button & Interactive Sandbox Area */}
        <div className="mt-4 flex flex-col md:flex-row gap-4 shrink-0">
          
          {/* Main Action Button */}
          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className={cn(
              "md:w-60 w-full bg-[#e53935] text-white text-xl font-black py-4 px-6 border-4 border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest shrink-0",
              isRunning 
                ? "opacity-80 cursor-not-allowed" 
                : "hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
            )}
          >
            {isRunning ? (
              <>
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>Run Code</span>
                <Play className="w-6 h-6 fill-current" />
              </>
            )}
          </button>

          {/* Custom Input / Output Subpanel tabs */}
          <div className="flex-1 bg-white border-4 border-black rounded-[8px] overflow-hidden flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Subpanel Header */}
            <div className="bg-gray-100 border-b-2 border-black flex items-center justify-between px-3 shrink-0">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('terminal')}
                  className={cn(
                    "px-4 py-2 font-black text-xs uppercase tracking-wider border-r-2 border-black transition-colors focus:outline-none",
                    activeTab === 'terminal' 
                      ? "bg-black text-white" 
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Terminal className="w-3.5 h-3.5 inline mr-1.5" />
                  Terminal Output
                </button>
                <button
                  onClick={() => setActiveTab('input')}
                  className={cn(
                    "px-4 py-2 font-black text-xs uppercase tracking-wider border-r-2 border-black transition-colors focus:outline-none",
                    activeTab === 'input' 
                      ? "bg-black text-white" 
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
                  Custom Input (stdin)
                </button>
              </div>

              {/* Sample helper in Input Tab */}
              {activeTab === 'input' && (
                <button
                  onClick={() => setCustomInput(templates.sampleInput)}
                  className="bg-white text-black hover:bg-gray-200 border-2 border-black text-[10px] font-black uppercase px-2 py-0.5 rounded-[4px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  Use Sample Input
                </button>
              )}

              {/* Run validation badge */}
              {activeTab === 'terminal' && isValidated !== null && (
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 border-2 rounded-[4px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
                  isValidated 
                    ? "bg-green-100 text-green-800 border-green-500" 
                    : "bg-red-100 text-red-800 border-red-500"
                )}>
                  {isValidated ? (
                    <>
                      <Check className="w-3 h-3 text-green-700" /> Matches Sample Output
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-red-700" /> Mismatches Sample Output
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Subpanel Body */}
            <div className="flex-1 bg-black text-white font-mono text-sm overflow-auto h-36">
              {activeTab === 'input' ? (
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Type graph input nodes and edge counts here..."
                  className="w-full h-full p-3 bg-black text-[#a6e22e] font-mono border-none outline-none resize-none focus:ring-0"
                  style={{ tabSize: 4 }}
                />
              ) : (
                <div className="p-3 space-y-2 h-full overflow-y-auto leading-relaxed">
                  {/* Error boundary */}
                  {runError && (
                    <div className="text-red-400 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{runError}</span>
                    </div>
                  )}

                  {/* Standard compilation loading */}
                  {isRunning && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">root@compiler:~$</span>
                      <span>Compiling and running code...</span>
                      <span className="w-2 h-4 bg-white animate-pulse" />
                    </div>
                  )}

                  {/* Output details */}
                  {!isRunning && !runError && !executionResult && (
                    <div className="text-gray-500 flex flex-col justify-center items-center h-full gap-2 py-4">
                      <Terminal className="w-8 h-8 opacity-40 animate-pulse text-white" />
                      <p className="text-xs text-center font-medium">Click "Run Code" to compile and execute program against stdin.</p>
                    </div>
                  )}

                  {!isRunning && !runError && executionResult && (
                    <div className="space-y-2">
                      {/* Compilation logs if any */}
                      {executionResult.compileOutput && (
                        <div className="border-b border-gray-800 pb-2 mb-2">
                          <div className="text-yellow-400 font-bold uppercase text-xs tracking-wider mb-1">Compiler Details:</div>
                          <pre className="text-gray-300 text-xs whitespace-pre-wrap">{executionResult.compileOutput}</pre>
                        </div>
                      )}

                      {/* Exit code indicator */}
                      <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-900 pb-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Time: {executionResult.duration}ms</span>
                        </div>
                        <div>
                          <span>Exit Code: </span>
                          <span className={executionResult.exitCode === 0 ? "text-green-400" : "text-red-400"}>
                            {executionResult.exitCode}
                          </span>
                        </div>
                      </div>

                      {/* Execution Stdout */}
                      {executionResult.stdout && (
                        <div>
                          <pre className="text-green-400 whitespace-pre">{executionResult.stdout}</pre>
                        </div>
                      )}

                      {/* Execution Stderr */}
                      {executionResult.stderr && (
                        <div className="mt-2 bg-red-950/40 p-2 border border-red-900/50 rounded">
                          <div className="text-red-400 font-bold uppercase text-xs mb-1">Runtime Stderr:</div>
                          <pre className="text-red-300 whitespace-pre-wrap text-xs">{executionResult.stderr}</pre>
                        </div>
                      )}

                      {/* No output message */}
                      {!executionResult.stdout && !executionResult.stderr && (
                        <div className="text-gray-500 italic">Program finished running with no standard output.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Breakdown / References */}
      <div className="w-full xl:w-[420px] shrink-0 bg-white border-4 border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
        
        {/* Breakdown Header */}
        <div className="bg-black text-white p-4 flex items-center gap-3 border-b-4 border-black shrink-0">
          <BookOpen className="w-6 h-6 text-[#e53935]" />
          <div>
            <h3 className="font-black text-md uppercase tracking-wider">C Solution Breakdown</h3>
            <p className="text-[10px] text-gray-400 font-semibold tracking-normal uppercase">Logic walkthrough & helper explanations</p>
          </div>
        </div>

        {/* Scrollable Explanations */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-[#fff9fa]" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Context tip */}
          <div className="bg-blue-50 border-2 border-blue-200 text-blue-900 p-3 rounded-[6px] text-xs font-semibold leading-relaxed flex gap-2">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              Hover or focus on reference items below to view line details. Write your code in C, C++, or Python in the sandbox and click <span className="font-black text-[#e53935]">Run Code</span> to test!
            </div>
          </div>

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
                <div className="flex items-start gap-2 mb-1.5">
                  <span className={cn(
                    "text-[10px] font-black px-1.5 py-0.5 border-2 rounded",
                    activeLine === item.lineNum ? "bg-black text-white border-black" : "bg-gray-100 border-gray-300 text-gray-600"
                  )}>
                    L{item.lineNum}
                  </span>
                  <code className="text-[11px] font-mono font-bold line-clamp-1 flex-1 opacity-90">{item.code.trim()}</code>
                </div>
                <p className="text-sm font-bold leading-snug">
                  {item.explanation}
                </p>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 font-medium text-center p-4">
              Select standard C compiler view to check detailed step descriptions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
