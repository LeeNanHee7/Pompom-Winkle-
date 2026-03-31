import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Loader2, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  // Update mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('로그인에 성공했습니다.');
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast.success('회원가입이 완료되었습니다. 이메일 인증을 확인해 주세요.');
        onClose();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-ivory rounded-3xl shadow-2xl border border-pastel-purple/20 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-pastel-purple/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-ink/50" />
        </button>

        <div className="p-8 pt-12 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-bold text-ink">
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-sm text-ink/50 font-light">
              {mode === 'login' ? '폼폼윙클에 오신 것을 환영합니다.' : '폼폼윙클의 특별한 멤버가 되어보세요.'}
            </p>
          </div>

          <div className="flex p-1 bg-pastel-purple/5 rounded-2xl border border-pastel-purple/10">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                mode === 'login' ? 'bg-white text-pastel-purple shadow-sm' : 'text-ink/40 hover:text-pastel-purple'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                mode === 'signup' ? 'bg-white text-pastel-purple shadow-sm' : 'text-ink/40 hover:text-pastel-purple'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-ink/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-purple/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pastel-purple/20 bg-white/50 text-sm focus:outline-none focus:border-pastel-purple transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-purple/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pastel-purple/20 bg-white/50 text-sm focus:outline-none focus:border-pastel-purple transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-ink/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-purple/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pastel-purple/20 bg-white/50 text-sm focus:outline-none focus:border-pastel-purple transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-pastel-purple text-white text-sm font-bold hover:bg-pastel-purple/90 transition-all shadow-lg shadow-pastel-purple/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pastel-purple/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-4 bg-ivory text-ink/30">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-2xl border border-pastel-purple/20 bg-white hover:bg-pastel-purple/5 transition-all text-sm font-bold text-ink flex items-center justify-center space-x-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            <span>Google Login</span>
          </button>

          <p className="text-center text-xs text-ink/40 font-light">
            {mode === 'login' ? (
              <>
                계정이 없으신가요?{' '}
                <button onClick={() => setMode('signup')} className="text-pastel-purple font-bold hover:underline">
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <button onClick={() => setMode('login')} className="text-pastel-purple font-bold hover:underline">
                  로그인
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
