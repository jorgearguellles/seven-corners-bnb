import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seven Corners BnB - Sistema de Reservas',
  description: 'Sistema de reservas de hospedaje moderno y fácil de usar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
