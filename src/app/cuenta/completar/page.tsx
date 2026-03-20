'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  User, Phone, MapPin, Globe, Award, Camera, Star,
  ArrowRight, ArrowLeft, CheckCircle, Sparkles, ChevronRight,
  ChevronDown, Briefcase, Plane, Calendar,
} from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';

// ═══ ALL DATA CONSTANTS ═══

const PHONE_CODES = [
  { code: '+57', country: 'CO', flag: '🇨🇴', label: 'Colombia +57' },
  { code: '+1', country: 'US', flag: '🇺🇸', label: 'Estados Unidos +1' },
  { code: '+52', country: 'MX', flag: '🇲🇽', label: 'Mexico +52' },
  { code: '+58', country: 'VE', flag: '🇻🇪', label: 'Venezuela +58' },
  { code: '+593', country: 'EC', flag: '🇪🇨', label: 'Ecuador +593' },
  { code: '+51', country: 'PE', flag: '🇵🇪', label: 'Peru +51' },
  { code: '+507', country: 'PA', flag: '🇵🇦', label: 'Panama +507' },
  { code: '+55', country: 'BR', flag: '🇧🇷', label: 'Brasil +55' },
  { code: '+54', country: 'AR', flag: '🇦🇷', label: 'Argentina +54' },
  { code: '+56', country: 'CL', flag: '🇨🇱', label: 'Chile +56' },
  { code: '+34', country: 'ES', flag: '🇪🇸', label: 'Espana +34' },
  { code: '+33', country: 'FR', flag: '🇫🇷', label: 'Francia +33' },
  { code: '+49', country: 'DE', flag: '🇩🇪', label: 'Alemania +49' },
  { code: '+39', country: 'IT', flag: '🇮🇹', label: 'Italia +39' },
  { code: '+44', country: 'GB', flag: '🇬🇧', label: 'Reino Unido +44' },
  { code: '+1', country: 'CA', flag: '🇨🇦', label: 'Canada +1' },
  { code: '+506', country: 'CR', flag: '🇨🇷', label: 'Costa Rica +506' },
  { code: '+503', country: 'SV', flag: '🇸🇻', label: 'El Salvador +503' },
  { code: '+502', country: 'GT', flag: '🇬🇹', label: 'Guatemala +502' },
  { code: '+504', country: 'HN', flag: '🇭🇳', label: 'Honduras +504' },
  { code: '+591', country: 'BO', flag: '🇧🇴', label: 'Bolivia +591' },
  { code: '+595', country: 'PY', flag: '🇵🇾', label: 'Paraguay +595' },
  { code: '+598', country: 'UY', flag: '🇺🇾', label: 'Uruguay +598' },
  { code: '+809', country: 'DO', flag: '🇩🇴', label: 'Rep. Dominicana +809' },
  { code: '+53', country: 'CU', flag: '🇨🇺', label: 'Cuba +53' },
];

const COUNTRIES = [
  'Colombia', 'Estados Unidos', 'Mexico', 'Venezuela', 'Ecuador',
  'Peru', 'Panama', 'Brasil', 'Argentina', 'Chile', 'Espana',
  'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Canada',
  'Costa Rica', 'El Salvador', 'Guatemala', 'Honduras', 'Bolivia',
  'Paraguay', 'Uruguay', 'Republica Dominicana', 'Cuba', 'Otro',
];

const COLOMBIAN_CITIES = [
  'Barranquilla', 'Soledad', 'Malambo', 'Galapa', 'Puerto Colombia',
  'Baranoa', 'Sabanalarga', 'Juan de Acosta', 'Luruaco', 'Repelon',
  'Bogota', 'Medellin', 'Cali', 'Cartagena', 'Santa Marta',
  'Bucaramanga', 'Valledupar', 'Sincelejo', 'Monteria', 'Pereira',
  'Manizales', 'Cucuta', 'Ibague', 'Villavicencio', 'Pasto',
  'Neiva', 'Armenia', 'Popayan', 'Tunja', 'Riohacha',
  'San Andres', 'Leticia', 'Quibdo', 'Otra ciudad de Colombia',
];

const CARNAVAL_EVENTS = [
  'Fin de Semana de la Tradicion',
  'Lectura del Bando',
  'Coronacion de la Reina',
  'Reinado Popular',
  'Coronacion de los Ninos',
  'Metroconcierto',
  'Guacherna',
  'Batalla de Flores',
  'Gran Parada de Tradicion',
  'Gran Parada de Comparsas',
  'Desfile de los Ninos',
  'Desfile del Rey Momo',
  'Festival de Orquestas',
  'Todos los eventos',
  'Otros',
];

