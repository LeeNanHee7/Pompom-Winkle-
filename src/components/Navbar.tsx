import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, signInWithPopup, googleProvider, signOut, onAuthStateChanged, User } from '../firebase';
import { Menu, X, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
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
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white transition-all text-sm font-medium"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
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
                  className="w-full text-left px-3 py-4 text-base font-medium text-pastel-purple"
                >
                  Login
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
