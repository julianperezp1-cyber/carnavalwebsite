import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { User, Users, Briefcase, Megaphone, Film, ShoppingBag, Palette, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Equipo de Trabajo',
  description: 'Conoce al equipo detras del Carnaval de Barranquilla: direccion general, junta directiva y departamentos.',
};

const DEPARTMENTS = [
  { name: 'Direccion General', icon: Briefcase, color: 'text-carnaval-red', bg: 'bg-carnaval-red/10', desc: 'Lidera la planeacion estrategica, la gestion institucional y la representacion del Carnaval ante entidades nacionales e internacionales.' },
  { name: 'Comunicaciones', icon: Megaphone, color: 'text-carnaval-green', bg: 'bg-carnaval-green/10', desc: 'Gestiona la estrategia de comunicacion, relaciones con medios, redes sociales y contenido digital del Carnaval.' },
  { name: 'Produccion', icon: Film, color: 'text-gold', bg: 'bg-gold/10', desc: 'Coordina la produccion tecnica de todos los eventos: tarimas, sonido, iluminacion, logistica de desfiles y montajes.' },
  { name: 'Comercial', icon: ShoppingBag, color: 'text-carnaval-blue', bg: 'bg-carnaval-blue/10', desc: 'Desarrolla alianzas comerciales, patrocinios, licenciamiento de marca y generacion de ingresos para la sostenibilidad.' },
  { name: 'Cultura', icon: Palette, color: 'text-carnaval-red', bg: 'bg-carnaval-red/10', desc: 'Preserva y promueve las tradiciones culturales, gestiona convocatorias artisticas y programas de formacion folclorica.' },
  { name: 'Logistica', icon: Truck, color: 'text-carnaval-green', bg: 'bg-carnaval-green/10', desc: 'Coordina la operacion de seguridad, movilidad, aseo, salud y todos los servicios durante los dias de Carnaval.' },
];

export default function EquipoPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Equipo de Trabajo"
        subtitle="Las personas que hacen posible la fiesta mas grande de Colombia."
        breadcrumbs={[{ label: 'Somos', href: '/somos' }, { label: 'Equipo' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Director */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="bg-gradient-to-r from-brand-dark to-brand-dark/95 rounded-2xl p-8 sm:p-10 lg:p-12">
            <div className="flex flex-col sm:flex-row gap-8 items-center">
              <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <User className="h-16 w-16 text-white/30" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-gold/20 rounded-full px-3 py-1 mb-3">
                  <span className="w-2 h-2 bg-gold rounded-full" />
                  <span className="text-xs font-bold text-gold">Director General</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">Juan Carlos Ospino</h2>
                <p className="text-white/50 max-w-xl">
                  Director General de Carnaval de Barranquilla S.A.S. Lidera la organizacion y gestion integral de la fiesta, patrimonio cultural e inmaterial de la humanidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-green/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-green rounded-full" />
              <span className="text-xs font-bold text-carnaval-green">Gobernanza</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Junta Directiva</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Presidida por el Alcalde de Barranquilla, la Junta Directiva esta integrada por representantes del sector publico, privado y cultural de la ciudad.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-carnaval-green/10 rounded-xl flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-carnaval-green" />
              </div>
              <div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">Composicion de la Junta</h3>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>Alcalde de Barranquilla (Presidente)</li>
                  <li>Representantes del sector empresarial</li>
                  <li>Representantes de los hacedores del Carnaval</li>
                  <li>Delegados de entidades culturales</li>
                  <li>Secretario de Cultura Distrital</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-red/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-red rounded-full" />
              <span className="text-xs font-bold text-carnaval-red">6 areas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Departamentos</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Las areas que trabajan todo el ano para hacer realidad el Carnaval.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEPARTMENTS.map((dept, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${dept.bg} rounded-xl flex items-center justify-center`}>
                    <dept.icon className={`h-5 w-5 ${dept.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{dept.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
