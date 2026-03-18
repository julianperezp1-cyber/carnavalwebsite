import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { MapPin, Route, Landmark, Eye, Construction } from 'lucide-react';
import { LANDMARKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Mapa Interactivo',
  description: 'Mapa interactivo del Carnaval de Barranquilla: rutas de desfiles, palcos, puntos turisticos y lugares emblematicos.',
};

const ROUTE_SECTIONS = [
  { name: 'Via 40 — Ruta Principal', desc: 'La avenida Via 40 es el escenario principal del Carnaval. Aqui se celebran la Batalla de Flores y la Gran Parada. El recorrido va desde la calle 17 hasta la calle 53, con palcos oficiales y zonas de acceso gratuito.', length: '5.2 km' },
  { name: 'Ruta del Centro', desc: 'El centro historico de Barranquilla cobra vida con las comparsas, letanias y garabatos que recorren sus calles desde la Plaza de San Nicolas hasta el Paseo Bolivar.', length: '2.8 km' },
  { name: 'Ruta de la Guacherna', desc: 'El desfile nocturno de la Guacherna recorre la Calle 44 desde la carrera 44 hasta la Via 40, iluminado por faroles y la alegria de cumbiambas y grupos folcloricos.', length: '3.5 km' },
];

const MAP_CATEGORIES = [
  { name: 'Desfiles', icon: Route, color: 'text-carnaval-red', bg: 'bg-carnaval-red/10', count: 3 },
  { name: 'Palcos', icon: Eye, color: 'text-carnaval-green', bg: 'bg-carnaval-green/10', count: 12 },
  { name: 'Turismo', icon: Landmark, color: 'text-carnaval-blue', bg: 'bg-carnaval-blue/10', count: 8 },
];

export default function MapaPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Mapa Interactivo"
        subtitle="Descubre las rutas de desfiles, palcos oficiales y puntos turisticos del Carnaval de Barranquilla."
        breadcrumbs={[{ label: 'En Vivo', href: '/en-vivo' }, { label: 'Mapa' }]}
        accentColor="blue"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Map placeholder */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="aspect-[16/9] lg:aspect-[21/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
            <Construction className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-display font-black text-gray-400 mb-2">Mapa 3D en desarrollo</h3>
            <p className="text-sm text-gray-400 max-w-md text-center">Estamos construyendo un mapa interactivo 3D con recorridos virtuales, palcos y puntos de interes.</p>
          </div>

          {/* Categories */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {MAP_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                <div className={`w-10 h-10 ${cat.bg} rounded-xl flex items-center justify-center`}>
                  <cat.icon className={`h-5 w-5 ${cat.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-display font-black text-brand-dark">{cat.name}</h4>
                  <p className="text-xs text-gray-400">{cat.count} puntos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Routes */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-red/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-red rounded-full" />
              <span className="text-xs font-bold text-carnaval-red">Rutas de desfiles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Recorridos Oficiales</h2>
          </div>
          <div className="space-y-4">
            {ROUTE_SECTIONS.map((route, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-carnaval-red/10 rounded-xl flex items-center justify-center shrink-0">
                    <Route className="h-5 w-5 text-carnaval-red" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-display font-black text-brand-dark">{route.name}</h3>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{route.length}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{route.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landmarks */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-blue/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-blue rounded-full" />
              <span className="text-xs font-bold text-carnaval-blue">Puntos de interes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Lugares Emblematicos</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Los puntos de referencia del Carnaval y la ciudad de Barranquilla.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LANDMARKS.map((lm, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-carnaval-blue" />
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full capitalize">{lm.type}</span>
                </div>
                <h4 className="text-sm font-display font-black text-brand-dark">{lm.name}</h4>
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
