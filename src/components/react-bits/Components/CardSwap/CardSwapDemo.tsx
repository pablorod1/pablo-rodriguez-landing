import CardSwap from "./CardSwap";
import { Safari } from "@/components/magicui/safari";
import { useMemo } from "react";

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
  // Memoizar elementos Safari para evitar re-renders innecesarios
  const safariElements = useMemo(
    () =>
      items.map((item, index) => (
        <Safari
          key={`safari-${item.title}-${index}`}
          url={item.title}
          imageSrc={item.imageSrc}
          className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] opacity-100"
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
      easing={"elastic"}
      pauseOnHover={pauseOnHover}
      height={height}
      width={width}
    >
      {safariElements}
    </CardSwap>
  );
};

export default CardSwapDemo;
