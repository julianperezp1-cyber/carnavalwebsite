import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Music, Users, Trophy, Award, BookOpen, ArrowRight,
  Palette, Drama, Shirt, Mic2, Globe,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tradicion — Historia, Danzas y Cultura',
  description: 'Conoce la tradicion del Carnaval de Barranquilla: su historia desde 1903, danzas folcloricas, comparsas, disfraces, lideres de la tradicion y la declaratoria UNESCO.',
};

export default function TradicionPage() {
  return (
    <>
      <Header />

      <PageHeader
        title="Tradicion y Cultura"
        subtitle="Mas de 120 anos de historia, folclor y creatividad que hacen del Carnaval de Barranquilla Patrimonio de la Humanidad."
        breadcrumbs={[{ label: 'Tradicion' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Origin / History */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-3">Historia</p>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark mb-6 leading-[0.95]">
                El latido alegre de Barranquilla
              </h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  El Carnaval de Barranquilla es una celebracion que se remonta a mas de un siglo de historia, donde se fusionan las tradiciones indigenas, africanas y europeas que dieron forma a la identidad cultural del Caribe colombiano.
                </p>
                <p>
                  En 1903 se celebro la primera Batalla de Flores, marcando el inicio de los desfiles organizados. Desde entonces, el Carnaval ha crecido hasta convertirse en la fiesta mas grande de Colombia, con mas de 800 grupos folcloricos y 2 millones de asistentes cada ano.
                </p>
                <p>
                  En 2001 fue declarado Patrimonio Cultural de la Nacion (Ley 706), y en 2003, la UNESCO lo proclamo Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad, reconociendo su valor unico como expresion viva de diversidad cultural.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {[
                { year: '1888', title: 'Primeros registros', desc: 'Documentos historicos registran celebraciones de carnaval en Barranquilla', color: 'text-carnaval-red' },
                { year: '1903', title: 'Primera Batalla de Flores', desc: 'Se organiza el primer desfile formal por las calles de la ciudad', color: 'text-gold' },
                { year: '1967', title: 'Se funda la Fundacion', desc: 'Se crea la organizacion para la planificacion y produccion del Carnaval', color: 'text-carnaval-green' },
                { year: '2001', title: 'Patrimonio Nacional', desc: 'Ley 706 declara al Carnaval Patrimonio Cultural de la Nacion', color: 'text-carnaval-blue' },
                { year: '2003', title: 'Patrimonio UNESCO', desc: 'Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad', color: 'text-carnaval-red' },
              ].map((m, i) => (
                <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100">
                    <span className={`text-sm font-display font-black ${m.color}`}>{m.year}</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-brand-dark">{m.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Folkloric groups categories */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold text-carnaval-green uppercase tracking-[0.2em] mb-2">Grupos folcloricos</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Las expresiones del Carnaval</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Music, title: 'Danzas', desc: 'Tradicionales, de relacion y especiales. Congo, Garabato, Mapale, Cumbiamba y mas.', href: '/tradicion/danzas', count: '13 danzas documentadas', color: 'bg-carnaval-red' },
              { icon: Users, title: 'Comparsas', desc: 'Agrupaciones con coreografias, vestuarios y musica. De tradicion y de fantasia.', href: '/tradicion/comparsas', count: 'Tradicion y fantasia', color: 'bg-carnaval-green' },
              { icon: Shirt, title: 'Disfraces', desc: 'Expresion individual y colectiva. Marimondas, monocucos, toritos y creaciones unicas.', href: '/tradicion/disfraces', count: 'Individuales y colectivos', color: 'bg-gold' },
              { icon: Drama, title: 'Comedias', desc: 'Teatro popular callejero. Actuaciones puerta a puerta con humor y critica social.', href: '/tradicion/comedias-letanias', count: 'Teatro del pueblo', color: 'bg-carnaval-blue' },
              { icon: Mic2, title: 'Letanias', desc: 'Versos rimados con solista y coro. Critica social con humor. Sin coreografia ni musica.', href: '/tradicion/comedias-letanias', count: 'Tradicion oral', color: 'bg-brand-dark' },
              { icon: Trophy, title: 'Congo de Oro', desc: 'El maximo reconocimiento a la excelencia artistica en cada categoria del Carnaval.', href: '/tradicion/congo-de-oro', count: 'Premiacion anual', color: 'bg-carnaval-red' },
            ].map((card) => (
              <Link key={card.title} href={card.href}
                className="group bg-white rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-black text-brand-dark mb-1 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-xs text-carnaval-red font-semibold mb-2">{card.count}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red group-hover:gap-2.5 transition-all">
                  Explorar <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Key pages */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Lideres de la Tradicion', desc: '18 agrupaciones con mas de 50 anos preservando las raices culturales del Carnaval.', href: '/tradicion/lideres', color: 'bg-carnaval-green' },
              { icon: Globe, title: 'Declaratoria UNESCO', desc: 'Proclamado Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad en 2003.', href: '/tradicion/unesco', color: 'bg-carnaval-blue' },
              { icon: BookOpen, title: 'Manual del Carnaval', desc: 'Reglamento oficial de participacion, categorias de evaluacion y requisitos.', href: '/tradicion/manual', color: 'bg-gold' },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                className="group bg-gray-50 hover:bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 text-center">
                <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mx-auto mb-5`}>
                  <card.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-display font-black text-brand-dark mb-2 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red">
                  Ver mas <ArrowRight className="h-3.5 w-3.5" />
                </span>
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
