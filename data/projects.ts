// Tipos de datos para proyectos
export interface Project {
  id: number
  title: string
  description: string
  category: string
  subcategory: string
  technologies: string[]
  image?: string
  video?: string
  liveUrl?: string
  githubUrl?: string
  year: string
  featured?: boolean
  bgColor?: string
}

// Categorías principales basadas en servicios de V1TR0
export const projectCategories = {
  desarrollo: {
    name: "Desarrollo de Software",
    subcategories: [
      "E-commerce",
      "Landing Pages",
      "Aplicaciones Web",
      "Portafolios",
      "Demos"
    ]
  },
  sistemas: {
    name: "Sistemas de Información",
    subcategories: [
      "Dashboards & Analytics",
      "Gestión Empresarial",
      "Sistemas Educativos",
      "Recursos Humanos",
      "Visualización de Datos"
    ]
  },
  automatizacion: {
    name: "Automatización de Tareas",
    subcategories: [
      "Bots & Agentes IA",
      "Workflows Automatizados",
      "Integraciones de Sistemas",
      "Herramientas de Productividad"
    ]
  }
}

// Proyectos reales de V1TR0 extraídos de las páginas de servicios
export const projectsData: Project[] = [
  // ===== DESARROLLO DE SOFTWARE =====
  {
    id: 1,
    title: "Pet Gourmet - E-commerce",
    description: "Plataforma de comercio electrónico para productos de mascotas con carrito de compras, gestión de inventario y pagos en línea",
    category: "Desarrollo de Software",
    subcategory: "E-commerce",
    technologies: ["Next.js", "E-commerce", "Stripe", "PostgreSQL"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/pet-gourmet.mp4",
    liveUrl: "https://petgourmet.mx/",
    bgColor: "#1E1E1E",
    year: "2024",
    featured: true
  },
  {
    id: 2,
    title: "Sulkar SAS - Landing Page",
    description: "Landing page corporativa moderna con diseño responsivo y optimización para conversión",
    category: "Desarrollo de Software",
    subcategory: "Landing Pages",
    technologies: ["Next.js", "Tailwind", "Framer Motion", "SEO"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/sulkar.mp4",
    liveUrl: "https://www.sulkarsas.com/",
    bgColor: "#1E1E1E",
    year: "2024",
    featured: true
  },
  {
    id: 3,
    title: "Edux - Academia Web",
    description: "Plataforma educativa completa con cursos, gestión de estudiantes y sistema de evaluación",
    category: "Desarrollo de Software",
    subcategory: "Aplicaciones Web",
    technologies: ["React", "LMS", "Video", "PostgreSQL"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/edux.mp4",
    liveUrl: "https://edux.com.co/",
    bgColor: "#1E1E1E",
    year: "2024",
    featured: true
  },
  {
    id: 4,
    title: "Tecnocrypter - Portafolio Web",
    description: "Portfolio profesional con galería de proyectos, blog integrado y diseño moderno",
    category: "Desarrollo de Software",
    subcategory: "Portafolios",
    technologies: ["Next.js", "MDX", "Three.js", "TypeScript"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/tecnocrypter.mp4",
    liveUrl: "https://tecnocrypter.com/",
    bgColor: "#1E1E1E",
    year: "2024"
  },
  {
    id: 5,
    title: "BeaconHelp - Demo",
    description: "Aplicación demo de sistema de ayuda y soporte con chat en tiempo real",
    category: "Desarrollo de Software",
    subcategory: "Demos",
    technologies: ["React", "WebSocket", "Firebase", "TypeScript"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/beaconhelp.mp4",
    liveUrl: "https://beaconhelp.netlify.app/",
    bgColor: "#1E1E1E",
    year: "2023"
  },

  // ===== SISTEMAS DE INFORMACIÓN =====
  {
    id: 6,
    title: "Sistema de Control Contractual",
    description: "Sistema de gestión contractual para instituciones educativas con seguimiento de documentos y reportes",
    category: "Sistemas de Información",
    subcategory: "Sistemas Educativos",
    technologies: ["Next.js", "PostgreSQL", "PDF.js", "Auth"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/sistema-educacion.mp4",
    liveUrl: "https://sgc.edux.com.co/",
    bgColor: "#1E1E1E",
    year: "2024",
    featured: true
  },
  {
    id: 7,
    title: "Dashboard de Análisis de Datos",
    description: "Panel de control con visualizaciones interactivas, métricas en tiempo real y análisis predictivo",
    category: "Sistemas de Información",
    subcategory: "Dashboards & Analytics",
    technologies: ["React", "D3.js", "Chart.js", "Analytics"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/dash-demo-vitro.mp4",
    liveUrl: "https://dashboard-five-green.vercel.app/",
    bgColor: "#06414D",
    year: "2024",
    featured: true
  },
  {
    id: 8,
    title: "Presidents Timeline - Línea de Tiempo",
    description: "Visualización temporal interactiva de datos históricos con navegación cronológica",
    category: "Sistemas de Información",
    subcategory: "Visualización de Datos",
    technologies: ["Next.js", "Timeline", "D3.js", "Animation"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/presidents.mp4",
    liveUrl: "https://presidents-timeline.vercel.app/",
    bgColor: "#2D3748",
    year: "2024"
  },
  {
    id: 9,
    title: "SGTH - Sistema de Recursos Humanos",
    description: "Sistema completo de gestión de talento humano con nómina, permisos y evaluaciones",
    category: "Sistemas de Información",
    subcategory: "Recursos Humanos",
    technologies: ["Next.js", "PostgreSQL", "HRMS", "Reports"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/sgth.mp4",
    liveUrl: "https://sgth.com.co/",
    bgColor: "#4A5568",
    year: "2024",
    featured: true
  },

  // ===== AUTOMATIZACIÓN DE TAREAS =====
  {
    id: 10,
    title: "Sistema de Automatización V1TR0",
    description: "Plataforma de automatización de procesos empresariales con workflows personalizables y bots inteligentes",
    category: "Automatización de Tareas",
    subcategory: "Workflows Automatizados",
    technologies: ["Node.js", "AI", "Webhooks", "APIs"],
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/21.mp4",
    liveUrl: "https://v1tr0.com",
    bgColor: "#1E1E1E",
    year: "2024",
    featured: true
  },

  // Proyectos adicionales para completar el banco
  {
    id: 11,
    title: "E-commerce V1TR0 Store",
    description: "Tienda online de V1TR0 con gestión de productos, carrito y checkout completo",
    category: "Desarrollo de Software",
    subcategory: "E-commerce",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    image: "/imagenes/home/negocios/e-comerce.webp",
    liveUrl: "https://v1tr0.com/tienda",
    year: "2024"
  },
  {
    id: 12,
    title: "V1TR0 Landing Page",
    description: "Landing page principal de V1TR0 con animaciones GSAP y diseño premium",
    category: "Desarrollo de Software",
    subcategory: "Landing Pages",
    technologies: ["Next.js", "GSAP", "Framer Motion", "Three.js"],
    image: "/imagenes/home/negocios/landing.webp",
    liveUrl: "https://v1tr0.com",
    year: "2024"
  },
  {
    id: 13,
    title: "V1TR0 Portfolio",
    description: "Portfolio corporativo mostrando proyectos y servicios de V1TR0",
    category: "Desarrollo de Software",
    subcategory: "Portafolios",
    technologies: ["React", "TypeScript", "Animation", "Design"],
    image: "/imagenes/home/negocios/portafolio.webp",
    liveUrl: "https://v1tr0.com/about",
    year: "2024"
  },
  {
    id: 14,
    title: "Plataforma Personalizada V1TR0",
    description: "Solución web a medida con arquitectura escalable y features personalizadas",
    category: "Desarrollo de Software",
    subcategory: "Aplicaciones Web",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Docker"],
    image: "/imagenes/home/negocios/personalizada.webp",
    year: "2024"
  },
  {
    id: 15,
    title: "Sistema de Gestión Empresarial",
    description: "ERP personalizado para gestión integral de recursos empresariales",
    category: "Sistemas de Información",
    subcategory: "Gestión Empresarial",
    technologies: ["Next.js", "PostgreSQL", "Redis", "Reports"],
    image: "/imagenes/home/project/gestion-empresarial.png",
    year: "2024"
  },
  {
    id: 16,
    title: "Plataforma de Análisis",
    description: "Sistema de análisis y visualización de grandes volúmenes de datos",
    category: "Sistemas de Información",
    subcategory: "Dashboards & Analytics",
    technologies: ["Python", "React", "D3.js", "AI/ML"],
    image: "/imagenes/home/project/plataforma.png",
    year: "2023"
  },
  {
    id: 17,
    title: "Generador de QR Automático",
    description: "Sistema automatizado de generación y gestión de códigos QR",
    category: "Automatización de Tareas",
    subcategory: "Herramientas de Productividad",
    technologies: ["React", "QR API", "Node.js", "Automation"],
    image: "/imagenes/home/project/generador-qr.png",
    year: "2024"
  },
  {
    id: 18,
    title: "Bot de Atención al Cliente",
    description: "Chatbot inteligente con IA para atención automatizada 24/7",
    category: "Automatización de Tareas",
    subcategory: "Bots & Agentes IA",
    technologies: ["OpenAI", "Node.js", "WebSocket", "NLP"],
    image: "/imagenes/home/negocios/personalizada.webp",
    year: "2024"
  }
]

// Función helper para obtener proyectos por categoría
export const getProjectsByCategory = (category: string) => {
  if (category === "Todas") {
    return projectsData
  }
  return projectsData.filter(project => project.category === category)
}

// Función helper para obtener proyectos destacados
export const getFeaturedProjects = () => {
  return projectsData.filter(project => project.featured)
}

// Función helper para obtener proyectos por subcategoría
export const getProjectsBySubcategory = (subcategory: string) => {
  return projectsData.filter(project => project.subcategory === subcategory)
}

// Función helper para obtener proyectos con video
export const getProjectsWithVideo = () => {
  return projectsData.filter(project => project.video)
}
