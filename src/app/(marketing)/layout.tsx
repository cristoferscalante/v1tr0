// src/app/(marketing)/layout.tsx
import ModernFooter from "@/src/components/global/ModernFooter";
import NavBar from "@/src/components/global/NavBar"; 

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <NavBar />        {/* Barra de navegación */}
        <main>{children}</main>  {/* Contenido específico de cada página */}
        <ModernFooter />    {/* Pie de página */}
      </body>
    </html>
  );
}
