import { Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged, User } from '../firebase';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ivory">
        <div className="animate-pulse text-pastel-purple font-serif text-2xl">Verifying...</div>
      </div>
    );
  }

  const isAdmin = user?.email === "nanhee717@gmail.com";

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
