"use client";

import { motion } from "framer-motion";
import { useMindCare } from "@/context/MindCareContext";
import { getAIColors } from "@/lib/aiColors";

type Size = "sm" | "md" | "lg";

interface AvatarAIProps {
  size?: Size;
  animated?: boolean;
  onClick?: () => void;
}

const sizeMap: Record<Size, number> = { sm: 48, md: 72, lg: 120 };

// ─── Hair ────────────────────────────────────────────────────────────────────
function Hair({ type, color }: { type: string; color: string }) {
  const s = { stroke: "var(--color-text-primary)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "short":
      return (
        <g fill={color} {...s}>
          <path d="M-20,-20 C-16,-34 16,-34 20,-20 L17,-18 C14,-30 -14,-30 -17,-18 Z" />
        </g>
      );
    case "bun":
      return (
        <g fill={color} {...s} fillOpacity="1">
          <path d="M-12,-21 C-8,-31 8,-31 12,-21" fill="none" />
          <circle cx="0" cy="-30" r="6" />
        </g>
      );
    case "fluffy":
      return (
        <g fill={color} {...s}>
          <path d="M-18,-20 C-16,-34 -8,-38 0,-35 C8,-38 16,-34 18,-20 C12,-27 6,-29 0,-28 C-6,-29 -12,-27 -18,-20 Z" />
        </g>
      );
    case "spiky":
      return (
        <g fill={color} {...s}>
          <polygon points="-15,-22 -10,-36 -5,-22" />
          <polygon points="-2,-23 2,-37 6,-23" />
          <polygon points="5,-22 10,-36 15,-22" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Eyes ─────────────────────────────────────────────────────────────────────
function EyeStyle({ type }: { type: string }) {
  switch (type) {
    case "happy":
      return (
        <>
          <path d="M-14,-4 Q-11,-9 -8,-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M8,-4 Q11,-9 14,-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      );
    case "star":
      return (
        <>
          <g transform="translate(-11,-5) scale(0.9)">
            <polygon points="0,-4 1.2,-1.2 4,-1.2 2,0.8 2.8,4 0,2 -2.8,4 -2,0.8 -4,-1.2 -1.2,-1.2" fill="currentColor" />
          </g>
          <g transform="translate(11,-5) scale(0.9)">
            <polygon points="0,-4 1.2,-1.2 4,-1.2 2,0.8 2.8,4 0,2 -2.8,4 -2,0.8 -4,-1.2 -1.2,-1.2" fill="currentColor" />
          </g>
        </>
      );
    case "heart":
      return (
        <>
          <path d="M-11,-7 C-12.5,-9 -15,-8.5 -15,-6.5 C-15,-4.5 -11,-2 -11,-2 C-11,-2 -7,-4.5 -7,-6.5 C-7,-8.5 -9.5,-9 -11,-7 Z" fill="currentColor" />
          <path d="M11,-7 C9.5,-9 7,-8.5 7,-6.5 C7,-4.5 11,-2 11,-2 C11,-2 15,-4.5 15,-6.5 C15,-8.5 12.5,-9 11,-7 Z" fill="currentColor" />
        </>
      );
    case "wink":
      return (
        <>
          <circle cx="-11" cy="-5" r="3" fill="currentColor" />
          <circle cx="-10" cy="-6" r="1" fill="white" opacity="0.6" />
          <path d="M8,-3 Q11,-8 14,-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      );
    default: // round
      return (
        <>
          <circle cx="-11" cy="-5" r="3" fill="currentColor" />
          <circle cx="11" cy="-5" r="3" fill="currentColor" />
          <circle cx="-10" cy="-6" r="1" fill="white" opacity="0.6" />
          <circle cx="12" cy="-6" r="1" fill="white" opacity="0.6" />
        </>
      );
  }
}

// ─── Mouth ────────────────────────────────────────────────────────────────────
function MouthStyle({ type }: { type: string }) {
  switch (type) {
    case "big":
      return <path d="M-9,3 Q0,14 9,3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    case "neutral":
      return <line x1="-5" y1="6" x2="5" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />;
    case "tongue":
      return (
        <>
          <path d="M-7,3 Q0,13 7,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="0" cy="10" rx="3" ry="2.5" fill="#ff90e8" opacity="0.75" />
        </>
      );
    default: // smile
      return <path d="M-6,4 Q0,12 6,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AvatarAI({ size = "md", animated = true, onClick }: AvatarAIProps) {
  const ctx = useMindCare();
  const colors = getAIColors(ctx.ai.color);
  const px = sizeMap[size];
  const gradId = `avatar-grad-${size}`;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${onClick ? "cursor-pointer" : ""}`}
      style={{ width: px, height: px + (size === "lg" ? 14 : size === "md" ? 10 : 6) }}
      animate={animated ? { y: [0, -4, 0] } : {}}
      transition={animated ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <svg
        viewBox="-30 -42 60 72"
        width={px}
        height={px}
        className="text-border-main"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>

        {/* Hair behind face */}
        <Hair type={ctx.ai.hair} color={colors.from} />

        {/* Face */}
        <circle cx="0" cy="0" r="26" fill={`url(#${gradId})`} stroke="currentColor" strokeWidth="2.5" />

        {/* Blush */}
        <circle cx="-17" cy="6" r="4.5" fill={colors.from} opacity="0.45" />
        <circle cx="17" cy="6" r="4.5" fill={colors.from} opacity="0.45" />

        {/* Eyes */}
        <EyeStyle type={ctx.ai.eyes} />

        {/* Mouth */}
        <MouthStyle type={ctx.ai.mouth} />

        {/* Highlight */}
        <circle cx="-10" cy="-15" r="4" fill="white" opacity="0.3" />
        <circle cx="-6" cy="-18" r="2" fill="white" opacity="0.2" />
      </svg>
    </motion.div>
  );
}

// ─── Mini previews for settings panel ─────────────────────────────────────────
export function EyePreview({ type, selected }: { type: string; selected: boolean }) {
  return (
    <svg
      viewBox="-16 -12 32 14"
      width="40"
      height="22"
      className={selected ? "text-violet-600" : "text-gray-500"}
    >
      <EyeStyle type={type} />
    </svg>
  );
}

export function MouthPreview({ type, selected }: { type: string; selected: boolean }) {
  return (
    <svg
      viewBox="-12 0 24 16"
      width="38"
      height="22"
      className={selected ? "text-violet-600" : "text-gray-500"}
    >
      <MouthStyle type={type} />
    </svg>
  );
}

export function HairPreview({ type, color, selected }: { type: string; color: string; selected: boolean }) {
  if (type === "none") {
    return (
      <svg viewBox="-15 -15 30 30" width="36" height="36" className={selected ? "text-violet-600" : "text-gray-400"}>
        <circle cx="0" cy="0" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="-6" y1="-6" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="6" y1="-6" x2="-6" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="-18 -22 36 26" width="44" height="32" style={{ overflow: "visible" }}>
      <Hair type={type} color={color} />
    </svg>
  );
}
