'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Image from 'next/image';

interface Story {
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  stories: Array<{
    _id: string;
    image: string;
    createdAt: string;
  }>;
}

export default function StoriesBar() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await api.get('/stories/feed');
      setStories(response.data);
    } catch (error) {
      console.error('Failed to load stories');
    }
  };

  if (stories.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4">
        {stories.map((storyGroup) => (
          <div
            key={storyGroup.user._id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => router.push(`/stories/${storyGroup.user._id}`)}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-instagram-pink via-instagram-purple to-instagram-orange p-0.5">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {storyGroup.user.avatar ? (
                  <Image
                    src={storyGroup.user.avatar}
                    alt={storyGroup.user.username}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    {storyGroup.user.username[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs mt-1 text-gray-700 truncate max-w-[60px]">
              {storyGroup.user.username}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
