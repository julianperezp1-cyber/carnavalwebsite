'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, PlusSquare, Film, Heart } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/client';

export default function RedSocialLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace('/cuenta');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const fetchNotifs = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      setUnreadNotifs(count ?? 0);
    };
    fetchNotifs();
    const channel = supabase
      .channel('notif-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => fetchNotifs())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-carnaval-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const isActive = (href: string) => {
    if (href === '/red-social') return pathname === '/red-social';
    return pathname.startsWith(href);
  };

  const NAV = [
    { href: '/red-social', icon: Home, label: 'Inicio' },
    { href: '/red-social/explorar', icon: Search, label: 'Explorar' },
    { href: '/red-social/crear', icon: PlusSquare, label: '' },
    { href: '/red-social/reels', icon: Film, label: 'Reels' },
    { href: '/red-social/perfil', icon: null, label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ═══ TOP BAR (Instagram style) ═══ */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-11">
          <Link href="/red-social" className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold text-brand-dark" style={{ fontFamily: 'var(--font-display)' }}>
              Carnaval Social
            </span>
            <span className="text-sm">🎭</span>
          </Link>
          <div className="flex items-center gap-0.5">
            <Link href="/red-social/actividad" className="relative p-2 text-brand-dark hover:text-carnaval-red transition-colors">
              <Heart className="w-[22px] h-[22px]" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 min-w-[15px] h-[15px] flex items-center justify-center rounded-full bg-carnaval-red text-white text-[9px] font-bold px-0.5">
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </span>
              )}
            </Link>
            <Link href="/cuenta/mensajes" className="p-2 text-brand-dark hover:text-carnaval-red transition-colors">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ CONTENT ═══ */}
      <main className="flex-1 pb-[52px]">{children}</main>

      {/* ═══ BOTTOM NAV (Instagram style: Home, Search, +, Reels, Profile) ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around h-[50px] max-w-lg mx-auto">
          {NAV.map(item => {
            const active = isActive(item.href);

            // Profile avatar
            if (item.label === 'Perfil') {
              return (
                <Link key={item.href} href={item.href} className="flex items-center justify-center p-2">
                  <div
                    className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold text-white ${active ? 'ring-[1.5px] ring-brand-dark ring-offset-1' : ''}`}
                    style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38, #00AB25)' }}
                  >
                    {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                </Link>
              );
            }

            const Icon = item.icon!;
            // Create button (center)
            if (item.href === '/red-social/crear') {
              return (
                <Link key={item.href} href={item.href} className="flex items-center justify-center p-2">
                  <PlusSquare className="w-[26px] h-[26px] text-brand-dark" strokeWidth={1.5} />
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href} className="flex items-center justify-center p-2">
                <Icon
                  className={`w-[26px] h-[26px] transition-colors ${active ? 'text-brand-dark' : 'text-gray-400'}`}
                  strokeWidth={active ? 2.5 : 1.5}
                  fill={active && item.href === '/red-social' ? 'currentColor' : 'none'}
                />
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
