'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Camera, UserPlus, Upload } from 'lucide-react';

export function GaleriaParticipation() {
  const { user, loading } = useAuth();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-gradient-to-r from-carnaval-red/5 to-gold/5 rounded-2xl p-8 sm:p-10 border border-carnaval-red/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-carnaval-red/10 rounded-xl flex items-center justify-center shrink-0">
              <Camera className="h-6 w-6 text-carnaval-red" />
            </div>
            <div>
              {!loading && user ? (
                <>
                  <h2 className="text-2xl font-display font-black text-brand-dark mb-2">Sube tus fotos</h2>
                  <p className="text-gray-500 mb-4 max-w-2xl">
                    Comparte tus mejores momentos del Carnaval con la comunidad. Sube fotos con titulo y categoria para que otros carnavaleros las descubran.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-6">
                    <li>1. Selecciona tu foto</li>
                    <li>2. Agrega titulo y categoria</li>
                    <li>3. La comunidad puede dar like a tus fotos</li>
                    <li>4. Las mejores fotos se destacan cada mes</li>
                  </ul>
                  <button
                    className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Subir foto
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-black text-brand-dark mb-2">Como participar</h2>
                  <p className="text-gray-500 mb-4 max-w-2xl">
                    Para subir tus fotos a la galeria comunitaria necesitas un Carnaval ID. Registrate gratis y comparte tus mejores momentos con la comunidad carnavalera.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-6">
                    <li>1. Crea tu Carnaval ID gratuito</li>
                    <li>2. Sube tus fotos con titulo y categoria</li>
                    <li>3. La comunidad puede dar like a tus fotos</li>
                    <li>4. Las mejores fotos se destacan cada mes</li>
                  </ul>
                  <Link
                    href="/cuenta"
                    className="inline-flex items-center gap-2 bg-carnaval-red hover:bg-carnaval-red-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Crear Carnaval ID
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
