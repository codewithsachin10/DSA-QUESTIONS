import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Terminal } from 'lucide-react';
import { getSnippets } from '../data/pythonSnippets';
import DictionaryVisualizer from '../components/modules/DictionaryVisualizer';
import ExceptionVisualizer from '../components/modules/ExceptionVisualizer';
import NumpyVisualizer from '../components/modules/NumpyVisualizer';
import PandasVisualizer from '../components/modules/PandasVisualizer';

const modulesData = {
  "1": { title: "Dictionary Module", sections: ["Introduction to Dictionaries", "Key-Value Pairs", "Creating Dictionaries", "Accessing Values", "Updating & Removing"] },
  "2": { title: "Exception Handling", sections: ["What is an Exception?", "Try-Except Blocks", "Multiple Excepts", "Finally & Else", "Raising Exceptions"] },
  "3": { title: "NumPy Basics", sections: ["NumPy Arrays vs Lists", "Creating Arrays", "Array Slicing", "Mathematical Operations", "Reshaping"] },
  "4": { title: "Pandas DataFrames", sections: ["Series vs DataFrame", "Reading CSV Files", "Data Inspection", "Filtering Data", "GroupBy Operations"] }
};

export default function PythonModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(1);
  const [code, setCode] = useState('import pandas as pd\n\nprint("Running interactive logic!")');
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState('');

  const moduleInfo = modulesData[id as keyof typeof modulesData];

  if (!moduleInfo) return <div className="p-8 text-red-500 font-bold">Module not found</div>;

  // Track which index the visualizer belongs to for each module
  const visualizerIndexMap: Record<string, number> = {
    "1": 1, // Dictionary: Key-Value Pairs
    "2": 1, // Exception: Try-Except Blocks
    "3": 2, // NumPy: Array Slicing
    "4": 4  // Pandas: GroupBy Operations
  };
  const visualizerIdx = visualizerIndexMap[id as string] ?? 1;
  const isVisualizerActive = activeSection === visualizerIdx;

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput('> Compiling python bytecode...\n');
    setTimeout(() => {
      setIsExecuting(false);
      setOutput(`> Compiling python bytecode...\n> Executing script...\n\n${code.includes('print') ? 'Hello from the simulated environment!\n' : ''}\n> Process finished in 0.12s.`);
    }, 800);
  };

  const renderVisualizer = () => {
    switch (id) {
      case "1": return <DictionaryVisualizer />;
      case "2": return <ExceptionVisualizer />;
      case "3": return <NumpyVisualizer />;
      case "4": return <PandasVisualizer />;
      default: return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8f9fa] overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b-2 border-black p-4 flex items-center justify-between shrink-0 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)] z-20 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/python')}
            className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-black hover:text-[#e53935] hover:-translate-x-1 transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Hub
          </button>
          <div className="w-[2px] h-6 bg-black"></div>
          <h1 className="text-xl font-black uppercase tracking-tight text-[#e53935]">
            {moduleInfo.title}
          </h1>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Syllabus */}
        <aside className="w-[240px] bg-white border-r-2 border-black flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b-2 border-gray-100 bg-[#f8f9fa] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-black" />
            <span className="font-black uppercase tracking-widest text-sm text-black">Syllabus Explorer</span>
          </div>
          <div className="p-4 space-y-2">
            {moduleInfo.sections.map((sec, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSection(idx)}
                className={`w-full text-left p-3 border-2 rounded-[6px] font-bold text-sm transition-all ${activeSection === idx ? 'border-black bg-black text-white shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]' : 'border-transparent text-gray-500 hover:bg-gray-100 hover:border-gray-200'}`}
              >
                {idx + 1}. {sec} {idx === visualizerIdx && " ✨"}
              </button>
            ))}
          </div>
        </aside>

        {/* Center - Visualizer */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#f8f9fa] flex flex-col relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Cg/%3E%3C/svg%3E")' }}></div>
          {isVisualizerActive ? renderVisualizer() : (
            <div className="bg-white p-6 md:p-8 border-2 border-black rounded-[12px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto mt-4 md:mt-8 w-full">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[#e53935] mb-6 pb-4 border-b-2 border-gray-100">
                {moduleInfo.sections[activeSection]}
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Complete Code Examples</p>
                {getSnippets(id as string, activeSection).map((snippet, sIdx) => (
                  <div key={sIdx} className="bg-[#1e1e1e] border-2 border-black rounded-[6px] flex flex-col group hover:border-[#e53935] hover:shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] transition-all overflow-hidden">
                    <div className="p-4 overflow-x-auto">
                      <pre className="font-mono text-[#d4d4d4] font-medium text-sm leading-relaxed whitespace-pre">
                        {snippet.split('\n').map((line, i) => {
                          if (line.startsWith('#')) return <span key={i} className="text-green-500">{line}<br/></span>;
                          if (line.startsWith('print')) return <span key={i}><span className="text-[#4ec9b0]">print</span>{line.substring(5)}<br/></span>;
                          if (line.startsWith('import')) return <span key={i} className="text-[#569cd6]">{line}<br/></span>;
                          return <span key={i}>{line}<br/></span>;
                        })}
                      </pre>
                    </div>
                    <div className="bg-[#252526] border-t-2 border-black p-2 flex justify-end">
                      <button 
                        onClick={() => setCode(snippet)}
                        className="text-xs font-black uppercase tracking-widest bg-black text-white px-4 py-2 rounded-[4px] border-2 border-black hover:bg-[#e53935] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center gap-2"
                      >
                        <Terminal className="w-3 h-3" /> Load to Editor
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#fff9fa] border-2 border-[#fca5a5] p-4 rounded-[8px]">
                <p className="text-sm font-bold text-[#e53935]">
                  👉 Click on section "{visualizerIdx + 1}. {moduleInfo.sections[visualizerIdx]}" in the syllabus to return to the interactive Visualizer Lab!
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Mini Editor */}
        <aside className="w-[340px] bg-[#1e1e1e] border-l-2 border-black flex flex-col shrink-0">
          <div className="p-4 border-b-2 border-black bg-black flex items-center gap-2 shadow-[0_2px_0px_0px_rgba(229,57,53,1)] z-10">
            <Terminal className="w-5 h-5 text-white" />
            <span className="font-black uppercase tracking-widest text-sm text-white">Live Practice</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#1e1e1e] border-2 border-gray-700 rounded-[6px] p-4 mb-4 text-[#d4d4d4] font-medium leading-relaxed focus:outline-none focus:border-[#e53935] transition-colors resize-none"
              spellCheck={false}
            />
            
            <button 
              onClick={handleRunCode}
              disabled={isExecuting}
              className="w-full py-3 bg-[#e53935] text-white font-black uppercase tracking-widest rounded-[6px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d32f2f] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Terminal className="w-4 h-4" /> {isExecuting ? 'Running...' : 'Run Code'}
            </button>
            
            <div className="h-[160px] mt-4 bg-[#0a0a0a] border-2 border-gray-700 rounded-[6px] p-3 text-[#22c55e] overflow-y-auto whitespace-pre-wrap">
              <div className="text-gray-500 mb-1">--- Terminal Output ---</div>
              {output || '> System ready. Type code above and hit Run.'}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
