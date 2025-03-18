"use client";

import { useCallback, useState } from "react";

interface NavigationButtonsProps {
  direction: "up" | "down";
}

export default function NavigationButtons({ direction }: NavigationButtonsProps) {
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    try {
      if (direction === "down") {
        const postsGrid = document.getElementById("posts-grid");
        if (postsGrid) {
          postsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          const scrollAmount = window.innerHeight * 0.8;
          window.scrollBy({
            top: scrollAmount,
            behavior: "smooth",
          });
        }
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error al realizar el scroll:", error);
      if (direction === "down") {
        window.scrollBy(0, 500);
      } else {
        window.scrollTo(0, 0);
      }
    }
    setTimeout(() => setIsScrolling(false), 1000);
  }, [direction]);

  return (
    <button onClick={handleScroll} disabled={isScrolling}>
      {direction === "down" ? "Scroll Down" : "Scroll Up"}
    </button>
  );
}
