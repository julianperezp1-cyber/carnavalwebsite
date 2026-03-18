'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Users, Camera, Award, QrCode, MessageCircle, Star,
  Sparkles, ArrowRight, CheckCircle2, ChevronRight,
} from 'lucide-react';

export function CarnavalIdHero() {
  const { user, loading } = useAuth();

  // If user is logged in, show a compact welcome bar instead of the full promo
  if (!loading && user) {
    return (
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-brand-dark rounded-2xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-carnaval-red to-gold rounded-full flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <CheckCircle2 className="h-4 w-4 text-carnaval-green" />
                    <span className="text-xs font-bold text-carnaval-green">Carnaval ID activo</span>
                  </div>
                  <p className="text-white font-display font-black text-lg">
                    Hola, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Carnavalero'}!
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/cuenta"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10">
                  Mi perfil <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/comunidad/galeria"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10">
                  <Camera className="h-3.5 w-3.5" /> Mis fotos
                </Link>
                <Link href="/comunidad/academia"
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10">
                  <Award className="h-3.5 w-3.5" /> Mis logros
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Not logged in — show full promo to incentivize registration
  return (
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

              <Link
                href="/cuenta"
                className="inline-flex items-center gap-2.5 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-carnaval-red/25"
              >
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
                    <span className="text-xs font-bold text-gold">&#127942; &#127917; &#128248;</span>
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
  );
}
