"use client";

import { useEffect, useState } from "react";

interface GsapMinimalLoaderProps {
  isVisible: boolean;
  duration?: number;
}

export const GsapMinimalLoader = ({ 
  isVisible, 
  duration = 150 
}: GsapMinimalLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [shouldShow, setShouldShow] = useState(isVisible);

  useEffect(() => {
    if (!isVisible) {
      setShouldShow(false);
      return;
    }

    setShouldShow(true);
    setProgress(0);

    // Animate progress bar
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Hide after completion
        setTimeout(() => setShouldShow(false), 100);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, duration]);

  if (!shouldShow) return null; // eslint-disable-line curly

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="relative bg-[#02505931] backdrop-blur-sm p-3 rounded-2xl border border-[#08A696]/20 transition-all duration-300 shadow-lg">
        <div className="w-1 h-20 bg-[#08A696]/10 rounded-full overflow-hidden relative">
          <div 
            className="absolute bottom-0 w-full bg-gradient-to-t from-[#08A696] to-[#26FFDF] rounded-full transition-all duration-75 ease-out"
            style={{ 
              height: `${progress}%`,
              boxShadow: '0 0 8px #08A696, 0 0 16px #26FFDF/30'
            }}
          />
        </div>
      </div>
    </div>
  );
};