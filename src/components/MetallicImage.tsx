import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
  lazy,
  Suspense,
  useTransition,
  startTransition,
} from "react";

// Lazy load the MetallicPaint component for better performance
const MetallicPaintComponent = lazy(
  () => import("./react-bits/Animations/MetallicPaint/MetallicPaint")
);

// SVG logo as a string - optimized for faster rendering
const svgString = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="64" height="64" viewBox="0 0 1024.000000 1024.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)"
fill="currentColor" stroke="none">
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

// Memoized simple logo component to prevent re-renders
const SimpleLogo = memo(({ className = "" }: { className?: string }) => (
  <div
    className={`w-16 h-16 text-white ${className}`}
    dangerouslySetInnerHTML={{ __html: svgString }}
  />
));

SimpleLogo.displayName = "SimpleLogo";

// Optimized cache management for better memory handling
class ImageDataCache {
  private cache = new Map<string, ImageData>();
  private maxSize = 5; // Reduced cache size for memory efficiency

  set(key: string, data: ImageData) {
    // Clear old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, data);
  }

  get(key: string): ImageData | null {
    return this.cache.get(key) || null;
  }

  clear() {
    this.cache.clear();
  }
}

const imageDataCache = new ImageDataCache();

// Hook para manejar la carga lazy del componente MetallicPaint
const useMetallicPaintLoader = () => {
  const [parseLogoImageFn, setParseLogoImageFn] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadParseFunction = useCallback(async () => {
    if (parseLogoImageFn || isLoading) return;

    setIsLoading(true);
    try {
      const module = await import(
        "./react-bits/Animations/MetallicPaint/MetallicPaint"
      );
      setParseLogoImageFn(() => module.parseLogoImage);
    } catch (error) {
      console.error("Failed to load parseLogoImage function:", error);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [parseLogoImageFn, isLoading]);

  return { parseLogoImageFn, loadError, isLoading, loadParseFunction };
};

const MetallicImage = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoadEffect, setShouldLoadEffect] = useState(false);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isPending, startTransition] = useTransition();

  const { parseLogoImageFn, loadError, isLoading, loadParseFunction } =
    useMetallicPaintLoader();

  // Check if we're in the browser only once
  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  // Optimized parameters - memoized to prevent re-creation
  const optimizedParams = useMemo(
    () => ({
      edge: 0.2,
      patternBlur: 0.04,
      patternScale: 0.8,
      refraction: 0.01,
      speed: 0.15, // Reduced speed for better performance
      liquid: 0.3,
    }),
    []
  );

  // Process image with optimized cache management
  const processImageWithCache = useCallback(async () => {
    if (!parseLogoImageFn || !isBrowser || isProcessing) {
      return;
    }

    // Return cached data if available from component-level cache
    const cacheKey = "metallic-logo-svg";
    if (imageDataCache.get(cacheKey)) {
      setImageData(imageDataCache.get(cacheKey));
      return;
    }

    try {
      setIsProcessing(true);

      // Create a smaller blob for faster processing
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const file = new File([blob], "logo.svg", { type: "image/svg+xml" });

      const parsedData = await parseLogoImageFn(file);

      if (parsedData?.imageData) {
        imageDataCache.set(cacheKey, parsedData.imageData); // Cache the result
        setImageData(parsedData.imageData);
      }
    } catch (error) {
      console.error("Error processing metallic effect:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [parseLogoImageFn, isBrowser, isProcessing]);

  // Intersection Observer with better cleanup and performance
  useEffect(() => {
    if (!isBrowser || !containerRef.current) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;

        if (nowVisible !== isVisible) {
          startTransition(() => {
            setIsVisible(nowVisible);

            if (nowVisible && !shouldLoadEffect) {
              // Trigger loading with transition for non-urgent update
              setTimeout(() => setShouldLoadEffect(true), 300);
            }
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Load earlier for smoother experience
      }
    );

    observerRef.current = observer;
    observer.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isBrowser, isVisible, shouldLoadEffect]);

  // Load parse function when needed
  useEffect(() => {
    if (shouldLoadEffect && !parseLogoImageFn && !isLoading) {
      loadParseFunction();
    }
  }, [shouldLoadEffect, parseLogoImageFn, isLoading, loadParseFunction]);

  // Process the image only when necessary with idle callback
  useEffect(() => {
    if (!shouldLoadEffect || !parseLogoImageFn || isProcessing) return;

    // Use requestIdleCallback for better performance
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(
        () => {
          startTransition(() => {
            processImageWithCache();
          });
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        startTransition(() => {
          processImageWithCache();
        });
      }, 100);
    }
  }, [shouldLoadEffect, parseLogoImageFn, isProcessing, processImageWithCache]);

  // Don't render anything during SSR
  if (!isBrowser) {
    return null;
  }

  // Show simple logo while loading, if effect failed, or if not visible
  if (!isVisible || loadError || !imageData) {
    return (
      <div ref={containerRef} className="w-16 h-16">
        <SimpleLogo
          className={isProcessing || isPending ? "animate-pulse" : ""}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-16 h-16">
      <Suspense fallback={<SimpleLogo className="animate-pulse" />}>
        <MetallicPaintComponent
          imageData={imageData}
          params={optimizedParams}
        />
      </Suspense>
    </div>
  );
});

MetallicImage.displayName = "MetallicImage";

export default MetallicImage;
