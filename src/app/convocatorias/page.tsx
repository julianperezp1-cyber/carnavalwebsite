import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Calendar, ArrowRight, ExternalLink, Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Convocatorias',
  description: 'Convocatorias abiertas del Carnaval de Barranquilla: concurso de fotografia, festival de orquestas, acreditacion de prensa y mas.',
};

const CONVOCATORIAS = [
  { title: 'Concurso Nacional de Fotografia 2027', status: 'Abierta', deadline: 'Dic 15, 2026', category: 'Fotografia', desc: 'Captura la esencia del Carnaval. Abierto para fotografos profesionales y aficionados de todo el pais.' },
  { title: 'Acreditacion de Prensa — Carnaval 2027', status: 'Abierta', deadline: 'Ene 15, 2027', category: 'Prensa', desc: 'Periodistas y medios nacionales e internacionales pueden solicitar su acreditacion para la cobertura del Carnaval.' },
  { title: 'Premio de Periodismo Ernesto McCausland Sojo', status: 'Abierta', deadline: 'Nov 30, 2026', category: 'Periodismo', desc: 'Reconocimiento a los mejores trabajos periodisticos sobre el Carnaval y la cultura del Caribe colombiano.' },
  { title: 'Festival de Orquestas 2027', status: 'Proxima', deadline: 'Dic 2026', category: 'Musica', desc: 'Inscripciones para agrupaciones musicales que deseen participar en el tradicional Festival de Orquestas.' },
  { title: 'Carnaval de los Ninos 2027', status: 'Proxima', deadline: 'Ene 2027', category: 'Infantil', desc: 'Registro para ninos que quieran participar en las actividades especiales del Carnaval infantil.' },
  { title: 'Convocatoria Curatorial 2027', status: 'Proxima', deadline: 'Dic 2026', category: 'Cultura', desc: 'Propuestas curatoriales para exposiciones y actividades culturales durante el Carnaval.' },
];

export default function ConvocatoriasPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Convocatorias"
        subtitle="Participa en el Carnaval. Concursos, inscripciones, acreditaciones y oportunidades abiertas."
        breadcrumbs={[{ label: 'Convocatorias' }]}
        accentColor="green"
      />
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="space-y-5">
            {CONVOCATORIAS.map((conv, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        conv.status === 'Abierta' ? 'bg-carnaval-green/10 text-carnaval-green' : 'bg-gold/10 text-amber-700'
                      }`}>
                        {conv.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {conv.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-black text-brand-dark mb-2">{conv.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{conv.desc}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      Fecha limite: {conv.deadline}
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors shrink-0 self-start">
                    Participar
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
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
