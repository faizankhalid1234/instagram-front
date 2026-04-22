'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import PostCard from '@/components/posts/PostCard';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { FiGrid, FiUserPlus, FiUserMinus } from 'react-icons/fi';

interface UserProfile {
  user?: {
    _id?: string;
    username?: string;
    fullName?: string;
    bio?: string;
    avatar?: string;
    followersCount?: number;
    followingCount?: number;
    postsCount?: number;
    followers?: Array<{ _id?: string; username?: string; avatar?: string }>;
    following?: Array<{ _id?: string; username?: string; avatar?: string }>;
  };
  posts?: any[];
}

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }
    fetchProfile();
  }, [userId, currentUser, router]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setProfile(response.data);
      setIsFollowing(
        response.data.user?.followers?.some(
          (f: any) => f._id === currentUser?._id
        ) || false
      );
    } catch (error: any) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/users/${userId}/unfollow`);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await api.post(`/users/${userId}/follow`);
        setIsFollowing(true);
        toast.success('Following');
      }
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 text-center py-12">Loading...</div>
      </div>
    );
  }

  if (!profile || !profile.user) return null;

  const isOwnProfile = currentUser._id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-instagram-pink to-instagram-purple p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {profile.user.avatar ? (
                  <Image
                    src={profile.user.avatar}
                    alt={profile.user?.username || 'User'}
                    width={92}
                    height={92}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-22 h-22 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-2xl">
                    {profile.user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                <h1 className="text-2xl font-semibold">{profile.user?.username || 'Unknown User'}</h1>
                {!isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1 rounded-md text-sm font-semibold ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-instagram-pink text-white'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <FiUserMinus className="inline mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="inline mr-1" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <p className="font-semibold">{profile.user?.postsCount || 0}</p>
                  <p className="text-gray-500 text-sm">posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{profile.user?.followersCount || 0}</p>
                  <p className="text-gray-500 text-sm">followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{profile.user?.followingCount || 0}</p>
                  <p className="text-gray-500 text-sm">following</p>
                </div>
              </div>

              <div>
                <p className="font-semibold">{profile.user?.fullName || ''}</p>
                <p className="text-gray-700">{profile.user?.bio || ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-1 mb-4 pb-2 border-b">
            <FiGrid size={20} />
            <span className="font-semibold">POSTS</span>
          </div>

          {!profile.posts || profile.posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No posts yet
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {profile.posts.filter(post => post && post.user && post.image).map((post) => (
                <PostCard key={post._id || Math.random()} post={post} currentUserId={currentUser._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
