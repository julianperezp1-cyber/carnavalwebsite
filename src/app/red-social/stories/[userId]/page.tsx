'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface StoryItem {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string | null;
  created_at: string;
}

function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'ahora';
  if (s < 3600) return `hace ${Math.floor(s / 60)}m`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)}h`;
  return `hace ${Math.floor(s / 86400)}d`;
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function StoryViewerPage() {
  const params = useParams();
  const router = useRouter();
  const storyUserId = params.userId as string;
  const { user } = useAuth();

  const [stories, setStories] = useState<StoryItem[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const STORY_DURATION = 5000; // 5 seconds per story

  const fetchStories = useCallback(async () => {
    const supabase = createClient();

    const [storiesRes, profileRes] = await Promise.all([
      supabase.from('stories').select('id, media_url, media_type, caption, created_at')
        .eq('user_id', storyUserId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true }),
      supabase.from('profiles').select('full_name').eq('id', storyUserId).single(),
    ]);

    setStories(storiesRes.data || []);
    setAuthorName(profileRes.data?.full_name || 'Carnavalero');
    setLoading(false);

    // Mark stories as viewed
    if (user && storiesRes.data) {
      const inserts = storiesRes.data.map(s => ({ story_id: s.id, viewer_id: user.id }));
      await supabase.from('story_views').upsert(inserts, { onConflict: 'story_id,viewer_id' });
    }
  }, [storyUserId, user]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  // Auto-advance timer
  useEffect(() => {
    if (loading || stories.length === 0 || paused) return;

    const startTime = Date.now();
    const story = stories[currentIdx];
    const duration = story.media_type === 'video' ? 15000 : STORY_DURATION;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      progressRef.current = pct;
      setProgress(pct);

      if (pct >= 100) {
        goNext();
      } else {
        timerRef.current = setTimeout(updateProgress, 50);
      }
    };

    timerRef.current = setTimeout(updateProgress, 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIdx, loading, stories, paused]);

  const goNext = () => {
    if (currentIdx < stories.length - 1) {
      setCurrentIdx(i => i + 1);
      setProgress(0);
    } else {
      router.back();
    }
  };

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setProgress(0);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) goPrev();
    else if (x > (rect.width * 2) / 3) goNext();
    else setPaused(p => !p);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !user) return;
    const supabase = createClient();
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: storyUserId,
      content: `Respondió a tu historia: ${replyText.trim()}`,
    });
    setReplyText('');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white gap-3">
        <p>No hay historias activas</p>
        <button onClick={() => router.back()} className="text-sm text-gray-400 underline">Volver</button>
      </div>
    );
  }

  const current = stories[currentIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 px-2 pt-2">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{
                width: i < currentIdx ? '100%' : i === currentIdx ? `${progress}%` : '0%',
                transitionDuration: i === currentIdx ? '50ms' : '0ms',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-30 flex items-center justify-between px-3 pt-2">
        <div className="flex items-center gap-2">
          <Link href={`/red-social/perfil/${storyUserId}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
              {initials(authorName)}
            </div>
          </Link>
          <Link href={`/red-social/perfil/${storyUserId}`} className="text-white text-[13px] font-semibold">
            {authorName.split(' ')[0]}
          </Link>
          <span className="text-white/60 text-[11px]">{timeAgo(current.created_at)}</span>
          <button onClick={() => setPaused(p => !p)} className="ml-2">
            {paused ? <Play className="w-4 h-4 text-white" /> : <Pause className="w-4 h-4 text-white" />}
          </button>
        </div>
        <button onClick={() => router.back()} className="p-1">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Story content */}
      <div className="flex-1 flex items-center justify-center" onClick={handleTap}>
        {current.media_type === 'video' ? (
          <video
            key={current.id}
            src={current.media_url}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            muted={false}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={current.id}
            src={current.media_url}
            alt=""
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Caption overlay */}
      {current.caption && (
        <div className="absolute bottom-20 left-0 right-0 text-center px-8 z-20">
          <p className="text-white text-[15px] font-medium drop-shadow-lg bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2 inline-block">
            {current.caption}
          </p>
        </div>
      )}

      {/* Reply bar (only for other people's stories) */}
      {user && storyUserId !== user.id && (
        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center gap-2 px-3">
          <input
            type="text"
            placeholder="Enviar mensaje..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendReply(); }}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="flex-1 px-4 py-2 bg-transparent border border-white/40 rounded-full text-white text-sm placeholder-white/60 outline-none"
          />
          <button onClick={() => { /* Share */ }} className="p-2">
            <Heart className="w-6 h-6 text-white" />
          </button>
          <button onClick={sendReply} className="p-2">
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Nav arrows (desktop) */}
      {currentIdx > 0 && (
        <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <ChevronLeft className="w-8 h-8 text-white/60 hover:text-white" />
        </button>
      )}
      {currentIdx < stories.length - 1 && (
        <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <ChevronRight className="w-8 h-8 text-white/60 hover:text-white" />
        </button>
      )}
    </div>
  );
}
