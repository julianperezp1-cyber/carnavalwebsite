'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  User, Mail, Lock, ArrowRight, Ticket, Camera, Heart,
  Trophy, Star, LogOut, Shield, AlertCircle, CheckCircle,
} from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';

const FEATURES = [
  { icon: Ticket, title: 'Boletas digitales', desc: 'Compra y gestiona tus boletas para todos los eventos.' },
  { icon: Camera, title: 'Galeria comunitaria', desc: 'Sube tus fotos y comparte tus mejores momentos.' },
  { icon: Heart, title: 'Favoritos', desc: 'Guarda tus danzas, comparsas y eventos favoritos.' },
  { icon: Trophy, title: 'Quizzes y logros', desc: 'Participa en quizzes y gana insignias carnavaleras.' },
  { icon: Star, title: 'Contenido exclusivo', desc: 'Accede a videos y contenido detras de camaras.' },
];

export default function CuentaPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<SupaUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setSuccess('Cuenta creada! Revisa tu correo para confirmar tu registro.');
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'Correo o contrasena incorrectos'
        : err.message || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function handleGoogleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/cuenta`,
      },
    });
  }

  if (checkingAuth) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  // ═══ LOGGED IN VIEW ═══
  if (user) {
    return (
      <>
        <Header />
        <section className="relative overflow-hidden bg-gray-50">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-brand-dark">Mi Carnaval ID</h1>
          </div>
        </section>
        <div className="h-1.5 gradient-carnaval" />

        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6 sm:px-8">
            {/* Profile card */}
            <div className="bg-brand-dark rounded-2xl p-8 text-center relative overflow-hidden mb-8">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />
              <div className="w-20 h-20 bg-gradient-to-br from-carnaval-red to-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-display font-black text-white">
                {user.user_metadata?.full_name || 'Carnavalero'}
              </h2>
              <p className="text-sm text-white/50 mt-1">{user.email}</p>
              <p className="text-xs text-gold mt-2">
                Carnavalero desde {new Date(user.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-2xl font-display font-black text-white">0</p>
                  <p className="text-[10px] text-white/40">Carnavales</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-black text-white">0</p>
                  <p className="text-[10px] text-white/40">Insignias</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-black text-white">0</p>
                  <p className="text-[10px] text-white/40">Fotos</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Link href="/comunidad/galeria" className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow flex items-center gap-3">
                <Camera className="h-5 w-5 text-carnaval-red" />
                <span className="text-sm font-bold text-brand-dark">Mi galeria</span>
              </Link>
              <Link href="/comunidad/academia" className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow flex items-center gap-3">
                <Trophy className="h-5 w-5 text-gold" />
                <span className="text-sm font-bold text-brand-dark">Mis logros</span>
              </Link>
              <a href="https://mercado.carnavaldebarranquilla.org" target="_blank" rel="noopener noreferrer"
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow flex items-center gap-3">
                <Ticket className="h-5 w-5 text-carnaval-green" />
                <span className="text-sm font-bold text-brand-dark">Mercado Carnaval</span>
              </a>
              <Link href="/comunidad" className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-shadow flex items-center gap-3">
                <Heart className="h-5 w-5 text-carnaval-blue" />
                <span className="text-sm font-bold text-brand-dark">Comunidad</span>
              </Link>
            </div>

            {/* Sign out */}
            <button onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-carnaval-red py-3 transition-colors">
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        </section>

        <div className="h-1.5 gradient-carnaval" />
        <Footer />
      </>
    );
  }

  // ═══ LOGIN / REGISTER VIEW ═══
  return (
    <>
      <Header />

      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-1.5 mb-6">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Inicio</Link>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-xs text-gray-600 font-medium">Carnaval ID</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-brand-dark">Carnaval ID</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            Tu identidad digital en el Carnaval de Barranquilla. Un solo acceso a todo el ecosistema.
          </p>
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

                {error && (
                  <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-center gap-2 bg-green-50 text-green-600 text-xs p-3 rounded-xl border border-green-100">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                          placeholder="Tu nombre" required={!isLogin}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="tu@email.com" required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Minimo 6 caracteres" required minLength={6}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-carnaval-red hover:bg-carnaval-red-hover disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Iniciar Sesion' : 'Crear Carnaval ID'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                    <div className="relative flex justify-center text-xs"><span className="bg-gray-50 px-3 text-gray-400">o continua con</span></div>
                  </div>

                  <button type="button" onClick={handleGoogleSignIn}
                    className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-6">
                  {isLogin ? (
                    <>No tienes cuenta? <button onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }} className="text-carnaval-red font-bold hover:underline">Registrate</button></>
                  ) : (
                    <>Ya tienes cuenta? <button onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }} className="text-carnaval-red font-bold hover:underline">Inicia sesion</button></>
                  )}
                </p>

                <div className="flex items-center gap-1.5 justify-center mt-4 text-[10px] text-gray-300">
                  <Shield className="h-3 w-3" />
                  Protegido con encriptacion SSL
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-2">Que obtienes con tu Carnaval ID</h2>
                <p className="text-gray-500 text-sm">Un solo acceso para todo el ecosistema del Carnaval de Barranquilla.</p>
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

              <div className="mt-6 bg-carnaval-red/5 rounded-xl p-4 border border-carnaval-red/10">
                <p className="text-xs text-carnaval-red font-semibold mb-1">Ecosistema conectado</p>
                <p className="text-xs text-gray-500">
                  Tu Carnaval ID tambien funciona en Mercado Carnaval para comprar boletas, hoteles, vuelos y mas.
                </p>
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
