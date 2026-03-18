import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const mokoko = localFont({
  src: [
    { path: "../fonts/MokokoBd.otf", weight: "700", style: "normal" },
    { path: "../fonts/MokokoXBd.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-mokoko",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carnavaldebarranquilla.org"),
  title: {
    default: "Carnaval de Barranquilla | Patrimonio Cultural Inmaterial de la Humanidad",
    template: "%s | Carnaval de Barranquilla",
  },
  description:
    "Sitio oficial del Carnaval de Barranquilla, declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO. Descubre la tradicion, los eventos, la programacion y vive la fiesta mas grande de Colombia.",
  keywords: [
    "carnaval de barranquilla",
    "carnaval",
    "barranquilla",
    "patrimonio UNESCO",
    "colombia",
    "fiesta",
    "tradicion",
    "cultura",
    "marimonda",
    "cumbia",
    "congo",
    "garabato",
  ],
  authors: [{ name: "Carnaval de Barranquilla S.A.S." }],
  creator: "Carnaval de Barranquilla S.A.S.",
  publisher: "Carnaval de Barranquilla S.A.S.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://carnavaldebarranquilla.org",
    siteName: "Carnaval de Barranquilla",
    title: "Carnaval de Barranquilla | Patrimonio Cultural Inmaterial de la Humanidad",
    description:
      "Sitio oficial del Carnaval de Barranquilla. Descubre la tradicion, los eventos, la programacion y vive la fiesta mas grande de Colombia.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Carnaval_SA",
    creator: "@Carnaval_SA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "G-W8ZTH70X0S",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${dmSans.variable} ${mokoko.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
