import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { useState, useEffect } from 'react';
import { CollectionItem, SiteSettings } from '../types';
import { ArrowRight, Star, Heart } from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [bestItems, setBestItems] = useState<CollectionItem[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'site')
        .single();
      
      if (error) {
        console.error('Error fetching settings:', error);
      } else {
        setSettings(data as SiteSettings);
      }
    };

    const fetchBestItems = async () => {
      const { data, error } = await supabase
        .from('collection')
        .select('*')
        .order('order', { ascending: true })
        .limit(3);
      
      if (error) {
        console.error('Error fetching best items:', error);
      } else {
        setBestItems(data as CollectionItem[]);
      }
    };

    fetchSettings();
    fetchBestItems();

    // Real-time subscriptions
    const settingsSubscription = supabase
      .channel('settings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings', filter: 'id=eq.site' }, () => {
        fetchSettings();
      })
      .subscribe();

    const collectionSubscription = supabase
      .channel('home_collection_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collection' }, () => {
        fetchBestItems();
      })
      .subscribe();

    return () => {
      settingsSubscription.unsubscribe();
      collectionSubscription.unsubscribe();
    };
  }, []);

  const defaultSettings: SiteSettings = {
    brandName: 'Pom Pom Winkle',
    heroTitle: '가장 눈부신 순간, 우리 아이를 위한 단 하나의 드레스',
    heroSubtitle: '하이엔드 맞춤제작 드레스 브랜드 폼폼윙클입니다.',
  };

  const currentSettings = settings || defaultSettings;

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-ivory">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1762747038571-a40effc78e58?q=80&w=1470&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-[center_5%] opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/20 via-transparent to-ivory" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-pastel-purple/10 text-pastel-purple text-xs font-bold uppercase tracking-widest border border-pastel-purple/20">
              High-End Pet Couture
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-ink leading-tight">
              {currentSettings.heroTitle.includes(',') ? (
                <>
                  <span className="block mb-2">{currentSettings.heroTitle.split(',')[0].trim()}</span>
                  <span className="block text-2xl md:text-5xl lg:text-6xl opacity-90 break-keep">
                    {currentSettings.heroTitle.split(',')[1].trim()}
                  </span>
                </>
              ) : (
                currentSettings.heroTitle
              )}
            </h1>
            <p className="text-lg md:text-xl text-ink/60 font-light max-w-2xl mx-auto leading-relaxed">
              {currentSettings.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/collection" 
                className="px-8 py-4 rounded-full bg-pastel-purple text-white text-sm font-bold hover:bg-pastel-purple/90 transition-all shadow-lg shadow-pastel-purple/20 flex items-center space-x-2 group"
              >
                <span>컬렉션 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/custom-order" 
                className="px-8 py-4 rounded-full border-2 border-pastel-purple-deep text-pastel-purple-deep text-sm font-black bg-pastel-purple/5 hover:bg-pastel-purple/10 transition-all shadow-md shadow-pastel-purple/20"
              >
                맞춤 제작 문의
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 hidden lg:block opacity-20"
        >
          <Star className="w-12 h-12 text-pastel-purple fill-pastel-purple" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 hidden lg:block opacity-20"
        >
          <Heart className="w-12 h-12 text-pastel-purple fill-pastel-purple" />
        </motion.div>
      </section>

      {/* Best Items Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight">Best Collection</h2>
            <p className="text-ink/50 text-sm italic">폼폼윙클의 가장 사랑받는 디자인들을 소개합니다.</p>
          </div>
          <Link to="/collection" className="text-sm font-bold text-pastel-purple hover:underline flex items-center space-x-1">
            <span>전체보기</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestItems.length > 0 ? (
            bestItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-pastel-purple-light mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-5 h-5 text-pastel-purple" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-pastel-purple font-bold">{item.category}</span>
                  <h3 className="text-lg font-serif font-bold text-ink group-hover:text-pastel-purple transition-colors">{item.name}</h3>
                  <p className="text-sm text-ink/50 font-light line-clamp-1">{item.description}</p>
                  {item.price && (
                    <p className="text-sm font-bold text-ink pt-2">₩{item.price.toLocaleString()}</p>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            // Placeholder Items
            [1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-pastel-purple/5 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-pastel-purple/5 rounded w-1/4 animate-pulse" />
                  <div className="h-6 bg-pastel-purple/5 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-pastel-purple/5 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="bg-pastel-purple-light/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1630527582090-15bfe6477736?q=80&w=1470&auto=format&fit=crop" 
                  alt="Pom Pom Winkle Couture" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-pastel-purple rounded-full flex items-center justify-center text-white text-center p-6 shadow-xl">
                <p className="font-serif italic text-sm">"Every pet deserves to feel like royalty."</p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-serif font-bold text-ink leading-tight">
                우리는 반려동물의 가장 아름다운 순간을 디자인합니다.
              </h2>
              <div className="space-y-4 text-ink/70 leading-relaxed font-light">
                <p>
                  폼폼윙클은 단순한 옷을 넘어, 반려동물과 반려인이 함께 공유하는 특별한 감동을 추구합니다.
                  모든 드레스는 최고급 원단과 정교한 수작업을 통해 제작되며, 각 반려동물의 체형과 개성을 완벽하게 반영합니다.
                </p>
                <p>
                  우리의 철학은 명확합니다. 모든 생명은 존중받아야 하며, 그들의 아름다움은 빛나야 합니다.
                  폼폼윙클과 함께 당신의 소중한 친구에게 잊지 못할 선물을 하세요.
                </p>
              </div>
              <Link to="/about" className="inline-flex items-center space-x-2 text-sm font-bold text-pastel-purple hover:underline">
                <span>브랜드 스토리 더보기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
