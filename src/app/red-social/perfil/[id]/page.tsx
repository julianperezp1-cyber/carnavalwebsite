'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Grid3X3, Film, ArrowLeft, UserPlus, UserCheck, MessageCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const [loading, setLoading] = useState(true);

  // Redirect to own profile if viewing self
  useEffect(() => {
    if (user && userId === user.id) router.replace('/red-social/perfil');
  }, [user, userId, router]);

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();

    const [profileRes, contactRes, postsRes, followersRes, followingRes] = await Promise.all([
      supabase.from('profiles').select('full_name, bio, city, country').eq('id', userId).single(),
      supabase.from('contact_info').select('nickname, slogan').eq('id', userId).maybeSingle(),
      supabase.from('posts').select('id, media_url, media_type, likes_count, comments_count').eq('user_id', userId).in('visibility', ['public']).order('created_at', { ascending: false }),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
    ]);

    setProfile(profileRes.data);
    setNickname(contactRes.data?.nickname || null);
    setPosts(postsRes.data || []);
    setFollowersCount(followersRes.count || 0);
    setFollowingCount(followingRes.count || 0);

    // Check if current user follows this user
    if (user) {
      const { data: followData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .maybeSingle();
      setIsFollowing(!!followData);
    }

    setLoading(false);
  }, [userId, user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const toggleFollow = async () => {
    if (!user) return;
    const supabase = createClient();

    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', userId);
      setIsFollowing(false);
      setFollowersCount(c => c - 1);
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: userId });
      await supabase.from('notifications').insert({ user_id: userId, actor_id: user.id, type: 'follow' });
      setIsFollowing(true);
      setFollowersCount(c => c + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-carnaval-red animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-white flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-gray-500">Usuario no encontrado</p>
        <button onClick={() => router.back()} className="text-sm text-carnaval-red">← Volver</button>
      </div>
    );
  }

  const displayName = nickname || profile.full_name?.split(' ')[0]?.toLowerCase() || 'carnavalero';
  const currentPosts = activeTab === 'reels' ? posts.filter(p => p.media_type === 'video') : posts;

  return (
    <div className="min-h-full bg-white">
      {/* ═══ HEADER ═══ */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="p-0.5"><ArrowLeft className="w-5 h-5 text-brand-dark" /></button>
            <h1 className="text-lg font-bold text-brand-dark">{displayName}</h1>
          </div>
          <MoreHorizontal className="w-5 h-5 text-brand-dark" />
        </div>

        {/* Avatar + Stats */}
        <div className="flex items-center gap-6 mb-4">
          <div className="w-20 h-20 rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-dark">
                {(profile.full_name || 'C').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>

          <div className="flex-1 flex justify-around text-center">
            <div><p className="text-lg font-bold text-brand-dark">{posts.length}</p><p className="text-[11px] text-gray-500">publicaciones</p></div>
            <div><p className="text-lg font-bold text-brand-dark">{followersCount}</p><p className="text-[11px] text-gray-500">seguidores</p></div>
            <div><p className="text-lg font-bold text-brand-dark">{followingCount}</p><p className="text-[11px] text-gray-500">seguidos</p></div>
          </div>
        </div>

        {/* Name + Bio */}
        <div className="mb-4">
          <p className="text-[13px] font-semibold text-brand-dark">{profile.full_name}</p>
          {profile.bio && <p className="text-[13px] text-brand-dark mt-0.5">{profile.bio}</p>}
          {profile.city && <p className="text-[13px] text-gray-400 mt-0.5">📍 {profile.city}{profile.country === 'CO' ? ', Colombia' : ''}</p>}
          <p className="text-[13px] text-carnaval-blue mt-0.5">🎭 Carnavalero</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={toggleFollow}
            className={`flex-1 py-1.5 rounded-lg text-[13px] font-semibold text-center transition-colors flex items-center justify-center gap-1.5 ${
              isFollowing ? 'bg-gray-100 text-brand-dark hover:bg-gray-200' : 'bg-carnaval-blue text-white hover:bg-carnaval-blue/90'
            }`}
          >
            {isFollowing ? <><UserCheck className="w-4 h-4" /> Siguiendo</> : <><UserPlus className="w-4 h-4" /> Seguir</>}
          </button>
          <Link
            href={`/cuenta/mensajes`}
            className="flex-1 py-1.5 bg-gray-100 rounded-lg text-[13px] font-semibold text-brand-dark text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" /> Mensaje
          </Link>
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex border-t border-gray-100">
        <button onClick={() => setActiveTab('posts')} className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] ${activeTab === 'posts' ? 'border-brand-dark' : 'border-transparent'}`}>
          <Grid3X3 className={`w-5 h-5 ${activeTab === 'posts' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
        <button onClick={() => setActiveTab('reels')} className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] ${activeTab === 'reels' ? 'border-brand-dark' : 'border-transparent'}`}>
          <Film className={`w-5 h-5 ${activeTab === 'reels' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* ═══ GRID ═══ */}
      {currentPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">Sin publicaciones aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[1px]">
          {currentPosts.map((post: any) => (
            <Link key={post.id} href={`/red-social/post/${post.id}`} className="relative aspect-square bg-gray-100 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              {post.media_type === 'video' && <div className="absolute top-1.5 right-1.5"><Film className="w-4 h-4 text-white drop-shadow" /></div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
