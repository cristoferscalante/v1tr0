"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {
    // Default empty implementation
  },
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 250 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth < 640 ? 200 : window.innerWidth < 768 ? 220 : window.innerWidth < 1024 ? 300 : 384;
      const gap = window.innerWidth < 640 ? 8 : window.innerWidth < 1024 ? 12 : 16;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-6 px-2 sm:py-10 sm:px-4 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div
            className={cn(
              "flex flex-row justify-start gap-2 pl-2 sm:gap-4 sm:pl-4 lg:gap-6 lg:pl-6",
              "mx-auto max-w-7xl"
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 * index,
                  ease: "easeOut",
                }}
                key={"card" + index}
                className="rounded-2xl last:pr-[10%] sm:rounded-3xl sm:last:pr-[8%] md:last:pr-[6%] lg:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-4 sm:mr-6 md:mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-custom-1 hover:bg-custom-2 transition-colors disabled:opacity-50 dark:bg-custom-2 dark:hover:bg-custom-3 shadow-lg"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
          </button>
          <button
            className="relative z-40 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-custom-1 hover:bg-custom-2 transition-colors disabled:opacity-50 dark:bg-custom-2 dark:hover:bg-custom-3 shadow-lg"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [index, onCardClose]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              {...(layout && { layoutId: `card-${card.title}` })}
              className="relative z-[60] mx-auto my-4 sm:my-6 md:my-10 h-fit max-w-5xl rounded-2xl sm:rounded-3xl bg-background p-3 sm:p-4 md:p-6 lg:p-10 font-sans shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                className="sticky top-2 sm:top-4 right-0 ml-auto flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary hover:bg-accent transition-colors z-[70]"
                onClick={handleClose}
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-white" />
              </button>
              <motion.p
                {...(layout && { layoutId: `category-${card.title}` })}
                className="text-base font-medium text-primary"
              >
                {card.category}
              </motion.p>
              <motion.p
                {...(layout && { layoutId: `title-${card.title}` })}
                className="mt-2 sm:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-text-primary"
              >
                {card.title}
              </motion.p>
              <motion.p
                className="mt-2 sm:mt-4 text-base sm:text-lg text-text-muted leading-relaxed"
              >
                {card.description}
              </motion.p>
              {card.technologies && card.technologies.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 sm:mb-3">Tecnologías utilizadas:</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {card.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-custom-1 text-primary rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="py-6 sm:py-8 md:py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        {...(layout && { layoutId: `card-${card.title}` })}
        onClick={handleOpen}
        className="relative z-10 flex h-64 w-48 sm:h-72 sm:w-52 md:h-80 md:w-56 lg:h-[30rem] lg:w-80 xl:h-[40rem] xl:w-96 flex-col items-start justify-start overflow-hidden rounded-2xl sm:rounded-3xl bg-background-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-custom-2"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-4 sm:p-6 md:p-8">
          <motion.p
            {...(layout && { layoutId: `category-${card.category}` })}
            className="text-left font-sans text-xs sm:text-sm md:text-base font-medium text-white"
          >
            {card.category}
          </motion.p>
          <motion.p
            {...(layout && { layoutId: `title-${card.title}` })}
            className="mt-1 sm:mt-2 max-w-xs text-left font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold [text-wrap:balance] text-white leading-tight"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  src,
  className,
  alt,
  ...rest
}: {
  src: string;
  className?: string;
  alt?: string;
}) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Image
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        error ? "bg-custom-1" : "",
        className,
      )}
      onLoad={() => setLoading(false)}
      onError={() => {
        setLoading(false);
        setError(true);
      }}
      src={src}
      fill
      alt={alt ? alt : "Imagen del proyecto"}
      {...rest}
    />
  );
};
