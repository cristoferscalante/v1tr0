"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function TaskAutomationCarousel() {
  const cards = taskAutomationData.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-10 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4 text-center sm:text-left">
          Automatización de Tareas
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-text-muted mb-6 sm:mb-8 max-w-3xl text-center sm:text-left leading-relaxed">
          Optimizamos tus procesos empresariales mediante la automatización inteligente, 
          liberando tiempo valioso y reduciendo errores humanos para maximizar la eficiencia operativa.
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

const taskAutomationData = [
  {
    category: "RPA Empresarial",
    title: "Automatización de Procesos Robóticos",
    description: "Implementación de bots inteligentes para automatizar tareas repetitivas y procesos de negocio complejos.",
    technologies: ["UiPath", "Power Automate", "Python", "Selenium", "API Integration"],
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Automatización de entrada de datos y procesamiento de documentos",
        "Integración con sistemas ERP, CRM y bases de datos existentes",
        "Monitoreo en tiempo real y reportes de rendimiento",
        "Manejo de excepciones y escalamiento automático",
        "Interface de usuario para configuración sin código"
      ]}
      challenges={[
        "Integración con sistemas legacy sin APIs disponibles",
        "Manejo de interfaces de usuario dinámicas y cambiantes",
        "Escalabilidad para procesar miles de transacciones diarias",
        "Seguridad y cumplimiento en el manejo de datos sensibles"
      ]}
      results={[
        "Reducción del 85% en tiempo de procesamiento manual",
        "Eliminación del 95% de errores humanos en entrada de datos",
        "Ahorro de 40 horas semanales de trabajo repetitivo",
        "ROI del 300% en los primeros 8 meses de implementación"
      ]}
    />,
  },
  {
    category: "Workflows Inteligentes",
    title: "Automatización de Flujos de Trabajo",
    description: "Diseño e implementación de workflows automatizados que conectan múltiples sistemas y aplicaciones empresariales.",
    technologies: ["Microsoft Power Platform", "Zapier", "Node.js", "REST APIs", "Webhooks"],
    src: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Orquestación de procesos entre múltiples aplicaciones",
        "Triggers automáticos basados en eventos y condiciones",
        "Notificaciones y alertas personalizadas",
        "Dashboard de monitoreo y análisis de workflows",
        "Configuración visual drag-and-drop para usuarios finales"
      ]}
      challenges={[
        "Sincronización de datos entre sistemas heterogéneos",
        "Manejo de fallos y recuperación automática de procesos",
        "Optimización de rendimiento en workflows complejos",
        "Versionado y control de cambios en procesos activos"
      ]}
      results={[
        "Reducción del 70% en tiempo de aprobaciones y revisiones",
        "Mejora del 60% en trazabilidad de procesos empresariales",
        "Automatización del 90% de tareas administrativas rutinarias",
        "Incremento del 45% en satisfacción del equipo de trabajo"
      ]}
    />,
  },
  {
    category: "IA y Machine Learning",
    title: "Automatización Inteligente con IA",
    description: "Implementación de soluciones de inteligencia artificial para automatización avanzada y toma de decisiones.",
    technologies: ["TensorFlow", "OpenAI GPT", "Computer Vision", "NLP", "Azure Cognitive Services"],
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Procesamiento automático de documentos con OCR e IA",
        "Clasificación inteligente de emails y tickets de soporte",
        "Chatbots conversacionales para atención al cliente",
        "Análisis predictivo para mantenimiento preventivo",
        "Reconocimiento de patrones para detección de anomalías"
      ]}
      challenges={[
        "Entrenamiento de modelos con datos específicos del negocio",
        "Integración de IA en sistemas existentes sin disrupciones",
        "Explicabilidad y transparencia en decisiones automatizadas",
        "Escalabilidad y optimización de costos en la nube"
      ]}
      results={[
        "Procesamiento automático de 10,000+ documentos mensuales",
        "Reducción del 80% en tiempo de respuesta al cliente",
        "Mejora del 65% en precisión de clasificación de contenido",
        "Prevención del 90% de incidentes mediante análisis predictivo"
      ]}
    />,
  },
  {
    category: "Integración de Sistemas",
    title: "Automatización de Integraciones",
    description: "Conectividad automática entre sistemas empresariales para flujo de datos sin intervención manual.",
    technologies: ["Apache Kafka", "MuleSoft", "REST/GraphQL APIs", "ETL Pipelines", "Message Queues"],
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Sincronización automática de datos entre sistemas",
        "Transformación y mapeo de datos en tiempo real",
        "Monitoreo de salud de integraciones y alertas",
        "Versionado de APIs y gestión de cambios",
        "Balanceador de carga y failover automático"
      ]}
      challenges={[
        "Manejo de diferentes formatos y protocolos de datos",
        "Garantizar consistencia de datos en sistemas distribuidos",
        "Latencia mínima en sincronización de datos críticos",
        "Seguridad end-to-end en transferencia de información"
      ]}
      results={[
        "Sincronización en tiempo real de 1M+ registros diarios",
        "Reducción del 95% en inconsistencias de datos",
        "Eliminación completa de procesos manuales de integración",
        "Mejora del 50% en velocidad de acceso a información"
      ]}
    />,
  },
  {
    category: "Automatización DevOps",
    title: "CI/CD y Deployment Automatizado",
    description: "Automatización completa del ciclo de desarrollo, testing y despliegue de aplicaciones.",
    technologies: ["Jenkins", "GitLab CI/CD", "Docker", "Kubernetes", "Terraform"],
    src: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Pipelines automatizados de integración continua",
        "Testing automatizado y análisis de calidad de código",
        "Despliegue automático en múltiples entornos",
        "Rollback automático en caso de fallos",
        "Monitoreo y alertas de aplicaciones en producción"
      ]}
      challenges={[
        "Configuración de pipelines complejos multi-tecnología",
        "Gestión de secretos y credenciales de forma segura",
        "Optimización de tiempos de build y deployment",
        "Coordinación de deployments en arquitecturas distribuidas"
      ]}
      results={[
        "Reducción del 80% en tiempo de deployment",
        "Incremento del 95% en frecuencia de releases",
        "Disminución del 70% en bugs en producción",
        "Mejora del 60% en tiempo de recuperación ante fallos"
      ]}
    />,
  },
  {
    category: "Automatización Financiera",
    title: "Procesos Financieros Automatizados",
    description: "Automatización de procesos contables, facturación, conciliaciones y reportes financieros.",
    technologies: ["SAP", "QuickBooks API", "Excel VBA", "Power BI", "SQL Server"],
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
    content: <ProjectContent 
      features={[
        "Automatización de facturación y cobranza",
        "Conciliación automática de cuentas bancarias",
        "Generación automática de reportes financieros",
        "Alertas de vencimientos y seguimiento de pagos",
        "Integración con sistemas bancarios y de pago"
      ]}
      challenges={[
        "Cumplimiento de normativas contables y fiscales",
        "Manejo seguro de información financiera sensible",
        "Precisión absoluta en cálculos y conciliaciones",
        "Integración con múltiples entidades bancarias"
      ]}
      results={[
        "Reducción del 90% en tiempo de cierre contable mensual",
        "Eliminación del 100% de errores en conciliaciones",
        "Automatización del 85% de procesos de facturación",
        "Mejora del 75% en tiempo de cobro de facturas"
      ]}
    />,
  },
];

export { taskAutomationData };