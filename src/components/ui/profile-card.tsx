import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

export const ProfileCard = () => {
  return (
    <>
      <style>
        {`
          .hover-scale {
            transition: transform 700ms ease-out;
          }
          
          .hover-scale:hover {
            transform: scale(1.02);
          }
          
          .image-scale {
            transition: transform 700ms ease-out;
          }
          
          .image-container:hover .image-scale {
            transform: scale(1.05);
          }
          
          .hover-translate {
            transition: transform 500ms ease-out;
          }
          
          .hover-translate:hover {
            transform: translateX(4px);
          }
          
          .hover-scale-sm {
            transition: transform 500ms ease-out;
          }
          
          .hover-scale-sm:hover {
            transform: scale(1.1);
          }
        `}
      </style>
      
      <div className="w-full max-w-sm ml-auto">
        <div className="glass-card overflow-hidden hover-scale border border-white/10 relative p-0 group">
          <div className="relative overflow-hidden image-container aspect-square">
            <Image 
              src="/profile.jpg"
              alt="Abubakar Siddique Profile" 
              fill
              className="object-cover image-scale"
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">Abubakar</h2>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide">Siddique</h2>
            </div>
          </div>
          
          <div className="p-6 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden hover-scale-sm ring-2 ring-white/20">
                <Image 
                  src="/profile.jpg"
                  alt="Avatar" 
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hover-translate">
                <div className="text-sm font-medium text-white">Full Stack Dev</div>
                <div className="text-xs text-white/50">Available for work</div>
              </div>
            </div>
            <a 
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-500/20 text-red-500 hover:text-white rounded-lg px-4 py-2 text-sm font-medium
                       transition-all duration-300 ease-out transform hover:scale-105 
                       hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/30"
            >
              <ExternalLink size={16} />
              View LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
