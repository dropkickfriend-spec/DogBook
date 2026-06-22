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
    <div className="h-screen bg-[#f0f2f5] font-sans flex flex-col overflow-hidden text-[#050505]">
      {/* Top Navigation Bar */}
      <header className="h-[56px] bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 relative z-20 shadow-sm">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-2 w-[300px]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 bg-[#0866ff] rounded-full flex items-center justify-center text-white shrink-0">
               <span className="font-bold text-2xl font-serif ml-0.5">d</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0866ff] hidden lg:block">DogBook</h1>
          </div>
          <div className="relative hidden md:block w-60 xl:w-48">
            <input type="text" placeholder="Search DogBook" className="w-full bg-[#f0f2f5] border-none rounded-full py-2 px-6 pl-10 focus:outline-none focus:ring-2 focus:ring-[#0866ff] font-sans text-sm" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
        
        {/* Center: Navigation Tabs */}
        <div className="hidden sm:flex items-center justify-center flex-1 max-w-[600px] h-full gap-2">
           <button onClick={() => setActiveTab('feed')} className={`flex-1 h-full flex items-center justify-center relative hover:bg-gray-100 rounded-lg mx-1 transition-colors ${activeTab === 'feed' ? 'text-[#0866ff]' : 'text-gray-500'}`}>
              <Home className={`w-7 h-7 ${activeTab === 'feed' ? 'fill-current' : ''}`} />
              {activeTab === 'feed' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0866ff] rounded-t-md" />}
           </button>
           <button onClick={() => setActiveTab('lineage')} className={`flex-1 h-full flex items-center justify-center relative hover:bg-gray-100 rounded-lg mx-1 transition-colors ${activeTab === 'lineage' ? 'text-[#0866ff]' : 'text-gray-500'}`}>
              <Network className={`w-7 h-7 ${activeTab === 'lineage' ? 'fill-current' : ''}`} />
              {activeTab === 'lineage' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0866ff] rounded-t-md" />}
           </button>
           <button onClick={() => viewProfile(CURRENT_USER.id)} className={`flex-1 h-full flex items-center justify-center relative hover:bg-gray-100 rounded-lg mx-1 transition-colors ${activeTab === 'profile' && viewingUserId === CURRENT_USER.id ? 'text-[#0866ff]' : 'text-gray-500'}`}>
              <User className={`w-7 h-7 ${activeTab === 'profile' && viewingUserId === CURRENT_USER.id ? 'fill-current' : ''}`} />
              {activeTab === 'profile' && viewingUserId === CURRENT_USER.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0866ff] rounded-t-md" />}
           </button>
           <button className="flex-1 h-full flex items-center justify-center relative hover:bg-gray-100 rounded-lg mx-1 transition-colors text-gray-500 hidden md:flex">
              <Bookmark className="w-7 h-7" />
           </button>
        </div>
        
        {/* Right: User actions */}
        <div className="flex items-center gap-2 w-[300px] justify-end">
          <button className="w-10 h-10 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </button>
          <div onClick={() => viewProfile(CURRENT_USER.id)} className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0 cursor-pointer border border-gray-200 hover:opacity-80 transition-opacity">
            <img src={CURRENT_USER.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden w-full">
        {/* Left Sidebar: Navigation & Shortcuts */}
        <div className="hidden xl:flex w-[320px] lg:w-[360px] flex-col overflow-y-auto p-4 shrink-0 hover:overflow-y-scroll" style={{ scrollbarWidth: 'thin' }}>
          <NavItem icon={<div className="w-8 h-8 rounded-full overflow-hidden"><img src={CURRENT_USER.avatarUrl} className="w-full h-full object-cover"/></div>} label={CURRENT_USER.name} active={activeTab === 'profile' && viewingUserId === CURRENT_USER.id} onClick={() => viewProfile(CURRENT_USER.id)} />
          <NavItem icon={<Search className="w-7 h-7 text-[#050505]" />} label="Explore" />
          <NavItem icon={<Network className="w-7 h-7 text-[#0866ff]" />} label="Evolution & Lineage" active={activeTab === 'lineage'} onClick={() => setActiveTab('lineage')} />
          <NavItem icon={<Bell className="w-7 h-7 text-[#050505]" />} label="Playgroups" />
          <NavItem icon={<Mail className="w-7 h-7 text-[#050505]" />} label="Vet Finder" />
          <NavItem icon={<Bookmark className="w-7 h-7 text-[#050505]" />} label="Barketplace" />
          <div className="border-b border-gray-300 w-full my-3" />
          <h3 className="text-gray-500 font-semibold px-2 mb-2 text-lg">Your Shortcuts</h3>
          <div className="px-2 py-2 hover:bg-gray-200 rounded-lg cursor-pointer flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-orange-400"></div>
             <span className="font-semibold text-[15px]">Golden Retriever Owners</span>
          </div>
        </div>

        {/* Central Content */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto scrollbar-hide py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="w-full max-w-[680px] px-2 md:px-0">
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
            <div className="w-full">
            <PersonalityProfile 
              currentUser={CURRENT_USER}
              targetUser={viewingUserId === CURRENT_USER.id ? CURRENT_USER : USERS[viewingUserId]}
              users={USERS}
              lineageMap={lineageMap}
            />
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {/* New Post Box */}
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex flex-col shrink-0">
                <div className="flex items-center gap-2 mb-3">
                   <img src={CURRENT_USER.avatarUrl} className="w-10 h-10 rounded-full object-cover shrink-0" alt="Avatar"/>
                   <input
                      type="text"
                      placeholder={`What's on your mind, ${CURRENT_USER.name}?`}
                      className="flex-1 bg-[#f0f2f5] hover:bg-[#e4e6e9] rounded-full py-2.5 px-4 outline-none text-[15px] text-[#050505] placeholder:text-gray-500 transition-colors"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                   />
                </div>
                <div className="border-t border-gray-200 mt-1 pt-3 flex items-center justify-between px-2">
                   <label className="flex flex-1 items-center justify-center gap-2 hover:bg-[#f0f2f5] p-2 rounded-lg cursor-pointer transition-colors text-gray-500 font-semibold text-[15px]">
                     <Video className="w-6 h-6 text-[#f3425f]" />
                     <span className="hidden sm:block">Live video</span>
                   </label>
                   <label className="flex flex-1 items-center justify-center gap-2 hover:bg-[#f0f2f5] p-2 rounded-lg cursor-pointer transition-colors text-gray-500 font-semibold text-[15px]">
                     <ImageIcon className="w-6 h-6 text-[#45bd62]" />
                     <span className="hidden sm:block">Photo/video</span>
                     <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                   </label>
                   <label className="flex flex-1 items-center justify-center gap-2 hover:bg-[#f0f2f5] p-2 rounded-lg cursor-pointer transition-colors text-gray-500 font-semibold text-[15px]">
                     <Smile className="w-6 h-6 text-[#f7b928]" />
                     <span className="hidden sm:block">Feeling/activity</span>
                   </label>
                </div>
                
                {attachedImage && (
                  <div className="relative mt-3 rounded-lg overflow-hidden max-h-64 border border-gray-200 mx-2">
                    <img src={attachedImage} alt="Upload preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setAttachedImage(null)}
                      className="absolute top-2 right-2 bg-gray-900/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-900"
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {(newPostContent.trim() || attachedImage) && (
                  <button 
                    onClick={handleCreatePost}
                    className="mt-3 w-full bg-[#0866ff] disabled:opacity-50 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Post
                  </button>
                )}
              </div>

          {/* Feed Cards container container */}
          <div className="flex flex-col gap-4 w-full">
            {posts.map((post) => {
              const postUser = USERS[post.userId] || CURRENT_USER;
              const isLiked = likedPosts.has(post.id);
              const isExpanded = expandedComments.has(post.id);
              const isAnimating = animatingLikes.has(post.id);
              
              return (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col shrink-0 overflow-hidden text-[#050505]">
                  <div className="p-3 sm:p-4 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                       <img onClick={() => viewProfile(postUser.id)} src={postUser.avatarUrl} alt={postUser.name} className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer border border-gray-200 hover:opacity-80 transition-opacity" />
                       <div className="flex flex-col">
                           <span onClick={() => viewProfile(postUser.id)} className="font-semibold text-[15px] hover:underline cursor-pointer leading-tight">{postUser.name}</span>
                           <span className="text-[13px] text-gray-500">{post.createdAt}</span>
                       </div>
                    </div>
                    
                    <p className="text-[15px] leading-normal mb-2 whitespace-pre-wrap">{post.caption}</p>
                  </div>

                  {post.imageUrl && (
                    <div className="w-full bg-gray-100 flex items-center justify-center max-h-[500px] overflow-hidden border-y border-gray-200">
                      <img src={post.imageUrl} className="w-full object-cover" alt="Post" />
                    </div>
                  )}
                  
                  <div className="px-4 py-2">
                    {(post.likes > 0 || isLiked) && (
                      <div className="flex items-center gap-2 text-gray-500 text-[15px] border-b border-gray-200 pb-2 mb-1">
                         <div className="w-4 h-4 rounded-full bg-[#0866ff] flex items-center justify-center">
                           <Heart className="w-2.5 h-2.5 text-white fill-white" />
                         </div>
                         <span>{post.likes + (isLiked ? 1 : 0)}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-1 py-1">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex flex-1 items-center justify-center gap-2 py-1.5 rounded-lg font-semibold text-[15px] hover:bg-gray-100 transition-colors ${
                          isLiked ? 'text-[#0866ff]' : 'text-gray-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''} ${isAnimating ? 'animate-bounce' : ''}`} />
                        Like
                      </button>
                      
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex flex-1 items-center justify-center gap-2 py-1.5 rounded-lg text-gray-500 font-semibold text-[15px] hover:bg-gray-100 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Comment
                      </button>
                      
                      <button className="flex flex-1 items-center justify-center gap-2 py-1.5 rounded-lg text-gray-500 font-semibold text-[15px] hover:bg-gray-100 transition-colors">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                    
                    {isExpanded && (
                      <div className="pt-2 border-t border-gray-200 mt-1 flex flex-col gap-3">
                        <div className="flex gap-2 items-center">
                          <img src={CURRENT_USER.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              className="w-full bg-[#f0f2f5] text-[15px] rounded-full py-2 px-4 outline-none text-[#050505] placeholder:text-gray-500"
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => handleCommentChange(post.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {post.comments.map(comment => {
                            const commentUser = USERS[comment.userId] || CURRENT_USER;
                            return (
                                <div key={comment.id} className="flex gap-2">
                                  <img onClick={() => viewProfile(commentUser.id)} src={commentUser.avatarUrl} alt={commentUser.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 cursor-pointer hover:opacity-80 mt-1" />
                                  <div className="flex flex-col">
                                    <div className="bg-[#f0f2f5] rounded-2xl px-3 py-2 w-fit">
                                      <span onClick={() => viewProfile(commentUser.id)} className="font-semibold text-[13px] text-[#050505] hover:underline cursor-pointer block leading-tight">{commentUser.name}</span>
                                      <span className="text-[15px] text-[#050505] block leading-tight">{comment.content}</span>
                                    </div>
                                    <span className="text-[12px] text-gray-500 px-2 mt-0.5 font-semibold cursor-pointer hover:underline">Like · Reply · {comment.createdAt}</span>
                                  </div>
                                </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
            </div>
          )}
          </div>
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
