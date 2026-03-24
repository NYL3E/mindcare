"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  MessageCircle,
  Check,
  X,
  Users,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import DoodleIcon from "@/components/DoodleIcon";
import { useMindCare } from "@/context/MindCareContext";

export default function FriendsPage() {
  const ctx = useMindCare();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = searchQuery
    ? ctx.friends.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ctx.friends;

  const onlineFriendsCount = ctx.friends.filter((f) => f.online).length;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gradient">
                Mes Amis
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border-2 border-border-main bg-violet-100 text-violet-700">
                <Users size={12} strokeWidth={3} />
                {ctx.friends.length}
              </span>
            </div>
            <p className="text-text-secondary text-sm">
              {onlineFriendsCount} en ligne maintenant
            </p>
          </div>
          <button className="btn-gumroad gradient-primary text-white px-5 py-2.5 text-sm shrink-0 active:translate-y-0.5 active:shadow-none">
            <UserPlus size={18} strokeWidth={2.5} />
            Ajouter
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search
            size={18}
            strokeWidth={2.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ami..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-border-main bg-surface text-sm font-medium placeholder:text-text-tertiary shadow-cartoon-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Friend Requests */}
        {ctx.friendRequests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-display font-bold text-lg">
                Demandes d'amitié
              </h2>
              <span className="inline-flex items-center justify-center w-6 h-6 text-[11px] font-bold rounded-full gradient-primary text-white border-2 border-border-main">
                {ctx.friendRequests.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {ctx.friendRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="card-gumroad p-4 flex items-center gap-4"
                >
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${req.gradientFrom} ${req.gradientTo} border-2 border-border-main flex items-center justify-center text-white font-bold text-lg shrink-0`}
                  >
                    {req.initial}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{req.name}</p>
                    <p className="text-xs text-text-tertiary">
                      {req.mutualFriends} ami{req.mutualFriends > 1 ? "s" : ""}{" "}
                      en commun
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => ctx.acceptRequest(req.id)}
                      className="btn-gumroad gradient-primary text-white p-2 active:translate-y-0.5 active:shadow-none"
                    >
                      <Check size={16} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => ctx.declineRequest(req.id)}
                      className="btn-gumroad bg-surface text-text-primary p-2 hover:bg-pink-50 active:translate-y-0.5 active:shadow-none"
                    >
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Friends Grid */}
        <div>
          <h2 className="font-display font-bold text-lg mb-4">
            Tous les amis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFriends.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="card-gumroad p-4 flex flex-col items-center text-center hover:card-gumroad-hover cursor-pointer"
              >
                {/* Avatar with status */}
                <div className="relative mb-3">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${friend.gradientFrom} ${friend.gradientTo} border-[2.5px] border-border-main flex items-center justify-center text-white font-bold text-2xl`}
                  >
                    {friend.initial}
                  </div>
                  {/* Online/offline dot */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-[2.5px] border-white ${
                      friend.online ? "bg-green-400" : "bg-gray-300"
                    }`}
                  />
                </div>

                {/* Name */}
                <p className="font-bold text-sm mb-0.5">{friend.name}</p>

                {/* Status */}
                <p
                  className={`text-[11px] font-semibold mb-1 ${
                    friend.online ? "text-green-600" : "text-text-tertiary"
                  }`}
                >
                  {friend.online ? "En ligne" : "Hors ligne"}
                </p>

                {/* Mood */}
                <span className="mb-3">
                  <DoodleIcon name={friend.moodIcon} size={24} />
                </span>

                {/* Message button */}
                <button className="btn-gumroad w-full py-2 text-xs gradient-primary text-white active:translate-y-0.5 active:shadow-none">
                  <MessageCircle size={14} strokeWidth={2.5} />
                  Message
                </button>

                {/* Profile link */}
                <button className="mt-2 text-[11px] font-semibold text-violet-500 hover:text-violet-700 transition-colors">
                  Voir profil
                </button>
              </motion.div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-3 flex justify-center">
                <DoodleIcon name="search" size={48} />
              </div>
              <p className="font-display font-bold text-lg text-text-secondary">
                Aucun ami trouvé
              </p>
              <p className="text-sm text-text-tertiary mt-1">
                Essaie un autre nom
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
