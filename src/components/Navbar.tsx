import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';
import { Menu, X, User as UserIcon, LogOut, Settings, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.info('로그아웃 되었습니다.');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collection', path: '/collection' },
    { name: 'Custom Order', path: '/custom-order' },
    { name: 'Community', path: '/community' },
  ];

  const isAdmin = user?.email === "nanhee717@gmail.com";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-ivory/80 backdrop-blur-md border-b border-pastel-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold text-ink tracking-tight">Pom Pom Winkle</span>
              <span className="text-sm font-serif italic text-pastel-purple">폼폼윙클</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-pastel-purple ${
                    location.pathname === link.path ? 'text-pastel-purple' : 'text-ink/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link to="/admin" className="p-2 hover:bg-pastel-purple/10 rounded-full transition-colors">
                      <Settings className="w-5 h-5 text-pastel-purple" />
                    </Link>
                  )}
                  <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full transition-colors group">
                    <LogOut className="w-5 h-5 text-ink/50 group-hover:text-red-500" />
                  </button>
                  <div className="w-8 h-8 rounded-full border border-pastel-purple/30 overflow-hidden bg-pastel-purple/10 flex items-center justify-center">
                    {user.user_metadata.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-pastel-purple" />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-sm font-medium text-ink/70 hover:text-pastel-purple transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-pastel-purple text-white hover:bg-pastel-purple/90 transition-all shadow-lg shadow-pastel-purple/20 text-sm font-bold"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {user && isAdmin && (
                <Link to="/admin" className="p-2">
                  <Settings className="w-5 h-5 text-pastel-purple" />
                </Link>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-ivory border-b border-pastel-purple/20 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-4 text-base font-medium ${
                      location.pathname === link.path ? 'text-pastel-purple' : 'text-ink/70'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {!user && (
                  <div className="space-y-2 pt-4">
                    <button
                      onClick={() => { openAuthModal('login'); setIsMenuOpen(false); }}
                      className="w-full text-center px-3 py-4 text-base font-medium text-ink/70 border border-pastel-purple/20 rounded-2xl"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { openAuthModal('signup'); setIsMenuOpen(false); }}
                      className="w-full text-center px-3 py-4 text-base font-medium text-white bg-pastel-purple rounded-2xl shadow-lg shadow-pastel-purple/20"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                {user && (
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-4 text-base font-medium text-red-500"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authModalMode}
      />
    </>
  );
}
