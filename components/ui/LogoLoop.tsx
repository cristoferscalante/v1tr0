"use client";

import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import * as SimpleIcons from 'react-icons/si';
import './LogoLoop.css';

const ANIMATION_CONFIG = {
  VELOCITY: 30, // Reduced from 50 for better performance
  MIN_COPIES: 2,
  COPY_HEADROOM: 2
};

const toCssLength = (value: string | number | undefined) => (typeof value === 'number' ? `${value}px` : (value ?? undefined));

// Optimized ResizeObserver with better debouncing
const useOptimizedResizeObserver = (callback: () => void, elements: React.RefObject<HTMLElement>[], dependencies: any[]) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const rafRef = useRef<number>();

  useEffect(() => {
    // Enhanced debounced callback using both timeout and RAF
    const debouncedCallback = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      timeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(callback);
      }, 100); // Increased debounce time for better performance
    };

    if (!window.ResizeObserver) {
      const handleResize = () => debouncedCallback();
      window.addEventListener('resize', handleResize, { passive: true });
      callback();
      return () => {
        window.removeEventListener('resize', handleResize);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const observers = elements.map(ref => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(debouncedCallback);
      observer.observe(ref.current);
      return observer;
    });

    callback();

    return () => {
      observers.forEach(observer => observer?.disconnect());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

const useImageLoader = (seqRef: React.RefObject<HTMLElement>, onLoad: () => void, dependencies: any[]) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? [];

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach(img => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};


// Optimized animation hook using CSS animations and Intersection Observer
const useOptimizedAnimation = (
  trackRef: React.RefObject<HTMLElement>,
  speed: number,
  direction: 'left' | 'right',
  seqWidth: number
) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Intersection Observer to pause animation when not visible
  useEffect(() => {
    if (!trackRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  // Apply CSS animation
  useEffect(() => {
    if (!trackRef.current || seqWidth <= 0) return;

    const track = trackRef.current;
    const shouldAnimate = isVisible && speed > 0;
    
    if (shouldAnimate) {
      // Calculate animation duration based on speed
      const duration = seqWidth / Math.abs(speed);
      
      // Apply CSS animation
      track.style.animationDuration = `${duration}s`;
      track.style.animationDirection = direction === 'left' ? 'normal' : 'reverse';
      track.className = track.className.replace(/logoloop__track--\w+/g, '') + ' logoloop__track--animated';
      
      setIsAnimating(true);
    } else {
      // Pause animation
      track.className = track.className.replace(/logoloop__track--animated/g, '') + ' logoloop__track--paused';
      setIsAnimating(false);
    }

    return () => {
      if (track) {
        track.className = track.className.replace(/logoloop__track--\w+/g, '');
      }
    };
  }, [isVisible, speed, direction, seqWidth]);

  return { isAnimating, isVisible };
};

interface NodeLogoItem {
  node: React.ReactNode;
  title?: string;
  href?: string;
  ariaLabel?: string;
}

interface ImageLogoItem {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
}

type LogoItem = NodeLogoItem | ImageLogoItem;

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  width?: string | number;
  logoHeight?: number;
  gap?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LogoLoop = memo<LogoLoopProps>(
  ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 28,
    gap = 32,
    fadeOut = false,
    fadeOutColor,
    ariaLabel = 'Partner logos',
    className,
    style
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
    // Removed hover state management

    const targetVelocity = useMemo(() => {
      const magnitude = Math.abs(speed);
      const directionMultiplier = direction === 'left' ? 1 : -1;
      const speedMultiplier = speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction]);

    const updateDimensions = useCallback(() => {
      const containerWidth = containerRef.current?.clientWidth ?? 0;
      const sequenceWidth = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;

      if (sequenceWidth > 0) {
        setSeqWidth(Math.ceil(sequenceWidth));
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
      }
    }, []);

    useOptimizedResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight]);

    useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);

    // Use optimized CSS animation instead of JavaScript animation
    const { isAnimating, isVisible } = useOptimizedAnimation(trackRef, speed, direction, seqWidth);

    const cssVariables = useMemo(
      () => ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
      }),
      [gap, logoHeight, fadeOutColor]
    );

    const rootClassName = useMemo(
      () =>
        ['logoloop', fadeOut && 'logoloop--fade', className]
          .filter(Boolean)
          .join(' '),
      [fadeOut, className]
    );

    // Optimized memoized render function
    const renderLogoItem = useCallback((item: LogoItem, key: string) => {
      const isNodeItem = 'node' in item;

      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ''}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{ contain: 'layout style paint' }} // Performance optimization
        />
      );

      const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);

      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || 'logo link'}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      );
    }, []); // Empty dependency array for better memoization

    // Optimized logo lists generation with reduced DOM manipulation
    const logoLists = useMemo(() => {
      // Reduce copy count for better performance
      const optimizedCopyCount = Math.min(copyCount, 3); // Max 3 copies
      
      return Array.from({ length: optimizedCopyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
        </ul>
      ));
    }, [copyCount, logos, renderLogoItem]);

    const containerStyle = useMemo(
      () => ({
        width: toCssLength(width) ?? '100%',
        '--logo-height': toCssLength(logoHeight),
        '--logo-gap': toCssLength(gap),
        ...style
      }),
      [width, logoHeight, gap, style]
    );

    return (
      <div
        ref={containerRef}
        className={`logoloop ${className}`}
        style={containerStyle}
        role="region"
        aria-label={ariaLabel}
      >
        <div className="logoloop__track" ref={trackRef}>
          {logoLists}
        </div>
      </div>
    );
  }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;