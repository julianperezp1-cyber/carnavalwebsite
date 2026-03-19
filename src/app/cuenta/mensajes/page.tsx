'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  MessageCircle, ChevronRight, Search, MapPin, Circle, ArrowRight,
} from 'lucide-react';

interface Conversation {
  otherId: string;
  otherName: string;
  otherNickname: string;
  otherCity: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
}

export default function MensajesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/cuenta'); return; }
      setUserId(data.user.id);
      loadConversations(data.user.id);
    });
  }, []);

  async function loadConversations(uid: string) {
    setLoading(true);

    // Get accepted connections
    const { data: connections } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${uid},receiver_id.eq.${uid}`)
      .eq('status', 'accepted');

    if (!connections || connections.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const otherIds = connections.map(c => c.requester_id === uid ? c.receiver_id : c.requester_id);

    // Get profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, city')
      .in('id', otherIds);

    const { data: contacts } = await supabase
      .from('contact_info')
      .select('id, nickname')
      .in('id', otherIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));
    const contactMap = new Map((contacts || []).map(c => [c.id, c]));

    // Get last message for each conversation
    const convos: Conversation[] = [];

    for (const otherId of otherIds) {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${uid},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${uid})`)
        .order('created_at', { ascending: false })
        .limit(1);

      // Count unread
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', otherId)
        .eq('receiver_id', uid)
        .eq('read', false);

      const profile = profileMap.get(otherId);
      const contact = contactMap.get(otherId);
      const lastMsg = msgs?.[0];

      convos.push({
        otherId,
        otherName: profile?.full_name || 'Carnavalero',
        otherNickname: contact?.nickname || '',
        otherCity: profile?.city || '',
        lastMessage: lastMsg?.content || '',
        lastAt: lastMsg?.created_at || '',
        unread: count || 0,
      });
    }

    // Sort by last message (most recent first), conversations with messages first
    convos.sort((a, b) => {
      if (!a.lastAt && !b.lastAt) return 0;
      if (!a.lastAt) return 1;
      if (!b.lastAt) return -1;
      return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
    });

    setConversations(convos);
    setLoading(false);
  }

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.otherName.toLowerCase().includes(s) || c.otherNickname.toLowerCase().includes(s);
  });

  function timeAgo(dateStr: string) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;
    return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }

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
            <span className="text-gray-700 font-medium">Mensajes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">Mensajes</h1>
          <p className="mt-1 text-sm text-gray-500">Chatea con tus amigos carnavaleros</p>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-8 sm:py-12 bg-white min-h-[50vh]">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar conversacion..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <MessageCircle className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-display font-black text-brand-dark mb-2">
                {search ? 'Sin resultados' : 'Sin mensajes aun'}
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                {search
                  ? `No se encontro conversacion con "${search}"`
                  : 'Conecta con otros carnavaleros para empezar a chatear. Visita tu lista de amigos para iniciar una conversacion.'}
              </p>
              {!search && (
                <Link href="/cuenta/amigos"
                  className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  Ver mis amigos <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map(conv => (
                <Link key={conv.otherId} href={`/cuenta/mensajes/${conv.otherId}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-carnaval-red to-gold rounded-full flex items-center justify-center">
                      <span className="text-white font-display font-black text-sm">
                        {(conv.otherNickname || conv.otherName).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {conv.unread > 0 && (
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-carnaval-red rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">{conv.unread > 9 ? '9+' : conv.unread}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-display truncate ${conv.unread > 0 ? 'font-black text-brand-dark' : 'font-bold text-gray-700'}`}>
                        {conv.otherNickname ? `@${conv.otherNickname}` : conv.otherName}
                      </p>
                      {conv.lastAt && (
                        <span className={`text-[10px] shrink-0 ${conv.unread > 0 ? 'text-carnaval-red font-bold' : 'text-gray-400'}`}>
                          {timeAgo(conv.lastAt)}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${conv.unread > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {conv.lastMessage || 'Inicia la conversacion...'}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-carnaval-red shrink-0 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
