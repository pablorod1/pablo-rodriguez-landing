import React, {
  Children,
  cloneElement,
  forwardRef,
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

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-xl overflow-hidden  bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${
        customClass ?? ""
      } ${rest.className ?? ""}`.trim()}
    />
  )
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (
  i: number,
  distX: number,
  distY: number,
  total: number
): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
    // Optimizaciones adicionales para rendimiento
    willChange: "transform",
    backfaceVisibility: "hidden",
    perspective: 1000,
    transformStyle: "preserve-3d",
  });

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
}) => {
  // Memoizar configuración para evitar recreaciones
  const config = useMemo(
    () =>
      easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 1.5, // Reducido para mejor fluidez
            durMove: 1.5,
            durReturn: 1.5,
            promoteOverlap: 0.85, // Optimizado
            returnDelay: 0.1,
          }
        : {
            ease: "power2.out", // Cambio a power2 para mejor rendimiento
            durDrop: 0.6,
            durMove: 0.6,
            durReturn: 0.6,
            promoteOverlap: 0.5,
            returnDelay: 0.15,
          },
    [easing]
  );

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children]
  );

  // Memoizar refs para evitar recreaciones
  const refs = useMemo<CardRef[]>(
    () =>
      Array.from({ length: childArr.length }, () =>
        React.createRef<HTMLDivElement>()
      ),
    [childArr.length]
  );

  const order = useRef<number[]>(
    Array.from({ length: childArr.length }, (_, i) => i)
  );

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Memoizar función swap para mejor rendimiento
  const swap = useCallback(() => {
    if (order.current.length < 2 || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const [front, ...rest] = order.current;
    const elFront = refs[front].current!;

    // Limpiar timeline anterior si existe
    if (tlRef.current) {
      tlRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
    tlRef.current = tl;

    // Optimizar animación de caída con mejor easing
    tl.to(elFront, {
      y: "+=500",
      duration: config.durDrop,
      ease: config.ease,
      force3D: true,
      willChange: "transform",
    });

    tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

    // Batch updates para mejor rendimiento
    rest.forEach((idx, i) => {
      const el = refs[idx].current!;
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease,
          force3D: true,
          willChange: "transform",
        },
        `promote+=${i * 0.1}` // Reducido para más fluidez
      );
    });

    const backSlot = makeSlot(
      refs.length - 1,
      cardDistance,
      verticalDistance,
      refs.length
    );
    tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex });
      },
      undefined,
      "return"
    );
    tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
    tl.to(
      elFront,
      {
        y: backSlot.y,
        duration: config.durReturn,
        ease: config.ease,
        force3D: true,
        willChange: "transform",
      },
      "return"
    );

    tl.call(() => {
      order.current = [...rest, front];
    });
  }, [refs, cardDistance, verticalDistance, config]);

  useEffect(() => {
    const total = refs.length;

    // Inicializar posiciones con requestAnimationFrame para mejor timing
    requestAnimationFrame(() => {
      refs.forEach((r, i) => {
        if (r.current) {
          placeNow(
            r.current,
            makeSlot(i, cardDistance, verticalDistance, total),
            skewAmount
          );
        }
      });
    });

    // Delay inicial para asegurar que los elementos estén listos
    const initialTimeout = setTimeout(() => {
      swap();
      intervalRef.current = window.setInterval(swap, delay);
    }, 100);

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        clearTimeout(initialTimeout);
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (tlRef.current) {
          tlRef.current.kill();
        }
      };
    }

    return () => {
      clearTimeout(initialTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, swap]);

  const rendered = useMemo(
    () =>
      childArr.map((child, i) =>
        isValidElement<CardProps>(child)
          ? cloneElement(child, {
              key: `card-${i}`, // Key único para cada elemento
              ref: refs[i],
              style: {
                width,
                height,
                willChange: "transform", // Optimización CSS
                backfaceVisibility: "hidden",
                ...(child.props.style ?? {}),
              },
              onClick: (e) => {
                child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
                onCardClick?.(i);
              },
            } as CardProps & React.RefAttributes<HTMLDivElement>)
          : child
      ),
    [childArr, refs, width, height, onCardClick]
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
      style={{
        width,
        height,
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
