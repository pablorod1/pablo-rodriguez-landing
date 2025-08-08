import { useState } from "react";
import { motion } from "framer-motion";

export default function ConsolidateSVG() {
  // Parallax tilt for subtle interactivity
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const maxTilt = { x: 5, y: 5 };
  const maxTrans = { x: 4, y: 4 };

  // Streaming step chart config
  const startX = 40; // left of clip
  const chartBottom = 330; // bottom of clip baseline for area closure
  const stepW = 40; // width of each step plateau
  const stepRise = 8; // vertical rise per step (lower y = higher)
  const stepsPerTile = 10; // width = 400, covers clip width (340) with margin
  const tileWidth = stepW * stepsPerTile; // 400
  const baseY = 270; // starting y for the first plateau

  // Smooth trending-up polyline (diagonal) builder for the animated overlay
  // This complements the existing step area by rendering a simple upward-sloping
  // line that we will scroll horizontally using native CSS keyframes in SVG.
  const buildTrendPolyline = (sx: number, sy: number, count: number) => {
    let d = `M ${sx} ${sy}`;
    for (let i = 1; i <= count; i++) {
      const x = sx + i * stepW;
      const y = sy - i * stepRise; // trending up: y decreases each step
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  const buildStepLine = (sx: number, sy: number, count: number) => {
    // e.g., M sx sy H sx+stepW V sy-stepRise H ...
    let d = `M ${sx} ${sy}`;
    for (let i = 1; i <= count; i++) {
      const x = sx + i * stepW;
      const y = sy - i * stepRise;
      d += ` H ${x} V ${y}`;
    }
    return d;
  };

  const buildStepArea = (sx: number, sy: number, count: number) => {
    // Close down to chartBottom to make the filled area
    let d = `M ${sx} ${chartBottom} L ${sx} ${sy}`;
    for (let i = 1; i <= count; i++) {
      const x = sx + i * stepW;
      const y = sy - i * stepRise;
      d += ` H ${x} V ${y}`;
    }
    const endX = sx + count * stepW;
    d += ` L ${endX} ${chartBottom} Z`;
    return d;
  };

  const handleMove: React.MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const nx = px * 2 - 1;
    const ny = py * 2 - 1;
    const ry = nx * maxTilt.y;
    const rx = -ny * maxTilt.x;
    const tx = nx * maxTrans.x;
    const ty = ny * maxTrans.y;
    setTilt({ rx, ry, tx, ty });
  };

  const handleLeave: React.MouseEventHandler<SVGSVGElement> = () => {
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0 });
  };

  return (
    <svg
      width="420"
      height="400"
      viewBox="0 0 420 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[340px] drop-shadow-lg cursor-pointer"
      style={{
        transform: "rotateX(18deg) rotateY(-18deg) scale(1.08)",
        perspective: "2000px",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <defs>
        {/* Inline-scoped CSS for the trending-up line scroller */}
        <style>
          {`
            /*
             * We animate the trending line by translating a group to the left
             * from 0 to -${tileWidth}px. To avoid any visual jump on loop,
             * we render two identical tiles (A and B) spaced by ${tileWidth}px
             * and loop the translation infinitely. This yields a perfectly
             * seamless, continuous scroll.
             */
            @keyframes trendScroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-${tileWidth}px); }
            }
            .trend-scroller {
              animation: trendScroll 6s linear infinite;
              will-change: transform;
              /* Ensure transforms behave predictably inside SVG */
              transform-box: fill-box;
              transform-origin: 0 0;
            }
          `}
        </style>

        {/* Card styling */}
        <linearGradient id="cardFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1b20" />
          <stop offset="100%" stopColor="#121215" />
        </linearGradient>
        <linearGradient id="cardStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a30" />
          <stop offset="100%" stopColor="#0f0f12" />
        </linearGradient>
        <linearGradient id="cardHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Accent colors (brand strength) */}
        <linearGradient id="accent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <radialGradient
          id="accentGlow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(160 150) rotate(90) scale(60 60)"
        >
          <stop offset="0%" stopColor="#b45309" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
        </radialGradient>

        {/* Shadows */}
        <filter
          id="dropLg"
          x="-20%"
          y="-20%"
          width="140%"
          height="160%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy="8" in="SourceAlpha" result="off" />
          <feGaussianBlur in="off" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.35 0"
            result="shadow"
          />
          <feBlend in="SourceGraphic" in2="shadow" mode="normal" />
        </filter>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>

        {/* Sheen sweep */}
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Chart clip area */}
        <clipPath id="chartClip">
          <rect x="40" y="130" width="340" height="200" rx="10" ry="10" />
        </clipPath>

        {/* Stroke gradient for the animated trending line */}
        <linearGradient id="trendStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Parallax wrapper */}
      <motion.g
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate(${tilt.tx}px, ${tilt.ty}px)`,
          transformOrigin: "160px 175px",
          willChange: "transform",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.4 }}
      >
        {/* Card background removed per request */}

        {/* Title & description removed per request */}

        {/* Brand asset pills */}
        <g>
          {[
            { label: "Logo", x: 40, accent: false },
            { label: "Web", x: 110, accent: true },
            { label: "SEO", x: 170, accent: false },
            { label: "RRSS", x: 230, accent: false },
          ].map((pill, idx) => (
            <g key={pill.label}>
              <rect
                x={pill.x}
                y={60}
                width={pill.label.length * 8 + 16}
                height={18}
                rx={9}
                ry={9}
                fill={pill.accent ? "url(#accent)" : "#1f1f25"}
                stroke={pill.accent ? "url(#accent)" : "#2a2a30"}
                strokeWidth={pill.accent ? 1.2 : 1}
                opacity={0.95}
              />
              <text
                x={pill.x + 10}
                y={73}
                fontSize="10"
                fill={pill.accent ? "#fff7ed" : "#d4d4d8"}
                fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
              >
                {pill.label}
              </text>
            </g>
          ))}
        </g>
        {/* Central icons removed per request */}

        {/* Animated area chart (streaming stair tape) */}
        <g clipPath="url(#chartClip)">
          {/* grid lines */}
          {[150, 190, 230, 270, 310].map((gy) => (
            <line
              key={gy}
              x1={40}
              y1={gy}
              x2={380}
              y2={gy}
              stroke="#27272a"
              strokeWidth={1}
              opacity={0.5}
            />
          ))}

          {/* streaming group with two tiles for seamless loop */}
          <motion.g
            initial={{ x: 0 }}
            animate={{ x: [-0, -tileWidth] }}
            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          >
            {/* tile A */}
            <g transform={`translate(0, 0)`}>
              <path
                d={buildStepArea(startX, baseY, stepsPerTile)}
                fill="url(#accent)"
                fillOpacity={0.22}
              />
              <path
                d={buildStepLine(startX, baseY, stepsPerTile)}
                fill="none"
                stroke="#f5f5f5"
                strokeOpacity={0.5}
                strokeWidth={1.25}
              />
              {/* vertex markers for tile A */}
              {Array.from({ length: stepsPerTile + 1 }).map((_, i) => {
                const vx = startX + i * stepW;
                const vy = baseY - i * stepRise;
                const r = i === stepsPerTile ? 4 : 3;
                const fill = i === stepsPerTile ? "#b45309" : "#fff7ed";
                const stroke = i === stepsPerTile ? "#fff7ed" : "#b45309";
                const style =
                  i === stepsPerTile ? { filter: "url(#softGlow)" } : undefined;
                return (
                  <circle
                    key={`a-${i}`}
                    cx={vx}
                    cy={vy}
                    r={r}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={0.75}
                    style={style}
                  />
                );
              })}
            </g>
            {/* tile B */}
            <g transform={`translate(${tileWidth}, 0)`}>
              <path
                d={buildStepArea(startX, baseY, stepsPerTile)}
                fill="url(#accent)"
                fillOpacity={0.22}
              />
              <path
                d={buildStepLine(startX, baseY, stepsPerTile)}
                fill="none"
                stroke="#f5f5f5"
                strokeOpacity={0.5}
                strokeWidth={1.25}
              />
              {Array.from({ length: stepsPerTile + 1 }).map((_, i) => {
                const vx = startX + i * stepW;
                const vy = baseY - i * stepRise;
                const r = i === stepsPerTile ? 4 : 3;
                const fill = i === stepsPerTile ? "#b45309" : "#fff7ed";
                const stroke = i === stepsPerTile ? "#fff7ed" : "#b45309";
                const style =
                  i === stepsPerTile ? { filter: "url(#softGlow)" } : undefined;
                return (
                  <circle
                    key={`b-${i}`}
                    cx={vx}
                    cy={vy}
                    r={r}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={0.75}
                    style={style}
                  />
                );
              })}
            </g>
          </motion.g>

          {/*
            Native CSS animated trending-up line overlay
            - Double-tiling and translation create a seamless, infinite scroll
            - Kept lightweight and independent from framer-motion
          */}
          <g className="trend-scroller" pointerEvents="none">
            {/* tile A */}
            <g transform={`translate(0, 0)`}>
              <path
                d={buildTrendPolyline(startX, baseY, stepsPerTile)}
                fill="none"
                stroke="url(#trendStroke)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "url(#softGlow)" }}
                opacity={0.95}
              />
            </g>
            {/* tile B */}
            <g transform={`translate(${tileWidth}, 0)`}>
              <path
                d={buildTrendPolyline(startX, baseY, stepsPerTile)}
                fill="none"
                stroke="url(#trendStroke)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "url(#softGlow)" }}
                opacity={0.95}
              />
            </g>
          </g>
        </g>
        {/* Removed badge sheen sweep */}
      </motion.g>
    </svg>
  );
}
