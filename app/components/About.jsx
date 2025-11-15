"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-blue-50 to-white text-center px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        About LostFinder
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-gray-700 leading-relaxed"
      >
        LostFinder is a community-driven platform that bridges the gap between
        people who’ve lost items and those who’ve found them. Whether it’s a
        misplaced phone, ID card, or backpack, LostFinder helps reconnect items
        with their rightful owners — quickly, securely, and with ease.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        viewport={{ once: true }}
        className="mt-8 flex justify-center"
      >
        <Link href="/login">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
        </Link>
      </motion.div>
    </section>
  );
}
