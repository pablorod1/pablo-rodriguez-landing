import React, { useMemo } from "react";
import CardSwap, { type EasingType } from "./CardSwap";
import { Safari } from "@/components/magicui/safari";
import { cn } from "@/lib/utils";

export interface CardItem {
  title: string;
  imageSrc: string;
}

export interface CardSwapDemoProps {
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  skewAmount?: number;
  pauseOnHover?: boolean;
  height?: number;
  width?: number;
  easing?: EasingType;
  items: CardItem[];
  className?: string;
  onCardClick?: (index: number) => void;
}

const CardSwapDemo: React.FC<CardSwapDemoProps> = ({
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  skewAmount = 6,
  pauseOnHover = false,
  height,
  width,
  easing = "elastic",
  items,
  className,
  onCardClick,
}) => {
  // Memoize Safari elements with responsive positioning
  const safariElements = useMemo(
    () =>
      items.map((item, index) => (
        <Safari
          key={`safari-${item.title}-${index}`}
          url={item.title}
          imageSrc={item.imageSrc}
          className={cn(
            // Responsive positioning: center on mobile, offset on desktop
            "absolute top-1/2 lg:top-full left-0 lg:left-1/2 -translate-x-1/2 -translate-y-1/2",
            // 3D transform optimizations
            "[transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden]",
            "opacity-100"
          )}
        />
      )),
    [items]
  );

  return (
    <CardSwap
      cardDistance={cardDistance}
      verticalDistance={verticalDistance}
      delay={delay}
      skewAmount={skewAmount}
      easing={easing}
      pauseOnHover={pauseOnHover}
      height={height}
      width={width}
      className={cn("[perspective:1000px]", className)}
      onCardClick={onCardClick}
    >
      {safariElements}
    </CardSwap>
  );
};

export default CardSwapDemo;
