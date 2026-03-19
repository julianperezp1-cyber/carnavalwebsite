import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { AuthCtaSection } from '@/components/auth/AuthCtaSection';
import { BookOpen, Play, HelpCircle, Clock, BarChart3, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Academia del Carnaval',
  description: 'Aprende sobre la cultura del Carnaval de Barranquilla: cursos de danza, historia, tradiciones y quizzes interactivos.',
};

const CURSOS_DANZA = [
  { title: 'Cumbia Tradicional', level: 'Principiante', duration: '4 sesiones', desc: 'Aprende los pasos basicos de la cumbia colombiana con maestros del Carnaval.' },
  { title: 'Mapale Intensivo', level: 'Intermedio', duration: '6 sesiones', desc: 'Domina el ritmo frenetico del mapale con tecnicas de movimiento corporal africano.' },
  { title: 'Garabato: Vida y Muerte', level: 'Avanzado', duration: '8 sesiones', desc: 'La danza dramatica del Garabato con coreografia completa y vestuario.' },
  { title: 'Danza del Congo', level: 'Intermedio', duration: '5 sesiones', desc: 'Aprende la danza de la realeza africana con sus movimientos caracteristicos.' },
];

const HISTORIA = [
  { title: 'Origenes del Carnaval', period: 'Siglo XIX', desc: 'Como nacio la fiesta mas grande de Colombia: de las fiestas coloniales a la tradicion popular.' },
  { title: 'La Cumbia: Tres Culturas', period: 'Prehispanico', desc: 'El encuentro de ritmos indigenas, africanos y espanoles que creo la cumbia.' },
  { title: 'El Mapale y el Rio', period: 'Colonial', desc: 'La historia de los pescadores del Magdalena y como su danza nocturna se volvio arte.' },
  { title: 'UNESCO 2003', period: 'Contemporaneo', desc: 'El proceso de declaratoria como Patrimonio Inmaterial de la Humanidad.' },
];

const QUIZZES = [
  { title: 'Danzas del Carnaval', questions: 15, difficulty: 'Facil', desc: 'Identifica las danzas tradicionales por sus caracteristicas y vestuarios.' },
  { title: 'Historia y Tradicion', questions: 20, difficulty: 'Medio', desc: 'Pon a prueba tu conocimiento sobre la historia del Carnaval de Barranquilla.' },
  { title: 'Musica y Ritmos', questions: 12, difficulty: 'Facil', desc: 'Reconoce los instrumentos y ritmos que suenan en el Carnaval.' },
  { title: 'Maestro Carnavalero', questions: 25, difficulty: 'Dificil', desc: 'El quiz definitivo. Solo los verdaderos conocedores logran mas de 80%.' },
];

export default function AcademiaPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Academia del Carnaval"
        subtitle="Aprende, descubre y pon a prueba tus conocimientos sobre la fiesta mas grande de Colombia."
        breadcrumbs={[{ label: 'Comunidad', href: '/comunidad' }, { label: 'Academia' }]}
        accentColor="green"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Aprende a bailar */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-red/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-red rounded-full" />
              <span className="text-xs font-bold text-carnaval-red">Video cursos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Aprende a Bailar</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Cursos en video con maestros de danza del Carnaval. Desde principiante hasta avanzado.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {CURSOS_DANZA.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-video bg-gradient-to-br from-carnaval-red/10 to-gold/10 flex items-center justify-center">
                  <Play className="h-10 w-10 text-carnaval-red/40 group-hover:text-carnaval-red transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-carnaval-red bg-carnaval-red/10 px-2 py-0.5 rounded-full">{c.level}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {c.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-black text-brand-dark mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia y cultura */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-green/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-green rounded-full" />
              <span className="text-xs font-bold text-carnaval-green">Articulos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Historia y Cultura</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Descubre los origenes y la evolucion de las tradiciones carnavaleras.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {HISTORIA.map((h, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-carnaval-green" />
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{h.period}</span>
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{h.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quizzes */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-gold rounded-full" />
              <span className="text-xs font-bold text-amber-700">Interactivo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Quizzes Interactivos</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Pon a prueba tu conocimiento carnavalero. Necesitas Carnaval ID para guardar tus resultados.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {QUIZZES.map((q, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="h-5 w-5 text-gold" />
                </div>
                <h3 className="text-base font-display font-black text-brand-dark mb-2">{q.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{q.desc}</p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" /> {q.difficulty}
                  </span>
                  <span>{q.questions} preguntas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — only shows if not logged in */}
      <AuthCtaSection
        title="Empieza a aprender hoy"
        description="Con tu Carnaval ID puedes guardar tu progreso, obtener certificados y competir en los quizzes."
        buttonText="Crear Carnaval ID"
        buttonColor="bg-carnaval-green hover:bg-carnaval-green/90"
      />

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
