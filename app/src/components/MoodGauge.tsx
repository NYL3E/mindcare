"use client";

import { useRef, useCallback, type ElementType } from "react";
import { motion } from "framer-motion";

interface MoodGaugeProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
  icon?: ElementType;
  emoji?: string;
  iconElement?: React.ReactNode;
}

export default function MoodGauge({
  label,
  value,
  onChange,
  color,
  icon: Icon,
  emoji,
  iconElement,
}: MoodGaugeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      onChange(Math.round(pct));
    },
    [onChange]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      handleInteraction(e.clientX);
    },
    [handleInteraction]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons === 0) return;
      handleInteraction(e.clientX);
    },
    [handleInteraction]
  );

  return (
    <div className="flex items-center gap-4 py-3">
      {/* Label + emoji/icon */}
      <div className="flex items-center gap-2 min-w-[100px]">
        {iconElement && <span className="text-xl">{iconElement}</span>}
        {emoji && !iconElement && <span className="text-xl">{emoji}</span>}
        {Icon && !emoji && !iconElement && <Icon size={20} className="text-text-secondary" />}
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex-1 relative py-1 cursor-pointer select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {/* Track bar */}
        <div className="gauge-track" style={{ height: 14 }} />

        {/* Fill */}
        <motion.div
          className="absolute left-0 rounded-full"
          style={{ background: color, top: "50%", height: 10, marginTop: -5 }}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface border-[2.5px] border-border-main shadow-cartoon-sm"
          style={{ marginLeft: -12 }}
          initial={false}
          animate={{ left: `${value}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          whileHover={{ scale: 1.2 }}
        >
          <div
            className="absolute inset-[3px] rounded-full"
            style={{ background: color }}
          />
        </motion.div>
      </div>

      {/* Value */}
      <motion.span
        className="min-w-[40px] text-right text-sm font-bold font-display text-text-primary tabular-nums"
        key={value}
      >
        {value}
      </motion.span>
    </div>
  );
}
