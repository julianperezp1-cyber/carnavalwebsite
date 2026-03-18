import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
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
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-carnaval-red/10 rounded-full blur-[100px]" />
            <div className="absolute top-0 left-1/3 w-48 h-48 bg-gold/10 rounded-full blur-[80px]" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-carnaval-red/20 rounded-full px-3 py-1 mb-6">
                  <Sparkles className="h-3.5 w-3.5 text-carnaval-red" />
                  <span className="text-xs font-bold text-carnaval-red">Nuevo</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white mb-4 leading-[0.95]">
                  Carnaval ID
                </h2>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                  Tu identidad carnavalera digital. Crea tu perfil, gana insignias por asistir a eventos, sube tus fotos, conecta con otros carnavaleros y mucho mas.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    { icon: Award, text: 'Insignias y logros por cada Carnaval' },
                    { icon: Camera, text: 'Tu galeria personal de memorias' },
                    { icon: QrCode, text: 'Codigo QR para conectar con otros' },
                    { icon: MessageCircle, text: 'Chat y feedback en tiempo real' },
                    { icon: Star, text: 'Acceso a contenido exclusivo' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-gold" />
                      </div>
                      <span className="text-sm text-white/70">{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/cuenta"
                  className="inline-flex items-center gap-2.5 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-carnaval-red/25">
                  <Users className="h-4 w-4" />
                  Crear mi Carnaval ID
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Preview mockup */}
              <div className="flex justify-center">
                <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 w-72">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-carnaval-red to-gold rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-lg font-display font-black text-white">Tu Nombre</p>
                    <p className="text-xs text-white/40">Carnavalero desde 2025</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                      <span className="text-xs text-white/50">Carnavales</span>
                      <span className="text-xs font-bold text-gold">3</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                      <span className="text-xs text-white/50">Insignias</span>
                      <span className="text-xs font-bold text-gold">🏆 🎭 📸</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                      <span className="text-xs text-white/50">Fotos</span>
                      <span className="text-xs font-bold text-gold">24</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
