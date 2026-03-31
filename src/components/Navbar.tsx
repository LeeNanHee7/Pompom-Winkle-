import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, signInWithPopup, googleProvider, signOut, onAuthStateChanged, User } from '../firebase';
import { Menu, X, User as UserIcon, LogOut, Settings, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('로그인에 성공했습니다.');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/unauthorized-domain') {
        toast.error('이 도메인은 Firebase 승인 도메인에 등록되어 있지 않습니다. Firebase 콘솔에서 도메인을 추가해 주세요.');
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.');
      } else {
        toast.error(`로그인 실패: ${error.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
                <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full border border-pastel-purple/30" />
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white transition-all text-sm font-medium disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
              </button>
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
                <button
                  onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                  disabled={isLoggingIn}
                  className="w-full text-left px-3 py-4 text-base font-medium text-pastel-purple flex items-center space-x-2 disabled:opacity-50"
                >
                  {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
                </button>
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
  );
}
