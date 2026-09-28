"use client"

import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import type { servicesData } from "@/components/home/sections/ServicesTabSection"
import { MiniWindow } from "@/components/home/sections/SubcategoryGalleryTile"
import { MOCKS, PageMock } from "@/components/servicios/ProjectMockups"

type Service = (typeof servicesData)[number]

// ============================================================================
// GRILLA
// ============================================================================

type GridItem =
  | { kind: "project"; key: string; subcategory: string; subcategoryId: string; title: string; description: string; image: string; href?: string }
  | { kind: "mockup"; key: string; subcategory: string; subcategoryId: string; description: string }

/** Proyectos reales de cada subcategoría y, donde aún no hay, una maqueta. */
function itemsFor(service: Service): GridItem[] {
  return service.subcategories.flatMap((sub): GridItem[] =>
    sub.examples.length > 0
      ? sub.examples.map((ex) => ({ kind: "project", key: `${sub.id}-${ex.title}`, subcategory: sub.name, subcategoryId: sub.id, ...ex }))
      : [{ kind: "mockup", key: `${sub.id}-mock`, subcategory: sub.name, subcategoryId: sub.id, description: sub.description }],
  )
}

const cardBase =
  "group/proj relative flex h-full flex-col overflow-hidden rounded-2xl border text-left backdrop-blur-sm transition-all duration-300"

function ProjectCard({ item }: { item: Extract<GridItem, { kind: "project" }> }) {
  const body = (
    <>
      <div className="relative aspect-video overflow-hidden p-2 pb-0">
        <div className="relative h-full w-full">
          <MiniWindow>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
              className="object-cover object-top transition-transform duration-500 group-hover/proj:scale-105"
            />
          </MiniWindow>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#26FFDF]/70">{item.subcategory}</span>
        <span className="text-sm font-semibold leading-tight text-[#26FFDF]">{item.title}</span>
        <span className="text-xs leading-snug text-textMuted line-clamp-2">{item.description}</span>
      </div>
    </>
  )

  const className = `${cardBase} bg-[#02505920] border-[#08A696]/20 hover:-translate-y-1 hover:border-[#26FFDF]/60 hover:bg-[#02505950] hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60`

  return item.href ? (
    <Link href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}

function MockupCard({ item }: { item: Extract<GridItem, { kind: "mockup" }> }) {
  const Mock = MOCKS[item.subcategoryId] ?? PageMock
  return (
    <div className={`${cardBase} border-dashed bg-black/20 border-[#26FFDF]/15`}>
      <div className="relative aspect-video overflow-hidden p-2 pb-0">
        <div className="relative h-full w-full">
          <MiniWindow ghost>
            <div className="absolute inset-0 p-2">
              <div className="relative h-full w-full">
                <Mock />
              </div>
            </div>
          </MiniWindow>
        </div>
        <span className="absolute right-3 top-4 rounded-full border border-[#26FFDF]/25 bg-black/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#26FFDF]/80">
          Maqueta
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#26FFDF]/50">Próximamente</span>
        <span className="text-sm font-semibold leading-tight text-[#26FFDF]/80">{item.subcategory}</span>
        <span className="text-xs leading-snug text-textMuted/80 line-clamp-2">{item.description}</span>
      </div>
    </div>
  )
}

/**
 * Proyectos de la categoría activa: los publicados con su captura y, para
 * cada subcategoría que aún no tiene uno, una maqueta que la representa.
 */
export default function ServiceProjectsGrid({ service, subcategoryId = null }: { service: Service; subcategoryId?: string | null }) {
  const items = itemsFor(service).filter((item) => !subcategoryId || item.subcategoryId === subcategoryId)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${service.id}-${subcategoryId ?? "all"}`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
          exit: { opacity: 0, transition: { duration: 0.15 } },
        }}
        // Flex con wrap centrado: la última fila incompleta queda al medio
        className="flex flex-wrap justify-center gap-3 sm:gap-4"
      >
        {items.map((item) => (
          <motion.div
            key={item.key}
            className="w-full sm:w-[calc((100%-1rem)/2)] xl:w-[calc((100%-2rem)/3)]"
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
          >
            {item.kind === "project" ? <ProjectCard item={item} /> : <MockupCard item={item} />}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
