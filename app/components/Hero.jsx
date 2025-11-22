"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative  h-screen flex flex-col items-center justify-center text-center px-6 bg-[url('/walletherobg.jpeg')] bg-cover bg-no-repeat bg-center"
    >
      {/*  Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>

      {/*  Actual Content (above overlay) */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
        >
          Find Your Lost Items <span className="text-blue-400">Faster</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-4 text-gray-200 max-w-2xl mx-auto"
        >
          LostFinder connects owners with finders of lost items across campuses
          and communities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <Link href="/report-found">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Report Found Item
            </button>
          </Link>

          <Link href="/found-items">
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition">
              Search Found Items
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
