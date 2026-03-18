import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Calendar, MapPin, Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Calendario 365',
  description: 'Eventos del Carnaval de Barranquilla durante todo el ano: pre-carnaval, talleres, festivales y actividades culturales.',
};

const EVENT_TYPES: Record<string, { color: string; bg: string }> = {
  'Pre-carnaval': { color: 'text-carnaval-red', bg: 'bg-carnaval-red/10' },
  'Talleres': { color: 'text-carnaval-green', bg: 'bg-carnaval-green/10' },
  'Festivales': { color: 'text-gold', bg: 'bg-gold/10' },
  'Culturales': { color: 'text-carnaval-blue', bg: 'bg-carnaval-blue/10' },
};

const EVENTS = [
  { month: 'Enero', type: 'Pre-carnaval', title: 'Lectura del Bando', date: '18 de enero', location: 'Plaza de la Paz', desc: 'La Reina del Carnaval lee el bando que da inicio oficial a la temporada de fiestas.' },
  { month: 'Febrero', type: 'Pre-carnaval', title: 'Carnaval de Barranquilla 2027', date: '22-25 de febrero', location: 'Via 40 y calles del centro', desc: 'Los cuatro dias de la fiesta mas grande de Colombia: Batalla de Flores, Gran Parada, Festival de Orquestas y Entierro de Joselito.' },
  { month: 'Marzo', type: 'Culturales', title: 'Exposicion Post-Carnaval', date: '15 de marzo', location: 'Museo del Carnaval', desc: 'Muestra fotografica y artistica con lo mejor del Carnaval recien celebrado.' },
  { month: 'Abril', type: 'Talleres', title: 'Taller de Mascaras', date: '12 de abril', location: 'Casa del Carnaval', desc: 'Aprende a elaborar mascaras tradicionales con artesanos del Carnaval.' },
  { month: 'Junio', type: 'Festivales', title: 'Festival de Danzas Infantiles', date: '8 de junio', location: 'Parque Cultural del Caribe', desc: 'Las nuevas generaciones muestran su talento en danzas tradicionales.' },
  { month: 'Julio', type: 'Talleres', title: 'Escuela de Cumbia', date: '20 de julio', location: 'Casa del Carnaval', desc: 'Ciclo de talleres de cumbia con maestros reconocidos del folclor.' },
  { month: 'Septiembre', type: 'Culturales', title: 'Congreso de Investigacion del Carnaval', date: '5-6 de septiembre', location: 'Universidad del Norte', desc: 'Investigadores nacionales e internacionales presentan estudios sobre la fiesta y su impacto cultural.' },
  { month: 'Octubre', type: 'Festivales', title: 'Noche de Tambores', date: '18 de octubre', location: 'Barrio Abajo', desc: 'Gran encuentro de tamboreros y grupos folcloricos en el barrio cuna del Carnaval.' },
  { month: 'Noviembre', type: 'Pre-carnaval', title: 'Eleccion de la Reina', date: '22 de noviembre', location: 'Centro de Eventos Puerta de Oro', desc: 'Coronacion de la nueva Reina del Carnaval de Barranquilla.' },
  { month: 'Diciembre', type: 'Pre-carnaval', title: 'Guacherna', date: '13 de diciembre', location: 'Calle 44 y Via 40', desc: 'Desfile nocturno con faroles, cumbiambas y grupos folcloricos que anuncia la llegada del Carnaval.' },
];

const QUARTERS = [
  { label: 'Q1 — Enero a Marzo', months: ['Enero', 'Febrero', 'Marzo'] },
  { label: 'Q2 — Abril a Junio', months: ['Abril', 'Mayo', 'Junio'] },
  { label: 'Q3 — Julio a Septiembre', months: ['Julio', 'Agosto', 'Septiembre'] },
  { label: 'Q4 — Octubre a Diciembre', months: ['Octubre', 'Noviembre', 'Diciembre'] },
];

export default function CalendarioPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Calendario 365"
        subtitle="El Carnaval no es solo cuatro dias. Descubre eventos, talleres y festivales durante todo el ano."
        breadcrumbs={[{ label: 'Comunidad', href: '/comunidad' }, { label: 'Calendario' }]}
        accentColor="blue"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Event type legend */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-gray-400">Tipos:</span>
            {Object.entries(EVENT_TYPES).map(([type, style]) => (
              <span key={type} className={`inline-flex items-center gap-1.5 text-xs font-medium ${style.color}`}>
                <span className={`w-2 h-2 rounded-full ${style.bg} border ${style.color === 'text-carnaval-red' ? 'border-carnaval-red' : style.color === 'text-carnaval-green' ? 'border-carnaval-green' : style.color === 'text-gold' ? 'border-gold' : 'border-carnaval-blue'}`} />
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Events by quarter */}
      {QUARTERS.map((quarter, qi) => {
        const quarterEvents = EVENTS.filter(e => quarter.months.includes(e.month));
        if (quarterEvents.length === 0) return null;
        return (
          <section key={qi} className={`py-16 sm:py-20 ${qi % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">{quarter.label}</h2>
              </div>
              <div className="space-y-4">
                {quarterEvents.map((event, i) => {
                  const style = EVENT_TYPES[event.type];
                  return (
                    <div key={i} className={`${qi % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow`}>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="sm:w-32 shrink-0">
                          <div className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${style.color}`} />
                            <span className="text-sm font-bold text-brand-dark">{event.month}</span>
                          </div>
                          <span className={`inline-block mt-1 text-[10px] font-bold ${style.color} ${style.bg} px-2 py-0.5 rounded-full`}>{event.type}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-display font-black text-brand-dark mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500 leading-relaxed mb-3">{event.desc}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.date}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
