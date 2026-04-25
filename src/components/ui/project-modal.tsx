"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    category: string;
    subtitle: string;
    description: string;
    whoIsFor: string[];
    images: string[];
    detailImages?: string[];
  } | null;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent scrolling on body when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop/Overlay - Click here to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[1100px] h-[90vh] min-h-[600px] bg-[#050505] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STICKY HEADER for Close Button */}
            <div className="absolute top-0 right-0 p-8 z-[10001]">
              <button
                type="button"
                onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   onClose();
                }}
                className="group p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-2xl"
                aria-label="Close modal"
              >
                <X className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-16 lg:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                
                {/* LEFT: Project Visuals (Vertical List) */}
                <div className="lg:pt-4 space-y-16">
                  {/* Main Image with Gradient */}
                  <div className="relative flex aspect-square w-full items-center justify-center rounded-3xl">
                    <div className="absolute -inset-12 flex items-center justify-center pointer-events-none">
                      <div className="h-[130%] w-[130%] rounded-full blur-[80px] opacity-20 bg-[conic-gradient(from_0deg,theme(colors.emerald.400),theme(colors.cyan.400),theme(colors.blue.500),theme(colors.violet.600),theme(colors.red.500),theme(colors.emerald.400))] animate-[spin_12s_linear_infinite]" />
                    </div>
                    <div className="relative z-10 w-full rounded-2xl border border-white/20 shadow-2xl overflow-hidden bg-black">
                      <img src={project.images[0]} alt={project.title} className="w-full h-auto object-cover" />
                    </div>
                  </div>

                  {/* Additional Images */}
                  {project.detailImages?.map((img, idx) => (
                    <div key={idx} className="relative z-10 w-full rounded-2xl border border-white/20 shadow-2xl overflow-hidden bg-black">
                      <img src={img} alt={`${project.title} detail ${idx + 1}`} className="w-full h-auto object-cover" />
                    </div>
                  ))}
                </div>

                {/* RIGHT: Detailed Content */}
                <div className="space-y-12 py-4">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[0.85] mb-6 uppercase tracking-tighter drop-shadow-2xl">
                      {project.title}
                    </h2>
                    <div className="h-1.5 w-16 bg-red-600 rounded-full mb-8 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
                    <p className="text-base text-zinc-300 leading-relaxed font-medium">
                      {project.description}
                    </p>
                  </div>

                  {project.whoIsFor && project.whoIsFor.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <h4 className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">Who This Is For</h4>
                      <ul className="space-y-4">
                        {project.whoIsFor.map((item, i) => (
                          <li key={i} className="flex items-start gap-4 text-zinc-400 group">
                            <div className="mt-2 w-1 h-1 rounded-full bg-red-600 shrink-0 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                            <span className="text-sm leading-relaxed group-hover:text-white transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-6">
                    <Button 
                      className="group bg-white text-black hover:bg-zinc-100 rounded-full px-8 py-4 h-auto text-sm font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                      onClick={() => window.open("#", "_blank")}
                    >
                      Explore Project <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
