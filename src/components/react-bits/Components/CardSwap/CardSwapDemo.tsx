import { useState } from "react";

import CardSwap from "./CardSwap";
import { Card } from "@/components/ui/card";
import { Safari } from "@/components/magicui/safari";

interface CardProps {
  title: string;
  imageSrc: string;
}

interface Props {
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  skewAmount?: number;
  pauseOnHover?: boolean;
  height?: number;
  width?: number;
  items: CardProps[];
}

const CardSwapDemo = ({
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  skewAmount = 6,
  pauseOnHover = false,
  height,
  width,
  items,
}: Props) => {
  return (
    <CardSwap
      cardDistance={cardDistance}
      verticalDistance={verticalDistance}
      delay={delay}
      skewAmount={skewAmount}
      easing={"elastic"}
      pauseOnHover={pauseOnHover}
      height={height}
      width={width}
    >
      {items.map((item, index) => (
        <Safari
          url={item.title}
          imageSrc={item.imageSrc}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden]"
        />
      ))}
    </CardSwap>
  );
};

export default CardSwapDemo;
