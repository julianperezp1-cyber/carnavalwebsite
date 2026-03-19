'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  User, Phone, MapPin, Globe, Award, Camera, Star,
  ArrowRight, CheckCircle, Sparkles, ChevronRight,
} from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';

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

const CARNAVAL_EXPERIENCE = [
  { value: '0', label: 'Sera mi primer Carnaval' },
  { value: '1-3', label: '1 a 3 Carnavales' },
  { value: '4-10', label: '4 a 10 Carnavales' },
  { value: '10+', label: 'Mas de 10 Carnavales' },
  { value: 'local', label: 'Soy de Barranquilla, toda la vida!' },
];

const HOW_FOUND = [
  { value: 'social', label: 'Redes sociales' },
  { value: 'friend', label: 'Un amigo o familiar' },
  { value: 'tv', label: 'Television o prensa' },
  { value: 'search', label: 'Buscando en internet' },
  { value: 'local', label: 'Soy de aqui' },
  { value: 'other', label: 'Otro' },
];

const INTERESTS = [
  { value: 'batalla', label: '🌸 Batalla de Flores' },
  { value: 'tradicion', label: '🎭 Gran Parada de Tradicion' },
  { value: 'comparsas', label: '💃 Gran Parada de Comparsas' },
  { value: 'orquestas', label: '🎵 Festival de Orquestas' },
  { value: 'guacherna', label: '🕯️ Guacherna' },
  { value: 'lectura', label: '📜 Lectura del Bando' },
  { value: 'coronacion', label: '👑 Coronacion' },
  { value: 'todos', label: '🎉 Todos!' },
];

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); // 1: basic info, 2: carnaval profile, 3: done

  // Form fields
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('CO');
  const [city, setCity] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [carnavalesAttended, setCarnavalesAttended] = useState('');
  const [howFound, setHowFound] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [instagram, setInstagram] = useState('');
  const [travelGroup, setTravelGroup] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(true);

  const supabase = createClient();
  const selectedCountry = COUNTRIES.find(c => c.code === country);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/cuenta');
        return;
      }
      setUser(data.user);
      // Pre-fill from metadata if available
      const meta = data.user.user_metadata;
      if (meta?.phone) setPhone(meta.phone.replace(/^\+\d+/, ''));
      if (meta?.country) setCountry(meta.country);
      if (meta?.city) setCity(meta.city);
      setLoading(false);
    });
  }, []);

  async function handleSaveStep1() {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        phone: `${selectedCountry?.phone || ''}${phone}`,
        country,
        city,
        birth_year: birthYear,
        gender,
        accept_marketing: acceptMarketing,
        profile_completed_step1: true,
      },
    });

    // Also update profiles table
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        phone: `${selectedCountry?.phone || ''}${phone}`,
        country,
        city,
        accept_marketing: acceptMarketing,
      });
    }

    setSaving(false);
    if (!error) setStep(2);
  }

  async function handleSaveStep2() {
    setSaving(true);
    await supabase.auth.updateUser({
      data: {
        carnavales_attended: carnavalesAttended,
        how_found: howFound,
        interests,
        instagram: instagram || null,
        travel_group: travelGroup,
        profile_completed: true,
      },
    });
    setSaving(false);
    setStep(3);
  }

  function handleSkipToProfile() {
    router.push('/cuenta');
  }

  if (loading) {
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

  // Completion percentage
  const completionPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <>
      <Header />

      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <span>Carnaval ID</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-700 font-medium">Completar perfil</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">
            {step === 3 ? 'Perfil completo!' : 'Completa tu perfil'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 3
              ? 'Ya eres parte de la comunidad carnavalera.'
              : 'Cuentanos sobre ti para personalizar tu experiencia carnavalera.'}
          </p>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span>Progreso del perfil</span>
            <span className="font-bold text-carnaval-red">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-carnaval-red to-gold h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Datos basicos', 'Perfil carnavalero', 'Listo!'].map((label, i) => (
              <span key={i} className={`text-[10px] font-medium ${step > i ? 'text-carnaval-red' : 'text-gray-300'}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">

          {/* ═══ STEP 1: Basic info ═══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-carnaval-red/10 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-carnaval-red" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-black text-brand-dark">Datos basicos</h2>
                  <p className="text-xs text-gray-400">Informacion para personalizar tu experiencia</p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Telefono celular</label>
                <div className="flex gap-2">
                  <div className="relative w-24 shrink-0">
                    <select value={selectedCountry?.phone || '+57'} disabled
                      className="w-full px-2 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-600">
                      <option>{selectedCountry?.phone || '+57'}</option>
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="300 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                  </div>
                </div>
              </div>

              {/* Country + City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pais</label>
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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ciudad</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {country === 'CO' ? (
                      <select value={city} onChange={e => setCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none">
                        <option value="">Seleccionar</option>
                        {COLOMBIAN_CITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" value={city} onChange={e => setCity(e.target.value)}
                        placeholder="Tu ciudad"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                    )}
                  </div>
                </div>
              </div>

              {/* Birth year + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ano de nacimiento</label>
                  <select value={birthYear} onChange={e => setBirthYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none">
                    <option value="">Seleccionar</option>
                    {Array.from({ length: 80 }, (_, i) => 2010 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Genero</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none">
                    <option value="">Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                    <option value="N">Prefiero no decir</option>
                  </select>
                </div>
              </div>

              {/* Marketing */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                <input type="checkbox" checked={acceptMarketing} onChange={e => setAcceptMarketing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-carnaval-red border-gray-300 accent-carnaval-red" />
                <span className="text-xs text-gray-500">
                  Quiero recibir noticias, programacion y ofertas del Carnaval por correo y WhatsApp.
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button onClick={handleSkipToProfile}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Saltar por ahora
                </button>
                <button onClick={handleSaveStep1} disabled={saving}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continuar <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: Carnaval Profile ═══ */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-black text-brand-dark">Tu perfil carnavalero</h2>
                  <p className="text-xs text-gray-400">Cuentanos sobre tu relacion con el Carnaval</p>
                </div>
              </div>

              {/* Carnavales attended */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">¿Cuantos Carnavales has vivido?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CARNAVAL_EXPERIENCE.map(opt => (
                    <button key={opt.value} onClick={() => setCarnavalesAttended(opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        carnavalesAttended === opt.value
                          ? 'bg-carnaval-red text-white border-carnaval-red'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-carnaval-red/30'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* How found */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">¿Como conociste el Carnaval?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {HOW_FOUND.map(opt => (
                    <button key={opt.value} onClick={() => setHowFound(opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        howFound === opt.value
                          ? 'bg-carnaval-red text-white border-carnaval-red'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-carnaval-red/30'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">¿Que eventos te interesan mas? <span className="text-gray-400 font-normal">(selecciona varios)</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map(opt => (
                    <button key={opt.value}
                      onClick={() => {
                        if (opt.value === 'todos') {
                          setInterests(['todos']);
                        } else {
                          setInterests(prev =>
                            prev.includes(opt.value)
                              ? prev.filter(v => v !== opt.value)
                              : [...prev.filter(v => v !== 'todos'), opt.value]
                          );
                        }
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border text-left ${
                        interests.includes(opt.value)
                          ? 'bg-carnaval-red text-white border-carnaval-red'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-carnaval-red/30'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel group */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">¿Con quien vienes al Carnaval?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'solo', label: '🧍 Solo' },
                    { value: 'pareja', label: '💑 En pareja' },
                    { value: 'familia', label: '👨‍👩‍👧‍👦 Familia' },
                    { value: 'amigos', label: '👯 Amigos' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setTravelGroup(opt.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        travelGroup === opt.value
                          ? 'bg-carnaval-red text-white border-carnaval-red'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-carnaval-red/30'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Instagram o TikTok <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)}
                  placeholder="@tuusuario"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                <p className="text-[10px] text-gray-400 mt-1">Nos ayuda a conectar contigo y con la comunidad</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Atras
                </button>
                <button onClick={handleSkipToProfile}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Saltar
                </button>
                <button onClick={handleSaveStep2} disabled={saving}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Completar perfil <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: Done! ═══ */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-carnaval-green to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-2">
                Bienvenido a la familia!
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Tu perfil carnavalero esta listo. Ya puedes explorar todo lo que el Carnaval tiene para ti.
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-full mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                Has ganado tu primera insignia: Carnavalero Registrado
              </div>

              <div className="grid sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8">
                <button onClick={() => router.push('/cuenta')}
                  className="bg-carnaval-red hover:bg-carnaval-red-hover text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Mi perfil
                </button>
                <button onClick={() => router.push('/comunidad/galeria')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                  <Camera className="h-3.5 w-3.5" /> Galeria
                </button>
                <button onClick={() => router.push('/')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
                  <Star className="h-3.5 w-3.5" /> Explorar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
