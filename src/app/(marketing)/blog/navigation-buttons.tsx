'use client';

import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';

interface NavigationButtonsProps {
  direction: 'up' | 'down';
}

export default function NavigationButtons({ direction }: NavigationButtonsProps): ReactNode {
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    try {
    if (direction === 'down') {
      const postsGrid = document.querySelector('#posts-grid');
      if (postsGrid) {
        postsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => setIsScrolling(false), 1000);
  } catch (error) {
    console.error('Error al realizar el scroll:', error);
    setIsScrolling(false);
  }
  }, [direction]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleScroll();
    }
  }, [handleScroll]);

  return (
    <div className="flex items-center gap-4 flex-wrap" role="navigation" aria-label="Navegación de la página">
      {isScrolling && (
        <div className="sr-only" role="status" aria-live="polite">
          {direction === 'down' ? 'Desplazando a la lista de artículos...' : 'Volviendo al inicio de la página...'}
        </div>
      )}
      <button 
        onClick={handleScroll}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-custom-2/30 text-highlight hover:bg-custom-2/50 active:bg-custom-2/70 transition-all duration-300 ease-in-out rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:scale-105 active:scale-95 ${isScrolling ? 'opacity-50 cursor-wait transform scale-90' : ''}`}
        disabled={isScrolling}
        aria-label={direction === 'down' ? 'Ver artículos' : 'Volver arriba'}
        title={direction === 'down' ? 'Ir a la lista de artículos' : 'Volver al inicio de la página'}
        aria-busy={isScrolling}
        aria-pressed={isScrolling}
      >
        {direction === 'down' ? 'Ver artículos' : 'Volver arriba'}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d={direction === 'down' 
              ? "M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" 
              : "M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            }
            className={`transform transition-transform duration-300 ${isScrolling ? 'translate-y-1' : ''}`}
          />
        </svg>
      </button>
    </div>
  );
}