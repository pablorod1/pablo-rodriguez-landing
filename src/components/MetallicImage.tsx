import { div } from "framer-motion/client";
import MetallicPaint, {
  parseLogoImage,
} from "./react-bits/Animations/MetallicPaint/MetallicPaint";
import { useState, useEffect } from "react";

// SVG logo as a string with padding - this ensures it works correctly with the metallic effect
const svgString = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="1024.000000pt" height="1024.000000pt" viewBox="0 0 1024.000000 1024.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M2080 5215 l0 -1935 385 0 385 0 0 654 0 655 793 4 c771 3 795 4 889
25 274 62 470 169 638 349 210 225 320 529 320 883 -1 387 -114 677 -364 926
-216 215 -471 331 -800 363 -70 7 -500 11 -1178 11 l-1068 0 0 -1935z m2294
1171 c182 -54 306 -179 353 -357 20 -77 22 -240 3 -319 -32 -138 -132 -264
-256 -322 -122 -57 -134 -58 -911 -58 l-713 0 0 541 0 540 733 -4 c664 -3 737
-5 791 -21z"/>
<path d="M4850 7146 c0 -3 26 -19 58 -36 213 -113 461 -379 592 -632 l35 -67
695 -4 c756 -4 733 -2 856 -62 197 -96 301 -347 253 -611 -36 -199 -196 -352
-408 -390 -59 -10 -223 -13 -732 -14 l-656 0 -46 -92 c-25 -51 -157 -277 -293
-503 -135 -225 -322 -536 -415 -690 l-168 -280 250 -3 c138 -1 249 -6 247 -10
-37 -70 -241 -490 -283 -582 -112 -243 -195 -433 -192 -437 7 -6 864 907 1275
1357 l141 155 -243 5 -244 5 105 125 c57 69 119 144 136 167 l32 42 285 0 285
0 56 -92 c31 -51 90 -146 131 -212 41 -66 197 -319 347 -562 l273 -443 445 0
444 0 -12 23 c-26 48 -623 1026 -767 1254 l-70 112 81 27 c218 72 426 222 551
397 89 125 161 295 201 477 25 114 32 400 12 525 -46 290 -170 533 -368 719
-162 154 -359 251 -624 308 -98 21 -117 22 -1182 25 -596 2 -1083 2 -1083 -1z"/>
</g>
</svg>`;

const MetallicImage = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    setIsBrowser(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    if (!isBrowser) return;

    async function loadDefaultImage() {
      try {
        setIsLoading(true);
        setError(null);

        // Create a blob from the SVG string
        const blob = new Blob([svgString], { type: "image/svg+xml" });

        // Create a file from the blob
        const file = new File([blob], "favicon.svg", { type: "image/svg+xml" });

        const parsedData = await parseLogoImage(file);

        if (parsedData?.imageData) {
          setImageData(parsedData.imageData);
        } else {
          console.error("No imageData in parsed result");
          throw new Error("Failed to parse image data");
        }
      } catch (err) {
        console.error("Error in loadDefaultImage:", err);
        console.error(
          "Error stack:",
          err instanceof Error ? err.stack : "No stack trace"
        );
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }

    loadDefaultImage();
  }, [isBrowser]);

  // Don't render anything during SSR
  if (!isBrowser) {
    return null;
  }

  if (!imageData) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="rounded-lg w-16 h-16 bg-gray-900 animate-pulse"></div>
    );
  }

  return (
    <MetallicPaint
      imageData={imageData}
      params={{
        edge: 0.1, // Reduced from 2 to make edges more visible
        patternBlur: 0.02, // Increased blur for better visibility
        patternScale: 1, // Reduced scale
        refraction: 0.02, // Increased refraction
        speed: 0.3, // Increased speed
        liquid: 0.5, // Increased liquid effect
      }}
    />
  );
};

export default MetallicImage;
