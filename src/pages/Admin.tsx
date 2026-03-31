import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { SiteSettings, CollectionItem, Post, CustomOrder } from '../types';
import { toast } from 'sonner';
import { Settings, Image as ImageIcon, FileText, ShoppingBag, Plus, Trash2, Edit2, Save, X, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'settings' | 'collection' | 'posts' | 'orders'>('settings');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'site')
        .single();
      if (settingsData) setSettings(settingsData as SiteSettings);

      // Fetch Collection
      const { data: collectionData } = await supabase
        .from('collection')
        .select('*')
        .order('order', { ascending: true });
      if (collectionData) setCollectionItems(collectionData as CollectionItem[]);

      // Fetch Posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (postsData) setPosts(postsData as Post[]);

      // Fetch Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (ordersData) setOrders(ordersData as CustomOrder[]);

      setLoading(false);
    };

    fetchData();

    // Set up real-time subscriptions
    const settingsSub = supabase.channel('admin_settings').on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchData).subscribe();
    const collectionSub = supabase.channel('admin_collection').on('postgres_changes', { event: '*', schema: 'public', table: 'collection' }, fetchData).subscribe();
    const postsSub = supabase.channel('admin_posts').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchData).subscribe();
    const ordersSub = supabase.channel('admin_orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData).subscribe();

    return () => {
      settingsSub.unsubscribe();
      collectionSub.unsubscribe();
      postsSub.unsubscribe();
      ordersSub.unsubscribe();
    };
  }, []);

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSettings = {
      brandName: formData.get('brandName') as string,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      aboutText: formData.get('aboutText') as string,
      contactEmail: formData.get('contactEmail') as string,
      instagramUrl: formData.get('instagramUrl') as string,
      kakaoUrl: formData.get('kakaoUrl') as string,
    };

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'site', ...newSettings });
      if (error) throw error;
      toast.success('Site settings updated successfully');
    } catch (error: any) {
      console.error('Settings error:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleAddCollectionItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as any,
      order: Number(formData.get('order')),
    };

    try {
      const { error } = await supabase.from('collection').insert(newItem);
      if (error) throw error;
      toast.success('Item added to collection');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Collection error:', error);
      toast.error('Failed to add item');
    }
  };

  const handleDeleteItem = async (id: string, table: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Item deleted');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete item: ${error.message || 'Unknown error'}`);
    }
  };

  const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPost = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as any,
      imageUrl: formData.get('imageUrl') as string,
      author: 'Admin',
    };

    try {
      const { error } = await supabase.from('posts').insert(newPost);
      if (error) throw error;
      toast.success('Post published');
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error('Post error:', error);
      toast.error('Failed to publish post');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      toast.success('Order status updated');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(`Failed to update order status: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) return <div className="p-24 text-center">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="md:w-64 space-y-4">
          <h2 className="text-2xl font-serif font-bold text-ink mb-8">Admin Dashboard</h2>
          <nav className="space-y-2">
            {[
              { id: 'settings', name: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
              { id: 'collection', name: 'Collection', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'posts', name: 'Posts/Blog', icon: <FileText className="w-4 h-4" /> },
              { id: 'orders', name: 'Custom Orders', icon: <ShoppingBag className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-pastel-purple text-white shadow-lg shadow-pastel-purple/20' 
                    : 'text-ink/50 hover:text-pastel-purple hover:bg-pastel-purple/5'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-white rounded-3xl p-8 shadow-xl shadow-pastel-purple/5 border border-pastel-purple/10">
          <AnimatePresence mode="wait">
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <h3 className="text-xl font-serif font-bold text-ink">General Settings</h3>
                <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">Brand Name</label>
                    <input name="brandName" defaultValue={settings?.brandName} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">Hero Title</label>
                    <input name="heroTitle" defaultValue={settings?.heroTitle} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">Hero Subtitle</label>
                    <input name="heroSubtitle" defaultValue={settings?.heroSubtitle} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">About Text</label>
                    <textarea name="aboutText" defaultValue={settings?.aboutText} rows={5} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">Contact Email</label>
                    <input name="contactEmail" defaultValue={settings?.contactEmail} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">Instagram URL</label>
                    <input name="instagramUrl" defaultValue={settings?.instagramUrl} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink/60 uppercase tracking-widest">KakaoTalk URL</label>
                    <input name="kakaoUrl" defaultValue={settings?.kakaoUrl} className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 focus:outline-none focus:border-pastel-purple" />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" className="px-8 py-3 rounded-full bg-pastel-purple text-white font-bold hover:bg-pastel-purple/90 transition-all flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'collection' && (
              <motion.div
                key="collection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-ink">Add New Item</h3>
                  <form onSubmit={handleAddCollectionItem} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pastel-purple-light/20 p-6 rounded-2xl">
                    <input name="name" placeholder="Item Name" required className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white" />
                    <input name="imageUrl" placeholder="Image URL" required className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white" />
                    <input name="price" type="number" placeholder="Price (₩)" className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white" />
                    <select name="category" className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white">
                      <option value="Dress">Dress</option>
                      <option value="Accessory">Accessory</option>
                      <option value="Special">Special</option>
                    </select>
                    <input name="order" type="number" placeholder="Display Order" defaultValue={0} className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white" />
                    <textarea name="description" placeholder="Description" className="md:col-span-2 px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white resize-none" />
                    <button type="submit" className="md:col-span-2 py-3 rounded-full bg-pastel-purple text-white font-bold hover:bg-pastel-purple/90 transition-all flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-ink">Current Collection</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {collectionItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-pastel-purple/10 rounded-2xl group">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-xs text-ink/50">{item.category} • ₩{item.price?.toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleDeleteItem(item.id, 'collection')} className="p-2 text-red-400 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-ink">Create New Post</h3>
                  <form onSubmit={handleAddPost} className="space-y-4 bg-pastel-purple-light/20 p-6 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="title" placeholder="Post Title" required className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white" />
                      <select name="category" className="px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white">
                        <option value="Blog">Blog</option>
                        <option value="Notice">Notice</option>
                      </select>
                    </div>
                    <input name="imageUrl" placeholder="Featured Image URL" className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white" />
                    <textarea name="content" placeholder="Content (Markdown supported)" rows={10} required className="w-full px-4 py-2 rounded-xl border border-pastel-purple/20 bg-white resize-none" />
                    <button type="submit" className="w-full py-3 rounded-full bg-pastel-purple text-white font-bold hover:bg-pastel-purple/90 transition-all flex items-center justify-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Publish Post</span>
                    </button>
                  </form>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-bold text-ink">Manage Posts</h3>
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="flex items-center justify-between p-4 border border-pastel-purple/10 rounded-2xl group">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-pastel-purple/10 rounded-lg flex items-center justify-center text-pastel-purple">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">{post.title}</h4>
                            <p className="text-xs text-ink/50">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteItem(post.id, 'posts')} className="p-2 text-red-400 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <h3 className="text-xl font-serif font-bold text-ink">Custom Order Requests</h3>
                <div className="space-y-6">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <div key={order.id} className="p-6 border border-pastel-purple/10 rounded-3xl space-y-4 bg-ivory/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-lg">{order.customerName}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                                order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                                order.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                                'bg-orange-100 text-orange-600'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-ink/50">{order.customerEmail} • {new Date(order.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select 
                              value={order.status} 
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="text-xs px-3 py-1.5 rounded-full border border-pastel-purple/20 bg-white focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Consulting">Consulting</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                            <button onClick={() => handleDeleteItem(order.id, 'orders')} className="p-2 text-red-400 hover:bg-red-50 rounded-full">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-pastel-purple/5">
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Pet Info</p>
                            <p className="text-sm font-medium">{order.petName}</p>
                            <p className="text-xs text-ink/60 whitespace-pre-line">{order.dimensions}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Special Request</p>
                            <p className="text-xs text-ink/60 leading-relaxed">{order.request || 'No special requests.'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24 text-ink/30 italic">No orders received yet.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
