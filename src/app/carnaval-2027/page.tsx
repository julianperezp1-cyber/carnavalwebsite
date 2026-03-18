import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { NEXT_CARNIVAL } from '@/lib/constants';
import {
  Calendar, MapPin, Clock, Ticket, Music, Users,
  Star, ArrowRight, ExternalLink, ShoppingBag, Info,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `Carnaval ${NEXT_CARNIVAL.year} — Programacion y Agenda`,
  description: `Conoce la programacion oficial del Carnaval de Barranquilla ${NEXT_CARNIVAL.year}. Batalla de Flores, Gran Parada de Tradicion, Gran Parada de Comparsas, Festival de Orquestas y todos los eventos.`,
};

const EVENTS_DETAIL = [
  {
    name: 'Batalla de Flores',
    date: 'Sabado 6 de Febrero',
    time: '12:00 PM — 7:00 PM',
    location: 'Via 40',
    icon: '🌺',
    color: 'bg-carnaval-red',
    description: 'El desfile inaugural del Carnaval. Carrozas decoradas con flores, comparsas, cumbiambas y disfraces recorren la Via 40 en una explosion de color y alegria que marca el inicio oficial de la fiesta.',
    highlights: ['Carrozas alegoricas', 'Reina del Carnaval', 'Comparsas y cumbiambas', 'Disfraces tradicionales'],
  },
  {
    name: 'Gran Parada de Tradicion',
    date: 'Domingo 7 de Febrero',
    time: '12:00 PM — 7:00 PM',
    location: 'Via 40',
    icon: '🎭',
    color: 'bg-carnaval-green',
    description: 'El desfile que honra las raices del Carnaval. Grupos folcloricos tradicionales como congos, garabatos, cumbiambas y danzas especiales muestran la esencia cultural de la fiesta.',
    highlights: ['Danzas tradicionales', 'Congos y garabatos', 'Cumbiambas centenarias', 'Lideres de la tradicion'],
  },
  {
    name: 'Gran Parada de Comparsas',
    date: 'Lunes 8 de Febrero',
    time: '12:00 PM — 7:00 PM',
    location: 'Via 40',
    icon: '💃',
    color: 'bg-gold',
    description: 'La creatividad y la fantasia se toman la Via 40. Comparsas con coreografias espectaculares, vestuarios elaborados y propuestas artisticas innovadoras desfilan ante miles de espectadores.',
    highlights: ['Comparsas de fantasia', 'Coreografias elaboradas', 'Vestuarios espectaculares', 'Propuestas artisticas'],
  },
  {
    name: 'Festival de Orquestas',
    date: 'Martes 9 de Febrero',
    time: '4:00 PM — 2:00 AM',
    location: 'Estadio Romelio Martinez',
    icon: '🎵',
    color: 'bg-carnaval-blue',
    description: 'El cierre musical del Carnaval. Las mejores orquestas y artistas de salsa, cumbia, vallenato, champeta y otros generos compiten por el Congo de Oro en una noche de musica inolvidable.',
    highlights: ['Congo de Oro musical', 'Salsa y cumbia en vivo', 'Artistas nacionales', 'Cierre del Carnaval'],
  },
];

export default function Carnaval2027Page() {
  return (
    <>
      <Header />

      <PageHeader
        title={`Carnaval ${NEXT_CARNIVAL.year}`}
        subtitle="6 — 9 de febrero. Cuatro dias de tradicion, cultura y alegria en la fiesta mas grande de Colombia."
        breadcrumbs={[{ label: `Carnaval ${NEXT_CARNIVAL.year}` }]}
        dark
      />

      {/* Gradient bar */}
      <div className="h-1.5 gradient-carnaval" />

      {/* Quick info bar */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: Calendar, label: '6 — 9 Feb 2027' },
              { icon: MapPin, label: 'Barranquilla, Colombia' },
              { icon: Users, label: '2M+ asistentes' },
              { icon: Music, label: '800+ grupos' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <item.icon className="h-4 w-4 text-carnaval-red" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Get tickets */}
      <section className="py-8 bg-carnaval-red/5 border-b border-carnaval-red/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Ticket className="h-5 w-5 text-carnaval-red" />
            <div>
              <p className="text-sm font-bold text-brand-dark">Consigue tus boletas y planifica tu viaje</p>
              <p className="text-xs text-gray-500">Vuelos, hoteles, boletas y experiencias en Mercado Carnaval</p>
            </div>
          </div>
          <a href="https://mercado.carnavaldebarranquilla.org" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0">
            <ShoppingBag className="h-4 w-4" />
            Ir a Mercado Carnaval
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* Events detail */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-2">Programacion</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Los 4 grandes eventos</h2>
          </div>

          <div className="space-y-8">
            {EVENTS_DETAIL.map((event, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid lg:grid-cols-3 gap-0">
                  {/* Left: color block with icon */}
                  <div className={`${event.color} p-8 lg:p-10 flex flex-col justify-center`}>
                    <span className="text-5xl mb-4">{event.icon}</span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white leading-tight">{event.name}</h3>
                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-white/80 text-sm">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {event.date}
                      </p>
                      <p className="flex items-center gap-2 text-white/80 text-sm">
                        <Clock className="h-4 w-4 shrink-0" />
                        {event.time}
                      </p>
                      <p className="flex items-center gap-2 text-white/80 text-sm">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {/* Right: description + highlights */}
                  <div className="lg:col-span-2 p-8 lg:p-10">
                    <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {event.highlights.map((h, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-gold shrink-0" />
                          <span className="text-sm text-gray-700 font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important info */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">Informacion importante</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Como llegar', desc: 'Barranquilla cuenta con el Aeropuerto Internacional Ernesto Cortissoz (BAQ) con vuelos directos desde Bogota, Medellin, Cali y Miami.', icon: MapPin },
              { title: 'Donde hospedarse', desc: 'Hoteles desde $80.000/noche. Las mejores zonas: Norte, Riomar, Alto Prado. Reserva con anticipacion en temporada de Carnaval.', icon: Star },
              { title: 'Palcos y tribuna', desc: 'Hay palcos oficiales a lo largo de la Via 40. Puedes comprar tus entradas en Mercado Carnaval o en puntos de venta autorizados.', icon: Ticket },
              { title: 'Seguridad', desc: 'El Carnaval cuenta con un operativo de seguridad de mas de 10.000 efectivos. Sigue las indicaciones oficiales y disfruta tranquilo.', icon: Users },
              { title: 'Clima', desc: 'Febrero en Barranquilla es calido y seco. Temperaturas entre 28°C y 34°C. Usa protector solar, sombrero y mantente hidratado.', icon: Info },
              { title: 'Transporte', desc: 'Durante los desfiles hay cierres viales en la Via 40. Usa transporte publico, taxi o servicios de transporte por app. Planifica tu ruta.', icon: MapPin },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <card.icon className="h-6 w-6 text-carnaval-red mb-3" />
                <h3 className="text-base font-display font-black text-brand-dark mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-brand-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-4">
            Planifica tu Carnaval {NEXT_CARNIVAL.year}
          </h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Vuelos, hoteles, boletas, experiencias y transporte. Todo en un solo lugar.
          </p>
          <a href="https://mercado.carnavaldebarranquilla.org" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-carnaval-red/25">
            <ShoppingBag className="h-4 w-4" />
            Ir a Mercado Carnaval
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
