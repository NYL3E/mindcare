"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  Users,
  Heart,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { useMindCare } from "@/context/MindCareContext";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Accueil", icon: Sparkles, href: "/" },
  { label: "Discussion", icon: MessageCircle, href: "/chat" },
  { label: "Activités", icon: Users, href: "/activities" },
  { label: "Amis", icon: Heart, href: "/friends" },
  { label: "Profil", icon: User, href: "/profile" },
];

function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed?: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="block">
      <motion.div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-full font-sans transition-colors ${
          isActive
            ? "gradient-primary text-white font-bold border-[2.5px] border-border-main shadow-cartoon-sm"
            : "text-text-secondary border-[2.5px] border-transparent hover:border-border-light hover:bg-pink-50 hover:text-text-primary"
        } ${collapsed ? "justify-center px-3" : ""}`}
        whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        {!collapsed && (
          <span className="text-[15px] tracking-tight">{item.label}</span>
        )}
        {isActive && !collapsed && (
          <div className="absolute right-3 w-2 h-2 rounded-full bg-white/60 transition-all duration-300" />
        )}
      </motion.div>
    </Link>
  );
}

function DesktopSidebar() {
  const pathname = usePathname();
  const ctx = useMindCare();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[280px] bg-surface flex-col border-r-[2.5px] border-border-main z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7">
        <Logo size={36} />
        <span className="font-display font-bold text-xl tracking-tight text-text-primary">
          MindCare
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-6 space-y-2">
        <Link href="/settings" className="block">
          <motion.div
            className="flex items-center gap-3 px-4 py-3 rounded-full text-text-tertiary border-[2.5px] border-transparent hover:border-border-light hover:bg-violet-50 hover:text-text-primary transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Settings size={20} />
            <span className="text-[15px]">Réglages</span>
          </motion.div>
        </Link>

        {/* User mini avatar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-full gradient-primary border-2 border-border-main flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {ctx.profile.name}
            </p>
            <p className="text-xs text-text-tertiary truncate">En ligne</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TabletSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger */}
      <motion.button
        className="hidden md:flex lg:hidden fixed top-5 left-5 z-50 w-11 h-11 items-center justify-center rounded-full bg-surface border-2 border-border-main shadow-cartoon-sm"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="hidden md:block lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              className="hidden md:flex lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-surface flex-col border-r-[2.5px] border-border-main z-50 shadow-cartoon"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Logo */}
              <div className="flex items-center gap-3 px-6 py-7">
                <Logo size={36} />
                <span className="font-display font-bold text-xl tracking-tight text-text-primary">
                  MindCare
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-2 space-y-1">
                {navItems.map((item) => (
                  <div key={item.href} onClick={() => setIsOpen(false)}>
                    <NavLink
                      item={item}
                      isActive={pathname === item.href}
                    />
                  </div>
                ))}
              </nav>

              {/* Bottom */}
              <div className="px-4 pb-6">
                <Link
                  href="/settings"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div className="flex items-center gap-3 px-4 py-3 rounded-full text-text-tertiary border-[2.5px] border-transparent hover:border-border-light hover:bg-violet-50 hover:text-text-primary transition-colors">
                    <Settings size={20} />
                    <span className="text-[15px]">Réglages</span>
                  </motion.div>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t-[2.5px] border-border-main z-40 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="block">
              <motion.div
                className="flex flex-col items-center gap-1 px-3 py-1.5"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`p-1.5 rounded-full ${
                    isActive ? "gradient-primary border-[2.5px] border-border-main shadow-cartoon-sm" : ""
                  }`}
                  animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-white" : "text-text-tertiary"}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </motion.div>
                <span
                  className={`text-[10px] ${
                    isActive
                      ? "font-bold text-text-primary"
                      : "text-text-tertiary"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <TabletSidebar />
      <MobileBottomBar />
    </>
  );
}
