import { Instagram, MessageCircle, Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/mlgobrjz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, type: 'Newsletter Subscription' })
      });

      if (response.ok) {
        toast.success('뉴스레터 구독 신청이 완료되었습니다!');
        setEmail('');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('구독 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-ivory border-t border-pastel-purple/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-ink">Pom Pom Winkle</h3>
            <p className="text-sm text-ink/60 leading-relaxed">
              반려동물을 위한 하이엔드 맞춤제작 드레스 브랜드.<br />
              우아함과 사랑스러움이 공존하는 특별한 순간을 선물합니다.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-pastel-purple/10 rounded-full hover:bg-pastel-purple/20 transition-colors">
                <Instagram className="w-5 h-5 text-pastel-purple" />
              </a>
              <a href="https://pf.kakao.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-pastel-purple/10 rounded-full hover:bg-pastel-purple/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-pastel-purple" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-ink/60 hover:text-pastel-purple transition-colors">About Us</Link></li>
              <li><Link to="/collection" className="text-sm text-ink/60 hover:text-pastel-purple transition-colors">Collection</Link></li>
              <li><Link to="/custom-order" className="text-sm text-ink/60 hover:text-pastel-purple transition-colors">Custom Order</Link></li>
              <li><Link to="/community" className="text-sm text-ink/60 hover:text-pastel-purple transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-sm text-ink/60">
                <Mail className="w-4 h-4 text-pastel-purple" />
                <span>contact@pompomwinkle.com</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-ink/60">
                <Phone className="w-4 h-4 text-pastel-purple" />
                <span>010-1234-5678</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-ink/60">
                <MapPin className="w-4 h-4 text-pastel-purple" />
                <span>Seoul, South Korea</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-sm text-ink/60 mb-4">신제품 소식과 이벤트를 가장 먼저 받아보세요.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                required
                className="flex-grow px-4 py-2 rounded-full border border-pastel-purple/20 bg-white/50 text-sm focus:outline-none focus:border-pastel-purple"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full bg-pastel-purple text-white text-sm font-medium hover:bg-pastel-purple/90 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-pastel-purple/10 pt-8 text-center">
          <p className="text-xs text-ink/40">
            &copy; {new Date().getFullYear()} Pom Pom Winkle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
