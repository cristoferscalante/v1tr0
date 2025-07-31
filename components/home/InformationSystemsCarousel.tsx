"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function InformationSystemsCarousel() {
  const cards = informationSystemsData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-10 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4 text-center sm:text-left">
          Sistemas de Información
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-text-muted mb-6 sm:mb-8 max-w-3xl text-center sm:text-left leading-relaxed">
          Desarrollamos soluciones integrales de sistemas de información que optimizan 
          los procesos empresariales y mejoran la toma de decisiones estratégicas.
        </p>
      </div>
      <Carousel items={cards} />
    </div>
  );
}

const ProjectContent = ({ features, challenges, results }: {
  features: string[];
  challenges: string[];
  results: string[];
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-custom-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Características del Sistema</h3>
        <ul className="space-y-2 sm:space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base text-text-primary leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-custom-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Desafíos Resueltos</h3>
        <ul className="space-y-2 sm:space-y-3">
          {challenges.map((challenge, index) => (
            <li key={index} className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base text-text-primary leading-relaxed">{challenge}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-custom-1 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 sm:mb-4">Resultados Obtenidos</h3>
        <ul className="space-y-2 sm:space-y-3">
          {results.map((result, index) => (
            <li key={index} className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-highlight rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
              <span className="text-sm sm:text-base text-text-primary leading-relaxed">{result}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 sm:pt-6">
        <button className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium text-sm sm:text-base">
          Ver Demo en Vivo
        </button>
        <button className="px-4 sm:px-6 py-2 sm:py-3 border border-primary text-primary rounded-lg hover:bg-custom-1 transition-colors font-medium text-sm sm:text-base">
          Documentación Técnica
        </button>
      </div>
    </div>
  );
};

const informationSystemsData = [
  {
    category: "ERP Empresarial",
    title: "Sistema de Gestión Integral",
    description: "Plataforma ERP completa para la gestión de recursos empresariales, inventarios, finanzas y recursos humanos.",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Gestión completa de inventarios en tiempo real",
        "Módulo financiero con reportes automatizados",
        "Sistema de recursos humanos integrado",
        "Dashboard ejecutivo con métricas clave",
        "API REST para integraciones externas"
      ]}
      challenges={[
        "Migración de sistemas legacy sin interrumpir operaciones",
        "Integración con múltiples fuentes de datos existentes",
        "Escalabilidad para soportar crecimiento empresarial",
        "Seguridad robusta para datos sensibles"
      ]}
      results={[
        "Reducción del 60% en tiempo de procesamiento de órdenes",
        "Mejora del 40% en precisión de inventarios",
        "Automatización del 80% de reportes financieros",
        "ROI del 250% en el primer año de implementación"
      ]}
    />,
  },
  {
    category: "Sistema de Salud",
    title: "Plataforma de Gestión Hospitalaria",
    description: "Sistema integral para hospitales que gestiona pacientes, citas médicas, historiales clínicos y facturación.",
    technologies: ["Vue.js", "Python", "Django", "MySQL", "Redis"],
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Gestión completa de pacientes y citas médicas",
        "Historiales clínicos electrónicos seguros",
        "Sistema de facturación y seguros médicos",
        "Módulo de farmacia y control de medicamentos",
        "Reportes médicos y estadísticas en tiempo real"
      ]}
      challenges={[
        "Cumplimiento estricto de normativas de privacidad médica",
        "Integración con equipos médicos existentes",
        "Alta disponibilidad 24/7 para emergencias",
        "Sincronización entre múltiples sedes hospitalarias"
      ]}
      results={[
        "Reducción del 50% en tiempo de espera de pacientes",
        "Mejora del 70% en precisión de historiales médicos",
        "Automatización del 90% de procesos administrativos",
        "Incremento del 35% en satisfacción del paciente"
      ]}
    />,
  },
  {
    category: "E-Learning",
    title: "Plataforma Educativa Virtual",
    description: "Sistema de gestión de aprendizaje (LMS) para instituciones educativas con herramientas avanzadas de enseñanza.",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "WebRTC"],
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Aulas virtuales con videoconferencias integradas",
        "Sistema de evaluaciones y calificaciones automatizado",
        "Biblioteca digital con gestión de contenidos",
        "Foros de discusión y mensajería interna",
        "Análitics detallado del progreso estudiantil"
      ]}
      challenges={[
        "Soporte para miles de usuarios concurrentes",
        "Calidad de video estable en conexiones limitadas",
        "Prevención de plagio en evaluaciones online",
        "Accesibilidad para estudiantes con discapacidades"
      ]}
      results={[
        "Incremento del 85% en participación estudiantil",
        "Reducción del 45% en costos administrativos",
        "Mejora del 60% en retención de estudiantes",
        "Expansión a 15 países en América Latina"
      ]}
    />,
  },
  {
    category: "Fintech",
    title: "Sistema de Pagos Digitales",
    description: "Plataforma segura para procesamiento de pagos digitales con integración bancaria y billeteras virtuales.",
    technologies: ["Angular", "Java", "Spring Boot", "MongoDB", "Blockchain"],
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Procesamiento de pagos en tiempo real",
        "Integración con múltiples bancos y PSP",
        "Billetera virtual con QR y NFC",
        "Sistema antifraude con IA integrada",
        "API para comercios electrónicos"
      ]}
      challenges={[
        "Cumplimiento de normativas PCI DSS",
        "Latencia ultra-baja en transacciones",
        "Detección avanzada de fraudes en tiempo real",
        "Escalabilidad para millones de transacciones diarias"
      ]}
      results={[
        "Procesamiento de 2M+ transacciones diarias",
        "Reducción del 95% en fraudes detectados",
        "Tiempo de respuesta promedio de 150ms",
        "Adopción por 500+ comercios en 6 meses"
      ]}
    />,
  },
  {
    category: "IoT Industrial",
    title: "Sistema de Monitoreo Industrial",
    description: "Plataforma IoT para monitoreo y control de procesos industriales con análisis predictivo y alertas en tiempo real.",
    technologies: ["React", "Node.js", "InfluxDB", "Grafana", "MQTT"],
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Monitoreo en tiempo real de sensores IoT",
        "Dashboards personalizables con métricas clave",
        "Análisis predictivo para mantenimiento preventivo",
        "Sistema de alertas automatizado",
        "Integración con sistemas SCADA existentes"
      ]}
      challenges={[
        "Procesamiento de millones de datos por segundo",
        "Conectividad en entornos industriales adversos",
        "Precisión en predicciones de mantenimiento",
        "Seguridad en redes industriales críticas"
      ]}
      results={[
        "Reducción del 40% en tiempo de inactividad",
        "Mejora del 35% en eficiencia energética",
        "Prevención del 80% de fallas críticas",
        "ROI del 180% en mantenimiento predictivo"
      ]}
    />,
  },
  {
    category: "Logística",
    title: "Sistema de Gestión Logística",
    description: "Plataforma integral para optimización de cadenas de suministro, seguimiento de envíos y gestión de almacenes.",
    technologies: ["Vue.js", "PHP", "Laravel", "MariaDB", "GPS API"],
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Optimización de rutas con algoritmos avanzados",
        "Seguimiento GPS en tiempo real de vehículos",
        "Gestión automatizada de inventarios",
        "Sistema de códigos QR y RFID",
        "Predicción de demanda con machine learning"
      ]}
      challenges={[
        "Optimización en tiempo real de miles de rutas",
        "Integración con sistemas de terceros (transportistas)",
        "Precisión en predicciones de inventario",
        "Escalabilidad para operaciones multinacionales"
      ]}
      results={[
        "Reducción del 30% en costos de transporte",
        "Mejora del 50% en tiempos de entrega",
        "Optimización del 25% en uso de combustible",
        "Incremento del 40% en satisfacción del cliente"
      ]}
    />,
  },
];

export { informationSystemsData };
