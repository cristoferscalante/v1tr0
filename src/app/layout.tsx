import type { Metadata } from "next";
import { Alexandria } from '@next/font/google';
import '../styles/globals.css';


const alexandria = Alexandria({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-alexandria',
});

export const metadata = {
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
