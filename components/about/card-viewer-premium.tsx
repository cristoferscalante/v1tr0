"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"

interface CardViewerPremiumProps {
  frontImage: string
  backImage: string
}

export default function CardViewerPremium({ frontImage, backImage }: CardViewerPremiumProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  const cardThickness = 4
  const edgeColor = "#002233"
  const highlightColor = "rgba(0, 255, 204, 0.3)"

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-0">
      <div
        className="relative w-full h-full max-w-[280px] xs:max-w-[300px] max-h-[420px] xs:max-h-[450px] sm:max-h-[500px] md:max-h-[580px] mx-auto cursor-pointer"
        onClick={toggleFlip}
        style={{
          perspective: "1500px",
        }}
      >
        <div
          className="w-full h-full transition-transform duration-700 ease-out relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Capa base para toda la tarjeta */}
          <div
            className="absolute inset-0"
            style={{
              background: edgeColor,
              borderRadius: "16px",
              transform: "translateZ(0)",
            }}
          />

          {/* Front */}
          <div
            className="absolute w-full h-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: `translateZ(${cardThickness / 2}px)`,
              borderRadius: "16px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#001219] to-[#005f73] opacity-20" />

            <Image
              src={frontImage || "/imagenes/icons/svg/placeholder.svg"}
              alt="Card front"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
              style={{
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "16px",
                border: `1px solid ${highlightColor}`,
                boxShadow: "inset 0 0 10px rgba(0, 255, 204, 0.1)",
              }}
            />
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: `rotateY(180deg) translateZ(${cardThickness / 2}px)`,
              borderRadius: "16px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#001219] to-[#005f73] opacity-20" />

            <Image
              src={backImage || "/imagenes/icons/svg/placeholder.svg"}
              alt="Card back"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
              style={{
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "16px",
                border: `1px solid ${highlightColor}`,
                boxShadow: "inset 0 0 10px rgba(0, 255, 204, 0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

