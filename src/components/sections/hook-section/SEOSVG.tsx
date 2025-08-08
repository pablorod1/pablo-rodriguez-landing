import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

const SearchResultsSVG = () => {
  const searchTexts = [
    "asesoría alicante",
    "inmobiliaria valencia",
    "floristería madrid",
  ];
  const charSpeed = 80; // ms por carácter
  const preResultsDelay = 150; // ms tras terminar de escribir
  const resultsVisibleMs = 2000; // ms que permanecen visibles los resultados
  const postResultsDelay = 400; // ms antes de iniciar la siguiente búsqueda

  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const currentText = searchTexts[currentIndex];

  // Ciclo infinito: escribir -> mostrar resultados con stagger -> ocultar -> siguiente término
  useEffect(() => {
    let typeInterval: number | undefined;
    let showTimeout: number | undefined;
    let hideTimeout: number | undefined;
    let nextTimeout: number | undefined;

    // reset
    setDisplayText("");
    setShowResults(false);

    let i = 0;
    typeInterval = window.setInterval(() => {
      setDisplayText(currentText.slice(0, i));
      i++;
      if (i > currentText.length) {
        window.clearInterval(typeInterval);
        // pequeña pausa y mostramos resultados
        showTimeout = window.setTimeout(() => {
          setShowResults(true);
          // tras un tiempo visible, ocultamos y avanzamos al siguiente término
          hideTimeout = window.setTimeout(() => {
            setShowResults(false);
            nextTimeout = window.setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % searchTexts.length);
            }, postResultsDelay);
          }, resultsVisibleMs);
        }, preResultsDelay);
      }
    }, charSpeed);

    return () => {
      if (typeInterval) window.clearInterval(typeInterval);
      if (showTimeout) window.clearTimeout(showTimeout);
      if (hideTimeout) window.clearTimeout(hideTimeout);
      if (nextTimeout) window.clearTimeout(nextTimeout);
    };
  }, [
    currentIndex,
    currentText,
    charSpeed,
    preResultsDelay,
    resultsVisibleMs,
    postResultsDelay,
    searchTexts.length,
  ]);

  const resultStagger = 0.3; // s entre cada card

  // Variants para framer-motion (stagger tras completar el typing)
  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: resultStagger,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <svg
      width="360"
      height="350"
      viewBox="0 0 320 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[340px] drop-shadow-lg cursor-pointer"
      style={{
        transform: "rotateX(18deg) rotateY(-18deg) scale(1.08)",
        perspective: "2000px",
      }}
    >
      <defs>
        {/* Relleno del buscador con leve gradiente vertical */}
        <linearGradient id="sbFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1b20" />
          <stop offset="100%" stopColor="#121215" />
        </linearGradient>

        {/* Trazo con sutil gradiente para dar volumen al borde */}
        <linearGradient id="sbStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a30" />
          <stop offset="100%" stopColor="#0f0f12" />
        </linearGradient>

        {/* Sombra exterior suave */}
        <filter
          id="sbDrop"
          x="-20%"
          y="-30%"
          width="140%"
          height="180%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy="8" in="SourceAlpha" result="off" />
          <feGaussianBlur stdDeviation="10" in="off" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.35 0"
            result="shadow"
          />
          <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
        </filter>

        {/* Sombra interior para efecto ahuecado */}
        <filter
          id="sbInner"
          x="-5%"
          y="-20%"
          width="110%"
          height="140%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite
            in="blur"
            in2="SourceAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
            result="innerShadow"
          />
          <feColorMatrix
            in="innerShadow"
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.65 0"
          />
        </filter>

        {/* Destello superior sutil */}
        <linearGradient id="sbHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Glow cálido bajo el icono */}
        <radialGradient
          id="sbGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(38 26) rotate(90) scale(18 18)"
        >
          <stop offset="0%" stopColor="#b45309" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
        </radialGradient>

        {/* ===== Cards: gradients y filtros ===== */}
        <linearGradient id="cardFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1f" />
          <stop offset="100%" stopColor="#121216" />
        </linearGradient>
        <linearGradient id="cardStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a30" />
          <stop offset="100%" stopColor="#0e0e12" />
        </linearGradient>
        <filter
          id="cardDrop"
          x="-15%"
          y="-25%"
          width="130%"
          height="160%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy="6" in="SourceAlpha" result="off" />
          <feGaussianBlur stdDeviation="8" in="off" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.28 0"
            result="shadow"
          />
          <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
        </filter>
        <filter
          id="cardInner"
          x="-5%"
          y="-20%"
          width="110%"
          height="140%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feComposite
            in="blur"
            in2="SourceAlpha"
            operator="arithmetic"
            k2="-1"
            k3="1"
            result="innerShadow"
          />
          <feColorMatrix
            in="innerShadow"
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.55 0"
          />
        </filter>
        <linearGradient id="cardHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Variante acento para el primer resultado */}
        <linearGradient id="cardFillPrimary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#221a14" />
          <stop offset="100%" stopColor="#18120d" />
        </linearGradient>
        <linearGradient id="cardStrokePrimary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter
          id="cardGlowPrimary"
          x="-30%"
          y="-40%"
          width="160%"
          height="200%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.725   0 0 0 0 0.325   0 0 0 0 0.035   0 0 0 0.35 0"
          />
        </filter>
        <radialGradient
          id="wreathGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(240 92) rotate(90) scale(30 30)"
        >
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Barra de búsqueda con profundidad */}
      <g filter="url(#sbDrop)">
        {/* base */}
        <rect
          x="20"
          y="10"
          rx="14"
          ry="14"
          width="280"
          height="34"
          fill="url(#sbFill)"
          stroke="url(#sbStroke)"
          strokeWidth="1.5"
        />
        {/* sombra interior (rect con alpha mínimo para activar SourceAlpha) */}
        <rect
          x="20"
          y="10"
          rx="14"
          ry="14"
          width="280"
          height="34"
          fill="#000"
          fillOpacity="0.001"
          filter="url(#sbInner)"
        />
        {/* brillo superior */}
        <rect
          x="22"
          y="12"
          rx="12"
          ry="12"
          width="276"
          height="12"
          fill="url(#sbHighlight)"
        />
        {/* glow debajo del icono */}
        <circle cx="38" cy="26" r="16" fill="url(#sbGlow)" />
      </g>

      {/* Icono Google */}
      <image
        xlinkHref="/icons/google.svg"
        x="30"
        y="20"
        width="16"
        height="16"
      />

      {/* Texto buscador */}
      <text x="54" y="30" fill="#a1a1aa" fontSize="12" fontFamily="sans-serif">
        {displayText}
      </text>

      {/* Cursor parpadeante */}
      {displayText.length < currentText.length && (
        <rect
          x={54 + displayText.length * 5.3}
          y="20"
          width="2"
          height="14"
          fill="#a1a1aa"
        >
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      {/* Listado de resultados (Framer Motion con stagger) */}
      <motion.g
        initial="hidden"
        animate={showResults ? "show" : "hidden"}
        variants={containerVariants}
      >
        {[0, 1, 2, 3].map((i) => {
          const cardY = 56 + i * 74;
          const isFirst = i === 0;
          return (
            <motion.g key={i} variants={itemVariants}>
              {/* Card con profundidad */}
              <g filter="url(#cardDrop)">
                {/* base */}
                <rect
                  x={24}
                  y={cardY}
                  rx="12"
                  ry="12"
                  width="254"
                  height="62"
                  fill={isFirst ? "url(#cardFillPrimary)" : "url(#cardFill)"}
                  stroke={
                    isFirst ? "url(#cardStrokePrimary)" : "url(#cardStroke)"
                  }
                  strokeWidth={isFirst ? "2" : "1"}
                />
                {/* sombra interior */}
                <rect
                  x={24}
                  y={cardY}
                  rx="12"
                  ry="12"
                  width="254"
                  height="62"
                  fill="#000"
                  fillOpacity="0.001"
                  filter="url(#cardInner)"
                />
                {/* highlight superior */}
                <rect
                  x={26}
                  y={cardY + 2}
                  rx="10"
                  ry="10"
                  width="250"
                  height="10"
                  fill="url(#cardHighlight)"
                />
              </g>

              {/* Logo */}
              <circle
                cx={46}
                cy={cardY + 18}
                r="8"
                fill={isFirst ? "#b45309" : "#27272a"}
              />

              {/* Título */}
              <rect
                x={38}
                y={cardY + 30}
                rx="4"
                ry="4"
                width={isFirst ? 110 : 80}
                height="10"
                fill={isFirst ? "#b45309" : "#27272a"}
              />

              {/* URL */}
              <rect
                x={38}
                y={cardY + 44}
                rx="3"
                ry="3"
                width={isFirst ? 70 : 50}
                height="6"
                fill={isFirst ? "#a16207" : "#52525b"}
              />

              {/* Descripción para los no primeros */}
              {!isFirst && (
                <>
                  <rect
                    x={130}
                    y={cardY + 30}
                    rx="3"
                    ry="3"
                    width={60}
                    height={7}
                    fill="#27272a"
                  />
                  <rect
                    x={130}
                    y={cardY + 40}
                    rx="2"
                    ry="2"
                    width={40}
                    height={5}
                    fill="#27272a"
                  />
                </>
              )}

              {/* Icono corona para el primero */}
              {isFirst && (
                <>
                  {/* Glow detrás de la corona */}
                  <image
                    href="/icons/laurel-wreath-1.svg"
                    width="40"
                    height="40"
                    x="220"
                    y={cardY + 12}
                    opacity="1"
                  />
                  <circle
                    cx={240}
                    cy={cardY + 30}
                    r="24"
                    fill="url(#wreathGlow)"
                  />
                </>
              )}
            </motion.g>
          );
        })}
      </motion.g>
    </svg>
  );
};

export default SearchResultsSVG;
