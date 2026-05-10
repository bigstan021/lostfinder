"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CampusLife() {
  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-3xl group overflow-hidden"></div>

          <Image
            src="/campuslife.jpg"
            alt="Campus Students"
            width={700}
            height={500}
            className="relative rounded-3xl shadow-2xl object-cover hover:scale-[1.02] transition duration-500"
          />
        </motion.div>

        {/* RIGHT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold uppercase tracking-widest">
            Built For Students & Staffs
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Helping Campus Communities Reconnect
          </h2>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            LostFinder was designed for modern campus environments where
            students constantly move between lecture halls, hostels,
            laboratories, and social spaces.
          </p>

          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            The platform simplifies the recovery process by helping students and staffs
            quickly report, search, and reconnect with misplaced belongings
            through intelligent matching and secure communication.
          </p>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
              <p className="text-gray-600 mt-2">
                Real-time item reporting & tracking
              </p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-3xl font-bold text-red-600">Smart</h3>
              <p className="text-gray-600 mt-2">
                Intelligent keyword matching system
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}