import { memo } from "react";
import CardFlip from "../../kokonutui/card-flip";
import SEO from "./SEOSVG";
import Consolidate from "./ConsolidateSVG";
import { Lock, TrendingUp, Trophy } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { CompetitorsSVG } from "./CompetitorsSVG";

const cards = [
  {
    title: "Aumenta tu visibilidad",
    description: "Aparece en Google y gana visibilidad local.",
    svgImage: <SEO />,
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    title: "Consolida tu marca",
    description: "Una web moderna transmite confianza y profesionalismo.",
    svgImage: <Consolidate />,
    icon: <Lock className="w-4 h-4" />,
  },
  {
    title: "Diferénciate de la competencia",
    description: "Una web bien estructurada marca la diferencia.",
    svgImage: <CompetitorsSVG />,
    icon: <Trophy className="w-4 h-4" />,
  },
];

export const CardsList = memo(() => {
  return (
    <ScrollArea className="w-full whitespace-nowrap overflow-x-auto">
      <div className="flex w-full p-4 lg:p-0 overflow-x-auto gap-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-hidden">
        {cards.map((card, idx) => (
          <CardFlip
            title={card.title}
            description={card.description}
            svgImage={card.svgImage}
            ctaText="Quiero mi página web"
            icon={card.icon}
            key={idx}
          />
        ))}
      </div>
    </ScrollArea>
  );
});
