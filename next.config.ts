import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ═══ MAIN PAGES ═══
      { source: '/somos-2', destination: '/somos', permanent: true },
      { source: '/carnaval-de-barranquilla-origen', destination: '/tradicion', permanent: true },
      { source: '/carnaval-de-barranquilla', destination: '/tradicion', permanent: true },
      { source: '/carnaval-de-barranquilla-la-fiesta-sin-fin', destination: '/tradicion', permanent: true },
      { source: '/datos-de-la-empresa', destination: '/somos', permanent: true },
      { source: '/media-kit', destination: '/multimedia', permanent: true },
      { source: '/conectate-con-el-carnaval', destination: '/contacto', permanent: true },
      { source: '/inicio-2', destination: '/', permanent: true },
      { source: '/noticias-4', destination: '/noticias', permanent: true },
      { source: '/convocatorias-old', destination: '/convocatorias', permanent: true },

      // ═══ UNESCO / DECLARATORIAS ═══
      { source: '/declaratoria-nacional', destination: '/tradicion/unesco', permanent: true },
      { source: '/declaratoria-unesco', destination: '/tradicion/unesco', permanent: true },

      // ═══ TRADICION / DANZAS ═══
      { source: '/tradicion-2', destination: '/tradicion', permanent: true },
      { source: '/grupos-folcloricos', destination: '/tradicion/danzas', permanent: true },
      { source: '/danzas', destination: '/tradicion/danzas', permanent: true },
      { source: '/danzas-tradicionales', destination: '/tradicion/danzas', permanent: true },
      { source: '/danzas-relacion', destination: '/tradicion/danzas', permanent: true },
      { source: '/danzas-especiales', destination: '/tradicion/danzas', permanent: true },
      { source: '/comparsas', destination: '/tradicion/danzas', permanent: true },
      { source: '/disfraces', destination: '/tradicion/danzas', permanent: true },
      { source: '/comedias', destination: '/tradicion/danzas', permanent: true },
      { source: '/letanias', destination: '/tradicion/danzas', permanent: true },

      // ═══ LIDERES DE LA TRADICION ═══
      { source: '/lideres-de-la-tradicion', destination: '/tradicion/lideres', permanent: true },
      { source: '/lideres-de-la-tradicion/:slug', destination: '/tradicion/lideres', permanent: true },

      // ═══ CONGO DE ORO ═══
      { source: '/tradicion/congo-de-oro', destination: '/tradicion/congo-de-oro', permanent: true },
      { source: '/tradicion/congo-de-oro/:slug', destination: '/tradicion/congo-de-oro', permanent: true },
      { source: '/ganadores-congo-de-oro-del-carnaval-2017', destination: '/tradicion/congo-de-oro', permanent: true },

      // ═══ PROVEEDORES ═══
      { source: '/relacion-con-los-proveedores', destination: '/somos/proveedores', permanent: true },
      { source: '/relacion-con-los-proveedores-2', destination: '/somos/proveedores', permanent: true },
      { source: '/relacion-con-los-proveedores-2-2', destination: '/somos/proveedores', permanent: true },

      // ═══ CARNAVAL YEAR PAGES ═══
      { source: '/carnaval-de-barranquilla-2019', destination: '/carnaval-2027', permanent: true },
      { source: '/carnaval-2023', destination: '/carnaval-2027', permanent: true },
      { source: '/carnaval-2024', destination: '/carnaval-2027', permanent: true },
      { source: '/carnaval-2025', destination: '/carnaval-2027', permanent: true },
      { source: '/carnaval-de-barranquilla-2026', destination: '/carnaval-2027', permanent: true },
      { source: '/festival-de-orquesta-2026', destination: '/carnaval-2027', permanent: true },
      { source: '/manual-del-carnaval-de-barranquilla-2024', destination: '/carnaval-2027', permanent: true },
      { source: '/reyes-del-carnaval-2023', destination: '/carnaval-2027', permanent: true },
      { source: '/reinado-popular-2017', destination: '/carnaval-2027', permanent: true },
      { source: '/reinado-popular-2018', destination: '/carnaval-2027', permanent: true },
      { source: '/carnaval-de-verano-mar-y-rio', destination: '/comunidad/calendario', permanent: true },
      { source: '/la-reina-del-carnaval-y-su-designacion', destination: '/tradicion', permanent: true },
      { source: '/el-viaje-del-carnaval', destination: '/tradicion', permanent: true },
      { source: '/festival-de-orquestas', destination: '/carnaval-2027', permanent: true },

      // ═══ PUBLICATIONS ═══
      { source: '/repositorio-de-publicaciones', destination: '/multimedia', permanent: true },
      { source: '/publicaciones', destination: '/multimedia', permanent: true },
      { source: '/revista-carnaval-2019', destination: '/multimedia', permanent: true },

      // ═══ LEGAL ═══
      { source: '/politica-de-tratamiento-de-proteccion-de-datos-personales', destination: '/contacto', permanent: true },

      // ═══ WORDPRESS CATEGORY ARCHIVES → Noticias ═══
      { source: '/category/:slug', destination: '/noticias', permanent: true },

      // ═══ WORDPRESS TAG ARCHIVES → Noticias ═══
      { source: '/tag/:slug', destination: '/noticias', permanent: true },

      // ═══ WORDPRESS AUTHOR ARCHIVES → Somos ═══
      { source: '/author/:slug', destination: '/somos', permanent: true },

      // ═══ WORDPRESS HISTORICAL YEAR PAGES ═══
      { source: '/1888', destination: '/tradicion', permanent: true },
      { source: '/1899', destination: '/tradicion', permanent: true },
      { source: '/1903', destination: '/tradicion', permanent: true },
      { source: '/1918', destination: '/tradicion', permanent: true },
      { source: '/1923', destination: '/tradicion', permanent: true },
      { source: '/1967', destination: '/tradicion', permanent: true },
      { source: '/1974', destination: '/tradicion', permanent: true },
      { source: '/1995', destination: '/tradicion', permanent: true },
      { source: '/2000', destination: '/tradicion', permanent: true },
      { source: '/2002', destination: '/tradicion', permanent: true },
      { source: '/2003', destination: '/tradicion/unesco', permanent: true },

      // ═══ WORDPRESS EVENT GALLERIES → Multimedia ═══
      { source: '/batalla-de-flores-:year', destination: '/multimedia', permanent: true },
      { source: '/gran-parada-de-tradicion-:year', destination: '/multimedia', permanent: true },
      { source: '/gran-parada-de-comparsas-:year', destination: '/multimedia', permanent: true },
      { source: '/festival-de-orquestas-:year', destination: '/multimedia', permanent: true },

      // ═══ WORDPRESS PAGE SUFFIXES (trailing slashes) ═══
      { source: '/contacto/', destination: '/contacto', permanent: true },
      { source: '/convocatorias/', destination: '/convocatorias', permanent: true },
      { source: '/multimedia/', destination: '/multimedia', permanent: true },
      { source: '/tradicion/', destination: '/tradicion', permanent: true },

      // ═══ WORDPRESS FEED/XML CLEANUP ═══
      { source: '/feed', destination: '/', permanent: true },
      { source: '/feed/:path*', destination: '/', permanent: true },
      { source: '/wp-json/:path*', destination: '/', permanent: true },
      { source: '/wp-admin', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/wp-content/:path*', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
