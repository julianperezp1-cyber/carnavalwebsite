'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NEXT_CARNIVAL, QUICK_FACTS, SPONSORS } from '@/lib/constants';
import {
  Calendar, ArrowRight, Globe, Award, Ticket, Map, Radio,
  Music, Camera, Newspaper, ShoppingBag, Headphones,
  Mic2, Trophy, ExternalLink, GraduationCap, CalendarDays, Users,
} from 'lucide-react';

// ── Countdown ──
function useCountdown(targetDate: Date) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

export default function HomePage() {
  const countdown = useCountdown(NEXT_CARNIVAL.startDate);

  return (
    <>
      <Header />

      {/* ═══ 1. HERO — Video + Countdown + 1 CTA ═══ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-brand-dark">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/hero-carnaval.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-brand-dark/40 to-brand-dark/80" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 gradient-carnaval-vertical z-10" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/15">
                <Globe className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs text-white/80 font-medium">Patrimonio UNESCO — Desde 2003</span>
              </div>

              <h1 className="font-display font-black leading-[0.9] mb-5">
                <span className="text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl block">Carnaval</span>
                <span className="text-gold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl block">de Barranquilla</span>
              </h1>

              <p className="text-lg text-white/60 max-w-md mb-8">
                Quien lo vive es quien lo goza.
              </p>

              <Link href="/carnaval-2027"
                className="inline-flex items-center gap-2.5 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/30 hover:shadow-xl hover:-translate-y-0.5">
                <Calendar className="h-4 w-4" />
                Vive el Carnaval {NEXT_CARNIVAL.year}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Countdown */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/15 p-8 w-full max-w-sm">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval rounded-t-2xl" />
                <div className="text-center mb-6">
                  <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-1">Faltan</p>
                  <p className="text-sm text-white/50">6 — 9 de febrero, {NEXT_CARNIVAL.year}</p>
                </div>
                <div className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-3">
                  {[
                    { value: countdown.days, label: 'Dias' },
                    { value: countdown.hours, label: 'Hrs' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Seg' },
                  ].map((u) => (
                    <div key={u.label} className="text-center">
                      <div className="bg-white/10 rounded-xl py-2 sm:py-3 border border-white/10">
                        <p className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white tabular-nums">
                          {String(u.value).padStart(2, '0')}
                        </p>
                      </div>
                      <p className="text-[9px] text-white/35 font-semibold mt-1.5 uppercase tracking-widest">{u.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GRADIENT BAR ═══ */}
      <div className="h-1.5 gradient-carnaval" />

      {/* ═══ 2. QUICK ACCESS BAR — App-style icons ═══ */}
      <section className="py-8 sm:py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-8">
            {[
              { icon: Ticket, label: 'Boletas', href: 'https://mercado.carnavaldebarranquilla.org', color: 'bg-carnaval-red', external: true },
              { icon: CalendarDays, label: 'Programacion', href: '/carnaval-2027', color: 'bg-carnaval-green' },
              { icon: Newspaper, label: 'Noticias', href: '/noticias', color: 'bg-gold' },
              { icon: ShoppingBag, label: 'Mercado', href: 'https://mercado.carnavaldebarranquilla.org', color: 'bg-brand-dark', external: true },
              { icon: Radio, label: 'En Vivo', href: '/en-vivo', color: 'bg-carnaval-blue' },
            ].map((item) => {
              const El = item.external ? 'a' : Link;
              const extraProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
              return (
                <El key={item.label} href={item.href} {...extraProps as any}
                  className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all`}>
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-600 group-hover:text-brand-dark transition-colors">{item.label}</span>
                </El>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ 3. LATEST NEWS — 3 featured cards ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-2">Noticias</p>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Ultimas noticias</h2>
            </div>
            <Link href="/noticias" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-carnaval-red hover:text-carnaval-red-hover transition-colors">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Placeholder news cards — will be replaced with real CMS data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Carnaval de Barranquilla anuncia fechas para 2027', date: 'Mar 15, 2026', tag: 'Oficial' },
              { title: 'Convocatoria abierta para Festival de Orquestas', date: 'Mar 10, 2026', tag: 'Convocatoria' },
              { title: 'Carnaval presente en encuentro internacional de la UNESCO', date: 'Mar 5, 2026', tag: 'Internacional' },
            ].map((news, i) => (
              <Link key={i} href="/noticias" className="group">
                <div className="aspect-[16/10] bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold text-carnaval-red uppercase tracking-wider">{news.tag}</span>
                <h3 className="text-lg font-display font-black text-brand-dark mt-1 group-hover:text-carnaval-red transition-colors leading-tight">
                  {news.title}
                </h3>
                <p className="text-xs text-gray-400 mt-2">{news.date}</p>
              </Link>
            ))}
          </div>

          <Link href="/noticias" className="sm:hidden flex items-center justify-center gap-1.5 text-sm font-bold text-carnaval-red mt-8">
            Ver todas las noticias <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ 4. CARNAVAL 2027 — 4 events with photos ═══ */}
      <section className="py-16 sm:py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-2">Programacion</p>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                Carnaval {NEXT_CARNIVAL.year}
              </h2>
            </div>
            <Link href="/carnaval-2027" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-gold hover:text-gold-hover transition-colors">
              Ver agenda completa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {NEXT_CARNIVAL.events.map((ev, i) => (
              <Link key={i} href="/carnaval-2027" className="group relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[3/4]">
                {/* Placeholder — will be real photos */}
                <div className={`absolute inset-0 ${
                  i === 0 ? 'bg-carnaval-red' : i === 1 ? 'bg-carnaval-green' : i === 2 ? 'bg-gold' : 'bg-carnaval-blue'
                } opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-3xl mb-2 block">{ev.icon}</span>
                  <h3 className="text-lg font-display font-black text-white leading-tight">{ev.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{ev.date}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. MERCADO CARNAVAL — Planifica tu viaje ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-carnaval-red rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 gradient-carnaval opacity-30" />
            <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center relative">
              <div className="lg:col-span-3">
                <p className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-3">Planifica tu viaje</p>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4 leading-[0.95]">
                  Todo en Mercado Carnaval
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-lg">
                  Vuelos, hoteles, boletas, experiencias, transporte y la tienda oficial del Carnaval de Barranquilla.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['✈️ Vuelos', '🏨 Hoteles', '🎫 Boletas', '🎭 Experiencias', '🚗 Transporte', '👕 Tienda'].map((item) => (
                    <span key={item} className="bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-center">
                <a href="https://mercado.carnavaldebarranquilla.org" target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 bg-white rounded-2xl p-8 shadow-2xl hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 bg-carnaval-red rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-display font-black text-brand-dark">Mercado Carnaval</p>
                    <p className="text-xs text-gray-400 mt-0.5">Tu tienda del Carnaval</p>
                  </div>
                  <span className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Visitar <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. TRADICIÓN / CULTURA — Visual cards ═══ */}
      <section className="py-16 sm:py-20 bg-gray-50 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-carnaval-green uppercase tracking-[0.2em] mb-2">Tradicion</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Nuestra cultura viva</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Music, title: 'Danzas y Folclor', desc: 'Cumbia, Garabato, Mapale, Congo y mas', href: '/tradicion/danzas', color: 'bg-carnaval-red' },
              { icon: Trophy, title: 'Congo de Oro', desc: 'El maximo reconocimiento artistico', href: '/tradicion/congo-de-oro', color: 'bg-gold' },
              { icon: Users, title: 'Lideres de la Tradicion', desc: '18 grupos con +50 anos de historia', href: '/tradicion/lideres', color: 'bg-carnaval-green' },
              { icon: Award, title: 'Patrimonio UNESCO', desc: 'Reconocimiento mundial desde 2003', href: '/tradicion/unesco', color: 'bg-carnaval-blue' },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-display font-black text-brand-dark mb-1 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. COMMUNITY / INTERACTIVE — New features ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-2">Comunidad</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">
              El Carnaval es de todos
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl text-sm">
              Crea tu Carnaval ID, comparte tus experiencias, aprende sobre la tradicion y conecta con la comunidad carnavalera todo el ano.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Carnaval ID', desc: 'Tu identidad carnavalera. Insignias, historial, fotos y conexiones con otros carnavaleros.', href: '/cuenta', tag: 'Nuevo', tagColor: 'bg-carnaval-red' },
              { icon: Camera, title: 'Galeria comunitaria', desc: 'Sube tus fotos y videos del Carnaval. Vota por las mejores memorias de cada ano.', href: '/comunidad/galeria', tag: 'Nuevo', tagColor: 'bg-carnaval-green' },
              { icon: GraduationCap, title: 'Academia del Carnaval', desc: 'Aprende a bailar cumbia, la historia del Garabato, quiz interactivos y mucho mas.', href: '/comunidad/academia', tag: 'Nuevo', tagColor: 'bg-gold' },
              { icon: Map, title: 'Mapa interactivo', desc: 'Rutas de desfiles, palcos, entradas y los mejores lugares turisticos de Barranquilla.', href: '/en-vivo/mapa', tag: 'Nuevo', tagColor: 'bg-carnaval-blue' },
              { icon: Headphones, title: 'Podcast Carnaval', desc: 'Siempre Reinas y mas. Historias, entrevistas y la musica del Carnaval.', href: '/en-vivo/podcast' },
              { icon: CalendarDays, title: 'Calendario 365', desc: 'Eventos durante todo el ano. Pre-carnaval, talleres, festival de verano y mas.', href: '/comunidad/calendario' },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                className="group bg-gray-50 hover:bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative">
                {card.tag && (
                  <span className={`absolute top-4 right-4 ${card.tagColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                    {card.tag}
                  </span>
                )}
                <card.icon className="h-8 w-8 text-brand-dark mb-4" />
                <h3 className="text-base font-display font-black text-brand-dark mb-1.5 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. QUICK FACTS ═══ */}
      <section className="py-12 bg-brand-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {QUICK_FACTS.map((f, i) => (
              <div key={i} className="text-center">
                <p className="text-xl sm:text-3xl md:text-4xl font-display font-black text-gold">{f.number}</p>
                <p className="text-[10px] sm:text-[11px] text-white/40 font-medium mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. SPONSORS ═══ */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-8">Con el apoyo de</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-10 gap-y-4">
            {SPONSORS.map((s, i) => (
              <span key={i} className="text-sm font-bold text-gray-200 hover:text-gray-400 transition-colors cursor-default">{s.name}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />

      <Footer />
    </>
  );
}
