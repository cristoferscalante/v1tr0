import { Alexandria } from "next/font/google";
import '../styles/globals.css';
import type { Metadata } from 'next';

const alexandria = Alexandria({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-alexandria',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'V1tr0',
  description: 'Desarrollo de software a medida',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={alexandria.variable}>
      <body>        
        {children}
      </body>
    </html>
  );
}
