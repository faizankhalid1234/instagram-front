'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function CreatePost() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [image, setImage] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    try {
      await api.post('/posts', { image, caption });
      toast.success('Post created successfully!');
      router.push('/home');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-instagram-pink file:text-white hover:file:opacity-90"
              />
              {preview && (
                <div className="mt-4 relative w-full aspect-square max-w-md mx-auto">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-instagram-pink"
                placeholder="Write a caption..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !image}
              className="w-full py-2 px-4 bg-gradient-to-r from-instagram-pink to-instagram-purple text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-instagram-pink disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
