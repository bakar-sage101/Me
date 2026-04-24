"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center p-6 transition-all duration-300 ${
        scrolled ? "py-4" : "py-8"
      }`}
    >
      <div className={`flex items-center justify-between w-full max-w-6xl px-6 py-3 rounded-2xl transition-all duration-300 bg-transparent`}>
        <Link href="/" className="text-2xl font-bold tracking-tighter text-foreground">
          PORTFOLIO<span className="text-accent">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#contact" className="btn-primary py-2 px-4 text-sm rounded-xl">
            Hire Me
          </Link>
        </div>

        {/* Mobile menu button could go here */}
      </div>
    </motion.nav>
  );
}
