import { memo } from "react";
import CardFlip from "../kokonutui/card-flip";
import SEO from "../hook-section/SEOSVG";
import Consolidate from "../hook-section/ConsolidateSVG";
import { Lock, TrendingUp } from "lucide-react";

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
  },
];

export const CardsList = memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  );
});
