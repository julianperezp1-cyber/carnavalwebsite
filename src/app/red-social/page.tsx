'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Play, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
  'Todo',
  'Batalla de Flores',
  'Gran Parada',
  'Guacherna',
  'Coronación',
  'Precarnaval',
  'Danzas',
  'Disfraces',
  'Gastronomía',
  'Música',
  'Tips',
  'Carnaval General',
];

const PAGE_SIZE = 18;

interface Post {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  category: string;
}

export default function RedSocialExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todo');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);

  const fetchPosts = useCallback(
    async (page: number, reset = false) => {
      if (page > 0) setLoadingMore(true);
      else setLoading(true);

      const supabase = createClient();
      let query = supabase
        .from('posts')
        .select('id, media_url, media_type, thumbnail_url, category')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (activeCategory !== 'Todo') {
        query = query.eq('category', activeCategory);
      }

      if (searchQuery.trim()) {
        query = query.ilike('caption', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;

      if (!error && data) {
        if (reset || page === 0) {
          setPosts(data);
        } else {
          setPosts((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === PAGE_SIZE);
      }

      setLoading(false);
      setLoadingMore(false);
    },
    [activeCategory, searchQuery]
  );

  // Reset and fetch when category or search changes
  useEffect(() => {
    pageRef.current = 0;
    fetchPosts(0, true);
  }, [fetchPosts]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          pageRef.current += 1;
          fetchPosts(pageRef.current);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchPosts]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Search Bar */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar publicaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-brand-dark placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-carnaval-red/30 focus:bg-white transition-all border border-transparent focus:border-carnaval-red/20"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3 pb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-3 px-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-carnaval-red text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Post Grid */}
          <div className="grid grid-cols-3 gap-0.5 px-0.5">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/red-social/post/${post.id}`}
                className="relative aspect-square bg-gray-100 overflow-hidden group"
              >
                <Image
                  src={post.media_type === 'video' && post.thumbnail_url ? post.thumbnail_url : post.media_url}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Video play overlay */}
                {post.media_type === 'video' && (
                  <div className="absolute top-2 right-2">
                    <Play className="w-4 h-4 text-white drop-shadow-lg" fill="white" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </Link>
            ))}
          </div>

          {/* Load more sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-carnaval-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* End of feed */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              No hay más publicaciones
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-0.5 px-0.5">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-carnaval-red/10 flex items-center justify-center mb-5">
        <Camera className="w-9 h-9 text-carnaval-red" />
      </div>
      <h2 className="text-lg font-bold text-brand-dark mb-2">
        Sé el primero en compartir 🎭
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Aún no hay publicaciones en esta categoría. ¡Comparte tu experiencia del Carnaval!
      </p>
      <Link
        href="/red-social/crear"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-carnaval-red text-white text-sm font-semibold rounded-full hover:bg-carnaval-red-hover transition-colors shadow-sm"
      >
        Crear publicación
      </Link>
    </div>
  );
}
