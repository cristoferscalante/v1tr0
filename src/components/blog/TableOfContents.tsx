"use client"

import { useState, useEffect } from "react"
import { File } from "lucide-react"

interface TableOfContentsProps {
  headings: {
    level: number
    text: string
    id: string
  }[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  return (
    <div className="bg-backgroundSecondary rounded-lg shadow-lg overflow-hidden border border-custom-2/20 p-4">
      <div className="flex items-center mb-4">
        <File className="w-4 h-4 mr-2 text-primary" />
        <h3 className="font-bold">Contenido</h3>
      </div>
      <nav>
        <ul className="space-y-2 text-sm">
          {headings.map(({ level, text, id }) => (
            <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
              <a
                href={`#${id}`}
                className={`block hover:text-highlight transition-colors ${
                  activeId === id ? "text-highlight font-semibold" : "text-textMuted"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({
                    behavior: "smooth",
                  })
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

