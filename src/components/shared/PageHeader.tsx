import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  accentColor?: 'red' | 'green' | 'gold' | 'blue';
  dark?: boolean;
}

const accentClasses = {
  red: 'text-carnaval-red',
  green: 'text-carnaval-green',
  gold: 'text-gold',
  blue: 'text-carnaval-blue',
};

export function PageHeader({ title, subtitle, breadcrumbs, accentColor = 'red', dark = false }: PageHeaderProps) {
  return (
    <section className={`relative overflow-hidden ${dark ? 'bg-brand-dark' : 'bg-gray-50'}`}>
      {/* Gradient bar left */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex items-center gap-1.5 mb-6">
            <Link href="/" className={`text-xs ${dark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
              Inicio
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className={`h-3 w-3 ${dark ? 'text-white/20' : 'text-gray-300'}`} />
                {crumb.href ? (
                  <Link href={crumb.href} className={`text-xs ${dark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={`text-xs ${dark ? 'text-white/70' : 'text-gray-600'} font-medium`}>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black leading-[0.95] ${dark ? 'text-white' : 'text-brand-dark'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-3 text-base sm:text-lg max-w-2xl ${dark ? 'text-white/50' : 'text-gray-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
