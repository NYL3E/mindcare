"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Logo from "./Logo";
import { useMindCare } from "@/context/MindCareContext";

interface AppShellProps {
  children: React.ReactNode;
}

function LoadingScreen() {
  return (
    <div className="min-h-dvh bg-surface-soft flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Logo size={64} />
      </motion.div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full gradient-primary"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <p className="text-text-tertiary text-sm font-medium">Chargement...</p>
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const { user, authLoading } = useMindCare();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  if (authLoading) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-soft">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
