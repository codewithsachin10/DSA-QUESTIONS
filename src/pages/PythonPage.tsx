
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Terminal, Book, AlertTriangle, 
  Table, BarChart, Play
} from 'lucide-react';

const MODULES = [
  {
    id: 1,
    title: 'Dictionary',
    icon: <Book className="w-6 h-6 text-yellow-600" />,
    color: 'bg-yellow-100',
    description: 'Master key-value pairs, nested dictionaries, and comprehensions.',
    sections: ['Introduction to Dictionaries', 'Key-Value Pairs', 'Creating & Accessing', 'Updating & Adding', 'Removing Elements', 'Dictionary Methods', 'Nested Dictionaries', 'Comprehension']
  },
  {
    id: 2,
    title: 'Exception Handling',
    icon: <AlertTriangle className="w-6 h-6 text-[#e53935]" />,
    color: 'bg-[#ffebee]',
    description: 'Learn to catch bugs gracefully using try, except, else, and finally.',
    sections: ['Syntax vs Runtime Errors', 'try-except Blocks', 'Multiple Exceptions', 'else & finally Blocks', 'raise Keyword', 'User-defined Exceptions', 'Best Practices']
  },
  {
    id: 3,
    title: 'NumPy',
    icon: <BarChart className="w-6 h-6 text-blue-600" />,
    color: 'bg-blue-100',
    description: 'Perform advanced mathematical arrays, slicing, and linear algebra.',
    sections: ['Arrays vs Lists', 'Creating Arrays', 'Array Operations', 'Slicing & Indexing', 'Reshaping', 'Math & Stat Functions', 'Matrix Operations', 'Random Module']
  },
  {
    id: 4,
    title: 'Pandas',
    icon: <Table className="w-6 h-6 text-green-600" />,
    color: 'bg-green-100',
    description: 'Analyze real-world CSVs using Series, DataFrames, and GroupBys.',
    sections: ['Series & DataFrames', 'Reading CSVs', 'Data Inspection', 'Filtering & Sorting', 'Handling Missing Values', 'GroupBy', 'Data Cleaning']
  }
];

export default function PythonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black font-sans flex flex-col antialiased">
      
      {/* Header */}
      <header className="bg-white border-b-4 border-black py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30 shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e53935] rounded-[8px] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight leading-none text-black">
            CodeNest <span className="text-[#e53935]">2.0</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-black text-sm uppercase tracking-widest bg-white text-black px-4 py-2 rounded-[8px] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
      </header>

      {/* Modules List */}
      <section className="px-6 md:px-12 max-w-[1500px] mx-auto w-full mt-12 mb-12">
        <div className="flex items-center gap-3 mb-8">
          <Book className="w-8 h-8 text-[#e53935]" />
          <h3 className="text-4xl font-black uppercase tracking-tight text-black">Curriculum Modules</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          {MODULES.map((mod) => (
            <div 
              key={mod.id} 
              className="bg-white border-4 border-black rounded-[16px] p-6 md:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(229,57,53,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(229,57,53,1)] transition-all group"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-black text-[#e53935] uppercase tracking-widest mb-2">Module 0{mod.id}</h4>
                    <h2 className="text-3xl font-black tracking-tight text-black group-hover:text-[#e53935] transition-colors">{mod.title}</h2>
                  </div>
                  <div className={`w-14 h-14 rounded-[12px] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white shrink-0`}>
                    {mod.icon}
                  </div>
                </div>
                
                <p className="font-bold text-gray-600 text-lg mb-6 leading-relaxed">
                  {mod.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {mod.sections.slice(0, 4).map((section, idx) => (
                    <span key={idx} className="bg-gray-100 text-black font-bold text-xs px-3 py-1.5 rounded-[6px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {section}
                    </span>
                  ))}
                  {mod.sections.length > 4 && (
                    <span className="bg-[#ffebee] text-[#e53935] font-black text-xs px-3 py-1.5 rounded-[6px] border-2 border-[#e53935] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]">
                      +{mod.sections.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => navigate('/python/module/' + mod.id)}
                className="w-full flex items-center justify-center gap-2 bg-[#e53935] text-white font-black uppercase tracking-widest text-sm px-6 py-4 rounded-[8px] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#d32f2f] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
              >
                <Play className="w-5 h-5 fill-current" /> Start Interactive Theory
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
