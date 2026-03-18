import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Headphones, Play, Clock, ExternalLink, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Podcast Carnaval',
  description: 'Escucha el podcast oficial del Carnaval de Barranquilla: historias, entrevistas, musica y cultura carnavalera.',
};

const EPISODES = [
  { num: 6, title: 'Las Reinas que hicieron historia', date: '15 Feb 2026', duration: '42 min', desc: 'Recorremos la historia de las reinas mas iconicas del Carnaval y su legado cultural.' },
  { num: 5, title: 'Barrio Abajo: cuna del Carnaval', date: '1 Feb 2026', duration: '38 min', desc: 'Entrevistas con los lideres culturales del barrio que vio nacer la fiesta.' },
  { num: 4, title: 'El Congo de Oro y sus leyendas', date: '15 Ene 2026', duration: '45 min', desc: 'La historia del premio mas importante de la musica tropical colombiana.' },
  { num: 3, title: 'Detras de una carroza', date: '1 Ene 2026', duration: '35 min', desc: 'El proceso de creacion de las carrozas de la Batalla de Flores.' },
  { num: 2, title: 'Cumbia: tres sangres, un ritmo', date: '15 Dic 2025', duration: '50 min', desc: 'Origenes triculturales de la cumbia y su evolucion en el Carnaval.' },
  { num: 1, title: 'Por que el Carnaval importa', date: '1 Dic 2025', duration: '40 min', desc: 'Episodio inaugural: la importancia cultural, social y economica del Carnaval de Barranquilla.' },
];

export default function PodcastPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Podcast Carnaval"
        subtitle="Historias, entrevistas y la cultura viva del Carnaval de Barranquilla en formato audio."
        breadcrumbs={[{ label: 'En Vivo', href: '/en-vivo' }, { label: 'Podcast' }]}
        accentColor="red"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Featured Podcast */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-gradient-to-r from-brand-dark to-brand-dark/95 rounded-2xl p-8 sm:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-carnaval-red to-gold rounded-2xl flex items-center justify-center shrink-0">
                <Headphones className="h-20 w-20 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
                  <span className="w-2 h-2 bg-carnaval-red rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-white/70">Podcast destacado</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-3">Siempre Reinas</h2>
                <p className="text-white/50 mb-6 max-w-xl">
                  El podcast oficial del Carnaval de Barranquilla. Cada episodio explora una faceta diferente de la fiesta: sus protagonistas, su musica, sus historias y el alma de una tradicion que late todo el ano.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://open.spotify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#1aa34a] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    Escuchar en Spotify
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    Ver en YouTube
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Episodios</h2>
            <p className="text-gray-500 mt-2">Todos los episodios disponibles del podcast.</p>
          </div>
          <div className="space-y-4">
            {EPISODES.map((ep) => (
              <div key={ep.num} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-carnaval-red/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-carnaval-red group-hover:text-white transition-colors">
                    <Play className="h-5 w-5 text-carnaval-red group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">EP {ep.num}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {ep.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-black text-brand-dark mb-1">{ep.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{ep.desc}</p>
                    <p className="text-xs text-gray-400 mt-2">{ep.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 sm:py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">No te pierdas ningun episodio</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Suscribete en tu plataforma favorita y recibe cada episodio nuevo automaticamente.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1DB954] hover:bg-[#1aa34a] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              Spotify
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              YouTube
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
