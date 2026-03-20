'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Upload, Image as ImageIcon, Film, X, Globe, Users, Lock,
  ChevronDown, Loader2, MapPin, Check, AlertCircle, RefreshCw, Clock,
} from 'lucide-react';

const CATEGORIES = [
  'Batalla de Flores', 'Gran Parada de Tradicion', 'Gran Parada de Fantasia',
  'Guacherna', 'Coronacion', 'Reinado Popular', 'Precarnaval', 'Lectura del Bando',
  'Danzas y Comparsas', 'Disfraces', 'Gastronomia', 'Musica', 'Tips Carnaval', 'Carnaval General',
];

const VISIBILITY = [
  { value: 'public', label: 'Público', icon: Globe, desc: 'Todos pueden ver' },
  { value: 'friends', label: 'Seguidores', icon: Users, desc: 'Solo tus seguidores' },
  { value: 'private', label: 'Privado', icon: Lock, desc: 'Solo tú' },
] as const;

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 50 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

function fileSize(b: number) { return b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / (1024 * 1024)).toFixed(1) + ' MB'; }

export default function CrearPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isStory = searchParams.get('type') === 'story';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'post' | 'story'>(isStory ? 'story' : 'post');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [location, setLocation] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validate = useCallback((f: File): string | null => {
    const isImg = IMAGE_TYPES.includes(f.type);
    const isVid = VIDEO_TYPES.includes(f.type);
    if (!isImg && !isVid) return 'Formato no soportado. Usa JPG, PNG, WebP, GIF, MP4, MOV o WebM.';
    if (isImg && f.size > MAX_IMAGE) return `Imagen muy grande (${fileSize(f.size)}). Máximo 10MB.`;
    if (isVid && f.size > MAX_VIDEO) return `Video muy grande (${fileSize(f.size)}). Máximo 50MB.`;
    return null;
  }, []);

  const selectFile = useCallback((f: File) => {
    const err = validate(f);
    if (err) { setFileError(err); return; }
    setFileError(null);
    setFile(f);
    setMediaType(VIDEO_TYPES.includes(f.type) ? 'video' : 'image');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  }, [validate, previewUrl]);

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null); setPreviewUrl(null); setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const publish = async () => {
    if (!file || !user) return;
    if (mode === 'post' && !category) return;

    setUploading(true); setUploadError(null); setProgress(0);

    try {
      const supabase = createClient();
      const ts = Date.now();
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${user.id}/${ts}_${safe}`;

      const interval = setInterval(() => {
        setProgress(p => p >= 85 ? (clearInterval(interval), 85) : p + Math.random() * 15);
      }, 300);

      const { error: upErr } = await supabase.storage.from('posts').upload(path, file);
      clearInterval(interval);
      if (upErr) throw new Error(upErr.message);
      setProgress(90);

      const { data: { publicUrl } } = supabase.storage.from('posts').getPublicUrl(path);
      setProgress(95);

      if (mode === 'story') {
        const { error: insertErr } = await supabase.from('stories').insert({
          user_id: user.id,
          media_url: publicUrl,
          media_type: mediaType,
          caption: caption.trim() || null,
        });
        if (insertErr) throw new Error(insertErr.message);
      } else {
        const { error: insertErr } = await supabase.from('posts').insert({
          user_id: user.id,
          caption: caption.trim() || null,
          media_url: publicUrl,
          media_type: mediaType,
          thumbnail_url: null,
          category,
          visibility,
          likes_count: 0,
          comments_count: 0,
        });
        if (insertErr) throw new Error(insertErr.message);

        // Update posts_count
        await supabase.rpc('increment_posts_count', { user_id_input: user.id }).catch(() => {
          // If RPC doesn't exist, manually update
          supabase.from('profiles').select('posts_count').eq('id', user.id).single().then(({ data }) => {
            supabase.from('profiles').update({ posts_count: (data?.posts_count || 0) + 1 }).eq('id', user.id);
          });
        });
      }

      setProgress(100);
      setTimeout(() => router.push('/red-social'), 500);
    } catch (err: any) {
      setUploadError(err.message || 'Error. Intenta de nuevo.');
      setUploading(false); setProgress(0);
    }
  };

  if (!user) return null;

  const canPublish = file && !uploading && (mode === 'story' || category);

  return (
    <div className="min-h-full bg-white">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* ═══ MODE TOGGLE ═══ */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMode('post')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'post' ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            Publicación
          </button>
          <button
            onClick={() => setMode('story')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${mode === 'story' ? 'bg-brand-dark text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            <Clock className="w-4 h-4" /> Historia (24h)
          </button>
        </div>

        {/* ═══ FILE SELECTION ═══ */}
        {!file ? (
          <div>
            <div
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) selectFile(f); }}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging ? 'border-carnaval-red bg-red-50 scale-[1.01]' : 'border-gray-200 bg-gray-50 hover:border-carnaval-red'}`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E83331, #FFCE38)' }}>
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-base font-semibold text-brand-dark">
                    {mode === 'story' ? 'Sube tu historia' : 'Arrastra o toca para subir'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Fotos y videos del Carnaval</p>
                </div>
                <div className="flex gap-4 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Imagen (10MB)</span>
                  <span className="flex items-center gap-1"><Film className="w-3 h-3" /> Video (50MB)</span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" onChange={e => { const f = e.target.files?.[0]; if (f) selectFile(f); }} className="hidden" />
            </div>
            {fileError && (
              <div className="flex items-center gap-2 bg-red-50 text-carnaval-red text-sm px-4 py-3 rounded-xl mt-3">
                <AlertCircle className="w-4 h-4 shrink-0" /> {fileError}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* Preview */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative">
              {mediaType === 'video' ? (
                <video src={previewUrl || undefined} className="w-full max-h-[350px] object-contain bg-black" controls playsInline />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={previewUrl || undefined} alt="Vista previa" className="w-full max-h-[350px] object-contain" />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 flex justify-between items-center">
                <span className="text-white text-xs font-medium">{fileSize(file.size)}</span>
                <button onClick={clearFile} disabled={uploading} className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  <RefreshCw className="w-3 h-3" /> Cambiar
                </button>
              </div>
            </div>

            {/* Caption */}
            <div>
              <textarea
                value={caption}
                onChange={e => { if (e.target.value.length <= 500) setCaption(e.target.value); }}
                placeholder={mode === 'story' ? 'Agrega un texto a tu historia...' : 'Escribe un pie de foto...'}
                rows={3}
                disabled={uploading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-carnaval-red/20 focus:border-carnaval-red resize-none disabled:opacity-50"
              />
              <p className={`text-right text-[11px] mt-0.5 ${caption.length > 450 ? 'text-carnaval-red' : 'text-gray-300'}`}>
                {caption.length}/500
              </p>
            </div>

            {/* Post-only fields */}
            {mode === 'post' && (
              <>
                {/* Category */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">
                    Categoría <span className="text-carnaval-red">*</span>
                  </label>
                  <button
                    onClick={() => setCatOpen(!catOpen)}
                    disabled={uploading}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-carnaval-red/20 disabled:opacity-50"
                  >
                    <span className={category ? 'text-brand-dark' : 'text-gray-300'}>{category || 'Selecciona'}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {catOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-52 overflow-y-auto">
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => { setCategory(cat); setCatOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex justify-between ${category === cat ? 'text-carnaval-red font-medium bg-red-50' : 'text-brand-dark'}`}>
                          {cat} {category === cat && <Check className="w-4 h-4 text-carnaval-red" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-semibold text-brand-dark mb-1.5">Visibilidad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {VISIBILITY.map(opt => {
                      const Icon = opt.icon;
                      const sel = visibility === opt.value;
                      return (
                        <button key={opt.value} onClick={() => setVisibility(opt.value as any)} disabled={uploading}
                          className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-center disabled:opacity-50 ${sel ? 'border-carnaval-red bg-red-50' : 'border-gray-200'}`}>
                          <Icon className={`w-5 h-5 ${sel ? 'text-carnaval-red' : 'text-gray-400'}`} />
                          <span className={`text-[11px] font-medium ${sel ? 'text-carnaval-red' : 'text-gray-500'}`}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text" value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="Ubicación (opcional)" disabled={uploading}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-carnaval-red/20 disabled:opacity-50"
                  />
                </div>
              </>
            )}

            {/* Progress */}
            {uploading && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-brand-dark">Subiendo...</span>
                  <span className="text-sm font-semibold text-carnaval-red">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #E83331, #FFCE38)' }} />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-start gap-2 bg-red-50 text-carnaval-red text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div><p className="font-medium">Error al publicar</p><p className="text-red-400 mt-0.5">{uploadError}</p></div>
              </div>
            )}

            {/* Publish button */}
            <button
              onClick={publish}
              disabled={!canPublish}
              className="w-full py-3 bg-carnaval-red text-white rounded-xl font-semibold text-sm hover:bg-carnaval-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : mode === 'story' ? 'Compartir historia' : 'Publicar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
