import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Trophy, Star, Music, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Congo de Oro',
  description: 'El Congo de Oro: maximo reconocimiento a la excelencia artistica en el Carnaval de Barranquilla. Categorias, criterios y ganadores.',
};

const CATEGORIES = [
  { name: 'Danza de Congo', icon: '🥁' },
  { name: 'Danza de Garabato', icon: '💀' },
  { name: 'Cumbiamba', icon: '🕯️' },
  { name: 'Comparsas', icon: '💃' },
  { name: 'Disfraces Individuales', icon: '🎭' },
  { name: 'Disfraces Colectivos', icon: '👥' },
  { name: 'Letanias', icon: '📜' },
  { name: 'Comedias', icon: '🎪' },
  { name: 'Danzas Especiales', icon: '✨' },
  { name: 'Danzas de Relacion', icon: '⚔️' },
  { name: 'Festival de Orquestas', icon: '🎵' },
  { name: 'Mejor Carroza', icon: '🌺' },
];

const RECOGNITION_LEVELS = [
  { name: 'Congo de Oro', desc: 'Maximo reconocimiento. Excelencia artistica, autenticidad y creatividad sobresaliente.', color: 'bg-gold', textColor: 'text-amber-800', icon: Trophy },
  { name: 'Congo de Excelencia', desc: 'Alto nivel artistico y fidelidad a la tradicion con innovacion destacada.', color: 'bg-gray-200', textColor: 'text-gray-700', icon: Star },
  { name: 'Congo de Honor', desc: 'Reconocimiento a la participacion destacada y compromiso con la tradicion.', color: 'bg-amber-700', textColor: 'text-amber-100', icon: Award },
];

export default function CongoDeOroPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Congo de Oro"
        subtitle="El maximo reconocimiento a la excelencia artistica y la preservacion de la tradicion del Carnaval."
        breadcrumbs={[{ label: 'Tradicion', href: '/tradicion' }, { label: 'Congo de Oro' }]}
        accentColor="gold"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* About */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-3">Sobre el premio</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark mb-6">El premio mas codiciado del Carnaval</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>El Congo de Oro es la maxima distincion que otorga el Carnaval de Barranquilla a los grupos folcloricos, artistas y creadores que demuestran excelencia artistica, autenticidad cultural y creatividad en su participacion.</p>
              <p>Cada ano, un jurado de expertos evalua a mas de 800 agrupaciones en diferentes categorias, otorgando reconocimientos en tres niveles: Congo de Oro, Congo de Excelencia y Congo de Honor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition levels */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-10">Niveles de reconocimiento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RECOGNITION_LEVELS.map((level, i) => (
              <div key={i} className={`${level.color} rounded-2xl p-8 text-center`}>
                <level.icon className={`h-12 w-12 mx-auto mb-4 ${level.textColor}`} />
                <h3 className={`text-xl font-display font-black ${level.textColor} mb-3`}>{level.name}</h3>
                <p className={`text-sm ${level.textColor} opacity-80`}>{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-10">Categorias de premiacion</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100 hover:shadow-lg transition-shadow">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="text-sm font-display font-black text-brand-dark">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival de Orquestas */}
      <section className="py-16 sm:py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl">
            <Music className="h-10 w-10 text-gold mb-4" />
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">Festival de Orquestas</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              Desde 1969, el Festival de Orquestas es el cierre musical del Carnaval. Las mejores agrupaciones de salsa, cumbia, vallenato, champeta y otros generos compiten por el Congo de Oro musical en una noche inolvidable en el Estadio Romelio Martinez.
            </p>
            <p className="text-white/30 text-sm">
              El festival se celebra el ultimo dia del Carnaval (Martes de Carnaval) y es uno de los eventos mas esperados de toda la temporada.
            </p>
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
