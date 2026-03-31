import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import CustomOrder from './pages/CustomOrder';
import Community from './pages/Community';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <div className="animate-pulse text-pastel-purple font-serif text-2xl">Pom Pom Winkle...</div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="collection" element={<Collection />} />
          <Route path="custom-order" element={<CustomOrder />} />
          <Route path="community" element={<Community />} />
          <Route 
            path="admin/*" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}
