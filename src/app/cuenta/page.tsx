'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  User, Mail, Lock, ArrowRight, Ticket, Camera, Heart,
  Trophy, Star, LogOut, Shield, AlertCircle, CheckCircle,
  Phone, MapPin, Globe, Eye, EyeOff, Check, X, QrCode,
} from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';

const FEATURES = [
  { icon: Ticket, title: 'Boletas digitales', desc: 'Compra y gestiona tus boletas para todos los eventos.' },
  { icon: Camera, title: 'Galeria comunitaria', desc: 'Sube tus fotos y comparte tus mejores momentos.' },
  { icon: Heart, title: 'Favoritos', desc: 'Guarda tus danzas, comparsas y eventos favoritos.' },
  { icon: Trophy, title: 'Quizzes y logros', desc: 'Participa en quizzes y gana insignias carnavaleras.' },
  { icon: Star, title: 'Contenido exclusivo', desc: 'Accede a videos y contenido detras de camaras.' },
];

const COUNTRIES = [
  { code: 'CO', name: 'Colombia', phone: '+57' },
  { code: 'US', name: 'Estados Unidos', phone: '+1' },
  { code: 'MX', name: 'Mexico', phone: '+52' },
  { code: 'VE', name: 'Venezuela', phone: '+58' },
  { code: 'EC', name: 'Ecuador', phone: '+593' },
  { code: 'PE', name: 'Peru', phone: '+51' },
  { code: 'PA', name: 'Panama', phone: '+507' },
  { code: 'BR', name: 'Brasil', phone: '+55' },
  { code: 'AR', name: 'Argentina', phone: '+54' },
  { code: 'CL', name: 'Chile', phone: '+56' },
  { code: 'ES', name: 'Espana', phone: '+34' },
  { code: 'FR', name: 'Francia', phone: '+33' },
  { code: 'DE', name: 'Alemania', phone: '+49' },
  { code: 'IT', name: 'Italia', phone: '+39' },
  { code: 'GB', name: 'Reino Unido', phone: '+44' },
  { code: 'CA', name: 'Canada', phone: '+1' },
  { code: 'OTHER', name: 'Otro', phone: '' },
];

const COLOMBIAN_CITIES = [
  'Barranquilla', 'Bogota', 'Medellin', 'Cali', 'Cartagena',
  'Santa Marta', 'Bucaramanga', 'Soledad', 'Malambo', 'Galapa',
  'Puerto Colombia', 'Baranoa', 'Sabanalarga', 'Valledupar',
  'Sincelejo', 'Monteria', 'Pereira', 'Manizales', 'Cucuta',
  'Ibague', 'Villavicencio', 'Pasto', 'Neiva', 'Armenia',
  'Otra ciudad',
];

// Password validation
function validatePassword(pw: string) {
  return {
    minLength: pw.length >= 8,
    hasUpper: /[A-Z]/.test(pw),
    hasLower: /[a-z]/.test(pw),
    hasNumber: /[0-9]/.test(pw),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
  };
}

