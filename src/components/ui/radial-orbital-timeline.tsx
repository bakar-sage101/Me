"use client";
import { useState, useEffect, useRef } from "react";

export interface TimelineItem {
  id: number;
  title: string;
  icon: React.ElementType;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setRotationAngle((prev) => (prev + 0.015 * deltaTime) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 170;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    const opacity = 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2);
    const scale = 0.85 + 0.3 * ((1 + Math.sin(radian)) / 2);

    return { x, y, opacity, scale };
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent overflow-visible">
      <div className="relative w-full max-w-2xl h-[500px] flex items-center justify-center">
        {/* Simple Center Orb */}
        <div className="absolute w-12 h-12 rounded-full bg-red-600 flex items-center justify-center z-10 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
        </div>

        {/* Path */}
        <div className="absolute w-[340px] h-[340px] rounded-full border border-white/5"></div>

        {/* Orbiting Nodes */}
        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="absolute transition-transform duration-75 flex flex-col items-center gap-2"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                opacity: position.opacity,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg">
                <Icon size={18} className="text-white/70" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
