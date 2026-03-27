import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Heart, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import { CommunityPost, Project } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import apiClient from '../lib/apiClient';
import { connectSocket } from '../lib/socket';

interface CommunityProps {
  projects: Project[];
}

export const Community: React.FC<CommunityProps> = ({ projects }) => {
  const { user } = useAuth();
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const topContributors = useMemo(() => {
    const counts = new Map<string, { name: string; posts: number }>();
    posts.forEach((post) => {
      const name = post.authorName || 'Anonymous User';
      const current = counts.get(name) || { name, posts: 0 };
      current.posts += 1;
      counts.set(name, current);
    });
    return Array.from(counts.values())
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 4)
      .map((entry) => ({
        name: entry.name,
        reports: entry.posts,
        points: entry.posts * 100,
      }));
  }, [posts]);

  useEffect(() => {
    apiClient.getCommunityPosts()
      .then((res) => setPosts(res.data || []))
      .catch((err) => console.error('Failed to load community posts', err));
  }, []);

  useEffect(() => {
    const socket = connectSocket();
    const handleCreated = (post: CommunityPost) => {
      setPosts((prev) => [post, ...prev.filter((p) => p.id !== post.id)]);
    };
    const handleUpdated = (post: CommunityPost) => {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    };

    socket.on('community:postCreated', handleCreated);
    socket.on('community:postLiked', handleUpdated);
    socket.on('community:commentAdded', handleUpdated);

    return () => {
      socket.off('community:postCreated', handleCreated);
      socket.off('community:postLiked', handleUpdated);
      socket.off('community:commentAdded', handleUpdated);
    };
  }, []);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = (formData.get('content') as string) || '';
    const location = (formData.get('location') as string) || 'Local Area';
    formData.set('content', content);
    formData.set('location', location);
    if (user?.fullName) {
      formData.set('authorName', user.fullName);
    }

    const imageFile = formData.get('image') as File;
    if (!imageFile || imageFile.size === 0) {
      formData.delete('image');
    } else if (imageFile.type.startsWith('video/')) {
      const duration = await new Promise<number>((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          resolve(video.duration || 0);
          URL.revokeObjectURL(video.src);
        };
        video.onerror = () => resolve(0);
        video.src = URL.createObjectURL(imageFile);
      });
      if (duration > 10.5) {
        alert('Please upload a video of 10 seconds or less.');
        return;
      }
    }

    try {
      const res = await apiClient.createCommunityPost(formData);
      if (res.data) {
        setPosts((prev) => [res.data as CommunityPost, ...prev]);
      }
      setShowPostModal(false);
      e.currentTarget.reset();
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  const toggleLike = async (postId: string) => {
    try {
      const res = await apiClient.likeCommunityPost(postId);
      if (res.data) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? (res.data as CommunityPost) : p)));
      }
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const submitComment = async (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    try {
      const res = await apiClient.commentCommunityPost(postId, text);
      if (res.data) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? (res.data as CommunityPost) : p)));
      }
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to comment', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-gov-blue mb-2 tracking-tight">Citizen Community Feed</h2>
          <p className="text-gov-blue/50 font-medium">Collaborative oversight and ground-level reporting by verified citizens.</p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="gov-button-primary flex items-center gap-2 text-xs">
          <Camera className="w-4 h-4" />
          Post Ground Update
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Community Feed */}
          {posts.map((post, idx) => (
            <motion.div 
              key={post.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="gov-card overflow-hidden bg-white"
            >
              <div className="p-6 flex items-center justify-between border-b border-gov-blue/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gov-blue/5 border border-gov-blue/10 flex items-center justify-center font-bold text-gov-blue">
                    {post.authorName?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gov-blue">{post.authorName || user?.fullName || 'Anonymous Citizen'}</p>
                    <p className="text-[10px] text-gov-blue/40 font-bold flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3" />
                      {post.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gov-green/10 border border-gov-green/20 text-[10px] font-bold text-gov-green uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Reporter
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gov-blue/70 leading-relaxed mb-6 font-medium">
                  {post.content}
                </p>
                {post.videoUrl ? (
                  <div className="aspect-video max-w-[720px] mx-auto rounded-2xl bg-gov-bg overflow-hidden mb-6 relative group border border-gov-blue/5">
                    <video
                      src={post.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : post.imageUrl && (
                  <div className="aspect-video max-w-[720px] mx-auto rounded-2xl bg-gov-bg overflow-hidden mb-6 relative group border border-gov-blue/5">
                    <img 
                      src={post.imageUrl} 
                      alt="Ground Report" 
                      className="w-full h-full object-contain bg-gov-bg opacity-95"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gov-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-xs font-bold text-white tracking-widest uppercase">Geo-tagged: community report</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <button onClick={() => toggleLike(post.id)} className={cn(
                      "flex items-center gap-2 transition-colors",
                      post.likedBy?.includes(user?.identificationId || '') ? "text-gov-saffron" : "text-gov-blue/40 hover:text-gov-saffron"
                    )}>
                      <Heart className={cn("w-5 h-5", post.likedBy?.includes(user?.identificationId || '') && "fill-gov-saffron")} />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gov-blue/40 hover:text-gov-blue transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs font-bold">{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gov-blue/40 hover:text-gov-blue transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < 4 ? "text-gov-saffron fill-gov-saffron" : "text-gov-blue/10")} />
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {post.comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="text-xs text-gov-blue/70">
                      <span className="font-bold text-gov-blue">{comment.authorName || user?.fullName || 'User'}: </span>
                      {comment.text}
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a comment..."
                      className="gov-input text-xs py-2"
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      className="px-4 py-2 rounded-lg bg-gov-blue text-white text-[10px] font-bold uppercase tracking-widest"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="gov-card p-6 bg-white">
            <h3 className="text-lg font-display font-bold text-gov-blue mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-gov-saffron" />
              Top Contributors
            </h3>
            <div className="space-y-6">
              {topContributors.length === 0 ? (
                <div className="text-xs text-gov-blue/50">No community posts yet.</div>
              ) : topContributors.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gov-bg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gov-blue/5 flex items-center justify-center text-xs font-bold text-gov-blue border border-gov-blue/10">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gov-blue">{user.name}</p>
                      <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-wider">{user.reports} Reports Filed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gov-saffron">{user.points}</p>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest">Points</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl bg-gov-bg border border-gov-blue/5 text-[10px] font-bold text-gov-blue uppercase tracking-widest hover:bg-gov-blue hover:text-white transition-all">
              View Full Leaderboard
            </button>
          </div>

          <div className="gov-card p-6 bg-gov-blue text-white">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gov-saffron" />
              Integrity Rewards
            </h3>
            <p className="text-xs text-white/70 mb-8 leading-relaxed font-light">
              Active citizens who provide verified ground reports earn Integrity Points, which can be redeemed for public service benefits and priority grievance handling.
            </p>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gov-saffron/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-gov-saffron" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your Balance</p>
                  <p className="text-2xl font-display font-bold text-white">450</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-gov-saffron hover:underline uppercase tracking-widest">Redeem</button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showPostModal ? 1 : 0 }}
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all",
          showPostModal ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          onClick={() => setShowPostModal(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <div className="relative w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gov-blue">Create Community Post</h3>
              <p className="text-slate-500 text-xs mt-1">Share updates for everyone to see.</p>
            </div>
            <button
              onClick={() => setShowPostModal(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Camera className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Update</label>
              <textarea
                name="content"
                required
                rows={4}
                className="gov-input text-xs resize-none"
                placeholder="Share your ground report..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</label>
              <input name="location" className="gov-input text-xs" placeholder="City, State" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Attach Image or 10s Video (Optional)</label>
              <input name="image" type="file" accept="image/*,video/*" className="gov-input text-xs" />
              <p className="text-[10px] text-slate-400">Video limit: ~10 seconds (short clip).</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="flex-1 gov-button-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 gov-button-primary">
                Post Update
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
