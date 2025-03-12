"use client"

import React, { useState, useEffect, useTransition, ReactNode } from "react"
import { FileText, ChevronDown } from "lucide-react"

interface TableOfContentsProps {
  headings: {
    level: number
    text: string
    id: string
  }[]
  children?: ReactNode
}

export default function TableOfContents({ headings, children }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startTransition(() => {
              setActiveId(entry.target.id)
            })
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

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="bg-backgroundSecondary rounded-xl shadow-md overflow-hidden border border-custom-2/20 transition-all duration-300 hover:shadow-lg">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full p-4 font-medium text-highlight bg-custom-1/30"
      >
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-2 text-primary" />
          <h3 className="font-bold">Contenido</h3>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "max-h-0" : "max-h-[500px]"}`}
      >
        <nav className="p-4">
          <ul className="space-y-2 text-sm">
            {headings.map(({ level, text, id }) => (
              <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }} className="transition-all duration-300">
                <a
                  href={`#${id}`}
                  className={`block py-1 border-l-2 pl-3 hover:text-highlight transition-all duration-300 ${
                    activeId === id
                      ? "border-highlight text-highlight font-medium"
                      : "border-transparent text-textMuted hover:border-custom-2/50"
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
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    </div>
  )
}

