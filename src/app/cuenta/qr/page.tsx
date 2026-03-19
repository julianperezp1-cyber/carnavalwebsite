'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import QRCode from 'qrcode';
import {
  QrCode, Download, Share2, ChevronRight, User, MapPin,
  Instagram, Phone, Mail, Edit3, Save, Check, Eye, EyeOff,
  Sparkles, Shield,
} from 'lucide-react';
import type { User as SupaUser } from '@supabase/supabase-js';

export default function QRPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Editable fields
  const [nickname, setNickname] = useState('');
  const [slogan, setSlogan] = useState('');
  const [showInstagram, setShowInstagram] = useState(true);
  const [showTiktok, setShowTiktok] = useState(true);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/cuenta'); return; }
      setUser(data.user);
      const meta = data.user.user_metadata || {};
      setNickname(meta.nickname || meta.full_name?.split(' ')[0] || '');
      setSlogan(meta.slogan || '');
      setShowInstagram(meta.show_instagram !== false);
      setShowTiktok(meta.show_tiktok !== false);
      setShowWhatsapp(meta.show_whatsapp || false);
      setShowEmail(meta.show_email || false);
      setWhatsappNumber(meta.whatsapp_number || meta.phone || '');

      // Generate QR
      const profileUrl = `${window.location.origin}/carnavalero/${data.user.id}`;
      const qr = await QRCode.toDataURL(profileUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#001113', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      });
      setQrDataUrl(qr);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await supabase.auth.updateUser({
      data: {
        nickname,
        slogan,
        show_instagram: showInstagram,
        show_tiktok: showTiktok,
        show_whatsapp: showWhatsapp,
        show_email: showEmail,
        whatsapp_number: whatsappNumber,
      },
    });
    // Also save to contact_info table
    await supabase.from('contact_info').upsert({
      id: user.id,
      nickname,
      slogan,
      show_instagram: showInstagram,
      show_tiktok: showTiktok,
      show_whatsapp: showWhatsapp,
      show_email: showEmail,
      whatsapp_number: whatsappNumber,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDownloadPDF() {
    if (!user) return;
    const meta = user.user_metadata || {};
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [90, 140] });

    // Background
    doc.setFillColor(0, 17, 19); // brand-dark
    doc.rect(0, 0, 90, 140, 'F');

    // Gradient bar top
    const gradientColors = [
      { r: 232, g: 51, b: 49 },  // red
      { r: 249, g: 115, b: 22 }, // orange
      { r: 255, g: 206, b: 56 }, // yellow
      { r: 0, g: 171, b: 37 },   // green
    ];
    gradientColors.forEach((c, i) => {
      doc.setFillColor(c.r, c.g, c.b);
      doc.rect(i * 22.5, 0, 22.5, 3, 'F');
    });

    // Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const displayName = meta.full_name || meta.name || 'Carnavalero';
    doc.text(displayName, 45, 18, { align: 'center' });

    // Nickname
    if (nickname) {
      doc.setFontSize(9);
      doc.setTextColor(255, 206, 56); // gold
      doc.text(`@${nickname}`, 45, 24, { align: 'center' });
    }

    // Slogan
    if (slogan) {
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255, 0.6);
      doc.text(`"${slogan}"`, 45, nickname ? 29 : 24, { align: 'center' });
    }

    // QR Code
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 22, 34, 46, 46);
    }

    // Scan text
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255, 0.4);
    doc.text('Escanea para conectar', 45, 85, { align: 'center' });

    // Divider
    doc.setDrawColor(255, 255, 255, 0.1);
    doc.line(15, 89, 75, 89);

    // Contact info
    let yPos = 95;
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255, 0.5);

    if (meta.city) {
      doc.text(`📍 ${meta.city}${meta.country ? ', ' + meta.country : ''}`, 45, yPos, { align: 'center' });
      yPos += 5;
    }
    if (showInstagram && meta.instagram) {
      doc.text(`📸 ${meta.instagram}`, 45, yPos, { align: 'center' });
      yPos += 5;
    }
    if (showTiktok && meta.tiktok) {
      doc.text(`🎵 ${meta.tiktok}`, 45, yPos, { align: 'center' });
      yPos += 5;
    }
    if (showWhatsapp && whatsappNumber) {
      doc.text(`💬 ${whatsappNumber}`, 45, yPos, { align: 'center' });
      yPos += 5;
    }
    if (showEmail) {
      doc.text(`✉️ ${user.email}`, 45, yPos, { align: 'center' });
      yPos += 5;
    }

    // Badges
    doc.setFontSize(6);
    doc.setTextColor(255, 206, 56);
    const badges = ['🎭'];
    if (meta.profile_completed) badges.push('⭐');
    if (meta.survey_completed) badges.push('📋');
    doc.text(badges.join('  '), 45, 128, { align: 'center' });

    // Bottom gradient bar
    gradientColors.forEach((c, i) => {
      doc.setFillColor(c.r, c.g, c.b);
      doc.rect(i * 22.5, 137, 22.5, 3, 'F');
    });

    // Footer
    doc.setFontSize(5);
    doc.setTextColor(255, 255, 255, 0.3);
    doc.text('Carnaval de Barranquilla', 45, 135, { align: 'center' });

    doc.save(`carnaval-id-${nickname || 'card'}.pdf`);
  }

  async function handleShare() {
    if (!user) return;
    const profileUrl = `${window.location.origin}/carnavalero/${user.id}`;
    if (navigator.share) {
      await navigator.share({
        title: `${nickname || 'Mi'} Carnaval ID`,
        text: `Conecta conmigo en el Carnaval de Barranquilla!`,
        url: profileUrl,
      });
    } else {
      await navigator.clipboard.writeText(profileUrl);
      alert('Link copiado al portapapeles!');
    }
  }

  if (loading) {
    return (
      <><Header /><div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-carnaval-red/30 border-t-carnaval-red rounded-full animate-spin" />
      </div><Footer /></>
    );
  }

  const meta = user?.user_metadata || {};

  return (
    <>
      <Header />
      <section className="relative overflow-hidden bg-gray-50">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 gradient-carnaval-vertical z-10" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-12">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <button onClick={() => router.push('/cuenta')} className="hover:text-gray-600">Carnaval ID</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-700 font-medium">Mi QR de Contacto</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-brand-dark">Mi QR de Contacto</h1>
          <p className="mt-1 text-sm text-gray-500">Tu tarjeta digital carnavalera. Muestra tu QR para conectar con otros.</p>
        </div>
      </section>
      <div className="h-1.5 gradient-carnaval" />

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* ═══ QR CARD PREVIEW ═══ */}
            <div>
              <div className="bg-brand-dark rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 gradient-carnaval" />

                {/* Name */}
                <h2 className="text-xl font-display font-black text-white mt-2">
                  {meta.full_name || meta.name || 'Carnavalero'}
                </h2>
                {nickname && (
                  <p className="text-sm text-gold font-bold mt-0.5">@{nickname}</p>
                )}
                {slogan && (
                  <p className="text-xs text-white/40 mt-1 italic">&ldquo;{slogan}&rdquo;</p>
                )}

                {/* QR Code */}
                {qrDataUrl && (
                  <div className="my-6 inline-block bg-white rounded-2xl p-4">
                    <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
                  </div>
                )}

                <p className="text-[10px] text-white/30 mb-4">Escanea para conectar conmigo</p>

                {/* Contact preview */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  {meta.city && (
                    <p className="text-xs text-white/50 flex items-center justify-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {meta.city}{meta.country ? `, ${meta.country}` : ''}
                    </p>
                  )}
                  {showInstagram && meta.instagram && (
                    <p className="text-xs text-white/50 flex items-center justify-center gap-1.5">
                      <Instagram className="h-3 w-3" /> {meta.instagram}
                    </p>
                  )}
                  {showWhatsapp && whatsappNumber && (
                    <p className="text-xs text-white/50 flex items-center justify-center gap-1.5">
                      <Phone className="h-3 w-3" /> {whatsappNumber}
                    </p>
                  )}
                  {showEmail && (
                    <p className="text-xs text-white/50 flex items-center justify-center gap-1.5">
                      <Mail className="h-3 w-3" /> {user?.email}
                    </p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-lg">🎭</span>
                  {meta.profile_completed && <span className="text-lg">⭐</span>}
                  {meta.survey_completed && <span className="text-lg">📋</span>}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 gradient-carnaval" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                <button onClick={handleDownloadPDF}
                  className="flex-1 bg-carnaval-red hover:bg-carnaval-red-hover text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" /> Descargar PDF
                </button>
                <button onClick={handleShare}
                  className="flex-1 bg-brand-dark hover:bg-brand-dark/90 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" /> Compartir
                </button>
              </div>
            </div>

            {/* ═══ SETTINGS ═══ */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-display font-black text-brand-dark mb-1">Personaliza tu tarjeta</h3>
                <p className="text-xs text-gray-400">Configura que informacion compartes con la comunidad</p>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nickname <span className="text-gray-400 font-normal">(nombre publico en la comunidad)</span>
                </label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)}
                  placeholder="Tu apodo carnavalero"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                <p className="text-[10px] text-gray-400 mt-1">Este nombre veran las personas que NO son tus conexiones</p>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Slogan carnavalero <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input type="text" value={slogan} onChange={e => setSlogan(e.target.value)}
                  placeholder='Ej: "Quien lo vive es quien lo goza"'
                  maxLength={60}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
                <p className="text-[10px] text-gray-400 mt-1">{slogan.length}/60 caracteres</p>
              </div>

              {/* WhatsApp number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numero de WhatsApp <span className="text-gray-400 font-normal">(para compartir con conexiones)</span>
                </label>
                <input type="tel" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-carnaval-red/30 focus:border-carnaval-red outline-none" />
              </div>

              {/* Visibility toggles */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-3">
                  ¿Que datos quieres compartir con tus conexiones?
                </label>
                <div className="space-y-2">
                  {[
                    { label: 'Instagram', value: showInstagram, onChange: setShowInstagram, icon: '📸', detail: meta.instagram || 'No configurado' },
                    { label: 'TikTok', value: showTiktok, onChange: setShowTiktok, icon: '🎵', detail: meta.tiktok || 'No configurado' },
                    { label: 'WhatsApp', value: showWhatsapp, onChange: setShowWhatsapp, icon: '💬', detail: whatsappNumber || 'No configurado' },
                    { label: 'Correo electronico', value: showEmail, onChange: setShowEmail, icon: '✉️', detail: user?.email || '' },
                  ].map(item => (
                    <label key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{item.label}</p>
                          <p className="text-[10px] text-gray-400">{item.detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{item.value ? 'Visible' : 'Oculto'}</span>
                        <div className={`w-10 h-5 rounded-full transition-colors relative ${item.value ? 'bg-carnaval-green' : 'bg-gray-300'}`}
                          onClick={() => item.onChange(!item.value)}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex items-start gap-2 mt-3 text-[10px] text-gray-400">
                  <Shield className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>Tu nombre completo, telefono y datos personales solo seran visibles para las personas con las que conectes. Los demas solo veran tu nickname.</span>
                </div>
              </div>

              {/* Save button */}
              <button onClick={handleSave} disabled={saving}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  saved ? 'bg-carnaval-green text-white' : 'bg-carnaval-red hover:bg-carnaval-red-hover text-white'
                }`}>
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  <><Check className="h-4 w-4" /> Guardado!</>
                ) : (
                  <><Save className="h-4 w-4" /> Guardar configuracion</>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1.5 gradient-carnaval" />
      <Footer />
    </>
  );
}
