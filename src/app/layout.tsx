import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sr. Terno — Sistema",
  description: "Gestão de pedidos, clientes e financeiro do Sr. Terno",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
