import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot, query, orderBy } from '../firebase';
import { useState, useEffect } from 'react';
import { Post } from '../types';
import ReactMarkdown from 'react-markdown';
import { Calendar, User, ChevronRight, MessageSquare, Bell } from 'lucide-react';

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<'All' | 'Blog' | 'Notice'>('All');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredPosts = category === 'All' ? posts : posts.filter(p => p.category === category);

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
            Community & Blog
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold text-ink"
          >
            Stories of Winkle
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink/60 font-light max-w-2xl mx-auto leading-relaxed"
          >
            반려동물 패션 팁과 폼폼윙클의 새로운 소식을 전해드립니다.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-widest">Categories</h3>
              <div className="flex flex-col space-y-2">
                {(['All', 'Blog', 'Notice'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setSelectedPost(null); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      category === cat 
                        ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/20' 
                        : 'text-ink/50 hover:text-pastel-purple hover:bg-pastel-purple/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {cat === 'Notice' ? <Bell className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                      <span>{cat}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-pastel-purple-light/30 rounded-3xl border border-pastel-purple/20 space-y-4">
              <h4 className="font-serif font-bold text-ink">Join our Community</h4>
              <p className="text-xs text-ink/60 leading-relaxed">
                당신의 소중한 반려동물과 함께한 폼폼윙클의 순간을 공유해 주세요. 
                베스트 리뷰어에게는 특별한 혜택을 드립니다.
              </p>
              <button className="w-full py-2 rounded-full bg-white text-pastel-purple text-xs font-bold border border-pastel-purple/20 hover:bg-pastel-purple hover:text-white transition-all">
                리뷰 작성하기
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {selectedPost ? (
                <motion.div
                  key="post-detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="text-sm font-bold text-pastel-purple hover:underline flex items-center space-x-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    <span>목록으로 돌아가기</span>
                  </button>

                  <div className="space-y-6">
                    {selectedPost.imageUrl && (
                      <img 
                        src={selectedPost.imageUrl} 
                        alt={selectedPost.title} 
                        className="w-full h-[400px] object-cover rounded-3xl shadow-xl"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-xs text-ink/40 font-bold uppercase tracking-widest">
                        <span className="px-2 py-1 bg-pastel-purple/10 text-pastel-purple rounded">{selectedPost.category}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{selectedPost.author || 'Admin'}</span>
                        </div>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink">{selectedPost.title}</h2>
                    </div>
                    <div className="markdown-body border-t border-pastel-purple/10 pt-8">
                      <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="post-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {loading ? (
                    [1, 2, 4].map((i) => (
                      <div key={i} className="space-y-4">
                        <div className="aspect-video bg-pastel-purple/5 rounded-2xl animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-6 bg-pastel-purple/5 rounded w-3/4 animate-pulse" />
                          <div className="h-4 bg-pastel-purple/5 rounded w-1/2 animate-pulse" />
                        </div>
                      </div>
                    ))
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post, idx) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedPost(post)}
                        className="group cursor-pointer space-y-4"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-2xl bg-pastel-purple-light shadow-sm group-hover:shadow-xl transition-all duration-500">
                          <img 
                            src={post.imageUrl || `https://picsum.photos/seed/post-${idx}/800/450`} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-pastel-purple text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 text-[10px] text-ink/40 font-bold uppercase tracking-widest">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-serif font-bold text-ink group-hover:text-pastel-purple transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-ink/50 font-light line-clamp-2 leading-relaxed">
                            {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-24 space-y-4">
                      <MessageSquare className="w-12 h-12 text-pastel-purple/30 mx-auto" />
                      <p className="text-ink/50 font-light">등록된 게시글이 없습니다.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
