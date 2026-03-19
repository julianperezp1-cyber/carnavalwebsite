'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import {
  ChevronRight, ChevronDown, ArrowRight, ArrowLeft,
  CheckCircle, Sparkles, Award, MessageSquare,
  ThumbsUp, ThumbsDown, Star,
} from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';

// ═══ HELPER COMPONENTS ═══

function RatingScale({ label, value, onChange, labels }: {
  label: string; value: string; onChange: (v: string) => void;
  labels?: { low: string; high: string };
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => onChange(String(n))}
            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
              value === String(n) ? 'bg-carnaval-red text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {n}
          </button>
        ))}
      </div>
      {labels && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-400">{labels.low}</span>
          <span className="text-[10px] text-gray-400">{labels.high}</span>
        </div>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none pr-10">
          <option value="">{placeholder || 'Seleccionar'}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50">
            <input type="checkbox" checked={selected.includes(opt)}
              onChange={() => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])}
              className="w-4 h-4 rounded text-carnaval-red border-gray-300 accent-carnaval-red shrink-0" />
            <span className="text-xs text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows || 3}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none resize-none" />
    </div>
  );
}

// ═══ MAIN COMPONENT ═══
export default function EncuestaPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  // SECTION 1: Experiencia General del Carnaval
  const [satisfaccionGeneral, setSatisfaccionGeneral] = useState('');
  const [mejorMomento, setMejorMomento] = useState('');
  const [peorMomento, setPeorMomento] = useState('');
  const [volveriaAsistir, setVolveriaAsistir] = useState('');
  const [recomendaria, setRecomendaria] = useState('');

  // SECTION 2: Logistica y Organizacion
  const [seguridad, setSeguridad] = useState('');
  const [limpieza, setLimpieza] = useState('');
  const [senalizacion, setSenalizacion] = useState('');
  const [accesibilidad, setAccesibilidad] = useState('');
  const [transporte, setTransporte] = useState('');
  const [problemasLogistica, setProblemasLogistica] = useState<string[]>([]);
  const [sugerenciaLogistica, setSugerenciaLogistica] = useState('');

  // SECTION 3: Precios y Valor
  const [preciosBoletas, setPreciosBoletas] = useState('');
  const [preciosComida, setPreciosComida] = useState('');
  const [preciosAlojamiento, setPreciosAlojamiento] = useState('');
  const [valorDinero, setValorDinero] = useState('');
  const [gastoTotal, setGastoTotal] = useState('');

  // SECTION 4: Comunicacion y Digital
  const [enteroComo, setEnteroComo] = useState('');
  const [usoApp, setUsoApp] = useState('');
  const [calidadInfo, setCalidadInfo] = useState('');
  const [redesSociales, setRedesSociales] = useState('');
  const [mejoraDigital, setMejoraDigital] = useState('');

  // SECTION 5: Marcas y Patrocinadores
  const [marcasRecuerda, setMarcasRecuerda] = useState('');
  const [activacionesGusto, setActivacionesGusto] = useState('');
  const [comprariaMarca, setComprariaMarca] = useState('');
  const [tipoActivacion, setTipoActivacion] = useState<string[]>([]);

  // SECTION 6: Nuevas Ideas
  const [eventosNuevos, setEventosNuevos] = useState<string[]>([]);
  const [serviciosDesea, setServiciosDesea] = useState<string[]>([]);
  const [mejoraGeneral, setMejoraGeneral] = useState('');
  const [mensajeFinal, setMensajeFinal] = useState('');

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/cuenta'); return; }
      if (data.user.user_metadata?.survey_completed) { router.push('/cuenta'); return; }
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const totalSteps = 7;

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    await supabase.auth.updateUser({
      data: {
        survey_completed: true,
        survey_data: {
          // Section 1
          satisfaccionGeneral, mejorMomento, peorMomento, volveriaAsistir, recomendaria,
          // Section 2
          seguridad, limpieza, senalizacion, accesibilidad, transporte,
          problemasLogistica, sugerenciaLogistica,
          // Section 3
          preciosBoletas, preciosComida, preciosAlojamiento, valorDinero, gastoTotal,
          // Section 4
          enteroComo, usoApp, calidadInfo, redesSociales, mejoraDigital,
          // Section 5
          marcasRecuerda, activacionesGusto, comprariaMarca, tipoActivacion,
          // Section 6
          eventosNuevos, serviciosDesea, mejoraGeneral, mensajeFinal,
          // Meta
          completedAt: new Date().toISOString(),
        },
      },
    });
    setSaving(false);
    setStep(7);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goNext() { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function goBack() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  if (loading) {
    return (
      <><Header /><div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
      </div><Footer /></>
    );
  }

  return (
    <>
      <Header />
      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <span>Carnaval ID</span><ChevronRight className="h-3 w-3" /><span className="text-gray-700 font-medium">Encuesta</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">
            {step === 7 ? 'Gracias por tu opinion!' : 'Encuesta Carnavalera'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {step === 7 ? 'Tu feedback nos ayuda a hacer un Carnaval cada vez mejor.' : 'Tu opinion vale oro. Ayudanos a mejorar el Carnaval.'}
          </p>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      {/* Progress */}
      {step < 7 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Seccion {step} de 6</span>
              <span className="font-bold text-carnaval-red">{Math.round((step / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-carnaval-red to-gold h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(step / 6) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">

          {/* ═══ SECTION 1: Experiencia General ═══ */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-carnaval-red/10 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-carnaval-red" />
                </div>
                <h2 className="text-lg font-display font-black text-brand-dark">Experiencia General</h2>
              </div>
              <RatingScale label="¿Que tan satisfecho estuviste con el Carnaval en general?" value={satisfaccionGeneral}
                onChange={setSatisfaccionGeneral} labels={{ low: 'Muy insatisfecho', high: 'Muy satisfecho' }} />
              <TextArea label="¿Cual fue tu mejor momento del Carnaval?" value={mejorMomento}
                onChange={setMejorMomento} placeholder="Cuentanos ese momento que no olvidaras..." />
              <TextArea label="¿Hubo algo que no te gusto o que podamos mejorar?" value={peorMomento}
                onChange={setPeorMomento} placeholder="Tu feedback honesto nos ayuda a mejorar..." />
              <SelectField label="¿Volverias a asistir al Carnaval?" value={volveriaAsistir}
                onChange={setVolveriaAsistir} options={['Definitivamente si', 'Probablemente si', 'No estoy seguro', 'Probablemente no', 'Definitivamente no']} />
              <RatingScale label="¿Recomendarias el Carnaval a un amigo o familiar?" value={recomendaria}
                onChange={setRecomendaria} labels={{ low: 'Nada probable', high: 'Muy probable' }} />
              <div className="flex gap-3 pt-4">
                <button onClick={() => router.push('/cuenta')} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">Salir</button>
                <button onClick={goNext} className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">Siguiente <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* ═══ SECTION 2: Logistica ═══ */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-gold" />
                </div>
                <h2 className="text-lg font-display font-black text-brand-dark">Logistica y Organizacion</h2>
              </div>
              <RatingScale label="Seguridad en los eventos" value={seguridad} onChange={setSeguridad} labels={{ low: 'Muy mala', high: 'Excelente' }} />
              <RatingScale label="Limpieza de los espacios" value={limpieza} onChange={setLimpieza} labels={{ low: 'Muy mala', high: 'Excelente' }} />
              <RatingScale label="Senalizacion y orientacion" value={senalizacion} onChange={setSenalizacion} labels={{ low: 'Muy mala', high: 'Excelente' }} />
              <RatingScale label="Accesibilidad para todos" value={accesibilidad} onChange={setAccesibilidad} labels={{ low: 'Muy mala', high: 'Excelente' }} />
              <RatingScale label="Transporte y movilidad" value={transporte} onChange={setTransporte} labels={{ low: 'Muy mala', high: 'Excelente' }} />
              <CheckboxGroup label="¿Tuviste alguno de estos problemas?" options={[
                'Dificultad para llegar al evento', 'Falta de banos', 'Problemas con el sonido',
                'Demasiada aglomeracion', 'Falta de sombra / proteccion del sol',
                'Poca variedad de comida', 'Problemas de seguridad', 'Falta de informacion',
                'Problemas con los palcos', 'Ninguno',
              ]} selected={problemasLogistica} onChange={setProblemasLogistica} />
              <TextArea label="¿Alguna sugerencia para mejorar la logistica?" value={sugerenciaLogistica}
                onChange={setSugerenciaLogistica} placeholder="Ideas, quejas, sugerencias..." />
              <div className="flex gap-3 pt-4">
                <button onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Atras</button>
                <button onClick={goNext} className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">Siguiente <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* ═══ SECTION 3: Precios ═══ */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-carnaval-green/20 rounded-xl flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-carnaval-green" />
                </div>
                <h2 className="text-lg font-display font-black text-brand-dark">Precios y Valor</h2>
              </div>
              <SelectField label="¿Que opinas de los precios de las boletas?" value={preciosBoletas} onChange={setPreciosBoletas}
                options={['Muy economicos', 'Justos', 'Un poco caros', 'Muy caros', 'No compre boletas']} />
              <SelectField label="¿Que opinas de los precios de la comida en el evento?" value={preciosComida} onChange={setPreciosComida}
                options={['Muy economicos', 'Justos', 'Un poco caros', 'Muy caros', 'No compre comida']} />
              <SelectField label="¿Que opinas de los precios de alojamiento?" value={preciosAlojamiento} onChange={setPreciosAlojamiento}
                options={['Muy economicos', 'Justos', 'Un poco caros', 'Muy caros', 'Soy local']} />
              <RatingScale label="En general, ¿sientes que obtuviste buen valor por tu dinero?" value={valorDinero}
                onChange={setValorDinero} labels={{ low: 'Nada', high: 'Totalmente' }} />
              <SelectField label="¿Cuanto gastaste aproximadamente en total durante el Carnaval?" value={gastoTotal} onChange={setGastoTotal}
                options={['Menos de $200.000', '$200.000 - $500.000', '$500.000 - $1.000.000', '$1.000.000 - $2.000.000', '$2.000.000 - $5.000.000', 'Mas de $5.000.000', 'Prefiero no decir']} />
              <div className="flex gap-3 pt-4">
                <button onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Atras</button>
                <button onClick={goNext} className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">Siguiente <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* ═══ SECTION 4: Comunicacion y Digital ═══ */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-carnaval-blue/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-carnaval-blue" />
                </div>
                <h2 className="text-lg font-display font-black text-brand-dark">Comunicacion y Digital</h2>
              </div>
              <SelectField label="¿Como te enteraste de la programacion del Carnaval?" value={enteroComo} onChange={setEnteroComo}
                options={['Pagina web oficial', 'Instagram', 'Facebook', 'TikTok', 'WhatsApp', 'Television', 'Radio', 'Prensa', 'Amigos o familia', 'Otro']} />
              <SelectField label="¿Usaste la pagina web o app del Carnaval?" value={usoApp} onChange={setUsoApp}
                options={['Si, la pagina web', 'Si, la app', 'Ambas', 'No la conoci', 'No me parecio necesario']} />
              <RatingScale label="¿Que tan buena fue la informacion disponible sobre los eventos?" value={calidadInfo}
                onChange={setCalidadInfo} labels={{ low: 'Muy mala', high: 'Excelente' }} />
              <RatingScale label="¿Como calificas las redes sociales del Carnaval?" value={redesSociales}
                onChange={setRedesSociales} labels={{ low: 'Muy malas', high: 'Excelentes' }} />
              <TextArea label="¿Que te gustaria ver en la pagina web o app del Carnaval?" value={mejoraDigital}
                onChange={setMejoraDigital} placeholder="Funcionalidades, contenido, mejoras..." />
              <div className="flex gap-3 pt-4">
                <button onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Atras</button>
                <button onClick={goNext} className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">Siguiente <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* ═══ SECTION 5: Marcas y Patrocinadores ═══ */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ThumbsUp className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-display font-black text-brand-dark">Marcas y Patrocinadores</h2>
              </div>
              <TextArea label="¿Que marcas o patrocinadores recuerdas haber visto en el Carnaval?" value={marcasRecuerda}
                onChange={setMarcasRecuerda} placeholder="Nombra las que recuerdes..." />
              <TextArea label="¿Hubo alguna activacion de marca que te haya gustado? ¿Cual?" value={activacionesGusto}
                onChange={setActivacionesGusto} placeholder="Describe lo que te gusto..." />
              <SelectField label="¿Comprarias un producto o servicio que viste en el Carnaval?" value={comprariaMarca} onChange={setComprariaMarca}
                options={['Definitivamente si', 'Probablemente si', 'No estoy seguro', 'Probablemente no', 'No vi ninguna marca']} />
              <CheckboxGroup label="¿Que tipo de activaciones de marca te gustarian en el Carnaval?" options={[
                'Muestras gratis de productos', 'Zonas VIP de marcas', 'Concursos y rifas',
                'Photo booths / espacios para fotos', 'Experiencias interactivas', 'Comida y bebidas gratis',
                'Descuentos exclusivos', 'Merchandising del Carnaval', 'Zonas de descanso con sombra',
                'Carga de celulares / WiFi gratis', 'Activaciones musicales', 'Ninguna',
              ]} selected={tipoActivacion} onChange={setTipoActivacion} />
              <div className="flex gap-3 pt-4">
                <button onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Atras</button>
                <button onClick={goNext} className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">Siguiente <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {/* ═══ SECTION 6: Ideas y Cierre ═══ */}
          {step === 6 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>
                <h2 className="text-lg font-display font-black text-brand-dark">Ideas y Sugerencias</h2>
              </div>
              <CheckboxGroup label="¿Que nuevos eventos o actividades te gustaria que tuviera el Carnaval?" options={[
                'Conciertos nocturnos', 'Festival gastronomico', 'Feria artesanal mas grande',
                'Eventos de moda / pasarela', 'Mas actividades para ninos', 'Eventos deportivos',
                'Tours culturales guiados', 'Fiestas tematicas', 'Cine al aire libre',
                'Workshops de danza y musica', 'Mercado nocturno', 'Eventos de bienestar / yoga',
              ]} selected={eventosNuevos} onChange={setEventosNuevos} />
              <CheckboxGroup label="¿Que servicios te gustaria que estuvieran disponibles?" options={[
                'App movil con mapa en tiempo real', 'Sistema de pago sin efectivo (cashless)',
                'Reserva de palcos en linea', 'Transporte oficial del Carnaval',
                'Guarderia durante los eventos', 'Paquetes todo incluido (hotel + boletas)',
                'Guias turisticos del Carnaval', 'Zona de objetos perdidos',
                'Servicio de fotografo profesional', 'Streaming en vivo de todos los eventos',
              ]} selected={serviciosDesea} onChange={setServiciosDesea} />
              <TextArea label="Si pudieras cambiar UNA cosa del Carnaval, ¿que seria?" value={mejoraGeneral}
                onChange={setMejoraGeneral} placeholder="Tu idea mas importante..." rows={3} />
              <TextArea label="¿Algo mas que quieras decirnos? Tu mensaje es importante para nosotros." value={mensajeFinal}
                onChange={setMensajeFinal} placeholder="Cualquier comentario, sugerencia o felicitacion..." rows={4} />
              <div className="flex gap-3 pt-4">
                <button onClick={goBack} className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1.5"><ArrowLeft className="h-4 w-4" /> Atras</button>
                <button onClick={handleFinish} disabled={saving}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover disabled:bg-gray-300 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Enviar encuesta <CheckCircle className="h-4 w-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 7: DONE ═══ */}
          {step === 7 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-carnaval-green to-emerald-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-2">Gracias, carnavalero!</h2>
              <p className="text-gray-500 text-sm mb-3">Tu opinion nos ayuda a construir un Carnaval cada vez mejor para todos.</p>
              <div className="inline-flex items-center gap-2 text-xs text-gold bg-gold/10 px-4 py-2 rounded-full mb-8">
                <span className="text-lg">📋</span>
                <span className="font-bold">Nueva insignia desbloqueada: Voz del Carnaval</span>
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={() => router.push('/cuenta')}
                  className="bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
                  Volver a mi perfil
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
