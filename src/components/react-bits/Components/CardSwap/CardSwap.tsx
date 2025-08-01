import React, {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import gsap from "gsap";
import "@/styles/global.css";

export type EasingType = "linear" | "elastic";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: EasingType;
  children: ReactNode;
  className?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

type CardRef = RefObject<HTMLDivElement | null>;

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

interface AnimationConfig {
  ease: string;
  durDrop: number;
  durMove: number;
  durReturn: number;
  promoteOverlap: number;
  returnDelay: number;
}

// Animation configuration constants
const ANIMATION_CONFIGS: Record<EasingType, AnimationConfig> = {
  elastic: {
    ease: "elastic.out(0.6,0.9)",
    durDrop: 1.2,
    durMove: 1.2,
    durReturn: 1.2,
    promoteOverlap: 0.8,
    returnDelay: 0.1,
  },
  linear: {
    ease: "power2.out",
    durDrop: 0.6,
    durMove: 0.6,
    durReturn: 0.6,
    promoteOverlap: 0.5,
    returnDelay: 0.15,
  },
} as const;

const createSlot = (
  index: number,
  distanceX: number,
  distanceY: number,
  total: number
): Slot => ({
  x: index * distanceX,
  y: -index * distanceY,
  z: -index * distanceX * 1.5,
  zIndex: total - index,
});

const applyCardTransform = (
  element: HTMLElement,
  slot: Slot,
  skew: number
): void => {
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
    willChange: "transform",
    backfaceVisibility: "hidden",
    perspective: 1000,
    transformStyle: "preserve-3d",
  });
};

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
  className = "",
}) => {
  // Get animation configuration
  const config = useMemo(() => ANIMATION_CONFIGS[easing], [easing]);

  const childArray = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children]
  );

  // Create refs for each card
  const cardRefs = useMemo<CardRef[]>(
    () =>
      Array.from({ length: childArray.length }, () =>
        React.createRef<HTMLDivElement>()
      ),
    [childArray.length]
  );

  const cardOrder = useRef<number[]>(
    Array.from({ length: childArray.length }, (_, i) => i)
  );

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // Optimized swap animation
  const performSwap = useCallback(() => {
    if (cardOrder.current.length < 2 || isAnimating.current) return;

    isAnimating.current = true;
    const [frontCardIndex, ...remainingCards] = cardOrder.current;
    const frontElement = cardRefs[frontCardIndex].current;

    if (!frontElement) {
      isAnimating.current = false;
      return;
    }

    // Clear existing timeline
    timelineRef.current?.kill();

    const timeline = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });
    timelineRef.current = timeline;

    // Animate front card dropping
    timeline.to(frontElement, {
      y: "+=500",
      duration: config.durDrop,
      ease: config.ease,
      force3D: true,
      willChange: "transform",
    });

    timeline.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

    // Animate remaining cards moving forward
    remainingCards.forEach((cardIndex, position) => {
      const element = cardRefs[cardIndex].current;
      if (!element) return;

      const slot = createSlot(
        position,
        cardDistance,
        verticalDistance,
        cardRefs.length
      );
      timeline.set(element, { zIndex: slot.zIndex }, "promote");
      timeline.to(
        element,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease,
          force3D: true,
          willChange: "transform",
        },
        `promote+=${position * 0.08}`
      );
    });

    // Animate front card returning to back
    const backSlot = createSlot(
      cardRefs.length - 1,
      cardDistance,
      verticalDistance,
      cardRefs.length
    );

    timeline.addLabel(
      "return",
      `promote+=${config.durMove * config.returnDelay}`
    );

    timeline.call(
      () => {
        gsap.set(frontElement, { zIndex: backSlot.zIndex });
      },
      undefined,
      "return"
    );

    timeline.set(frontElement, { x: backSlot.x, z: backSlot.z }, "return");

    timeline.to(
      frontElement,
      {
        y: backSlot.y,
        duration: config.durReturn,
        ease: config.ease,
        force3D: true,
        willChange: "transform",
      },
      "return"
    );

    timeline.call(() => {
      cardOrder.current = [...remainingCards, frontCardIndex];
    });
  }, [cardRefs, cardDistance, verticalDistance, config]);

  useEffect(() => {
    const totalCards = cardRefs.length;

    // Initialize card positions
    requestAnimationFrame(() => {
      cardRefs.forEach((cardRef, index) => {
        if (cardRef.current) {
          applyCardTransform(
            cardRef.current,
            createSlot(index, cardDistance, verticalDistance, totalCards),
            skewAmount
          );
        }
      });
    });

    // Start animation cycle
    const initialTimeout = setTimeout(() => {
      performSwap();
      intervalRef.current = window.setInterval(performSwap, delay);
    }, 3000);

    // Handle pause on hover
    if (pauseOnHover && containerRef.current) {
      const containerElement = containerRef.current;

      const handleMouseEnter = () => {
        timelineRef.current?.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };

      const handleMouseLeave = () => {
        timelineRef.current?.play();
        intervalRef.current = window.setInterval(performSwap, delay);
      };

      containerElement.addEventListener("mouseenter", handleMouseEnter);
      containerElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        clearTimeout(initialTimeout);
        containerElement.removeEventListener("mouseenter", handleMouseEnter);
        containerElement.removeEventListener("mouseleave", handleMouseLeave);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        timelineRef.current?.kill();
      };
    }

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      timelineRef.current?.kill();
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    performSwap,
    cardRefs,
  ]);

  const renderedCards = useMemo(
    () =>
      childArray.map((child, index) =>
        isValidElement<CardProps>(child)
          ? cloneElement(child, {
              key: `card-${index}`,
              ref: cardRefs[index],
              style: {
                width,
                height,
                willChange: "transform",
                backfaceVisibility: "hidden",
                ...(child.props.style ?? {}),
              },
              onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                child.props.onClick?.(e);
                onCardClick?.(index);
              },
            } as CardProps & React.RefAttributes<HTMLDivElement>)
          : child
      ),
    [childArray, cardRefs, width, height, onCardClick]
  );

  return (
    <div
      ref={containerRef}
      className={`absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55] ${className}`}
      style={{
        width,
        height,
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {renderedCards}
    </div>
  );
};

export default CardSwap;
