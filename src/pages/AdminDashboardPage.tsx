import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Search, Trash2, Edit2, 
  Terminal, ShieldCheck, BarChart2, BookOpen, 
  Code, Play, Pause, X, AlertTriangle, Check, LogOut
} from 'lucide-react';
import { useStore, Question } from '../store/useStore';
import { supabase } from '../lib/supabase';

interface CodingChallenge {
  id: number;
  title: string;
  category: string; // "In Class" | "Post Class" | "Challenges"
  difficulty: string; // "Easy" | "Medium" | "Hard"
  language: string; // "C" | "C++" | "Python"
  code: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { questions: mcqQuestions, fetchQuestions, testHistory } = useStore();

  const [codingChallenges, setCodingChallenges] = useState<CodingChallenge[]>([]);
  const [activeCourse, setActiveCourse] = useState<'DSA' | 'PYTHON'>('DSA');

  useEffect(() => {
    fetchQuestions(activeCourse);
    fetchCodingChallenges();
  }, [activeCourse]);

  const fetchCodingChallenges = async () => {
    const { data, error } = await supabase.from('coding_challenges').select('*').eq('course', activeCourse).order('id');
    if (!error && data) {
      setCodingChallenges(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Toast status notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToastNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Nav Tabs: "mcq" | "coding" | "logs"
  const [activeTab, setActiveTab] = useState<'mcq' | 'coding' | 'logs'>('mcq');

  // Search filters
  const [mcqSearch, setMcqSearch] = useState('');
  const [codingSearch, setCodingSearch] = useState('');

  // Modals state
  const [isMcqModalOpen, setIsMcqModalOpen] = useState(false);
  const [editingMcq, setEditingMcq] = useState<Question | null>(null);
  
  const [isCodingModalOpen, setIsCodingModalOpen] = useState(false);
  const [editingCoding, setEditingCoding] = useState<CodingChallenge | null>(null);

  // MCQ Form inputs
  const [mcqFormQuestion, setMcqFormQuestion] = useState('');
  const [mcqFormOptions, setMcqFormOptions] = useState<string[]>(['', '', '', '']);
  const [mcqFormAnswer, setMcqFormAnswer] = useState('');
  const [mcqFormExplanation, setMcqFormExplanation] = useState('');

  // Coding Form inputs
  const [codingFormTitle, setCodingFormTitle] = useState('');
  const [codingFormCategory, setCodingFormCategory] = useState('In Class');
  const [codingFormDifficulty, setCodingFormDifficulty] = useState('Easy');
  const [codingFormLanguage, setCodingFormLanguage] = useState('C');
  const [codingFormCode, setCodingFormCode] = useState('');

  // Log Console Stream States
  const [isLogsPaused, setIsLogsPaused] = useState(false);
  const [systemLogs, setSystemLogs] = useState<Array<{ id: string; time: string; message: string; type: 'info' | 'success' | 'warn' | 'compiler' }>>([]);

  const averageScore = useMemo(() => {
    if (!testHistory || testHistory.length === 0) return '0%';
    const totalAccuracy = testHistory.reduce((acc, test) => acc + test.accuracy, 0);
    return (totalAccuracy / testHistory.length).toFixed(1) + '%';
  }, [testHistory]);

  // Analytics variables
  const analytics = useMemo(() => {
    // Coding challenge difficulty distribution
    let codingEasy = 0, codingMedium = 0, codingHard = 0;
    let inClass = 0, postClass = 0, challenges = 0;

    codingChallenges.forEach(q => {
      if (q.difficulty.toLowerCase() === 'easy') codingEasy++;
      else if (q.difficulty.toLowerCase() === 'medium') codingMedium++;
      else codingHard++;

      if (q.category === 'In Class') inClass++;
      else if (q.category === 'Post Class') postClass++;
      else challenges++;
    });

    return {
      codingEasy, codingMedium, codingHard,
      inClass, postClass, challenges
    };
  }, [codingChallenges]);

  // Filtered lists
  const filteredMcqs = useMemo(() => {
    return mcqQuestions.filter(q => 
      q.question.toLowerCase().includes(mcqSearch.toLowerCase()) ||
      q.answer.toLowerCase().includes(mcqSearch.toLowerCase())
    );
  }, [mcqQuestions, mcqSearch]);

  const filteredCoding = useMemo(() => {
    return codingChallenges.filter(q => 
      q.title.toLowerCase().includes(codingSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(codingSearch.toLowerCase()) ||
      q.difficulty.toLowerCase().includes(codingSearch.toLowerCase())
    );
  }, [codingChallenges, codingSearch]);

  // MCQ Modal handlers
  const openAddMcqModal = () => {
    setEditingMcq(null);
    setMcqFormQuestion('');
    setMcqFormOptions(['', '', '', '']);
    setMcqFormAnswer('');
    setMcqFormExplanation('');
    setIsMcqModalOpen(true);
  };

  const openEditMcqModal = (q: Question) => {
    setEditingMcq(q);
    setMcqFormQuestion(q.question);
    setMcqFormOptions([...q.options]);
    setMcqFormAnswer(q.answer);
    setMcqFormExplanation(q.explanation || '');
    setIsMcqModalOpen(true);
  };

  const saveMcq = async () => {
    if (!mcqFormQuestion.trim()) return alert('Question text is required.');
    if (mcqFormOptions.some(opt => !opt.trim())) return alert('All 4 options must be filled.');
    if (!mcqFormAnswer.trim()) return alert('Please choose or write the correct answer.');
    if (!mcqFormOptions.includes(mcqFormAnswer)) return alert('Correct answer must match one of the 4 options exactly.');

    const payload = {
      course: activeCourse,
      question: mcqFormQuestion,
      options: mcqFormOptions,
      answer: mcqFormAnswer,
      explanation: mcqFormExplanation
    };

    if (editingMcq) {
      const { error } = await supabase.from('mcq_questions').update(payload).eq('id', editingMcq.id);
      if (error) return alert(error.message);
      showToastNotification('MCQ Question ID #' + editingMcq.id + ' updated successfully!');
    } else {
      const { error } = await supabase.from('mcq_questions').insert([payload]);
      if (error) return alert(error.message);
      showToastNotification('New MCQ Question created!');
    }
    
    await fetchQuestions(activeCourse);
    setIsMcqModalOpen(false);
  };

  const deleteMcq = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete MCQ Question #${id}? This change instantly propagates to student tests.`)) return;
    const { error } = await supabase.from('mcq_questions').delete().eq('id', id);
    if (error) return alert(error.message);
    await fetchQuestions(activeCourse);
    showToastNotification('MCQ Question #' + id + ' deleted successfully.');
  };

  // Coding Modal handlers
  const openAddCodingModal = () => {
    setEditingCoding(null);
    setCodingFormTitle('');
    setCodingFormCategory('In Class');
    setCodingFormDifficulty('Easy');
    setCodingFormLanguage('C');
    setCodingFormCode('#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}');
    setIsCodingModalOpen(true);
  };

  const openEditCodingModal = (q: CodingChallenge) => {
    setEditingCoding(q);
    setCodingFormTitle(q.title);
    setCodingFormCategory(q.category);
    setCodingFormDifficulty(q.difficulty);
    setCodingFormLanguage(q.language);
    setCodingFormCode(q.code);
    setIsCodingModalOpen(true);
  };

  const handleLanguageChange = (lang: string) => {
    setCodingFormLanguage(lang);
    // Provide appropriate starter boilerplates if custom code has not been edited or is default
    if (codingFormCode.includes('#include <stdio.h>') || codingFormCode.includes('#include <iostream>') || codingFormCode.includes('def main():') || codingFormCode.trim() === '') {
      if (lang === 'C') {
        setCodingFormCode('#include <stdio.h>\n\nint main() {\n    // Write C template here\n    return 0;\n}');
      } else if (lang === 'C++') {
        setCodingFormCode('#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write C++ template here\n    return 0;\n}');
      } else if (lang === 'Python') {
        setCodingFormCode('def main():\n    # Write Python template here\n    pass\n\nif __name__ == "__main__":\n    main()');
      }
    }
  };

  const saveCodingChallenge = async () => {
    if (!codingFormTitle.trim()) return alert('Challenge title is required.');
    if (!codingFormCode.trim()) return alert('Starter code boilerplate is required.');

    const payload = {
      course: activeCourse,
      title: codingFormTitle,
      category: codingFormCategory,
      difficulty: codingFormDifficulty,
      language: codingFormLanguage,
      code: codingFormCode
    };

    if (editingCoding) {
      const { error } = await supabase.from('coding_challenges').update(payload).eq('id', editingCoding.id);
      if (error) return alert(error.message);
    } else {
      const { error } = await supabase.from('coding_challenges').insert([payload]);
      if (error) return alert(error.message);
    }
    await fetchCodingChallenges();
    showToastNotification('Coding challenge saved!');
    setIsCodingModalOpen(false);
  };

  const deleteCodingChallenge = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete Coding Challenge #${id}? This will remove it from the student coding list.`)) return;
    const { error } = await supabase.from('coding_challenges').delete().eq('id', id);
    if (error) return alert(error.message);
    await fetchCodingChallenges();
    showToastNotification('Coding Challenge deleted.');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-black font-sans flex flex-col antialiased">
      
      {/* Toast Alert Indicator */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-black text-white border-2 border-[#e53935] px-4 py-3 rounded-[8px] shadow-[4px_4px_0px_0px_rgba(229,57,53,1)] z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5 text-[#e53935]" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-white border-b-4 border-black py-4 px-6 flex justify-between items-center sticky top-0 z-30 shadow-[0_2px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e53935] rounded-[8px] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight leading-none text-black flex items-center gap-2">
                ADMIN <span className="text-[#e53935] bg-[#ffebee] px-2 py-0.5 rounded border border-[#e53935] text-xs font-black uppercase tracking-widest">Cockpit</span>
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Platform Control Station</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-300"></div>

          {/* Course Switcher */}
          <div className="flex items-center bg-gray-100 border-2 border-black rounded-[8px] p-1">
            <button 
              onClick={() => setActiveCourse('DSA')}
              className={`px-4 py-1.5 font-black text-xs uppercase tracking-wider rounded-[4px] transition-all ${activeCourse === 'DSA' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]' : 'text-gray-500 hover:text-black'}`}
            >
              DSA Module
            </button>
            <button 
              onClick={() => setActiveCourse('PYTHON')}
              className={`px-4 py-1.5 font-black text-xs uppercase tracking-wider rounded-[4px] transition-all ${activeCourse === 'PYTHON' ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(229,57,53,1)]' : 'text-gray-500 hover:text-black'}`}
            >
              Python Module
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-black text-black border-2 border-black bg-white hover:bg-gray-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-4 py-2 rounded-[8px] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          >
            <ArrowLeft className="w-4 h-4" /> Student View
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-black text-white border-2 border-black bg-black hover:bg-gray-800 hover:shadow-[3px_3px_0px_0px_rgba(229,57,53,1)] px-4 py-2 rounded-[8px] transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <main className="flex-1 max-w-[1500px] mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        
        {/* KPI Panel */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 shrink-0">
          
          {/* Card 1 */}
          <div className="bg-white border-4 border-black rounded-[12px] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-[8px] bg-[#ffebee] border-2 border-black flex items-center justify-center text-[#e53935] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total MCQs</p>
              <h3 className="text-3xl font-black leading-none mt-1 text-black">{mcqQuestions.length}</h3>
            </div>
            <div className="absolute right-3 top-3 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border-4 border-black rounded-[12px] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-[8px] bg-yellow-100 border-2 border-black flex items-center justify-center text-yellow-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">DSA Challenges</p>
              <h3 className="text-3xl font-black leading-none mt-1 text-black">{codingChallenges.length}</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border-4 border-black rounded-[12px] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-[8px] bg-purple-100 border-2 border-black flex items-center justify-center text-purple-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Average Score</p>
              <h3 className="text-3xl font-black leading-none mt-1 text-black">{averageScore}</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border-4 border-black rounded-[12px] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-[8px] bg-green-100 border-2 border-black flex items-center justify-center text-green-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sandbox API</p>
              <div className="flex items-center gap-1.5 mt-1">
                <h3 className="text-lg font-black leading-none text-green-600 uppercase">ONLINE</h3>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
              </div>
            </div>
          </div>

        </section>

        {/* Analytics Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 shrink-0">
          
          {/* Visual Bar 1: Coding Challenge Distribution */}
          <div className="bg-white border-4 border-black rounded-[12px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] lg:col-span-2">
            <h3 className="font-extrabold text-lg uppercase tracking-wider mb-4 flex items-center gap-2 border-b-2 border-gray-100 pb-2">
              <Code className="w-5 h-5 text-black" /> Challenge Categorization
            </h3>
            <div className="space-y-4">
              {/* In Class */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1">
                  <span>In Class Lab Problems</span>
                  <span>{analytics.inClass} Challenges</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-400 h-full border-r-2 border-black transition-all duration-500" 
                    style={{ width: `${(analytics.inClass / codingChallenges.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Post Class */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1">
                  <span>Post Class Tasks</span>
                  <span>{analytics.postClass} Challenges</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-400 h-full border-r-2 border-black transition-all duration-500" 
                    style={{ width: `${(analytics.postClass / codingChallenges.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Challenges */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-1">
                  <span>Grand Final Challenges</span>
                  <span>{analytics.challenges} Challenges</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#e53935] h-full transition-all duration-500" 
                    style={{ width: `${(analytics.challenges / codingChallenges.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Tab Selection Area */}
        <section className="flex-1 flex flex-col min-h-[600px] bg-white border-4 border-black rounded-[12px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          
          {/* Tabs Topbar */}
          <div className="bg-[#f8f9fa] border-b-4 border-black px-4 flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('mcq')}
              className={`font-black text-sm uppercase tracking-wider px-6 py-4 border-r-4 border-black transition-all relative top-[4px] -mt-[4px] flex items-center gap-2 ${
                activeTab === 'mcq' 
                  ? "bg-white text-black border-t-4 border-t-[#e53935] border-l-4 border-l-black border-b-4 border-b-white z-10" 
                  : "text-gray-500 hover:text-black hover:bg-gray-50 border-b-4 border-b-black"
              }`}
            >
              <BookOpen className="w-4 h-4" /> MCQ Practice Test
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`font-black text-sm uppercase tracking-wider px-6 py-4 border-r-4 border-black transition-all relative top-[4px] -mt-[4px] flex items-center gap-2 ${
                activeTab === 'coding' 
                  ? "bg-white text-black border-t-4 border-t-[#e53935] border-l-4 border-l-black border-b-4 border-b-white z-10" 
                  : "text-gray-500 hover:text-black hover:bg-gray-50 border-b-4 border-b-black"
              }`}
            >
              <Code className="w-4 h-4" /> Coding Challenges
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`font-black text-sm uppercase tracking-wider px-6 py-4 border-r-4 border-black transition-all relative top-[4px] -mt-[4px] flex items-center gap-2 ${
                activeTab === 'logs' 
                  ? "bg-white text-black border-t-4 border-t-[#e53935] border-l-4 border-l-black border-b-4 border-b-white z-10" 
                  : "text-gray-500 hover:text-black hover:bg-gray-50 border-b-4 border-b-black"
              }`}
            >
              <Terminal className="w-4 h-4" /> Platform Activity Logs
            </button>

          </div>

          {/* Tab Body */}
          <div className="flex-1 p-6 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            
            {/* TAB 1: MCQ WORKSPACE */}
            {activeTab === 'mcq' && (
              <div className="flex flex-col gap-6 h-full">
                
                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f8f9fa] p-4 border-2 border-black rounded-[8px]">
                  
                  {/* Search bar */}
                  <div className="w-full sm:w-80 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search questions or options..."
                      value={mcqSearch}
                      onChange={(e) => setMcqSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm font-bold border-2 border-black rounded-[6px] focus:outline-none focus:border-[#e53935]"
                    />
                  </div>

                  {/* Add button */}
                  <button
                    onClick={openAddMcqModal}
                    className="w-full sm:w-auto font-black text-sm uppercase tracking-wider bg-[#e53935] hover:bg-[#d32f2f] text-white border-2 border-black px-5 py-2.5 rounded-[8px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add MCQ Question
                  </button>

                </div>

                {/* Table Data */}
                {filteredMcqs.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-[12px]">
                    <AlertTriangle className="w-12 h-12 text-[#e53935] mx-auto mb-3" />
                    <h4 className="font-extrabold text-lg text-black uppercase">No MCQ Questions Found</h4>
                    <p className="text-sm text-gray-500 font-bold mt-1">Try adapting your search parameter or create a new MCQ.</p>
                  </div>
                ) : (
                  <div className="border-2 border-black rounded-[8px] overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#f8f9fa] border-b-2 border-black font-black text-xs uppercase text-gray-600">
                          <th className="py-3 px-4 w-16 text-center border-r-2 border-black">ID</th>
                          <th className="py-3 px-4 border-r-2 border-black">Question Text</th>
                          <th className="py-3 px-4 w-32 border-r-2 border-black text-center">Options</th>
                          <th className="py-3 px-4 border-r-2 border-black">Answer Match</th>
                          <th className="py-3 px-4 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMcqs.map((q) => (
                          <tr key={q.id} className="border-b-2 border-black last:border-0 hover:bg-[#fff9fa] transition-colors text-sm font-bold text-black">
                            <td className="py-4 px-4 text-center border-r-2 border-black font-black bg-gray-50">{q.id}</td>
                            <td className="py-4 px-4 border-r-2 border-black max-w-md break-words">{q.question}</td>
                            <td className="py-4 px-4 border-r-2 border-black text-center text-xs">
                              <span className="bg-gray-100 border border-black px-2.5 py-1 rounded font-black text-gray-700">
                                4 Options
                              </span>
                            </td>
                            <td className="py-4 px-4 border-r-2 border-black font-extrabold text-[#e53935]">{q.answer}</td>
                            <td className="py-4 px-4">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => openEditMcqModal(q)}
                                  className="p-1.5 border-2 border-black rounded-[4px] hover:bg-yellow-100 transition-colors text-black active:translate-y-[1px]"
                                  title="Edit Question"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteMcq(q.id)}
                                  className="p-1.5 border-2 border-black rounded-[4px] hover:bg-[#ffebee] hover:text-[#e53935] transition-colors text-black active:translate-y-[1px]"
                                  title="Delete Question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: CODING CHALLENGES WORKSPACE */}
            {activeTab === 'coding' && (
              <div className="flex flex-col gap-6 h-full">
                
                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#f8f9fa] p-4 border-2 border-black rounded-[8px]">
                  
                  {/* Search bar */}
                  <div className="w-full sm:w-80 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search title, category or levels..."
                      value={codingSearch}
                      onChange={(e) => setCodingSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm font-bold border-2 border-black rounded-[6px] focus:outline-none focus:border-[#e53935]"
                    />
                  </div>

                  {/* Add button */}
                  <button
                    onClick={openAddCodingModal}
                    className="w-full sm:w-auto font-black text-sm uppercase tracking-wider bg-black hover:bg-gray-900 text-white border-2 border-black px-5 py-2.5 rounded-[8px] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Code Challenge
                  </button>

                </div>

                {/* Table Data */}
                {filteredCoding.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-[12px]">
                    <AlertTriangle className="w-12 h-12 text-[#e53935] mx-auto mb-3" />
                    <h4 className="font-extrabold text-lg text-black uppercase">No Coding Challenges Found</h4>
                    <p className="text-sm text-gray-500 font-bold mt-1">Try adapting your search parameter or create a new coding exercise.</p>
                  </div>
                ) : (
                  <div className="border-2 border-black rounded-[8px] overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#f8f9fa] border-b-2 border-black font-black text-xs uppercase text-gray-600">
                          <th className="py-3 px-4 w-16 text-center border-r-2 border-black">ID</th>
                          <th className="py-3 px-4 border-r-2 border-black">Challenge Title</th>
                          <th className="py-3 px-4 border-r-2 border-black w-36">Category</th>
                          <th className="py-3 px-4 border-r-2 border-black w-32 text-center">Difficulty</th>
                          <th className="py-3 px-4 border-r-2 border-black w-24 text-center">Language</th>
                          <th className="py-3 px-4 w-28 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCoding.map((q) => {
                          const diffColors = q.difficulty.toLowerCase() === 'easy' 
                            ? 'bg-green-100 text-green-700' 
                            : q.difficulty.toLowerCase() === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-[#ffebee] text-[#e53935]';

                          return (
                            <tr key={q.id} className="border-b-2 border-black last:border-0 hover:bg-[#fff9fa] transition-colors text-sm font-bold text-black">
                              <td className="py-4 px-4 text-center border-r-2 border-black font-black bg-gray-50">{q.id}</td>
                              <td className="py-4 px-4 border-r-2 border-black">{q.title}</td>
                              <td className="py-4 px-4 border-r-2 border-black uppercase text-xs">
                                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-extrabold">
                                  {q.category}
                                </span>
                              </td>
                              <td className="py-4 px-4 border-r-2 border-black text-center text-xs uppercase">
                                <span className={`px-2.5 py-0.5 rounded font-black border border-current ${diffColors}`}>
                                  {q.difficulty}
                                </span>
                              </td>
                              <td className="py-4 px-4 border-r-2 border-black text-center">
                                <span className="font-extrabold text-xs bg-gray-100 border border-gray-300 rounded px-2 py-0.5">{q.language}</span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex justify-center items-center gap-2">
                                  <button
                                    onClick={() => openEditCodingModal(q)}
                                    className="p-1.5 border-2 border-black rounded-[4px] hover:bg-yellow-100 transition-colors text-black active:translate-y-[1px]"
                                    title="Edit Challenge"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteCodingChallenge(q.id)}
                                    className="p-1.5 border-2 border-black rounded-[4px] hover:bg-[#ffebee] hover:text-[#e53935] transition-colors text-black active:translate-y-[1px]"
                                    title="Delete Challenge"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: SYSTEM ACTIVITIES LOGSTREAM */}
            {activeTab === 'logs' && (
              <div className="flex flex-col gap-4 h-full">
                
                {/* Logs Settings Header */}
                <div className="flex justify-between items-center bg-gray-100 border-2 border-black rounded-[8px] p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 bg-[#e53935] rounded-full inline-block animate-pulse"></span>
                    <span className="font-black text-sm uppercase tracking-widest text-black">Live Event Feed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsLogsPaused(!isLogsPaused)}
                      className="flex items-center gap-1.5 font-bold text-xs border-2 border-black bg-white hover:bg-gray-50 rounded px-3 py-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                    >
                      {isLogsPaused ? <Play className="w-3.5 h-3.5 text-green-600" /> : <Pause className="w-3.5 h-3.5 text-red-500" />}
                      {isLogsPaused ? 'Resume Feed' : 'Pause Feed'}
                    </button>
                    <button
                      onClick={() => setSystemLogs([])}
                      className="font-bold text-xs border-2 border-black bg-white hover:bg-[#ffebee] hover:text-[#e53935] rounded px-3 py-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none"
                    >
                      Clear Terminal
                    </button>
                  </div>
                </div>

                {/* Log Terminal Screen */}
                <div className="flex-1 bg-black border-4 border-black rounded-[12px] p-5 font-mono text-xs text-green-400 overflow-y-auto leading-relaxed shadow-[6px_6px_0px_0px_rgba(229,57,53,1)]" style={{ height: '400px', scrollbarWidth: 'thin' }}>
                  {systemLogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                      &gt; Terminal is empty. Waiting for student processes...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {systemLogs.map((log) => {
                        let typeColor = 'text-green-400';
                        let typeLabel = '[INFO]';
                        if (log.type === 'success') {
                          typeColor = 'text-emerald-400';
                          typeLabel = '[OK]';
                        } else if (log.type === 'warn') {
                          typeColor = 'text-yellow-400';
                          typeLabel = '[WARN]';
                        } else if (log.type === 'compiler') {
                          typeColor = 'text-cyan-400';
                          typeLabel = '[EXEC]';
                        }

                        return (
                          <div key={log.id} className="flex items-start gap-2 hover:bg-zinc-900 py-0.5 rounded px-1 transition-colors">
                            <span className="text-gray-500 shrink-0 select-none">[{log.time}]</span>
                            <span className={`font-extrabold shrink-0 select-none ${typeColor}`}>{typeLabel}</span>
                            <span className="text-zinc-100 flex-1">{log.message}</span>
                          </div>
                        );
                      })}
                      <div className="text-gray-500 animate-pulse mt-3 select-none">&gt; Listening on server port 5173 for student events...</div>
                    </div>
                  )}
                </div>

              </div>
            )}



          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-4 border-black py-4 px-6 mt-8">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
          <span>CodeNest 2.0 — Admin Panel</span>
          <span>© 2026 Admin Dashboard Suite v1.1.0</span>
        </div>
      </footer>

      {/* ================= MODALS SECTION ================= */}

      {/* MCQ ADD/EDIT OVERLAY MODAL */}
      {isMcqModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black rounded-[12px] w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#f8f9fa] border-b-4 border-black p-4 flex justify-between items-center">
              <h3 className="font-black text-lg uppercase tracking-wider text-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#e53935]" /> {editingMcq ? `Edit MCQ Question #${editingMcq.id}` : 'Create New MCQ Question'}
              </h3>
              <button 
                onClick={() => setIsMcqModalOpen(false)}
                className="p-1 border-2 border-black rounded hover:bg-gray-100 text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[75vh]" style={{ scrollbarWidth: 'thin' }}>
              
              {/* Question Text */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-gray-600">Question Title / Text</label>
                <textarea 
                  rows={3}
                  value={mcqFormQuestion}
                  onChange={(e) => setMcqFormQuestion(e.target.value)}
                  placeholder="e.g. What is the time complexity of building an adjacency matrix?"
                  className="w-full p-3 font-bold border-2 border-black rounded-[6px] focus:outline-none focus:border-[#e53935]"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mcqFormOptions.map((opt, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase text-gray-500">Option {String.fromCharCode(65 + idx)}</label>
                    <input 
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const next = [...mcqFormOptions];
                        next[idx] = e.target.value;
                        setMcqFormOptions(next);
                      }}
                      placeholder={`Fill option ${String.fromCharCode(65 + idx)}`}
                      className="w-full px-3 py-2 font-bold border-2 border-black rounded-[6px] focus:outline-none focus:border-[#e53935]"
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-gray-600">Correct Answer Match</label>
                <select
                  value={mcqFormAnswer}
                  onChange={(e) => setMcqFormAnswer(e.target.value)}
                  className="w-full px-3 py-2.5 font-bold border-2 border-black rounded-[6px] bg-white focus:outline-none focus:border-[#e53935]"
                >
                  <option value="">-- Choose correct answer --</option>
                  {mcqFormOptions.map((opt, idx) => opt.trim() && (
                    <option key={idx} value={opt}>{String.fromCharCode(65 + idx)}: {opt}</option>
                  ))}
                  {/* Allow custom fallback if needed */}
                  {editingMcq && !mcqFormOptions.includes(mcqFormAnswer) && mcqFormAnswer && (
                    <option value={mcqFormAnswer}>Existing: {mcqFormAnswer}</option>
                  )}
                </select>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Make sure you fill out options A-D above before choosing correct answer.</p>
              </div>

              {/* Explanation */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-gray-600">Explanation / Reference</label>
                <textarea 
                  rows={2}
                  value={mcqFormExplanation}
                  onChange={(e) => setMcqFormExplanation(e.target.value)}
                  placeholder="Explain why this option is correct..."
                  className="w-full p-3 font-bold border-2 border-black rounded-[6px] focus:outline-none focus:border-[#e53935]"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#f8f9fa] border-t-4 border-black p-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsMcqModalOpen(false)}
                className="font-bold text-xs uppercase tracking-wider bg-white hover:bg-gray-100 text-black border-2 border-black px-4 py-2 rounded-[6px]"
              >
                Cancel
              </button>
              <button 
                onClick={saveMcq}
                className="font-black text-xs uppercase tracking-wider bg-[#e53935] hover:bg-[#d32f2f] text-white border-2 border-black px-5 py-2.5 rounded-[6px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none transition-all"
              >
                Save Question
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CODING CHALLENGE ADD/EDIT OVERLAY MODAL */}
      {isCodingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black rounded-[12px] w-full max-w-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#f8f9fa] border-b-4 border-black p-4 flex justify-between items-center">
              <h3 className="font-black text-lg uppercase tracking-wider text-black flex items-center gap-2">
                <Code className="w-5 h-5 text-black" /> {editingCoding ? `Edit Coding Exercise #${editingCoding.id}` : 'Create Coding Exercise'}
              </h3>
              <button 
                onClick={() => setIsCodingModalOpen(false)}
                className="p-1 border-2 border-black rounded hover:bg-gray-100 text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[75vh]" style={{ scrollbarWidth: 'thin' }}>
              
              {/* Challenge Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-gray-600">Challenge Title</label>
                <input 
                  type="text"
                  value={codingFormTitle}
                  onChange={(e) => setCodingFormTitle(e.target.value)}
                  placeholder="e.g. Graph Cycle Detection"
                  className="w-full px-3 py-2 font-bold border-2 border-black rounded-[6px] focus:outline-none focus:border-[#e53935]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-gray-600">Category Tag</label>
                  <select
                    value={codingFormCategory}
                    onChange={(e) => setCodingFormCategory(e.target.value)}
                    className="w-full px-3 py-2 font-bold border-2 border-black rounded-[6px] bg-white focus:outline-none focus:border-[#e53935]"
                  >
                    {activeCourse === 'DSA' ? (
                      <>
                        <option value="In Class">In Class</option>
                        <option value="Post Class">Post Class</option>
                        <option value="Challenges">Challenges</option>
                      </>
                    ) : (
                      <>
                        <option value="Dictionary">Dictionary</option>
                        <option value="Exception Handling">Exception Handling</option>
                        <option value="NumPy">NumPy</option>
                        <option value="Pandas">Pandas</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Difficulty */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-gray-600">Difficulty Grade</label>
                  <select
                    value={codingFormDifficulty}
                    onChange={(e) => setCodingFormDifficulty(e.target.value)}
                    className="w-full px-3 py-2 font-bold border-2 border-black rounded-[6px] bg-white focus:outline-none focus:border-[#e53935]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-gray-600">Language Boilerplate</label>
                  <select
                    value={codingFormLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-3 py-2 font-bold border-2 border-black rounded-[6px] bg-white focus:outline-none focus:border-[#e53935]"
                  >
                    <option value="C">C</option>
                    <option value="C++">C++</option>
                    <option value="Python">Python</option>
                  </select>
                </div>

              </div>

              {/* Default Template Code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-gray-600 flex justify-between">
                  <span>Template Starter Code Boilerplate</span>
                  <span className="text-gray-400 font-mono">Monaco editor compatible code</span>
                </label>
                <textarea 
                  rows={8}
                  value={codingFormCode}
                  onChange={(e) => setCodingFormCode(e.target.value)}
                  className="w-full p-3 font-mono text-xs border-2 border-black bg-zinc-900 text-green-400 rounded-[6px] focus:outline-none"
                  style={{ tabSize: 4 }}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#f8f9fa] border-t-4 border-black p-4 flex justify-end gap-3">
              <button 
                onClick={() => setIsCodingModalOpen(false)}
                className="font-bold text-xs uppercase tracking-wider bg-white hover:bg-gray-100 text-black border-2 border-black px-4 py-2 rounded-[6px]"
              >
                Cancel
              </button>
              <button 
                onClick={saveCodingChallenge}
                className="font-black text-xs uppercase tracking-wider bg-black hover:bg-gray-900 text-white border-2 border-black px-5 py-2.5 rounded-[6px] shadow-[2px_2px_0px_0px_rgba(229,57,53,1)] active:translate-y-[1px] active:shadow-none transition-all"
              >
                Save Challenge
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
