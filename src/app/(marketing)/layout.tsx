// src/app/(marketing)/layout.tsx
import NavBar from "@/src/components/home/NavBar"; 

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />        {/* Barra de navegación */}
        <main>{children}</main>  {/* Contenido específico de cada página */}
      </body>
    </html>
  );
}
