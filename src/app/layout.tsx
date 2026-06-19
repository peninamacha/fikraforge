import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FikraForge Inc. | Premium Prototyping, CNC Milling & Technology Consulting",
  description: "FikraForge is a premier industrial prototyping, software development, and intellectual property consulting lab cell based in East Africa.",
  keywords: ["FikraForge", "industrial prototyping", "CNC design", "software development Tanzania", "patent consulting", "BRELA license", "CAD blueprints", "hardware drafting", "IoT electronics", "smart contracts"],
  authors: [{ name: "FikraForge Inc." }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "FikraForge Inc. | Premium Prototyping, CNC Milling & Software Lab",
    description: "Where ideas meet the forge. Compiling secure full-stack software systems, rapid hardware prototypes, and specialized local IP/BRELA patent filings.",
    type: "website",
    url: "https://fikraforge.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 800,
        alt: "FikraForge Lab",
      }
    ],
    siteName: "FikraForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "FikraForge Inc. | Prototyping & Technology Lab",
    description: "From CAD models to complete digital software casts. We design and deliver real-world hardware & software masterpieces.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FikraForge Inc.",
  "alternateName": "FikraForge",
  "url": "https://fikraforge.com",
  "logo": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80",
  "description": "FikraForge is a premier industrial prototyping, software development, and intellectual property consulting lab cell based in East Africa.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Dar es Salaam, Tanzania",
    "addressLocality": "Dar es Salaam",
    "addressRegion": "Dar es Salaam",
    "addressCountry": "TZ"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "info@fikraforge.com",
    "availableLanguage": ["Swahili", "English"]
  },
  "sameAs": [
    "https://github.com/FIKRAFORGE",
    "https://barakazetu.com",
    "https://jamiispot.com"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#111113" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
