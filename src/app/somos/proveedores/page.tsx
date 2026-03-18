import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { Handshake, CheckCircle, FileCheck, Building2, User, ArrowRight, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Relacion con Proveedores',
  description: 'Informacion para proveedores del Carnaval de Barranquilla: principios, requisitos, convocatorias activas y registro.',
};

const PRINCIPLES = [
  { title: 'Transparencia', desc: 'Todos los procesos de contratacion son publicos, competitivos y documentados bajo criterios objetivos de seleccion.', icon: CheckCircle, color: 'text-carnaval-green', bg: 'bg-carnaval-green/10' },
  { title: 'Equidad', desc: 'Garantizamos igualdad de condiciones para todos los participantes, priorizando la calidad y el cumplimiento de requisitos.', icon: Handshake, color: 'text-carnaval-red', bg: 'bg-carnaval-red/10' },
  { title: 'Sostenibilidad', desc: 'Valoramos proveedores con practicas ambientales responsables y comprometidos con el desarrollo social de la region.', icon: FileCheck, color: 'text-carnaval-blue', bg: 'bg-carnaval-blue/10' },
];

const REQ_JURIDICA = [
  'Certificado de existencia y representacion legal (vigente)',
  'RUT actualizado',
  'Estados financieros de los ultimos 2 anos',
  'Certificaciones de experiencia en proyectos similares',
  'Poliza de cumplimiento y responsabilidad civil',
  'Certificacion bancaria vigente',
];

const REQ_NATURAL = [
  'Cedula de ciudadania',
  'RUT actualizado',
  'Certificaciones de experiencia',
  'Certificacion bancaria',
  'Declaracion de renta (si aplica)',
];

const ACTIVE_PROCUREMENT = [
  { title: 'Servicios de sonido e iluminacion — Carnaval 2027', deadline: '30 de septiembre de 2026', status: 'Abierta' },
  { title: 'Suministro de vallas y senaletica', deadline: '15 de octubre de 2026', status: 'Abierta' },
  { title: 'Servicios de aseo y manejo de residuos', deadline: '1 de noviembre de 2026', status: 'Proximamente' },
];

export default function ProveedoresPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Relacion con Proveedores"
        subtitle="Conoce los principios, requisitos y oportunidades para ser proveedor del Carnaval de Barranquilla."
        breadcrumbs={[{ label: 'Somos', href: '/somos' }, { label: 'Proveedores' }]}
        accentColor="blue"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Principles */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Principios Rectores</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Nuestra relacion con proveedores se basa en tres pilares fundamentales.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <p.icon className={`h-5 w-5 ${p.color}`} />
                </div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-carnaval-red/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-carnaval-red rounded-full" />
              <span className="text-xs font-bold text-carnaval-red">Documentacion</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Requisitos</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-carnaval-red" />
                <h3 className="text-lg font-display font-black text-brand-dark">Persona Juridica</h3>
              </div>
              <ul className="space-y-2">
                {REQ_JURIDICA.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 text-carnaval-green shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-5 w-5 text-carnaval-blue" />
                <h3 className="text-lg font-display font-black text-brand-dark">Persona Natural</h3>
              </div>
              <ul className="space-y-2">
                {REQ_NATURAL.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                    <CheckCircle className="h-4 w-4 text-carnaval-green shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Active procurement */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-3 py-1 mb-3">
              <span className="w-2 h-2 bg-gold rounded-full" />
              <span className="text-xs font-bold text-amber-700">Convocatorias</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-brand-dark">Procesos Activos</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Convocatorias abiertas para proveedores del Carnaval de Barranquilla.</p>
          </div>
          <div className="space-y-4">
            {ACTIVE_PROCUREMENT.map((proc, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-display font-black text-brand-dark mb-1">{proc.title}</h3>
                    <p className="text-xs text-gray-400">Cierre: {proc.deadline}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    proc.status === 'Abierta' ? 'bg-carnaval-green/10 text-carnaval-green' : 'bg-gold/10 text-amber-700'
                  }`}>
                    <AlertCircle className="h-3 w-3" />
                    {proc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-16 sm:py-20 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">Registrate como proveedor</h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">Enviandonos tu informacion podras participar en futuras convocatorias y procesos de contratacion.</p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
          >
            Contactar para registro
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
