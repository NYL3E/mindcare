"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  MapPin,
  ChevronDown,
  Calendar,
  Users,
  Lock,
  Globe,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import ActivityCard, { type Activity } from "@/components/ActivityCard";
import DoodleIcon from "@/components/DoodleIcon";
import { useMindCare } from "@/context/MindCareContext";

const categories = [
  { label: "Tous", icon: "sparkle" },
  { label: "Bien-être", icon: "lotus" },
  { label: "Sport", icon: "run" },
  { label: "Créatif", icon: "palette" },
  { label: "Gaming", icon: "gamepad" },
  { label: "Social", icon: "fork" },
  { label: "Culture", icon: "book" },
  { label: "Nature", icon: "leaf" },
];

export default function ActivitiesPage() {
  const ctx = useMindCare();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [nearMe, setNearMe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Bien-être",
    date: "",
    location: "",
    maxParticipants: 10,
    isPublic: true,
  });

  const filteredActivities =
    selectedCategory === "Tous"
      ? ctx.activities
      : ctx.activities.filter((a) => a.category === selectedCategory);

  const handlePublish = () => {
    if (!formData.title.trim() || !formData.location.trim()) return;

    const catIcon = categories.find((c) => c.label === formData.category)?.icon;

    ctx.addActivity({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      categoryIcon: catIcon,
      date: formData.date,
      location: formData.location,
      maxParticipants: formData.maxParticipants,
      isPublic: formData.isPublic,
      participants: 0,
      hostName: ctx.profile.name,
    });

    setFormData({
      title: "",
      description: "",
      category: "Bien-être",
      date: "",
      location: "",
      maxParticipants: 10,
      isPublic: true,
    });
    setShowModal(false);
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-1">
              Activités
            </h1>
            <p className="text-text-secondary text-sm sm:text-base flex items-center gap-1.5">
              Rencontre des gens, combat la solitude <DoodleIcon name="fire" size={18} />
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-gumroad gradient-primary text-white px-5 py-2.5 text-sm shrink-0 active:translate-y-0.5 active:shadow-none"
          >
            <Plus size={18} strokeWidth={2.5} />
            Créer une activité
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 overflow-x-auto scrollbar-thin">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border-2 border-border-main transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "gradient-primary text-white shadow-cartoon-sm"
                        : "bg-surface text-text-primary hover:bg-pink-50"
                    }`}
                  >
                    <DoodleIcon name={cat.icon} size={16} /> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Near me toggle */}
          <button
            onClick={() => setNearMe(!nearMe)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border-2 border-border-main transition-all ${
              nearMe
                ? "gradient-primary text-white shadow-cartoon-sm"
                : "bg-surface text-text-primary hover:bg-pink-50"
            }`}
          >
            <MapPin size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">Près de moi</span>
          </button>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredActivities.map((activity, i) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={i}
              onJoin={() => ctx.joinActivity(activity.id)}
            />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-3 flex justify-center">
              <DoodleIcon name="search" size={48} />
            </div>
            <p className="font-display font-bold text-lg text-text-secondary">
              Aucune activité dans cette catégorie
            </p>
            <p className="text-sm text-text-tertiary mt-1">
              Sois le premier à en créer une !
            </p>
          </div>
        )}

        {/* Create Activity Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                className="relative card-gumroad p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin z-10"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full border-2 border-border-main bg-surface hover:bg-pink-50 transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>

                <h2 className="font-display font-bold text-xl text-gradient mb-6">
                  Créer une activité
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-bold text-text-primary mb-1.5 block">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Ex: Yoga au parc"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border-main bg-surface text-sm font-medium placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-bold text-text-primary mb-1.5 block">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Décris ton activité..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-border-main bg-surface text-sm font-medium placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-bold text-text-primary mb-1.5 block">
                      Catégorie
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border-main bg-surface text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all"
                      >
                        {categories.slice(1).map((cat) => (
                          <option key={cat.label} value={cat.label}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Date & Location row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-text-primary mb-1.5 block">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-border-main bg-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-text-primary mb-1.5 block">
                        Max participants
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={100}
                        value={formData.maxParticipants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxParticipants: parseInt(e.target.value) || 2,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-border-main bg-surface text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-bold text-text-primary mb-1.5 block">
                      Lieu
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        placeholder="Adresse ou lieu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-border-main bg-surface text-sm font-medium placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Public/Private toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl border-2 border-border-light bg-surface-soft">
                    <div className="flex items-center gap-2">
                      {formData.isPublic ? (
                        <Globe size={16} className="text-violet-500" />
                      ) : (
                        <Lock size={16} className="text-text-tertiary" />
                      )}
                      <span className="text-sm font-bold">
                        {formData.isPublic ? "Public" : "Privé"}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          isPublic: !formData.isPublic,
                        })
                      }
                      className={`relative w-12 h-7 rounded-full border-2 border-border-main transition-colors ${
                        formData.isPublic ? "gradient-primary" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border-2 border-border-main transition-transform ${
                          formData.isPublic
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handlePublish}
                    className="btn-gumroad gradient-primary text-white py-3 text-sm font-bold mt-2 active:translate-y-0.5 active:shadow-none"
                  >
                    Publier
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
