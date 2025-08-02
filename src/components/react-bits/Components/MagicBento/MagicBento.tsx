/*
	Installed from https://reactbits.dev/ts/tailwind/
	Optimized for performance: React.memo, useMemo, useCallback, CSS animations
*/

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useTransition,
} from "react";
import { gsap } from "gsap";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  cards?: BentoCardProps[];
}

// Performance optimized constants
const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "255, 105, 0";
const MOBILE_BREAKPOINT = 768;

// Throttling for performance
const MOUSE_MOVE_THROTTLE = 16; // ~60fps
const PARTICLE_ANIMATION_DELAY = 100;

// Memoized card data to prevent unnecessary re-renders
const cardData: readonly BentoCardProps[] = Object.freeze([
  Object.freeze({
    color: "#18181b",
    title: "Analytics",
    description: "Track user behavior",
    label: "Insights",
  }),
  Object.freeze({
    color: "#18181b",
    title: "Dashboard",
    description: "Centralized data view",
    label: "Overview",
  }),
  Object.freeze({
    color: "#18181b",
    title: "Collaboration",
    description: "Work together seamlessly",
    label: "Teamwork",
  }),
  Object.freeze({
    color: "#18181b",
    title: "Automation",
    description: "Streamline workflows",
    label: "Efficiency",
  }),
  Object.freeze({
    color: "#18181b",
    title: "Integration",
    description: "Connect favorite tools",
    label: "Connectivity",
  }),
  Object.freeze({
    color: "#18181b",
    title: "Security",
    description: "Enterprise-grade protection",
    label: "Protection",
  }),
]);

