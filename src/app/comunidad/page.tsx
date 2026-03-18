import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { CarnavalIdHero } from '@/components/auth/CarnavalIdHero';
import {
  Users, Camera, GraduationCap, CalendarDays, MessageCircle,
  Award, QrCode, ArrowRight, Heart, Star, Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Comunidad — El Carnaval es de todos',
  description: 'Unete a la comunidad del Carnaval de Barranquilla. Crea tu Carnaval ID, comparte fotos, aprende sobre la tradicion, y conecta con carnavaleros de todo el mundo.',
};

export default function ComunidadPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Comunidad"
        subtitle="El Carnaval es de todos. Crea tu identidad carnavalera, comparte, aprende y conecta."
        breadcrumbs={[{ label: 'Comunidad' }]}
        accentColor="green"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Carnaval ID hero */}
      <CarnavalIdHero />

      {/* Community features */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-12">
            <p className="text-xs font-bold text-carnaval-green uppercase tracking-[0.2em] mb-2">Explora</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Vive la comunidad</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Camera, title: 'Galeria comunitaria', href: '/comunidad/galeria',
                desc: 'Sube tus fotos y videos del Carnaval. Vota por las mejores memorias. Revive cada edicion a traves de los ojos de la gente.',
                color: 'bg-carnaval-red', tag: 'Nuevo',
              },
              {
                icon: GraduationCap, title: 'Academia del Carnaval', href: '/comunidad/academia',
                desc: 'Aprende a bailar cumbia, conoce la historia del Garabato, haz quiz interactivos y descubre los secretos de cada danza.',
                color: 'bg-gold', tag: 'Nuevo',
              },
              {
                icon: CalendarDays, title: 'Calendario 365', href: '/comunidad/calendario',
                desc: 'El Carnaval no es solo 4 dias. Descubre eventos durante todo el ano: pre-carnaval, talleres, festival de verano y mas.',
                color: 'bg-carnaval-green',
              },
              {
                icon: MessageCircle, title: 'Feedback en vivo', href: '/cuenta',
                desc: 'Durante los eventos, envia tus comentarios y sugerencias en tiempo real para que juntos mejoremos la experiencia.',
                color: 'bg-carnaval-blue',
              },
              {
                icon: Heart, title: 'Conecta', href: '/cuenta',
                desc: 'Conoce a otros carnavaleros, intercambia codigos QR, haz amigos y forma parte de la comunidad mas alegre del mundo.',
                color: 'bg-brand-dark',
              },
              {
                icon: Award, title: 'Convocatorias', href: '/convocatorias',
                desc: 'Participa en concursos de fotografia, festival de orquestas, acreditaciones de prensa y mucho mas.',
                color: 'bg-carnaval-red',
              },
            ].map((card) => (
              <Link key={card.title} href={card.href}
                className="group bg-white rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative">
                {card.tag && (
                  <span className="absolute top-4 right-4 bg-carnaval-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {card.tag}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-5`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-black text-brand-dark mb-2 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{card.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-carnaval-red group-hover:gap-2.5 transition-all">
                  Explorar <ArrowRight className="h-3.5 w-3.5" />
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
