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

// Navigation structure
export const NAV_ITEMS = [
  {
    label: 'Somos',
    href: '/somos',
    children: [
      { label: 'La Organizacion', href: '/somos' },
      { label: 'Equipo de trabajo', href: '/somos/equipo' },
      { label: 'Transparencia', href: '/somos/transparencia' },
      { label: 'Proveedores', href: '/somos/proveedores' },
    ],
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
      { label: 'Manual del Carnaval', href: '/tradicion/manual' },
      { label: 'Declaratoria UNESCO', href: '/tradicion/unesco' },
    ],
  },
  {
    label: 'Carnaval 2027',
    href: '/carnaval-2027',
  },
  {
    label: 'Convocatorias',
    href: '/convocatorias',
  },
  {
    label: 'Noticias',
    href: '/noticias',
  },
  {
    label: 'Multimedia',
    href: '/multimedia',
    children: [
      { label: 'Galeria de fotos', href: '/multimedia/fotos' },
      { label: 'Videos', href: '/multimedia/videos' },
      { label: 'Publicaciones', href: '/multimedia/publicaciones' },
      { label: 'Media Kit', href: '/multimedia/media-kit' },
    ],
  },
  {
    label: 'Contacto',
    href: '/contacto',
  },
];

// Sponsors
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

// Quick facts for the site
export const QUICK_FACTS = [
  { number: '1903', label: 'Primera Batalla de Flores' },
  { number: '2003', label: 'Patrimonio UNESCO' },
  { number: '2M+', label: 'Asistentes cada ano' },
  { number: '800+', label: 'Grupos folcloricos' },
  { number: '120+', label: 'Anos de historia' },
  { number: '4', label: 'Dias de fiesta' },
];
