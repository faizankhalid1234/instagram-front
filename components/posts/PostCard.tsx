'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface PostCardProps {
  post: {
    _id?: string;
    user?: {
      _id?: string;
      username?: string;
      avatar?: string;
      fullName?: string;
    };
    image?: string;
    caption?: string;
    likes?: string[] | Array<{ _id: string }>;
    comments?: Array<{
      _id?: string;
      user?: {
        username?: string;
        avatar?: string;
      };
      text?: string;
      createdAt?: string;
    }>;
    createdAt?: string;
  };
  currentUserId: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const router = useRouter();
  
  // Safety checks
  if (!post || !post.user) {
    return null;
  }

  const [isLiked, setIsLiked] = useState(
    Array.isArray(post.likes) && post.likes.some(
      (like: any) => (typeof like === 'string' ? like : like._id) === currentUserId
    )
  );
  const [likesCount, setLikesCount] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0
  );
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await api.post(`/posts/${post._id}/like`);
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
    } catch (error: any) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setComments([...comments, response.data]);
      setCommentText('');
      toast.success('Comment added');
    } catch (error: any) {
      toast.error('Failed to add comment');
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => post.user?._id && router.push(`/profile/${post.user._id}`)}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-instagram-pink to-instagram-purple p-0.5">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {post.user.avatar ? (
                <Image
                  src={post.user.avatar}
                  alt={post.user.username || 'User avatar'}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {post.user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{post.user?.username || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{post.user?.fullName || ''}</p>
          </div>
        </div>
        <FiMoreHorizontal className="text-gray-700 cursor-pointer" />
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative w-full aspect-square bg-black">
          <Image
            src={post.image}
            alt={post.caption || 'Post image'}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="focus:outline-none">
              {isLiked ? (
                <FaHeart className="text-instagram-pink" size={24} />
              ) : (
                <FiHeart className="text-gray-700" size={24} />
              )}
            </button>
            <FiMessageCircle
              className="text-gray-700 cursor-pointer"
              size={24}
              onClick={() => setShowComments(!showComments)}
            />
            <FiSend className="text-gray-700 cursor-pointer" size={24} />
          </div>
          <FiBookmark className="text-gray-700 cursor-pointer" size={24} />
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">{likesCount} likes</p>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-sm mr-2">{post.user?.username || 'Unknown'}</span>
          <span className="text-sm">{post.caption || ''}</span>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2"
          >
            View all {comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment._id || Math.random()} className="flex items-start space-x-2">
                <span className="font-semibold text-sm">{comment.user?.username || 'Unknown'}</span>
                <span className="text-sm">{comment.text || ''}</span>
              </div>
            ))}
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleComment} className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border-none focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="text-instagram-pink font-semibold text-sm hover:opacity-70"
          >
            Post
          </button>
        </form>

        {/* Time */}
        {post.createdAt && (
          <p className="text-gray-500 text-xs mt-2">{formatTime(post.createdAt)}</p>
        )}
      </div>
    </div>
  );
}
