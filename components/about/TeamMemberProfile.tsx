"use client"

import React from "react"
import { useTheme } from "@/components/theme-provider"
import CardViewerPremium from "./card-viewer-premium"

interface TeamMemberProfileProps {
  name: string
  role: string
  image: string
  biography: string
  specialties: string[]
  github?: string
  linkedin?: string
  isMobile: boolean
  animationDelay?: string
}

const TeamMemberProfile = ({
  name,
  role,
  image,
  biography,
  specialties,
  github,
  linkedin,
  isMobile,
  animationDelay = "0s"
}: TeamMemberProfileProps) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const cardBase = "backdrop-blur-sm border rounded-xl shadow-lg transition-all duration-300"
  const cardBorder = isDark ? "border-[#08A696]/30" : "border-[#08A696]/60"
  const cardTheme = isDark ? "bg-[#02505931]" : "bg-white/90"

  const socialButtonBase = "flex items-center justify-center w-12 h-12 backdrop-blur-sm border rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
  const socialButtonBorder = isDark ? "border-[#08A696]/30" : "border-[#08A696]/60"
  const socialButtonTheme = isDark
    ? "bg-[#02505931] text-[#26FFDF] hover:bg-[#08A696]/20 hover:border-[#08A696]"
    : "bg-white/90 text-[#08A696] hover:bg-[#08A696]/10 hover:border-[#08A696]"

  return (
    <div className={`flex items-start justify-center ${isMobile ? 'flex-col gap-6' : 'gap-8'} w-full px-4 sm:px-0`}>
      {/* Card Section with Levitation Effect */}
      <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
        <div 
          className={`flex-shrink-0 transition-transform duration-700 w-full ${
            isMobile ? 'max-w-[280px] xs:max-w-[300px]' : 'max-w-[300px] md:max-w-[350px] lg:w-[420px]'
          }`}
          style={{
            animation: 'levitate 3s ease-in-out infinite',
            animationDelay: animationDelay
          }}
        >
          <div className={`w-full ${
            isMobile ? 'h-[420px] xs:h-[450px]' : 'h-[450px] md:h-[480px] lg:h-[500px]'
          }`}>
            <CardViewerPremium 
              frontImage={image} 
              backImage="/imagenes/about/cards/card-back.webp" 
            />
          </div>
        </div>

        {/* Social Media Buttons */}
        <div className="flex gap-4 justify-center">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${socialButtonBase} ${socialButtonBorder} ${socialButtonTheme}`}
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${socialButtonBase} ${socialButtonBorder} ${socialButtonTheme}`}
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className={`flex-1 space-y-6 max-w-xl ${
        isMobile ? 'text-center' : 'text-left'
      }`}>
        {/* Name and Role */}
        <div>
          <h2 className={`font-bold tracking-tighter text-textPrimary mb-2 ${
            isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl lg:text-5xl'
          }`}>
            {name}
          </h2>
          <p className={`text-highlight font-medium ${
            isMobile ? 'text-base' : 'text-lg md:text-xl'
          }`}>
            {role}
          </p>
        </div>

        {/* Specialties - Binary Pattern Style */}
        <div className={`${cardBase} ${cardBorder} ${cardTheme} p-4 relative overflow-hidden`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="binaryBg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <text x="2" y="15" fontSize="12" fill="#08A696" fontFamily="monospace">
                    1
                    <animate attributeName="fill-opacity" 
                      values="0.3;1;0.3" 
                      dur="3s" 
                      repeatCount="indefinite"/>
                  </text>
                  <text x="20" y="15" fontSize="12" fill="#08A696" fontFamily="monospace">
                    0
                    <animate attributeName="fill-opacity" 
                      values="1;0.3;1" 
                      dur="2.5s" 
                      repeatCount="indefinite"/>
                  </text>
                  <text x="10" y="30" fontSize="12" fill="#08A696" fontFamily="monospace">
                    0
                    <animate attributeName="fill-opacity" 
                      values="0.5;1;0.5" 
                      dur="2.8s" 
                      repeatCount="indefinite"/>
                  </text>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#binaryBg)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-highlight rounded-full animate-pulse"></div>
              <h3 className={`font-bold text-textPrimary uppercase tracking-wider ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                Especialidades
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? 'bg-[#08A696]/10 border-[#08A696]/30 text-[#26FFDF] hover:bg-[#08A696]/20 hover:border-[#08A696]'
                      : 'bg-[#08A696]/5 border-[#08A696]/40 text-[#08A696] hover:bg-[#08A696]/10 hover:border-[#08A696]'
                  }`}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Biography */}
        <div className={`text-textMuted leading-relaxed ${
          isMobile ? 'text-sm' : 'text-base md:text-lg'
        }`}>
          <p>{biography}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes levitate {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default TeamMemberProfile
