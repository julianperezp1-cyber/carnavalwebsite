import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Award, Calendar, MapPin, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lideres de la Tradicion',
  description: '18 agrupaciones con mas de 50 anos preservando las raices culturales del Carnaval de Barranquilla.',
};

const LIDERES = [
  { name: 'Congo Grande de Barranquilla', founded: 1875, type: 'Congo', location: 'Barranquilla', founder: 'Joaquin Brachi' },
  { name: 'El Torito Ribeno', founded: 1930, type: 'Disfraz', location: 'Barranquilla' },
  { name: 'Congo Grande de Galapa', founded: 1920, type: 'Congo', location: 'Galapa' },
  { name: 'Cumbiamba El Canonazo', founded: 1964, type: 'Cumbiamba', location: 'Barranquilla', founder: 'Rafael Altamar' },
  { name: 'Las Animas Rojas de Rebolo', founded: 1940, type: 'Congo', location: 'Rebolo' },
  { name: 'Danza El Imperio de las Aves', founded: 1950, type: 'Danza', location: 'Barranquilla' },
  { name: 'Los Cabezones', founded: 1945, type: 'Disfraz', location: 'Barranquilla' },
  { name: 'Danza El Perro Negro', founded: 1955, type: 'Danza', location: 'Barranquilla' },
  { name: 'Danza Paloteo Mixto', founded: 1940, type: 'Paloteo', location: 'Barranquilla' },
  { name: 'Disfraces de Enrique Salcedo', founded: 1960, type: 'Disfraz', location: 'Barranquilla' },
  { name: 'Cumbiamba La Arenosa', founded: 1950, type: 'Cumbiamba', location: 'Barranquilla' },
  { name: 'Disfraces Las Gigantonas', founded: 1955, type: 'Disfraz', location: 'Barranquilla' },
  { name: 'Disfraz El Descabezado', founded: 1948, type: 'Disfraz', location: 'Barranquilla' },
  { name: 'Cumbiamba La Revoltosa', founded: 1960, type: 'Cumbiamba', location: 'Barranquilla' },
  { name: 'Danza Paloteo Barranquilla', founded: 1945, type: 'Paloteo', location: 'Barranquilla' },
  { name: 'Danza Congo Tigre de Galapa', founded: 1935, type: 'Congo', location: 'Galapa' },
  { name: 'Congo Campesino de Galapa', founded: 1940, type: 'Congo', location: 'Galapa' },
  { name: 'Indios e Indias de Trenza Chimila', founded: 1950, type: 'Danza de Indios', location: 'Barranquilla' },
];

const typeColors: Record<string, string> = {
  'Congo': 'bg-carnaval-red/10 text-carnaval-red',
  'Cumbiamba': 'bg-carnaval-green/10 text-carnaval-green',
  'Disfraz': 'bg-gold/10 text-amber-700',
  'Danza': 'bg-carnaval-blue/10 text-carnaval-blue',
  'Paloteo': 'bg-brand-dark/10 text-brand-dark',
  'Danza de Indios': 'bg-carnaval-red/10 text-carnaval-red',
};

export default function LideresPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Lideres de la Tradicion"
        subtitle="18 agrupaciones con mas de 50 anos de historia que preservan las raices vivas del Carnaval."
        breadcrumbs={[{ label: 'Tradicion', href: '/tradicion' }, { label: 'Lideres de la Tradicion' }]}
        accentColor="green"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Stats */}
      <section className="py-8 bg-brand-dark">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-10">
          {[
            { icon: Users, value: '18', label: 'Agrupaciones' },
            { icon: Calendar, value: '50+', label: 'Anos minimo' },
            { icon: Award, value: '148', label: 'Anos el mas antiguo' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-gold" />
              <div>
                <span className="text-xl font-display font-black text-white">{s.value}</span>
                <span className="text-xs text-white/40 ml-1.5">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* List */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LIDERES.sort((a, b) => a.founded - b.founded).map((l, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${typeColors[l.type] || 'bg-gray-100 text-gray-600'}`}>
                    {l.type}
                  </span>
                </div>
                <h3 className="text-base font-display font-black text-brand-dark mb-3 leading-tight">{l.name}</h3>
                <div className="space-y-1.5">
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    Fundada en {l.founded} — <span className="font-semibold text-carnaval-red">{new Date().getFullYear() - l.founded} anos</span>
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {l.location}
                  </p>
                  {l.founder && (
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      Fundador: {l.founder}
                    </p>
                  )}
                </div>
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
