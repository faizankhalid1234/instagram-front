'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import PostCard from '@/components/posts/PostCard';
import StoriesBar from '@/components/stories/StoriesBar';
import api from '@/lib/api';
import toast from 'react-hot-toast';

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

export default function HomePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchPosts();
  }, [user, router]);

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
