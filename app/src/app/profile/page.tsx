"use client";

import { useState } from "react";
import { useMindCare } from "@/context/MindCareContext";
import AppShell from "@/components/AppShell";
import { motion, type Variants } from "framer-motion";
import {
  Edit3,
  Calendar,
  Users,
  Activity,
  Flame,
  Lock,
  ChevronRight,
} from "lucide-react";
import DoodleIcon from "@/components/DoodleIcon";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function ProfilePage() {
  const ctx = useMindCare();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(ctx.profile.name);

  // Mood history: last 7 entries mapped to bar chart data
  const last7 = ctx.moodHistory.slice(-7);
  const moodData = last7.map((entry, i) => {
    const d = new Date(entry.date);
    const dayIndex = (d.getDay() + 6) % 7; // Monday=0
    return {
      day: dayLabels[dayIndex] ?? dayLabels[i],
      value: Math.round(entry.mood / 10), // mood is 0-100, convert to 1-10
    };
  });
  const hasMoodData = moodData.length > 0;
  const weekAverage = hasMoodData
    ? Math.round(
        (moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length) * 10
      ) / 10
    : 0;

  // Stats from context
  const friendsCount = ctx.friends.length;
  const activitiesCount = ctx.activities.filter((a) => a.joined).length;
  const streakCount = ctx.streak;

  // Badges logic
  const badges = [
    { label: "Première connexion", icon: "star", earned: true },
    { label: "7 jours de suite", icon: "fire", earned: streakCount >= 7 },
    { label: "Premier ami", icon: "heart", earned: friendsCount > 0 },
    {
      label: "Première activité",
      icon: "target",
      earned: ctx.activities.some((a) => a.joined),
    },
    { label: "30 jours de suite", icon: "sparkle", earned: streakCount >= 30 },
    { label: "10 amis", icon: "people", earned: friendsCount >= 10 },
  ];

  // Recent joined activities
  const recentActivities = ctx.activities
    .filter((a) => a.joined)
    .slice(-3)
    .reverse();

  const handleNameSave = () => {
    ctx.setProfile({ name: editName });
    setIsEditing(false);
  };

  return (
    <AppShell>
      <motion.div
        className="max-w-lg mx-auto px-4 pt-6 pb-8 space-y-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div variants={fadeUp} className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full gradient-primary border-[2.5px] border-border-main shadow-cartoon flex items-center justify-center">
              <span className="text-white text-3xl font-bold font-display">
                {ctx.profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-mint-500 rounded-full border-2 border-border-main flex items-center justify-center">
              <DoodleIcon name="check" size={14} className="text-white" />
            </div>
          </div>

          {/* Name */}
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
              autoFocus
              className="text-2xl font-bold font-display text-center border-[2.5px] border-border-main rounded-xl px-4 py-1 mb-1 outline-none focus:shadow-cartoon transition-shadow"
            />
          ) : (
            <h1 className="text-2xl font-bold font-display mb-1">
              {ctx.profile.name}
            </h1>
          )}

          {/* Bio */}
          <p className="text-text-secondary text-center text-sm mb-3 max-w-[280px]">
            {ctx.profile.bio}
          </p>

          {/* Edit button */}
          <motion.button
            className="btn-gumroad gradient-primary text-white px-5 py-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{
              scale: 0.95,
              boxShadow: "1px 1px 0px var(--color-text-primary)",
            }}
            onClick={() => {
              setEditName(ctx.profile.name);
              setIsEditing(!isEditing);
            }}
          >
            <Edit3 size={14} />
            Modifier le profil
          </motion.button>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-5 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">{friendsCount}</span>
              <span className="text-text-secondary flex items-center gap-1">
                <Users size={13} /> amis
              </span>
            </div>
            <div className="w-px h-8 bg-border-light" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">{activitiesCount}</span>
              <span className="text-text-secondary flex items-center gap-1">
                <Activity size={13} /> activités
              </span>
            </div>
            <div className="w-px h-8 bg-border-light" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">{streakCount}</span>
              <span className="text-text-secondary flex items-center gap-1">
                <Flame size={13} /> jours
              </span>
            </div>
          </div>
        </motion.div>

        {/* Mood History */}
        <motion.div variants={fadeUp} className="card-gumroad p-5">
          <h2 className="font-display font-bold text-lg mb-4">
            Mon historique d&apos;humeur
          </h2>

          {hasMoodData ? (
            <>
              {/* Bar chart */}
              <div className="flex items-end justify-between gap-2 h-36 mb-2">
                {moodData.map((item, i) => (
                  <div
                    key={`${item.day}-${i}`}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <motion.div
                      className="w-full rounded-t-lg border-[2px] border-border-main"
                      style={{
                        background: `linear-gradient(to top, #ff90e8, #9059ff)`,
                        opacity: 0.6 + item.value * 0.04,
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value * 10}%` }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Day labels */}
              <div className="flex justify-between gap-2">
                {moodData.map((item, i) => (
                  <div
                    key={`${item.day}-label-${i}`}
                    className="flex-1 text-center text-xs font-semibold text-text-secondary"
                  >
                    {item.day}
                  </div>
                ))}
              </div>

              {/* Average */}
              <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Moyenne de la semaine
                </span>
                <span className="font-bold text-gradient text-lg">
                  {weekAverage}/10
                </span>
              </div>
            </>
          ) : (
            <p className="text-text-secondary text-sm text-center py-8">
              Pas encore de données
            </p>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div variants={fadeUp}>
          <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
            Mes badges <DoodleIcon name="trophy" size={22} />
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                className={`card-gumroad p-3 min-w-[120px] flex flex-col items-center gap-2 text-center shrink-0 ${
                  !badge.earned ? "opacity-50 grayscale" : ""
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: badge.earned ? 1 : 0.5, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.08,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <DoodleIcon name={badge.icon} size={32} />
                <span className="text-xs font-semibold leading-tight">
                  {badge.label}
                </span>
                {!badge.earned && (
                  <Lock size={12} className="text-text-tertiary" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={fadeUp}>
          <h2 className="font-display font-bold text-lg mb-3">
            Activités récentes
          </h2>

          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  className="card-gumroad p-4 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + i * 0.1,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary border-[2px] border-border-main flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {activity.date ?? ""} · {activity.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-tertiary shrink-0">
                    <Users size={12} />
                    {activity.participants}
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-text-tertiary shrink-0"
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-text-secondary text-sm text-center py-4">
                Aucune activité rejointe pour le moment
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
