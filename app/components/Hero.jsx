"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className=" h-screen align-item-center justify-center flex flex-col items-center text-center py-20 px-6 bg-gradient-to-b from-blue-100 to-white">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold text-gray-900"
      >
        Find Your Lost Items <span className="text-blue-600">Faster</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-4 text-gray-700 max-w-2xl"
      >
        LostFinder connects owners with finders of lost items across campuses
        and communities.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-8 flex gap-4"
      >
        <Link href="/report-found">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
          Report Found Item
        </button>
        </Link>

       <Link href={"/search"}>
        <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100">
          Search Found Items
        </button>
        </Link>
      
      </motion.div>
    </section>
  );
}
