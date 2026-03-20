'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, UserPlus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface Notification {
  id: string;
  actor_id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  post_id: string | null;
  content: string | null;
  read: boolean;
  created_at: string;
  actor_name: string;
  actor_nickname: string | null;
  post_media_url: string | null;
}

function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'ahora';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return `${Math.floor(s / 604800)}sem`;
}

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ActividadPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedBack, setFollowedBack] = useState<Set<string>>(new Set());

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();

    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!notifs || notifs.length === 0) { setLoading(false); return; }

    // Get actor info
    const actorIds = [...new Set(notifs.map(n => n.actor_id))];
    const [profilesRes, contactsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').in('id', actorIds),
      supabase.from('contact_info').select('id, nickname').in('id', actorIds),
    ]);

    const nameMap: Record<string, string> = {};
    profilesRes.data?.forEach(p => { nameMap[p.id] = p.full_name || 'Carnavalero'; });
    const nickMap: Record<string, string | null> = {};
    contactsRes.data?.forEach(c => { nickMap[c.id] = c.nickname; });

    // Get post thumbnails
    const postIds = notifs.map(n => n.post_id).filter(Boolean) as string[];
    let postMap: Record<string, string> = {};
    if (postIds.length > 0) {
      const { data: postsData } = await supabase.from('posts').select('id, media_url').in('id', postIds);
      postsData?.forEach(p => { postMap[p.id] = p.media_url; });
    }

    // Check which actors we already follow back
    const { data: followsData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)
      .in('following_id', actorIds);
    const followingSet = new Set(followsData?.map(f => f.following_id) || []);
    setFollowedBack(followingSet);

    setNotifications(notifs.map(n => ({
      ...n,
      actor_name: nameMap[n.actor_id] || 'Carnavalero',
      actor_nickname: nickMap[n.actor_id] || null,
      post_media_url: n.post_id ? postMap[n.post_id] || null : null,
    })));

    // Mark all as read
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setLoading(false);
  }, [user]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const followBack = async (actorId: string) => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from('follows').insert({ follower_id: user.id, following_id: actorId });
    await supabase.from('notifications').insert({ user_id: actorId, actor_id: user.id, type: 'follow' });
    setFollowedBack(prev => new Set([...prev, actorId]));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-carnaval-red fill-carnaval-red" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-carnaval-blue" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-carnaval-green" />;
      default: return <Heart className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMessage = (n: Notification) => {
    const name = <span className="font-semibold">{n.actor_nickname || n.actor_name.split(' ')[0]}</span>;
    switch (n.type) {
      case 'like': return <>{name} le dio me gusta a tu publicación.</>;
      case 'comment': return <>{name} comentó: {n.content?.slice(0, 50)}</>;
      case 'follow': return <>{name} comenzó a seguirte.</>;
      case 'mention': return <>{name} te mencionó en un comentario.</>;
      default: return <>{name} interactuó contigo.</>;
    }
  };

  // Group by time
  const today: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];
  const now = Date.now();

  notifications.forEach(n => {
    const age = now - new Date(n.created_at).getTime();
    if (age < 86400000) today.push(n);
    else if (age < 604800000) thisWeek.push(n);
    else earlier.push(n);
  });

  return (
    <div className="min-h-full bg-white">
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-lg font-bold text-brand-dark">Actividad</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-carnaval-red animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 px-6">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-brand-dark mb-1">Sin actividad</h2>
          <p className="text-sm text-gray-400">Cuando alguien interactúe con tu contenido, aparecerá aquí</p>
        </div>
      ) : (
        <div>
          {today.length > 0 && <NotifSection title="Hoy" notifs={today} getIcon={getIcon} getMessage={getMessage} followedBack={followedBack} followBack={followBack} />}
          {thisWeek.length > 0 && <NotifSection title="Esta semana" notifs={thisWeek} getIcon={getIcon} getMessage={getMessage} followedBack={followedBack} followBack={followBack} />}
          {earlier.length > 0 && <NotifSection title="Anteriores" notifs={earlier} getIcon={getIcon} getMessage={getMessage} followedBack={followedBack} followBack={followBack} />}
        </div>
      )}
    </div>
  );
}

function NotifSection({ title, notifs, getIcon, getMessage, followedBack, followBack }: {
  title: string;
  notifs: Notification[];
  getIcon: (type: string) => JSX.Element;
  getMessage: (n: Notification) => JSX.Element;
  followedBack: Set<string>;
  followBack: (id: string) => void;
}) {
  return (
    <div>
      <p className="px-4 py-2 text-[13px] font-semibold text-brand-dark">{title}</p>
      {notifs.map(n => (
        <div key={n.id} className={`flex items-center gap-3 px-4 py-2.5 ${!n.read ? 'bg-carnaval-blue/5' : ''}`}>
          {/* Avatar */}
          <Link href={`/red-social/perfil/${n.actor_id}`}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
              {initials(n.actor_name)}
            </div>
          </Link>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-brand-dark leading-snug">
              {getMessage(n)}{' '}
              <span className="text-gray-400">{timeAgo(n.created_at)}</span>
            </p>
          </div>

          {/* Right side: follow button or post thumbnail */}
          {n.type === 'follow' && !followedBack.has(n.actor_id) ? (
            <button
              onClick={() => followBack(n.actor_id)}
              className="shrink-0 px-4 py-1.5 bg-carnaval-blue text-white text-xs font-semibold rounded-lg"
            >
              Seguir
            </button>
          ) : n.type === 'follow' && followedBack.has(n.actor_id) ? (
            <span className="shrink-0 px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-lg">
              Siguiendo
            </span>
          ) : n.post_media_url ? (
            <Link href={`/red-social/post/${n.post_id}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={n.post_media_url} alt="" className="w-10 h-10 rounded object-cover" />
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
