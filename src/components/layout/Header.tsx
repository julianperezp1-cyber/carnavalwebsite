'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Search, ShoppingBag, User, ExternalLink } from 'lucide-react';
import { NAV_ITEMS, SOCIAL_LINKS, SITE_TAGLINE } from '@/lib/constants';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleDropdownEnter(label: string) {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  }

  function handleDropdownLeave() {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-dark text-white/70 text-[11px] hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-8">
          <p className="flex items-center gap-1.5">
            <span className="text-gold font-semibold">🎭</span>
            {SITE_TAGLINE} — UNESCO 2003
          </p>
          <div className="flex items-center gap-4">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
            <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
            <span className="w-px h-3 bg-white/20" />
            <a href="https://mercado.carnavaldebarranquilla.org" className="text-gold hover:text-gold-hover font-semibold flex items-center gap-1 transition-colors">
              <ShoppingBag className="h-3 w-3" />
              Mercado Carnaval
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo - Official Torito horizontal */}
            <Link href="/" className="shrink-0">
              <Image
                src="/images/logo-horizontal.png"
                alt="Carnaval de Barranquilla"
                width={220}
                height={50}
                className="h-10 lg:h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && handleDropdownEnter(item.label)}
                  onMouseLeave={() => item.children && handleDropdownLeave()}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDropdown === item.label
                        ? 'bg-carnaval-red/5 text-carnaval-red'
                        : 'text-gray-700 hover:text-carnaval-red hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.children && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-carnaval-red/5 hover:text-carnaval-red transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Mercado CTA - desktop */}
              <a
                href="https://mercado.carnavaldebarranquilla.org"
                className="hidden lg:inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Mercado Carnaval
              </a>

              {/* User account */}
              <Link
                href="/cuenta"
                className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Mi cuenta"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-b border-gray-200 shadow-lg z-40">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Buscar en Carnaval de Barranquilla..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-base focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-brand-dark">Menu</p>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                    onClick={() => !item.children && setMobileOpen(false)}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-0.5 mb-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-carnaval-red/5 hover:text-carnaval-red transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile bottom actions */}
            <div className="p-4 border-t border-gray-100 space-y-3">
              <a
                href="https://mercado.carnavaldebarranquilla.org"
                className="flex items-center justify-center gap-2 w-full bg-carnaval-red hover:bg-carnaval-red-hover text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Ir a Mercado Carnaval
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
              <Link
                href="/cuenta"
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User className="h-4 w-4" />
                Mi cuenta
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
