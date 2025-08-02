/**
 * @author: @dorian_baffier
 * @description: Background Paths
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { memo, useMemo } from "react";
import { motion } from "motion/react";

interface Point {
  x: number;
  y: number;
}

interface PathData {
  id: string;
  d: string;
  opacity: number;
  width: number;
  duration: number;
  delay: number;
}

// Path generation function
function generateAestheticPath(
  index: number,
  position: number,
  type: "primary" | "secondary" | "accent"
): string {
  const baseAmplitude =
    type === "primary" ? 150 : type === "secondary" ? 100 : 60;
  const phase = index * 0.2;
  const points: Point[] = [];
  const segments = type === "primary" ? 10 : type === "secondary" ? 8 : 6;

  const startX = 2400;
  const startY = 800;
  const endX = -2400;
  const endY = -800 + index * 25;

  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const eased = 1 - (1 - progress) ** 2;

    const baseX = startX + (endX - startX) * eased;
    const baseY = startY + (endY - startY) * eased;

    const amplitudeFactor = 1 - eased * 0.3;
    const wave1 =
      Math.sin(progress * Math.PI * 3 + phase) *
      (baseAmplitude * 0.7 * amplitudeFactor);
    const wave2 =
      Math.cos(progress * Math.PI * 4 + phase) *
      (baseAmplitude * 0.3 * amplitudeFactor);
    const wave3 =
      Math.sin(progress * Math.PI * 2 + phase) *
      (baseAmplitude * 0.2 * amplitudeFactor);

    points.push({
      x: baseX * position,
      y: baseY + wave1 + wave2 + wave3,
    });
  }

  const pathCommands = points.map((point: Point, i: number) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prevPoint = points[i - 1];
    const tension = 0.4;
    const cp1x = prevPoint.x + (point.x - prevPoint.x) * tension;
    const cp1y = prevPoint.y;
    const cp2x = prevPoint.x + (point.x - prevPoint.x) * (1 - tension);
    const cp2y = point.y;
    return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  });

  return pathCommands.join(" ");
}

const generateUniqueId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

// Memoized FloatingPaths component
const FloatingPaths = memo(function FloatingPaths({
  position,
}: {
  position: number;
}) {
  // Increased number of paths while maintaining optimization
  const primaryPaths: PathData[] = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: generateUniqueId("primary"),
        d: generateAestheticPath(i, position, "primary"),
        opacity: 0.15 + i * 0.02,
        width: 4 + i * 0.3,
        duration: 100,
        delay: 0,
      })),
    [position]
  );

  const secondaryPaths: PathData[] = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: generateUniqueId("secondary"),
        d: generateAestheticPath(i, position, "secondary"),
        opacity: 0.12 + i * 0.015,
        width: 3 + i * 0.25,
        duration: 95,
        delay: 0,
      })),
    [position]
  );

  const accentPaths: PathData[] = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: generateUniqueId("accent"),
        d: generateAestheticPath(i, position, "accent"),
        opacity: 0.08 + i * 0.12,
        width: 2 + i * 0.2,
        duration: 90,
        delay: 0,
      })),
    [position]
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full text-slate-950/40 dark:text-white/40"
        viewBox="-2400 -800 4800 1600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Background Paths</title>
        <defs>
          <linearGradient id="sharedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(200, 90, 0, 0.6)" />
            <stop offset="50%" stopColor="rgba(210, 110, 0, 0.6)" />
            <stop offset="100%" stopColor="rgba(180, 120, 50, 0.6)" />
          </linearGradient>
        </defs>

        <g className="primary-waves">
          {primaryPaths.map((path, index) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="url(#sharedGradient)"
              strokeWidth={path.width}
              strokeLinecap="round"
              initial={{ opacity: 0, scale: 0.8, x: -100 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, 50, 0, -50, 0],
                y: [0, -15, 0, 15, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                opacity: { duration: 1.5 },
                scale: { duration: 2 },
                x: {
                  duration: 12 + index * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.2,
                },
                y: {
                  duration: 8 + index * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.1,
                },
                rotate: {
                  duration: 15 + index * 0.4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.15,
                },
              }}
              style={{ opacity: path.opacity }}
            />
          ))}
        </g>

        <g className="secondary-waves" style={{ opacity: 0.8 }}>
          {secondaryPaths.map((path, index) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="url(#sharedGradient)"
              strokeWidth={path.width}
              strokeLinecap="round"
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, -30, 0, 30, 0],
                y: [0, -10, 0, 10, 0],
                rotate: [0, -1.5, 0, 1.5, 0],
              }}
              transition={{
                opacity: { duration: 1.2 },
                scale: { duration: 2.5 },
                x: {
                  duration: 10 + index * 0.4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.15,
                },
                y: {
                  duration: 6 + index * 0.25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.08,
                },
                rotate: {
                  duration: 13 + index * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.12,
                },
              }}
              style={{ opacity: path.opacity }}
            />
          ))}
        </g>

        <g className="accent-waves" style={{ opacity: 0.6 }}>
          {accentPaths.map((path, index) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="url(#sharedGradient)"
              strokeWidth={path.width}
              strokeLinecap="round"
              initial={{ opacity: 0, scale: 0.95, x: -50 }}
              animate={{
                opacity: 1,
                scale: [1, 1.05, 1, 0.95, 1],
                x: [0, 20, 0, -20, 0],
                y: [0, -5, 0, 5, 0],
                rotate: [0, 1, 0, -1, 0],
              }}
              transition={{
                opacity: { duration: 1 },
                scale: {
                  duration: 8 + index * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.1,
                },
                x: {
                  duration: 7 + index * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.05,
                },
                y: {
                  duration: 4 + index * 0.15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.03,
                },
                rotate: {
                  duration: 9 + index * 0.25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.07,
                },
              }}
              style={{ opacity: path.opacity }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default memo(function BackgroundPaths() {
  return (
    <div className="fixed inset-0 z-0">
      <FloatingPaths position={-1} />
    </div>
  );
});
