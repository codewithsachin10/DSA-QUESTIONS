import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import HomePage from './pages/HomePage';
import DSAPage from './pages/DSAPage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import ReviewPage from './pages/ReviewPage';
import CodingPage from './pages/CodingPage';
import PracticeEditorPage from './pages/PracticeEditorPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import PythonPage from './pages/PythonPage';
import PythonModulePage from './pages/PythonModulePage';

// Admin Protected Route Wrapper
function AdminRoute({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center font-black text-black tracking-widest text-sm uppercase">
        <div className="w-4 h-4 bg-[#e53935] rounded-full animate-ping mr-3"></div>
        Securing connection...
      </div>
    );
  }
  
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dsa" element={<DSAPage />} />
        <Route path="/python" element={<PythonPage />} />
        <Route path="/python/module/:id" element={<PythonModulePage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/code" element={<CodingPage />} />
        <Route path="/editor" element={<PracticeEditorPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