function PasswordCheck({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${pass ? 'text-green-600' : 'text-gray-400'}`}>
      {pass ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </div>
  );
}

export default function CuentaPage() {
  const [isLogin, setIsLogin] = useState(true);
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('CO');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<SupaUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const supabase = createClient();

  const selectedCountry = COUNTRIES.find(c => c.code === country);
  const pwChecks = useMemo(() => validatePassword(password), [password]);
  const passwordValid = pwChecks.minLength && pwChecks.hasUpper && pwChecks.hasSymbol;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

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

    if (!isLogin) {
      // Validate registration
      if (!passwordValid) {
        setError('La contrasena no cumple los requisitos minimos de seguridad.');
        return;
      }
      if (!passwordsMatch) {
        setError('Las contrasenas no coinciden.');
        return;
      }
      if (!acceptTerms) {
        setError('Debes aceptar los terminos y condiciones.');
        return;
      }
      if (!fullName.trim()) {
        setError('El nombre completo es requerido.');
        return;
      }
      if (!phone.trim()) {
        setError('El telefono es requerido.');
        return;
      }
      if (!city.trim()) {
        setError('La ciudad es requerida.');
        return;
      }
    }

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
            data: {
              full_name: fullName,
              phone: `${selectedCountry?.phone || ''}${phone}`,
              country: country,
              city: city,
              accept_marketing: acceptMarketing,
            },
          },
        });
        if (error) throw error;
        setSuccess('Cuenta creada! Revisa tu correo para confirmar tu registro.');
      }
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Correo o contrasena incorrectos');
      } else if (err.message?.includes('already registered')) {
        setError('Este correo ya esta registrado. Intenta iniciar sesion.');
      } else {
        setError(err.message || 'Error al procesar la solicitud');
      }
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
        redirectTo: `${window.location.origin}/auth/callback`,
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

  // ═══ BADGES LOGIC ═══
  const badges = [];
  const meta = user?.user_metadata || {};
  if (user) badges.push({ id: 'registered', emoji: '🎭', name: 'Carnavalero Registrado', desc: 'Creaste tu Carnaval ID' });
  if (meta.profile_completed) badges.push({ id: 'profile', emoji: '⭐', name: 'Perfil Completo', desc: 'Completaste tu perfil carnavalero' });
  if (meta.survey_completed) badges.push({ id: 'survey', emoji: '📋', name: 'Voz del Carnaval', desc: 'Respondiste la encuesta carnavalera' });

  const allBadges = [
    { id: 'registered', emoji: '🎭', name: 'Carnavalero Registrado', desc: 'Crea tu Carnaval ID', earned: badges.some(b => b.id === 'registered') },
    { id: 'profile', emoji: '⭐', name: 'Perfil Completo', desc: 'Completa tu perfil carnavalero', earned: badges.some(b => b.id === 'profile') },
    { id: 'survey', emoji: '📋', name: 'Voz del Carnaval', desc: 'Responde la encuesta carnavalera', earned: badges.some(b => b.id === 'survey') },
    { id: 'foto', emoji: '📸', name: 'Fotografo', desc: 'Sube tu primera foto a la galeria', earned: false },
    { id: 'carnaval2027', emoji: '🎉', name: 'Carnaval 2027', desc: 'Asiste al Carnaval 2027', earned: false },
    { id: 'quiz', emoji: '🧠', name: 'Sabio del Carnaval', desc: 'Completa un quiz de la Academia', earned: false },
    { id: 'social', emoji: '🤝', name: 'Conector', desc: 'Conecta con 5 carnavaleros', earned: false },
    { id: 'veterano', emoji: '👑', name: 'Veterano', desc: 'Asiste a 5 Carnavales', earned: false },
  ];

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

        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-6 sm:px-8">
            {/* Profile card */}
            <div className="bg-brand-dark rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden mb-6">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />
              <div className="w-20 h-20 bg-gradient-to-br from-carnaval-red to-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-display font-black text-white">
                {meta.full_name || meta.name || 'Carnavalero'}
              </h2>
              <p className="text-sm text-white/50 mt-1">{user.email}</p>
              {(meta.city || meta.country) && (
                <p className="text-xs text-white/40 mt-1 flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {meta.city}{meta.city && meta.country ? ', ' : ''}{meta.country || ''}
                </p>
              )}
              <p className="text-xs text-gold mt-2">
                Carnavalero desde {new Date(user.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long' })}
              </p>

              {/* Earned badges preview */}
              {badges.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {badges.map(b => (
                    <span key={b.id} className="text-2xl" title={b.name}>{b.emoji}</span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 pt-5 border-t border-white/10">
                <div>
                  <p className="text-2xl font-display font-black text-white">0</p>
                  <p className="text-[10px] text-white/40">Carnavales</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-black text-white">{badges.length}</p>
                  <p className="text-[10px] text-white/40">Insignias</p>
                </div>
                <div>
                  <p className="text-2xl font-display font-black text-white">0</p>
                  <p className="text-[10px] text-white/40">Fotos</p>
                </div>
              </div>

              {/* Profile action buttons */}
              <div className="flex items-center justify-center gap-2 mt-5">
                <Link href="/cuenta/completar"
                  className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  <User className="h-3 w-3" /> Editar perfil
                </Link>
                <Link href="/cuenta/qr"
                  className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold bg-gold/10 hover:bg-gold/20 px-4 py-2 rounded-lg transition-colors">
                  <QrCode className="h-3 w-3" /> Mi QR
                </Link>
              </div>
            </div>

            {/* ═══ BADGES SECTION ═══ */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-display font-black text-brand-dark flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-gold" /> Mis insignias
                </h3>
                <span className="text-xs text-gray-400">{badges.length} / {allBadges.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {allBadges.map(badge => (
                  <div key={badge.id}
                    className={`text-center p-3 rounded-xl border transition-all ${
                      badge.earned
                        ? 'bg-white border-gold/30 shadow-sm'
                        : 'bg-gray-100/50 border-gray-200 opacity-40'
                    }`}>
                    <span className="text-2xl block mb-1">{badge.emoji}</span>
                    <p className={`text-[11px] font-bold ${badge.earned ? 'text-brand-dark' : 'text-gray-400'}`}>{badge.name}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ SURVEY CTA ═══ */}
            {!meta.survey_completed && (
              <div className="bg-gradient-to-r from-carnaval-red to-carnaval-red-hover rounded-2xl p-6 text-white relative overflow-hidden mb-6">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📋</span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">+1 insignia</span>
                  </div>
                  <h3 className="text-lg font-display font-black mb-1">Si eres carnavalero, te queremos escuchar!</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Responde nuestra encuesta y ayudanos a hacer un Carnaval cada vez mejor. Tu opinion vale oro.
                  </p>
                  <Link href="/cuenta/encuesta"
                    className="inline-flex items-center gap-2 bg-white text-carnaval-red px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
                    Responder encuesta
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Link href="/comunidad/galeria" className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center">
                <Camera className="h-5 w-5 text-carnaval-red" />
                <span className="text-xs font-bold text-brand-dark">Mi galeria</span>
              </Link>
              <Link href="/comunidad/academia" className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center">
                <Trophy className="h-5 w-5 text-gold" />
                <span className="text-xs font-bold text-brand-dark">Academia</span>
              </Link>
              <a href="https://mercadocarnavalweb.vercel.app" target="_blank" rel="noopener noreferrer"
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center">
                <Ticket className="h-5 w-5 text-carnaval-green" />
                <span className="text-xs font-bold text-brand-dark">Mercado</span>
              </a>
              <Link href="/comunidad" className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col items-center gap-2 text-center">
                <Heart className="h-5 w-5 text-carnaval-blue" />
                <span className="text-xs font-bold text-brand-dark">Comunidad</span>
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Form */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-carnaval-red/10 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-carnaval-red" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black text-brand-dark">
                      {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {isLogin ? 'Accede a tu Carnaval ID' : 'Registrate gratis — solo toma 1 minuto'}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-4 flex items-start gap-2 bg-green-50 text-green-600 text-xs p-3 rounded-xl border border-green-100">
                    <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Google Sign In — always on top */}
                <button type="button" onClick={handleGoogleSignIn}
                  className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-4">
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  {isLogin ? 'Iniciar con Google' : 'Registrarse con Google'}
                </button>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-gray-50 px-3 text-gray-400">o con tu correo</span></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* ═══ REGISTRATION FIELDS ═══ */}
                  {!isLogin && (
                    <>
                      {/* Full name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre completo *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                            placeholder="Como aparece en tu documento"
                            required={!isLogin}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Telefono celular *</label>
                        <div className="flex gap-2">
                          <div className="relative w-24 shrink-0">
                            <select
                              value={selectedCountry?.phone || '+57'}
                              disabled
                              className="w-full px-2 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-600"
                            >
                              <option>{selectedCountry?.phone || '+57'}</option>
                            </select>
                          </div>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="300 123 4567"
                              required={!isLogin}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                          </div>
                        </div>
                      </div>

                      {/* Country + City */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Pais *</label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <select value={country} onChange={e => { setCountry(e.target.value); setCity(''); }}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none">
                              {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Ciudad *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            {country === 'CO' ? (
                              <select value={city} onChange={e => setCity(e.target.value)}
                                required={!isLogin}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none">
                                <option value="">Seleccionar</option>
                                {COLOMBIAN_CITIES.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            ) : (
                              <input type="text" value={city} onChange={e => setCity(e.target.value)}
                                placeholder="Tu ciudad"
                                required={!isLogin}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Correo electronico *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="tu@email.com" required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Contrasena *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={isLogin ? 'Tu contrasena' : 'Crea una contrasena segura'}
                        required
                        minLength={isLogin ? 1 : 8}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Password strength indicators — only on register */}
                    {!isLogin && password.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                        <PasswordCheck pass={pwChecks.minLength} label="Minimo 8 caracteres" />
                        <PasswordCheck pass={pwChecks.hasUpper} label="Una mayuscula" />
                        <PasswordCheck pass={pwChecks.hasLower} label="Una minuscula" />
                        <PasswordCheck pass={pwChecks.hasNumber} label="Un numero" />
                        <PasswordCheck pass={pwChecks.hasSymbol} label="Un simbolo (!@#$...)" />
                      </div>
                    )}
                  </div>

                  {/* Confirm password — only on register */}
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Confirmar contrasena *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Repite tu contrasena"
                          required={!isLogin}
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none ${
                            confirmPassword.length > 0
                              ? passwordsMatch ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50'
                              : 'border-gray-200'
                          }`}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && !passwordsMatch && (
                        <p className="text-[10px] text-red-500 mt-1">Las contrasenas no coinciden</p>
                      )}
                      {confirmPassword.length > 0 && passwordsMatch && (
                        <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1"><Check className="h-3 w-3" /> Contrasenas coinciden</p>
                      )}
                    </div>
                  )}

                  {/* Terms & Marketing — only on register */}
                  {!isLogin && (
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-carnaval-red border-gray-300 accent-carnaval-red" />
                        <span className="text-xs text-gray-600">
                          Acepto los <span className="text-carnaval-red font-semibold">terminos y condiciones</span> y la <span className="text-carnaval-red font-semibold">politica de privacidad</span> del Carnaval de Barranquilla. *
                        </span>
                      </label>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={acceptMarketing} onChange={e => setAcceptMarketing(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-carnaval-red border-gray-300 accent-carnaval-red" />
                        <span className="text-xs text-gray-500">
                          Quiero recibir noticias, programacion y ofertas del Carnaval por correo y WhatsApp.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={loading || (!isLogin && (!passwordValid || !passwordsMatch || !acceptTerms))}
                    className="w-full bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 disabled:text-gray-500 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 mt-4">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Iniciar Sesion' : 'Crear mi Carnaval ID'}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-5">
                  {isLogin ? (
                    <>No tienes cuenta? <button onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }} className="text-carnaval-red font-bold hover:underline">Registrate</button></>
                  ) : (
                    <>Ya tienes cuenta? <button onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }} className="text-carnaval-red font-bold hover:underline">Inicia sesion</button></>
                  )}
                </p>

                <div className="flex items-center gap-1.5 justify-center mt-3 text-[10px] text-gray-300">
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
