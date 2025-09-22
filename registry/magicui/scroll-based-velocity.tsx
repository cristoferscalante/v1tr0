"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollVelocityContainerProps {
  children: ReactNode;
  className?: string;
}

interface ScrollVelocityRowProps {
  children: ReactNode;
  baseVelocity: number;
  direction: 1 | -1;
  className?: string;
}

export function ScrollVelocityContainer({ children, className }: ScrollVelocityContainerProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function ScrollVelocityRow({ children, baseVelocity, direction, className }: ScrollVelocityRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    // Clone content multiple times for seamless infinite loop
    const clone1 = content.cloneNode(true) as HTMLElement;
    const clone2 = content.cloneNode(true) as HTMLElement;
    const clone3 = content.cloneNode(true) as HTMLElement;
    const clone4 = content.cloneNode(true) as HTMLElement;
    container.appendChild(clone1);
    container.appendChild(clone2);
    container.appendChild(clone3);
    container.appendChild(clone4);

    let velocity = baseVelocity * direction;
    let scrollVelocity = 0;

    // Set initial positions for seamless loop with more clones
    const contentWidth = content.offsetWidth;
    gsap.set(content, { x: 0 });
    gsap.set(clone1, { x: contentWidth });
    gsap.set(clone2, { x: contentWidth * 2 });
    gsap.set(clone3, { x: contentWidth * 3 });
    gsap.set(clone4, { x: contentWidth * 4 });

    const animate = () => {
      const totalVelocity = velocity + scrollVelocity;
      const allElements = [content, clone1, clone2, clone3, clone4];
      
      // Animate all elements with ultra-smooth movement
      gsap.to(allElements, {
        x: `-=${Math.abs(totalVelocity)}`,
        duration: 1.2,
        ease: "none",
        modifiers: {
          x: (x, target) => {
            let newX = parseFloat(x);
            // Reset position when element goes off-screen to create infinite effect
            if (newX <= -contentWidth) {
              newX += contentWidth * 5;
            }
            return `${newX}px`;
          }
        },
        onComplete: animate
      });
    };

    // Scroll velocity tracking
    ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollVelocity = self.getVelocity() * -0.01;
      }
    });

    animate();

    return () => {
      gsap.killTweensOf([content, clone1, clone2, clone3, clone4]);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (clone1.parentNode) clone1.parentNode.removeChild(clone1);
      if (clone2.parentNode) clone2.parentNode.removeChild(clone2);
      if (clone3.parentNode) clone3.parentNode.removeChild(clone3);
      if (clone4.parentNode) clone4.parentNode.removeChild(clone4);
    };
  }, [baseVelocity, direction]);

  return (
    <div 
      ref={containerRef}
      className={cn("flex whitespace-nowrap", className)}
      style={{ willChange: "transform" }}
    >
      <div ref={contentRef} className="flex shrink-0">
        {children}
      </div>
    </div>
  );
}