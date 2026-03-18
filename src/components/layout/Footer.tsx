import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Heart, ExternalLink, ShoppingBag, ArrowRight } from 'lucide-react';
import { SOCIAL_LINKS, ORG_ADDRESS, ORG_PHONE, ORG_EMAIL, ORG_NAME, ORG_NIT, SITE_TAGLINE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Newsletter bar */}
      <div className="bg-carnaval-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <div className="text-center sm:text-left shrink-0">
              <h3 className="text-lg sm:text-xl font-black text-white">Boletin Carnavalero</h3>
              <p className="text-sm text-white/80">Recibe noticias, programacion y contenido exclusivo</p>
            </div>
            <div className="flex-1 w-full max-w-xl">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo electronico"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm text-white placeholder-white/50 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20"
                />
                <button className="px-5 py-3 bg-gold hover:bg-gold-hover text-deep-blue font-bold rounded-xl text-sm transition-colors shrink-0 flex items-center gap-1.5">
                  Suscribirme
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo-vertical-sm.png"
                alt="Carnaval de Barranquilla"
                width={160}
                height={100}
                className="h-20 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-white/50 mb-4 leading-relaxed">
              {SITE_TAGLINE}. La fiesta mas grande de Colombia y una de las celebraciones culturales mas importantes del mundo.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
                { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
                { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'X/Twitter' },
                { icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-carnaval-red/50 flex items-center justify-center transition-colors group"
                >
                  <social.icon className="h-4 w-4 text-white/50 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">El Carnaval</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Historia y origen', href: '/tradicion' },
                { label: 'Declaratoria UNESCO', href: '/tradicion/unesco' },
                { label: 'Grupos folcloricos', href: '/tradicion/danzas' },
                { label: 'Lideres de la Tradicion', href: '/tradicion/lideres' },
                { label: 'Congo de Oro', href: '/tradicion/congo-de-oro' },
                { label: 'Manual del Carnaval', href: '/tradicion/manual' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Informacion</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Carnaval 2027', href: '/carnaval-2027' },
                { label: 'Noticias', href: '/noticias' },
                { label: 'Convocatorias', href: '/convocatorias' },
                { label: 'Multimedia', href: '/multimedia' },
                { label: 'Publicaciones', href: '/multimedia/publicaciones' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-carnaval-red mt-0.5 shrink-0" />
                <span className="text-sm text-white/40 leading-snug">{ORG_ADDRESS}</span>
              </li>
              <li>
                <a href={`tel:${ORG_PHONE.replace(/[^+\d]/g, '')}`} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Phone className="h-4 w-4 text-carnaval-red shrink-0" />
                  {ORG_PHONE}
                </a>
              </li>
              <li>
                <a href={`mailto:${ORG_EMAIL}`} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                  <Mail className="h-4 w-4 text-carnaval-red shrink-0" />
                  {ORG_EMAIL}
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">Ecosistema</h4>
              <div className="space-y-2">
                <a
                  href="https://mercado.carnavaldebarranquilla.org"
                  className="flex items-center gap-2 text-sm text-gold/70 hover:text-gold transition-colors"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Mercado Carnaval
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
                <a
                  href="https://museodelcarnavaldebarranquilla.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  Museo del Carnaval
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
                <a
                  href="https://festivaldeorquestas.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  Festival de Orquestas
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/30 text-center sm:text-left">
              &copy; {new Date().getFullYear()} {ORG_NAME} — NIT {ORG_NIT}. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
              <Link href="/politica-de-datos" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                Politica de datos
              </Link>
              <Link href="/terminos" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                Terminos y condiciones
              </Link>
              <span className="text-[11px] text-white/20 flex items-center gap-1">
                Hecho con <Heart className="h-2.5 w-2.5 text-carnaval-red" /> en Barranquilla
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
