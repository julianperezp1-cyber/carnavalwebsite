'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NEXT_CARNIVAL, QUICK_FACTS, SPONSORS } from '@/lib/constants';
import {
  Calendar, ChevronRight, Play, ArrowRight, Sparkles, Globe, Award,
  Music, Users, Camera, Newspaper, ShoppingBag, Star,
  BookOpen, Mic2, Palette, Trophy, Heart, ExternalLink,
} from 'lucide-react';

// ── Countdown hook ──
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }
    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function HomePage() {
  const countdown = useCountdown(NEXT_CARNIVAL.startDate);

  return (
    <>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center bg-deep-blue overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-deep-blue-light to-deep-blue" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-carnaval-red/10 blur-[100px]" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-carnival-purple/10 blur-[80px]" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #FFCE38 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/10">
                <Globe className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs text-white/80 font-medium">Patrimonio Cultural Inmaterial de la Humanidad — UNESCO</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black text-white leading-[0.95] mb-6">
                Carnaval
                <br />
                <span className="text-gradient-carnaval">de Barranquilla</span>
              </h1>

              <p className="text-base sm:text-lg text-white/60 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Mas de 120 anos de tradicion, cultura y alegria. La fiesta mas grande de Colombia te espera.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link href="/carnaval-2027" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-7 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-carnaval-red/20 hover:shadow-xl hover:shadow-carnaval-red/30 hover:-translate-y-0.5">
                  <Calendar className="h-4 w-4" />
                  Carnaval {NEXT_CARNIVAL.year}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/tradicion" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl text-sm font-semibold border border-white/15 transition-all">
                  <Play className="h-4 w-4" />
                  Descubre la tradicion
                </Link>
              </div>
            </div>

            {/* Countdown card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <p className="text-xs text-gold font-bold uppercase tracking-widest mb-1">Proxima edicion</p>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white">
                    Carnaval {NEXT_CARNIVAL.year}
                  </h2>
                  <p className="text-sm text-white/50 mt-1">6 - 9 de Febrero, {NEXT_CARNIVAL.year}</p>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { value: countdown.days, label: 'Dias' },
                    { value: countdown.hours, label: 'Horas' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Seg' },
                  ].map((unit) => (
                    <div key={unit.label} className="text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/5 animate-pulse-glow">
                        <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                          {String(unit.value).padStart(2, '0')}
                        </p>
                      </div>
                      <p className="text-[10px] text-white/40 font-medium mt-1.5 uppercase tracking-wider">{unit.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {NEXT_CARNIVAL.events.map((event, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                      <span className="text-lg">{event.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{event.name}</p>
                        <p className="text-[10px] text-white/40">{event.date}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-white/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══ QUICK FACTS ═══ */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-4">
            {QUICK_FACTS.map((fact, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-carnaval-red">{fact.number}</p>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPLORE SECTIONS ═══ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Explora
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-deep-blue">Vive el Carnaval</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm sm:text-base">
              Descubre todo lo que hace al Carnaval de Barranquilla la celebracion cultural mas importante de Colombia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Music, title: 'Tradicion y Folclor', desc: 'Danzas, comparsas, disfraces y letanias que hacen del Carnaval una expresion cultural unica', href: '/tradicion', color: 'bg-carnaval-red/10 text-carnaval-red' },
              { icon: Trophy, title: 'Congo de Oro', desc: 'El maximo reconocimiento a la excelencia artistica y la preservacion de la tradicion', href: '/tradicion/congo-de-oro', color: 'bg-gold/15 text-amber-700' },
              { icon: Users, title: 'Lideres de la Tradicion', desc: '18 agrupaciones con mas de 50 anos preservando las raices del Carnaval', href: '/tradicion/lideres', color: 'bg-carnival-purple/10 text-carnival-purple' },
              { icon: Newspaper, title: 'Noticias', desc: 'Mantente informado con las ultimas noticias, eventos y novedades del Carnaval', href: '/noticias', color: 'bg-blue-accent/10 text-blue-accent' },
              { icon: Camera, title: 'Multimedia', desc: 'Fotos, videos y publicaciones que capturan la esencia y la magia de la fiesta', href: '/multimedia', color: 'bg-carnival-pink/10 text-carnival-pink' },
              { icon: Mic2, title: 'Convocatorias', desc: 'Participa en concursos, festival de orquestas, acreditaciones y mas', href: '/convocatorias', color: 'bg-green-accent/10 text-green-accent' },
            ].map((card) => (
              <Link key={card.href} href={card.href} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-carnaval-red group-hover:gap-2 transition-all">
                  Explorar <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ UNESCO HIGHLIGHT ═══ */}
      <section className="py-16 sm:py-20 bg-deep-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-carnaval-red/5 blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-6 border border-gold/20">
                <Award className="h-4 w-4 text-gold" />
                <span className="text-xs text-gold font-bold">Patrimonio UNESCO desde 2003</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4 leading-tight">
                Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                En noviembre de 2003, la UNESCO proclamo al Carnaval de Barranquilla como Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad, reconociendo su extraordinaria contribucion a la diversidad cultural del mundo.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tradicion/unesco" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 transition-colors">
                  Conocer la declaratoria <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { year: '1903', title: 'Primera Batalla de Flores', desc: 'Se inicia la tradicion de los desfiles por las calles de Barranquilla' },
                { year: '2001', title: 'Patrimonio Nacional', desc: 'Declarado Patrimonio Cultural de la Nacion mediante Ley 706' },
                { year: '2003', title: 'Patrimonio UNESCO', desc: 'Proclamado Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad' },
                { year: 'Hoy', title: '+800 grupos folcloricos', desc: 'Participan cada ano preservando y renovando la tradicion viva' },
              ].map((milestone, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-gold">{milestone.year}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{milestone.title}</p>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MERCADO CARNAVAL CTA ═══ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-carnaval-red via-carnaval-red to-carnaval-red-hover rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-4 border border-white/15">
                  <ShoppingBag className="h-3.5 w-3.5 text-gold" />
                  <span className="text-xs text-white font-semibold">Mercado Carnaval</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4 leading-tight">
                  Todo para vivir el Carnaval en un solo lugar
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6">
                  Tiquetes aereos, hoteles, experiencias, transporte, boletas y la tienda oficial. Planifica tu viaje al Carnaval de Barranquilla.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['✈️ Vuelos', '🏨 Hoteles', '🎫 Boletas', '🎭 Experiencias', '🚗 Transporte', '👕 Tienda'].map((item) => (
                    <span key={item} className="inline-flex items-center bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <a href="https://mercado.carnavaldebarranquilla.org" className="group inline-flex flex-col items-center gap-4 bg-white rounded-2xl p-8 shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-carnaval-red rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-deep-blue">Mercado Carnaval</p>
                    <p className="text-xs text-gray-500 mt-1">Tu tienda del Carnaval</p>
                  </div>
                  <span className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Visitar tienda <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red uppercase tracking-widest mb-3">
              <Heart className="h-3.5 w-3.5" />
              La Organizacion
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-deep-blue">Carnaval de Barranquilla S.A.S.</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
              Somos la organizacion encargada de planificar, producir y salvaguardar la fiesta mas grande de Colombia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Star, title: 'Mision', desc: 'Salvaguardar, promover y organizar el Carnaval como patrimonio cultural de la humanidad' },
              { icon: Globe, title: 'Vision', desc: 'Ser referente mundial en la gestion del patrimonio cultural inmaterial' },
              { icon: BookOpen, title: 'Transparencia', desc: 'Informes de gestion, sostenibilidad y documentos oficiales', href: '/somos/transparencia' },
              { icon: Palette, title: 'Proveedores', desc: 'Convocatorias para empresas que quieran ser parte', href: '/somos/proveedores' },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-carnaval-red/10 flex items-center justify-center mb-3">
                  <card.icon className="h-5 w-5 text-carnaval-red" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.desc}</p>
                {card.href && (
                  <Link href={card.href} className="inline-flex items-center gap-1 text-xs font-semibold text-carnaval-red hover:text-carnaval-red-hover transition-colors">
                    Ver mas <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPONSORS ═══ */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Aliados y patrocinadores</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {SPONSORS.map((sponsor, i) => (
              <div key={i} className="text-sm sm:text-base font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-default" title={sponsor.name}>
                {sponsor.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
