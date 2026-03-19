import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/shared/PageHeader';
import { ORG_ADDRESS, ORG_PHONE, ORG_EMAIL, SOCIAL_LINKS } from '@/lib/constants';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacta al Carnaval de Barranquilla. Telefono, correo, direccion y formulario de contacto.',
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <PageHeader
        title="Contacto"
        subtitle="Estamos para ayudarte. Escribenos, llamanos o visitanos en la Casa del Carnaval."
        breadcrumbs={[{ label: 'Contacto' }]}
      />
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-display font-black text-brand-dark mb-6">Informacion de contacto</h2>
                <div className="space-y-5">
                  <a href={`tel:${ORG_PHONE.replace(/[^+\d]/g, '')}`} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-carnaval-red/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-carnaval-red" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark group-hover:text-carnaval-red transition-colors">{ORG_PHONE}</p>
                      <p className="text-xs text-gray-400">Lunes a viernes, 8:00 AM — 5:00 PM</p>
                    </div>
                  </a>
                  <a href={`mailto:${ORG_EMAIL}`} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-carnaval-green/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-carnaval-green" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark group-hover:text-carnaval-red transition-colors">{ORG_EMAIL}</p>
                      <p className="text-xs text-gray-400">Comunicaciones y prensa</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{ORG_ADDRESS}</p>
                      <p className="text-xs text-gray-400">Casa del Carnaval</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-carnaval-blue/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-carnaval-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">Lunes a viernes</p>
                      <p className="text-xs text-gray-400">8:00 AM — 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-sm font-display font-black text-brand-dark mb-4">Siguenos</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
                    { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
                    { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'X' },
                    { icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
                  ].map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-carnaval-red hover:text-white flex items-center justify-center text-gray-400 transition-all">
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h2 className="text-2xl font-display font-black text-brand-dark mb-6">Enviar mensaje</h2>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Nombre completo *</label>
                      <input type="text" required placeholder="Tu nombre"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Correo electronico *</label>
                      <input type="email" required placeholder="correo@ejemplo.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none bg-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Telefono</label>
                      <input type="tel" placeholder="+57 300 123 4567"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Asunto *</label>
                      <select required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none bg-white appearance-none">
                        <option value="">Seleccionar</option>
                        <option value="general">Consulta general</option>
                        <option value="prensa">Prensa y medios</option>
                        <option value="patrocinios">Patrocinios y alianzas</option>
                        <option value="proveedores">Proveedores</option>
                        <option value="convocatorias">Convocatorias</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Mensaje *</label>
                    <textarea required rows={5} placeholder="Escribe tu mensaje..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none bg-white resize-none" />
                  </div>
                  <button type="submit"
                    className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-colors">
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </button>
                </form>
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
