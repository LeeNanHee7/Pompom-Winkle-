import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly = true }: { children: React.ReactNode, adminOnly?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <div className="animate-pulse text-pastel-purple font-serif text-2xl">Verifying...</div>
      </div>
    );
  }

  const isAdmin = user?.email === "nanhee717@gmail.com";

  if (!user || (adminOnly && !isAdmin)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
