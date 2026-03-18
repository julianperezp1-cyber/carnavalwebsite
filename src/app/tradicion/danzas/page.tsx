import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Music, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Danzas del Carnaval',
  description: 'Conoce las danzas tradicionales del Carnaval de Barranquilla: Congo, Garabato, Mapale, Son de Negro, Cumbiamba, Paloteo, Farotas, Diablos y mas.',
};

const DANZAS = {
  tradicionales: [
    { name: 'Danza del Congo', desc: 'Danza de origen africano con vestuarios coloridos, turbantes y animales. Los congos representan la realeza africana y su resistencia cultural.', origin: 'Africano' },
    { name: 'Danza del Garabato', desc: 'Representa la lucha entre la vida y la muerte. Los bailarines con capas coloridas combaten a la muerte vestida de negro.', origin: 'Hispano-africano' },
    { name: 'Mapale', desc: 'Danza de ritmo frenetico de origen africano. Movimientos agiles y sensuales que evocan la pesca nocturna en el rio Magdalena.', origin: 'Africano' },
    { name: 'Son de Negro', desc: 'Los bailarines se pintan el cuerpo de negro y danzan con movimientos fuertes y sensuales al ritmo de tambores.', origin: 'Africano' },
    { name: 'Cumbiamba', desc: 'La expresion mas pura de la cumbia colombiana. Parejas bailan con velas encendidas en un ritual de cortejo y celebracion.', origin: 'Triétnico' },
  ],
  relacion: [
    { name: 'Paloteo', desc: 'Danza de origen espanol donde dos filas de bailarines chocan palos de madera al ritmo de la musica, representando batallas.', origin: 'Espanol' },
    { name: 'Danza del Caiman', desc: 'Recrea la leyenda del hombre caiman del rio Magdalena. El caiman persigue a una mujer bella mientras el pueblo intenta capturarlo.', origin: 'Local' },
    { name: 'Danza de los Goleros', desc: 'Tambien llamada de los Gallinazos. Los bailarines imitan el vuelo de estas aves sobre un burro muerto.', origin: 'Local' },
    { name: 'Las Pilanderas', desc: 'Mujeres danzan con pilones (morteros de madera) recreando el proceso de pilar el maiz y el arroz.', origin: 'Indigena-africano' },
  ],
  especiales: [
    { name: 'Los Diablos', desc: 'Danzantes con mascaras y capas multicolores que representan a los diablos del Carnaval con acrobacias y juegos con fuego.', origin: 'Hispano' },
    { name: 'El Gusano', desc: 'Los bailarines forman una larga fila ondulante que simula el movimiento de un gusano gigante por las calles.', origin: 'Popular' },
    { name: 'Las Farotas', desc: 'Hombres vestidos de mujer que danzan con movimientos exagerados y comicos. Una de las danzas mas antiguas del Carnaval.', origin: 'Colonial' },
    { name: 'Danza de Indios', desc: 'Diversas danzas que representan las tradiciones indigenas con plumajes, pinturas corporales y ritmos ancestrales.', origin: 'Indigena' },
  ],
};

export default function DanzasPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Danzas del Carnaval"
        subtitle="13 danzas que representan la fusion de tradiciones indigenas, africanas y europeas."
        breadcrumbs={[{ label: 'Tradicion', href: '/tradicion' }, { label: 'Danzas' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Tradicionales */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-red/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-red rounded-full" />
              <span className="text-xs font-bold text-carnaval-red">5 danzas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Danzas Tradicionales</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Las expresiones mas antiguas y representativas del folclor carnavalero.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DANZAS.tradicionales.map((d, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Music className="h-5 w-5 text-carnaval-red" />
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full">{d.origin}</span>
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{d.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relacion */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-green/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-green rounded-full" />
              <span className="text-xs font-bold text-carnaval-green">4 danzas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Danzas de Relacion</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Danzas que narran historias, leyendas y relaciones entre personajes.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {DANZAS.relacion.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Music className="h-5 w-5 text-carnaval-green" />
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{d.origin}</span>
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{d.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Especiales */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-gold rounded-full" />
              <span className="text-xs font-bold text-amber-700">4 danzas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Danzas Especiales</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Expresiones unicas que combinan elementos de distintas tradiciones culturales.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {DANZAS.especiales.map((d, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Music className="h-5 w-5 text-gold" />
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full">{d.origin}</span>
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{d.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
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
