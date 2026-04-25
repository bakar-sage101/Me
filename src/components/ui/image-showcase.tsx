"use client";

import * as React from "react";
import { motion, AnimatePresence, Variants, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProjectModal } from "./project-modal";

// --- PROPS INTERFACE ---
interface PhotoStackCardProps extends HTMLMotionProps<"div"> {
  images: string[];
  category: string;
  title: string;
  subtitle: string;
  description: string;
  whoIsFor: string[];
  detailImages?: string[];
  isActive?: boolean;
  onOpenModal?: (data: any) => void;
  onClick?: () => void;
}

// --- FRAMER MOTION VARIANTS ---
const imageContainerVariants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const imageVariants: Variants = {
  initial: { scale: 1, rotate: 0, y: 0 },
  hover: (i: number) => ({
    scale: 1.05,
    rotate: (i - 1) * 8,
    y: -20,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  }),
};

const cardVariants: Variants = {
  inactive: {
    scale: 1,
    y: 0,
    zIndex: 0,
    opacity: 0.6,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  active: {
    scale: 1.05,
    y: -15,
    zIndex: 10,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// Liquid Button Component
const LiquidButton = ({ onClick }: { onClick?: (e: React.MouseEvent) => void }) => {
  return (
    <motion.button 
      onClick={onClick} 
      className="absolute inset-0 m-auto w-24 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm font-semibold tracking-wider opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-105 overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">VIEW</span>
      {/* Liquid effect background animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.button>
  );
};

export const PhotoStackCard = React.forwardRef<
  HTMLDivElement,
  PhotoStackCardProps
>(({ className, images, detailImages, category, title, subtitle, description, whoIsFor, isActive, onOpenModal, ...props }, ref) => {
  const displayImages = images.slice(0, 3);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative flex h-[28rem] w-[20rem] cursor-pointer flex-col justify-start rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 shadow-2xl overflow-visible",
        "transition-colors duration-300 ease-in-out hover:bg-white/10",
        className
      )}
      variants={cardVariants}
      animate={isActive ? "active" : "inactive"}
      whileHover="hover"
      {...props}
    >
      {/* Text Content */}
      <div className="z-20">
        <p className="text-[10px] font-bold tracking-widest uppercase text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
          {category}
        </p>
        <h2 className="mt-2 text-4xl font-black text-white drop-shadow-md">
          {title}
        </h2>
        <p className="mt-3 text-sm text-white/70 font-medium leading-relaxed">
          {subtitle.split(/(e-commerce and logistics|streamlining international|enabling|for modern)/gi).map((part, i) => {
            const lowerPart = part.toLowerCase();
            const isHighlight = [
              "e-commerce and logistics",
              "streamlining international",
              "enabling",
              "for modern"
            ].includes(lowerPart);
            
            return isHighlight ? (
              <span key={i} className="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">{part}</span>
            ) : (
              part
            );
          })}
        </p>
      </div>

      {/* Image Stack */}
      <motion.div
        className="absolute bottom-6 right-0 left-0 mx-auto h-56 w-full flex justify-center items-end"
        variants={imageContainerVariants}
      >
        <AnimatePresence>
          {displayImages.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              custom={i}
              variants={imageVariants}
              className="group/image absolute bottom-0 h-52 w-72 origin-bottom rounded-none border border-white/20 bg-black/40 overflow-visible shadow-2xl"
              style={{
                transform: `rotate(${(i - 1) * 4}deg)`,
                zIndex: i,
              }}
            >
              <img
                src={src}
                alt={`${title} snapshot ${i + 1}`}
                className="w-full h-full object-contain object-center transition-transform duration-700 group-hover/image:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 group-hover/image:bg-black/20 transition-colors duration-300" />
              <LiquidButton onClick={(e) => { e.stopPropagation(); onOpenModal?.({ title, category, subtitle, description, whoIsFor, images, detailImages }); }} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});
PhotoStackCard.displayName = "PhotoStackCard";

// --- PROJECTS DATA ---
export const projectsData = [
  {
    images: [
      "/projects/hubstore-1.jpg",
      "/projects/hubstore-1.jpg",
      "/projects/hubstore-1.jpg",
    ],
    detailImages: [
      "/projects/hubstore-2.jpg",
    ],
    category: "SAAS / MARKETPLACE",
    title: "HubStore",
    subtitle: "A digital marketplace platform providing scalable architecture and an intuitive developer experience.",
    description: "HubStore Digital is a sleek, all-in-one e-commerce and membership platform designed to showcase, sell, and manage digital assets while offering gated premium content. Prototyped in Figma, the high-converting storefront and dynamic component libraries are powered by a robust Next.js frontend and a Nest.js backend. To effortlessly handle dynamic store inventory, secure user authentication, and global payment processing, the scalable architecture leverages GraphQL, PostgreSQL, and Redis cache for optimized performance.",
    whoIsFor: [
      "Digital Entrepreneurs: Looking to easily sell UI kits, templates, and digital assets through a high-converting, modern storefront.",
      "Content Creators: Seeking to monetize their work by offering gated, premium content and dynamic blogs to subscribed members.",
      "Design Agencies: Needing a scalable platform to manage dynamic store inventory and showcase robust component libraries."
    ]
  },
  {
    images: [
      "/projects/legal-ai-2.jpg",
      "/projects/legal-ai-1.jpg",
      "/projects/legal-ai-1.jpg",
    ],
    detailImages: [
      "/projects/legal-ai-3.png",
    ],
    category: "AI AGENT / RAG",
    title: "Legal AI",
    subtitle: "Complex document analysis and research agent utilizing advanced RAG pipelines for law applications.",
    description: "Sovereign Legal AI is a secure multi-tenant co-pilot that automates research for Saudi Arabian laws, providing precise, cited answers. To eliminate hallucinations, it utilizes a multi-stage LangGraph RAG pipeline with a custom 7-step Arabic text normalization process. Built for total data sovereignty, the platform features a FastAPI backend, Qdrant vector database, and BGE-M3 embeddings, all Docker-modularized to power a premium Next.js 16 and TypeScript interface.",
    whoIsFor: [
      "Laymen: Seeking an accessible tool to clarify complex statutory language with exact source citations.",
      "Legal Firms & Agencies: Needing instant law lookups, automated compliance audits, and bilingual document comparisons.",
      "High-Stakes Institutions: Requiring an easily deployable, highly secure platform that protects internal data and ensures legal sovereignty."
    ]
  },
  {
    images: [
      "/projects/statify-1.jpg",
      "/projects/statify-1.jpg",
      "/projects/statify-1.jpg",
    ],
    detailImages: [
      "/projects/statify-2.jpg",
    ],
    category: "PLATFORM / DATA",
    title: "Statify",
    subtitle: "A unified customer platform enabling strategy-led consulting built for modern businesses.",
    description: "Statify is a modern Framer finance website template built for finance professionals, consulting firms, training providers, and business service companies that want a strong and professional online presence. Statify works perfectly as a Framer finance website for professional service businesses that need a modern, trustworthy, and conversion-ready website.",
    whoIsFor: [
      "A consulting website template built in Framer",
      "A finance business website for service providers",
      "A training website template designed for conversions",
      "A scalable business website for professionals. Built using Next Js for frontend, Nest Js for backend with PostgreSQL as database. For API, graphQL is used."
    ]
  },
  {
    images: [
      "/projects/Mayfair-1.jpg",
      "/projects/Mayfair-1.jpg",
      "/projects/Mayfair-1.jpg",
    ],
    detailImages: [
      "/projects/MayFair-2.jpg",
      "/projects/Mayfair-3.jpg",
    ],
    category: "ECOMMERCE / LOGISTICS",
    title: "Mayfair",
    subtitle: "Integrated e-commerce and logistics platform streamlining international shopping.",
    description: "Mayfair is an integrated e-commerce and logistics platform that streamlines international shopping by offering virtual addresses, end-to-end freight forwarding, and an automated \"personal shopper\" workflow. It manages the complete purchase lifecycle—from product quotations to real-time shipment tracking—within a scalable TypeScript-first Nx Monorepo. The robust architecture features a Next.js frontend paired with a NestJS backend (GraphQL/REST), relying on PostgreSQL (TypeORM) for data management and Redis for background tasks, all while seamlessly integrating Stripe, PayFast, and N-Genius for global payment processing.",
    whoIsFor: [
      "International Shoppers: Individuals seeking virtual addresses and automated personal shopper services to easily purchase from global brands.",
      "E-commerce Marketplaces: Platforms requiring a high-performance, unified solution to manage cross-border order lifecycles and global payment gateways.",
      "Logistics & Freight Forwarders: Operations needing to automate complex shipment quotations, delivery addresses, and real-time tracking via web-hooks."
    ]
  },
];

// --- DEMO COMPONENT ---
export function ProjectsShowcase() {
  const [activeIndex, setActiveIndex] = React.useState<number>(1);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);

  const handleOpenModal = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="relative flex h-[32rem] w-full items-center justify-start mt-4">
      {projectsData.map((project, index) => (
        <div
          key={project.title}
          className="absolute origin-left transition-all duration-500 ease-out"
          style={{
            transform: `translateX(${index * 120}px) scale(${index === activeIndex ? 1 : 0.9})`,
            zIndex: index === activeIndex ? 30 : 10 + index,
          }}
          onMouseEnter={() => setActiveIndex(index)}
        >
          <PhotoStackCard
            {...project}
            isActive={index === activeIndex}
            onOpenModal={handleOpenModal}
          />
        </div>
      ))}
      
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        project={selectedProject} 
      />
    </div>
  );
}