// Utility function for creating particle elements (moved outside component)
const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR
): HTMLDivElement => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--card-gradient);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    will-change: transform, opacity;
  `;
  return el;
};

// Utility function for spotlight calculations (moved outside component)
const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

// Performance-optimized throttle function
const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// Utility function for updating card glow properties
const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  // Batch DOM updates for performance
  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

// Performance-optimized ParticleCard with React.memo
const ParticleCard = memo<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}>(
  ({
    children,
    className = "",
    disableAnimations = false,
    style,
    particleCount = DEFAULT_PARTICLE_COUNT,
    glowColor = DEFAULT_GLOW_COLOR,
    enableTilt = true,
    clickEffect = false,
    enableMagnetism = false,
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef<HTMLDivElement[]>([]);
    const particlesInitialized = useRef(false);
    const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
    const [isPending, startTransition] = useTransition();

    // Memoized particle initialization for performance
    const initializeParticles = useCallback(() => {
      if (particlesInitialized.current || !cardRef.current) return;

      const { width, height } = cardRef.current.getBoundingClientRect();
      memoizedParticles.current = Array.from({ length: particleCount }, () =>
        createParticleElement(
          Math.random() * width,
          Math.random() * height,
          glowColor
        )
      );
      particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    // Optimized cleanup with proper memory management
    const clearAllParticles = useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      magnetismAnimationRef.current?.kill();

      // Use startTransition for non-urgent particle cleanup
      startTransition(() => {
        particlesRef.current.forEach((particle) => {
          gsap.to(particle, {
            scale: 0,
            opacity: 0,
            duration: 0.2, // Reduced duration for performance
            ease: "power2.in",
            onComplete: () => {
              particle.parentNode?.removeChild(particle);
            },
          });
        });
        particlesRef.current = [];
      });
    }, []);

    // Optimized particle animation with throttling
    const animateParticles = useCallback(() => {
      if (!cardRef.current || !isHoveredRef.current || disableAnimations)
        return;

      if (!particlesInitialized.current) {
        initializeParticles();
      }

      memoizedParticles.current.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          // Optimized GSAP animation with will-change applied via CSS
          gsap.fromTo(
            clone,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }
          );

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 80, // Reduced movement for performance
            y: (Math.random() - 0.5) * 80,
            rotation: Math.random() * 180, // Reduced rotation for performance
            duration: 1.5 + Math.random() * 1.5, // Slightly faster animations
            ease: "none",
            repeat: -1,
            yoyo: true,
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, index * PARTICLE_ANIMATION_DELAY);

        timeoutsRef.current.push(timeoutId);
      });
    }, [initializeParticles, disableAnimations]);

    // Memoized mouse event handlers for performance
    const handleMouseEnter = useCallback(() => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt && !disableAnimations) {
        gsap.to(cardRef.current, {
          rotateX: 3, // Reduced tilt for performance
          rotateY: 3,
          duration: 0.2,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    }, [animateParticles, enableTilt, disableAnimations]);

    const handleMouseLeave = useCallback(() => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt && !disableAnimations) {
        gsap.to(cardRef.current, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }

      if (enableMagnetism && !disableAnimations) {
        gsap.to(cardRef.current, {
          x: 0,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }, [clearAllParticles, enableTilt, enableMagnetism, disableAnimations]);

    // Throttled mouse move handler for performance
    const handleMouseMove = useMemo(
      () =>
        throttle((e: MouseEvent) => {
          if (
            (!enableTilt && !enableMagnetism) ||
            disableAnimations ||
            !cardRef.current
          )
            return;

          const element = cardRef.current;
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          if (enableTilt) {
            const rotateX = ((y - centerY) / centerY) * -8; // Reduced intensity
            const rotateY = ((x - centerX) / centerX) * 8;

            gsap.to(element, {
              rotateX,
              rotateY,
              duration: 0.1,
              ease: "power2.out",
              transformPerspective: 1000,
            });
          }

          if (enableMagnetism) {
            const magnetX = (x - centerX) * 0.03; // Reduced magnetism for performance
            const magnetY = (y - centerY) * 0.03;

            magnetismAnimationRef.current = gsap.to(element, {
              x: magnetX,
              y: magnetY,
              duration: 0.2,
              ease: "power2.out",
            });
          }
        }, MOUSE_MOVE_THROTTLE),
      [enableTilt, enableMagnetism, disableAnimations]
    );

    const handleClick = useCallback(
      (e: MouseEvent) => {
        if (!clickEffect || disableAnimations || !cardRef.current) return;

        const element = cardRef.current;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Optimized ripple effect calculation
        const maxDistance = Math.min(
          Math.max(
            Math.hypot(x, y),
            Math.hypot(x - rect.width, y),
            Math.hypot(x, y - rect.height),
            Math.hypot(x - rect.width, y - rect.height)
          ),
          300 // Cap maximum ripple size for performance
        );

        const ripple = document.createElement("div");
        ripple.style.cssText = `
      position: absolute;
      width: ${maxDistance * 2}px;
      height: ${maxDistance * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, rgba(${glowColor}, 0.1) 30%, transparent 60%);
      left: ${x - maxDistance}px;
      top: ${y - maxDistance}px;
      pointer-events: none;
      z-index: 1000;
      will-change: transform, opacity;
    `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 1 },
          {
            scale: 1,
            opacity: 0,
            duration: 0.6, // Faster ripple for better performance
            ease: "power2.out",
            onComplete: () => ripple.remove(),
          }
        );
      },
      [clickEffect, glowColor, disableAnimations]
    );

    useEffect(() => {
      if (disableAnimations || !cardRef.current) return;

      const element = cardRef.current;

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("click", handleClick);

      return () => {
        isHoveredRef.current = false;
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("click", handleClick);
        clearAllParticles();
      };
    }, [
      handleMouseEnter,
      handleMouseLeave,
      handleMouseMove,
      handleClick,
      clearAllParticles,
      disableAnimations,
    ]);

    // Memoized style object to prevent re-renders
    const cardStyle = useMemo(
      () => ({
        ...style,
        position: "relative" as const,
        overflow: "hidden" as const,
        willChange: enableTilt || enableMagnetism ? "transform" : "auto",
      }),
      [style, enableTilt, enableMagnetism]
    );

    return (
      <div
        ref={cardRef}
        className={`${className} relative overflow-hidden`}
        style={cardStyle}
      >
        {children}
      </div>
    );
  }
);

// Performance-optimized GlobalSpotlight with React.memo
const GlobalSpotlight = memo<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}>(
  ({
    gridRef,
    disableAnimations = false,
    enabled = true,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    glowColor = DEFAULT_GLOW_COLOR,
  }) => {
    const spotlightRef = useRef<HTMLDivElement | null>(null);
    const isInsideSection = useRef(false);
    const [isPending, startTransition] = useTransition();

    // Memoized spotlight values calculation
    const spotlightValues = useMemo(
      () => calculateSpotlightValues(spotlightRadius),
      [spotlightRadius]
    );

    // Throttled mouse move handler for performance
    const handleMouseMove = useMemo(
      () =>
        throttle((e: MouseEvent) => {
          if (!spotlightRef.current || !gridRef.current) return;

          const section = gridRef.current.closest(".bento-section");
          const rect = section?.getBoundingClientRect();
          const mouseInside =
            rect &&
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          isInsideSection.current = mouseInside || false;
          const cards = gridRef.current.querySelectorAll(".card");

          if (!mouseInside) {
            gsap.to(spotlightRef.current, {
              opacity: 0,
              duration: 0.2, // Faster fade out
              ease: "power2.out",
            });

            // Use startTransition for non-urgent card updates
            startTransition(() => {
              cards.forEach((card) => {
                (card as HTMLElement).style.setProperty(
                  "--glow-intensity",
                  "0"
                );
              });
            });
            return;
          }

          const { proximity, fadeDistance } = spotlightValues;
          let minDistance = Infinity;

          // Batch DOM updates for performance
          const updates: (() => void)[] = [];

          cards.forEach((card) => {
            const cardElement = card as HTMLElement;
            const cardRect = cardElement.getBoundingClientRect();
            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;
            const distance =
              Math.hypot(e.clientX - centerX, e.clientY - centerY) -
              Math.max(cardRect.width, cardRect.height) / 2;
            const effectiveDistance = Math.max(0, distance);

            minDistance = Math.min(minDistance, effectiveDistance);

            let glowIntensity = 0;
            if (effectiveDistance <= proximity) {
              glowIntensity = 1;
            } else if (effectiveDistance <= fadeDistance) {
              glowIntensity =
                (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
            }

            // Queue update for batch processing
            updates.push(() =>
              updateCardGlowProperties(
                cardElement,
                e.clientX,
                e.clientY,
                glowIntensity,
                spotlightRadius
              )
            );
          });

          // Batch execute all updates
          startTransition(() => {
            updates.forEach((update) => update());
          });

          // Update spotlight position
          gsap.to(spotlightRef.current, {
            left: e.clientX,
            top: e.clientY,
            duration: 0.05, // Faster response
            ease: "power2.out",
          });

          const targetOpacity =
            minDistance <= proximity
              ? 0.8
              : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) *
                0.8
              : 0;

          gsap.to(spotlightRef.current, {
            opacity: targetOpacity,
            duration: targetOpacity > 0 ? 0.1 : 0.3,
            ease: "power2.out",
          });
        }, MOUSE_MOVE_THROTTLE),
      [gridRef, spotlightValues, spotlightRadius]
    );

    const handleMouseLeave = useCallback(() => {
      isInsideSection.current = false;

      startTransition(() => {
        gridRef.current?.querySelectorAll(".card").forEach((card) => {
          (card as HTMLElement).style.setProperty("--glow-intensity", "0");
        });
      });

      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }, [gridRef]);

    useEffect(() => {
      if (disableAnimations || !gridRef?.current || !enabled) return;

      // Create spotlight element with optimized styles
      const spotlight = document.createElement("div");
      spotlight.className = "global-spotlight";
      spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    `;
      document.body.appendChild(spotlight);
      spotlightRef.current = spotlight;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseleave", handleMouseLeave);
        spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      };
    }, [
      gridRef,
      disableAnimations,
      enabled,
      glowColor,
      handleMouseMove,
      handleMouseLeave,
    ]);

    return null;
  }
);

