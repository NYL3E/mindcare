"use client";

import { motion } from "framer-motion";
import AvatarAI from "./AvatarAI";

interface ChatBubbleProps {
  message: string;
  isAI?: boolean;
  isUser?: boolean;
  timestamp?: string;
  avatar?: string;
  isTyping?: boolean;
  delay?: number;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-text-tertiary"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function ChatBubble({
  message,
  isAI,
  isUser,
  timestamp,
  avatar,
  isTyping = false,
  delay = 0,
}: ChatBubbleProps) {
  // Support both isAI and isUser props
  const isFromAI = isAI ?? (isUser !== undefined ? !isUser : true);

  return (
    <motion.div
      className={`flex gap-2.5 max-w-[85%] ${
        isFromAI ? "self-start" : "self-end flex-row-reverse"
      }`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay }}
    >
      {/* Avatar */}
      {isFromAI ? (
        <div className="flex-shrink-0 mt-1">
          <AvatarAI size="sm" animated={false} />
        </div>
      ) : (
        avatar && (
          <div className="flex-shrink-0 mt-1 w-9 h-9 rounded-full gradient-primary border-2 border-border-main overflow-hidden">
            <img
              src={avatar}
              alt="You"
              className="w-full h-full object-cover"
            />
          </div>
        )
      )}

      {/* Bubble */}
      <div className="flex flex-col">
        <div
          className={`rounded-2xl px-4 py-2.5 border-[2px] border-border-main ${
            isFromAI
              ? "bg-surface text-text-primary rounded-bl-md shadow-cartoon-sm"
              : "gradient-primary text-white rounded-br-md shadow-cartoon-sm"
          }`}
        >
          {isTyping ? (
            <TypingDots />
          ) : (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span
            className={`text-[11px] text-text-tertiary mt-1 px-1 ${
              isFromAI ? "text-left" : "text-right"
            }`}
          >
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}
