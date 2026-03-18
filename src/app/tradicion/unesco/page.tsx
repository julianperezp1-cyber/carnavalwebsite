import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Globe, Award, Calendar, FileText, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Declaratoria UNESCO',
  description: 'El Carnaval de Barranquilla fue proclamado Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad por la UNESCO en 2003.',
};

export default function UnescoPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Declaratoria UNESCO"
        subtitle="Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad — 2003"
        breadcrumbs={[{ label: 'Tradicion', href: '/tradicion' }, { label: 'UNESCO' }]}
        dark
        accentColor="gold"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Main content */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="h-8 w-8 text-carnaval-blue" />
            <div>
              <p className="text-xs font-bold text-carnaval-blue uppercase tracking-wider">UNESCO</p>
              <p className="text-sm text-gray-500">Organizacion de las Naciones Unidas para la Educacion, la Ciencia y la Cultura</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg">
                En noviembre de <strong className="text-brand-dark">2003</strong>, la UNESCO proclamo al Carnaval de Barranquilla como <strong className="text-brand-dark">Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad</strong>, reconociendo su extraordinaria contribucion a la diversidad cultural del mundo.
              </p>
              <p>
                Esta declaratoria reconoce al Carnaval como una expresion cultural viva que fusiona las tradiciones de los pueblos indigenas, africanos y europeos que confluyeron en el Caribe colombiano, creando una manifestacion unica de identidad, creatividad y resistencia cultural.
              </p>
              <p>
                El Carnaval de Barranquilla es una de las expresiones culturales mas complejas de Colombia, que involucra a mas de 800 agrupaciones folcloricas, miles de artistas, musicos, artesanos y hacedores que mantienen viva la tradicion a traves de danzas, musica, disfraces, comparsas, comedias y letanias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-10">Camino a la declaratoria</h2>
          <div className="space-y-6">
            {[
              { year: '2001', title: 'Patrimonio Cultural de la Nacion', desc: 'La Ley 706 del Congreso de Colombia declara al Carnaval de Barranquilla como Patrimonio Cultural de la Nacion, con 4 articulos que establecen su proteccion y promocion.', icon: FileText, color: 'border-carnaval-red' },
              { year: '2002', title: 'Candidatura UNESCO', desc: 'Colombia presenta la candidatura del Carnaval de Barranquilla ante la UNESCO para ser reconocido como patrimonio inmaterial mundial.', icon: Globe, color: 'border-gold' },
              { year: '2003', title: 'Proclamacion UNESCO', desc: 'En la segunda proclamacion de Obras Maestras, la UNESCO incluye al Carnaval de Barranquilla en la prestigiosa lista, junto a otras 28 expresiones culturales del mundo.', icon: Award, color: 'border-carnaval-green' },
              { year: '2008', title: 'Lista Representativa', desc: 'El Carnaval es incluido en la Lista Representativa del Patrimonio Cultural Inmaterial de la Humanidad bajo la nueva Convencion de 2003.', icon: Globe, color: 'border-carnaval-blue' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-6 bg-white rounded-2xl p-6 border-l-4 ${item.color}`}>
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <span className="text-lg font-display font-black text-brand-dark">{item.year}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="h-4 w-4 text-gray-400" />
                    <h3 className="text-base font-display font-black text-brand-dark">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Significance */}
      <section className="py-16 sm:py-20 bg-brand-dark">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <Award className="h-10 w-10 text-gold mb-4" />
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-6">Que significa esta declaratoria</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: 'Reconocimiento mundial', desc: 'El Carnaval es reconocido como una expresion cultural de valor universal excepcional.' },
              { title: 'Compromiso de proteccion', desc: 'Colombia y Barranquilla se comprometen a salvaguardar y transmitir esta tradicion.' },
              { title: 'Visibilidad internacional', desc: 'Posiciona al Carnaval y a Barranquilla en el mapa cultural mundial.' },
              { title: 'Desarrollo sostenible', desc: 'La cultura se convierte en motor de desarrollo economico y social para la ciudad.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h3 className="text-base font-display font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* External link */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <a href="https://ich.unesco.org/en/RL/carnival-of-barranquilla-00051" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-carnaval-blue hover:text-carnaval-blue-hover transition-colors">
            <Globe className="h-4 w-4" />
            Ver en el sitio oficial de la UNESCO
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
