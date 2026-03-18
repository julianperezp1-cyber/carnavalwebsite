import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { GaleriaParticipation } from '@/components/auth/GaleriaParticipation';
import { AuthCtaSection } from '@/components/auth/AuthCtaSection';
import { Camera, Heart, Filter, UserPlus, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Galeria Comunitaria',
  description: 'Comparte y descubre fotos del Carnaval de Barranquilla. La galeria comunitaria donde los carnavaleros muestran sus mejores momentos.',
};

const CATEGORIES = ['Todos', 'Batalla de Flores', 'Gran Parada', 'Comparsas', 'Disfraces', 'General'];

const GALLERY_ITEMS = [
  { id: 1, title: 'Congo en Via 40', author: 'Maria C.', year: 2026, likes: 234, category: 'Gran Parada' },
  { id: 2, title: 'Batalla de Flores 2026', author: 'Carlos M.', year: 2026, likes: 189, category: 'Batalla de Flores' },
  { id: 3, title: 'Marimonda clasica', author: 'Ana P.', year: 2025, likes: 312, category: 'Disfraces' },
  { id: 4, title: 'Cumbiamba al atardecer', author: 'Luis R.', year: 2026, likes: 156, category: 'Comparsas' },
  { id: 5, title: 'Reina del Carnaval', author: 'Sofia L.', year: 2026, likes: 445, category: 'Batalla de Flores' },
  { id: 6, title: 'Garabato nocturno', author: 'Pedro V.', year: 2025, likes: 98, category: 'Gran Parada' },
  { id: 7, title: 'Letanias en el centro', author: 'Diana G.', year: 2024, likes: 267, category: 'General' },
  { id: 8, title: 'Disfraz de toro', author: 'Jorge H.', year: 2026, likes: 178, category: 'Disfraces' },
  { id: 9, title: 'Comparsa infantil', author: 'Laura T.', year: 2025, likes: 321, category: 'Comparsas' },
  { id: 10, title: 'Joselito Carnaval', author: 'Miguel A.', year: 2024, likes: 203, category: 'General' },
  { id: 11, title: 'Son de Negro', author: 'Valentina S.', year: 2026, likes: 145, category: 'Gran Parada' },
  { id: 12, title: 'Flores y color', author: 'Andres K.', year: 2025, likes: 389, category: 'Batalla de Flores' },
];

export default function GaleriaPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Galeria Comunitaria"
        subtitle="Comparte tus mejores momentos del Carnaval. Miles de recuerdos en un solo lugar."
        breadcrumbs={[{ label: 'Comunidad', href: '/comunidad' }, { label: 'Galeria' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* How to participate */}
      <GaleriaParticipation />

      {/* Filter bar */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-gray-400 shrink-0" />
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-carnaval-red text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-carnaval-red hover:text-carnaval-red'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {GALLERY_ITEMS.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-gray-300 group-hover:text-carnaval-red/30 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-display font-black text-brand-dark mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {item.author} &middot; {item.year}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                      <Heart className="h-3 w-3" />
                      {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — only shows if not logged in */}
      <AuthCtaSection
        title="Tus fotos, tu Carnaval"
        description="Crea tu Carnaval ID y empieza a compartir tus recuerdos con miles de carnavaleros."
        buttonText="Crear mi Carnaval ID"
        buttonColor="bg-carnaval-red hover:bg-carnaval-red-hover"
      />

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
