'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  RefreshCw, Users, Loader2,
} from 'lucide-react';

interface PostWithAuthor {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  category: string | null;
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

export default function AmigosPage() {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likeAnimations, setLikeAnimations] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [postMenuOpen, setPostMenuOpen] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();
  const PAGE_SIZE = 10;

  const fetchFriendIds = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    const { data } = await supabase
      .from('connections')
      .select('requester_id, receiver_id')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!data) return [];
    return data.map(c => c.requester_id === user.id ? c.receiver_id : c.requester_id);
  }, [user]);

  const fetchPosts = useCallback(async (offset: number = 0, replace: boolean = false) => {
    if (!user) return;

    const friendIds = await fetchFriendIds();
    // Include own posts too
    const allIds = [...friendIds, user.id];

    if (allIds.length === 0) {
      setPosts([]);
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    const { data: postsData, error } = await supabase
      .from('posts')
      .select('*')
      .in('user_id', allIds)
      .in('visibility', ['public', 'friends'])
      .order('created_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !postsData) {
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (postsData.length < PAGE_SIZE) setHasMore(false);

    const uniqueUserIds = [...new Set(postsData.map(p => p.user_id))];
    const [profilesRes, contactRes, likesRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').in('id', uniqueUserIds),
      supabase.from('contact_info').select('id, nickname').in('id', uniqueUserIds),
      supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postsData.map(p => p.id)),
    ]);

    const profileMap: Record<string, string> = {};
    profilesRes.data?.forEach(p => { profileMap[p.id] = p.full_name || 'Carnavalero'; });
    const nicknameMap: Record<string, string | null> = {};
    contactRes.data?.forEach(c => { nicknameMap[c.id] = c.nickname; });
    const likedPostIds = new Set(likesRes.data?.map(l => l.post_id) || []);

    const enrichedPosts: PostWithAuthor[] = postsData.map(p => ({
      ...p,
      author_name: profileMap[p.user_id] || 'Carnavalero',
      author_nickname: nicknameMap[p.user_id] || null,
      is_liked: likedPostIds.has(p.id),
    }));

    if (replace) setPosts(enrichedPosts);
    else setPosts(prev => [...prev, ...enrichedPosts]);

    setLoading(false);
    setLoadingMore(false);
    setRefreshing(false);
  }, [user, fetchFriendIds]);

  useEffect(() => {
    if (!authLoading && user) fetchPosts(0, true);
    else if (!authLoading) setLoading(false);
  }, [authLoading, user]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        setLoadingMore(true);
        fetchPosts(posts.length);
      }
    }, { rootMargin: '400px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, posts.length]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchPosts(0, true);
  };

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

    if (currentlyLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    }
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !user) return;

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
      {/* ═══ STICKY HEADER ═══ */}
      <div className="sticky top-[53px] z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold text-brand-dark">Feed de Amigos</h1>
        <button onClick={handleRefresh} disabled={refreshing} className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 text-brand-dark ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ═══ AUTH GUARD ═══ */}
      {!authLoading && !user && (
        <div className="text-center py-20 px-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
            <Users className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-brand-dark mb-2">Inicia sesión para ver el feed</h2>
          <Link href="/cuenta" className="inline-block mt-4 px-6 py-2.5 bg-carnaval-red text-white rounded-full font-medium">
            Iniciar Sesión
          </Link>
        </div>
      )}

      {/* ═══ LOADING ═══ */}
      {loading && user && (
        <div className="max-w-lg mx-auto space-y-0">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border-b border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-gray-200" />
                <div className="flex-1"><div className="h-3 w-24 bg-gray-200 rounded" /></div>
              </div>
              <div className="w-full aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="flex gap-4"><div className="w-6 h-6 bg-gray-200 rounded" /><div className="w-6 h-6 bg-gray-200 rounded" /></div>
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ EMPTY STATE ═══ */}
      {!loading && user && posts.length === 0 && (
        <div className="text-center py-20 px-6">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-lg font-semibold text-brand-dark mb-2">Tu feed está vacío</h2>
          <p className="text-gray-400 text-sm mb-6">Conecta con otros carnavaleros o publica tu primer contenido</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cuenta/amigos" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-carnaval-red text-white rounded-full font-medium">
              <Users className="w-4 h-4" /> Buscar Amigos
            </Link>
            <Link href="/red-social/crear" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-dark text-white rounded-full font-medium">
              Publicar algo
            </Link>
          </div>
        </div>
      )}

      {/* ═══ POSTS FEED ═══ */}
      {!loading && posts.length > 0 && (
        <div className="max-w-lg mx-auto">
          {posts.map(post => (
            <article key={post.id} className="bg-white border-b border-gray-100">
              {/* Post Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <Link href={`/carnavalero/${post.user_id}`}>
                  <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-[11px] font-bold text-brand-dark">{getInitials(post.author_name)}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/carnavalero/${post.user_id}`} className="text-[13px] font-semibold text-brand-dark hover:underline block truncate">
                    {displayName(post)}
                  </Link>
                  <span className="text-[11px] text-gray-400">
                    {timeAgo(post.created_at)}
                    {post.category && <> · <span className="text-carnaval-blue">{post.category}</span></>}
                  </span>
                </div>
                <div className="relative">
                  <button onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)} className="p-1 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                  {postMenuOpen === post.id && (
                    <div className="absolute right-0 top-8 z-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
                      <Link href={`/red-social/post/${post.id}`} className="block px-4 py-2 text-sm text-brand-dark hover:bg-gray-50" onClick={() => setPostMenuOpen(null)}>
                        Ver publicación
                      </Link>
                      <Link href={`/carnavalero/${post.user_id}`} className="block px-4 py-2 text-sm text-brand-dark hover:bg-gray-50" onClick={() => setPostMenuOpen(null)}>
                        Ver perfil
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Media */}
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
                    alt={post.caption || 'Publicación'}
                    className="w-full max-h-[600px] object-cover"
                    loading="lazy"
                  />
                )}

                {likeAnimations[post.id] && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Heart className="w-20 h-20 text-white fill-white animate-ping" style={{ animationDuration: '0.6s', animationIterationCount: '1' }} />
                  </div>
                )}
              </div>

              {/* Actions */}
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

              {/* Likes */}
              {post.likes_count > 0 && (
                <div className="px-4 pt-2">
                  <p className="text-[13px] font-semibold text-brand-dark">
                    {post.likes_count.toLocaleString('es-CO')} Me gusta
                  </p>
                </div>
              )}

              {/* Caption */}
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

              {/* Comments link */}
              {post.comments_count > 0 && (
                <div className="px-4 pt-1">
                  <Link href={`/red-social/post/${post.id}`} className="text-[13px] text-gray-400 hover:text-gray-500">
                    Ver los {post.comments_count} comentarios
                  </Link>
                </div>
              )}

              {/* Comment input */}
              <div className="px-4 pt-2 pb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38)' }}>
                  <span className="text-[8px] font-bold text-white">
                    {user ? getInitials(user.user_metadata?.full_name || user.email || 'U') : '?'}
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
            </article>
          ))}

          <div ref={loadMoreRef} className="py-4 flex justify-center">
            {loadingMore && <Loader2 className="w-6 h-6 text-carnaval-red animate-spin" />}
            {!hasMore && posts.length > 0 && (
              <p className="text-sm text-gray-400">Ya viste todas las publicaciones de tus amigos 🎭</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
