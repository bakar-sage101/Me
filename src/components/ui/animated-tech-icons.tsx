"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHoverSliderContext } from "./animated-text-slideshow";
import { 
  SiNestjs, SiDotnet, SiFastapi, SiPython, SiGraphql, SiMongodb, SiJsonwebtokens, 
  SiNextdotjs, SiTailwindcss, SiMui, SiTypescript, SiJavascript,
  SiLangchain, SiN8N
} from "react-icons/si";
import { TbApi, TbCreditCard, TbLock, TbServerCog, TbBrain, TbRobot, TbBrandCSharp } from "react-icons/tb";

const techGroups = {
  0: [ // Backend
    { icon: SiNestjs, name: "NestJS", color: "#E0234E" },
    { icon: SiDotnet, name: ".NET", color: "#512BD4" },
    { icon: SiFastapi, name: "FastAPI", color: "#009688" },
    { icon: SiPython, name: "Python", color: "#3776AB" },
    { icon: TbBrandCSharp, name: "C#", color: "#239120" },
    { icon: SiGraphql, name: "GraphQL", color: "#E10098" },
    { icon: SiMongodb, name: "Mongoose", color: "#47A248" },
    { icon: SiJsonwebtokens, name: "JWT", color: "#000000" },
  ],
  1: [ // Frontend
    { icon: SiNextdotjs, name: "Next.js", color: "#ffffff" },
    { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
    { icon: SiMui, name: "MUI", color: "#007FFF" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
    { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
  ],
  2: [ // AI Agents Workflows
    { icon: SiLangchain, name: "LangChain", color: "#ffffff" },
    { icon: SiN8N, name: "n8n", color: "#FF6D5A" },
    { icon: TbBrain, name: "RAG", color: "#9ca3af" },
    { icon: TbRobot, name: "Agents", color: "#ef4444" },
  ],
  3: [ // Integrations
    { icon: TbCreditCard, name: "Payments", color: "#6366f1" },
    { icon: TbLock, name: "Auth", color: "#10b981" },
    { icon: TbServerCog, name: "Jobs", color: "#f59e0b" },
    { icon: TbApi, name: "APIs", color: "#ec4899" },
  ]
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }),
  exit: { opacity: 0, scale: 0.5, y: -20, transition: { duration: 0.2 } }
};

export function AnimatedTechIcons({ className }: { className?: string }) {
  const { activeSlide } = useHoverSliderContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentIcons = techGroups[activeSlide as keyof typeof techGroups] || techGroups[0];

  return (
    <div className={cn("w-full relative min-h-[160px] flex items-start mt-6 pt-8 border-t border-white/10", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          className="flex flex-wrap gap-4 items-center"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {currentIcons.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                custom={i}
                variants={iconVariants}
                className="group relative flex flex-col items-center gap-2"
                whileHover={{ y: -5, scale: 1.1 }}
              >
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden transition-colors group-hover:bg-white/10 group-hover:border-white/30">
                  {/* Subtle continuous float animation to give it the "weather icon" living feel */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  >
                    <Icon size={24} style={{ color: tech.color === "#000000" ? "#ffffff" : tech.color }} />
                  </motion.div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-white/50 group-hover:text-white/90 transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
