"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from "framer-motion";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Menu } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "./radial-orbital-timeline";
import { HoverSlider, TextStaggerHover } from "./animated-text-slideshow";
import { AnimatedTechIcons } from "./animated-tech-icons";
import { ProjectsShowcase } from "./image-showcase";
import { AnimatedTabs } from "./animated-tabs";
import Dock from "./dock";


import { ProfileCard } from './profile-card';

gsap.registerPlugin(ScrollTrigger);

export const HorizonHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;

  const dockItems = [
    { icon: FaGithub, label: "Github", href: "https://github.com" },
    { icon: FaLinkedin, label: "Linkedin", href: "https://linkedin.com" },
    { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  ];

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;

      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      getLocation();

      // Start animation
      animate();

      // Mark as ready after Three.js is initialized
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      const starCount = 5000;

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Color variation
          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Slow rotation based on depth
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;

      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;

      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 }
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 50;

        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y = Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }

        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;

      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene!.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Update stars
      refs.stars.forEach((starField) => {
        if ((starField.material as THREE.ShaderMaterial).uniforms) {
          (starField.material as THREE.ShaderMaterial).uniforms.time.value = time;
        }
      });

      // Update nebula
      if (refs.nebula && (refs.nebula.material as THREE.ShaderMaterial).uniforms) {
        (refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.5;
      }

      // Smooth camera movement with easing
      if (refs.camera && refs.targetCameraX !== undefined && refs.targetCameraY !== undefined && refs.targetCameraZ !== undefined) {
        const smoothingFactor = 0.05; // Lower = smoother but slower

        // Calculate smooth position with easing
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

        // Add subtle floating motion
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        // Apply final position
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Parallax mountains with subtle animation
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        const { current: refs } = threeRefs;

        if (refs.animationId) {
          cancelAnimationFrame(refs.animationId);
        }

        window.removeEventListener('resize', handleResize);

        // Dispose Three.js resources
        refs.stars.forEach(starField => {
          starField.geometry.dispose();
          (starField.material as THREE.Material).dispose();
        });

        refs.mountains.forEach(mountain => {
          mountain.geometry.dispose();
          (mountain.material as THREE.Material).dispose();
        });

        if (refs.nebula) {
          refs.nebula.geometry.dispose();
          (refs.nebula.material as THREE.Material).dispose();
        }

        if (refs.renderer) {
          refs.renderer.dispose();
        }
      };
  }, []);

  const getLocation = () => {
    const { current: refs } = threeRefs;
    const locations: number[] = [];
    refs.mountains.forEach((mountain, i) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

  // GSAP Animations - Run after component is ready
  useEffect(() => {
    if (!isReady) return;

    // Set initial states to prevent flash
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    // Animate menu
    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    // Animate title with split text
    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.title-char');
      tl.from(titleChars, {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out"
      }, "-=0.5");
    }

    // Animate subtitle lines
    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      tl.from(subtitleLines, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.8");
    }

    // Animate scroll indicator
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");
    }

      return () => {
        tl.kill();
      };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      let progress = scrollY / maxScroll;
      if (maxScroll - scrollY < 100) {
        progress = 1.0;
      }
      progress = Math.min(progress, 1);

      setScrollProgress(progress);
      const newSectionIndex = Math.min(Math.floor(progress * totalSections), totalSections - 1);
      setCurrentSection(newSectionIndex + 1);

      const { current: refs } = threeRefs;

      // Define camera positions for each section
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },    // Section 0 - HORIZON
        { x: 0, y: 40, z: -50 },    // Section 1 - COSMOS
        { x: 0, y: 50, z: -700 }    // Section 2 - INFINITY
      ];

      const transitions = cameraPositions.length - 1;
      const rawTotalProgress = progress * transitions;

      let currentIdx = Math.floor(rawTotalProgress);
      if (currentIdx >= transitions) {
        currentIdx = transitions - 1;
      }

      let sectionProgress = rawTotalProgress - currentIdx;
      if (progress === 1) {
        sectionProgress = 1.0;
      }

      const currentPos = cameraPositions[currentIdx];
      const nextPos = cameraPositions[currentIdx + 1];

      // Set target positions (actual smoothing happens in animate loop)
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;
      // Smooth parallax for mountains
      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
        if (refs.nebula) {
          refs.nebula.position.z = (targetZ + progress * speed * 0.01) - 100;
        }

        // Use the same smoothing approach
        mountain.userData.targetZ = targetZ;
        if (progress > 0.7) {
          mountain.position.z = 600000;
        }
        if (progress < 0.7 && refs.locations) {
          mountain.position.z = refs.locations[i];
        }
      });
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial position

      return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string, colorClass: string = '') => {
    return text.split('').map((char, i) => (
      <span key={i} className={`title-char inline-block ${colorClass}`}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const titles: Record<number, string> = {
    0: 'HORIZON',
    1: 'EXPERTISE',
    2: 'INFINITY'
  };

  const subtitles: Record<number, { line1: string, line2: string }> = {
    0: {
      line1: 'Where vision meets reality,',
      line2: 'we shape the future of tomorrow'
    },
    1: {
      line1: 'Beyond the boundaries of imagination,',
      line2: 'lies the universe of possibilities'
    },
    2: {
      line1: 'In the space between thought and creation,',
      line2: 'we find the essence of true innovation'
    }
  };


  const timelineData = [
    {
      id: 1,
      title: "Planning",
      date: "Jan 2024",
      content: "Project planning and requirements gathering phase.",
      category: "Planning",
      icon: Calendar,
      relatedIds: [2],
      status: "completed" as const,
      energy: 100,
    },
    {
      id: 2,
      title: "Design",
      date: "Feb 2024",
      content: "UI/UX design and system architecture.",
      category: "Design",
      icon: FileText,
      relatedIds: [1, 3],
      status: "completed" as const,
      energy: 90,
    },
    {
      id: 3,
      title: "Development",
      date: "Mar 2024",
      content: "Core features implementation and testing.",
      category: "Development",
      icon: Code,
      relatedIds: [2, 4],
      status: "in-progress" as const,
      energy: 60,
    },
    {
      id: 4,
      title: "Testing",
      date: "Apr 2024",
      content: "User testing and bug fixes.",
      category: "Testing",
      icon: User,
      relatedIds: [3, 5],
      status: "pending" as const,
      energy: 30,
    },
    {
      id: 5,
      title: "Release",
      date: "May 2024",
      content: "Final deployment and release.",
      category: "Release",
      icon: Clock,
      relatedIds: [4],
      status: "pending" as const,
      energy: 10,
    },
  ];

  const companyTabs = [
    {
      id: "kalpay",
      label: "KalPay",
      content: (
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative group shrink-0">
              <div className="absolute -inset-2 bg-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/projects/Kalpay logo.png"
                alt="KalPay"
                className="relative rounded-xl w-32 h-32 object-contain bg-white/5 p-4 border border-white/10 shadow-2xl"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-red-600" />
                <span className="text-red-500 font-bold tracking-widest text-[10px] uppercase">Currently</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Junior Full Stack Engineer</h2>
              <p className="text-white font-bold text-sm"><span className="text-red-600">KalPay</span> Financial Services</p>
            </div>
          </div>
          <div className="space-y-4 text-white text-sm leading-relaxed font-medium">
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Focused on Web Development initially was writing services worked with backend using Nest Js (TypeORM, GraphQL). Wrote clean code following the documentation utilising proper object oriented practices.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Increasing my skills towards the full stack, I started learning the frontend using Next Js by resolving the bugs on existing website that was out of MVP phase, and was maturing. Resolved over 90+ bugs in whole app with MVP, and other phases combined resulted in smooth flow for the user.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Integrated third party payment gateways (Stripe, PayFast) enabling fintech workflows.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Developing Legal Tech chat-bot utilizing Lang-graph with RAG. For assisting lawyers in there case studies. Utilizing the vector database in a way to give multi-law firms the data isolation, and security resulting in multi-tenant system.</span>
            </p>
          </div>
        </div>
      )
    },
    {
      id: "astechware",
      label: "AsTechware",
      content: (
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative group shrink-0">
              <div className="absolute -inset-2 bg-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/projects/ASTechware.png"
                alt="AsTechware"
                className="relative rounded-xl w-32 h-32 object-contain bg-white/5 p-4 border border-white/10 shadow-2xl"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-white" />
                <span className="text-white font-bold tracking-widest text-[10px] uppercase">Previously</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Associate Software Engineer</h2>
              <p className="text-white font-bold text-sm">AsTechware Solutions</p>
            </div>
          </div>
          <div className="space-y-4 text-white text-sm leading-relaxed font-medium">
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Designed and implemented RESTful APIs using Node.js and MongoDB for a logistics web application (SWS), including features to manage driver pause/resume states and calculate performance metrics.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Refactored route tracking logic to handle edge cases and fixed critical bugs affecting time calculations for completed routes.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Built a generalized Python-based web scraper using BeautifulSoup and regular expressions to extract legal services from law firm websites, filtering out irrelevant content with NLP-like heuristics.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Enhanced data pipeline robustness and accuracy across 1500+ domains, exporting structured service categories into CSV for downstream ML tasks or analytics.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-500 mt-1">➤</span>
              <span>Voice Assistant Application (Python, OpenAI, ElevenLabs)</span>
            </p>
            <p className="flex items-start gap-3 pl-6">
              <span className="text-red-500 mt-1">•</span>
              <span>Designed and implemented a real-time, voice-activated assistant using Python, OpenAI’s GPT-3.5-Turbo, and ElevenLabs TTS/STT APIs—integrating webrtcvad and sounddevice to detect user speech and immediately interrupt synthesis for seamless back-and-forth interaction.</span>
            </p>
            <p className="flex items-start gap-3 pl-6">
              <span className="text-red-500 mt-1">•</span>
              <span>Engineered a multithreaded pipeline that converts speech to text, generates AI responses, and streams MP3-to-WAV TTS with FFmpeg—ensuring sub-second response times and robust noise-resilient voice-activity detection.</span>
            </p>
            <p className="flex items-start gap-3 pl-6">
              <span className="text-red-500 mt-1">•</span>
              <span>Delivered a polished, user-centric prototype that accelerated conversational workflows, reduced manual input, and demonstrated a 100% success rate in correctly handling user interruptions during playback.</span>
            </p>
          </div>
        </div>
      )
    }
  ];

  return (

    <div ref={containerRef} className="hero-container cosmos-style">
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Side menu */}
      <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
        <div className="flex flex-col items-center gap-8 text-white p-6 border-r border-white/10 h-full backdrop-blur-sm bg-black/20">
          <Menu className="w-6 h-6 cursor-pointer hover:text-white/70 transition-colors" />
          <div className="vertical-text text-sm font-medium tracking-[0.3em] rotate-180" style={{ writingMode: 'vertical-rl' }}>SPACE</div>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter">
          {String(currentSection).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      {/* All sections for scrolling */}
      <div className="scroll-sections absolute top-0 left-0 w-full z-10">
        {[...Array(3)].map((_, i) => (
          <section key={i} className={`content-section ${i === 0 ? "flex-row max-w-[90rem] mx-auto w-full px-6 md:px-12 lg:px-24" : ""}`}>
            {i === 0 ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-start text-left max-w-2xl z-10 pl-12">
                  <h1 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 flex flex-wrap items-center">
                    <div className="flex mr-4">
                      {splitTitle("Hi,", "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]")}
                    </div>
                    <div className="flex">
                      {splitTitle("I am", "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]")}
                    </div>
                    <div className="flex w-full mt-2 md:mt-4">
                      {splitTitle("Abubakar Siddique", "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]")}
                    </div>
                  </h1>
                  <div ref={subtitleRef} className="text-lg md:text-xl font-light tracking-wide text-white/90">
                    <p className="subtitle-line mb-3">I create; solve problems engineering them.</p>
                    <p className="subtitle-line text-white/60">Therefore, always learning.</p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    <Dock items={dockItems} />
                  </motion.div>
                </div>
                <div className="hidden lg:block z-10 w-[400px]">
                  <ProfileCard />
                </div>
              </div>
            ) : i === 1 ? (
              <div className="flex flex-col md:flex-row items-center justify-between w-full h-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-24">
                <div className="w-full md:w-5/12 flex flex-col justify-center items-start z-10 space-y-6">
                  <h1 className="hero-title text-5xl md:text-6xl mb-4 whitespace-nowrap">
                    {splitTitle("EXPERTISE")}
                  </h1>
                  <HoverSlider className="flex flex-col space-y-4 ml-2">
                    {[
                      "Backend Development",
                      "Frontend Development",
                      "AI Agents Workflows",
                      "Integrations"
                    ].map((title, index) => (
                      <TextStaggerHover
                        key={title}
                        index={index}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter whitespace-nowrap"
                        text={title}
                      />
                    ))}
                    <AnimatedTechIcons />
                  </HoverSlider>
                </div>
                <div className="w-full md:w-7/12 h-full min-h-[500px] z-10 flex items-center justify-center lg:ml-12">
                  <RadialOrbitalTimeline timelineData={timelineData} />
                </div>
              </div>
            ) : i === 2 ? (
              <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full max-w-[95rem] mx-auto px-6 md:px-12 lg:px-24 gap-12 lg:gap-20">
                {/* Left Column: Projects */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-start z-10 self-center">
                  <div className="space-y-4 mb-8">
                    <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl mb-2 whitespace-nowrap">
                      {splitTitle("PROJECTS")}
                    </h1>
                    <p className="hero-subtitle text-base md:text-lg max-w-lg opacity-80 pl-2 border-l-2 border-red-500 text-left ml-2">
                      <span className="text-white">My </span>
                      <span className="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">Problem </span>
                      <span className="text-white">Solving Journey</span>
                    </p>
                  </div>
                  <div className="w-full">
                    <ProjectsShowcase />
                  </div>
                </div>

                {/* Right Column: Companies */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-start z-10 self-center">
                  <div className="space-y-4 mb-8 w-full">
                    <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl mb-2 whitespace-nowrap text-left">
                      {splitTitle("COMPANIES")}
                    </h1>
                    <p className="hero-subtitle text-base md:text-lg max-w-lg opacity-80 pl-2 border-l-2 border-red-500 text-left ml-2">
                      <span className="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] uppercase">I am </span>
                      <span className="text-white">(currently), or </span>
                      <span className="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] uppercase">worked </span>
                      <span className="text-white">for</span>
                    </p>
                  </div>
                  <div className="w-full">
                    <AnimatedTabs tabs={companyTabs} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full">
                <h1 className="hero-title">
                  {splitTitle(titles[i] || "DEFAULT")}
                </h1>
                <div className="hero-subtitle cosmos-subtitle">
                  <p className="subtitle-line">{subtitles[i].line1}</p>
                  <p className="subtitle-line">{subtitles[i].line2}</p>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
