"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Calendar, ChevronRight, Check } from "lucide-react";
import AppShell from "@/components/AppShell";
import AvatarAI from "@/components/AvatarAI";
import MoodGauge from "@/components/MoodGauge";
import DoodleIcon from "@/components/DoodleIcon";
import { useMindCare } from "@/context/MindCareContext";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const categoryColorMap: Record<string, string> = {
  "Bien-être": "bg-mint-400/30",
  "Social": "bg-violet-100",
  "Nature": "bg-coral-400/30",
  "Créatif": "bg-pink-100",
  "Sport": "bg-coral-400/30",
  "Gaming": "bg-violet-100",
};

export default function Home() {
  const ctx = useMindCare();

  const [mood, setMood] = useState({
    energy: ctx.todayMood?.energy ?? 45,
    mood: ctx.todayMood?.mood ?? 62,
    stress: ctx.todayMood?.stress ?? 70,
    social: ctx.todayMood?.social ?? 30,
  });
  const [saved, setSaved] = useState(false);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

  const handleSave = () => {
    ctx.saveMood({ energy: mood.energy, mood: mood.mood, stress: mood.stress, social: mood.social });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Quick stats
  const streakCount = ctx.streak;

  const averageMood = useMemo(() => {
    if (ctx.moodHistory.length === 0) return 0;
    const sum = ctx.moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round(sum / ctx.moodHistory.length);
  }, [ctx.moodHistory]);

  const activitiesJoinedThisWeek = useMemo(() => {
    return ctx.activities.filter((a) => a.joined === true).length;
  }, [ctx.activities]);

  // Suggested activities: unjoined, first 3
  const suggestedActivities = useMemo(() => {
    return ctx.activities.filter((a) => !a.joined).slice(0, 3);
  }, [ctx.activities]);

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-6">
        {/* Section 1 — AI Greeting */}
        <motion.section
          className="flex flex-col items-center text-center gap-3 pt-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp}>
            <AvatarAI size="lg" animated />
          </motion.div>

          <motion.h1
            className="text-2xl font-display font-bold text-text-primary"
            variants={fadeUp}
          >
            {greeting} {ctx.profile.name}&nbsp;!{" "}
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              style={{ transformOrigin: "70% 70%" }}
            >
              <DoodleIcon name="hand-wave" size={28} />
            </motion.span>
          </motion.h1>

          <motion.p className="text-text-secondary text-base" variants={fadeUp}>
            Comment tu vas aujourd&apos;hui&nbsp;?
          </motion.p>
        </motion.section>

        {/* Section 2 — Mood Check-in */}
        <motion.section
          className="card-gumroad p-5 space-y-5"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.h2
            className="text-lg font-display font-bold flex items-center gap-2"
            variants={fadeUp}
          >
            Comment te sens-tu&nbsp;?
          </motion.h2>

          <motion.div className="space-y-1" variants={fadeUp}>
            <MoodGauge
              label="Énergie"
              iconElement={<DoodleIcon name="lightning" size={20} />}
              value={mood.energy}
              onChange={(v) => setMood((p) => ({ ...p, energy: v }))}
              color="linear-gradient(90deg, #f1c6a7, #f1a57a)"
            />
            <MoodGauge
              label="Humeur"
              iconElement={<DoodleIcon name="smile" size={20} />}
              value={mood.mood}
              onChange={(v) => setMood((p) => ({ ...p, mood: v }))}
              color="linear-gradient(90deg, #fcc8e3, #ff90e8)"
            />
            <MoodGauge
              label="Stress"
              iconElement={<DoodleIcon name="wave" size={20} />}
              value={mood.stress}
              onChange={(v) => setMood((p) => ({ ...p, stress: v }))}
              color="linear-gradient(90deg, #ddd0ff, #9059ff)"
            />
            <MoodGauge
              label="Social"
              iconElement={<DoodleIcon name="people" size={20} />}
              value={mood.social}
              onChange={(v) => setMood((p) => ({ ...p, social: v }))}
              color="linear-gradient(90deg, #a3f0d2, #6ee7b7)"
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <motion.button
              className={`w-full btn-gumroad px-6 py-3 text-base text-white ${
                saved ? "bg-mint-500" : "gradient-primary"
              }`}
              whileTap={{ scale: 0.97, boxShadow: "1px 1px 0px var(--color-text-primary)" }}
              onClick={handleSave}
            >
              {saved ? (
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <Check size={18} strokeWidth={3} />
                  Envoyé à {ctx.ai.name}&nbsp;!
                </motion.span>
              ) : (
                "Enregistrer"
              )}
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Section 3 — Quick Stats */}
        <motion.section
          className="grid grid-cols-3 gap-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="card-gumroad p-3 flex flex-col items-center gap-1 bg-coral-400/20"
            variants={fadeUp}
          >
            <span className="text-xl">
              <Flame size={22} className="text-coral-500" />
            </span>
            <span className="text-xl font-display font-bold">{streakCount}</span>
            <span className="text-[11px] text-text-secondary font-medium text-center leading-tight">
              Série actuelle
            </span>
          </motion.div>

          <motion.div
            className="card-gumroad p-3 flex flex-col items-center gap-1 bg-pink-100"
            variants={fadeUp}
          >
            <span className="text-xl">
              <TrendingUp size={22} className="text-pink-500" />
            </span>
            <span className="text-xl font-display font-bold">{averageMood}%</span>
            <span className="text-[11px] text-text-secondary font-medium text-center leading-tight">
              Humeur moy.
            </span>
          </motion.div>

          <motion.div
            className="card-gumroad p-3 flex flex-col items-center gap-1 bg-violet-100"
            variants={fadeUp}
          >
            <span className="text-xl">
              <Calendar size={22} className="text-violet-500" />
            </span>
            <span className="text-xl font-display font-bold">{activitiesJoinedThisWeek}</span>
            <span className="text-[11px] text-text-secondary font-medium text-center leading-tight">
              Activités
            </span>
          </motion.div>
        </motion.section>

        {/* Section 4 — Suggested Activities */}
        <motion.section
          className="space-y-3"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className="flex items-center justify-between" variants={fadeUp}>
            <h2 className="text-lg font-display font-bold">
              Activités près de chez toi
            </h2>
            <a
              href="/activities"
              className="text-sm font-semibold text-violet-500 flex items-center gap-0.5 hover:text-violet-700 transition-colors"
            >
              Voir tout <ChevronRight size={16} />
            </a>
          </motion.div>

          <motion.div
            className="flex gap-3 overflow-x-auto overflow-y-visible scrollbar-thin py-2 -mx-4 px-4"
            variants={fadeUp}
          >
            {suggestedActivities.map((act) => (
              <motion.div
                key={act.id}
                className={`card-gumroad p-4 min-w-[200px] flex-shrink-0 ${categoryColorMap[act.category] ?? "bg-violet-100"}`}
                whileHover={{
                  boxShadow: "6px 6px 0px var(--color-text-primary)",
                  x: -2,
                  y: -2,
                }}
              >
                <DoodleIcon name={act.categoryIcon ?? "smile"} size={28} />
                <h3 className="font-bold text-sm mt-2">{act.title}</h3>
                <p className="text-xs text-text-secondary mt-0.5">{act.location}</p>
                {act.date && <p className="text-xs text-text-tertiary mt-0.5">{act.date}</p>}
                <span className="inline-block mt-2 text-[11px] font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full border border-violet-200">
                  {act.maxParticipants - act.participants} places
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </AppShell>
  );
}
