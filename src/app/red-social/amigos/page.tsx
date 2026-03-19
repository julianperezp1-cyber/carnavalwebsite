'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  RefreshCw,
  Users,
  Play,
  Loader2,
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
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'ahora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `hace ${weeks}sem`;
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 w-28 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-200" />
      {/* Actions skeleton */}
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
      </div>
    </div>
  );
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
    return data.map((c) =>
      c.requester_id === user.id ? c.receiver_id : c.requester_id
    );
  }, [user]);

  const fetchPosts = useCallback(
    async (offset: number = 0, replace: boolean = false) => {
      if (!user) return;

      const friendIds = await fetchFriendIds();
      if (friendIds.length === 0) {
        setPosts([]);
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      // Fetch posts from friends
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .in('user_id', friendIds)
        .in('visibility', ['public', 'friends'])
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error || !postsData) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (postsData.length < PAGE_SIZE) setHasMore(false);

      // Fetch author info for each unique user
      const uniqueUserIds = [...new Set(postsData.map((p) => p.user_id))];

      const [profilesRes, contactRes, likesRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name').in('id', uniqueUserIds),
        supabase.from('contact_info').select('id, nickname').in('id', uniqueUserIds),
        supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in(
            'post_id',
            postsData.map((p) => p.id)
          ),
      ]);

      const profileMap: Record<string, string> = {};
      profilesRes.data?.forEach((p) => {
        profileMap[p.id] = p.full_name || 'Carnavalero';
      });

      const nicknameMap: Record<string, string | null> = {};
      contactRes.data?.forEach((c) => {
        nicknameMap[c.id] = c.nickname;
      });

      const likedPostIds = new Set(likesRes.data?.map((l) => l.post_id) || []);

      const enrichedPosts: PostWithAuthor[] = postsData.map((p) => ({
        ...p,
        author_name: profileMap[p.user_id] || 'Carnavalero',
        author_nickname: nicknameMap[p.user_id] || null,
        is_liked: likedPostIds.has(p.id),
      }));

      if (replace) {
        setPosts(enrichedPosts);
      } else {
        setPosts((prev) => [...prev, ...enrichedPosts]);
      }

      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    },
    [user, fetchFriendIds]
  );

  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts(0, true);
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          fetchPosts(posts.length);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading, posts.length]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await fetchPosts(0, true);
  };

  const toggleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              is_liked: !currentlyLiked,
              likes_count: currentlyLiked ? p.likes_count - 1 : p.likes_count + 1,
            }
          : p
      )
    );

    // Trigger animation
    if (!currentlyLiked) {
      setLikeAnimations((prev) => ({ ...prev, [postId]: true }));
      setTimeout(() => {
        setLikeAnimations((prev) => ({ ...prev, [postId]: false }));
      }, 600);
    }

    if (currentlyLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      await supabase
        .from('posts')
        .update({ likes_count: Math.max(0, posts.find((p) => p.id === postId)!.likes_count - 1) })
        .eq('id', postId);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });

      await supabase
        .from('posts')
        .update({ likes_count: (posts.find((p) => p.id === postId)?.likes_count || 0) + 1 })
        .eq('id', postId);
    }
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !user) return;

    await supabase.from('post_comments').insert({
      post_id: postId,
      user_id: user.id,
      content,
    });

    await supabase
      .from('posts')
      .update({
        comments_count: (posts.find((p) => p.id === postId)?.comments_count || 0) + 1,
      })
      .eq('id', postId);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
      )
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const displayName = (post: PostWithAuthor) =>
    post.author_nickname || post.author_name.split(' ')[0].toLowerCase();

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#001113]">Feed de Amigos</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={20}
              className={`text-[#001113] ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

          {/* Auth guard */}
          {!authLoading && !user && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E83331] via-[#FFCE38] to-[#00AB25] flex items-center justify-center">
                <Users size={32} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-[#001113] mb-2">
                Inicia sesion para ver el feed
              </h2>
              <Link
                href="/auth"
                className="inline-block mt-4 px-6 py-2.5 bg-[#E83331] text-white rounded-full font-medium hover:bg-[#c92a28] transition-colors"
              >
                Iniciar Sesion
              </Link>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && user && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && user && posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎭</div>
              <h2 className="text-lg font-semibold text-[#001113] mb-2">
                Conecta con otros carnavaleros para ver su contenido
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Agrega amigos y su contenido aparecera aqui
              </p>
              <Link
                href="/cuenta/amigos"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E83331] text-white rounded-full font-medium hover:bg-[#c92a28] transition-colors"
              >
                <Users size={18} />
                Buscar Amigos
              </Link>
            </div>
          )}

          {/* Posts feed */}
          {!loading && posts.length > 0 && (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3 p-4">
                    <Link href={`/carnavalero/${post.user_id}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E83331] via-[#FFCE38] to-[#00AB25] p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                          <span className="text-xs font-bold text-[#001113]">
                            {getInitials(post.author_name)}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/carnavalero/${post.user_id}`}
                        className="font-semibold text-sm text-[#001113] hover:underline truncate block"
                      >
                        {displayName(post)}
                      </Link>
                      <span className="text-xs text-gray-400">
                        {timeAgo(post.created_at)}
                        {post.category && (
                          <>
                            {' '}
                            &middot;{' '}
                            <span className="text-[#0064C8]">{post.category}</span>
                          </>
                        )}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setPostMenuOpen(postMenuOpen === post.id ? null : post.id)
                        }
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreHorizontal size={20} className="text-gray-400" />
                      </button>
                      {postMenuOpen === post.id && (
                        <div className="absolute right-0 top-8 z-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
                          <Link
                            href={`/red-social/post/${post.id}`}
                            className="block px-4 py-2 text-sm text-[#001113] hover:bg-gray-50"
                            onClick={() => setPostMenuOpen(null)}
                          >
                            Ver publicacion
                          </Link>
                          <Link
                            href={`/carnavalero/${post.user_id}`}
                            className="block px-4 py-2 text-sm text-[#001113] hover:bg-gray-50"
                            onClick={() => setPostMenuOpen(null)}
                          >
                            Ver perfil
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Media */}
                  <div className="relative w-full bg-gray-100">
                    {post.media_type === 'video' ? (
                      <div className="relative">
                        <video
                          src={post.media_url}
                          poster={post.thumbnail_url || undefined}
                          className="w-full object-cover max-h-[600px]"
                          controls
                          preload="metadata"
                          playsInline
                        />
                        {!post.thumbnail_url && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                              <Play size={28} className="text-white ml-1" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={post.media_url}
                          alt={post.caption || 'Publicacion'}
                          className="w-full object-cover max-h-[600px]"
                          loading="lazy"
                          onDoubleClick={() => {
                            if (!post.is_liked) toggleLike(post.id, false);
                          }}
                        />
                        {/* Double-tap like animation */}
                        {likeAnimations[post.id] && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Heart
                              size={80}
                              className="text-white fill-white animate-ping"
                              style={{ animationDuration: '0.6s', animationIterationCount: 1 }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id, post.is_liked)}
                          className="hover:scale-110 transition-transform active:scale-90"
                        >
                          <Heart
                            size={24}
                            className={
                              post.is_liked
                                ? 'text-[#E83331] fill-[#E83331]'
                                : 'text-[#001113]'
                            }
                          />
                        </button>
                        <Link href={`/red-social/post/${post.id}`}>
                          <MessageCircle
                            size={24}
                            className="text-[#001113] hover:text-gray-600 transition-colors"
                          />
                        </Link>
                        <button className="hover:scale-110 transition-transform">
                          <Send
                            size={22}
                            className="text-[#001113] hover:text-gray-600 transition-colors"
                          />
                        </button>
                      </div>
                      <div className="ml-auto">
                        <button className="hover:scale-110 transition-transform">
                          <Bookmark
                            size={24}
                            className="text-[#001113] hover:text-gray-600 transition-colors"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Like count */}
                    {post.likes_count > 0 && (
                      <p className="font-semibold text-sm text-[#001113]">
                        {post.likes_count.toLocaleString('es-CO')}{' '}
                        {post.likes_count === 1 ? 'Me gusta' : 'Me gusta'}
                      </p>
                    )}

                    {/* Caption */}
                    {post.caption && (
                      <p className="text-sm text-[#001113]">
                        <Link
                          href={`/carnavalero/${post.user_id}`}
                          className="font-semibold hover:underline mr-1"
                        >
                          {displayName(post)}
                        </Link>
                        {post.caption}
                      </p>
                    )}

                    {/* Comments link */}
                    {post.comments_count > 0 && (
                      <Link
                        href={`/red-social/post/${post.id}`}
                        className="text-sm text-gray-400 hover:text-gray-500 block"
                      >
                        Ver los {post.comments_count} comentarios
                      </Link>
                    )}

                    {/* Comment input */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
                      <input
                        type="text"
                        placeholder="Agregar un comentario..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitComment(post.id);
                        }}
                        className="flex-1 text-sm bg-transparent outline-none placeholder-gray-300 text-[#001113] py-2"
                      />
                      {commentInputs[post.id]?.trim() && (
                        <button
                          onClick={() => submitComment(post.id)}
                          className="text-sm font-semibold text-[#0064C8] hover:text-[#004fa0] transition-colors"
                        >
                          Publicar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="py-4 flex justify-center">
                {loadingMore && (
                  <Loader2 size={24} className="text-[#E83331] animate-spin" />
                )}
                {!hasMore && posts.length > 0 && (
                  <p className="text-sm text-gray-400">
                    Ya viste todas las publicaciones de tus amigos
                  </p>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
