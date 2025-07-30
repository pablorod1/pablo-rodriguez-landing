export default function ConsolidateSVG() {
  return (
    <svg
      width="310"
      height="350"
      viewBox="0 0 310 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[340px] drop-shadow-2xl"
      style={{
        transform: "rotateX(18deg) rotateY(-24deg) scale(1.2)",
        perspective: "600px",
      }}
    >
      {/* Capas de escudo para efecto 3D y profundidad */}
      <path
        d="M160 30 L60 70 V140 C60 210 120 260 160 280 C200 260 260 210 260 140 V70 L160 30 Z"
        fill="url(#bgGradientDark)"
        stroke="#ea580c"
        strokeWidth="3.5"
        opacity="0.12"
        filter="url(#blur1)"
        transform="translate(-40, -22) scale(1.12)"
      />
      <path
        d="M160 30 L60 70 V140 C60 210 120 260 160 280 C200 260 260 210 260 140 V70 L160 30 Z"
        fill="url(#shieldGradientOrange)"
        stroke="#ea580c"
        strokeWidth="3.5"
        opacity="0.14"
        filter="url(#blur1)"
        transform="translate(-40, -22) scale(1.12)"
      />
      <path
        d="M160 30 L60 70 V140 C60 210 120 260 160 280 C200 260 260 210 260 140 V70 L160 30 Z"
        fill="url(#shieldGradientOrange2)"
        stroke="#fbbf24"
        strokeWidth="2.5"
        opacity="0.18"
        filter="url(#blur2)"
        transform="translate(-28, -12) scale(1.07)"
      />
      <path
        d="M160 30 L60 70 V140 C60 210 120 260 160 280 C200 260 260 210 260 140 V70 L160 30 Z"
        fill="none"
        stroke="#ea580c"
        strokeWidth="2"
        opacity="0.32"
        filter="url(#shadow)"
        transform="translate(-16, -8) scale(1.03)"
      />

      {/* Escudo frontal dividido en dos para efecto 3D */}
      <path
        d="M160 30 L60 70 V140 C60 210 120 260 160 280 C200 260 260 210 260 140 V70 L160 30 Z"
        fill="#18181bc1"
        stroke="#ea580c"
        strokeWidth="2"
      />

      {/* Maletín con sombra y brillo */}
      <image
        xlinkHref="/check.svg"
        x="120"
        y="100"
        width="80"
        height="80"
        style={{
          filter: "drop-shadow(-2px 2px 2px rgba(0,0,0,0.4))",
        }}
      />

      {/* Línea central doble para dividir el escudo */}

      <defs>
        <linearGradient
          id="bgGradientDark"
          x1="0"
          y1="0"
          x2="310"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#3d2c13" />
        </linearGradient>
        <radialGradient
          id="shieldGradientOrange"
          cx="160"
          cy="160"
          r="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fbbf24" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ea580c" stopOpacity="0.10" />
        </radialGradient>
        <radialGradient
          id="shieldGradientOrange2"
          cx="160"
          cy="160"
          r="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ea580c" stopOpacity="0.18" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0.08" />
        </radialGradient>

        <filter id="blur1" x="-50" y="-50" width="400" height="400">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="blur2" x="-50" y="-50" width="400" height="400">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="shadow" x="-50" y="-50" width="400" height="400">
          <feDropShadow
            dx="0"
            dy="12"
            stdDeviation="6"
            flood-color="#ea580c"
            flood-opacity="0.22"
          />
        </filter>
      </defs>
    </svg>
  );
}
