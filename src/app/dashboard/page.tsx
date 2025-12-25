"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, LogOut, ShoppingBag } from "lucide-react";

// UI Components
import { TabsList, TabTrigger } from "@/components/ui/ui-primitives";
import {
  ProductCard,
  AffiliateDisclosure,
  gearRecommendationsLeft,
  gearRecommendationsRight,
} from "@/components/dashboard/SidebarWidgets";
import Footer from "@/components/ui/Footer";

// Profile Components
import Heatmap from "@/components/profile/Heatmap";
import StatsGrid from "@/components/profile/StatsGrid";
import ChartsSection from "@/components/profile/ChartsSection";
import WeeklyStory from "@/components/profile/WeeklyStory";
import UserProfile from "@/components/profile/UserProfile";

// Services
import * as demoService from "@/lib/demoService";
import * as stravaService from "@/lib/stravaService";

import { SportType, StatsData, AthleteProfile } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("mode") === "demo";

  // Select the service based on mode
  const service = isDemo ? demoService : stravaService;

  const [activeTab, setActiveTab] = useState<SportType>("running");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [profile, setProfile] = useState<AthleteProfile | null>(null);

  const tabs: { id: SportType; label: string }[] = [
    { id: "running", label: "Running" },
    { id: "walking", label: "Walking" },
    { id: "cycling", label: "Cycling" },
  ];

  useEffect(() => {
    // Both services must implement `getStats`
    service.getStats(activeTab).then(setStats);
  }, [activeTab, service]);

  useEffect(() => {
    service.getAthleteProfile().then(setProfile);
  }, [service]);

  const handleLogout = () => {
    if (!isDemo) {
      // Perform actual logout logic
      document.cookie = "strava_access_token=; Max-Age=0; path=/;";
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#101418] text-slate-50 pb-20 relative font-sans selection:bg-lime-400/30">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#101418]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center -skew-x-12">
              <Image
                src="/logo/kainetic-logo-v1.png"
                alt="Kainetic Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-lime-400 to-teal-300 leading-none font-amarante uppercase">
                Kainetic
              </h1>
              <p className="text-[10px] text-white font-medium tracking-wider uppercase">
                Momentum, Mapped.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Buy Me A Coffee Button */}
            <a
              href="#"
              className="relative inline-flex overflow-hidden rounded-full p-[1px] group"
              title="Support this independent project"
            >
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#101418_0%,#3b82f6_25%,#84cc16_50%,#3b82f6_75%,#101418_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#101418] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-3xl transition-all group-hover:bg-[#161b22] group-hover:text-white gap-2">
                <Coffee
                  size={14}
                  className="text-lime-500 group-hover:scale-110 transition-transform"
                />
                <span>Buy Me a Coffee</span>
              </span>
            </a>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
              title={isDemo ? "Exit Demo" : "Logout"}
            >
              <LogOut size={18} />
            </button>

            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border-2 border-[#1c2229] shadow-sm cursor-pointer hover:ring-2 ring-blue-500 transition-all">
              <Image
                src={
                  profile?.profile_medium ||
                  (isDemo
                    ? "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=100&q=80"
                    : "https://www.strava.com/api/v3/athlete/avatar")
                }
                alt="User"
                width={36}
                height={36}
                className="w-full h-full object-cover opacity-90 hover:opacity-100"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-center gap-4 px-4 pt-8">
        {/* --- LEFT SIDEBAR --- */}
        <aside className="hidden 2xl:block w-[275px] sticky top-24 h-fit shrink-0">
          <div className="mb-4 flex items-center gap-2 text-[#ee4d2d] opacity-80">
            <ShoppingBag size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Gear Up
            </span>
          </div>
          {gearRecommendationsLeft.slice(0, 2).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <AffiliateDisclosure />
        </aside>

        {/* Compact Left Sidebar (XL) */}
        <aside className="hidden xl:block 2xl:hidden w-[160px] sticky top-24 h-fit shrink-0">
          <div className="mb-4 flex items-center justify-center gap-2 text-[#ee4d2d] opacity-80">
            <ShoppingBag size={14} />
          </div>
          {gearRecommendationsLeft.slice(0, 2).map((product) => (
            <ProductCard key={product.id} product={product} compact={true} />
          ))}
          <AffiliateDisclosure />
        </aside>

        {/* --- MAIN CONTENT CENTER --- */}
        <main className="max-w-4xl w-full shrink-0">
          <UserProfile
            fetcher={service.getAthleteProfile}
            stats={stats || undefined}
            activeTab={activeTab}
          />

          <div className="sticky top-[73px] z-40 bg-[#101418]/95 backdrop-blur-sm pt-2 pb-4 -mx-4 px-4 border-b border-transparent transition-all">
            <TabsList className="shadow-lg shadow-black/20">
              {tabs.map((tab) => (
                <TabTrigger
                  key={tab.id}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </TabTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <section id="heatmap">
                  <Heatmap
                    sport={activeTab}
                    fetcher={service.getActivitiesHeatmap}
                  />
                </section>

                <section id="stats">
                  {activeTab !== "walking" && (
                    <StatsGrid sport={activeTab} fetcher={service.getStats} />
                  )}
                </section>

                {/* Mobile Products Injection - Middle */}
                <div className="block xl:hidden mb-8">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2 text-[#ee4d2d] opacity-90">
                      <ShoppingBag size={14} />
                      <span className="text-xs uppercase font-bold tracking-widest">
                        Trending Gear
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {gearRecommendationsRight.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        compact={true}
                      />
                    ))}
                  </div>
                  <AffiliateDisclosure />
                </div>

                <section id="charts">
                  <ChartsSection
                    sport={activeTab}
                    fetcher={service.getChartData}
                  />
                </section>

                <section id="story">
                  <WeeklyStory sport={activeTab} fetcher={service.getStory} />
                </section>

                {/* Mobile Products Injection - Bottom */}
                <div className="block xl:hidden mt-8">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2 text-[#ee4d2d] opacity-90">
                      <ShoppingBag size={14} />
                      <span className="text-xs uppercase font-bold tracking-widest">
                        More Gear
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {gearRecommendationsLeft.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        compact={true}
                      />
                    ))}
                  </div>
                  <AffiliateDisclosure />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 mb-4 text-center">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
              &copy; {new Date().getFullYear()} Kainetic. All Rights Reserved.
            </p>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR --- */}
        <aside className="hidden 2xl:block w-[275px] sticky top-24 h-fit shrink-0">
          <div className="mb-4 flex items-center gap-2 text-[#ee4d2d] opacity-80">
            <ShoppingBag size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Trending Now
            </span>
          </div>
          {gearRecommendationsRight.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <AffiliateDisclosure />
        </aside>

        {/* Compact Right Sidebar (XL) */}
        <aside className="hidden xl:block 2xl:hidden w-[160px] sticky top-24 h-fit shrink-0">
          <div className="mb-4 flex items-center justify-center gap-2 text-[#ee4d2d] opacity-80">
            <ShoppingBag size={14} />
          </div>
          {gearRecommendationsRight.map((product) => (
            <ProductCard key={product.id} product={product} compact={true} />
          ))}
          <AffiliateDisclosure />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
