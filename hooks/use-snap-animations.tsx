"use client";

import { useCallback, useRef } from "react";

interface UseSnapAnimationsOptions {
  sections: string[];
  duration?: number;
  enableCircularNavigation?: boolean;
  singleAnimation?: boolean;
  onSnapComplete?: (index: number) => void;
}

interface UseSnapAnimationsReturn {
  triggerAnimation: (direction: "next" | "prev") => void;
  isEnabled: boolean;
}

const useSnapAnimations = (options: UseSnapAnimationsOptions): UseSnapAnimationsReturn => {
  const {
    sections = [],
    duration = 1,
    enableCircularNavigation = true,
    onSnapComplete
  } = options;

  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const triggerAnimation = useCallback((direction: "next" | "prev") => {
    if (isAnimatingRef.current || sections.length === 0) return;

    const currentIndex = currentIndexRef.current;
    let nextIndex: number;

    if (direction === "next") {
      nextIndex = currentIndex + 1;
      if (nextIndex >= sections.length) {
        nextIndex = enableCircularNavigation ? 0 : sections.length - 1;
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = enableCircularNavigation ? sections.length - 1 : 0;
      }
    }

    if (nextIndex === currentIndex) return;

    isAnimatingRef.current = true;
    
    // Simulate animation completion
    setTimeout(() => {
      isAnimatingRef.current = false;
      currentIndexRef.current = nextIndex;
      onSnapComplete?.(nextIndex);
    }, duration * 1000);

  }, [sections, duration, enableCircularNavigation, onSnapComplete]);

  return {
    triggerAnimation,
    isEnabled: !isAnimatingRef.current,
  };
};

export default useSnapAnimations;