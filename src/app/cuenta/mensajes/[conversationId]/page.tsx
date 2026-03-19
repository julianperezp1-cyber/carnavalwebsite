'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft, Send, MapPin, ChevronRight, User, Smile,
} from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export default function ConversationPage() {
  const params = useParams();
  const otherId = params.conversationId as string;
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [otherProfile, setOtherProfile] = useState<any>(null);
  const [otherContact, setOtherContact] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/cuenta'); return; }
      setUserId(data.user.id);
      loadData(data.user.id);
    });
  }, []);

  async function loadData(uid: string) {
    // Check connection
    const { data: conn } = await supabase
      .from('connections')
      .select('status')
      .or(`and(requester_id.eq.${uid},receiver_id.eq.${otherId}),and(requester_id.eq.${otherId},receiver_id.eq.${uid})`)
      .eq('status', 'accepted')
      .single();

    setIsConnected(!!conn);

    // Load other user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherId)
      .single();
    setOtherProfile(profile);

    const { data: contact } = await supabase
      .from('contact_info')
      .select('*')
      .eq('id', otherId)
      .single();
    setOtherContact(contact);

    // Load messages
    await loadMessages(uid);
    setLoading(false);
  }

  async function loadMessages(uid: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${uid},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${uid})`)
      .order('created_at', { ascending: true });

    setMessages(data || []);

    // Mark received messages as read
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', otherId)
      .eq('receiver_id', uid)
      .eq('read', false);

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  // Subscribe to realtime messages
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`messages-${userId}-${otherId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === otherId) {
          setMessages(prev => [...prev, msg]);
          // Mark as read
          supabase.from('messages').update({ read: true }).eq('id', msg.id);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, otherId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !userId || sending) return;
    setSending(true);

    const { data, error } = await supabase.from('messages').insert({
      sender_id: userId,
      receiver_id: otherId,
      content: newMessage.trim(),
    }).select().single();

    if (!error && data) {
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    setSending(false);
    inputRef.current?.focus();
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDateSeparator(dateStr: string) {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Hoy';
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
    return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach(msg => {
    const dateKey = new Date(msg.created_at).toDateString();
    const existing = groupedMessages.find(g => g.date === dateKey);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateKey, messages: [msg] });
    }
  });

  const displayName = otherContact?.nickname || otherProfile?.full_name?.split(' ')[0] || 'Carnavalero';

  if (loading) {
    return (
      <><Header /><div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
      </div><Footer /></>
    );
  }

  if (!isConnected) {
    return (
      <><Header />
        <div className="min-h-[60vh] flex items-center justify-center text-center px-6">
          <div>
            <User className="h-16 w-16 text-gray-200 mx-auto mb-4" />
            <h1 className="text-xl font-display font-black text-brand-dark mb-2">No puedes enviar mensajes</h1>
            <p className="text-sm text-gray-400 mb-6">Solo puedes chatear con tus amigos carnavaleros. Conecta primero para poder conversar.</p>
            <Link href={`/carnavalero/${otherId}`}
              className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
              Ver perfil
            </Link>
          </div>
        </div>
      <Footer /></>
    );
  }

  return (
    <>
      <Header />

      {/* Chat header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/cuenta/mensajes')}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>

          <Link href={`/carnavalero/${otherId}`} className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-carnaval-red to-gold rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-display font-black text-xs">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-display font-black text-brand-dark truncate">{displayName}</p>
              {otherProfile?.city && (
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" /> {otherProfile.city}
                </p>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Messages area */}
      <div className="bg-gray-50 min-h-[60vh] max-h-[calc(100vh-240px)] overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-carnaval-red to-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl text-white font-display font-black">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-sm font-display font-black text-brand-dark">{otherProfile?.full_name || displayName}</p>
              {otherContact?.nickname && <p className="text-xs text-gold font-bold">@{otherContact.nickname}</p>}
              <p className="text-xs text-gray-400 mt-2">Estan conectados en el Carnaval</p>
              <p className="text-xs text-gray-400 mt-1">Enviale un mensaje para empezar la conversacion 🎭</p>
            </div>
          ) : (
            groupedMessages.map(group => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-[10px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    {formatDateSeparator(group.messages[0].created_at)}
                  </span>
                </div>

                {group.messages.map((msg, i) => {
                  const isMe = msg.sender_id === userId;
                  const showTail = i === group.messages.length - 1 || group.messages[i + 1]?.sender_id !== msg.sender_id;

                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                      <div className={`max-w-[75%] px-3.5 py-2 text-sm ${
                        isMe
                          ? `bg-carnaval-red text-white ${showTail ? 'rounded-2xl rounded-br-md' : 'rounded-2xl'}`
                          : `bg-white text-gray-800 border border-gray-100 ${showTail ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl'}`
                      }`}>
                        <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-[9px] mt-0.5 text-right ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSend} className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <input ref={inputRef} type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none bg-gray-50"
            maxLength={1000}
            autoFocus
          />
          <button type="submit" disabled={!newMessage.trim() || sending}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              newMessage.trim()
                ? 'bg-carnaval-red hover:bg-carnaval-red-hover text-white'
                : 'bg-gray-100 text-gray-300'
            }`}>
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </>
  );
}
