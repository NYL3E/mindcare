"use client";

import { useState } from "react";
import { useMindCare } from "@/context/MindCareContext";
import AppShell from "@/components/AppShell";
import AvatarAI, { EyePreview, MouthPreview, HairPreview } from "@/components/AvatarAI";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
  LogOut,
} from "lucide-react";
import DoodleIcon from "@/components/DoodleIcon";
import { AI_COLOR_OPTIONS, getAIColors } from "@/lib/aiColors";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
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

const personalities = [
  { id: "optimiste", icon: "smile",   label: "Optimiste",  desc: "Toujours positif et encourageant" },
  { id: "zen",       icon: "lotus",   label: "Zen",        desc: "Calme et réfléchi" },
  { id: "empathique",icon: "heart",   label: "Empathique", desc: "Très à l'écoute de tes émotions" },
  { id: "drole",     icon: "sparkle", label: "Drôle",      desc: "Utilise l'humour pour remonter le moral" },
];

const eyeOptions = [
  { id: "round",  label: "Rond" },
  { id: "happy",  label: "Content" },
  { id: "star",   label: "Étoile" },
  { id: "heart",  label: "Cœur" },
  { id: "wink",   label: "Clin" },
];

const mouthOptions = [
  { id: "smile",   label: "Doux" },
  { id: "big",     label: "Grand" },
  { id: "neutral", label: "Neutre" },
  { id: "tongue",  label: "Mignon" },
];

const hairOptions = [
  { id: "none",   label: "Aucun" },
  { id: "short",  label: "Court" },
  { id: "bun",    label: "Chignon" },
  { id: "fluffy", label: "Bouclé" },
  { id: "spiky",  label: "Spike" },
];

/* Custom toggle switch */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full border-[2.5px] border-border-main transition-colors duration-200 ${
        checked ? "gradient-primary" : "bg-gray-200"
      }`}
    >
      <motion.div
        className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white border-[2px] border-border-main shadow-cartoon-sm"
        animate={{ left: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

/* Option pill button for eyes/mouth/hair */
function FeatureOption({
  selected,
  onClick,
  children,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-[2.5px] transition-all ${
        selected
          ? "border-violet-500 bg-violet-50 shadow-cartoon-sm"
          : "border-border-light bg-surface-soft hover:border-border-main"
      }`}
    >
      {children}
      <span className={`text-[10px] font-bold leading-none ${selected ? "text-violet-600" : "text-text-tertiary"}`}>
        {label}
      </span>
    </motion.button>
  );
}

