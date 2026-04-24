import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const skills = [
  {
    id: 1,
    title: 'Backend Developer',
    image: '/skills/backend.png',
    description: 'Scalable APIs, databases, and core business logic.'
  },
  {
    id: 2,
    title: 'Frontend Developer',
    image: '/skills/frontend.png',
    description: 'Responsive, accessible, and stunning user interfaces.'
  },
  {
    id: 3,
    title: 'AI Agents/Workflows',
    image: '/skills/ai.png',
    description: 'Automated intelligence and complex RAG pipelines.'
  },
  {
    id: 4,
    title: 'Integrations',
    image: '/skills/integrations.png',
    description: 'Connecting diverse systems and third-party services.'
  }
];

export const SkillsSlideshow = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % skills.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12 relative h-[450px]">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center h-full">
        
        {/* Main Display Area */}
        <div className="relative w-full lg:w-2/3 h-64 lg:h-full rounded-2xl overflow-hidden glass-card p-0 border border-white/10 transition-all duration-500 group hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          {skills.map((skill, index) => (
            <div 
              key={skill.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <Image 
                src={skill.image} 
                alt={skill.title} 
                fill 
                className="object-cover opacity-60 mix-blend-screen"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 text-white group-hover:text-red-500 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                  {skill.title}
                </h3>
                <p className="text-lg md:text-xl text-white/80 font-light tracking-wide">
                  {skill.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation/List Area */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 z-10">
          {skills.map((skill, index) => (
            <button
              key={skill.id}
              onClick={() => setActiveIndex(index)}
              className={`text-left p-4 rounded-xl transition-all duration-300 backdrop-blur-md border ${
                index === activeIndex 
                  ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } group`}
            >
              <h4 className={`text-xl font-medium transition-colors duration-300 ${
                index === activeIndex 
                  ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                  : 'text-white/70 group-hover:text-red-400'
              }`}>
                {skill.title}
              </h4>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