// Memoized BentoCardGrid to prevent unnecessary re-renders
const BentoCardGrid = memo<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}>(({ children, gridRef }) => {
  // Memoized grid styles for performance
  const gridStyle = useMemo(
    () => ({ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)" }),
    []
  );

  return (
    <div
      className="bento-section grid gap-2 p-2 md:p-0 select-none relative"
      style={gridStyle}
      ref={gridRef}
    >
      {children}
    </div>
  );
});

// Optimized mobile detection with proper cleanup
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check with throttling to prevent excessive calculations
    const checkMobile = throttle(() => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    }, 100);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Performance-optimized main component with React.memo
const MagicBento = memo<BentoProps>(
  ({
    textAutoHide = true,
    enableStars = true,
    enableSpotlight = true,
    enableBorderGlow = true,
    disableAnimations = false,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    particleCount = DEFAULT_PARTICLE_COUNT,
    enableTilt = false,
    glowColor = DEFAULT_GLOW_COLOR,
    clickEffect = true,
    enableMagnetism = true,
    cards = cardData,
  }) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobileDetection();
    const shouldDisableAnimations = useMemo(
      () => disableAnimations || isMobile,
      [disableAnimations, isMobile]
    );

    // Memoized CSS styles to prevent re-renders
    const cssVariables = useMemo(
      () => ({
        "--glow-color": glowColor,
        "--border-color": "var(--color-special-800)",
        "--background-dark": "var(--color-background-950)",
        "--white": "hsl(0, 0%, 100%)",
        "--orange-primary": "var(--color-special-500)",
        "--orange-glow": "rgba(255, 105, 0, 0.2)",
        "--orange-border": "rgba(255, 105, 0, 0.8)",
      }),
      [glowColor]
    );

    // Memoized CSS string for performance
    const styleSheet = useMemo(
      () => `
      .bento-section {
        --glow-x: 50%;
        --glow-y: 50%;
        --glow-intensity: 0;
        --glow-radius: 200px;
        --glow-color: ${glowColor};
        --border-color: var(--color-special-800);
        --background-dark: var(--color-background-950);
        --white: hsl(0, 0%, 100%);
        --orange-primary: var(--color-special-500);
        --orange-glow: rgba(255, 105, 0, 0.2);
        --orange-border: rgba(255, 105, 0, 0.8);
      }
      
      .card-responsive {
        grid-template-columns: 1fr;
        width: 100%;
        margin: 0 auto;
      }
      
      @media (min-width: 600px) {
        .card-responsive {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      @media (min-width: 1024px) {
        .card-responsive {
          grid-template-columns: repeat(4, 1fr);
        }
        
        .card-responsive .card:nth-child(3) {
          grid-column: span 2;
          grid-row: span 2;
        }
        
        .card-responsive .card:nth-child(4) {
          grid-column: 1 / span 2;
          grid-row: 2 / span 2;
        }
        
        .card-responsive .card:nth-child(6) {
          grid-column: 4;
          grid-row: 3;
        }
      }
      
      .card--border-glow::after {
        content: '';
        position: absolute;
        inset: 0;
        padding: 6px;
        background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
            transparent 60%);
        border-radius: inherit;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: subtract;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        pointer-events: none;
        transition: opacity 0.2s ease;
        z-index: 1;
        will-change: opacity;
      }
      
      .card--border-glow:hover::after {
        opacity: 1;
      }
      
      .card--border-glow:hover {
        box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${glowColor}, 0.2);
      }
      
      .particle {
        will-change: transform, opacity;
      }
      
      .particle::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: rgba(${glowColor}, 0.2);
        border-radius: 50%;
        z-index: -1;
      }
      
      .particle-container:hover {
        box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
      }
      
      .text-clamp-1 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .text-clamp-2 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .card {
        will-change: ${enableTilt || enableMagnetism ? "transform" : "auto"};
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      @media (max-width: 599px) {
        .card-responsive {
          grid-template-columns: 1fr;
          width: 90%;
          margin: 0 auto;
          padding: 0.5rem;
        }
        
        .card-responsive .card {
          width: 100%;
          min-height: 180px;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .card, .particle, .global-spotlight {
          animation: none !important;
          transition: none !important;
        }
      }
    `,
      [glowColor, enableTilt, enableMagnetism]
    );

    // Memoized card rendering function for performance
    const renderCard = useCallback(
      (card: BentoCardProps, index: number) => {
        const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
          enableBorderGlow ? "card--border-glow" : ""
        }`;

        const cardStyle = useMemo(
          () => ({
            backgroundColor: card.color || "var(--color-background-950)",
            borderColor: "var(--border-color)",
            color: "var(--white)",
            "--glow-x": "50%",
            "--glow-y": "50%",
            "--glow-intensity": "0",
            "--glow-radius": "200px",
            willChange: enableTilt || enableMagnetism ? "transform" : "auto",
          }),
          [card.color, enableTilt, enableMagnetism]
        );

        if (enableStars) {
          return (
            <ParticleCard
              key={`particle-${index}`}
              className={baseClassName}
              style={cardStyle}
              disableAnimations={shouldDisableAnimations}
              particleCount={particleCount}
              glowColor={glowColor}
              enableTilt={enableTilt}
              clickEffect={clickEffect}
              enableMagnetism={enableMagnetism}
            >
              <CardContent card={card} textAutoHide={textAutoHide} />
            </ParticleCard>
          );
        }

        return (
          <OptimizedCard
            key={`card-${index}`}
            card={card}
            className={baseClassName}
            style={cardStyle}
            shouldDisableAnimations={shouldDisableAnimations}
            enableTilt={enableTilt}
            enableMagnetism={enableMagnetism}
            clickEffect={clickEffect}
            glowColor={glowColor}
            textAutoHide={textAutoHide}
          />
        );
      },
      [
        enableBorderGlow,
        enableStars,
        shouldDisableAnimations,
        particleCount,
        glowColor,
        enableTilt,
        clickEffect,
        enableMagnetism,
        textAutoHide,
      ]
    );

    return (
      <>
        <style>{styleSheet}</style>

        {enableSpotlight && (
          <GlobalSpotlight
            gridRef={gridRef}
            disableAnimations={shouldDisableAnimations}
            enabled={enableSpotlight}
            spotlightRadius={spotlightRadius}
            glowColor={glowColor}
          />
        )}

        <BentoCardGrid gridRef={gridRef}>
          <div className="card-responsive grid gap-2">
            {cards.map(renderCard)}
          </div>
        </BentoCardGrid>
      </>
    );
  }
);

// Memoized card content component
const CardContent = memo<{
  card: BentoCardProps;
  textAutoHide: boolean;
}>(({ card, textAutoHide }) => (
  <>
    <div className="card__header flex justify-between gap-3 relative text-white">
      <span className="card__label text-base">{card.label}</span>
    </div>
    <div className="card__content flex flex-col relative text-white">
      <h3
        className={`card__title font-normal text-base m-0 mb-1 ${
          textAutoHide ? "text-clamp-1" : ""
        }`}
      >
        {card.title}
      </h3>
      <p
        className={`card__description text-xs leading-5 opacity-90 ${
          textAutoHide ? "text-clamp-2" : ""
        }`}
      >
        {card.description}
      </p>
    </div>
  </>
));

// Optimized card component for non-particle cards
const OptimizedCard = memo<{
  card: BentoCardProps;
  className: string;
  style: React.CSSProperties;
  shouldDisableAnimations: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  glowColor: string;
  textAutoHide: boolean;
}>(
  ({
    card,
    className,
    style,
    shouldDisableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
    textAutoHide,
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Optimized mouse handlers with throttling
    const handleMouseMove = useMemo(
      () =>
        throttle((e: MouseEvent) => {
          if (shouldDisableAnimations || !cardRef.current) return;
          if (!enableTilt && !enableMagnetism) return;

          const el = cardRef.current;
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          if (enableTilt) {
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            gsap.to(el, {
              rotateX,
              rotateY,
              duration: 0.1,
              ease: "power2.out",
              transformPerspective: 1000,
            });
          }

          if (enableMagnetism) {
            const magnetX = (x - centerX) * 0.03;
            const magnetY = (y - centerY) * 0.03;

            gsap.to(el, {
              x: magnetX,
              y: magnetY,
              duration: 0.2,
              ease: "power2.out",
            });
          }
        }, MOUSE_MOVE_THROTTLE),
      [shouldDisableAnimations, enableTilt, enableMagnetism]
    );

    const handleMouseLeave = useCallback(() => {
      if (shouldDisableAnimations || !cardRef.current) return;

      const el = cardRef.current;

      if (enableTilt) {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }

      if (enableMagnetism) {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }, [shouldDisableAnimations, enableTilt, enableMagnetism]);

    const handleClick = useCallback(
      (e: MouseEvent) => {
        if (!clickEffect || shouldDisableAnimations || !cardRef.current) return;

        const el = cardRef.current;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const maxDistance = Math.min(
          Math.max(
            Math.hypot(x, y),
            Math.hypot(x - rect.width, y),
            Math.hypot(x, y - rect.height),
            Math.hypot(x - rect.width, y - rect.height)
          ),
          300
        );

        const ripple = document.createElement("div");
        ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, rgba(${glowColor}, 0.1) 30%, transparent 60%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        will-change: transform, opacity;
      `;

        el.appendChild(ripple);

        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 1 },
          {
            scale: 1,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove(),
          }
        );
      },
      [clickEffect, shouldDisableAnimations, glowColor]
    );

    useEffect(() => {
      if (!cardRef.current) return;

      const el = cardRef.current;

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
      el.addEventListener("click", handleClick);

      return () => {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.removeEventListener("click", handleClick);
      };
    }, [handleMouseMove, handleMouseLeave, handleClick]);

    return (
      <div ref={cardRef} className={className} style={style}>
        <CardContent card={card} textAutoHide={textAutoHide} />
      </div>
    );
  }
);

// Add display names for better debugging
ParticleCard.displayName = "ParticleCard";
GlobalSpotlight.displayName = "GlobalSpotlight";
BentoCardGrid.displayName = "BentoCardGrid";
MagicBento.displayName = "MagicBento";
CardContent.displayName = "CardContent";
OptimizedCard.displayName = "OptimizedCard";

export default MagicBento;
