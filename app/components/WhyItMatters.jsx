"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhyItMatters() {
    return (
        <section className="relative py-28 px-6 bg-gradient-to-b from-white to-blue-50 overflow-hidden">

            {/* Background Blur Circle */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 blur-3xl rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-200/20 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-blue-600 font-bold tracking-widest uppercase">
                        Why It Matters
                    </span>

                    <h2 className="mt-4 text-5xl font-extrabold text-gray-900 leading-tight">
                        Lost Items Can Ruin A Student’s Day
                    </h2>

                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                        From missing ID cards and misplaced chargers to forgotten wallets
                        and AirPods, students constantly lose valuable belongings across
                        campuses.
                    </p>

                    <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                        LostFinder creates a smarter recovery system through instant
                        reporting, intelligent matching, and direct communication between
                        students.
                    </p>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h3 className="text-4xl font-bold text-blue-600">24/7</h3>
                            <p className="text-gray-600 mt-2">
                                Real-time item recovery system
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <h3 className="text-4xl font-bold text-red-500">Smart</h3>
                            <p className="text-gray-600 mt-2">
                                AI-assisted keyword matching
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative h-[650px]"

                >
                    <div className="absolute inset-0 bg-blue-200/20 blur-3xl rounded-full"></div>
                    {/* Main Big Card */}
                    <div className="absolute top-0 left-10 w-[280px] rounded-3xl overflow-hidden shadow-2xl rotate-[-4deg] hover:rotate-0 transition duration-500">
                        <Image
                            src="/airpods.jpeg"
                            alt="Lost AirPods"
                            width={500}
                            height={500}
                            className="object-cover"
                        />
                    </div>

                    {/* Floating Card 1 */}
                    <div className="absolute top-48 right-0 w-[280px] rounded-3xl overflow-hidden shadow-2xl rotate-[6deg] hover:rotate-0 transition duration-500">
                        <Image
                            src="/charger.jpeg"
                            alt="Laptop charger"
                            width={500}
                            height={500}
                            className="object-cover"
                        />
                    </div>

                    {/* Floating Card 2 */}
                    <div className="absolute bottom-0 left-24 w-[230px] rounded-3xl overflow-hidden shadow-2xl rotate-[3deg] hover:rotate-0 transition duration-500">
                        <Image
                            src="/examcard.jpeg"
                            alt="Exam card"
                            width={500}
                            height={500}
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}