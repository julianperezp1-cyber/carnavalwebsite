import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Camera, Video, BookOpen, Download, Image, Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Multimedia',
  description: 'Galeria de fotos, videos, publicaciones y media kit del Carnaval de Barranquilla.',
};

const PHOTOS = [
  { id: 1, title: 'Batalla de Flores 2026' },
  { id: 2, title: 'Gran Parada de Tradicion' },
  { id: 3, title: 'Reina del Carnaval' },
  { id: 4, title: 'Cumbiamba en Via 40' },
  { id: 5, title: 'Danza del Congo' },
  { id: 6, title: 'Marimondas' },
  { id: 7, title: 'Entierro de Joselito' },
  { id: 8, title: 'Guacherna nocturna' },
];

const VIDEOS = [
  { id: 1, title: 'Batalla de Flores 2026 — Resumen oficial', duration: '12:45' },
  { id: 2, title: 'Gran Parada de Tradicion', duration: '18:30' },
  { id: 3, title: 'Festival de Orquestas — Lo mejor', duration: '25:10' },
  { id: 4, title: 'Detras de camaras: asi se hace el Carnaval', duration: '8:20' },
];

const PUBLICATIONS = [
  { year: 2026, title: 'Revista Carnaval 2026', desc: 'Edicion especial con la programacion completa y perfiles de los protagonistas.' },
  { year: 2025, title: 'Revista Carnaval 2025', desc: 'La celebracion de los 20 anos como Patrimonio UNESCO.' },
  { year: 2024, title: 'Revista Carnaval 2024', desc: 'Homenaje a los hacedores y maestros del Carnaval.' },
  { year: 2023, title: 'Revista Carnaval 2023', desc: 'El retorno a la normalidad post-pandemia.' },
  { year: 2022, title: 'Revista Carnaval 2022', desc: 'Edicion digital: el Carnaval se reinventa.' },
  { year: 2021, title: 'Revista Carnaval 2021', desc: 'Carnaval virtual: la fiesta que no para.' },
  { year: 2020, title: 'Revista Carnaval 2020', desc: 'El ultimo Carnaval antes de la pandemia.' },
];

const MEDIA_KIT_ITEMS = [
  { name: 'Logo oficial (PNG, SVG)', size: '2.4 MB' },
  { name: 'Manual de marca', size: '8.1 MB' },
  { name: 'Fotos de prensa (alta resolucion)', size: '45 MB' },
  { name: 'Datos y cifras 2026', size: '1.2 MB' },
];

export default function MultimediaPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Multimedia"
        subtitle="Fotos, videos, publicaciones y recursos de prensa del Carnaval de Barranquilla."
        breadcrumbs={[{ label: 'Multimedia' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Photos */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-red/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-red rounded-full" />
              <span className="text-xs font-bold text-carnaval-red">Galeria</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Fotos</h2>
            <p className="text-gray-500 mt-2">Imagenes oficiales del Carnaval de Barranquilla.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {PHOTOS.map((photo) => (
              <div key={photo.id} className="group aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden relative hover:shadow-lg transition-shadow cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-300 group-hover:text-carnaval-red/40 transition-colors" />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-xs font-bold text-white">{photo.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-green/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-green rounded-full" />
              <span className="text-xs font-bold text-carnaval-green">Video</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Videos</h2>
            <p className="text-gray-500 mt-2">Videos oficiales y resumenes de cada edicion del Carnaval.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {VIDEOS.map((vid) => (
              <div key={vid.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <Play className="h-14 w-14 text-gray-300 group-hover:text-carnaval-red transition-colors" />
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">{vid.duration}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-display font-black text-brand-dark">{vid.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-gold rounded-full" />
              <span className="text-xs font-bold text-amber-700">Publicaciones</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Revistas y Publicaciones</h2>
            <p className="text-gray-500 mt-2">Revistas oficiales del Carnaval de Barranquilla desde 2020.</p>
          </div>
          <div className="space-y-3">
            {PUBLICATIONS.map((pub, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-gold" />
                  <div>
                    <h4 className="text-sm font-display font-black text-brand-dark">{pub.title}</h4>
                    <p className="text-xs text-gray-400">{pub.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full shrink-0">{pub.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-blue/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-blue rounded-full" />
              <span className="text-xs font-bold text-carnaval-blue">Prensa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Media Kit</h2>
            <p className="text-gray-500 mt-2">Recursos para medios de comunicacion y prensa.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {MEDIA_KIT_ITEMS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-carnaval-blue" />
                  <div>
                    <h4 className="text-sm font-display font-black text-brand-dark">{item.name}</h4>
                    <span className="text-xs text-gray-400">{item.size}</span>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-blue bg-carnaval-blue/10 hover:bg-carnaval-blue/20 px-3 py-1.5 rounded-lg transition-colors">
                  <Download className="h-3 w-3" />
                  Descargar
                </button>
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
