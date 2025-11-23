import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. IMPORTAR EL TOASTER
import { Toaster } from 'sonner'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conferencia Fe y Comunidad",
  description: "Landing page del evento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        {/* 2. AGREGAR EL COMPONENTE AQUÍ AL FINAL */}
        {/* richColors hace que el éxito sea verde y el error rojo automáticamente */}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}