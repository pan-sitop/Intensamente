import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abre esto cuando... ✨",
  description: "Un regalo especial con sobres virtuales para cada emoción. Un abrazo al alma.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✨</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
