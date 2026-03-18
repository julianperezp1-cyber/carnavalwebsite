'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { User, Mail, Lock, ArrowRight, Ticket, Camera, Heart, Trophy, Star } from 'lucide-react';

const FEATURES = [
  { icon: Ticket, title: 'Boletas digitales', desc: 'Compra y gestiona tus boletas para todos los eventos del Carnaval.' },
  { icon: Camera, title: 'Galeria comunitaria', desc: 'Sube tus fotos y comparte tus mejores momentos con la comunidad.' },
  { icon: Heart, title: 'Favoritos', desc: 'Guarda tus danzas, comparsas y eventos favoritos en un solo lugar.' },
  { icon: Trophy, title: 'Quizzes y logros', desc: 'Participa en quizzes interactivos y gana insignias carnavaleras.' },
  { icon: Star, title: 'Contenido exclusivo', desc: 'Accede a videos, fotos y contenido detras de camaras del Carnaval.' },
];

export default function CuentaPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Header />

      {/* Page header inline (since we cant use metadata in client component) */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-1.5 mb-6">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Inicio</Link>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-xs text-gray-600 font-medium">Carnaval ID</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black leading-[0.95] text-brand-dark">Carnaval ID</h1>
          <p className="mt-3 text-base sm:text-lg max-w-2xl text-gray-500">Tu identidad digital en el Carnaval de Barranquilla. Un solo acceso a todo el ecosistema carnavalero.</p>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Form */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-carnaval-red/10 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-carnaval-red" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black text-brand-dark">
                      {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {isLogin ? 'Accede a tu Carnaval ID' : 'Registrate gratis'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="password"
                        placeholder="********"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    {isLogin ? 'Iniciar Sesion' : 'Crear Carnaval ID'}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gray-50 px-3 text-gray-400">o continua con</span>
                    </div>
                  </div>

                  <button className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                  {isLogin ? (
                    <>No tienes cuenta? <button onClick={() => setIsLogin(false)} className="text-carnaval-red font-bold hover:underline">Registrate</button></>
                  ) : (
                    <>Ya tienes cuenta? <button onClick={() => setIsLogin(true)} className="text-carnaval-red font-bold hover:underline">Inicia sesion</button></>
                  )}
                </p>

                <p className="text-[10px] text-gray-300 text-center mt-4">
                  Placeholder — la autenticacion se conectara a Supabase proximamente.
                </p>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-2">Que obtienes con tu Carnaval ID</h2>
                <p className="text-gray-500">Un solo acceso para disfrutar todo lo que el Carnaval digital tiene para ofrecerte.</p>
              </div>
              <div className="space-y-4">
                {FEATURES.map((feat, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="w-10 h-10 bg-carnaval-red/10 rounded-xl flex items-center justify-center shrink-0">
                      <feat.icon className="h-5 w-5 text-carnaval-red" />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-black text-brand-dark mb-0.5">{feat.title}</h3>
                      <p className="text-xs text-gray-500">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