export default function SettingsPage() {
  const ctx = useMindCare();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);

  const currentColors = getAIColors(ctx.ai.color);

  return (
    <AppShell>
      <motion.div
        className="max-w-lg mx-auto px-4 pt-6 pb-8 space-y-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-1">
            <SettingsIcon size={24} className="text-violet-600" />
            <h1 className="text-2xl font-bold font-display">Paramètres</h1>
          </div>
          <p className="text-text-secondary text-sm">Personnalise ton expérience</p>
        </motion.div>

        {/* Section 1: AI Friend Customization */}
        <motion.div variants={fadeUp} className="card-gumroad p-5 space-y-5">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            Ton ami(e) IA <DoodleIcon name="robot" size={22} />
          </h2>

          {/* Avatar — cliquable pour éditer */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <AvatarAI size="lg" onClick={() => setShowAvatarEditor((v) => !v)} />
              <motion.div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-primary border-2 border-white flex items-center justify-center shadow-cartoon-sm"
                whileTap={{ scale: 0.9 }}
              >
                <Pencil size={12} className="text-white" />
              </motion.div>
            </div>
            <button
              onClick={() => setShowAvatarEditor((v) => !v)}
              className="flex items-center gap-1 text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors"
            >
              {showAvatarEditor ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAvatarEditor ? "Masquer" : "Personnaliser l'apparence"}
            </button>
          </div>

          {/* Avatar customization panel */}
          <AnimatePresence>
            {showAvatarEditor && (
              <motion.div
                key="editor"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-3 border-t border-border-light">
                  {/* Eyes */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Yeux</label>
                    <div className="flex gap-2 flex-wrap">
                      {eyeOptions.map((opt) => (
                        <FeatureOption
                          key={opt.id}
                          selected={ctx.ai.eyes === opt.id}
                          onClick={() => ctx.setAI({ eyes: opt.id })}
                          label={opt.label}
                        >
                          <EyePreview type={opt.id} selected={ctx.ai.eyes === opt.id} />
                        </FeatureOption>
                      ))}
                    </div>
                  </div>

                  {/* Mouth */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Sourire</label>
                    <div className="flex gap-2 flex-wrap">
                      {mouthOptions.map((opt) => (
                        <FeatureOption
                          key={opt.id}
                          selected={ctx.ai.mouth === opt.id}
                          onClick={() => ctx.setAI({ mouth: opt.id })}
                          label={opt.label}
                        >
                          <MouthPreview type={opt.id} selected={ctx.ai.mouth === opt.id} />
                        </FeatureOption>
                      ))}
                    </div>
                  </div>

                  {/* Hair */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cheveux</label>
                    <div className="flex gap-2 flex-wrap">
                      {hairOptions.map((opt) => (
                        <FeatureOption
                          key={opt.id}
                          selected={ctx.ai.hair === opt.id}
                          onClick={() => ctx.setAI({ hair: opt.id })}
                          label={opt.label}
                        >
                          <HairPreview
                            type={opt.id}
                            color={currentColors.from}
                            selected={ctx.ai.hair === opt.id}
                          />
                        </FeatureOption>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name field */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Nom de ton IA</label>
            <input
              type="text"
              value={ctx.ai.name}
              onChange={(e) => ctx.setAI({ name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-[2.5px] border-border-main text-sm font-medium outline-none focus:shadow-cartoon transition-shadow bg-surface"
            />
          </div>

          {/* Personality selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Personnalité</label>
            <div className="grid grid-cols-2 gap-2">
              {personalities.map((p) => (
                <motion.button
                  key={p.id}
                  onClick={() => ctx.setAI({ personality: p.id })}
                  className={`p-3 rounded-xl border-[2.5px] text-left transition-all ${
                    ctx.ai.personality === p.id
                      ? "border-violet-500 gradient-primary text-white shadow-cartoon-sm"
                      : "border-border-light bg-surface-soft hover:border-border-main"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  <DoodleIcon name={p.icon} size={24} />
                  <p className="text-sm font-bold mt-1">{p.label}</p>
                  <p className={`text-[11px] mt-0.5 leading-tight ${ctx.ai.personality === p.id ? "text-white/80" : "text-text-secondary"}`}>
                    {p.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Couleur d&apos;apparence</label>
            <div className="flex gap-3">
              {AI_COLOR_OPTIONS.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => ctx.setAI({ color: c.id })}
                  className={`w-10 h-10 rounded-full border-[2.5px] ${
                    ctx.ai.color === c.id
                      ? "border-border-main shadow-cartoon-sm scale-110"
                      : "border-transparent"
                  } transition-all`}
                  style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Voice style */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Style de communication</label>

            <div className="flex rounded-full border-[2.5px] border-border-main overflow-hidden">
              <button
                onClick={() => ctx.setAI({ tutoiement: true })}
                className={`flex-1 py-2 text-sm font-bold transition-all ${
                  ctx.ai.tutoiement ? "gradient-primary text-white" : "bg-surface text-text-secondary"
                }`}
              >
                Tutoiement
              </button>
              <button
                onClick={() => ctx.setAI({ tutoiement: false })}
                className={`flex-1 py-2 text-sm font-bold transition-all ${
                  !ctx.ai.tutoiement ? "gradient-primary text-white" : "bg-surface text-text-secondary"
                }`}
              >
                Vouvoiement
              </button>
            </div>

            <div className="flex rounded-full border-[2.5px] border-border-main overflow-hidden">
              <button
                onClick={() => ctx.setAI({ decontracte: false })}
                className={`flex-1 py-2 text-sm font-bold transition-all ${
                  !ctx.ai.decontracte ? "gradient-primary text-white" : "bg-surface text-text-secondary"
                }`}
              >
                Formel
              </button>
              <button
                onClick={() => ctx.setAI({ decontracte: true })}
                className={`flex-1 py-2 text-sm font-bold transition-all ${
                  ctx.ai.decontracte ? "gradient-primary text-white" : "bg-surface text-text-secondary"
                }`}
              >
                Décontracté
              </button>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Notifications */}
        <motion.div variants={fadeUp} className="card-gumroad p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-violet-600" />
            <h2 className="font-display font-bold text-lg">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Check-in quotidien</span>
              <Toggle checked={ctx.notifications.checkin} onChange={(v) => ctx.setNotifications({ checkin: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Messages de {ctx.ai.name}</span>
              <Toggle checked={ctx.notifications.messages} onChange={(v) => ctx.setNotifications({ messages: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nouvelles activités</span>
              <Toggle checked={ctx.notifications.activites} onChange={(v) => ctx.setNotifications({ activites: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Demandes d&apos;amitié</span>
              <Toggle checked={ctx.notifications.amis} onChange={(v) => ctx.setNotifications({ amis: v })} />
            </div>
          </div>
        </motion.div>

        {/* Section 3: Privacy */}
        <motion.div variants={fadeUp} className="card-gumroad p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-violet-600" />
            <h2 className="font-display font-bold text-lg">Confidentialité</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profil public</span>
              <Toggle checked={ctx.privacy.profilPublic} onChange={(v) => ctx.setPrivacy({ profilPublic: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Montrer mon humeur aux amis</span>
              <Toggle checked={ctx.privacy.showMood} onChange={(v) => ctx.setPrivacy({ showMood: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Partager ma localisation pour les activités</span>
              <Toggle checked={ctx.privacy.shareLocation} onChange={(v) => ctx.setPrivacy({ shareLocation: v })} />
            </div>
          </div>
        </motion.div>

        {/* Section 4: App Settings */}
        <motion.div variants={fadeUp} className="card-gumroad p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-violet-600" />
            <h2 className="font-display font-bold text-lg">Application</h2>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Langue</label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border-[2.5px] border-border-main text-sm font-medium outline-none focus:shadow-cartoon transition-shadow bg-surface cursor-pointer">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Thème</label>
            <div className="flex rounded-full border-[2.5px] border-border-main overflow-hidden">
              {(["clair", "sombre", "auto"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => ctx.setTheme(t)}
                  className={`flex-1 py-2 text-sm font-bold transition-all capitalize ${
                    ctx.theme === t ? "gradient-primary text-white" : "bg-surface text-text-secondary"
                  }`}
                >
                  {t === "clair" ? "Clair" : t === "sombre" ? "Sombre" : "Auto"}
                </button>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <div className="pt-2 border-t border-border-light">
            <button
              onClick={() => ctx.signOut()}
              className="flex items-center gap-2 text-text-secondary text-sm font-semibold hover:text-text-primary transition-colors"
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>

          <div className="pt-2 border-t border-border-light">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 text-red-500 text-sm font-semibold hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
                Supprimer mon compte
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3">
                <p className="text-sm text-red-500 font-medium">Es-tu sûr(e) ? Cette action est irréversible.</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowDeleteConfirm(false)} className="btn-gumroad bg-surface px-4 py-2 text-sm">
                    Annuler
                  </button>
                  <button className="btn-gumroad bg-red-500 text-white px-4 py-2 text-sm border-red-700">
                    Confirmer la suppression
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
