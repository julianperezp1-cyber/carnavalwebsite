import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Radio, Headphones, Map, Music, Play, ExternalLink,
  ArrowRight, Podcast, Video, Wifi,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'En Vivo — Streaming, Podcast y Mapa',
  description: 'Carnaval en vivo: livestream de eventos, podcast Siempre Reinas, playlist oficial en Spotify y mapa interactivo de Barranquilla.',
};

export default function EnVivoPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="En Vivo"
        subtitle="Streaming, podcast, musica y el mapa interactivo del Carnaval. La fiesta no para."
        breadcrumbs={[{ label: 'En Vivo' }]}
        dark
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Main sections grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Livestream */}
            <div className="bg-brand-dark rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-carnaval-red rounded-full animate-pulse" />
                <span className="text-xs font-bold text-carnaval-red uppercase tracking-wider">Livestream</span>
              </div>
              <Video className="h-12 w-12 text-white/20 mb-4" />
              <h3 className="text-2xl font-display font-black text-white mb-3">Transmisiones en vivo</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Durante el Carnaval, transmitimos en vivo la Batalla de Flores, la Gran Parada de Tradicion, la Gran Parada de Comparsas y el Festival de Orquestas.
              </p>
              <p className="text-xs text-white/30 bg-white/5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg">
                <Wifi className="h-3.5 w-3.5" />
                Las transmisiones se activan durante los eventos
              </p>
            </div>

            {/* Podcast */}
            <Link href="/en-vivo/podcast" className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <Headphones className="h-12 w-12 text-carnaval-red/20 mb-4" />
              <h3 className="text-2xl font-display font-black text-brand-dark mb-3 group-hover:text-carnaval-red transition-colors">Podcast Carnaval</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Escucha <strong>Siempre Reinas</strong> y mas contenido exclusivo. Historias, entrevistas, musica y la tradicion del Carnaval en formato podcast.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Siempre Reinas', 'Historias', 'Entrevistas', 'Tradicion'].map((tag) => (
                  <span key={tag} className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-green">
                  Spotify <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red">
                  YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Link>

            {/* Playlist */}
            <Link href="/en-vivo/playlist" className="bg-carnaval-green/5 rounded-2xl p-8 border border-carnaval-green/10 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <Music className="h-12 w-12 text-carnaval-green/30 mb-4" />
              <h3 className="text-2xl font-display font-black text-brand-dark mb-3 group-hover:text-carnaval-green transition-colors">Playlist oficial</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                La musica del Carnaval en Spotify. Cumbia, salsa, vallenato, champeta y todos los ritmos que hacen vibrar a Barranquilla. Actualizada cada semana.
              </p>
              <span className="inline-flex items-center gap-2 bg-carnaval-green text-white px-5 py-2.5 rounded-xl text-sm font-bold">
                <Play className="h-4 w-4" />
                Escuchar en Spotify
              </span>
            </Link>

            {/* Interactive Map */}
            <Link href="/en-vivo/mapa" className="bg-carnaval-blue/5 rounded-2xl p-8 border border-carnaval-blue/10 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <Map className="h-12 w-12 text-carnaval-blue/30 mb-4" />
              <h3 className="text-2xl font-display font-black text-brand-dark mb-3 group-hover:text-carnaval-blue transition-colors">Mapa interactivo</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Explora las rutas de los desfiles, ubica los palcos, entradas, y descubre los mejores lugares turisticos de Barranquilla.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Rutas de desfiles', 'Palcos', 'Turismo', 'Lugares iconicos'].map((tag) => (
                  <span key={tag} className="text-xs font-medium text-carnaval-blue bg-carnaval-blue/10 px-3 py-1 rounded-lg">{tag}</span>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
