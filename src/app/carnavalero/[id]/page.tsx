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
  Clock, Shield, QrCode, ArrowRight, ExternalLink,
} from 'lucide-react';

export default function CarnavaleroPublicPage() {
  const params = useParams();
  const profileId = params.id as string;
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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
  const displayName = isConnected || isOwnProfile
    ? profile.full_name || 'Carnavalero'
    : contactInfo?.nickname || profile.nickname || profile.full_name?.split(' ')[0] || 'Carnavalero';

  // Get user metadata from auth for badges (profile table doesn't have it)
  // We show public info only

  return (
    <>
      <Header />
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-12 sm:py-16 bg-gray-50 min-h-[60vh]">
        <div className="max-w-md mx-auto px-6">
          {/* Profile card */}
          <div className="bg-brand-dark rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden mb-4">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />

            <div className="w-20 h-20 bg-gradient-to-br from-carnaval-red to-gold rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-xl font-display font-black text-white">{displayName}</h2>

            {contactInfo?.nickname && (isConnected || isOwnProfile) && (
              <p className="text-sm text-gold font-bold mt-0.5">@{contactInfo.nickname}</p>
            )}
            {!isConnected && !isOwnProfile && contactInfo?.nickname && (
              <p className="text-sm text-gold font-bold mt-0.5">@{contactInfo.nickname}</p>
            )}

            {contactInfo?.slogan && (
              <p className="text-xs text-white/40 mt-1 italic">&ldquo;{contactInfo.slogan}&rdquo;</p>
            )}

            {profile.city && (
              <p className="text-xs text-white/40 mt-2 flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" /> {profile.city}{profile.country ? `, ${profile.country}` : ''}
              </p>
            )}

            <p className="text-xs text-gold/60 mt-2">
              Carnavalero desde {new Date(profile.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
            </p>

            {/* Contact info — only for connections */}
            {isConnected && (
              <div className="border-t border-white/10 mt-5 pt-5 space-y-2.5">
                <p className="text-[10px] text-carnaval-green font-bold uppercase tracking-wider mb-3">
                  <CheckCircle className="h-3 w-3 inline mr-1" /> Conectados
                </p>
                {profile.email && contactInfo?.show_email && (
                  <a href={`mailto:${profile.email}`} className="text-xs text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
                    <Mail className="h-3 w-3" /> {profile.email}
                  </a>
                )}
                {profile.phone && contactInfo?.show_whatsapp && (
                  <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-white/60 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
                    <Phone className="h-3 w-3" /> {contactInfo.whatsapp_number || profile.phone}
                  </a>
                )}
                {contactInfo?.show_instagram && (
                  <p className="text-xs text-white/60 flex items-center justify-center gap-1.5">
                    <Instagram className="h-3 w-3" /> Instagram disponible
                  </p>
                )}
              </div>
            )}

            {/* Not connected — show privacy message */}
            {!isConnected && !isOwnProfile && (
              <div className="border-t border-white/10 mt-5 pt-5">
                <div className="flex items-center justify-center gap-1.5 text-xs text-white/30 mb-4">
                  <Shield className="h-3 w-3" />
                  <span>Datos de contacto visibles solo para conexiones</span>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-1 gradient-carnaval" />
          </div>

          {/* Action buttons */}
          {!isOwnProfile && currentUser && (
            <div className="mb-4">
              {isConnected ? (
                <div className="bg-carnaval-green/10 border border-carnaval-green/20 rounded-xl p-4 text-center">
                  <CheckCircle className="h-5 w-5 text-carnaval-green mx-auto mb-1" />
                  <p className="text-sm font-bold text-carnaval-green">Conectados!</p>
                  <p className="text-[10px] text-gray-500">Puedes ver su informacion de contacto</p>
                </div>
              ) : isPending ? (
                <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-center">
                  <Clock className="h-5 w-5 text-gold mx-auto mb-1" />
                  <p className="text-sm font-bold text-gold">Solicitud enviada</p>
                  <p className="text-[10px] text-gray-500">Esperando que acepte tu conexion</p>
                </div>
              ) : (
                <button onClick={handleConnect} disabled={sending}
                  className="w-full bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><UserPlus className="h-4 w-4" /> Conectar con este carnavalero</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Not logged in */}
          {!currentUser && (
            <div className="bg-gray-100 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-700 font-semibold mb-2">¿Quieres conectar con este carnavalero?</p>
              <p className="text-xs text-gray-500 mb-4">Crea tu Carnaval ID gratis para conectar y compartir contactos.</p>
              <Link href="/cuenta"
                className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                Crear mi Carnaval ID <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Own profile link */}
          {isOwnProfile && (
            <Link href="/cuenta/qr"
              className="block bg-gray-100 rounded-xl p-4 text-center text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors">
              Configurar mi tarjeta de contacto
            </Link>
          )}
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
