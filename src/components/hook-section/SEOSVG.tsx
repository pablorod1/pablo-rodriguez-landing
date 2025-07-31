const SearchResultsSVG = () => {
  return (
    <svg
      width="360"
      height="350"
      viewBox="0 0 320 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[340px] drop-shadow-lg"
      style={{
        transform: "rotateX(18deg) rotateY(-24deg) scale(1.08)",
        perspective: "600px",
      }}
    >
      {/* Search bar */}
      <rect
        x="24"
        y="12"
        rx="14"
        ry="14"
        width="270"
        height="30"
        fill="#18181b"
        stroke="#27272a"
        strokeWidth="1.5"
      />
      <rect
        x="18"
        y="8"
        rx="14"
        ry="14"
        width="270"
        height="30"
        fill="none"
        stroke="#27272a"
        strokeWidth="1.5"
        opacity={0.8}
      />
      {/* Google icon */}
      <image
        xlinkHref="/icons/google.svg"
        x="30"
        y="20"
        width="16"
        height="16"
      />

      {/* Search input */}
      <rect
        x="54"
        y="20"
        rx="4"
        ry="4"
        width="210"
        height="14"
        fill="#27272a"
      />
      {/* Search icon */}
      <image
        xlinkHref="/icons/search.svg"
        x="272"
        y="21"
        width="12"
        height="12"
        stroke="#27272a"
      />

      {/* Search results */}
      {[0, 1, 2, 3].map((i) => (
        <g
          key={i}
          style={{
            filter:
              i === 0
                ? "drop-shadow(0 4px 16px rgba(255,140,0,0.18))"
                : "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
          }}
        >
          {/* Card background */}
          <rect
            x={24}
            y={56 + i * 74}
            rx="12"
            ry="12"
            width="254"
            height="62"
            fill={i === 0 ? "#1c1917" : "#18181b"}
            stroke={i === 0 ? "#b45309" : "#27272a"}
            strokeWidth={i === 0 ? "2" : "1"}
            z="1"
          />
          <rect
            x={18}
            y={52 + i * 74}
            rx="12"
            ry="12"
            width="254"
            height="62"
            fill="none"
            stroke={i === 0 ? "#b45309" : "#27272a"}
            strokeWidth="1"
            z="-1"
            opacity={0.8}
          />

          {/* Logo Skeleton */}
          <circle
            cx={46}
            cy={74 + i * 74}
            r={"8"}
            fill={i === 0 ? "#b45309" : "#27272a"}
          />
          {/* Title skeleton */}
          <rect
            x={38}
            y={86 + i * 74}
            rx="4"
            ry="4"
            width={i === 0 ? 110 : 80}
            height="10"
            fill={i === 0 ? "#b45309" : "#27272a"}
          />
          {/* URL skeleton */}
          <rect
            x={38}
            y={99 + i * 74}
            rx="3"
            ry="3"
            width={i === 0 ? 70 : 50}
            height="6"
            fill={i === 0 ? "#a16207" : "#52525b"}
          />
          {/* Description skeleton */}
          {i !== 0 ? (
            <>
              <rect
                x={130}
                y={86 + i * 74}
                rx="3"
                ry="3"
                width={60}
                height={7}
                fill="#27272a"
              />
              <rect
                x={130}
                y={96 + i * 74}
                rx="2"
                ry="2"
                width={40}
                height={5}
                fill="#27272a"
              />
            </>
          ) : null}
          {/* Highlight for first result */}
          {i === 0 && (
            <image
              xlinkHref="/icons/laurel-wreath-1.svg"
              x="220"
              y="68"
              width="36"
              height="36"
              fill="#b45309"
            />
          )}
        </g>
      ))}

      <defs>
        <filter id="glow" x="0" y="0" width="260" height="120">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

export default SearchResultsSVG;
