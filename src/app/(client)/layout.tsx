import Link from "next/link"; 

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white">
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/login">Iniciar Sesión</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/dashboard/projects">Proyectos</Link>
                </li>
                <li>
                  <Link href="/dashboard/profile">Perfil</Link>
                </li>
                <li>
                  <Link href="/chat">Chat IA</Link>
                </li>
              </ul>
            </nav>
          </aside>
          {/* Contenido principal */}
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
