'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Send, Bookmark, Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface Reel {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string;
  category: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author_name: string;
  author_nickname: string | null;
  is_liked: boolean;
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ReelsPage() {
  const { user } = useAuth();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [likeAnims, setLikeAnims] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement>>({});

  const fetchReels = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('media_type', 'video')
      .eq('visibility', 'public')
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(30);

    if (!postsData || postsData.length === 0) { setLoading(false); return; }

    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const [profilesRes, contactRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').in('id', userIds),
      supabase.from('contact_info').select('id, nickname').in('id', userIds),
    ]);

    const nameMap: Record<string, string> = {};
    profilesRes.data?.forEach(p => { nameMap[p.id] = p.full_name || 'Carnavalero'; });
    const nickMap: Record<string, string | null> = {};
    contactRes.data?.forEach(c => { nickMap[c.id] = c.nickname; });

    let likedSet = new Set<string>();
    if (user) {
      const { data: likesData } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postsData.map(p => p.id));
      likesData?.forEach(l => likedSet.add(l.post_id));
    }

    setReels(postsData.map(p => ({
      ...p,
      author_name: nameMap[p.user_id] || 'Carnavalero',
      author_nickname: nickMap[p.user_id] || null,
      is_liked: likedSet.has(p.id),
    })));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchReels(); }, [fetchReels]);

  // Snap scroll observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const idx = Number(entry.target.getAttribute('data-idx'));
        if (entry.isIntersecting) {
          setCurrentIdx(idx);
          // Play this video
          const video = videoRefs.current[idx];
          if (video) { video.currentTime = 0; video.play().catch(() => {}); }
        } else {
          // Pause non-visible videos
          const video = videoRefs.current[idx];
          if (video) video.pause();
        }
      });
    }, { threshold: 0.6 });

    container.querySelectorAll('[data-idx]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [reels]);

  const toggleLike = async (reelId: string, liked: boolean) => {
    if (!user) return;
    setReels(r => r.map(x => x.id === reelId ? { ...x, is_liked: !liked, likes_count: liked ? x.likes_count - 1 : x.likes_count + 1 } : x));
    if (!liked) { setLikeAnims(p => ({ ...p, [reelId]: true })); setTimeout(() => setLikeAnims(p => ({ ...p, [reelId]: false })), 800); }
    const supabase = createClient();
    if (liked) await supabase.from('post_likes').delete().eq('post_id', reelId).eq('user_id', user.id);
    else await supabase.from('post_likes').insert({ post_id: reelId, user_id: user.id });
  };

  const togglePlayPause = (idx: number) => {
    const video = videoRefs.current[idx];
    if (!video) return;
    if (video.paused) { video.play(); setPaused(false); }
    else { video.pause(); setPaused(true); }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-100px)] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-[calc(100vh-100px)] bg-black flex flex-col items-center justify-center text-white text-center px-6">
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-lg font-semibold mb-2">Aún no hay Reels</h2>
        <p className="text-sm text-gray-400 mb-6">Sube el primer video del Carnaval</p>
        <Link href="/red-social/crear" className="px-6 py-2.5 bg-carnaval-red text-white rounded-lg font-semibold text-sm">
          Subir video
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-100px)] overflow-y-scroll snap-y snap-mandatory bg-black"
      style={{ scrollbarWidth: 'none' }}
    >
      {reels.map((reel, idx) => (
        <div
          key={reel.id}
          data-idx={idx}
          className="h-[calc(100vh-100px)] snap-start relative flex items-center justify-center bg-black"
        >
          {/* Video */}
          <video
            ref={el => { if (el) videoRefs.current[idx] = el; }}
            src={reel.media_url}
            className="w-full h-full object-contain"
            loop
            muted={muted}
            playsInline
            preload="metadata"
            onClick={() => togglePlayPause(idx)}
            onDoubleClick={() => { if (!reel.is_liked) toggleLike(reel.id, false); }}
          />

          {/* Pause indicator */}
          {paused && currentIdx === idx && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Play className="w-16 h-16 text-white/60" fill="white" />
            </div>
          )}

          {/* Double-tap heart */}
          {likeAnims[reel.id] && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <Heart className="w-24 h-24 text-white fill-white animate-ping" style={{ animationDuration: '0.5s', animationIterationCount: '1' }} />
            </div>
          )}

          {/* Right sidebar actions */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
            <button onClick={() => toggleLike(reel.id, reel.is_liked)} className="flex flex-col items-center gap-1">
              <Heart className={`w-7 h-7 ${reel.is_liked ? 'text-carnaval-red fill-carnaval-red' : 'text-white'}`} />
              <span className="text-white text-[11px] font-medium">{reel.likes_count}</span>
            </button>
            <Link href={`/red-social/post/${reel.id}`} className="flex flex-col items-center gap-1">
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="text-white text-[11px] font-medium">{reel.comments_count}</span>
            </Link>
            <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/red-social/post/${reel.id}`)} className="flex flex-col items-center gap-1">
              <Send className="w-6 h-6 text-white" />
            </button>
            <button className="flex flex-col items-center gap-1">
              <Bookmark className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Bottom info overlay */}
          <div className="absolute left-0 right-14 bottom-4 px-4">
            <div className="flex items-center gap-2 mb-2">
              <Link href={`/red-social/perfil/${reel.user_id}`}>
                <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                  {initials(reel.author_name)}
                </div>
              </Link>
              <Link href={`/red-social/perfil/${reel.user_id}`} className="text-white text-[13px] font-semibold">
                {reel.author_nickname || reel.author_name.split(' ')[0]}
              </Link>
              {reel.category && (
                <span className="text-white/60 text-[11px]">· {reel.category}</span>
              )}
            </div>
            {reel.caption && (
              <p className="text-white text-[13px] leading-relaxed line-clamp-2">{reel.caption}</p>
            )}
            {/* Music bar */}
            <div className="flex items-center gap-2 mt-2">
              <Music className="w-3 h-3 text-white/60" />
              <div className="flex-1 overflow-hidden">
                <p className="text-white/60 text-[11px] whitespace-nowrap animate-marquee">
                  Carnaval de Barranquilla · Audio original
                </p>
              </div>
              <button onClick={() => setMuted(!muted)} className="p-1">
                {muted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-white/60" />}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
