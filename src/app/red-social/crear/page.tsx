'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Upload,
  Image as ImageIcon,
  Film,
  X,
  Globe,
  Users,
  Lock,
  ChevronDown,
  Loader2,
  MapPin,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = [
  'Batalla de Flores',
  'Gran Parada de Tradicion',
  'Gran Parada de Fantasia',
  'Guacherna',
  'Coronacion',
  'Reinado Popular',
  'Precarnaval',
  'Lectura del Bando',
  'Danzas y Comparsas',
  'Disfraces',
  'Gastronomia',
  'Musica',
  'Tips Carnaval',
  'Carnaval General',
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Publico', icon: Globe, desc: 'Todos pueden ver' },
  { value: 'friends', label: 'Solo amigos', icon: Users, desc: 'Solo tus conexiones' },
  { value: 'private', label: 'Privado', icon: Lock, desc: 'Solo tu' },
] as const;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_CAPTION_LENGTH = 500;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function CrearPostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: File
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // Step 2: Details
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [location, setLocation] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Step 3: Upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback((f: File): string | null => {
    const isImage = ACCEPTED_IMAGE_TYPES.includes(f.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(f.type);

    if (!isImage && !isVideo) {
      return 'Formato no soportado. Usa JPG, PNG, WebP, GIF, MP4, MOV o WebM.';
    }
    if (isImage && f.size > MAX_IMAGE_SIZE) {
      return `La imagen es muy grande (${formatFileSize(f.size)}). Maximo 10MB.`;
    }
    if (isVideo && f.size > MAX_VIDEO_SIZE) {
      return `El video es muy grande (${formatFileSize(f.size)}). Maximo 50MB.`;
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (f: File) => {
      const error = validateFile(f);
      if (error) {
        setFileError(error);
        return;
      }

      setFileError(null);
      setFile(f);
      setMediaType(ACCEPTED_VIDEO_TYPES.includes(f.type) ? 'video' : 'image');

      // Create preview URL
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(URL.createObjectURL(f));
    },
    [validateFile, filePreviewUrl]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearFile = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFile(null);
    setFilePreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    if (!file || !user || !category) return;

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const supabase = createClient();
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${user.id}/${timestamp}_${safeName}`;

      // Simulate progress (Supabase JS client doesn't expose upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) {
        throw new Error(uploadError.message || 'Error al subir el archivo');
      }

      setUploadProgress(90);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('posts').getPublicUrl(filePath);

      setUploadProgress(95);

      // Insert post record
      const { error: insertError } = await supabase.from('posts').insert({
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

      if (insertError) {
        throw new Error(insertError.message || 'Error al crear la publicacion');
      }

      setUploadProgress(100);

      // Success - redirect
      setTimeout(() => {
        router.push('/red-social?toast=publicado');
      }, 500);
    } catch (err: any) {
      setUploadError(err.message || 'Ocurrio un error. Intenta de nuevo.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const canPublish = file && category && !uploading;

  // Auth guard - layout already handles redirect
  if (!authLoading && !user) return null;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-[#001113]">Nueva Publicación</h1>
        </div>

          {/* Step 1: File Selection */}
          {!file ? (
            <div className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    isDragging
                      ? 'border-[#E83331] bg-red-50 scale-[1.02]'
                      : 'border-gray-300 bg-white hover:border-[#E83331] hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E83331] to-[#FFCE38] flex items-center justify-center">
                    <Upload size={32} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#001113]">
                      Arrastra o toca para subir
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Fotos y videos de tu Carnaval
                    </p>
                  </div>
                  <div className="flex gap-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <ImageIcon size={14} />
                      JPG, PNG, WebP, GIF (10MB)
                    </span>
                    <span className="flex items-center gap-1">
                      <Film size={14} />
                      MP4, MOV, WebM (50MB)
                    </span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </div>

              {/* File error */}
              {fileError && (
                <div className="flex items-center gap-2 bg-red-50 text-[#E83331] text-sm px-4 py-3 rounded-xl">
                  <AlertCircle size={16} className="shrink-0" />
                  {fileError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Preview */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative">
                  {mediaType === 'video' ? (
                    <video
                      src={filePreviewUrl || undefined}
                      className="w-full max-h-[400px] object-contain bg-black"
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      src={filePreviewUrl || undefined}
                      alt="Vista previa"
                      className="w-full max-h-[400px] object-contain bg-gray-50"
                    />
                  )}

                  {/* File info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        onClick={clearFile}
                        disabled={uploading}
                        className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw size={14} />
                        Cambiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Post Details */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
                {/* Caption */}
                <div>
                  <label className="block text-sm font-semibold text-[#001113] mb-2">
                    Descripcion
                  </label>
                  <div className="relative">
                    <textarea
                      value={caption}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CAPTION_LENGTH)
                          setCaption(e.target.value);
                      }}
                      placeholder="Cuenta tu experiencia en el Carnaval..."
                      rows={3}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#001113] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E83331]/20 focus:border-[#E83331] resize-none disabled:opacity-50 disabled:bg-gray-50"
                    />
                    <span
                      className={`absolute bottom-3 right-3 text-xs ${
                        caption.length > MAX_CAPTION_LENGTH * 0.9
                          ? 'text-[#E83331]'
                          : 'text-gray-300'
                      }`}
                    >
                      {caption.length}/{MAX_CAPTION_LENGTH}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-[#001113] mb-2">
                    Categoria <span className="text-[#E83331]">*</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      disabled={uploading}
                      className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#E83331]/20 focus:border-[#E83331] disabled:opacity-50 disabled:bg-gray-50"
                    >
                      <span className={category ? 'text-[#001113]' : 'text-gray-300'}>
                        {category || 'Selecciona una categoria'}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${
                          categoryDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {categoryDropdownOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setCategory(cat);
                              setCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                              category === cat
                                ? 'text-[#E83331] font-medium bg-red-50'
                                : 'text-[#001113]'
                            }`}
                          >
                            {cat}
                            {category === cat && (
                              <Check size={16} className="text-[#E83331]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-semibold text-[#001113] mb-2">
                    Visibilidad
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {VISIBILITY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const selected = visibility === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setVisibility(opt.value as 'public' | 'friends' | 'private')
                          }
                          disabled={uploading}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center disabled:opacity-50 ${
                            selected
                              ? 'border-[#E83331] bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon
                            size={20}
                            className={selected ? 'text-[#E83331]' : 'text-gray-400'}
                          />
                          <span
                            className={`text-xs font-medium ${
                              selected ? 'text-[#E83331]' : 'text-gray-500'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-[#001113] mb-2">
                    Ubicacion{' '}
                    <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ej: Via 40, Barranquilla"
                      disabled={uploading}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-[#001113] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E83331]/20 focus:border-[#E83331] disabled:opacity-50 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Upload progress */}
              {uploading && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#001113]">
                      Subiendo publicacion...
                    </span>
                    <span className="text-sm font-semibold text-[#E83331]">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E83331] to-[#FFCE38] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload error */}
              {uploadError && (
                <div className="flex items-start gap-3 bg-red-50 text-[#E83331] text-sm px-4 py-3 rounded-xl">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Error al publicar</p>
                    <p className="text-red-400 mt-0.5">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Publish button */}
              <button
                onClick={handlePublish}
                disabled={!canPublish}
                className="w-full py-3.5 bg-[#E83331] text-white rounded-xl font-semibold text-base hover:bg-[#c92a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar'
                )}
              </button>

              {!category && file && (
                <p className="text-xs text-center text-gray-400">
                  Selecciona una categoria para poder publicar
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
