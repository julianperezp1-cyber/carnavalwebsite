import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { ORG_NAME, ORG_NIT, ORG_ADDRESS, ORG_PHONE, ORG_EMAIL } from '@/lib/constants';
import {
  Heart, Globe, Target, Eye, Users, FileText, ShieldCheck,
  Truck, ArrowRight, Mail, Phone, MapPin, Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Somos — La Organizacion',
  description: 'Conoce a Carnaval de Barranquilla S.A.S., la organizacion encargada de planificar, producir y salvaguardar la fiesta mas grande de Colombia.',
};

const VALUES = [
  'Liderazgo', 'Respeto', 'Creatividad', 'Proactividad', 'Integridad', 'Responsabilidad',
];

const TEAM_ROLES = [
  { name: 'Juan Carlos Ospino', role: 'Director General', area: 'Direccion' },
  { name: 'Junta Directiva', role: 'Alcalde de Barranquilla, Presidente', area: 'Gobernanza' },
];

export default function SomosPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="La Organizacion"
        subtitle="Carnaval de Barranquilla S.A.S. — Hacemos posible la fiesta mas grande de Colombia."
        breadcrumbs={[{ label: 'Somos' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Purpose */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold text-carnaval-red uppercase tracking-[0.2em] mb-3">Proposito</p>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark mb-6 leading-[0.95]">
              Hacer del Carnaval un motor de desarrollo colectivo
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Que celebra y expande la alegria de Barranquilla y su gente, reconociendo y enalteciendo a quienes lo hacen posible.
            </p>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-carnaval-red flex items-center justify-center mb-5">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-display font-black text-brand-dark mb-3">Mision</h3>
              <p className="text-gray-600 leading-relaxed">
                Convertir la celebracion del Carnaval de Barranquilla en un espacio de inclusion, diversidad y orgullo colectivo, donde las tradiciones del caribe colombiano se viven, se gozan y se proyecten al mundo.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-carnaval-green flex items-center justify-center mb-5">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-display font-black text-brand-dark mb-3">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Consolidar a la empresa Carnaval de Barranquilla como una plataforma cultural y creativa viva los 365 dias del ano, que celebra la identidad, impulsa el desarrollo y posiciona a la ciudad como referente global en sostenibilidad, cultura e innovacion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-xs font-bold text-carnaval-green uppercase tracking-[0.2em] mb-3">Valores</p>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark mb-10">Lo que nos define</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100 hover:shadow-lg transition-shadow">
                <p className="text-sm font-display font-black text-brand-dark">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Attributes */}
      <section className="py-16 sm:py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-3">Atributos de marca</p>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white mb-10">Lo que representamos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Alegria y orgullo', desc: 'El Carnaval como expresion identitaria.' },
              { title: 'Innovacion cultural', desc: 'Un patrimonio vivo y en evolucion.' },
              { title: 'Colectividad', desc: 'Hecho por la gente, para la gente.' },
              { title: 'Proyeccion global', desc: 'La cultura como embajadora de la ciudad.' },
            ].map((attr, i) => (
              <div key={i} className="border-l-2 border-white/20 pl-5">
                <h3 className="text-lg font-display font-black text-white mb-2">{attr.title}</h3>
                <p className="text-sm text-white/50">{attr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: 'Equipo de trabajo', desc: 'Conoce al equipo que hace posible el Carnaval.', href: '/somos/equipo', color: 'bg-carnaval-red' },
              { icon: FileText, title: 'Transparencia', desc: 'Informes de gestion, sostenibilidad y documentos.', href: '/somos/transparencia', color: 'bg-carnaval-green' },
              { icon: Truck, title: 'Proveedores', desc: 'Convocatorias y requisitos para proveedores.', href: '/somos/proveedores', color: 'bg-gold' },
              { icon: Mail, title: 'Contacto', desc: 'Escribenos, llamanos o visitanos.', href: '/contacto', color: 'bg-carnaval-blue' },
            ].map((card) => (
              <Link key={card.href} href={card.href}
                className="group bg-white rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100">
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-display font-black text-brand-dark mb-1 group-hover:text-carnaval-red transition-colors">{card.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{card.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-carnaval-red">
                  Ver mas <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Company data */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <span className="font-medium">{ORG_NAME}</span>
            <span>NIT: {ORG_NIT}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {ORG_ADDRESS}</span>
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
