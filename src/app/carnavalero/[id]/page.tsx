'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  User, MapPin, Instagram, Phone, Mail, UserPlus, CheckCircle,
  Clock, Shield, QrCode, ArrowRight, ExternalLink, Camera,
  Trophy, Grid3X3, Info, MessageCircle, UserCheck, Heart,
  Award, Users,
} from 'lucide-react';

type ProfileTab = 'galeria' | 'insignias' | 'info';

const ALL_BADGES = [
  { id: 'registered', emoji: '🎭', name: 'Carnavalero Registrado', desc: 'Creo su Carnaval ID' },
  { id: 'profile', emoji: '⭐', name: 'Perfil Completo', desc: 'Completo su perfil' },
  { id: 'survey', emoji: '📋', name: 'Voz del Carnaval', desc: 'Respondio la encuesta' },
  { id: 'foto', emoji: '📸', name: 'Fotografo', desc: 'Subio su primera foto' },
  { id: 'carnaval2027', emoji: '🎉', name: 'Carnaval 2027', desc: 'Asistio al Carnaval 2027' },
  { id: 'quiz', emoji: '🧠', name: 'Sabio del Carnaval', desc: 'Completo un quiz' },
  { id: 'social', emoji: '🤝', name: 'Conector', desc: 'Conecto con 5 carnavaleros' },
  { id: 'veterano', emoji: '👑', name: 'Veterano', desc: 'Asistio a 5+ Carnavales' },
];

