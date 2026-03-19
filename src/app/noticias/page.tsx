import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Las ultimas noticias del Carnaval de Barranquilla. Eventos, convocatorias, programacion y todo lo que necesitas saber sobre la fiesta mas grande de Colombia.',
};

// Mock news data — will be replaced with Supabase CMS
const MOCK_NEWS = [
  { id: '1', title: 'Carnaval de Barranquilla anuncia fechas oficiales para 2027', excerpt: 'La organizacion confirmo que el Carnaval 2027 se celebrara del 6 al 9 de febrero con una programacion renovada que incluye nuevos eventos y experiencias.', date: '2026-03-15', tag: 'Oficial', featured: true },
  { id: '2', title: 'Convocatoria abierta para el Festival de Orquestas 2027', excerpt: 'Agrupaciones musicales de todo el pais pueden inscribirse para participar en el tradicional Festival de Orquestas del Carnaval.', date: '2026-03-10', tag: 'Convocatoria', featured: true },
  { id: '3', title: 'Carnaval presente en encuentro internacional de patrimonio de la UNESCO', excerpt: 'Representantes del Carnaval participaron en el encuentro mundial de patrimonio inmaterial celebrado en Paris.', date: '2026-03-05', tag: 'Internacional', featured: true },
  { id: '4', title: 'Mas de 800 grupos folcloricos registrados para Carnaval 2027', excerpt: 'La cifra de grupos inscritos supera las expectativas y consolida al Carnaval como la celebracion cultural mas grande del pais.', date: '2026-02-28', tag: 'Oficial' },
  { id: '5', title: 'Nuevo plan de sostenibilidad para el Carnaval', excerpt: 'La organizacion presento su plan de sostenibilidad ambiental que incluye reduccion de plasticos y compensacion de huella de carbono.', date: '2026-02-20', tag: 'Sostenibilidad' },
  { id: '6', title: 'Apertura de inscripciones para el Carnaval de los Ninos', excerpt: 'Los ninos de Barranquilla podran participar en las actividades especiales disenadas para los mas pequenos.', date: '2026-02-15', tag: 'Infantil' },
  { id: '7', title: 'Acreditacion de prensa para Carnaval 2027', excerpt: 'Periodistas y medios nacionales e internacionales pueden solicitar su acreditacion para la cobertura del Carnaval.', date: '2026-02-10', tag: 'Prensa' },
  { id: '8', title: 'Concurso Nacional de Fotografia del Carnaval', excerpt: 'Fotografos profesionales y aficionados estan invitados a capturar la esencia del Carnaval.', date: '2026-02-05', tag: 'Convocatoria' },
  { id: '9', title: 'Reina del Carnaval 2027 sera designada en diciembre', excerpt: 'La organizacion anuncio que la nueva reina sera presentada en una ceremonia especial en el mes de diciembre.', date: '2026-01-30', tag: 'Oficial' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NoticiasPage() {
  const featured = MOCK_NEWS.filter(n => n.featured);
  const rest = MOCK_NEWS.filter(n => !n.featured);

  return (
    <>
      <Header />

      <PageHeader
        title="Noticias"
        subtitle="Mantente al dia con todo lo que sucede en el Carnaval de Barranquilla."
        breadcrumbs={[{ label: 'Noticias' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Featured news */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-8">Destacadas</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main featured */}
            {featured[0] && (
              <Link href={`/noticias/${featured[0].id}`} className="lg:col-span-2 group">
                <div className="aspect-[16/9] bg-gray-100 rounded-2xl mb-5 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-carnaval-red/20 to-gold/20 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className="text-[10px] font-bold text-carnaval-red uppercase tracking-wider">{featured[0].tag}</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-brand-dark mt-1 mb-2 group-hover:text-carnaval-red transition-colors leading-tight">
                  {featured[0].title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{featured[0].excerpt}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {formatDate(featured[0].date)}
                </div>
              </Link>
            )}

            {/* Side featured */}
            <div className="space-y-6">
              {featured.slice(1).map((news) => (
                <Link key={news.id} href={`/noticias/${news.id}`} className="group block">
                  <div className="aspect-[16/9] bg-gray-100 rounded-xl mb-3 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-carnaval-green/20 to-carnaval-blue/20 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-carnaval-red uppercase tracking-wider">{news.tag}</span>
                  <h3 className="text-base font-display font-black text-brand-dark mt-0.5 group-hover:text-carnaval-red transition-colors leading-tight">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(news.date)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All news */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h2 className="text-2xl font-display font-black text-brand-dark mb-8">Todas las noticias</h2>

          <div className="space-y-4">
            {rest.map((news) => (
              <Link key={news.id} href={`/noticias/${news.id}`}
                className="group flex items-start gap-5 bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="w-24 h-24 sm:w-32 sm:h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-carnaval-red uppercase tracking-wider">{news.tag}</span>
                  <h3 className="text-base font-display font-black text-brand-dark mt-0.5 group-hover:text-carnaval-red transition-colors leading-tight">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 hidden sm:block">{news.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(news.date)}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-carnaval-red shrink-0 mt-2 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
