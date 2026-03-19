'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Flag,
  Link2,
  Trash2,
  ArrowLeft,
  MapPin,
  Loader2,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────── */

interface Profile {
  id: string;
  full_name: string | null;
  city: string | null;
  country: string | null;
}

interface ContactInfo {
  nickname: string | null;
  slogan: string | null;
}

interface Post {
  id: string;
  user_id: string;
  caption: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  thumbnail_url: string | null;
  category: string | null;
  visibility: 'public' | 'friends' | 'private';
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: Profile;
  contact_info: ContactInfo | null;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
  contact_info: ContactInfo | null;
}

/* ─── Helpers ────────────────────────────────────────────── */

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Ahora';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function displayName(profile: Profile, contactInfo: ContactInfo | null): string {
  return contactInfo?.nickname || profile.full_name || 'Usuario';
}

/* ─── Avatar ─────────────────────────────────────────────── */

function Avatar({ name, size = 32 }: { name: string | null; size?: number }) {
  const fontSize = size < 28 ? 10 : size < 40 ? 12 : 14;
  return (
    <div
      className="shrink-0 rounded-full flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        fontSize,
        background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)',
      }}
    >
      {getInitials(name)}
    </div>
  );
}

/* ─── Main Page Component ────────────────────────────────── */

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const commentInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  /* ── Fetch post ── */
  const fetchPost = useCallback(async () => {
    const { data: postData, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !postData) {
      setLoading(false);
      return;
    }

    // Fetch author info separately
    const [profileRes, contactRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', postData.user_id).single(),
      supabase.from('contact_info').select('*').eq('id', postData.user_id).maybeSingle(),
    ]);

    const assembled: Post = {
      ...postData,
      profiles: profileRes.data || { id: postData.user_id, full_name: 'Carnavalero', city: null, country: null },
      contact_info: contactRes.data || null,
    };

    setPost(assembled);
    setLikesCount(postData.likes_count ?? 0);
    setLoading(false);
  }, [postId]);

  /* ── Fetch comments ── */
  const fetchComments = useCallback(async () => {
    const { data: commentsData } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!commentsData || commentsData.length === 0) {
      setComments([]);
      return;
    }

    // Fetch author info for commenters
    const userIds = [...new Set(commentsData.map((c) => c.user_id))];
    const [profilesRes, contactsRes] = await Promise.all([
      supabase.from('profiles').select('*').in('id', userIds),
      supabase.from('contact_info').select('*').in('id', userIds),
    ]);

    const profileMap: Record<string, Profile> = {};
    profilesRes.data?.forEach((p) => { profileMap[p.id] = p; });
    const contactMap: Record<string, ContactInfo> = {};
    contactsRes.data?.forEach((c) => { contactMap[c.id] = c; });

    const enriched: Comment[] = commentsData.map((c) => ({
      ...c,
      profiles: profileMap[c.user_id] || { id: c.user_id, full_name: 'Carnavalero', city: null, country: null },
      contact_info: contactMap[c.user_id] || null,
    }));

    setComments(enriched);
  }, [postId]);

  /* ── Check if liked ── */
  const checkLiked = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    setLiked(!!data);
  }, [postId, user]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  useEffect(() => {
    if (!authLoading) checkLiked();
  }, [authLoading, checkLiked]);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ── Like toggle ── */
  const toggleLike = async () => {
    if (!user) return;

    if (liked) {
      setLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      await supabase
        .from('posts')
        .update({ likes_count: Math.max(0, likesCount - 1) })
        .eq('id', postId);
    } else {
      setLiked(true);
      setLikesCount((c) => c + 1);
      await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });
      await supabase
        .from('posts')
        .update({ likes_count: likesCount + 1 })
        .eq('id', postId);
    }
  };

  /* ── Add comment ── */
  const addComment = async () => {
    if (!user || !commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    const content = commentText.trim();
    setCommentText('');

    // Optimistic comment
    const optimistic: Comment = {
      id: crypto.randomUUID(),
      post_id: postId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      profiles: {
        id: user.id,
        full_name: user.user_metadata?.full_name || 'Tu',
        city: null,
        country: null,
      },
      contact_info: null,
    };
    setComments((prev) => [...prev, optimistic]);

    const { error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: user.id, content });

    if (!error) {
      await supabase
        .from('posts')
        .update({ comments_count: (post?.comments_count ?? 0) + 1 })
        .eq('id', postId);
      // Refresh comments to get real data
      fetchComments();
    }
    setSubmittingComment(false);
  };

  /* ── Delete post ── */
  const deletePost = async () => {
    if (!user || !post || post.user_id !== user.id) return;
    if (!confirm('¿Eliminar esta publicacion?')) return;

    await supabase.from('posts').delete().eq('id', postId);
    router.push('/red-social');
  };

  /* ── Share / copy link ── */
  const copyLink = async () => {
    const url = `${window.location.origin}/red-social/post/${postId}`;
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setMenuOpen(false);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-carnaval-red animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-full bg-white flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-gray-500 text-lg">Publicación no encontrada</p>
        <button
          onClick={() => router.push('/red-social')}
          className="text-carnaval-red hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>
    );
  }

  const authorName = displayName(post.profiles, post.contact_info);
  const isOwner = user?.id === post.user_id;
  const location = [post.profiles.city, post.profiles.country].filter(Boolean).join(', ');

  /* ── Render ── */
  return (
    <div className="min-h-full bg-white">
      {/* Toast for copied link */}
      {copiedLink && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-carnaval-green text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          Enlace copiado ✓
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Post media */}
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
            <img
              src={post.media_url || '/placeholder.jpg'}
              alt={post.caption || 'Post'}
              className="w-full max-h-[500px] object-contain"
            />
          )}
        </div>

        {/* Post header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={post.profiles.full_name} size={36} />
            <div className="min-w-0">
              <p className="text-brand-dark font-semibold text-sm truncate">{authorName}</p>
              <p className="text-gray-400 text-xs">{timeAgo(post.created_at)}</p>
            </div>
          </div>

          {/* Three-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-brand-dark p-1 transition"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 w-52 bg-white border border-gray-100 rounded-xl shadow-xl z-40 overflow-hidden">
                <button
                  onClick={copyLink}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Link2 className="w-4 h-4" /> Copiar enlace
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Flag className="w-4 h-4" /> Reportar
                </button>
                {isOwner && (
                  <button
                    onClick={deletePost}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-carnaval-red hover:bg-carnaval-red/5 transition border-t border-gray-100"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between px-4 pb-2">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="transition active:scale-90">
              <Heart
                className={`w-6 h-6 transition ${
                  liked
                    ? 'fill-carnaval-red text-carnaval-red scale-110'
                    : 'text-brand-dark hover:text-carnaval-red'
                }`}
              />
            </button>
            <button
              onClick={() => commentInputRef.current?.focus()}
              className="text-brand-dark hover:text-gray-600 transition"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button onClick={copyLink} className="text-brand-dark hover:text-gray-600 transition">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="transition"
          >
            <Bookmark
              className={`w-6 h-6 transition ${
                saved ? 'fill-gold text-gold' : 'text-brand-dark hover:text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Like count */}
        <div className="px-4 pb-1">
          <p className="text-brand-dark font-semibold text-sm">
            {likesCount.toLocaleString()} me gusta
          </p>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="px-4 pb-2">
            <p className="text-brand-dark text-sm leading-relaxed">
              <span className="font-semibold mr-1">{authorName}</span>
              {post.caption}
            </p>
          </div>
        )}

        {/* Category badge */}
        {post.category && (
          <div className="px-4 pb-2">
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-carnaval-red/10 text-carnaval-red">
              {post.category}
            </span>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="px-4 pb-3 flex items-center gap-1.5 text-gray-400 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 mx-4" />

        {/* Comments section */}
        <div className="px-4 pt-3 pb-24">
          {comments.length > 0 && (
            <p className="text-gray-400 text-sm font-medium mb-3">
              {comments.length} comentario{comments.length !== 1 ? 's' : ''}
            </p>
          )}

          <div className="space-y-4">
            {comments.map((comment) => {
              const cName = displayName(comment.profiles, comment.contact_info);
              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar name={comment.profiles.full_name} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-dark text-sm leading-relaxed">
                      <span className="font-semibold mr-1">{cName}</span>
                      {comment.content}
                    </p>
                    <p className="text-gray-300 text-xs mt-0.5">{timeAgo(comment.created_at)}</p>
                  </div>
                </div>
              );
            })}

            {comments.length === 0 && (
              <p className="text-gray-300 text-sm text-center py-6">
                Sin comentarios aún. ¡Sé el primero!
              </p>
            )}
          </div>
        </div>

        {/* Sticky comment input - positioned above bottom nav */}
        <div className="fixed bottom-16 left-0 right-0 border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-3 z-20">
          {user ? (
            <>
              <Avatar name={user.user_metadata?.full_name || null} size={28} />
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Agrega un comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addComment()}
                className="flex-1 bg-transparent text-brand-dark text-sm placeholder:text-gray-300 outline-none"
              />
              <button
                onClick={addComment}
                disabled={!commentText.trim() || submittingComment}
                className="text-carnaval-red font-semibold text-sm disabled:opacity-30 transition"
              >
                Publicar
              </button>
            </>
          ) : (
            <p className="text-gray-400 text-sm w-full text-center py-1">
              Inicia sesión para comentar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
