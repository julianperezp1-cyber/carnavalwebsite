import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { FileText, Download, Leaf, BarChart3, Shield, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transparencia',
  description: 'Portal de transparencia del Carnaval de Barranquilla: informes de gestion, sostenibilidad, financieros y politicas institucionales.',
};

const DOC_CATEGORIES = [
  { name: 'Informes de Gestion', icon: BarChart3, color: 'text-carnaval-red', bg: 'bg-carnaval-red/10' },
  { name: 'Sostenibilidad', icon: Leaf, color: 'text-carnaval-green', bg: 'bg-carnaval-green/10' },
  { name: 'Financieros', icon: FileText, color: 'text-gold', bg: 'bg-gold/10' },
  { name: 'Politicas', icon: Shield, color: 'text-carnaval-blue', bg: 'bg-carnaval-blue/10' },
];

const DOCUMENTS = [
  { category: 'Informes de Gestion', year: 2026, title: 'Informe de Gestion Carnaval 2026' },
  { category: 'Informes de Gestion', year: 2025, title: 'Informe de Gestion Carnaval 2025' },
  { category: 'Informes de Gestion', year: 2024, title: 'Informe de Gestion Carnaval 2024' },
  { category: 'Sostenibilidad', year: 2026, title: 'Reporte de Sostenibilidad 2026 (GRI)' },
  { category: 'Sostenibilidad', year: 2025, title: 'Reporte de Sostenibilidad 2025 (GRI)' },
  { category: 'Sostenibilidad', year: 2024, title: 'Reporte de Sostenibilidad 2024 (GRI)' },
  { category: 'Financieros', year: 2025, title: 'Estados Financieros 2025' },
  { category: 'Financieros', year: 2024, title: 'Estados Financieros 2024' },
  { category: 'Politicas', year: 2026, title: 'Politica de Tratamiento de Datos Personales' },
  { category: 'Politicas', year: 2026, title: 'Codigo de Etica y Buen Gobierno' },
  { category: 'Politicas', year: 2025, title: 'Politica de Sostenibilidad Ambiental' },
];

export default function TransparenciaPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Transparencia"
        subtitle="Accede a los informes, reportes y politicas del Carnaval de Barranquilla S.A.S."
        breadcrumbs={[{ label: 'Somos', href: '/somos' }, { label: 'Transparencia' }]}
        accentColor="green"
      />
      <div className="h-1.5 gradient-carnaval" />

      {/* Categories overview */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {DOC_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                <div className={`w-10 h-10 ${cat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <cat.icon className={`h-5 w-5 ${cat.color}`} />
                </div>
                <h3 className="text-sm font-display font-black text-brand-dark">{cat.name}</h3>
              </div>
            ))}
          </div>

          {/* Sustainability highlight */}
          <div className="bg-gradient-to-r from-carnaval-green/5 to-emerald-50 rounded-2xl p-8 sm:p-10 border border-carnaval-green/10 mb-16">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-carnaval-green/10 rounded-xl flex items-center justify-center shrink-0">
                <Leaf className="h-6 w-6 text-carnaval-green" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black text-brand-dark mb-2">Reporte de Sostenibilidad</h2>
                <p className="text-gray-500 max-w-2xl mb-4">
                  El Carnaval de Barranquilla publica anualmente su Reporte de Sostenibilidad bajo el formato GRI (Global Reporting Initiative),
                  documentando el impacto economico, social y ambiental de la fiesta. El reporte incluye indicadores de gestion ambiental,
                  huella de carbono, manejo de residuos y programas de inclusion social.
                </p>
                <div className="inline-flex items-center gap-2 bg-carnaval-green/10 rounded-full px-3 py-1">
                  <BookOpen className="h-3 w-3 text-carnaval-green" />
                  <span className="text-xs font-bold text-carnaval-green">Formato GRI Standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents list */}
      {DOC_CATEGORIES.map((cat, ci) => {
        const catDocs = DOCUMENTS.filter(d => d.category === cat.name);
        if (catDocs.length === 0) return null;
        return (
          <section key={ci} className={`py-16 sm:py-20 ${ci % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <div className="mb-8">
                <div className={`inline-flex items-center gap-2 ${cat.bg} rounded-full px-3 py-1 mb-3`}>
                  <span className={`w-2 h-2 rounded-full ${cat.color === 'text-carnaval-red' ? 'bg-carnaval-red' : cat.color === 'text-carnaval-green' ? 'bg-carnaval-green' : cat.color === 'text-gold' ? 'bg-gold' : 'bg-carnaval-blue'}`} />
                  <span className={`text-xs font-bold ${cat.color}`}>{catDocs.length} documentos</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">{cat.name}</h2>
              </div>
              <div className="space-y-3">
                {catDocs.map((doc, i) => (
                  <div key={i} className={`${ci % 2 === 0 ? 'bg-white' : 'bg-gray-50'} rounded-xl p-5 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow`}>
                    <div className="flex items-center gap-3">
                      <FileText className={`h-5 w-5 ${cat.color}`} />
                      <div>
                        <h4 className="text-sm font-display font-black text-brand-dark">{doc.title}</h4>
                        <span className="text-xs text-gray-400">{doc.year}</span>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-carnaval-red bg-gray-100 hover:bg-carnaval-red/10 px-3 py-1.5 rounded-lg transition-colors">
                      <Download className="h-3 w-3" />
                      PDF
                    </button>
                  </div>
                ))}
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