const CARNAVAL_EXPERIENCE = [
  'Sera mi primer Carnaval',
  '1 a 3 Carnavales',
  '4 a 10 Carnavales',
  'Mas de 10 Carnavales',
  'Soy de Barranquilla, toda la vida!',
];

const HOW_FOUND = [
  'Instagram',
  'Facebook',
  'TikTok',
  'YouTube',
  'Twitter / X',
  'Un amigo o familiar',
  'Television',
  'Prensa / periodico',
  'Radio',
  'Buscando en Google',
  'Pagina web del Carnaval',
  'Agencia de viajes',
  'Soy de Barranquilla',
  'Otro',
];

const TRAVEL_GROUP = [
  'Solo/a',
  'En pareja',
  'Con familia',
  'Con amigos',
  'Con companeros de trabajo',
  'Tour organizado',
];

const OCCUPATIONS = [
  'Estudiante',
  'Empleado/a',
  'Independiente / Freelancer',
  'Empresario/a',
  'Funcionario publico',
  'Docente / Academico',
  'Artista / Creativo',
  'Profesional de salud',
  'Ingeniero/a',
  'Abogado/a',
  'Comunicador / Periodista',
  'Comerciante',
  'Jubilado/a',
  'Ama de casa',
  'Otro',
];

const STAY_DAYS = ['1 dia', '2 dias', '3 dias', '4 dias', '5 o mas dias'];

const ACCOMMODATION = [
  'Hotel',
  'Apartamento / Airbnb',
  'Casa de familiar o amigo',
  'Hostal',
  'Resort',
  'No necesito (soy local)',
];

const TRANSPORT = [
  'Vivo en Barranquilla',
  'Avion',
  'Bus intermunicipal',
  'Carro propio',
  'Moto',
  'Otro',
];

const BUDGET_RANGES = [
  'Menos de $200.000',
  '$200.000 - $500.000',
  '$500.000 - $1.000.000',
  '$1.000.000 - $2.000.000',
  '$2.000.000 - $5.000.000',
  'Mas de $5.000.000',
  'Prefiero no decir',
];

const COMM_CHANNELS = [
  'WhatsApp',
  'Email',
  'Instagram',
  'SMS',
  'Llamada telefonica',
];

