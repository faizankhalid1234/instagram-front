'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import PostCard from '@/components/posts/PostCard';
import api from '@/lib/api';
import Image from 'next/image';

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

export default function ExplorePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchPosts();
  }, [user, router]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/explore');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    try {
      const response = await api.get(`/users/search/${searchQuery}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Search failed');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Explore</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {showSearch ? 'Show Posts' : 'Search Users'}
          </button>
        </div>

        {showSearch ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    handleSearch(e);
                  } else {
                    setUsers([]);
                  }
                }}
                placeholder="Search users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-instagram-pink"
              />
            </form>

            <div className="space-y-4">
              {users.length === 0 && searchQuery && (
                <p className="text-center text-gray-500 py-4">No users found</p>
              )}
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => router.push(`/profile/${user._id}`)}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-instagram-pink to-instagram-purple p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={44}
                          height={44}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No posts to explore yet. Create some posts!
              </div>
            ) : (
              <div className="space-y-8">
                {posts.filter(post => post && post.user && post.image).map((post) => (
                  <PostCard key={post._id || Math.random()} post={post} currentUserId={user!._id} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
