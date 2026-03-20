'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Camera, Loader2, Plus, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

/* ─── Types ─── */
interface Story {
  user_id: string;
  user_name: string;
  has_unseen: boolean;
  latest_media_url: string;
  story_count: number;
}

interface PostWithAuthor {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url: string | null;
  category: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author_name: string;
  author_nickname: string | null;
  is_liked: boolean;
  is_saved: boolean;
}

interface SuggestedUser {
  id: string;
  full_name: string;
  nickname: string | null;
  posts_count: number;
}

/* ─── Helpers ─── */
function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'ahora';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(d).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likeAnims, setLikeAnims] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const PAGE_SIZE = 8;

  /* ── Fetch Stories ── */
  const fetchStories = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();

    // Get people user follows
    const { data: followsData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = followsData?.map(f => f.following_id) || [];
    const allIds = [user.id, ...followingIds];

    // Get active stories from followed users
    const { data: storiesData } = await supabase
      .from('stories')
      .select('id, user_id, media_url, created_at')
      .in('user_id', allIds)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (!storiesData || storiesData.length === 0) {
      setStories([]);
      return;
    }

    // Get viewed story IDs
    const { data: viewsData } = await supabase
      .from('story_views')
      .select('story_id')
      .eq('viewer_id', user.id)
      .in('story_id', storiesData.map(s => s.id));

    const viewedSet = new Set(viewsData?.map(v => v.story_id) || []);

    // Get user names
    const userIds = [...new Set(storiesData.map(s => s.user_id))];
    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
    const nameMap: Record<string, string> = {};
    profiles?.forEach(p => { nameMap[p.id] = p.full_name || 'Carnavalero'; });

    // Group by user
    const userStories: Record<string, Story> = {};
    storiesData.forEach(s => {
      if (!userStories[s.user_id]) {
        userStories[s.user_id] = {
          user_id: s.user_id,
          user_name: nameMap[s.user_id] || 'Carnavalero',
          has_unseen: false,
          latest_media_url: s.media_url,
          story_count: 0,
        };
      }
      userStories[s.user_id].story_count++;
      if (!viewedSet.has(s.id)) userStories[s.user_id].has_unseen = true;
    });

    // Put current user first, then unseen first
    const arr = Object.values(userStories);
    arr.sort((a, b) => {
      if (a.user_id === user.id) return -1;
      if (b.user_id === user.id) return 1;
      if (a.has_unseen && !b.has_unseen) return -1;
      if (!a.has_unseen && b.has_unseen) return 1;
      return 0;
    });

    setStories(arr);
  }, [user]);

  /* ── Fetch Suggested Users ── */
  const fetchSuggested = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();

    const { data: followsData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = new Set(followsData?.map(f => f.following_id) || []);
    followingIds.add(user.id);

    // Get users not yet followed, with posts
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name, posts_count')
      .gt('posts_count', 0)
      .order('posts_count', { ascending: false })
      .limit(20);

    if (!users) return;

    const filtered = users
      .filter(u => !followingIds.has(u.id))
      .slice(0, 5);

    // Get nicknames
    const ids = filtered.map(u => u.id);
    const { data: contacts } = await supabase.from('contact_info').select('id, nickname').in('id', ids);
    const nickMap: Record<string, string | null> = {};
    contacts?.forEach(c => { nickMap[c.id] = c.nickname; });

    setSuggested(filtered.map(u => ({
      id: u.id,
      full_name: u.full_name || 'Carnavalero',
      nickname: nickMap[u.id] || null,
      posts_count: u.posts_count || 0,
    })));
  }, [user]);

  /* ── Fetch Posts ── */
  const fetchPosts = useCallback(async (page: number, reset = false) => {
    if (!user) return;
    if (page > 0) setLoadingMore(true);
    else setLoading(true);

    const supabase = createClient();

    // Get following IDs
    const { data: followsData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = followsData?.map(f => f.following_id) || [];
    const feedIds = [user.id, ...followingIds];

    let query = supabase
      .from('posts')
      .select('*')
      .in('user_id', feedIds)
      .in('visibility', ['public', 'friends'])
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    // If not following anyone, show all public posts
    if (followingIds.length === 0) {
      query = supabase
        .from('posts')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    }

    const { data: postsData } = await query;
    if (!postsData) { setLoading(false); setLoadingMore(false); return; }

    // Enrich with author info
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const [profilesRes, contactRes, likesRes, savesRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').in('id', userIds),
      supabase.from('contact_info').select('id, nickname').in('id', userIds),
      supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postsData.map(p => p.id)),
      supabase.from('saved_posts').select('post_id').eq('user_id', user.id).in('post_id', postsData.map(p => p.id)),
    ]);

    const nameMap: Record<string, string> = {};
    profilesRes.data?.forEach(p => { nameMap[p.id] = p.full_name || 'Carnavalero'; });
    const nickMap: Record<string, string | null> = {};
    contactRes.data?.forEach(c => { nickMap[c.id] = c.nickname; });
    const likedSet = new Set(likesRes.data?.map(l => l.post_id) || []);
    const savedSet = new Set(savesRes.data?.map(s => s.post_id) || []);

    const enriched: PostWithAuthor[] = postsData.map(p => ({
      ...p,
      author_name: nameMap[p.user_id] || 'Carnavalero',
      author_nickname: nickMap[p.user_id] || null,
      is_liked: likedSet.has(p.id),
      is_saved: savedSet.has(p.id),
    }));

    if (reset || page === 0) setPosts(enriched);
    else setPosts(prev => [...prev, ...enriched]);

    setHasMore(postsData.length === PAGE_SIZE);
    setLoading(false);
    setLoadingMore(false);
  }, [user]);

  /* ── Init ── */
  useEffect(() => {
    fetchStories();
    fetchSuggested();
    pageRef.current = 0;
    fetchPosts(0, true);
  }, [fetchStories, fetchSuggested, fetchPosts]);

  /* ── Infinite scroll ── */
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

  /* ── Actions ── */
  const toggleLike = async (postId: string, liked: boolean) => {
    if (!user) return;
    setPosts(p => p.map(x => x.id === postId ? { ...x, is_liked: !liked, likes_count: liked ? x.likes_count - 1 : x.likes_count + 1 } : x));
    if (!liked) { setLikeAnims(p => ({ ...p, [postId]: true })); setTimeout(() => setLikeAnims(p => ({ ...p, [postId]: false })), 800); }
    const supabase = createClient();
    if (liked) await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      // Create notification
      const post = posts.find(p => p.id === postId);
      if (post && post.user_id !== user.id) {
        await supabase.from('notifications').insert({ user_id: post.user_id, actor_id: user.id, type: 'like', post_id: postId });
      }
    }
  };

  const toggleSave = async (postId: string, saved: boolean) => {
    if (!user) return;
    setPosts(p => p.map(x => x.id === postId ? { ...x, is_saved: !saved } : x));
    const supabase = createClient();
    if (saved) await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
    else await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !user) return;
    const supabase = createClient();
    await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content });
    setPosts(p => p.map(x => x.id === postId ? { ...x, comments_count: x.comments_count + 1 } : x));
    setCommentInputs(p => ({ ...p, [postId]: '' }));
    // Notification
    const post = posts.find(p => p.id === postId);
    if (post && post.user_id !== user.id) {
      await supabase.from('notifications').insert({ user_id: post.user_id, actor_id: user.id, type: 'comment', post_id: postId, content });
    }
  };

  const followUser = async (userId: string) => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from('follows').insert({ follower_id: user.id, following_id: userId });
    await supabase.from('notifications').insert({ user_id: userId, actor_id: user.id, type: 'follow' });
    setSuggested(s => s.filter(u => u.id !== userId));
    // Refresh feed
    pageRef.current = 0;
    fetchPosts(0, true);
    fetchStories();
  };

  const dn = (p: PostWithAuthor) => p.author_nickname || p.author_name.split(' ')[0];

  return (
    <div className="min-h-full bg-white">
      {/* ═══════════════════ STORIES BAR ═══════════════════ */}
      <div className="border-b border-gray-100 bg-white">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
          {/* My Story */}
          <Link href="/red-social/crear?type=story" className="flex flex-col items-center gap-1 shrink-0">
            <div className="relative">
              <div className="w-[62px] h-[62px] rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                {user ? (user.user_metadata?.full_name || 'U').charAt(0).toUpperCase() : '?'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-carnaval-blue border-2 border-white flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="text-[11px] text-brand-dark w-[64px] text-center truncate">Tu historia</span>
          </Link>

          {/* Other stories */}
          {stories.filter(s => s.user_id !== user?.id).map(story => (
            <Link key={story.user_id} href={`/red-social/stories/${story.user_id}`} className="flex flex-col items-center gap-1 shrink-0">
              <div className={`w-[66px] h-[66px] rounded-full p-[3px] ${story.has_unseen ? '' : 'opacity-60'}`}
                style={{ background: story.has_unseen ? 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' : '#d1d5db' }}>
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38)' }}>
                    {initials(story.user_name)}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-brand-dark w-[64px] text-center truncate">
                {story.user_name.split(' ')[0].toLowerCase()}
              </span>
            </Link>
          ))}

          {/* If no stories, show placeholder */}
          {stories.length <= 1 && (
            <div className="flex items-center pl-2">
              <p className="text-xs text-gray-300 whitespace-nowrap">Sigue personas para ver sus historias</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════ FEED ═══════════════════ */}
      {loading ? (
        <div className="space-y-0">
          {[1, 2, 3].map(i => (
            <div key={i} className="border-b border-gray-100 animate-pulse">
              <div className="flex items-center gap-3 p-3"><div className="w-8 h-8 rounded-full bg-gray-200" /><div className="h-3 w-24 bg-gray-200 rounded" /></div>
              <div className="w-full aspect-[4/5] bg-gray-100" />
              <div className="p-3 space-y-2"><div className="flex gap-3"><div className="w-6 h-6 bg-gray-200 rounded" /><div className="w-6 h-6 bg-gray-200 rounded" /></div><div className="h-3 w-16 bg-gray-200 rounded" /></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-brand-dark flex items-center justify-center">
            <Camera className="w-8 h-8 text-brand-dark" />
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-1">Bienvenido a Carnaval Social</h2>
          <p className="text-sm text-gray-400 mb-6">Sigue carnavaleros y comparte tu experiencia</p>
          <div className="flex gap-3 justify-center">
            <Link href="/red-social/explorar" className="px-6 py-2.5 bg-carnaval-red text-white rounded-lg font-semibold text-sm">
              Explorar contenido
            </Link>
            <Link href="/red-social/crear" className="px-6 py-2.5 bg-brand-dark text-white rounded-lg font-semibold text-sm">
              Publicar
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {posts.map((post, idx) => (
            <div key={post.id}>
              {/* ── Suggested Users Card (after 2nd post) ── */}
              {idx === 2 && suggested.length > 0 && (
                <div className="border-b border-gray-100 py-4">
                  <div className="flex items-center justify-between px-4 mb-3">
                    <span className="text-sm font-semibold text-gray-500">Sugeridos para ti</span>
                    <Link href="/red-social/explorar" className="text-xs font-semibold text-carnaval-blue">Ver todo</Link>
                  </div>
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-1">
                    {suggested.map(u => (
                      <div key={u.id} className="shrink-0 w-[150px] border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white mb-2" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                          {initials(u.full_name)}
                        </div>
                        <p className="text-[13px] font-semibold text-brand-dark truncate w-full">{u.nickname || u.full_name.split(' ')[0]}</p>
                        <p className="text-[11px] text-gray-400 mb-3">{u.posts_count} publicaciones</p>
                        <button
                          onClick={() => followUser(u.id)}
                          className="w-full py-1.5 bg-carnaval-blue text-white text-xs font-semibold rounded-lg hover:bg-carnaval-blue/90 transition-colors"
                        >
                          Seguir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── POST ── */}
              <article className="border-b border-gray-100">
                {/* Header */}
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <Link href={`/red-social/perfil/${post.user_id}`}>
                    <div className="w-8 h-8 rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-[10px] font-bold text-brand-dark">{initials(post.author_name)}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/red-social/perfil/${post.user_id}`} className="text-[13px] font-semibold text-brand-dark hover:underline truncate block">{dn(post)}</Link>
                    {post.category && <span className="text-[11px] text-gray-400">{post.category}</span>}
                  </div>
                  <Link href={`/red-social/post/${post.id}`} className="p-1"><MoreHorizontal className="w-5 h-5 text-gray-400" /></Link>
                </div>

                {/* Media */}
                <div className="relative w-full bg-gray-50 cursor-pointer" onDoubleClick={() => { if (!post.is_liked) toggleLike(post.id, false); }}>
                  {post.media_type === 'video' ? (
                    <video src={post.media_url} poster={post.thumbnail_url || undefined} className="w-full max-h-[580px] object-cover" controls preload="metadata" playsInline />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={post.media_url} alt="" className="w-full max-h-[580px] object-cover" loading="lazy" />
                  )}
                  {likeAnims[post.id] && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <Heart className="w-24 h-24 text-white fill-white animate-ping" style={{ animationDuration: '0.5s', animationIterationCount: '1' }} />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-3 pt-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleLike(post.id, post.is_liked)} className="active:scale-90 transition-transform">
                        <Heart className={`w-[26px] h-[26px] transition ${post.is_liked ? 'text-carnaval-red fill-carnaval-red' : 'text-brand-dark'}`} />
                      </button>
                      <Link href={`/red-social/post/${post.id}`}>
                        <MessageCircle className="w-[26px] h-[26px] text-brand-dark" />
                      </Link>
                      <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/red-social/post/${post.id}`)}>
                        <Send className="w-[24px] h-[24px] text-brand-dark" />
                      </button>
                    </div>
                    <button onClick={() => toggleSave(post.id, post.is_saved)} className="active:scale-90 transition-transform">
                      <Bookmark className={`w-[26px] h-[26px] transition ${post.is_saved ? 'text-brand-dark fill-brand-dark' : 'text-brand-dark'}`} />
                    </button>
                  </div>
                </div>

                {/* Likes */}
                {post.likes_count > 0 && (
                  <p className="px-3 pt-1.5 text-[13px] font-semibold text-brand-dark">
                    {post.likes_count.toLocaleString('es-CO')} Me gusta
                  </p>
                )}

                {/* Caption */}
                {post.caption && (
                  <p className="px-3 pt-1 text-[13px] text-brand-dark leading-relaxed">
                    <Link href={`/red-social/perfil/${post.user_id}`} className="font-semibold mr-1">{dn(post)}</Link>
                    {post.caption}
                  </p>
                )}

                {/* Comments link */}
                {post.comments_count > 0 && (
                  <Link href={`/red-social/post/${post.id}`} className="block px-3 pt-1 text-[13px] text-gray-400">
                    Ver los {post.comments_count} comentarios
                  </Link>
                )}

                {/* Comment input */}
                {user && (
                  <div className="px-3 pt-1.5 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[7px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38)' }}>
                      {(user.user_metadata?.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <input
                      type="text"
                      placeholder="Agregar un comentario..."
                      value={commentInputs[post.id] || ''}
                      onChange={e => setCommentInputs(p => ({ ...p, [post.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') submitComment(post.id); }}
                      className="flex-1 text-[13px] bg-transparent outline-none placeholder-gray-300 text-brand-dark py-1"
                    />
                    {commentInputs[post.id]?.trim() && (
                      <button onClick={() => submitComment(post.id)} className="text-[13px] font-semibold text-carnaval-blue">Publicar</button>
                    )}
                  </div>
                )}

                <p className="px-3 pt-0.5 pb-2.5 text-[10px] text-gray-300 uppercase tracking-wide">{timeAgo(post.created_at)}</p>
              </article>
            </div>
          ))}

          <div ref={sentinelRef} className="h-4" />
          {loadingMore && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-carnaval-red animate-spin" /></div>}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-10 border-t border-gray-100">
              <p className="text-sm text-gray-400">Ya viste todo el contenido 🎭</p>
              <Link href="/red-social/explorar" className="text-sm font-semibold text-carnaval-blue mt-1 inline-block">Explorar más</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
