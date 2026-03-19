'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Bell, Compass, Users, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { label: 'Explorar', icon: Compass, href: '/red-social' },
  { label: 'Amigos', icon: Users, href: '/red-social/amigos' },
  { label: 'Crear', icon: PlusCircle, href: '/red-social/crear', highlight: true },
  { label: 'Mensajes', icon: MessageCircle, href: '/cuenta/mensajes', badge: true },
  { label: 'Perfil', icon: User, href: '/cuenta' },
];

export default function RedSocialLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/cuenta');
    }
  }, [user, loading, router]);

  // Fetch unread message count
  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);
      setUnreadCount(count ?? 0);
    };

    fetchUnread();

    // Subscribe to new messages
    const supabase = createClient();
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` },
        () => fetchUnread()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const isActive = (href: string) => {
    if (href === '/red-social') return pathname === '/red-social';
    return pathname.startsWith(href);
  };

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-carnaval-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white">
        {/* Gradient line */}
        <div className="h-1 gradient-carnaval" />

        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-1 -ml-1 text-brand-dark hover:text-carnaval-red transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-brand-dark tracking-tight">
              Red Social Carnaval 🎭
            </h1>
          </div>

          <button
            className="relative p-2 text-brand-dark hover:text-carnaval-red transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom border */}
        <div className="h-px bg-gray-100" />
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 transition-colors ${
                  item.highlight
                    ? 'text-carnaval-red'
                    : active
                    ? 'text-carnaval-red'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`transition-all ${
                      item.highlight ? 'w-7 h-7' : 'w-6 h-6'
                    }`}
                    strokeWidth={active || item.highlight ? 2.5 : 1.8}
                  />
                  {/* Unread badge */}
                  {item.badge && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-carnaval-red text-white text-[10px] font-bold px-1 leading-none">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] leading-none ${
                    active || item.highlight ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Safe area for notched devices */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
