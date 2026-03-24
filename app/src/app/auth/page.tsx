"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) { setError("Entre ton prénom."); setLoading(false); return; }
        if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); setLoading(false); return; }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        setSuccess("Compte créé ! Tu peux maintenant te connecter.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // MindCareContext détecte la session et redirige
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue.";
      if (msg.includes("Invalid login credentials")) setError("Email ou mot de passe incorrect.");
      else if (msg.includes("User already registered")) setError("Cet email est déjà utilisé.");
      else if (msg.includes("Email not confirmed")) setError("Confirme ton email avant de te connecter.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface-soft flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-mint-200/30 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Card */}
        <div className="card-gumroad p-8 space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo size={52} />
            </motion.div>
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl text-gradient">MindCare</h1>
              <p className="text-text-tertiary text-xs mt-0.5">Ton ami IA pour le bien-être mental</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-full border-[2.5px] border-border-main overflow-hidden bg-surface-soft">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className={`flex-1 py-2.5 text-sm font-bold transition-all ${
                  mode === m ? "gradient-primary text-white" : "text-text-secondary"
                }`}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                      type="text"
                      placeholder="Ton prénom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-[2.5px] border-border-main text-sm font-medium outline-none focus:shadow-cartoon focus:border-violet-400 transition-all bg-surface"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border-[2.5px] border-border-main text-sm font-medium outline-none focus:shadow-cartoon focus:border-violet-400 transition-all bg-surface"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl border-[2.5px] border-border-main text-sm font-medium outline-none focus:shadow-cartoon focus:border-violet-400 transition-all bg-surface"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error / success */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full btn-gumroad gradient-primary text-white py-3 text-sm font-bold flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              whileTap={loading ? {} : { scale: 0.97 }}
            >
              {loading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <Sparkles size={16} />
                  {mode === "login" ? "Se connecter" : "Créer mon compte"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-[11px] text-text-tertiary">
            En continuant, tu acceptes nos conditions d&apos;utilisation.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
