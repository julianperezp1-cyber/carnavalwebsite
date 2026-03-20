'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Play, X, Heart, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
  '🔥 Tendencia', 'Batalla de Flores', 'Gran Parada', 'Guacherna', 'Coronación',
  'Precarnaval', 'Danzas', 'Disfraces', 'Gastronomía', 'Música', 'Tips', 'Carnaval General',
];

interface Post {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  likes_count: number;
  comments_count: number;
  category: string | null;
}

const PAGE_SIZE = 21; // multiple of 3 for grid

export default function ExplorarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('🔥 Tendencia');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{ id: string; full_name: string; nickname: string | null; posts_count: number }[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);

  const fetchPosts = useCallback(async (page: number, reset = false) => {
    if (page > 0) setLoadingMore(true); else setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('posts')
      .select('id, media_url, media_type, thumbnail_url, likes_count, comments_count, category')
      .eq('visibility', 'public')
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (activeCategory !== '🔥 Tendencia') {
      query = query.eq('category', activeCategory);
    }

    const { data } = await query;
    if (!data) { setLoading(false); setLoadingMore(false); return; }

    if (reset || page === 0) setPosts(data);
    else setPosts(prev => [...prev, ...data]);
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [activeCategory]);

  useEffect(() => {
    pageRef.current = 0;
    fetchPosts(0, true);
  }, [fetchPosts]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
        pageRef.current++;
        fetchPosts(pageRef.current);
      }
    }, { rootMargin: '400px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, fetchPosts]);

  // User search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, posts_count')
        .ilike('full_name', `%${searchQuery.trim()}%`)
        .limit(8);

      if (!profiles) return;
      const ids = profiles.map(p => p.id);
      const { data: contacts } = await supabase.from('contact_info').select('id, nickname').in('id', ids);
      const nickMap: Record<string, string | null> = {};
      contacts?.forEach(c => { nickMap[c.id] = c.nickname; });

      setSearchResults(profiles.map(p => ({ ...p, full_name: p.full_name || 'Carnavalero', nickname: nickMap[p.id] || null, posts_count: p.posts_count || 0 })));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-full bg-white">
      {/* ═══ SEARCH BAR ═══ */}
      <div className="px-3 pt-2 pb-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar personas o contenido..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-9 pr-8 py-2 bg-gray-100 rounded-lg text-sm text-brand-dark placeholder:text-gray-400 outline-none"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchFocused(false); }} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm px-3 py-2 space-y-1">
            {searchResults.map(u => (
              <Link
                key={u.id}
                href={`/red-social/perfil/${u.id}`}
                onClick={() => { setSearchFocused(false); setSearchQuery(''); }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                  {(u.full_name || 'C').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-brand-dark">{u.nickname || u.full_name.split(' ')[0]}</p>
                  <p className="text-[11px] text-gray-400">{u.full_name} · {u.posts_count} publicaciones</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CATEGORY TABS ═══ */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ═══ GRID (Instagram explore style) ═══ */}
      {loading ? (
        <div className="grid grid-cols-3 gap-[1px]">
          {Array.from({ length: 21 }).map((_, i) => {
            // Every 3rd group: make one tall cell
            const groupIdx = Math.floor(i / 3);
            const posInGroup = i % 3;
            const isTall = groupIdx % 3 === 1 && posInGroup === 0;
            return <div key={i} className={`bg-gray-100 animate-pulse ${isTall ? 'aspect-[1/2] row-span-2' : 'aspect-square'}`} />;
          })}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 px-6">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-base font-semibold text-brand-dark mb-1">No hay publicaciones</h2>
          <p className="text-sm text-gray-400">Sé el primero en compartir contenido de {activeCategory}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-[1px]">
            {posts.map((post, i) => {
              // Instagram explore pattern: every 10 posts, make positions 0 and 5 span 2 rows
              const groupPos = i % 10;
              const isLarge = groupPos === 0 || groupPos === 5;

              return (
                <Link
                  key={post.id}
                  href={`/red-social/post/${post.id}`}
                  className={`relative bg-gray-100 overflow-hidden group ${isLarge ? 'row-span-2' : ''}`}
                  style={{ aspectRatio: isLarge ? '1/2' : '1/1' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.media_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Video indicator */}
                  {post.media_type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <Play className="w-4 h-4 text-white drop-shadow-lg" fill="white" />
                    </div>
                  )}

                  {/* Hover overlay with stats */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-4 text-white font-semibold text-sm">
                      <span className="flex items-center gap-1"><Heart className="w-4 h-4" fill="white" /> {post.likes_count}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" fill="white" /> {post.comments_count}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div ref={sentinelRef} className="h-4" />
          {loadingMore && <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-carnaval-red border-t-transparent rounded-full animate-spin" /></div>}
        </>
      )}
    </div>
  );
}
