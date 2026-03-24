"use client";

import React from "react";

const icons: Record<string, () => React.ReactNode> = {
  /* ── Gauge icons ─────────────────────────────────────── */

  lightning: () => (
    <path
      d="M13.2 2.2L4.3 12.8c-.2.2 0 .5.3.5h4.6l-1.7 8.6c-.1.3.3.5.5.2l9.1-11c.2-.2 0-.5-.3-.5h-4.4l1.8-8.2c.1-.3-.3-.5-.5-.2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  smile: () => (
    <>
      <circle cx="12" cy="12" r="9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8.2 9.8c.1-.8.5-1.4 1-1.3.5.1.7.8.6 1.5-.1.7-.5 1.3-1 1.2-.5-.1-.7-.7-.6-1.4z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M14.8 9.6c.1-.7.5-1.3 1-1.2.5.1.7.8.6 1.5-.1.7-.5 1.3-1 1.2-.5-.1-.8-.8-.6-1.5z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M7.8 14.2c.4 1.2 1.5 2.8 4.1 2.9 2.6.1 3.9-1.5 4.3-2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),

  wave: () => (
    <>
      <path d="M2.5 8.5c2.2-1.8 4.3-1.7 6.2.1 1.9 1.8 4.1 1.9 6.3.1 2.1-1.7 4.2-1.6 6.5.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 14.5c2.1-1.7 4.2-1.6 6.1.2 1.9 1.8 4.2 1.8 6.4.1 2.1-1.7 4.3-1.5 6.5.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  people: () => (
    <>
      <circle cx="8.5" cy="6.2" r="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.2 21c.1-3.1 2.3-5.4 5.3-5.5 3 0 5.2 2.2 5.4 5.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16.8" cy="7.5" r="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 15.8c.8-.5 1.8-.8 2.8-.7 2.2.1 3.9 2 4 4.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  /* ── Category icons ──────────────────────────────────── */

  lotus: () => (
    <>
      <path d="M12 21c0-4.5-3.8-8.2-7.5-9.5 1.2-3.2 4.2-5.8 7.5-6.5 3.3.7 6.3 3.3 7.5 6.5C15.8 12.8 12 16.5 12 21z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21c0-3.5 2-6.8 4.8-8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 21c0-3.5-2-6.8-4.8-8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 13.5V21" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  run: () => (
    <>
      <circle cx="14.5" cy="4.2" r="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.8 22l3.3-6.5 3.2 2.2 4.2-7.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.2 17l3.5-3.3 2.8 2.1 2.6-5.5-4.6-1.5-2.8 3.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  palette: () => (
    <>
      <path d="M12 2.5C6.8 2.5 2.5 6.8 2.5 12c0 5.2 4.3 9.5 9.5 9.5 1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.4-1.2-.3-.3-.4-.7-.4-1.2 0-1 .8-1.8 1.8-1.8h2.1c2.9 0 5.3-2.4 5.3-5.3C22.2 5.8 17.6 2.5 12 2.5z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.8" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="10.2" cy="7.2" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.2" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17.2" cy="10.2" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),

  gamepad: () => (
    <>
      <path d="M6.5 6.5c-2.8 0-4.8 2.5-4.3 5.2l1 5c.3 1.5 1.6 2.5 3.1 2.5 1.2 0 2.2-.7 2.7-1.8l1.2-2.4h3.6l1.2 2.4c.5 1.1 1.5 1.8 2.7 1.8 1.5 0 2.8-1 3.1-2.5l1-5c.5-2.7-1.5-5.2-4.3-5.2H6.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10v3M6 11.5h3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15.5" cy="10.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="12.5" r=".8" fill="currentColor" stroke="none" />
    </>
  ),

  fork: () => (
    <>
      <path d="M7 2.5v6c0 1.5 1 2.8 2.5 3v10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 2.5v3.5c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 2.5c0 0 1.5 3.5 1.5 6s-1.5 3-1.5 3v10" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  book: () => (
    <>
      <path d="M2.5 4.5c0-.8.7-1.5 1.5-1.5h4.5c1.4 0 2.5.5 3.5 1.5 1-.9 2.1-1.5 3.5-1.5H20c.8 0 1.5.7 1.5 1.5v13c0 .8-.7 1.5-1.5 1.5h-4.5c-1.4 0-2.5.6-3.5 1.5-1-1-2.1-1.5-3.5-1.5H4c-.8 0-1.5-.7-1.5-1.5v-13z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5.5v14.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  leaf: () => (
    <>
      <path d="M12.5 2.5c-5 0-8.5 4.5-8.5 10 0 1.5.3 3 .8 4.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.8 16.8c2-2 5.2-4.5 8.5-5.5 3.3-1 6.2-1 8.2-.8-0.2 3.5-1.5 6.8-4 9.2-2.5 2.5-5.8 3.8-9.5 3.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 19.5c2.5-2.5 6-5.5 13.5-7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  /* ── UI / navigation icons ───────────────────────────── */

  sparkle: () => (
    <>
      <path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2L12 2.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 2l.8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  fire: () => (
    <path
      d="M12 22c-4.2 0-7-3.2-7-7.5 0-3.5 2.5-6.2 4-8l1 2.5c.3-.8 1.5-3.8 2-5.5.5-1.5 1.2-2 1.5-1.5.8 1.5 2.5 4.2 3.5 7 .5 1.5.8 2.8.8 4 0 .5 0 1-.1 1.5C17.3 18.2 15.8 22 12 22z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  trend: () => (
    <path
      d="M3.5 18.5l5.2-5.8c.5-.5 1-.8 1.5-.2l2.2 2.5c.5.5 1 .3 1.5-.2l6.6-7.3M16.5 7.5h4v4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  calendar: () => (
    <>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2.5" ry="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9.5h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2.5v4M16 2.5v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 13.5l2.5 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  heart: () => (
    <path
      d="M12 21.2S3.5 15.5 3.5 9.8c0-2.8 2.2-5.3 5-5.3 1.8 0 2.8.8 3.5 1.8.7-1 1.7-1.8 3.5-1.8 2.8 0 5 2.5 5 5.3 0 5.7-8.5 11.4-8.5 11.4z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  star: () => (
    <path
      d="M12 2.5l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17l-5.6 2.8 1.1-6.2L3 9.2l6.2-.9L12 2.5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  trophy: () => (
    <>
      <path d="M8 2.5h8v8c0 2.2-1.8 4-4 4s-4-1.8-4-4v-8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 4.5H5.5c0 0-.5 0-.5.5v2c0 2 1.5 3.5 3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 4.5h2.5c0 0 .5 0 .5.5v2c0 2-1.5 3.5-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14.5v2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 21.5h9c0 0 0-2-1.5-3h-6c-1.5 1-1.5 3-1.5 3z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  target: () => (
    <>
      <circle cx="12" cy="12" r="9.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  lock: () => (
    <>
      <rect x="4.5" y="10.5" width="15" height="11" rx="2.5" ry="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10.5V7.2c0-2.5 2-4.7 4.5-4.7s4.5 2.2 4.5 4.7v3.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 17v1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  check: () => (
    <path
      d="M4.5 12.5l4.8 5.2c.3.3.5.3.8 0l9.5-11.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  search: () => (
    <>
      <circle cx="10.5" cy="10.5" r="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8 15.8l5.5 5.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  bell: () => (
    <>
      <path d="M12 3.5c-3.5 0-6 2.5-6 6v4l-1.5 2.5h15L18 13.5v-4c0-3.5-2.5-6-6-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20c.3.8 1 1.5 2 1.5s1.7-.7 2-1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 1.5v2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  shield: () => (
    <path
      d="M12 2.5l-8 3.5v5c0 5.5 3.5 10 8 11.5 4.5-1.5 8-6 8-11.5v-5l-8-3.5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),

  globe: () => (
    <>
      <circle cx="12" cy="12" r="9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 12h19" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2.5c2.5 2.5 4 6 4 9.5s-1.5 7-4 9.5c-2.5-2.5-4-6-4-9.5s1.5-7 4-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  gear: () => (
    <>
      <path d="M12 15.5c1.9 0 3.5-1.6 3.5-3.5s-1.6-3.5-3.5-3.5-3.5 1.6-3.5 3.5 1.6 3.5 3.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.8 14.8c.2-.5.1-1-.2-1.4l-.8-.8c0-.2.1-.4.1-.6s0-.4-.1-.6l.8-.8c.3-.4.4-.9.2-1.4l-.3-.5c-.2-.5-.7-.7-1.2-.7h-1.1c-.1-.2-.3-.3-.5-.5V6.4c0-.5-.3-1-.7-1.2l-.5-.3c-.5-.2-1-.1-1.4.2l-.8.8c-.2 0-.4-.1-.6-.1s-.4 0-.6.1l-.8-.8c-.4-.3-.9-.4-1.4-.2l-.5.3c-.5.2-.7.7-.7 1.2v1.1c-.2.1-.3.3-.5.5H6.4c-.5 0-1 .3-1.2.7l-.3.5c-.2.5-.1 1 .2 1.4l.8.8c0 .2-.1.4-.1.6s0 .4.1.6l-.8.8c-.3.4-.4.9-.2 1.4l.3.5c.2.5.7.7 1.2.7h1.1c.1.2.3.3.5.5v1.1c0 .5.3 1 .7 1.2l.5.3c.5.2 1 .1 1.4-.2l.8-.8c.2 0 .4.1.6.1s.4 0 .6-.1l.8.8c.4.3.9.4 1.4.2l.5-.3c.5-.2.7-.7.7-1.2v-1.1c.2-.1.3-.3.5-.5h1.1c.5 0 1-.3 1.2-.7l.3-.5z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  robot: () => (
    <>
      <rect x="4" y="7" width="16" height="13" rx="3" ry="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="13" r="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15" cy="13" r="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17.5h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3v4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="2.5" r="1" fill="currentColor" stroke="none" />
      <path d="M1.5 12v4M22.5 12v4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  "hand-wave": () => (
    <>
      <path d="M8.5 13.5l-2-3.5c-.5-.8-.2-1.8.6-2.3.8-.5 1.8-.2 2.3.6l1.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.9 10.8l-1-1.8c-.5-.8-.2-1.8.6-2.3.8-.5 1.8-.2 2.3.6l1 1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.8 9.1l-.5-1c-.5-.8-.2-1.8.6-2.3.8-.5 1.8-.2 2.3.6l.5 1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.7 7.4c-.5-.8-.2-1.8.6-2.3.8-.5 1.8-.2 2.3.6l1.5 2.8c1.5 2.8 1 5.8-1 8-2 2.2-5.5 3-8.2 1.5l-4.5-2.5c-.8-.5-1.1-1.5-.6-2.3.5-.8 1.5-1.1 2.3-.6l2 1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 5.5c.5-1 1.5-1.8 2.5-2M4 19c-1-.8-1.8-2-2.2-3.2" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
    </>
  ),
};

/* ── Component ─────────────────────────────────────────── */

interface DoodleIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export default function DoodleIcon({
  name,
  size = 24,
  className = "",
  color,
}: DoodleIconProps) {
  const renderIcon = icons[name];
  if (!renderIcon) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {renderIcon()}
    </svg>
  );
}
