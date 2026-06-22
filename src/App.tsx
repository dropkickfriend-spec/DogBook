import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Home, Search, Bell, Mail, User, Bookmark, Settings, Image as ImageIcon, Video, Smile, Network } from 'lucide-react';
import { INITIAL_POSTS, USERS, CURRENT_USER, TRENDING_TAGS, INITIAL_LINEAGE, INITIAL_REQUESTS } from './data';
import type { Post } from './types';
import { EvolutionTree } from './components/EvolutionTree';
import { PersonalityProfile } from './components/PersonalityProfile';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'lineage' | 'profile'>('feed');
  const [viewingUserId, setViewingUserId] = useState<string>(CURRENT_USER.id);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newPostContent, setNewPostContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [lineageMap, setLineageMap] = useState(INITIAL_LINEAGE);
  const [lineageRequests, setLineageRequests] = useState(INITIAL_REQUESTS);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [animatingLikes, setAnimatingLikes] = useState<Set<string>>(new Set());

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const submitComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    const newComment = {
      id: `c_${Date.now()}`,
      userId: CURRENT_USER.id,
      content: text,
      createdAt: 'Just now'
    };

    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const viewProfile = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    setAnimatingLikes(prev => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });

    setTimeout(() => {
      setAnimatingLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }, 500);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && !attachedImage) return;
    
    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: CURRENT_USER.id,
      imageUrl: attachedImage || '', 
      caption: newPostContent,
      likes: 0,
      comments: [],
      createdAt: 'Just now',
    };
    
    // Add current user to users dict temporarily for rendering
    USERS[CURRENT_USER.id] = CURRENT_USER;
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setAttachedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedImage(url);
    }
  };

  const tagColors = [
    "bg-orange-50 text-orange-600",
    "bg-teal-50 text-teal-600",
    "bg-amber-100 text-amber-700",
    "bg-purple-50 text-purple-600",
    "bg-blue-50 text-blue-600"
  ];

  const handleConfirmRequest = (reqId: string) => {
    setLineageRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleRejectRequest = (reqId: string) => {
    setLineageRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleSendRequest = (toId: string, type: 'sire'|'dam'|'offspring') => {
    alert("Breeding proposal sent successfully! Waiting for confirmation.");
  };

  return (
    <div className="h-screen bg-amber-50 font-sans flex flex-col overflow-hidden text-slate-800">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white border-b-4 border-amber-200 px-4 sm:px-8 flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,4.5C10.5,4.5 9.2,5.2 8.4,6.2C7,5.5 5.2,5.8 4.2,7C3,8.4 3.4,10.5 4.8,11.5C4.2,12.7 4.2,14 4.8,15.2C5.5,16.5 7,17 8.2,16.5C9.2,18 10.5,18.8 12,18.8C13.5,18.8 14.8,18 15.8,16.5C17,17 18.5,16.5 19.2,15.2C19.8,14 19.8,12.7 19.2,11.5C20.6,10.5 21,8.4 19.8,7C18.8,5.8 17,5.5 15.6,6.2C14.8,5.2 13.5,4.5 12,4.5Z" />
              <path d="M7.5,12A1.5,1.5 0 1,1 7.5,9A1.5,1.5 0 1,1 7.5,12ZM16.5,12A1.5,1.5 0 1,1 16.5,9A1.5,1.5 0 1,1 16.5,12ZM10.5,14A1.5,1.5 0 1,1 10.5,11A1.5,1.5 0 1,1 10.5,14ZM13.5,14A1.5,1.5 0 1,1 13.5,11A1.5,1.5 0 1,1 13.5,14Z" fill="white" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-orange-600 hidden sm:block">Pawfolio</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative">
            <input type="text" placeholder="Search for fluffy friends..." className="w-full bg-slate-100 border-2 border-slate-200 rounded-full py-2 sm:py-3 px-6 focus:outline-none focus:border-orange-400 font-sans" />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="p-2 sm:p-3 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div onClick={() => viewProfile(CURRENT_USER.id)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-orange-400 overflow-hidden shadow-md shrink-0 cursor-pointer">
            <img src={CURRENT_USER.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-6 p-4 sm:p-6 overflow-hidden max-w-[1440px] mx-auto w-full">
        {/* Left Sidebar: Navigation */}
        <nav className="hidden sm:flex w-20 xl:w-64 flex-col gap-2 shrink-0 overflow-y-auto pb-6">
          <NavItem icon={<Home className="w-6 h-6" />} label="Home" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
          <NavItem icon={<Search className="w-6 h-6" />} label="Explore" />
          <NavItem icon={<Network className="w-6 h-6" />} label="Lineage & Breeding" active={activeTab === 'lineage'} onClick={() => setActiveTab('lineage')} />
          <NavItem icon={<User className="w-6 h-6" />} label="Profile & Traits" active={activeTab === 'profile' && viewingUserId === CURRENT_USER.id} onClick={() => viewProfile(CURRENT_USER.id)} />
          <NavItem icon={<Bell className="w-6 h-6" />} label="Playgroups" />
          <NavItem icon={<Mail className="w-6 h-6" />} label="Vet Finder" />
          <NavItem icon={<Bookmark className="w-6 h-6" />} label="Barketplace" />
          
          <div className="hidden xl:block mt-auto p-6 bg-teal-500 rounded-3xl text-white shadow-xl relative overflow-hidden shrink-0">
            <p className="relative z-10 font-bold text-lg">Go Premium!</p>
            <p className="relative z-10 text-xs opacity-90 mb-3 mt-1">Unlimited treat coupons and no ads.</p>
            <button className="relative z-10 bg-white text-teal-600 font-black px-4 py-2 rounded-full text-sm hover:bg-teal-50 transition-colors">UPGRADE</button>
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 rotate-12 select-none">🦴</div>
          </div>
        </nav>

        {/* Central Feed */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-24 sm:pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {activeTab === 'lineage' ? (
            <EvolutionTree 
              currentUser={CURRENT_USER}
              users={USERS}
              lineageMap={lineageMap}
              requests={lineageRequests}
              onConfirm={handleConfirmRequest}
              onReject={handleRejectRequest}
              onSendRequest={handleSendRequest}
            />
          ) : activeTab === 'profile' ? (
            <PersonalityProfile 
              currentUser={CURRENT_USER}
              targetUser={viewingUserId === CURRENT_USER.id ? CURRENT_USER : USERS[viewingUserId]}
              users={USERS}
              lineageMap={lineageMap}
            />
          ) : (
            <>
              {/* New Post Box */}
              <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-md border-b-4 border-slate-100 flex flex-col shrink-0 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="hidden sm:flex w-12 h-12 bg-amber-200 rounded-2xl items-center justify-center text-slate-600 shrink-0 cursor-pointer hover:bg-amber-300 transition-colors">
                    <ImageIcon className="w-6 h-6" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      placeholder="What's your pet up to today?"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-2xl py-3 px-4 outline-none font-medium text-slate-700 placeholder:text-slate-400 transition-all font-sans"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                    />
                  </div>
                  
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() && !attachedImage}
                    className="w-full sm:w-auto bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg hover:bg-orange-600 transition-colors shrink-0"
                  >
                    POST
                  </button>
                </div>
                
                {attachedImage && (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 w-fit max-w-full">
                    <img src={attachedImage} alt="Attached preview" className="max-h-64 object-cover" />
                    <button onClick={() => setAttachedImage(null)} className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full hover:bg-white text-slate-600 transition-colors">
                      <span className="sr-only">Remove image</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                )}
              </div>

          {/* Feed Cards container container */}
          <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            {posts.map((post, i) => {
              const postUser = USERS[post.userId] || CURRENT_USER;
              const isLiked = likedPosts.has(post.id);
              const cardBorder = i % 2 === 0 ? 'border-amber-200' : 'border-teal-100';
              
              return (
                <article key={post.id} className={`bg-white rounded-[40px] overflow-hidden shadow-lg border-b-8 ${cardBorder} flex flex-col shrink-0`}>
                  {post.imageUrl && (
                    <div className="h-48 sm:h-64 overflow-hidden relative bg-slate-100">
                      <img src={post.imageUrl} className="w-full h-full object-cover" alt="Post" />
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                       <img onClick={() => viewProfile(postUser.id)} src={postUser.avatarUrl} alt={postUser.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border-2 border-slate-100 cursor-pointer" />
                       <div>
                         <div className="flex items-center gap-2">
                           <span onClick={() => viewProfile(postUser.id)} className="font-black text-lg sm:text-xl text-slate-800 hover:underline cursor-pointer">{postUser.name}</span>
                         </div>
                         <p className="text-xs text-slate-400 font-medium">{postUser.handle} • {post.createdAt}</p>
                       </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap font-medium">{post.caption}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl transition-colors ${
                          expandedComments.has(post.id) ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-bold text-xs sm:text-sm">{post.comments.length} <span className="hidden sm:inline">comments</span></span>
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl transition-colors ${
                            isLiked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-red-500'
                          } ${animatingLikes.has(post.id) ? 'animate-heartbeat' : ''}`}
                        >
                          <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isLiked ? 'fill-current' : ''}`} />
                          <span className="font-bold text-xs sm:text-sm">{post.likes + (isLiked ? 1 : 0)} <span className="hidden sm:inline">loves</span></span>
                        </button>
                        
                        <button className="hidden sm:flex px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                          <Share2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    
                    {expandedComments.has(post.id) && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-4">
                        {post.comments.length > 0 ? (
                          <div className="flex flex-col gap-3">
                            {post.comments.map(comment => {
                              const commentUser = USERS[comment.userId] || CURRENT_USER;
                              return (
                                <div key={comment.id} className="flex gap-3 bg-slate-50/50 p-3 rounded-2xl">
                                  <img onClick={() => viewProfile(commentUser.id)} src={commentUser.avatarUrl} alt={commentUser.name} className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-200 cursor-pointer" />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span onClick={() => viewProfile(commentUser.id)} className="font-bold text-sm text-slate-800 hover:underline cursor-pointer">{commentUser.name}</span>
                                      <span className="text-[10px] text-slate-400 font-medium">{comment.createdAt}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium mt-0.5">{comment.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 font-medium text-center py-2">No comments yet. Be the first!</p>
                        )}
                        
                        <div className="flex gap-3 items-center mt-2">
                          <img src={CURRENT_USER.avatarUrl} alt="You" className="w-8 h-8 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => handleCommentChange(post.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-200 focus:bg-white rounded-xl py-2 px-4 outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all pr-12"
                            />
                            <button 
                              onClick={() => submitComment(post.id)}
                              disabled={!(commentInputs[post.id]?.trim())}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-sm disabled:opacity-50"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
            </>
          )}
        </div>

        {/* Right Sidebar: Community */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-6 overflow-y-auto pb-6">
          <div className="bg-white rounded-[32px] p-6 shadow-md border-b-4 border-amber-200 shrink-0">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-slate-800">
              <span className="text-2xl">🔥</span> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TAGS.map((tag, i) => (
                <span key={i} className={`${tagColors[i % tagColors.length]} px-3 py-1.5 rounded-2xl text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity`}>
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-md border-b-4 border-slate-100 flex flex-col shrink-0">
            <h3 className="font-black text-lg mb-4 text-slate-800">Suggested Fur-ends</h3>
            <div className="space-y-4">
              {Object.values(USERS).slice(0, 3).map((user, i) => {
                const bgColors = ["bg-orange-100", "bg-teal-100", "bg-amber-100"];
                return (
                  <div key={user.id} className="flex items-center gap-3 group">
                    <div onClick={() => viewProfile(user.id)} className={`w-10 h-10 rounded-xl ${bgColors[i % 3]} overflow-hidden shrink-0 cursor-pointer`}>
                      <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.name} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p onClick={() => viewProfile(user.id)} className="font-bold text-sm text-slate-800 truncate group-hover:underline transition-colors cursor-pointer">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.handle}</p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-black shrink-0 transition-colors flex items-center justify-center">
                      +
                    </button>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl text-xs hover:border-orange-200 hover:text-orange-500 transition-colors">
              VIEW ALL DISCOVERIES
            </button>
          </div>
        </aside>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t-4 border-amber-200 flex items-center justify-around p-3 z-50">
        <button className={`p-2 rounded-xl transition-colors ${activeTab === 'feed' ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:bg-slate-50'}`} onClick={() => setActiveTab('feed')}>
          <Home className="w-6 h-6" />
        </button>
        <button className={`p-2 rounded-xl transition-colors ${activeTab === 'lineage' ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:bg-slate-50'}`} onClick={() => setActiveTab('lineage')}>
          <Network className="w-6 h-6" />
        </button>
        <label className="text-white bg-orange-500 rounded-2xl shadow-lg -mt-8 w-14 h-14 flex items-center justify-center border-4 border-amber-50 cursor-pointer hover:bg-orange-600 transition-colors">
          <ImageIcon className="w-6 h-6" />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { setActiveTab('feed'); handleImageUpload(e); }} />
        </label>
        <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50"><Bell className="w-6 h-6" /></button>
        <button className={`p-2 rounded-xl transition-colors ${activeTab === 'profile' && viewingUserId === CURRENT_USER.id ? 'text-orange-500 bg-orange-50' : 'text-slate-400 hover:bg-slate-50'}`} onClick={() => viewProfile(CURRENT_USER.id)}>
          <User className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 xl:px-4 xl:py-4 p-3 rounded-3xl cursor-pointer transition-all ${
      active 
        ? 'bg-orange-500 text-white font-bold shadow-lg' 
        : 'text-slate-600 hover:bg-white font-bold'
    }`}>
      <div className="flex items-center justify-center shrink-0 w-6 h-6">
        {icon}
      </div>
      <span className="hidden xl:block text-base">{label}</span>
    </div>
  );
}
