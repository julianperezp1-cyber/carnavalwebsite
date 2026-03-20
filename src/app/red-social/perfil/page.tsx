'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Settings, Grid3X3, Bookmark, UserPlus, Film, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface ProfileData {
  full_name: string;
  bio: string | null;
  nickname: string | null;
  username: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

interface Post {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  likes_count: number;
  comments_count: number;
}

export default function MyProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();

    const [profileRes, contactRes, postsRes, savedRes, followersRes, followingRes] = await Promise.all([
      supabase.from('profiles').select('full_name, bio, username, followers_count, following_count, posts_count').eq('id', user.id).single(),
      supabase.from('contact_info').select('nickname').eq('id', user.id).maybeSingle(),
      supabase.from('posts').select('id, media_url, media_type, likes_count, comments_count').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('saved_posts').select('post_id, posts(id, media_url, media_type, likes_count, comments_count)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', user.id),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', user.id),
    ]);

    if (profileRes.data) {
      setProfile({
        ...profileRes.data,
        nickname: contactRes.data?.nickname || null,
        username: profileRes.data?.username || null,
        followers_count: followersRes.count || 0,
        following_count: followingRes.count || 0,
        posts_count: postsRes.data?.length || 0,
      });
    }
    setNickname(contactRes.data?.nickname || null);
    setPosts(postsRes.data || []);

    // Extract saved posts
    const saved = savedRes.data?.map((s: any) => s.posts).filter(Boolean) || [];
    setSavedPosts(saved);

    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading || !profile) {
    return (
      <div className="min-h-full bg-white animate-pulse">
        <div className="p-4 flex gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="flex gap-6"><div className="h-3 w-12 bg-gray-100 rounded" /><div className="h-3 w-12 bg-gray-100 rounded" /><div className="h-3 w-12 bg-gray-100 rounded" /></div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile.username ? `@${profile.username}` : (nickname || profile.full_name.split(' ')[0].toLowerCase());
  const currentPosts = activeTab === 'saved' ? savedPosts : activeTab === 'reels' ? posts.filter(p => p.media_type === 'video') : posts;

  return (
    <div className="min-h-full bg-white">
      {/* ═══ PROFILE HEADER ═══ */}
      <div className="px-4 pt-4">
        {/* Username row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <h1 className="text-lg font-bold text-brand-dark">{displayName}</h1>
            <ChevronDown className="w-4 h-4 text-brand-dark" />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/red-social/crear" className="p-1"><UserPlus className="w-5 h-5 text-brand-dark" /></Link>
            <Link href="/cuenta" className="p-1"><Settings className="w-5 h-5 text-brand-dark" /></Link>
          </div>
        </div>

        {/* Avatar + Stats */}
        <div className="flex items-center gap-6 mb-4">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-20 h-20 rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-dark">
                  {(profile.full_name || 'C').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around text-center">
            <div>
              <p className="text-lg font-bold text-brand-dark">{profile.posts_count}</p>
              <p className="text-[11px] text-gray-500">publicaciones</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-dark">{profile.followers_count}</p>
              <p className="text-[11px] text-gray-500">seguidores</p>
            </div>
            <div>
              <p className="text-lg font-bold text-brand-dark">{profile.following_count}</p>
              <p className="text-[11px] text-gray-500">seguidos</p>
            </div>
          </div>
        </div>

        {/* Name + Bio */}
        <div className="mb-4">
          <p className="text-[13px] font-semibold text-brand-dark">{profile.full_name}</p>
          {profile.nickname && profile.username && <p className="text-[12px] text-gray-500">~ {profile.nickname}</p>}
          {profile.bio && <p className="text-[13px] text-brand-dark mt-0.5">{profile.bio}</p>}
          <p className="text-[13px] text-carnaval-blue mt-0.5">🎭 Carnavalero</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <Link href="/cuenta" className="flex-1 py-1.5 bg-gray-100 rounded-lg text-[13px] font-semibold text-brand-dark text-center hover:bg-gray-200 transition-colors">
            Editar perfil
          </Link>
          <Link href="/cuenta/qr" className="flex-1 py-1.5 bg-gray-100 rounded-lg text-[13px] font-semibold text-brand-dark text-center hover:bg-gray-200 transition-colors">
            Compartir perfil
          </Link>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] transition-colors ${activeTab === 'posts' ? 'border-brand-dark' : 'border-transparent'}`}
        >
          <Grid3X3 className={`w-5 h-5 ${activeTab === 'posts' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] transition-colors ${activeTab === 'reels' ? 'border-brand-dark' : 'border-transparent'}`}
        >
          <Film className={`w-5 h-5 ${activeTab === 'reels' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] transition-colors ${activeTab === 'saved' ? 'border-brand-dark' : 'border-transparent'}`}
        >
          <Bookmark className={`w-5 h-5 ${activeTab === 'saved' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* ═══ POSTS GRID ═══ */}
      {currentPosts.length === 0 ? (
        <div className="text-center py-16 px-6">
          {activeTab === 'posts' && (
            <>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-brand-dark flex items-center justify-center">
                <Grid3X3 className="w-7 h-7 text-brand-dark" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-1">Comparte fotos</h3>
              <p className="text-sm text-gray-400 mb-4">Cuando compartas fotos, aparecerán en tu perfil.</p>
              <Link href="/red-social/crear" className="text-sm font-semibold text-carnaval-blue">
                Compartir tu primera foto
              </Link>
            </>
          )}
          {activeTab === 'reels' && (
            <>
              <Film className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Aún no has compartido reels</p>
            </>
          )}
          {activeTab === 'saved' && (
            <>
              <Bookmark className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">Guarda contenido para verlo después</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[1px]">
          {currentPosts.map(post => (
            <Link key={post.id} href={`/red-social/post/${post.id}`} className="relative aspect-square bg-gray-100 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              {post.media_type === 'video' && (
                <div className="absolute top-1.5 right-1.5"><Film className="w-4 h-4 text-white drop-shadow" /></div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