// ═══ HELPER: Select dropdown ═══
function SelectField({ label, value, onChange, options, placeholder, optional }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string; optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label} {optional && <span className="text-gray-400 font-normal">(opcional)</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none pr-10">
          <option value="">{placeholder || 'Seleccionar'}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ═══ HELPER: Checkbox group ═══
function CheckboxGroup({ label, options, selected, onChange, optional }: {
  label: string; options: string[]; selected: string[];
  onChange: (v: string[]) => void; optional?: boolean;
}) {
  function toggle(opt: string) {
    if (opt === 'Todos los eventos') {
      onChange(selected.includes(opt) ? [] : ['Todos los eventos']);
    } else {
      const filtered = selected.filter(s => s !== 'Todos los eventos');
      onChange(filtered.includes(opt) ? filtered.filter(s => s !== opt) : [...filtered, opt]);
    }
  }
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        {label} {optional && <span className="text-gray-400 font-normal">(opcional)</span>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <input type="checkbox" checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="w-4 h-4 rounded text-carnaval-red border-gray-300 accent-carnaval-red shrink-0" />
            <span className="text-xs text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ═══ MAIN COMPONENT ═══
export default function CompletarPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); // 1: basic, 2: carnaval, 3: travel planning, 4: done

  // Step 1: Basic info
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [city, setCity] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [acceptMarketing, setAcceptMarketing] = useState(true);

  // Step 2: Carnaval profile
  const [carnavalesAttended, setCarnavalesAttended] = useState('');
  const [howFound, setHowFound] = useState('');
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);
  const [travelGroup, setTravelGroup] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [npsScore, setNpsScore] = useState('');
  const [commChannels, setCommChannels] = useState<string[]>([]);

  // Step 3: Travel planning (optional)
  const [stayDays, setStayDays] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [budget, setBudget] = useState('');

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/cuenta');
        return;
      }
      setUser(data.user);
      const meta = data.user.user_metadata;
      if (meta?.country) setCountry(meta.country === 'CO' ? 'Colombia' : meta.country);
      if (meta?.city) setCity(meta.city);
      setLoading(false);
    });
  }, []);

  // Check username availability
  useEffect(() => {
    if (!username.trim() || username.length < 3) { setUsernameAvailable(null); return; }
    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim().toLowerCase())
        .neq('id', user?.id || '')
        .maybeSingle();
      setUsernameAvailable(!data);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [username, user]);

  const selectedPhoneCode = PHONE_CODES.find(p => p.code === phoneCode);
  const isColombian = country === 'Colombia';

  const yearOptions = Array.from({ length: 80 }, (_, i) => String(2010 - i));

  async function saveAllData() {
    if (!user) return;
    setSaving(true);

    const profileData = {
      // Step 1
      phone: `${phoneCode}${phone}`,
      phone_code: phoneCode,
      country,
      city,
      birth_year: birthYear,
      gender,
      occupation,
      accept_marketing: acceptMarketing,
      // Step 2
      carnavales_attended: carnavalesAttended,
      how_found: howFound,
      favorite_events: favoriteEvents,
      travel_group: travelGroup,
      instagram: instagram || null,
      tiktok: tiktok || null,
      nps_score: npsScore,
      comm_channels: commChannels,
      // Step 3
      stay_days: stayDays,
      accommodation,
      transport,
      budget,
      // Flags
      profile_completed_step1: true,
      profile_completed: true,
    };

    await supabase.auth.updateUser({ data: profileData });

    const upsertData: any = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      phone: `${phoneCode}${phone}`,
      country,
      city,
      accept_marketing: acceptMarketing,
    };
    if (username.trim()) upsertData.username = username.trim().toLowerCase();
    await supabase.from('profiles').upsert(upsertData);

    setSaving(false);
  }

  async function handleNextStep1() {
    setSaving(true);
    // Save step 1 data
    await supabase.auth.updateUser({
      data: {
        phone: `${phoneCode}${phone}`,
        phone_code: phoneCode,
        country,
        city,
        birth_year: birthYear,
        gender,
        occupation,
        accept_marketing: acceptMarketing,
        profile_completed_step1: true,
      },
    });
    if (user) {
      const upsertData: any = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        phone: `${phoneCode}${phone}`,
        country,
        city,
        accept_marketing: acceptMarketing,
      };
      if (username.trim()) upsertData.username = username.trim().toLowerCase();
      await supabase.from('profiles').upsert(upsertData);
    }
    setSaving(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleNextStep2() {
    setSaving(true);
    await supabase.auth.updateUser({
      data: {
        carnavales_attended: carnavalesAttended,
        how_found: howFound,
        favorite_events: favoriteEvents,
        travel_group: travelGroup,
        instagram: instagram || null,
        tiktok: tiktok || null,
        nps_score: npsScore,
        comm_channels: commChannels,
      },
    });
    setSaving(false);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleFinish() {
    await saveAllData();
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSkip() {
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

  const totalSteps = 4;
  const completionPct = Math.round((step / totalSteps) * 100);

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
            {step === 4 ? 'Perfil completo!' : 'Completa tu perfil'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 4 ? 'Ya eres parte de la comunidad carnavalera.' : 'Cuentanos sobre ti para personalizar tu experiencia.'}
          </p>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      {/* Progress bar */}
      {step < 4 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Paso {step} de 3</span>
              <span className="font-bold text-carnaval-red">{completionPct}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-carnaval-red to-gold h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {['Datos basicos', 'Perfil carnavalero', 'Planificacion'].map((label, i) => (
                <span key={i} className={`text-[10px] font-medium ${step > i ? 'text-carnaval-red' : step === i + 1 ? 'text-gray-600' : 'text-gray-300'}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">

          {/* ═══════════════════════════════════ STEP 1: DATOS BASICOS ═══════════════════════════════════ */}
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

              {/* Username (unique handle) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre de usuario <span className="text-gray-400 font-normal">(como Instagram)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                  <input type="text" value={username}
                    onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase())}
                    placeholder="tu_usuario" maxLength={30}
                    className={`w-full pl-8 pr-10 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-carnaval-red/30 outline-none ${
                      usernameAvailable === true ? 'border-carnaval-green focus:border-carnaval-green' :
                      usernameAvailable === false ? 'border-carnaval-red focus:border-carnaval-red' :
                      'border-gray-200 focus:border-carnaval-red'
                    }`} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checkingUsername && <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />}
                    {!checkingUsername && usernameAvailable === true && <CheckCircle className="w-4 h-4 text-carnaval-green" />}
                    {!checkingUsername && usernameAvailable === false && <span className="text-carnaval-red text-xs font-medium">Ocupado</span>}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Solo letras, numeros, puntos y guion bajo. Minimo 3 caracteres. Este sera tu identificador unico.</p>
              </div>

              {/* Phone with code dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Telefono celular</label>
                <div className="flex gap-2">
                  <div className="relative w-36 shrink-0">
                    <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none pr-8">
                      {PHONE_CODES.map(p => (
                        <option key={`${p.country}-${p.code}`} value={p.code}>{p.flag} {p.code}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="300 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                  </div>
                </div>
              </div>

              {/* Country */}
              <SelectField label="Pais" value={country} onChange={setCountry} options={COUNTRIES} />

              {/* City */}
              {isColombian ? (
                <SelectField label="Ciudad" value={city} onChange={setCity} options={COLOMBIAN_CITIES} />
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ciudad</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={city} onChange={e => setCity(e.target.value)}
                      placeholder="Tu ciudad"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                  </div>
                </div>
              )}

              {/* Birth year + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Ano de nacimiento" value={birthYear} onChange={setBirthYear} options={yearOptions} optional />
                <SelectField label="Genero" value={gender} onChange={setGender}
                  options={['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']} optional />
              </div>

              {/* Occupation */}
              <SelectField label="Ocupacion" value={occupation} onChange={setOccupation} options={OCCUPATIONS} optional />

              {/* Marketing */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                <input type="checkbox" checked={acceptMarketing} onChange={e => setAcceptMarketing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-carnaval-red border-gray-300 accent-carnaval-red" />
                <span className="text-xs text-gray-500">
                  Quiero recibir noticias, programacion y ofertas del Carnaval por correo y WhatsApp.
                </span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button onClick={handleSkip}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Saltar
                </button>
                <button onClick={handleNextStep1} disabled={saving}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continuar <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════ STEP 2: PERFIL CARNAVALERO ═══════════════════════════════════ */}
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

              <SelectField label="¿Cuantos Carnavales has vivido?" value={carnavalesAttended}
                onChange={setCarnavalesAttended} options={CARNAVAL_EXPERIENCE} />

              <SelectField label="¿Como conociste el Carnaval de Barranquilla?" value={howFound}
                onChange={setHowFound} options={HOW_FOUND} />

              {/* Favorite events - checkbox */}
              <CheckboxGroup label="¿Que eventos te interesan mas?" options={CARNAVAL_EVENTS}
                selected={favoriteEvents} onChange={setFavoriteEvents} />

              <SelectField label="¿Con quien vienes al Carnaval?" value={travelGroup}
                onChange={setTravelGroup} options={TRAVEL_GROUP} />

              {/* Communication channels - checkbox */}
              <CheckboxGroup label="Canal de comunicacion preferido" options={COMM_CHANNELS}
                selected={commChannels} onChange={setCommChannels} />

              {/* NPS */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  ¿Recomendarias el Carnaval a un amigo? <span className="text-gray-400 font-normal">(1 = poco probable, 10 = definitivamente)</span>
                </label>
                <div className="flex gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                    <button key={n} onClick={() => setNpsScore(String(n))}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        npsScore === String(n)
                          ? n <= 6 ? 'bg-red-500 text-white' : n <= 8 ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social media */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Instagram <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)}
                    placeholder="@tuusuario"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    TikTok <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input type="text" value={tiktok} onChange={e => setTiktok(e.target.value)}
                    placeholder="@tuusuario"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 -mt-3">Nos ayuda a identificar creadores de contenido y conectar con la comunidad</p>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Atras
                </button>
                <button onClick={handleSkip}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Saltar
                </button>
                <button onClick={handleNextStep2} disabled={saving}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continuar <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════ STEP 3: PLANIFICACION DE VIAJE ═══════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-carnaval-green/20 rounded-xl flex items-center justify-center">
                  <Plane className="h-5 w-5 text-carnaval-green" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-black text-brand-dark">Planificacion del viaje</h2>
                  <p className="text-xs text-gray-400">Toda esta seccion es opcional</p>
                </div>
              </div>

              {/* Intro text */}
              <div className="bg-carnaval-green/5 border border-carnaval-green/20 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Si planeas asistir al Carnaval de Barranquilla</span>, por favor responde las siguientes preguntas. Nos ayudan a mejorar tu experiencia y la de todos los visitantes.
                </p>
              </div>

              <SelectField label="¿Cuantos dias planeas quedarte?" value={stayDays}
                onChange={setStayDays} options={STAY_DAYS} optional />

              <SelectField label="¿Que tipo de alojamiento prefieres?" value={accommodation}
                onChange={setAccommodation} options={ACCOMMODATION} optional />

              <SelectField label="¿Como llegas a Barranquilla?" value={transport}
                onChange={setTransport} options={TRANSPORT} optional />

              <SelectField label="¿Cual es tu presupuesto aproximado para el Carnaval?" value={budget}
                onChange={setBudget} options={BUDGET_RANGES} optional />

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="h-4 w-4" /> Atras
                </button>
                <button onClick={handleSkip}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Saltar
                </button>
                <button onClick={handleFinish} disabled={saving}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Completar perfil <CheckCircle className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════ STEP 4: DONE ═══════════════════════════════════ */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-carnaval-green to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-2">
                Bienvenido a la familia carnavalera!
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Tu perfil esta listo. Ya puedes explorar todo lo que el Carnaval tiene para ti.
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
