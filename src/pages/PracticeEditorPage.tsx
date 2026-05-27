import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Code2, 
  Copy, 
  Play, 
  CheckCircle2, 
  RotateCcw,
  ArrowLeft,
  Sun,
  Moon,
  Zap,
  Sparkles,
  StopCircle
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

// Simplified core boilerplates for practice
const starterTemplates = {
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  python: `name = input("enter the name: ")\nprint("Hello", name)`
};

const PracticeEditorPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'c' | 'cpp' | 'python'>('python');
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize draft values with localStorage persistence
  const [drafts, setDrafts] = useState<Record<'c' | 'cpp' | 'python', string>>(() => {
    const savedC = localStorage.getItem('practice_draft_c');
    const savedCpp = localStorage.getItem('practice_draft_cpp');
    const savedPython = localStorage.getItem('practice_draft_python');
    return {
      c: savedC || starterTemplates.c,
      cpp: savedCpp || starterTemplates.cpp,
      python: savedPython || starterTemplates.python
    };
  });

  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  // Auto-save drafts to localStorage
  useEffect(() => {
    localStorage.setItem('practice_draft_c', drafts.c);
    localStorage.setItem('practice_draft_cpp', drafts.cpp);
    localStorage.setItem('practice_draft_python', drafts.python);
  }, [drafts]);

  // Init Terminal and Socket
  useEffect(() => {
    socketRef.current = io('http://localhost:4000');

    xtermRef.current = new XTerm({
      theme: { 
        background: '#ffffff',
        foreground: '#000000',
        cursor: '#e53935',
        selectionBackground: '#ffebee'
      },
      fontFamily: "'Fira Code', monospace",
      fontSize: 14,
      cursorBlink: true,
      convertEol: true,
    });

    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);

    if (terminalRef.current) {
      xtermRef.current.open(terminalRef.current);
      fitAddonRef.current.fit();
      xtermRef.current.writeln('\x1b[33mSystem Ready. Write your code and click "Run Program" to execute.\x1b[0m\n');
    }

    xtermRef.current.onData((data) => {
      // Send keystrokes directly to the server PTY
      socketRef.current?.emit('input', data);
    });

    socketRef.current.on('output', (data) => {
      xtermRef.current?.write(data);
    });

    socketRef.current.on('exit', ({ exitCode }) => {
      setIsRunning(false);
      xtermRef.current?.writeln(`\n\x1b[33m[Process completed with exit code ${exitCode}]\x1b[0m\n`);
    });

    return () => {
      socketRef.current?.disconnect();
      xtermRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    // Handle resize
    const handleResize = () => fitAddonRef.current?.fit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset current language draft to original boilerplate
  const handleResetDraft = () => {
    if (window.confirm(`Are you sure you want to reset your ${selectedLanguage.toUpperCase()} code back to the default boilerplate?`)) {
      setDrafts(prev => ({
        ...prev,
        [selectedLanguage]: starterTemplates[selectedLanguage]
      }));
    }
  };

  // Copy code utility
  const handleCopy = () => {
    navigator.clipboard.writeText(drafts[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run code via WebSocket PTY
  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Clear the terminal screen and focus it so user can start typing
    xtermRef.current?.clear();
    xtermRef.current?.focus();
    
    socketRef.current?.emit('run_code', {
      code: drafts[selectedLanguage],
      language: selectedLanguage
    });
  };

  const handleStopCode = () => {
    if (!isRunning) return;
    // Just reconnect to kill the process instantly
    socketRef.current?.disconnect();
    socketRef.current?.connect();
    setIsRunning(false);
    xtermRef.current?.writeln(`\n\x1b[31m[Process forcibly terminated by user]\x1b[0m\n`);
  };

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
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col overflow-hidden h-screen w-screen">
      
      {/* Premium Neubrutalist IDE Header */}
      <header className="bg-white border-b-4 border-black py-3 px-6 flex justify-between items-center sticky top-0 z-20 shadow-[0_4px_0px_0px_rgba(0,0,0,0.05)] shrink-0">
        <div className="flex items-center gap-6">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-black text-black border-2 border-black bg-white hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1.5 rounded-[6px] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </a>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-[6px] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-black flex items-center gap-1">
                CodeNest <span className="text-[#e53935]">2.0</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-current animate-pulse" />
              </span>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Independent Coding Sandbox</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] border-2 border-green-500 text-green-700 text-[10px] font-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <Zap className="w-3.5 h-3.5 text-green-600 fill-current" />
            LIVE COMPILER ACTIVE
          </div>
          <div className="w-8 h-8 bg-[#ffebee] border-2 border-black rounded-full flex items-center justify-center text-xs font-black text-[#e53935]">
            SG
          </div>
        </div>
      </header>

      {/* Main Workspace: Split Editor & Output Side-by-Side */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative bg-[#f1f3f5]">
        
        {/* Left Column: Monaco Code Editor Canvas */}
        <section className="flex-1 flex flex-col min-w-0 border-r-4 border-black bg-white">
          {/* Toolbar */}
          <div className="bg-black border-b-4 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />
                <div className="w-3 h-3 rounded-full bg-green-500 border border-black" />
              </div>
              <div className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#e53935]" /> 
                <span>practice_sandbox.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'cpp' ? 'cpp' : 'c'}</span>
              </div>
            </div>

            {/* Editor Utilities */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value as any);
                }}
                className="bg-[#e53935] text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 border-2 border-black rounded-[4px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#d32f2f] transition-colors focus:outline-none"
              >
                <option value="python">Python 3</option>
                <option value="c">C Language</option>
                <option value="cpp">C++ (STL)</option>
              </select>

              {/* Theme Toggle */}
              <button
                onClick={() => setEditorTheme(prev => prev === 'vs-dark' ? 'light' : 'vs-dark')}
                title="Toggle Dark/Light Theme"
                className="p-1.5 bg-white border-2 border-black rounded-[4px] hover:bg-gray-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
              >
                {editorTheme === 'vs-dark' ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-indigo-700" />}
              </button>

              {/* Reset to Hello World */}
              <button 
                onClick={handleResetDraft} 
                title="Reset code to standard boilerplate"
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
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 w-full bg-[#1e1e1e] relative min-h-[300px]">
            <Editor
              height="100%"
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
        </section>

        {/* Right Column: Execution Control Center */}
        <section className="w-full lg:w-[480px] shrink-0 flex flex-col bg-white overflow-hidden h-full border-l-4 border-black">
          
          {/* Main Action Section: Run Button */}
          <div className="p-4 bg-[#f8f9fa] border-b-4 border-black shrink-0 flex flex-col gap-3">
            {!isRunning ? (
              <button 
                onClick={handleRunCode}
                className="w-full bg-[#e53935] text-white text-xl font-black py-4 px-6 border-4 border-black rounded-[8px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <span>Run Program</span>
                <Play className="w-6 h-6 fill-current" />
              </button>
            ) : (
              <button 
                onClick={handleStopCode}
                className="w-full bg-red-100 text-red-700 text-xl font-black py-4 px-6 border-4 border-red-700 rounded-[8px] shadow-[4px_4px_0px_0px_rgba(185,28,28,1)] hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(185,28,28,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <span>Stop Program</span>
                <StopCircle className="w-6 h-6 fill-current" />
              </button>
            )}
          </div>

          {/* Terminal Console Header */}
          <div className="bg-white text-black px-4 py-3 border-b-4 border-black flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#e53935]" />
              <span className="font-bold text-xs uppercase tracking-wider text-black">Interactive Terminal</span>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-green-500 uppercase tracking-widest font-black">Running</span>
              </div>
            )}
          </div>

          {/* Interactive xterm.js Terminal container */}
          <div className="flex-1 w-full bg-white overflow-hidden p-2 relative">
             <div ref={terminalRef} className="w-full h-full" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PracticeEditorPage;
