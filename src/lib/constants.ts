// ── Site-wide constants ──

export const SITE_NAME = 'Carnaval de Barranquilla';
export const SITE_URL = 'https://carnavaldebarranquilla.org';
export const SITE_TAGLINE = 'Patrimonio Cultural Inmaterial de la Humanidad';

// Organization
export const ORG_NAME = 'Carnaval de Barranquilla S.A.S.';
export const ORG_NIT = '800.151.710-0';
export const ORG_ADDRESS = 'Cra 54 No. 49B-39, Casa del Carnaval, Barranquilla, Colombia';
export const ORG_PHONE = '(605) 319 76 16';
export const ORG_EMAIL = 'comunicaciones@carnavaldebarranquilla.org';

// Social media
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/carnavalbaq/',
  facebook: 'https://www.facebook.com/carnavalbaq/',
  twitter: 'https://twitter.com/Carnaval_SA',
  youtube: 'https://www.youtube.com/channel/UC0_TnRxOqDR74NK70Dzixcg',
  tiktok: 'https://www.tiktok.com/@carnavalbaq',
  spotify: 'https://open.spotify.com/playlist/carnavalbaq',
};

// Carnival dates (Carnaval 2027: Feb 6-9)
export const NEXT_CARNIVAL = {
  year: 2027,
  startDate: new Date('2027-02-06T00:00:00-05:00'),
  endDate: new Date('2027-02-09T23:59:59-05:00'),
  theme: 'Quien lo vive es quien lo goza',
  events: [
    { date: 'Sabado 6 Feb', name: 'Batalla de Flores', icon: '🌺' },
    { date: 'Domingo 7 Feb', name: 'Gran Parada de Tradicion', icon: '🎭' },
    { date: 'Lunes 8 Feb', name: 'Gran Parada de Comparsas', icon: '💃' },
    { date: 'Martes 9 Feb', name: 'Festival de Orquestas', icon: '🎵' },
  ],
};

// ═══ NEW NAVIGATION STRUCTURE ═══
export const NAV_ITEMS = [
  {
    label: 'Carnaval 2027',
    href: '/carnaval-2027',
  },
  {
    label: 'Tradicion',
    href: '/tradicion',
    children: [
      { label: 'Historia y origen', href: '/tradicion' },
      { label: 'Danzas', href: '/tradicion/danzas' },
      { label: 'Comparsas', href: '/tradicion/comparsas' },
      { label: 'Disfraces', href: '/tradicion/disfraces' },
      { label: 'Comedias y Letanias', href: '/tradicion/comedias-letanias' },
      { label: 'Lideres de la Tradicion', href: '/tradicion/lideres' },
      { label: 'Congo de Oro', href: '/tradicion/congo-de-oro' },
      { label: 'Declaratoria UNESCO', href: '/tradicion/unesco' },
    ],
  },
  {
    label: 'Noticias',
    href: '/noticias',
  },
  {
    label: 'En Vivo',
    href: '/en-vivo',
    children: [
      { label: 'Livestream', href: '/en-vivo' },
      { label: 'Podcast Carnaval', href: '/en-vivo/podcast' },
      { label: 'Playlist oficial', href: '/en-vivo/playlist' },
      { label: 'Mapa interactivo', href: '/en-vivo/mapa' },
    ],
  },
  {
    label: 'Comunidad',
    href: '/comunidad',
    children: [
      { label: 'Galeria comunitaria', href: '/comunidad/galeria' },
      { label: 'Academia del Carnaval', href: '/comunidad/academia' },
      { label: 'Calendario 365', href: '/comunidad/calendario' },
      { label: 'Convocatorias', href: '/convocatorias' },
    ],
  },
  {
    label: 'Somos',
    href: '/somos',
    children: [
      { label: 'La Organizacion', href: '/somos' },
      { label: 'Equipo de trabajo', href: '/somos/equipo' },
      { label: 'Transparencia', href: '/somos/transparencia' },
      { label: 'Proveedores', href: '/somos/proveedores' },
      { label: 'Multimedia', href: '/multimedia' },
      { label: 'Contacto', href: '/contacto' },
    ],
  },
];

// Sponsors (will be replaced with real logos later)
export const SPONSORS = [
  { name: 'UNESCO', tier: 'institutional' },
  { name: 'Ministerio de Cultura', tier: 'institutional' },
  { name: 'Alcaldia de Barranquilla', tier: 'institutional' },
  { name: 'El Heraldo', tier: 'gold' },
  { name: 'Coca-Cola', tier: 'gold' },
  { name: 'Olimpica', tier: 'gold' },
  { name: 'JetSmart', tier: 'gold' },
  { name: 'Aguardiente Antioqueno', tier: 'gold' },
  { name: 'Old Parr', tier: 'silver' },
  { name: 'Triple A', tier: 'silver' },
  { name: 'Lean Solutions', tier: 'silver' },
  { name: 'Electrolife', tier: 'silver' },
  { name: 'Pony', tier: 'silver' },
];

// Quick facts (reduced to 4)
export const QUICK_FACTS = [
  { number: '120+', label: 'Anos de historia' },
  { number: '2003', label: 'Patrimonio UNESCO' },
  { number: '2M+', label: 'Asistentes cada ano' },
  { number: '800+', label: 'Grupos folcloricos' },
];

// Barranquilla tourist landmarks for interactive map
export const LANDMARKS = [
  { name: 'Museo del Carnaval', type: 'cultura', lat: 10.9878, lng: -74.7889 },
  { name: 'Casa del Carnaval', type: 'carnaval', lat: 10.9885, lng: -74.7895 },
  { name: 'Barrio Abajo', type: 'cultura', lat: 10.9920, lng: -74.7850 },
  { name: 'Aleta del Tiburon', type: 'turistico', lat: 10.9960, lng: -74.7820 },
  { name: 'Ventana del Mundo', type: 'turistico', lat: 10.9940, lng: -74.7835 },
  { name: 'Rueda de la Luna', type: 'turistico', lat: 10.9935, lng: -74.7830 },
  { name: 'Gran Malecon del Rio', type: 'turistico', lat: 10.9950, lng: -74.7810 },
  { name: 'Via 40', type: 'desfile', lat: 10.9900, lng: -74.7860 },
];
