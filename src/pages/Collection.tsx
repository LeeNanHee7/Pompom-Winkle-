import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { useState, useEffect } from 'react';
import { CollectionItem } from '../types';
import { Heart, Search, Filter } from 'lucide-react';

export default function Collection() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'collection'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CollectionItem)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Special', 'Dress', 'Accessory'];
  const filteredItems = category === 'All' ? items : items.filter(item => item.category === category);

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
            Our Collection
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-ink"
          >
            The High-End Gallery
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink/60 font-light max-w-2xl mx-auto leading-relaxed"
          >
            폼폼윙클의 우아하고 사랑스러운 디자인들을 만나보세요.
          </motion.p>
        </div>
      </section>

      {/* Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-pastel-purple/10 pb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  category === cat 
                    ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/20' 
                    : 'text-ink/50 hover:text-pastel-purple hover:bg-pastel-purple/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
            <input 
              type="text" 
              placeholder="Search designs..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-pastel-purple/20 bg-white/50 text-sm focus:outline-none focus:border-pastel-purple"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-12">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-pastel-purple/5 rounded-2xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-pastel-purple/5 rounded w-1/4 animate-pulse" />
                    <div className="h-6 bg-pastel-purple/5 rounded w-3/4 animate-pulse" />
                  </div>
                </div>
              ))
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
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
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-6 py-2 rounded-full bg-white text-ink text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        상세보기
                      </button>
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
              <div className="col-span-full text-center py-24 space-y-4">
                <Filter className="w-12 h-12 text-pastel-purple/30 mx-auto" />
                <p className="text-ink/50 font-light">해당 카테고리에 등록된 상품이 없습니다.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
