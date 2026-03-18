'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin } from 'lucide-react';
import { LANDMARKS } from '@/lib/constants';

const CarnavalMap = dynamic(
  () => import('@/components/map/CarnavalMap').then(mod => ({ default: mod.CarnavalMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] sm:h-[600px] lg:h-[700px] rounded-2xl bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

const ROUTE_SECTIONS = [
  { name: 'Via 40 — Ruta Principal', desc: 'Escenario de la Batalla de Flores y la Gran Parada. Desde la calle 17 hasta la calle 53.', length: '5.2 km', color: 'bg-carnaval-red' },
  { name: 'Guacherna — Desfile Nocturno', desc: 'Desfile de faroles por la Calle 44. Cumbiambas y grupos folcloricos iluminan la noche.', length: '3.5 km', color: 'bg-gold' },
  { name: 'Centro Historico', desc: 'Comparsas, letanias y garabatos recorren las calles desde la Plaza de San Nicolas.', length: '2.8 km', color: 'bg-carnaval-green' },
];

export default function MapaPage() {
  return (
    <>
      <Header />

      <section className="relative bg-brand-dark overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 mb-4">
            <a href="/" className="text-xs text-white/40 hover:text-white/60">Inicio</a>
            <span className="text-xs text-white/20">/</span>
            <a href="/en-vivo" className="text-xs text-white/40 hover:text-white/60">En Vivo</a>
            <span className="text-xs text-white/20">/</span>
            <span className="text-xs text-white/70 font-medium">Mapa</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-display font-black text-white leading-[0.95]">
            Mapa Interactivo
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl">
            Explora Barranquilla en 3D. Rutas de desfiles, palcos oficiales y los mejores lugares de la ciudad.
          </p>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />

      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <CarnavalMap />
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-gray-400">
            <span>🖱️ Arrastra para mover</span>
            <span>🔍 Scroll para zoom</span>
            <span>⌥ + arrastrar para rotar 3D</span>
            <span>📍 Click en marcadores para info</span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-2">Rutas de desfiles</p>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-8">Recorridos oficiales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ROUTE_SECTIONS.map((route, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 ${route.color} rounded-full`} />
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full">{route.length}</span>
                </div>
                <h3 className="text-base font-display font-black text-brand-dark mb-1">{route.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{route.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-xs font-bold text-carnaval-blue uppercase tracking-[0.2em] mb-2">Lugares emblematicos</p>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-8">Barranquilla te espera</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LANDMARKS.map((lm, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow">
                <MapPin className="h-4 w-4 text-carnaval-blue mb-2" />
                <h4 className="text-sm font-display font-black text-brand-dark">{lm.name}</h4>
                <span className="text-[10px] text-gray-400 capitalize">{lm.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
