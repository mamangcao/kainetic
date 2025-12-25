"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Shield, FileText, Github } from "lucide-react";

import { Button } from "@/components/ui/ui-primitives";
import {
  FloatingWrapper,
  StatsCard,
  ChartCard,
  PRCard,
} from "@/components/landing/HeroVisuals";
import LegalModal from "@/components/landing/LegalModal";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/lib/legalContent";

export default function LoginPage() {
  const router = useRouter();

  // Rotating Text State
  const words = ["Running", "Walking", "Cycling"];
  const [index, setIndex] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"privacy" | "terms">("privacy");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  const handleLogin = (type: "strava" | "demo") => {
    if (type === "demo") {
      router.push("/dashboard?mode=demo");
    } else {
      // Redirect to Next.js API route that handles Strava OAuth
      router.push("/api/strava/auth");
    }
  };

  const openModal = (type: "privacy" | "terms") => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row bg-[#101418] text-white font-sans selection:bg-lime-500/30">
      {/* --- LEFT PANEL: Hero & Visuals --- */}
      <div className="w-full md:w-[55%] lg:w-[60%] bg-[#0a0d10] relative flex flex-col justify-center p-8 md:p-16 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-lime-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full justify-center"
        >
          <div className="relative z-10 w-full max-w-3xl mx-auto">
            {/* Logo and Tagline */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 justify-center lg:justify-start"
            >
              {/* Logo */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40">
                <Image
                  src="/logo/Kainetic-logo-v1.png"
                  alt="Kainetic Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Tagline */}
              <div className="relative w-36 h-28 md:w-36 md:h-36 lg:w-64 lg:h-40">
                <Image
                  src="/logo/kainetic-tagline.png"
                  alt="Kainetic Tagline"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter leading-tight mb-4 md:mb-6 text-center lg:text-left">
              {/* Rotating Text */}
              <div className="h-[1.2em] relative overflow-hidden inline-block font-bold tracking-tight text-neon-lime">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={words[index]}
                    initial={{ y: 50, opacity: 0, rotateX: -20 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    exit={{ y: -50, opacity: 0, rotateX: 20 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="absolute top-0 left-0 block capitalize"
                  >
                    {words[index]}.
                  </motion.span>
                </AnimatePresence>
                <span className="opacity-0 capitalize">{words[0]}.</span>
              </div>
            </h1>

            <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-xl leading-relaxed font-light mb-8 md:mb-10 text-center lg:text-left">
              Advanced analytics for athletes who chase progress. Visualize your
              efforts in deep dark mode.
            </p>

            {/* Floating Visuals Composition (Desktop Only) */}
            <div className="relative w-full h-[200px] md:h-[220px] lg:h-[240px] hidden md:block">
              <FloatingWrapper
                className="absolute top-0 left-0 lg:left-10 z-10"
                delay={0.5}
                duration={7}
                yOffset={10}
              >
                <div className="transform scale-90 opacity-60 hover:opacity-100 hover:scale-95 transition-all duration-500 grayscale hover:grayscale-0">
                  <StatsCard />
                </div>
              </FloatingWrapper>

              <FloatingWrapper
                className="absolute top-4 right-0 lg:right-20 z-20"
                delay={0}
                duration={6}
                yOffset={15}
              >
                <div className="transform hover:scale-105 transition-transform duration-500">
                  <ChartCard />
                </div>
              </FloatingWrapper>

              <FloatingWrapper
                className="absolute bottom-4 left-10 lg:left-24 z-30"
                delay={1.5}
                duration={5}
                yOffset={12}
              >
                <div className="transform hover:-translate-y-1 transition-transform">
                  <PRCard />
                </div>
              </FloatingWrapper>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- RIGHT PANEL: Login Form --- */}
      <div className="w-full md:w-[45%] lg:w-[40%] flex items-center justify-center p-8 bg-[#f8fafc] border-l border-slate-200 relative shadow-2xl z-20">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="max-w-xs w-full"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight uppercase">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Connect your Strava account to securely access your personal
              dashboard.
            </p>
          </div>

          <div className="space-y-6">
            <Button
              onClick={() => handleLogin("strava")}
              variant="strava" // Ensure your Button component handles this variant or use className
              className="w-full py-4 text-base flex items-center justify-center gap-3 group relative overflow-hidden transition-all hover:scale-[1.02] shadow-xl shadow-orange-500/20 bg-[#fc4c02] text-white hover:bg-[#e34402] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                Connect with Strava
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            <button
              onClick={() => handleLogin("demo")}
              className="w-full py-2 text-slate-400 font-medium hover:text-slate-900 transition-colors text-xs hover:underline decoration-slate-300 underline-offset-4 uppercase tracking-wider cursor-pointer"
            >
              Preview with Demo Data
            </button>
          </div>

          <div className="mt-16 border-t border-slate-200 pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-slate-400">
                <button
                  onClick={() => openModal("privacy")}
                  className="hover:text-slate-700 transition-colors hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  onClick={() => openModal("terms")}
                  className="hover:text-slate-700 transition-colors hover:underline cursor-pointer"
                >
                  Terms of Service
                </button>
              </div>

              <div className="flex flex-col items-center gap-2 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/logo/strava-orange.png"
                    alt="Powered by Strava"
                    width={120}
                    height={24}
                    className="h-3 w-auto"
                  />
                </div>

                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                  <span>Developed by</span>
                  <a
                    // href="https://mamangcao.vercel.app"
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-700 hover:text-blue-600 transition-colors border-b border-transparent hover:border-blue-600"
                  >
                    Abdul Haleem Mamangcao
                  </a>
                  <a
                    // href="https://github.com/mamangcao"
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <Github size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Legal Modal --- */}
      <LegalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === "privacy" ? "Privacy Policy" : "Terms of Service"}
        content={modalType === "privacy" ? PRIVACY_POLICY : TERMS_OF_SERVICE}
        icon={modalType === "privacy" ? Shield : FileText}
      />
    </div>
  );
}
