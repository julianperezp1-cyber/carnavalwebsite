'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Camera, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

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

const PAGE_SIZE = 10;

interface PostWithAuthor {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  category: string;
  visibility: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author_name: string;
  author_nickname: string | null;
  is_liked: boolean;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ExplorePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [likeAnimations, setLikeAnimations] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);

  const fetchPosts = useCallback(async (page: number, reset = false) => {
    if (page > 0) setLoadingMore(true);
    else setLoading(true);

    const supabase = createClient();

    let query = supabase
      .from('posts')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (activeCategory !== 'Todo') {
      query = query.eq('category', activeCategory);
    }

    if (searchQuery.trim()) {
      query = query.ilike('caption', `%${searchQuery.trim()}%`);
    }

    const { data: postsData, error } = await query;

    if (error || !postsData) {
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    // Fetch author info
    const uniqueUserIds = [...new Set(postsData.map(p => p.user_id))];

    const profileMap: Record<string, string> = {};
    const nicknameMap: Record<string, string | null> = {};
    let likedPostIds = new Set<string>();

    if (uniqueUserIds.length > 0) {
      const [profilesRes, contactRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name').in('id', uniqueUserIds),
        supabase.from('contact_info').select('id, nickname').in('id', uniqueUserIds),
      ]);

      profilesRes.data?.forEach(p => { profileMap[p.id] = p.full_name || 'Carnavalero'; });
      contactRes.data?.forEach(c => { nicknameMap[c.id] = c.nickname; });
    }

    // Check likes for current user
    if (user && postsData.length > 0) {
      const { data: likesData } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postsData.map(p => p.id));

      likesData?.forEach(l => likedPostIds.add(l.post_id));
    }

    const enrichedPosts: PostWithAuthor[] = postsData.map(p => ({
      ...p,
      author_name: profileMap[p.user_id] || 'Carnavalero',
      author_nickname: nicknameMap[p.user_id] || null,
      is_liked: likedPostIds.has(p.id),
    }));

    if (reset || page === 0) {
      setPosts(enrichedPosts);
    } else {
      setPosts(prev => [...prev, ...enrichedPosts]);
    }

    setHasMore(postsData.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [activeCategory, searchQuery, user]);

  useEffect(() => {
    pageRef.current = 0;
    fetchPosts(0, true);
  }, [fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          pageRef.current += 1;
          fetchPosts(pageRef.current);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, fetchPosts]);

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, is_liked: !currentlyLiked, likes_count: currentlyLiked ? p.likes_count - 1 : p.likes_count + 1 }
          : p
      )
    );

    if (!currentlyLiked) {
      setLikeAnimations(prev => ({ ...prev, [postId]: true }));
      setTimeout(() => setLikeAnimations(prev => ({ ...prev, [postId]: false })), 800);
    }

    const supabase = createClient();
    if (currentlyLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    }
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !user) return;

    const supabase = createClient();
    await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content });

    setPosts(prev =>
      prev.map(p => p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p)
    );
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const displayName = (post: PostWithAuthor) =>
    post.author_nickname || post.author_name.split(' ')[0];

  return (
    <div className="min-h-full bg-gray-50">
      {/* ═══ CATEGORY PILLS - Sticky ═══ */}
      <div className="sticky top-[53px] z-40 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 px-4 py-2.5">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-dark text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="px-4 pb-2.5">
            <input
              type="text"
              autoFocus
              placeholder="Buscar publicaciones..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm text-brand-dark placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-carnaval-red/20"
            />
          </div>
        )}
      </div>

      {/* ═══ CONTENT ═══ */}
      {loading ? (
        <div className="max-w-lg mx-auto space-y-0">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState category={activeCategory} />
      ) : (
        <div className="max-w-lg mx-auto">
          {posts.map(post => (
            <article key={post.id} className="bg-white border-b border-gray-100">
              {/* ── Post Header ── */}
              <div className="flex items-center gap-3 px-4 py-3">
                <Link href={`/carnavalero/${post.user_id}`}>
                  <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-[11px] font-bold text-brand-dark">
                        {getInitials(post.author_name)}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/carnavalero/${post.user_id}`} className="text-[13px] font-semibold text-brand-dark hover:underline block truncate">
                    {displayName(post)}
                  </Link>
                  {post.category && (
                    <span className="text-[11px] text-gray-400">{post.category}</span>
                  )}
                </div>
                <Link href={`/red-social/post/${post.id}`} className="p-1">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </Link>
              </div>

              {/* ── Media ── */}
              <div
                className="relative w-full bg-gray-100 cursor-pointer"
                onDoubleClick={() => { if (!post.is_liked) toggleLike(post.id, false); }}
              >
                {post.media_type === 'video' ? (
                  <video
                    src={post.media_url}
                    poster={post.thumbnail_url || undefined}
                    className="w-full max-h-[600px] object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.media_url}
                    alt={post.caption || 'Publicación del Carnaval'}
                    className="w-full max-h-[600px] object-cover"
                    loading="lazy"
                  />
                )}

                {/* Double-tap heart animation */}
                {likeAnimations[post.id] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <Heart className="w-20 h-20 text-white fill-white animate-ping" style={{ animationDuration: '0.6s', animationIterationCount: '1' }} />
                  </div>
                )}
              </div>

              {/* ── Actions Row ── */}
              <div className="px-4 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(post.id, post.is_liked)} className="active:scale-90 transition-transform">
                      <Heart className={`w-6 h-6 transition-colors ${post.is_liked ? 'text-carnaval-red fill-carnaval-red' : 'text-brand-dark'}`} />
                    </button>
                    <Link href={`/red-social/post/${post.id}`}>
                      <MessageCircle className="w-6 h-6 text-brand-dark hover:text-gray-500 transition-colors" />
                    </Link>
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/red-social/post/${post.id}`)}>
                      <Send className="w-[22px] h-[22px] text-brand-dark hover:text-gray-500 transition-colors" />
                    </button>
                  </div>
                  <Bookmark className="w-6 h-6 text-brand-dark hover:text-gray-500 transition-colors cursor-pointer" />
                </div>
              </div>

              {/* ── Likes Count ── */}
              {post.likes_count > 0 && (
                <div className="px-4 pt-2">
                  <p className="text-[13px] font-semibold text-brand-dark">
                    {post.likes_count.toLocaleString('es-CO')} Me gusta
                  </p>
                </div>
              )}

              {/* ── Caption ── */}
              {post.caption && (
                <div className="px-4 pt-1">
                  <p className="text-[13px] text-brand-dark leading-relaxed">
                    <Link href={`/carnavalero/${post.user_id}`} className="font-semibold hover:underline mr-1">
                      {displayName(post)}
                    </Link>
                    {post.caption}
                  </p>
                </div>
              )}

              {/* ── View Comments Link ── */}
              {post.comments_count > 0 && (
                <div className="px-4 pt-1">
                  <Link href={`/red-social/post/${post.id}`} className="text-[13px] text-gray-400 hover:text-gray-500">
                    Ver los {post.comments_count} comentarios
                  </Link>
                </div>
              )}

              {/* ── Inline Comment Input ── */}
              {user && (
                <div className="px-4 pt-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38)' }}>
                    <span className="text-[8px] font-bold text-white">
                      {getInitials(user.user_metadata?.full_name || user.email || 'U')}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Agregar un comentario..."
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') submitComment(post.id); }}
                    className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-300 text-brand-dark"
                  />
                  {commentInputs[post.id]?.trim() && (
                    <button onClick={() => submitComment(post.id)} className="text-[13px] font-semibold text-carnaval-blue">
                      Publicar
                    </button>
                  )}
                </div>
              )}

              {/* ── Timestamp ── */}
              <div className="px-4 pt-1 pb-3">
                <span className="text-[10px] text-gray-300 uppercase tracking-wide">{timeAgo(post.created_at)}</span>
              </div>
            </article>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {loadingMore && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-carnaval-red animate-spin" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-10 space-y-2">
              <div className="text-3xl">🎭</div>
              <p className="text-sm text-gray-400">Ya viste todo el contenido</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="bg-white border-b border-gray-100 animate-pulse">
      <div className="flex items-center gap-3 p-4">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded mb-1.5" />
          <div className="h-2.5 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="w-full aspect-square bg-gray-200" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
      </div>
    </div>
  );
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-carnaval-red/10 via-gold/10 to-carnaval-green/10 flex items-center justify-center mb-6">
        <Camera className="w-10 h-10 text-carnaval-red" />
      </div>
      <h2 className="text-xl font-bold text-brand-dark mb-2">
        {category === 'Todo' ? '¡Sé el primero en compartir!' : `No hay publicaciones de "${category}"`}
      </h2>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        Comparte tus mejores momentos del Carnaval de Barranquilla con toda la comunidad 🎭
      </p>
      <Link
        href="/red-social/crear"
        className="inline-flex items-center gap-2 px-8 py-3 bg-carnaval-red text-white font-semibold rounded-full hover:bg-carnaval-red/90 transition-colors shadow-lg shadow-carnaval-red/20"
      >
        <Camera className="w-5 h-5" />
        Crear publicación
      </Link>
    </div>
  );
}
