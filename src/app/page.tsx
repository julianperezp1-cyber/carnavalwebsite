'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NEXT_CARNIVAL, QUICK_FACTS, SPONSORS } from '@/lib/constants';
import {
  Calendar, ChevronRight, Play, ArrowRight, Globe, Award,
  Music, Users, Camera, Newspaper, ShoppingBag,
  BookOpen, Mic2, Trophy, Heart, ExternalLink,
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

      {/* ═══════════════════════════════════════
          HERO — Brand dark + carnival mesh bg
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-dark">
        {/* Carnival mesh gradient background (brandbook style) */}
        <div className="absolute inset-0 bg-carnival-mesh opacity-80" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Gradient bar left (brandbook signature element) */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 gradient-carnaval-vertical z-10" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full py-20 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Text content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 border border-white/10">
                <Globe className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs text-white/70 font-medium">Patrimonio Cultural Inmaterial de la Humanidad — UNESCO</span>
              </div>

              <h1 className="font-display font-black leading-[0.9] mb-6">
                <span className="text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl block">Carnaval</span>
                <span className="text-gradient-carnaval text-5xl sm:text-6xl lg:text-7xl xl:text-8xl block">de Barranquilla</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/50 max-w-lg mb-10 leading-relaxed font-light">
                Quien lo vive es quien lo goza.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href="/carnaval-2027"
                  className="inline-flex items-center gap-2.5 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-carnaval-red/25 hover:shadow-xl hover:-translate-y-0.5">
                  <Calendar className="h-4.5 w-4.5" />
                  Carnaval {NEXT_CARNIVAL.year}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/tradicion"
                  className="inline-flex items-center gap-2.5 bg-white/8 hover:bg-white/12 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-sm font-semibold border border-white/10 transition-all">
                  <Play className="h-4 w-4" />
                  Descubre la tradicion
                </Link>
              </div>
            </div>

            {/* Right — Countdown card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 w-full max-w-md relative overflow-hidden">
                {/* Mini gradient bar top */}
                <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />

                <div className="text-center mb-8">
                  <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-2">Proxima edicion</p>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                    Carnaval {NEXT_CARNIVAL.year}
                  </h2>
                  <p className="text-sm text-white/40 mt-1">6 — 9 de febrero</p>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-8">
                  {[
                    { value: countdown.days, label: 'Dias' },
                    { value: countdown.hours, label: 'Horas' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Seg' },
                  ].map((u) => (
                    <div key={u.label} className="text-center">
                      <div className="bg-white/8 rounded-xl py-3 border border-white/5">
                        <p className="text-3xl sm:text-4xl font-display font-black text-white tabular-nums">
                          {String(u.value).padStart(2, '0')}
                        </p>
                      </div>
                      <p className="text-[9px] text-white/30 font-semibold mt-2 uppercase tracking-widest">{u.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {NEXT_CARNIVAL.events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:bg-white/8 transition-colors cursor-pointer">
                      <span className="text-lg">{ev.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{ev.name}</p>
                        <p className="text-[11px] text-white/35">{ev.date}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/15" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GRADIENT DIVIDER BAR ═══ */}
      <div className="h-1.5 gradient-carnaval" />

      {/* ═══ QUICK FACTS ═══ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-8 sm:gap-6">
            {QUICK_FACTS.map((f, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-display font-black text-carnaval-red">{f.number}</p>
                <p className="text-xs text-gray-500 font-medium mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPLORE SECTIONS ═══ */}
      <section className="py-20 sm:py-24 bg-gray-50 relative">
        {/* Left gradient bar decoration */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-14">
            <p className="text-xs font-bold text-carnaval-green uppercase tracking-[0.2em] mb-3">Explora</p>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-brand-dark leading-[0.95]">
              Vive el<br />Carnaval
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Music, title: 'Tradicion y Folclor', desc: 'Danzas, comparsas, disfraces y letanias que hacen del Carnaval una expresion cultural unica', href: '/tradicion', accent: 'bg-carnaval-red' },
              { icon: Trophy, title: 'Congo de Oro', desc: 'El maximo reconocimiento a la excelencia artistica y la preservacion de la tradicion', href: '/tradicion/congo-de-oro', accent: 'bg-gold' },
              { icon: Users, title: 'Lideres de la Tradicion', desc: '18 agrupaciones con mas de 50 anos preservando las raices del Carnaval', href: '/tradicion/lideres', accent: 'bg-carnaval-green' },
              { icon: Newspaper, title: 'Noticias', desc: 'Las ultimas noticias, eventos y novedades del Carnaval de Barranquilla', href: '/noticias', accent: 'bg-carnaval-blue' },
              { icon: Camera, title: 'Multimedia', desc: 'Fotos, videos y publicaciones que capturan la esencia y la magia de la fiesta', href: '/multimedia', accent: 'bg-brand-dark' },
              { icon: Mic2, title: 'Convocatorias', desc: 'Participa en concursos, festival de orquestas, acreditaciones y mas', href: '/convocatorias', accent: 'bg-carnaval-green' },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                className="group bg-white rounded-2xl p-7 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className={`w-11 h-11 rounded-xl ${card.accent} flex items-center justify-center mb-5`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-display font-black text-brand-dark mb-2 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{card.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red group-hover:gap-2.5 transition-all">
                  Explorar <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UNESCO HIGHLIGHT ═══ */}
      <section className="py-20 sm:py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[150px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-carnaval-green/5 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-8 border border-gold/20">
                <Award className="h-4 w-4 text-gold" />
                <span className="text-xs text-gold font-bold">Patrimonio UNESCO desde 2003</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-[0.95]">
                Obra Maestra del Patrimonio Oral e Inmaterial
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-8">
                En noviembre de 2003, la UNESCO proclamo al Carnaval de Barranquilla como Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad, reconociendo su extraordinaria contribucion a la diversidad cultural del mundo.
              </p>
              <Link href="/tradicion/unesco"
                className="inline-flex items-center gap-2 bg-white/8 hover:bg-white/12 text-white px-6 py-3 rounded-xl text-sm font-bold border border-white/10 transition-colors">
                Conocer la declaratoria <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { year: '1903', title: 'Primera Batalla de Flores', desc: 'Se inicia la tradicion de los desfiles por las calles de Barranquilla', color: 'text-carnaval-red' },
                { year: '2001', title: 'Patrimonio Nacional', desc: 'Declarado Patrimonio Cultural de la Nacion mediante Ley 706', color: 'text-gold' },
                { year: '2003', title: 'Patrimonio UNESCO', desc: 'Proclamado Obra Maestra del Patrimonio Oral e Inmaterial', color: 'text-carnaval-green' },
                { year: 'Hoy', title: '+800 grupos folcloricos', desc: 'Participan cada ano preservando y renovando la tradicion viva', color: 'text-carnaval-blue' },
              ].map((m, i) => (
                <div key={i} className="flex items-start gap-5 bg-white/4 rounded-xl p-5 border border-white/5">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <span className={`text-sm font-display font-black ${m.color}`}>{m.year}</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">{m.title}</p>
                    <p className="text-sm text-white/35 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MERCADO CARNAVAL CTA ═══ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-carnaval-red rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-carnaval-red-hover/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 gradient-carnaval opacity-30" />

            <div className="relative grid lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-3">
                <p className="text-xs font-bold text-white/60 uppercase tracking-[0.2em] mb-4">Mercado Carnaval</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white mb-5 leading-[0.95]">
                  Todo para vivir<br />el Carnaval
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
                  Tiquetes aereos, hoteles, experiencias, transporte, boletas y la tienda oficial. Planifica tu viaje al Carnaval de Barranquilla.
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
                <a href="https://mercado.carnavaldebarranquilla.org"
                  className="group flex flex-col items-center gap-5 bg-white rounded-2xl p-10 shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-20 h-20 bg-carnaval-red rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-display font-black text-brand-dark">Mercado Carnaval</p>
                    <p className="text-sm text-gray-400 mt-1">Tu tienda del Carnaval</p>
                  </div>
                  <span className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-7 py-3 rounded-xl text-sm font-bold transition-colors">
                    Visitar <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT THE ORGANIZATION ═══ */}
      <section className="py-20 sm:py-24 bg-gray-50 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical hidden lg:block" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-14">
            <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-3">La Organizacion</p>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-brand-dark leading-[0.95]">
              Carnaval de<br />Barranquilla S.A.S.
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl text-base">
              Somos la organizacion encargada de planificar, producir y salvaguardar la fiesta mas grande de Colombia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Heart, title: 'Mision', desc: 'Convertir la celebracion del Carnaval en un espacio de inclusion, diversidad y orgullo colectivo', color: 'bg-carnaval-red' },
              { icon: Globe, title: 'Vision', desc: 'Consolidar a Carnaval de Barranquilla como una plataforma cultural y creativa viva los 365 dias del ano', color: 'bg-carnaval-green' },
              { icon: BookOpen, title: 'Transparencia', desc: 'Informes de gestion, sostenibilidad y documentos oficiales', color: 'bg-gold', href: '/somos/transparencia' },
              { icon: Award, title: 'Proveedores', desc: 'Convocatorias para empresas que quieran ser parte del Carnaval', color: 'bg-carnaval-blue', href: '/somos/proveedores' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-5`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                {card.href && (
                  <Link href={card.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red hover:text-carnaval-red-hover transition-colors">
                    Ver mas <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPONSORS ═══ */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-10">
            Con el apoyo de
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {SPONSORS.map((s, i) => (
              <span key={i} className="text-base font-bold text-gray-200 hover:text-gray-400 transition-colors cursor-default">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM GRADIENT BAR ═══ */}
      <div className="h-1.5 gradient-carnaval" />

      <Footer />
    </>
  );
}
