import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { User } from '@supabase/supabase-js';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  MapPin, 
  ShoppingBag, 
  ShoppingCart,
  Heart, 
  MessageSquare, 
  ChevronRight,
  Dog,
  Camera,
  Loader2,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

type Section = 'profile' | 'cart' | 'orders' | 'wishlist' | 'reviews';

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <Loader2 className="w-8 h-8 animate-spin text-pastel-purple" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ivory p-4 text-center">
        <h1 className="text-2xl font-serif font-bold text-ink mb-4">로그인이 필요합니다</h1>
        <p className="text-ink/60 mb-8">마이페이지를 이용하시려면 로그인을 해주세요.</p>
        <a href="/" className="px-8 py-3 bg-pastel-purple text-white rounded-full font-bold shadow-lg shadow-pastel-purple/20">
          홈으로 가기
        </a>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', name: '내 정보 설정', icon: UserIcon, desc: '이름, 배송지, 반려견 정보' },
    { id: 'cart', name: '장바구니', icon: ShoppingCart, desc: '담아둔 상품 확인' },
    { id: 'orders', name: '주문 내역', icon: ShoppingBag, desc: '최근 주문 및 배송 현황' },
    { id: 'wishlist', name: '찜 리스트', icon: Heart, desc: '관심 있는 상품 목록' },
    { id: 'reviews', name: '내 후기 내역', icon: MessageSquare, desc: '내가 작성한 소중한 리뷰' },
  ];

  return (
    <div className="min-h-screen bg-ivory pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-ink mb-2">My Page</h1>
          <p className="text-ink/50 font-light italic">안녕하세요, {user.user_metadata.full_name || user.email}님!</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={`w-full flex items-center p-6 rounded-3xl transition-all border ${
                  activeSection === item.id 
                    ? 'bg-white border-pastel-purple shadow-xl shadow-pastel-purple/5 scale-[1.02]' 
                    : 'bg-white/40 border-transparent hover:bg-white/60'
                }`}
              >
                <div className={`p-3 rounded-2xl mr-4 ${
                  activeSection === item.id ? 'bg-pastel-purple text-white' : 'bg-pastel-purple/10 text-pastel-purple'
                }`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <h3 className={`font-bold text-sm ${activeSection === item.id ? 'text-ink' : 'text-ink/70'}`}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-ink/40 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeSection === item.id ? 'text-pastel-purple translate-x-1' : 'text-ink/20'
                }`} />
              </button>
            ))}
          </aside>

          {/* Content Area */}
          <main className="lg:col-span-8">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-pastel-purple/5 border border-pastel-purple/10 min-h-[600px]"
            >
              {activeSection === 'profile' && <ProfileSection user={user} setUser={setUser} />}
              {activeSection === 'cart' && <PlaceholderSection title="장바구니" icon={ShoppingCart} />}
              {activeSection === 'orders' && <PlaceholderSection title="주문 내역" icon={Package} />}
              {activeSection === 'wishlist' && <PlaceholderSection title="찜 리스트" icon={Heart} />}
              {activeSection === 'reviews' && <PlaceholderSection title="내 후기 내역" icon={MessageSquare} />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user, setUser }: { user: User, setUser: (user: User) => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.user_metadata.full_name || '',
    phone: user.user_metadata.phone || '',
    zipcode: user.user_metadata.zipcode || '',
    address: user.user_metadata.address || '',
    address_detail: user.user_metadata.address_detail || '',
    pet_name: user.user_metadata.pet_name || '',
    pet_breed: user.user_metadata.pet_breed || '',
  });

  useEffect(() => {
    setFormData({
      full_name: user.user_metadata.full_name || '',
      phone: user.user_metadata.phone || '',
      zipcode: user.user_metadata.zipcode || '',
      address: user.user_metadata.address || '',
      address_detail: user.user_metadata.address_detail || '',
      pet_name: user.user_metadata.pet_name || '',
      pet_breed: user.user_metadata.pet_breed || '',
    });
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: formData
      });

      if (error) throw error;
      if (data.user) setUser(data.user);
      toast.success('정보가 성공적으로 저장되었습니다.');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || '정보 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pastel-purple/20 bg-pastel-purple/5 flex items-center justify-center">
            {user.user_metadata.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-12 h-12 text-pastel-purple/40" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-pastel-purple text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold text-ink">{formData.full_name || '사용자'}</h2>
          <p className="text-ink/40 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ink/30 uppercase tracking-widest flex items-center">
            <UserIcon className="w-3 h-3 mr-2" /> 기본 정보
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 ml-1">이름</label>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 ml-1">연락처</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ink/30 uppercase tracking-widest flex items-center">
            <MapPin className="w-3 h-3 mr-2" /> 배송지 설정
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 ml-1">주소</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  placeholder="우편번호"
                  className="w-24 px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm"
                />
                <button className="px-4 py-2 bg-pastel-purple/10 text-pastel-purple text-xs font-bold rounded-xl hover:bg-pastel-purple/20 transition-colors">
                  주소 찾기
                </button>
              </div>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="기본 주소"
                className="w-full px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm mt-2"
              />
              <input 
                type="text" 
                name="address_detail"
                value={formData.address_detail}
                onChange={handleChange}
                placeholder="상세 주소"
                className="w-full px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm mt-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-ink/30 uppercase tracking-widest flex items-center">
            <Dog className="w-3 h-3 mr-2" /> 반려견 정보
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 ml-1">반려견 이름</label>
              <input 
                type="text" 
                name="pet_name"
                value={formData.pet_name}
                onChange={handleChange}
                placeholder="강아지 이름을 입력하세요"
                className="w-full px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-ink/40 ml-1">반려견 견종</label>
              <input 
                type="text" 
                name="pet_breed"
                value={formData.pet_breed}
                onChange={handleChange}
                placeholder="예: 푸들, 말티즈"
                className="w-full px-4 py-3 rounded-2xl bg-ivory/50 border border-pastel-purple/10 focus:outline-none focus:border-pastel-purple text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-pastel-purple/10">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-pastel-purple text-white rounded-2xl font-bold shadow-xl shadow-pastel-purple/20 hover:bg-pastel-purple/90 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : '저장하기'}
        </button>
      </div>
    </div>
  );
}

function PlaceholderSection({ title, icon: Icon = ShoppingBag }: { title: string, icon?: any }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-pastel-purple/5 flex items-center justify-center">
        <Icon className="w-8 h-8 text-pastel-purple/20" />
      </div>
      <div>
        <h2 className="text-xl font-serif font-bold text-ink">{title}</h2>
        <p className="text-ink/40 text-sm mt-2">준비 중인 서비스입니다. 곧 만나보실 수 있어요!</p>
      </div>
    </div>
  );
}
