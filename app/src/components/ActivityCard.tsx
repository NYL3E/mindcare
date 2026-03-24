"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Lock, Globe, Check } from "lucide-react";
import DoodleIcon from "@/components/DoodleIcon";

export interface Activity {
  id: number;
  title: string;
  category: string;
  categoryEmoji?: string;
  categoryIcon?: string;
  description: string;
  participants: number;
  maxParticipants: number;
  location: string;
  date?: string;
  isPublic?: boolean;
  hostAvatar?: string;
  hostName?: string;
  joined?: boolean;
}

interface ActivityCardProps {
  activity: Activity;
  index?: number;
  onJoin?: () => void;
}

const categoryColors: Record<string, string> = {
  "bien-être": "bg-violet-100 text-violet-700 border-violet-300",
  sport: "bg-mint-400/30 text-emerald-700 border-emerald-300",
  créatif: "bg-lemon-400/30 text-amber-700 border-amber-300",
  gaming: "bg-sky-400/30 text-blue-700 border-blue-300",
  social: "bg-pink-100 text-pink-700 border-pink-300",
  nature: "bg-mint-400/30 text-emerald-700 border-emerald-300",
  culture: "bg-violet-100 text-violet-700 border-violet-300",
  meditation: "bg-violet-100 text-violet-700 border-violet-300",
  yoga: "bg-mint-400/30 text-emerald-700 border-emerald-300",
  journaling: "bg-lemon-400/30 text-amber-700 border-amber-300",
  breathwork: "bg-sky-400/30 text-blue-700 border-blue-300",
  support: "bg-pink-100 text-pink-700 border-pink-300",
  default: "bg-violet-100 text-violet-700 border-violet-300",
};

export default function ActivityCard({
  activity,
  index = 0,
  onJoin,
}: ActivityCardProps) {
  const {
    title,
    description,
    category,
    categoryEmoji,
    categoryIcon,
    participants,
    maxParticipants,
    location,
    date,
    isPublic = true,
    hostAvatar,
    hostName,
    joined = false,
  } = activity;

  const colorClass =
    categoryColors[category.toLowerCase()] || categoryColors.default;
  const spotsLeft = maxParticipants - participants;
  const isFull = spotsLeft <= 0;

  return (
    <motion.div
      className="card-gumroad p-5"
      whileHover={{
        y: -2,
        boxShadow: "6px 6px 0px var(--color-text-primary)",
        x: -2,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Top row: category + public/private */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}
        >
          {categoryIcon && <DoodleIcon name={categoryIcon} size={14} />}
          {!categoryIcon && categoryEmoji && <span>{categoryEmoji}</span>}
          {category}
        </span>
        <span className="flex items-center gap-1 text-xs text-text-tertiary">
          {isPublic ? (
            <>
              <Globe size={13} /> Public
            </>
          ) : (
            <>
              <Lock size={13} /> Privé
            </>
          )}
        </span>
      </div>

      {/* Title & description */}
      <h3 className="font-display font-bold text-lg text-text-primary mb-1 leading-snug">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">
        {description}
      </p>

      {/* Info row */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary mb-4">
        {date && (
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-violet-500" />
            {date}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-pink-500" />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={14} className="text-sky-500" />
          {participants}/{maxParticipants}
          {spotsLeft > 0 && spotsLeft <= 3 && (
            <span className="text-pink-500 font-semibold">
              {spotsLeft} restantes
            </span>
          )}
        </span>
      </div>

      {/* Bottom: host + join */}
      <div className="flex items-center justify-between pt-3 border-t border-border-light">
        {/* Host */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full gradient-primary border-[1.5px] border-border-main flex items-center justify-center overflow-hidden">
            {hostAvatar ? (
              <img
                src={hostAvatar}
                alt={hostName || "Host"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {(hostName || "H").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="text-xs text-text-secondary font-medium">
            {hostName || "Host"}
          </span>
        </div>

        {/* Join button */}
        <motion.button
          onClick={onJoin}
          disabled={isFull || joined}
          className={`btn-gumroad px-5 py-1.5 text-sm ${
            joined
              ? "bg-green-100 text-green-700 border-green-300 cursor-default shadow-none"
              : isFull
              ? "bg-gray-100 text-text-tertiary cursor-not-allowed shadow-none"
              : "gradient-primary text-white active:translate-y-[1px] active:shadow-cartoon-sm"
          }`}
          whileHover={isFull || joined ? {} : { scale: 1.04 }}
          whileTap={isFull || joined ? {} : { scale: 0.96 }}
        >
          {joined ? (
            <span className="flex items-center gap-1">
              <Check size={14} strokeWidth={3} />
              Inscrit
            </span>
          ) : isFull ? (
            "Complet"
          ) : (
            "Rejoindre"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
