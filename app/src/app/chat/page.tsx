"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Paperclip, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import AvatarAI from "@/components/AvatarAI";
import ChatBubble from "@/components/ChatBubble";
import { useMindCare } from "@/context/MindCareContext";
import { useGrok } from "@/hooks/useGrok";

export default function ChatPage() {
  const ctx = useMindCare();
  const { sendMessage } = useGrok();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialCountRef = useRef(ctx.messages.length);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ctx.messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    ctx.addMessage(text, true);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMessage(text);
      ctx.addMessage(response, false);
    } catch {
      ctx.addMessage(
        "Désolé, je n'ai pas pu répondre. Réessaie dans un instant !",
        false
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-lg mx-auto flex flex-col h-[calc(100dvh-80px)]">
        {/* Chat Header */}
        <motion.div
          className="flex items-center gap-3 px-4 py-3 bg-surface border-b-[2.5px] border-border-main"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="p-1 -ml-1 text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <AvatarAI size="sm" animated={false} />
          <div className="flex-1">
            <h2 className="text-base font-display font-bold leading-tight">{ctx.ai.name}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-mint-500 rounded-full animate-pulse" />
              <span className="text-xs text-text-tertiary">En ligne</span>
            </div>
          </div>
        </motion.div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-3"
        >
          {/* Date separator */}
          <div className="flex items-center justify-center py-2">
            <span className="text-[11px] font-medium text-text-tertiary bg-surface-soft px-3 py-1 rounded-full border border-border-light">
              Aujourd&apos;hui
            </span>
          </div>

          {ctx.messages.map((msg, i) => (
            <ChatBubble
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
              delay={i < initialCountRef.current ? i * 0.1 : 0}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border-[2.5px] border-border-main shadow-cartoon-sm w-fit"
            >
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-violet-400"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-pink-400"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-violet-400"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                />
              </div>
              <span className="text-xs text-text-tertiary font-medium">
                {ctx.ai.name} écrit...
              </span>
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <motion.div
          className="px-4 py-3 bg-surface border-t-[2.5px] border-border-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-end gap-2">
            <button className="p-2 text-text-tertiary hover:text-violet-500 transition-colors flex-shrink-0">
              <Paperclip size={20} />
            </button>

            <div className="flex-1 flex items-end border-[2.5px] border-border-main rounded-2xl bg-surface-soft px-3 py-2 shadow-cartoon-sm focus-within:shadow-cartoon focus-within:border-violet-400 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Écris à ${ctx.ai.name}...`}
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm text-text-primary placeholder:text-text-tertiary max-h-24"
                disabled={isTyping}
              />
            </div>

            <button className="p-2 text-text-tertiary hover:text-violet-500 transition-colors flex-shrink-0">
              <Mic size={20} />
            </button>

            <motion.button
              className={`btn-gumroad gradient-primary p-2.5 text-white flex-shrink-0 ${isTyping ? "opacity-50 cursor-not-allowed" : ""}`}
              whileTap={isTyping ? {} : { scale: 0.92, boxShadow: "1px 1px 0px var(--color-text-primary)" }}
              onClick={handleSend}
              disabled={isTyping}
            >
              <Send size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
