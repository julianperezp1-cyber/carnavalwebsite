'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  Flag, Link2, Trash2, MapPin, Loader2, Tag, Users,
} from 'lucide-react';

interface PostData {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  thumbnail_url: string | null;
  category: string | null;
  visibility: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface CommentData {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function Avatar({ name, size = 32 }: { name: string | null; size?: number }) {
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-bold"
      style={{
        width: size, height: size,
        fontSize: size < 28 ? 10 : size < 40 ? 12 : 14,
        background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)',
      }}
    >
      {getInitials(name)}
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<PostData | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [authorName, setAuthorName] = useState('Carnavalero');
  const [authorNickname, setAuthorNickname] = useState<string | null>(null);
  const [authorUsername, setAuthorUsername] = useState<string | null>(null);
  const [taggedUsers, setTaggedUsers] = useState<{ id: string; full_name: string; username: string | null }[]>([]);
  const [comments, setComments] = useState<(CommentData & { author_name: string; author_nickname: string | null; author_username: string | null })[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchPost = useCallback(async () => {
    const supabase = createClient();
    const { data: postData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !postData) {
      setLoading(false);
      return;
    }

    // Visibility access check
    if (postData.visibility === 'private' && postData.user_id !== user?.id) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    if (postData.visibility === 'close_friends' && postData.user_id !== user?.id) {
      if (!user) { setAccessDenied(true); setLoading(false); return; }
      const { data: conn } = await supabase
        .from('connections')
        .select('status')
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${postData.user_id}),and(requester_id.eq.${postData.user_id},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .maybeSingle();
      if (!conn) { setAccessDenied(true); setLoading(false); return; }
    }

    setPost(postData);
    setLikesCount(postData.likes_count ?? 0);

    // Fetch author info
    const [profileRes, contactRes] = await Promise.all([
      supabase.from('profiles').select('full_name, username').eq('id', postData.user_id).single(),
      supabase.from('contact_info').select('nickname').eq('id', postData.user_id).maybeSingle(),
    ]);

    setAuthorName(profileRes.data?.full_name || 'Carnavalero');
    setAuthorNickname(contactRes.data?.nickname || null);
    setAuthorUsername(profileRes.data?.username || null);

    // Fetch tagged users
    const { data: tags } = await supabase
      .from('post_tags')
      .select('tagged_user_id')
      .eq('post_id', postId);
    if (tags && tags.length > 0) {
      const taggedIds = tags.map(t => t.tagged_user_id);
      const { data: taggedProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', taggedIds);
      setTaggedUsers(taggedProfiles || []);
    }

    // Check saved status
    if (user) {
      const { data: savedData } = await supabase.from('saved_posts').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
      setSaved(!!savedData);
    }

    setLoading(false);
  }, [postId, user]);

  const fetchComments = useCallback(async () => {
    const supabase = createClient();
    const { data: commentsData } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      return;
    }

    const userIds = [...new Set(commentsData.map(c => c.user_id))];
    const [profilesRes, contactsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, username').in('id', userIds),
      supabase.from('contact_info').select('id, nickname').in('id', userIds),
    ]);

    const profileMap: Record<string, string> = {};
    const usernameMap: Record<string, string | null> = {};
    profilesRes.data?.forEach(p => { profileMap[p.id] = p.full_name || 'Carnavalero'; usernameMap[p.id] = p.username || null; });
    const contactMap: Record<string, string | null> = {};
    contactsRes.data?.forEach(c => { contactMap[c.id] = c.nickname; });

    setComments(commentsData.map(c => ({
      ...c,
      author_name: profileMap[c.user_id] || 'Carnavalero',
      author_nickname: contactMap[c.user_id] || null,
      author_username: usernameMap[c.user_id] || null,
    })));
  }, [postId]);

  const checkLiked = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();
    setLiked(!!data);
  }, [postId, user]);

  useEffect(() => { fetchPost(); fetchComments(); }, [fetchPost, fetchComments]);
  useEffect(() => { if (!authLoading) checkLiked(); }, [authLoading, checkLiked]);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleLike = async () => {
    if (!user) return;
    const supabase = createClient();
    if (liked) {
      setLiked(false);
      setLikesCount(c => Math.max(0, c - 1));
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikesCount(c => c + 1);
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      // Create notification for post author
      if (post && post.user_id !== user.id) {
        await supabase.from('notifications').insert({ user_id: post.user_id, actor_id: user.id, type: 'like', post_id: postId });
      }
    }
  };

  const toggleSave = async () => {
    if (!user) return;
    const supabase = createClient();
    if (saved) {
      setSaved(false);
      await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      setSaved(true);
      await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
    }
  };

  const addComment = async () => {
    if (!user || !commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    const supabase = createClient();
    const content = commentText.trim();
    setCommentText('');

    // Optimistic comment
    setComments(prev => [...prev, {
      id: crypto.randomUUID(),
      post_id: postId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      author_name: user.user_metadata?.full_name || 'Tú',
      author_nickname: null,
      author_username: null,
    }]);

    await supabase.from('post_comments').insert({ post_id: postId, user_id: user.id, content });
    // Create notification for post author
    if (post && post.user_id !== user.id) {
      await supabase.from('notifications').insert({ user_id: post.user_id, actor_id: user.id, type: 'comment', post_id: postId, content });
    }
    fetchComments();
    setSubmittingComment(false);
  };

  const deletePost = async () => {
    if (!user || !post || post.user_id !== user.id) return;
    if (!confirm('¿Eliminar esta publicación?')) return;
    const supabase = createClient();
    await supabase.from('posts').delete().eq('id', postId);
    // Decrement posts_count
    const { data: profileData } = await supabase.from('profiles').select('posts_count').eq('id', user.id).single();
    if (profileData) {
      await supabase.from('profiles').update({ posts_count: Math.max(0, (profileData.posts_count || 1) - 1) }).eq('id', user.id);
    }
    router.push('/red-social');
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/red-social/post/${postId}`); } catch {};
    setCopiedLink(true);
    setMenuOpen(false);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-carnaval-red animate-spin" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-full bg-white flex flex-col items-center justify-center gap-4 py-20 px-6">
        <Users className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 text-lg text-center">Esta publicación es privada</p>
        <p className="text-gray-400 text-sm text-center">Solo los amigos carnavaleros pueden ver este contenido</p>
        <button onClick={() => router.push('/red-social')} className="text-carnaval-red hover:underline text-sm">← Volver al feed</button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-full bg-white flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-gray-500 text-lg">Publicación no encontrada</p>
        <button onClick={() => router.push('/red-social')} className="text-carnaval-red hover:underline text-sm">
          ← Volver al feed
        </button>
      </div>
    );
  }

  const displayAuthor = authorUsername ? `@${authorUsername}` : (authorNickname || authorName.split(' ')[0]);
  const isOwner = user?.id === post.user_id;

  return (
    <div className="min-h-full bg-white">
      {/* Copied link toast */}
      {copiedLink && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-carnaval-green text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          Enlace copiado ✓
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* ═══ POST HEADER ═══ */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Link href={`/red-social/perfil/${post.user_id}`}>
            <div className="w-9 h-9 rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <span className="text-[11px] font-bold text-brand-dark">{getInitials(authorName)}</span>
              </div>
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/red-social/perfil/${post.user_id}`} className="text-[13px] font-semibold text-brand-dark hover:underline block truncate">
              {displayAuthor}
            </Link>
            {post.category && <span className="text-[11px] text-gray-400">{post.category}</span>}
          </div>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-brand-dark p-1 transition">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-40 overflow-hidden">
                <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  <Link2 className="w-4 h-4" /> Copiar enlace
                </button>
                <button onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition">
                  <Flag className="w-4 h-4" /> Reportar
                </button>
                {isOwner && (
                  <button onClick={deletePost} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-carnaval-red hover:bg-carnaval-red/5 transition border-t border-gray-100">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ═══ MEDIA ═══ */}
        <div className="bg-gray-100">
          {post.media_type === 'video' ? (
            <video
              src={post.media_url || undefined}
              poster={post.thumbnail_url || undefined}
              controls
              playsInline
              className="w-full max-h-[500px] object-contain"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.media_url || '/placeholder.jpg'}
              alt={post.caption || 'Post del Carnaval'}
              className="w-full max-h-[500px] object-contain"
            />
          )}
        </div>

        {/* ═══ ACTIONS ═══ */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="transition active:scale-90">
              <Heart className={`w-6 h-6 transition ${liked ? 'fill-carnaval-red text-carnaval-red' : 'text-brand-dark hover:text-carnaval-red'}`} />
            </button>
            <button onClick={() => commentInputRef.current?.focus()} className="text-brand-dark hover:text-gray-600 transition">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button onClick={copyLink} className="text-brand-dark hover:text-gray-600 transition">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button onClick={toggleSave} className="active:scale-90 transition-transform">
            <Bookmark className={`w-6 h-6 transition ${saved ? 'text-brand-dark fill-brand-dark' : 'text-brand-dark'}`} />
          </button>
        </div>

        {/* ═══ LIKES ═══ */}
        <div className="px-4 pb-1">
          <p className="text-brand-dark font-semibold text-[13px]">
            {likesCount.toLocaleString()} me gusta
          </p>
        </div>

        {/* ═══ CAPTION ═══ */}
        {post.caption && (
          <div className="px-4 pb-2">
            <p className="text-[13px] text-brand-dark leading-relaxed">
              <Link href={`/red-social/perfil/${post.user_id}`} className="font-semibold mr-1 hover:underline">{displayAuthor}</Link>
              {post.caption}
            </p>
          </div>
        )}

        {/* ═══ CATEGORY BADGE ═══ */}
        {post.category && (
          <div className="px-4 pb-2">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-carnaval-red/10 text-carnaval-red">
              {post.category}
            </span>
          </div>
        )}

        {/* ═══ TAGGED USERS ═══ */}
        {taggedUsers.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {taggedUsers.map(t => (
                <Link key={t.id} href={`/red-social/perfil/${t.id}`}
                  className="text-xs font-medium text-carnaval-blue hover:underline">
                  {t.username ? `@${t.username}` : t.full_name.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ═══ VISIBILITY BADGE ═══ */}
        {post.visibility === 'close_friends' && (
          <div className="px-4 pb-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-carnaval-green/10 text-carnaval-green">
              <Users className="w-3 h-3" /> Solo amigos carnavaleros
            </span>
          </div>
        )}

        {/* ═══ TIMESTAMP ═══ */}
        <div className="px-4 pb-3">
          <span className="text-[10px] text-gray-300 uppercase tracking-wide">{timeAgo(post.created_at)}</span>
        </div>

        <div className="border-t border-gray-100 mx-4" />

        {/* ═══ COMMENTS ═══ */}
        <div className="px-4 pt-3 pb-24">
          {comments.length > 0 && (
            <p className="text-gray-400 text-sm font-medium mb-3">
              {comments.length} comentario{comments.length !== 1 ? 's' : ''}
            </p>
          )}

          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Link href={`/red-social/perfil/${comment.user_id}`}>
                  <Avatar name={comment.author_name} size={28} />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-dark text-[13px] leading-relaxed">
                    <Link href={`/red-social/perfil/${comment.user_id}`} className="font-semibold mr-1 hover:underline">
                      {comment.author_username ? `@${comment.author_username}` : (comment.author_nickname || comment.author_name.split(' ')[0])}
                    </Link>
                    {comment.content}
                  </p>
                  <p className="text-gray-300 text-[11px] mt-0.5">{timeAgo(comment.created_at)}</p>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-gray-300 text-sm text-center py-6">
                Sin comentarios aún. ¡Sé el primero!
              </p>
            )}
          </div>
        </div>

        {/* ═══ STICKY COMMENT INPUT ═══ */}
        <div className="fixed bottom-16 left-0 right-0 border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-3 z-20">
          {user ? (
            <>
              <Avatar name={user.user_metadata?.full_name || null} size={28} />
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Agrega un comentario..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
                className="flex-1 bg-transparent text-brand-dark text-[13px] placeholder:text-gray-300 outline-none"
              />
              <button
                onClick={addComment}
                disabled={!commentText.trim() || submittingComment}
                className="text-carnaval-red font-semibold text-[13px] disabled:opacity-30 transition"
              >
                Publicar
              </button>
            </>
          ) : (
            <p className="text-gray-400 text-sm w-full text-center py-1">
              <Link href="/cuenta" className="text-carnaval-red hover:underline">Inicia sesión</Link> para comentar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
