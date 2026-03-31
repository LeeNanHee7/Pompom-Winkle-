import { motion } from 'motion/react';
import { db, collection, onSnapshot } from '../firebase';
import { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { Star, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'settings'), (snapshot) => {
      const siteDoc = snapshot.docs.find(doc => doc.id === 'site');
      if (siteDoc) setSettings(siteDoc.data() as SiteSettings);
    });
    return () => unsubscribe();
  }, []);

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'Premium Design', desc: '하이엔드 감성의 독창적인 디자인을 추구합니다.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Quality Materials', desc: '반려동물의 피부를 생각한 최고급 원단만을 사용합니다.' },
    { icon: <Heart className="w-6 h-6" />, title: 'Handmade with Love', desc: '모든 공정은 숙련된 장인의 정성 어린 손길로 완성됩니다.' },
    { icon: <Star className="w-6 h-6" />, title: 'Perfect Fit', desc: '개별 맞춤 측정을 통해 가장 편안한 핏을 제공합니다.' },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-pastel-purple-light/20 py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-widest text-pastel-purple"
          >
            Our Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-ink"
          >
            About Pom Pom Winkle
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink/60 font-light max-w-2xl mx-auto leading-relaxed"
          >
            폼폼윙클은 반려동물의 가장 빛나는 순간을 위해 탄생했습니다.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-ink leading-tight">
              반려동물과 함께하는<br />
              우아한 라이프스타일의 시작
            </h2>
            <div className="space-y-6 text-ink/70 leading-relaxed font-light text-lg">
              <p>
                {settings?.aboutText || '폼폼윙클은 반려동물을 단순한 동물이 아닌, 삶의 소중한 동반자이자 가족으로 생각합니다. 우리는 그들이 우리에게 주는 무조건적인 사랑에 보답하고자, 그들의 아름다움을 극대화할 수 있는 하이엔드 드레스를 제작합니다.'}
              </p>
              <p>
                모든 디자인은 반려동물의 활동성과 편안함을 최우선으로 고려하며, 동시에 럭셔리한 미학을 놓치지 않습니다. 폼폼윙클의 드레스는 특별한 날뿐만 아니라, 일상의 모든 순간을 특별하게 만들어 줄 것입니다.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img src="https://images.unsplash.com/photo-1664985131975-5a4d201fb03b?q=80&w=880&auto=format&fit=crop" alt="Professional Pet Fashion 1" className="rounded-2xl shadow-lg w-full h-[300px] object-cover" referrerPolicy="no-referrer" />
              <img src="https://plus.unsplash.com/premium_photo-1676586308496-237a982709a2?q=80&w=1469&auto=format&fit=crop" alt="Professional Pet Fashion 2" className="rounded-2xl shadow-lg w-full h-[200px] object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4">
              <img src="https://plus.unsplash.com/premium_photo-1672401936721-40cb06bc2d2f?q=80&w=745&auto=format&fit=crop" alt="Professional Pet Fashion 3" className="rounded-2xl shadow-lg w-full h-[200px] object-cover" referrerPolicy="no-referrer" />
              <img src="https://images.unsplash.com/photo-1705344500468-346d3ccfc385?q=80&w=715&auto=format&fit=crop" alt="Professional Pet Fashion 4" className="rounded-2xl shadow-lg w-full h-[300px] object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-pastel-purple/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex p-4 bg-pastel-purple/10 rounded-full text-pastel-purple mb-2">
                {f.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-ink">{f.title}</h3>
              <p className="text-sm text-ink/60 font-light leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
