import type { Metadata } from "next";
import { Alex_Brush, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

/// Script da marca — usada só no logotipo "Sr.Terno" (<Logo />), nunca em
/// texto corrido.
const script = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Sr. Terno — Sistema",
  description: "Gestão de pedidos, clientes e financeiro do Sr. Terno",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