export default function CarnavaleroPublicPage() {
  const params = useParams();
  const profileId = params.id as string;
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('galeria');

  const supabase = createClient();
  const isOwnProfile = currentUser?.id === profileId;

  useEffect(() => {
    loadProfile();
  }, [profileId, currentUser]);

  async function loadProfile() {
    // Get profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (profileData) setProfile(profileData);

    // Get contact info
    const { data: contactData } = await supabase
      .from('contact_info')
      .select('*')
      .eq('id', profileId)
      .single();

    if (contactData) setContactInfo(contactData);

    // Count friends (accepted connections)
    const { count } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .or(`requester_id.eq.${profileId},receiver_id.eq.${profileId}`)
      .eq('status', 'accepted');

    setFriendCount(count || 0);

    // Check connection status if logged in
    if (currentUser && currentUser.id !== profileId) {
      const { data: conn } = await supabase
        .from('connections')
        .select('status')
        .or(`and(requester_id.eq.${currentUser.id},receiver_id.eq.${profileId}),and(requester_id.eq.${profileId},receiver_id.eq.${currentUser.id})`)
        .single();

      if (conn) setConnectionStatus(conn.status);
    }

    setLoading(false);
  }

  async function handleConnect() {
    if (!currentUser || !profileId) return;
    setSending(true);
    const { error } = await supabase.from('connections').insert({
      requester_id: currentUser.id,
      receiver_id: profileId,
    });
    if (!error) setConnectionStatus('pending');
    setSending(false);
  }

  if (loading) {
    return (
      <><Header /><div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
      </div><Footer /></>
    );
  }

  if (!profile) {
    return (
      <><Header />
        <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
          <div>
            <QrCode className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h1 className="text-2xl font-display font-black text-brand-dark mb-2">Carnavalero no encontrado</h1>
            <p className="text-gray-500 text-sm mb-6">Este perfil no existe o fue eliminado.</p>
            <Link href="/" className="text-carnaval-red font-bold text-sm hover:underline">Volver al inicio</Link>
          </div>
        </div>
      <Footer /></>
    );
  }

  const isConnected = connectionStatus === 'accepted';
  const isPending = connectionStatus === 'pending';
  const displayName = contactInfo?.nickname || profile.full_name?.split(' ')[0] || 'Carnavalero';
  const fullName = (isConnected || isOwnProfile) ? (profile.full_name || 'Carnavalero') : displayName;

  // Earned badges (we derive from what data is available)
  const earnedBadgeIds = ['registered']; // Everyone who has a profile is registered
  // We can't easily know other badges from public data, so just show registered

  const tabs: { id: ProfileTab; icon: any; label: string }[] = [
    { id: 'galeria', icon: Grid3X3, label: 'Galeria' },
    { id: 'insignias', icon: Trophy, label: 'Insignias' },
    { id: 'info', icon: Info, label: 'Info' },
  ];

  return (
    <>
      <Header />
      <div className="h-1.5 gradient-carnaval" />

      <section className="bg-white">
        <div className="max-w-lg mx-auto px-6 pt-8 pb-0">
          {/* ═══ PROFILE HEADER (Instagram-style) ═══ */}
          <div className="flex items-start gap-5 sm:gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-carnaval-red via-gold to-carnaval-green rounded-full p-[3px]">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] bg-gradient-to-br from-carnaval-red to-gold rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 pt-2">
              <h1 className="text-lg sm:text-xl font-display font-black text-brand-dark">{displayName}</h1>
              {contactInfo?.nickname && (isConnected || isOwnProfile) && profile.full_name && (
                <p className="text-xs text-gray-500">{profile.full_name}</p>
              )}

              <div className="flex items-center gap-5 mt-3">
                <div className="text-center">
                  <p className="text-lg font-display font-black text-brand-dark">0</p>
                  <p className="text-[10px] text-gray-400">Fotos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-display font-black text-brand-dark">{friendCount}</p>
                  <p className="text-[10px] text-gray-400">Amigos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-display font-black text-brand-dark">{earnedBadgeIds.length}</p>
                  <p className="text-[10px] text-gray-400">Insignias</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio area */}
          <div className="mt-4">
            {contactInfo?.slogan && (
              <p className="text-sm text-gray-600 italic">&ldquo;{contactInfo.slogan}&rdquo;</p>
            )}
            {profile.city && (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {profile.city}{profile.country ? `, ${profile.country}` : ''}
              </p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">
              🎭 Carnavalero desde {new Date(profile.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* ═══ ACTION BUTTONS ═══ */}
          <div className="flex gap-2 mt-4">
            {isOwnProfile ? (
              <>
                <Link href="/cuenta/completar"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-dark py-2 rounded-lg text-sm font-bold text-center transition-colors">
                  Editar perfil
                </Link>
                <Link href="/cuenta/qr"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-brand-dark py-2 rounded-lg text-sm font-bold text-center transition-colors">
                  Compartir QR
                </Link>
              </>
            ) : currentUser ? (
              <>
                {isConnected ? (
                  <>
                    <div className="flex-1 bg-gray-100 text-brand-dark py-2 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-carnaval-green" /> Amigos
                    </div>
                    <Link href={`/cuenta/mensajes/${profileId}`}
                      className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-2 rounded-lg text-sm font-bold text-center transition-colors flex items-center justify-center gap-1.5">
                      <MessageCircle className="h-4 w-4" /> Mensaje
                    </Link>
                  </>
                ) : isPending ? (
                  <div className="flex-1 bg-gold/10 border border-gold/20 text-gold py-2 rounded-lg text-sm font-bold text-center flex items-center justify-center gap-1.5">
                    <Clock className="h-4 w-4" /> Solicitud enviada
                  </div>
                ) : (
                  <button onClick={handleConnect} disabled={sending}
                    className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><UserPlus className="h-4 w-4" /> Conectar</>
                    )}
                  </button>
                )}
              </>
            ) : (
              <Link href="/cuenta"
                className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-2 rounded-lg text-sm font-bold text-center transition-colors flex items-center justify-center gap-1.5">
                <UserPlus className="h-4 w-4" /> Crear Carnaval ID para conectar
              </Link>
            )}
          </div>

          {/* ═══ TABS ═══ */}
          <div className="flex border-t border-gray-100 mt-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors border-t-2 -mt-px ${
                  activeTab === t.id
                    ? 'border-brand-dark text-brand-dark'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}>
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TAB CONTENT ═══ */}
      <section className="bg-gray-50 min-h-[40vh]">
        <div className="max-w-lg mx-auto px-6 py-6">

          {/* GALERIA TAB */}
          {activeTab === 'galeria' && (
            <div>
              {/* Placeholder gallery grid */}
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-sm flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-300" />
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                {isOwnProfile
                  ? 'Sube tus fotos del Carnaval en la Galeria Comunitaria'
                  : 'Este carnavalero aun no ha subido fotos'}
              </p>
              {isOwnProfile && (
                <Link href="/comunidad/galeria"
                  className="block text-center text-xs text-carnaval-red font-bold mt-2 hover:underline">
                  Ir a la Galeria →
                </Link>
              )}
            </div>
          )}

          {/* INSIGNIAS TAB */}
          {activeTab === 'insignias' && (
            <div className="grid grid-cols-2 gap-3">
              {ALL_BADGES.map(badge => {
                const earned = earnedBadgeIds.includes(badge.id);
                return (
                  <div key={badge.id}
                    className={`text-center p-4 rounded-xl border transition-all ${
                      earned
                        ? 'bg-white border-gold/30 shadow-sm'
                        : 'bg-gray-100/50 border-gray-200 opacity-30'
                    }`}>
                    <span className="text-3xl block mb-2">{badge.emoji}</span>
                    <p className={`text-xs font-bold ${earned ? 'text-brand-dark' : 'text-gray-400'}`}>{badge.name}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{badge.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Public info */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Informacion</h3>
                <div className="space-y-2.5">
                  {profile.city && (
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span>Miembro desde {new Date(profile.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{friendCount} amigos carnavaleros</span>
                  </div>
                </div>
              </div>

              {/* Contact info — only for connections */}
              {isConnected && (
                <div className="bg-white rounded-xl p-4 border border-carnaval-green/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-carnaval-green" />
                    <h3 className="text-xs font-bold text-carnaval-green uppercase tracking-wider">Datos de contacto</h3>
                  </div>
                  <div className="space-y-2.5">
                    {profile.email && contactInfo?.show_email && (
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-carnaval-red transition-colors">
                        <Mail className="h-4 w-4 text-gray-400" /> {profile.email}
                      </a>
                    )}
                    {profile.phone && contactInfo?.show_whatsapp && (
                      <a href={`https://wa.me/${(contactInfo.whatsapp_number || profile.phone).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-carnaval-green transition-colors">
                        <Phone className="h-4 w-4 text-gray-400" /> {contactInfo.whatsapp_number || profile.phone}
                      </a>
                    )}
                    {contactInfo?.show_instagram && (
                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <Instagram className="h-4 w-4 text-gray-400" /> Instagram disponible
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Not connected — privacy notice */}
              {!isConnected && !isOwnProfile && (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <Shield className="h-5 w-5 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Conecta con este carnavalero para ver su informacion de contacto</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
