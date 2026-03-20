'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Grid3X3, Film, ArrowLeft, UserPlus, UserCheck, MessageCircle,
  MoreHorizontal, Loader2, QrCode, Shield, Clock, Users, Heart,
  Mail, Phone, Instagram, CheckCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'info'>('posts');
  const [loading, setLoading] = useState(true);
  const [sendingFriend, setSendingFriend] = useState(false);

  useEffect(() => {
    if (user && userId === user.id) router.replace('/red-social/perfil');
  }, [user, userId, router]);

  const fetchProfile = useCallback(async () => {
    const supabase = createClient();

    const [profileRes, contactRes, followersRes, followingRes, friendsRes] = await Promise.all([
      supabase.from('profiles').select('full_name, bio, username, city, country, email, phone, created_at').eq('id', userId).single(),
      supabase.from('contact_info').select('*').eq('id', userId).maybeSingle(),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
      supabase.from('connections').select('id', { count: 'exact', head: true }).or(`requester_id.eq.${userId},receiver_id.eq.${userId}`).eq('status', 'accepted'),
    ]);

    // Check friend status first to determine which posts to show
    let isFriendWithUser = false;
    if (user) {
      const { data: connData } = await supabase
        .from('connections')
        .select('status')
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${userId}),and(requester_id.eq.${userId},receiver_id.eq.${user.id})`)
        .maybeSingle();
      if (connData?.status === 'accepted') isFriendWithUser = true;
      if (connData) setFriendStatus(connData.status === 'accepted' ? 'accepted' : 'pending');
    }

    // Fetch posts: public always, + followers-only if following, + close_friends if friends
    const isFollowingUser = user ? !!(await supabase.from('follows').select('id').eq('follower_id', user.id).eq('following_id', userId).maybeSingle()).data : false;
    const visibilities = ['public'];
    if (isFollowingUser) visibilities.push('friends');
    if (isFriendWithUser) visibilities.push('close_friends');
    const { data: postsData } = await supabase
      .from('posts')
      .select('id, media_url, media_type, likes_count, comments_count, visibility')
      .eq('user_id', userId)
      .in('visibility', visibilities)
      .order('created_at', { ascending: false });

    setProfile(profileRes.data);
    setContactInfo(contactRes.data);
    setPosts(postsData || []);
    setFollowersCount(followersRes.count || 0);
    setFollowingCount(followingRes.count || 0);
    setFriendsCount(friendsRes.count || 0);

    if (user) {
      // Check follow status
      const { data: followData } = await supabase.from('follows').select('id').eq('follower_id', user.id).eq('following_id', userId).maybeSingle();
      setIsFollowing(!!followData);
    }

    setLoading(false);
  }, [userId, user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const toggleFollow = async () => {
    if (!user) return;
    const supabase = createClient();
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', userId);
      setIsFollowing(false);
      setFollowersCount(c => c - 1);
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: userId });
      await supabase.from('notifications').insert({ user_id: userId, actor_id: user.id, type: 'follow' });
      setIsFollowing(true);
      setFollowersCount(c => c + 1);
    }
  };

  const sendFriendRequest = async () => {
    if (!user) return;
    setSendingFriend(true);
    const supabase = createClient();
    const { error } = await supabase.from('connections').insert({ requester_id: user.id, receiver_id: userId });
    if (!error) {
      setFriendStatus('pending');
      // Notify the receiver about the friend request
      await supabase.from('notifications').insert({ user_id: userId, actor_id: user.id, type: 'follow', content: 'solicitud de amistad' });
    }
    setSendingFriend(false);
  };

  if (loading) {
    return <div className="min-h-full bg-white flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-carnaval-red animate-spin" /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-white flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-gray-500">Usuario no encontrado</p>
        <button onClick={() => router.back()} className="text-sm text-carnaval-red">← Volver</button>
      </div>
    );
  }

  const nickname = contactInfo?.nickname;
  const displayName = profile.username ? `@${profile.username}` : (nickname || profile.full_name?.split(' ')[0]?.toLowerCase() || 'carnavalero');
  const isFriend = friendStatus === 'accepted';
  const currentPosts = activeTab === 'reels' ? posts.filter((p: any) => p.media_type === 'video') : posts;

  return (
    <div className="min-h-full bg-white">
      {/* ═══ HEADER ═══ */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="p-0.5"><ArrowLeft className="w-5 h-5 text-brand-dark" /></button>
            <h1 className="text-lg font-bold text-brand-dark">{displayName}</h1>
            {isFriend && <span className="text-xs bg-carnaval-green/10 text-carnaval-green font-semibold px-2 py-0.5 rounded-full">🤝 Amigo</span>}
          </div>
          <MoreHorizontal className="w-5 h-5 text-brand-dark" />
        </div>

        {/* Avatar + Stats */}
        <div className="flex items-center gap-6 mb-4">
          <div className="w-20 h-20 rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}>
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-dark">
                {(profile.full_name || 'C').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>
          <div className="flex-1 flex justify-around text-center">
            <div><p className="text-lg font-bold text-brand-dark">{posts.length}</p><p className="text-[11px] text-gray-500">publicaciones</p></div>
            <div><p className="text-lg font-bold text-brand-dark">{followersCount}</p><p className="text-[11px] text-gray-500">seguidores</p></div>
            <div>
              <p className="text-lg font-bold text-brand-dark">{friendsCount}</p>
              <p className="text-[11px] text-gray-500">amigos</p>
            </div>
          </div>
        </div>

        {/* Name + Bio + Slogan */}
        <div className="mb-3">
          <p className="text-[13px] font-semibold text-brand-dark">{profile.full_name}</p>
          {nickname && profile.username && <p className="text-[12px] text-gray-500">~ {nickname}</p>}
          {contactInfo?.slogan && <p className="text-[13px] text-gray-500 italic mt-0.5">"{contactInfo.slogan}"</p>}
          {profile.bio && <p className="text-[13px] text-brand-dark mt-0.5">{profile.bio}</p>}
          {profile.city && <p className="text-[13px] text-gray-400 mt-0.5">📍 {profile.city}{profile.country === 'CO' ? ', Colombia' : ''}</p>}
          <p className="text-[11px] text-gray-300 mt-0.5">🎭 Carnavalero desde {new Date(profile.created_at).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}</p>
        </div>

        {/* ═══ ACTION BUTTONS ═══ */}
        <div className="flex gap-1.5 mb-2">
          {/* Follow button */}
          <button
            onClick={toggleFollow}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold text-center transition-colors flex items-center justify-center gap-1 ${
              isFollowing ? 'bg-gray-100 text-brand-dark' : 'bg-carnaval-blue text-white'
            }`}
          >
            {isFollowing ? <><UserCheck className="w-3.5 h-3.5" /> Siguiendo</> : <><UserPlus className="w-3.5 h-3.5" /> Seguir</>}
          </button>

          {/* Friend button */}
          {isFriend ? (
            <div className="flex-1 py-1.5 bg-carnaval-green/10 border border-carnaval-green/20 rounded-lg text-[12px] font-semibold text-carnaval-green text-center flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5" /> Amigos 🤝
            </div>
          ) : friendStatus === 'pending' ? (
            <div className="flex-1 py-1.5 bg-gold/10 border border-gold/20 rounded-lg text-[12px] font-semibold text-gold text-center flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Solicitud enviada
            </div>
          ) : (
            <button onClick={sendFriendRequest} disabled={sendingFriend}
              className="flex-1 py-1.5 bg-carnaval-red text-white rounded-lg text-[12px] font-semibold text-center flex items-center justify-center gap-1 disabled:opacity-50">
              {sendingFriend ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><QrCode className="w-3.5 h-3.5" /> Agregar amigo</>}
            </button>
          )}
        </div>

        {/* Message button — only for friends */}
        {isFriend ? (
          <Link href={`/cuenta/mensajes/${userId}`}
            className="block w-full py-1.5 bg-gray-100 rounded-lg text-[12px] font-semibold text-brand-dark text-center hover:bg-gray-200 transition-colors mb-4">
            <span className="flex items-center justify-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Enviar mensaje</span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg mb-4">
            <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <p className="text-[11px] text-gray-400">Solo los amigos pueden chatear y ver datos de contacto. Escanea su QR para conectar en persona 🎭</p>
          </div>
        )}
      </div>

      {/* ═══ TABS ═══ */}
      <div className="flex border-t border-gray-100">
        <button onClick={() => setActiveTab('posts')} className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] ${activeTab === 'posts' ? 'border-brand-dark' : 'border-transparent'}`}>
          <Grid3X3 className={`w-5 h-5 ${activeTab === 'posts' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
        <button onClick={() => setActiveTab('reels')} className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] ${activeTab === 'reels' ? 'border-brand-dark' : 'border-transparent'}`}>
          <Film className={`w-5 h-5 ${activeTab === 'reels' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
        <button onClick={() => setActiveTab('info')} className={`flex-1 flex justify-center py-2.5 border-b-[1.5px] ${activeTab === 'info' ? 'border-brand-dark' : 'border-transparent'}`}>
          <Shield className={`w-5 h-5 ${activeTab === 'info' ? 'text-brand-dark' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* ═══ TAB CONTENT ═══ */}

      {/* Posts / Reels grid */}
      {(activeTab === 'posts' || activeTab === 'reels') && (
        currentPosts.length === 0 ? (
          <div className="text-center py-16"><p className="text-sm text-gray-400">Sin publicaciones aún</p></div>
        ) : (
          <div className="grid grid-cols-3 gap-[1px]">
            {currentPosts.map((post: any) => (
              <Link key={post.id} href={`/red-social/post/${post.id}`} className="relative aspect-square bg-gray-100 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.media_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                {post.media_type === 'video' && <div className="absolute top-1.5 right-1.5"><Film className="w-4 h-4 text-white drop-shadow" /></div>}
                {post.visibility === 'close_friends' && <div className="absolute top-1.5 left-1.5"><Heart className="w-4 h-4 text-carnaval-green fill-carnaval-green drop-shadow" /></div>}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-3 text-white font-semibold text-xs">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" fill="white" /> {post.likes_count}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" fill="white" /> {post.comments_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {/* Info tab — contact info only for friends */}
      {activeTab === 'info' && (
        <div className="px-4 py-6 space-y-4">
          {isFriend ? (
            <>
              {/* Friend badge */}
              <div className="bg-carnaval-green/5 border border-carnaval-green/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-carnaval-green" />
                  <span className="text-xs font-bold text-carnaval-green uppercase tracking-wider">Amigo Carnavalero 🤝</span>
                </div>
                <p className="text-[13px] text-gray-600">Tienen acceso mutuo a datos de contacto</p>
              </div>

              {/* Contact details */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Datos de contacto</h3>
                {profile.email && contactInfo?.show_email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-carnaval-red">
                    <Mail className="w-4 h-4 text-gray-400" /> {profile.email}
                  </a>
                )}
                {profile.phone && contactInfo?.show_whatsapp && (
                  <a href={`https://wa.me/${(contactInfo.whatsapp_number || profile.phone).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-carnaval-green">
                    <Phone className="w-4 h-4 text-gray-400" /> WhatsApp
                  </a>
                )}
                {contactInfo?.show_instagram && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Instagram className="w-4 h-4 text-gray-400" /> Instagram
                  </div>
                )}
                {!contactInfo?.show_email && !contactInfo?.show_whatsapp && !contactInfo?.show_instagram && (
                  <p className="text-sm text-gray-400">Este carnavalero no ha compartido datos de contacto</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Shield className="w-7 h-7 text-gray-300" />
              </div>
              <h3 className="text-base font-bold text-brand-dark mb-2">Información privada</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mb-4">
                Solo los amigos carnavaleros pueden ver los datos de contacto. Escanea su código QR en un evento para conectar.
              </p>
              {friendStatus === 'none' && (
                <button onClick={sendFriendRequest} disabled={sendingFriend}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-carnaval-red text-white rounded-lg font-semibold text-sm">
                  <QrCode className="w-4 h-4" /> Enviar solicitud de amistad
                </button>
              )}
              {friendStatus === 'pending' && (
                <p className="text-sm text-gold font-semibold">⏳ Solicitud de amistad enviada</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
