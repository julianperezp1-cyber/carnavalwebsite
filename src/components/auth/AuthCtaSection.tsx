'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { ArrowRight } from 'lucide-react';

interface AuthCtaSectionProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonColor?: string;
}

export function AuthCtaSection({
  title,
  description,
  buttonText = 'Crear Carnaval ID',
  buttonColor = 'bg-carnaval-green hover:bg-carnaval-green/90',
}: AuthCtaSectionProps) {
  const { user, loading } = useAuth();

  // Hide entire CTA section when user is logged in
  if (!loading && user) return null;

  return (
    <section className="py-16 sm:py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-4">{title}</h2>
        <p className="text-white/50 mb-8 max-w-xl mx-auto">{description}</p>
        <Link
          href="/cuenta"
          className={`inline-flex items-center gap-2 ${buttonColor} text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors`}
        >
          {buttonText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
