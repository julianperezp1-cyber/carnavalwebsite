'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  Users, UserPlus, UserCheck, UserX, ChevronRight, Search,
  MapPin, MessageCircle, Check, X, Clock, ArrowRight, QrCode,
} from 'lucide-react';

type Tab = 'amigos' | 'solicitudes' | 'enviadas';

interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  profile?: {
    id: string;
    full_name: string;
    city: string;
    country: string;
    created_at: string;
  };
  contact_info?: {
    nickname: string;
    slogan: string;
  };
}

export default function AmigosPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('amigos');
  const [search, setSearch] = useState('');

  const [friends, setFriends] = useState<Connection[]>([]);
  const [pendingReceived, setPendingReceived] = useState<Connection[]>([]);
  const [pendingSent, setPendingSent] = useState<Connection[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/cuenta'); return; }
      setUserId(data.user.id);
      loadConnections(data.user.id);
    });
  }, []);

  async function loadConnections(uid: string) {
    setLoading(true);

    // Accepted connections (friends)
    const { data: accepted } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${uid},receiver_id.eq.${uid}`)
      .eq('status', 'accepted');

    // Pending received
    const { data: received } = await supabase
      .from('connections')
      .select('*')
      .eq('receiver_id', uid)
      .eq('status', 'pending');

    // Pending sent
    const { data: sent } = await supabase
      .from('connections')
      .select('*')
      .eq('requester_id', uid)
      .eq('status', 'pending');

    // Get all unique user IDs we need profiles for
    const allConns = [...(accepted || []), ...(received || []), ...(sent || [])];
    const otherIds = allConns.map(c => c.requester_id === uid ? c.receiver_id : c.requester_id);
    const uniqueIds = [...new Set(otherIds)];

    if (uniqueIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, city, country, created_at')
        .in('id', uniqueIds);

      const { data: contacts } = await supabase
        .from('contact_info')
        .select('id, nickname, slogan')
        .in('id', uniqueIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));
      const contactMap = new Map((contacts || []).map(c => [c.id, c]));

      function enrich(conn: any): Connection {
        const otherId = conn.requester_id === uid ? conn.receiver_id : conn.requester_id;
        return {
          ...conn,
          profile: profileMap.get(otherId),
          contact_info: contactMap.get(otherId),
        };
      }

      setFriends((accepted || []).map(enrich));
      setPendingReceived((received || []).map(enrich));
      setPendingSent((sent || []).map(enrich));
    } else {
      setFriends([]);
      setPendingReceived([]);
      setPendingSent([]);
    }

    setLoading(false);
  }

  async function handleAccept(connectionId: string) {
    setActionLoading(connectionId);
    await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);
    if (userId) await loadConnections(userId);
    setActionLoading(null);
  }

  async function handleReject(connectionId: string) {
    setActionLoading(connectionId);
    await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);
    if (userId) await loadConnections(userId);
    setActionLoading(null);
  }

  function getOtherId(conn: Connection) {
    return conn.requester_id === userId ? conn.receiver_id : conn.requester_id;
  }

  function getDisplayName(conn: Connection) {
    return conn.contact_info?.nickname || conn.profile?.full_name?.split(' ')[0] || 'Carnavalero';
  }

  const filteredFriends = friends.filter(f => {
    if (!search) return true;
    const name = getDisplayName(f).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const filteredReceived = pendingReceived.filter(f => {
    if (!search) return true;
    return getDisplayName(f).toLowerCase().includes(search.toLowerCase());
  });

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'amigos', label: 'Amigos', count: friends.length },
    { id: 'solicitudes', label: 'Solicitudes', count: pendingReceived.length },
    { id: 'enviadas', label: 'Enviadas', count: pendingSent.length },
  ];

  if (loading) {
    return (
      <><Header /><div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
      </div><Footer /></>
    );
  }

  return (
    <>
      <Header />
      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/cuenta" className="hover:text-gray-600">Carnaval ID</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-700 font-medium">Mis Amigos</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">Mis Amigos Carnavaleros</h1>
              <p className="mt-1 text-sm text-gray-500">Tu red de contactos del Carnaval</p>
            </div>
            <Link href="/cuenta/qr"
              className="hidden sm:inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
              <QrCode className="h-4 w-4" /> Mi QR
            </Link>
          </div>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === t.id
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}>
                {t.label}
                {t.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    tab === t.id
                      ? t.id === 'solicitudes' ? 'bg-carnaval-red text-white' : 'bg-gray-200 text-gray-600'
                      : t.id === 'solicitudes' && t.count > 0 ? 'bg-carnaval-red/20 text-carnaval-red' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          {(tab === 'amigos' || tab === 'solicitudes') && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar carnavalero..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
            </div>
          )}

          {/* ═══ TAB: AMIGOS ═══ */}
          {tab === 'amigos' && (
            <>
              {filteredFriends.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-black text-brand-dark mb-2">
                    {search ? 'Sin resultados' : 'Aun no tienes amigos carnavaleros'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                    {search
                      ? `No se encontro ningun amigo con "${search}"`
                      : 'Comparte tu QR en el Carnaval para conectar con otros carnavaleros y empezar a construir tu red.'}
                  </p>
                  {!search && (
                    <Link href="/cuenta/qr"
                      className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                      <QrCode className="h-4 w-4" /> Compartir mi QR
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFriends.map(friend => {
                    const otherId = getOtherId(friend);
                    return (
                      <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        {/* Avatar */}
                        <Link href={`/carnavalero/${otherId}`}
                          className="w-12 h-12 bg-gradient-to-br from-carnaval-red to-gold rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-display font-black text-sm">
                            {getDisplayName(friend).charAt(0).toUpperCase()}
                          </span>
                        </Link>

                        {/* Info */}
                        <Link href={`/carnavalero/${otherId}`} className="flex-1 min-w-0">
                          <p className="text-sm font-display font-black text-brand-dark truncate">
                            {friend.profile?.full_name || getDisplayName(friend)}
                          </p>
                          {friend.contact_info?.nickname && (
                            <p className="text-xs text-gold font-bold">@{friend.contact_info.nickname}</p>
                          )}
                          {friend.profile?.city && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-2.5 w-2.5" /> {friend.profile.city}
                            </p>
                          )}
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link href={`/cuenta/mensajes/${otherId}`}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-carnaval-red/10 flex items-center justify-center transition-colors group/btn">
                            <MessageCircle className="h-4 w-4 text-gray-400 group-hover/btn:text-carnaval-red" />
                          </Link>
                          <Link href={`/carnavalero/${otherId}`}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-carnaval-red/10 flex items-center justify-center transition-colors group/btn">
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover/btn:text-carnaval-red" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ═══ TAB: SOLICITUDES RECIBIDAS ═══ */}
          {tab === 'solicitudes' && (
            <>
              {filteredReceived.length === 0 ? (
                <div className="text-center py-16">
                  <UserPlus className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-black text-brand-dark mb-2">
                    {search ? 'Sin resultados' : 'No tienes solicitudes pendientes'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {search ? `No se encontro ningun resultado para "${search}"` : 'Cuando alguien escanee tu QR y quiera conectar, aparecera aqui.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredReceived.map(req => {
                    const otherId = getOtherId(req);
                    const isProcessing = actionLoading === req.id;
                    return (
                      <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-gold/5 border border-gold/10">
                        <Link href={`/carnavalero/${otherId}`}
                          className="w-12 h-12 bg-gradient-to-br from-gold to-carnaval-red rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-display font-black text-sm">
                            {getDisplayName(req).charAt(0).toUpperCase()}
                          </span>
                        </Link>

                        <Link href={`/carnavalero/${otherId}`} className="flex-1 min-w-0">
                          <p className="text-sm font-display font-black text-brand-dark truncate">
                            {getDisplayName(req)}
                          </p>
                          {req.contact_info?.slogan && (
                            <p className="text-[10px] text-gray-400 italic truncate">&ldquo;{req.contact_info.slogan}&rdquo;</p>
                          )}
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5" /> Quiere conectar contigo
                          </p>
                        </Link>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isProcessing ? (
                            <div className="w-8 h-8 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
                            </div>
                          ) : (
                            <>
                              <button onClick={() => handleAccept(req.id)}
                                className="w-9 h-9 rounded-full bg-carnaval-green hover:bg-carnaval-green/80 flex items-center justify-center transition-colors"
                                title="Aceptar">
                                <Check className="h-4 w-4 text-white" />
                              </button>
                              <button onClick={() => handleReject(req.id)}
                                className="w-9 h-9 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center transition-colors"
                                title="Rechazar">
                                <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ═══ TAB: ENVIADAS ═══ */}
          {tab === 'enviadas' && (
            <>
              {pendingSent.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-black text-brand-dark mb-2">Sin solicitudes enviadas</h3>
                  <p className="text-sm text-gray-400">Las solicitudes que envies a otros carnavaleros apareceran aqui.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingSent.map(req => {
                    const otherId = getOtherId(req);
                    return (
                      <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <Link href={`/carnavalero/${otherId}`}
                          className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white font-display font-black text-sm">
                            {getDisplayName(req).charAt(0).toUpperCase()}
                          </span>
                        </Link>

                        <Link href={`/carnavalero/${otherId}`} className="flex-1 min-w-0">
                          <p className="text-sm font-display font-black text-brand-dark truncate">
                            {getDisplayName(req)}
                          </p>
                          {req.profile?.city && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-2.5 w-2.5" /> {req.profile.city}
                            </p>
                          )}
                        </Link>

                        <div className="flex items-center gap-1.5 text-xs text-gold font-medium shrink-0">
                          <Clock className="h-3.5 w-3.5" /> Pendiente
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
