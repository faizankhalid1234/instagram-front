'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import PostCard from '@/components/posts/PostCard';
import StoriesBar from '@/components/stories/StoriesBar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiHeart, FiMessageCircle, FiPlayCircle } from 'react-icons/fi';

interface Post {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
    fullName: string;
  };
  image: string;
  caption: string;
  likes: string[] | Array<{ _id: string }>;
  comments: Array<{
    _id: string;
    user: {
      username: string;
      avatar: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface DemoPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  liked: boolean;
  comments: string[];
  inputComment: string;
}

export default function HomePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoVisitor, setIsDemoVisitor] = useState(false);
  const [demoPosts, setDemoPosts] = useState<DemoPost[]>([]);

  const socialGallery = [
    'https://images.weserv.nl/?url=images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format%26fit=crop%26w=1200%26q=80&output=png',
    'https://images.weserv.nl/?url=images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format%26fit=crop%26w=1200%26q=80&output=png',
    'https://images.weserv.nl/?url=images.unsplash.com/photo-1517841905240-472988babdf9?auto=format%26fit=crop%26w=1200%26q=80&output=png',
    'https://images.weserv.nl/?url=images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format%26fit=crop%26w=1200%26q=80&output=png',
    'https://images.weserv.nl/?url=images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format%26fit=crop%26w=1200%26q=80&output=png',
    'https://images.weserv.nl/?url=images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format%26fit=crop%26w=1200%26q=80&output=png',
  ];

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchPosts();
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemoVisitor(localStorage.getItem('isDemoLogin') === 'true');
    }
  }, []);

  useEffect(() => {
    if (!isDemoVisitor) return;

    const shuffled = [...socialGallery].sort(() => Math.random() - 0.5);
    setDemoPosts(
      shuffled.slice(0, 3).map((image, index) => ({
        id: `demo-${index}`,
        image,
        caption: [
          'Weekend vibes with clean aesthetics ✨',
          'Sunset moments and social feed energy 🌇',
          'Building beautiful UI experiences daily 🚀',
        ][index],
        likes: 120 + index * 35,
        liked: false,
        comments: [],
        inputComment: '',
      }))
    );
  }, [isDemoVisitor]);

  const handleDemoLike = (id: string) => {
    setDemoPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const nextLiked = !post.liked;
        return {
          ...post,
          liked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(post.likes - 1, 0),
        };
      })
    );
  };

  const handleCommentInput = (id: string, value: string) => {
    setDemoPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, inputComment: value } : post))
    );
  };

  const handleAddComment = (id: string) => {
    setDemoPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const cleanComment = post.inputComment.trim();
        if (!cleanComment) return post;
        return {
          ...post,
          comments: [...post.comments, cleanComment],
          inputComment: '',
        };
      })
    );
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/feed');
      setPosts(response.data);
      
      // If no posts in feed, try to get explore posts
      if (response.data.length === 0) {
        const exploreResponse = await api.get('/posts/explore');
        setPosts(exploreResponse.data);
      }
    } catch (error: any) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 max-w-5xl mx-auto px-4 py-8">
        {isDemoVisitor && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                Welcome Faizan - Demo Tour Ready
              </h2>
              <button
                onClick={() => setIsDemoVisitor(false)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                Hide
              </button>
            </div>
            <div className="mx-auto mt-4 max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/png?seed=faizan-video"
                    alt="Faizan avatar"
                    className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">faizan_demo</p>
                    <p className="text-[11px] text-slate-500">Featured Video Post</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-black/85 px-3 py-1 text-[11px] font-semibold text-white">
                  <FiPlayCircle />
                  Live
                </span>
              </div>
              <div className="relative">
                <iframe
                  className="h-64 w-full"
                  src="https://www.youtube.com/embed/S5TYTFXka94?rel=0"
                  title="Demo walkthrough video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">faizan_demo </span>
                  Quick product walkthrough - clean UI, smooth login, and social feed demo.
                </p>
                <a
                  href="https://www.youtube.com/watch?v=S5TYTFXka94"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Open on YouTube
                </a>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Random demo gallery (Instagram style feel)
              </p>
              <button
                onClick={() => {
                  const shuffled = [...socialGallery].sort(() => Math.random() - 0.5);
                  setDemoPosts(
                    shuffled.slice(0, 3).map((image, index) => ({
                      id: `demo-${index}-${Date.now()}`,
                      image,
                      caption: [
                        'Weekend vibes with clean aesthetics ✨',
                        'Sunset moments and social feed energy 🌇',
                        'Building beautiful UI experiences daily 🚀',
                      ][index],
                      likes: 120 + index * 35,
                      liked: false,
                      comments: [],
                      inputComment: '',
                    }))
                  );
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Shuffle Pics
              </button>
            </div>
            {demoPosts.length > 0 && (
              <div className="mt-3 space-y-4">
                {demoPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                  >
                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/png?seed=faizan-${index}`}
                        alt="Profile avatar"
                        className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">faizan_demo</p>
                        <p className="text-[11px] text-slate-500">Demo Post #{index + 1}</p>
                      </div>
                    </div>
                    <img
                      src={post.image}
                      alt={`Demo gallery ${index + 1}`}
                      className="h-72 w-full object-cover"
                    />
                    <div className="space-y-3 p-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleDemoLike(post.id)}
                          className={`inline-flex items-center gap-1 text-sm font-semibold transition ${
                            post.liked ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500'
                          }`}
                        >
                          <FiHeart className={post.liked ? 'fill-current' : ''} />
                          {post.likes}
                        </button>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                          <FiMessageCircle />
                          {post.comments.length}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">faizan_demo </span>
                        {post.caption}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          value={post.inputComment}
                          onChange={(e) => handleCommentInput(post.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Add a comment..."
                          className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-instagram-pink"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="rounded-lg bg-gradient-to-r from-instagram-pink to-instagram-purple px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                        >
                          Post
                        </button>
                      </div>
                      {post.comments.length > 0 && (
                        <div className="space-y-1">
                          {post.comments.slice(-2).map((comment, commentIndex) => (
                            <p key={`${post.id}-comment-${commentIndex}`} className="text-xs text-slate-600">
                              <span className="font-semibold text-slate-700">faizan_demo:</span> {comment}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <StoriesBar />
        <div className="mt-8 space-y-8">
          {loading ? (
            <div className="text-center py-12">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No posts available yet</div>
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-2 bg-gradient-to-r from-instagram-pink to-instagram-purple text-white rounded-md hover:opacity-90"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            posts.filter(post => post && post.user && post.image).map((post) => (
              <PostCard key={post._id || Math.random()} post={post} currentUserId={user._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
