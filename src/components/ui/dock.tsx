"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

interface DockProps {
  className?: string
  items: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    href: string
  }[]
}

export default function Dock({ items, className }: DockProps) {
  const [active, setActive] = React.useState<string | null>(null)
  const [hovered, setHovered] = React.useState<number | null>(null)

  return (
    <div className={cn("flex items-center justify-start w-full py-4", className)}>
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2.5 rounded-full",
          "border border-white/5 shadow-lg shadow-black/20"
        )}
        style={{
          transform: "perspective(600px) rotateX(10deg)", // arc layout illusion
        }}
      >
        {/* Background Layer with Liquid Effect */}
        <div className="absolute inset-0 z-0 rounded-full overflow-hidden">
          {/* Liquid Effect */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute -inset-[100%] flex items-center justify-center">
              <div className="h-full w-full rounded-full blur-[20px] bg-[conic-gradient(from_0deg,transparent,theme(colors.white),transparent,theme(colors.white))] animate-[spin_15s_linear_infinite]" />
            </div>
          </div>
          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl" />
        </div>

        <TooltipProvider delayDuration={100}>
          <div className="relative z-10 flex items-center gap-2">
            {items.map((item, i) => {
              const isActive = active === item.label
              const isHovered = hovered === i

              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <motion.div
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      animate={{
                        scale: isHovered ? 1.15 : 1,
                        y: isHovered ? -4 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="relative flex flex-col items-center"
                    >
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group relative p-2 rounded-lg bg-white/5 border border-white/5 transition-all duration-300",
                          isHovered && "bg-white/10 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        )}
                        onMouseEnter={() => setActive(item.label)}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-all duration-300",
                            isHovered ? "text-red-500" : "text-white/40"
                          )}
                        />
                      </a>

                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute -bottom-1 w-0.5 h-0.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]"
                        />
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    sideOffset={15}
                    className="bg-zinc-950 text-white border-white/10 font-black tracking-widest text-[8px] uppercase px-2 py-1 z-[1000]"
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            })}

            {/* Resume Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-1 relative px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white border border-white/10 bg-white/5 transition-all group overflow-hidden"
                  onClick={() => window.open("/resume.pdf", "_blank")}
                >
                  {/* Internal Liquid Glow for Button */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                    <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent,theme(colors.red.500),transparent)] animate-[spin_4s_linear_infinite]" />
                  </div>
                  <span className="relative z-10">Resume</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={15} className="bg-zinc-950 text-white border-white/10 font-black tracking-widest text-[8px] uppercase px-2 py-1 z-[1000]">
                Download CV
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </motion.div>
    </div>
  )
}
