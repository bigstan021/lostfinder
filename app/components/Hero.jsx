"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[url('/hero.jpg')] bg-cover bg-center"
    >
      {/* Animated Background Zoom */}
      <div className="absolute inset-0 scale-110 animate-[slowZoom_18s_ease-in-out_infinite_alternate] bg-[url('/hero.jpg')] bg-cover bg-center"></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70 backdrop-blur-[2px]"></div>

      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>

      {/* Content */}
      <div className="relative z-10 px-6">

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl"
        >
          Find Your Lost <br />
          Items <span className="text-blue-400">Faster</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          LostFinder intelligently connects owners with finders of lost items
          across campuses and communities through smart matching, notifications,
          and secure communication.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-10 flex flex-wrap justify-center gap-5"
        >
          <Link href="/report-found">
            <button className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold">
              Report Found Item
            </button>
          </Link>

          <Link href="/found-items">
            <button className="border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl shadow-xl font-semibold">
              Search Found Items
            </button>
          </Link>

          <Link href="/report-lost">
            <button className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold">
              Report Lost Item
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}