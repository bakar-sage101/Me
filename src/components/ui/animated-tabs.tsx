"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs?: Tab[];
  defaultTab?: string;
  className?: string;
}

const AnimatedTabs = ({
  tabs,
  defaultTab,
  className,
}: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || (tabs && tabs[0]?.id) || "");

  if (!tabs?.length) return null;

  return (
    <div className={cn("w-full max-w-2xl flex flex-col gap-y-4", className)}>
      {/* Tab Toggle Container */}
      <div className="relative group/tabs">
        {/* Corner Borders for Toggles */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-600 rounded-tl-xl z-20" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-600 rounded-br-xl z-20" />
        
        <div className="flex gap-2 flex-wrap bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-6 py-2.5 text-sm font-bold rounded-xl outline-none transition-all duration-300",
                activeTab === tab.id ? "text-white" : "text-red-600 hover:text-red-500"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] backdrop-blur-sm rounded-xl"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Box */}
      <div className="relative group/content h-[450px]">
        {/* Corner Borders for Content Box */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-600 rounded-tl-[2rem] z-20" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-600 rounded-br-[2rem] z-20" />
        
        <div className="p-8 bg-white/5 shadow-2xl text-white backdrop-blur-xl rounded-[2rem] border border-white/10 h-full overflow-hidden relative z-10">
          {tabs.map(
            (tab) =>
              activeTab === tab.id && (
                <motion.div
                  key={tab.id}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                    filter: "blur(10px)",
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full overflow-y-scroll custom-scrollbar pr-4"
                >
                  {tab.content}
                </motion.div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export { AnimatedTabs };
