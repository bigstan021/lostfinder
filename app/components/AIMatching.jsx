"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AIMatching() {
    return (
        <section className="relative py-28 px-6 bg-[#050816] overflow-hidden">

            {/* Glow Backgrounds */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="uppercase tracking-[0.3em] text-cyan-400 font-semibold">
                        AI Matching System
                    </span>

                    <h2 className="mt-6 text-5xl font-extrabold text-white leading-tight">
                        Intelligent Detection For Lost & Found Items
                    </h2>

                    <p className="mt-6 text-gray-300 text-lg leading-relaxed">
                        LostFinder intelligently compares uploaded reports, keywords,
                        descriptions, and item categories to discover potential matches
                        between lost and found belongings.
                    </p>

                    <p className="mt-4 text-gray-400 text-lg leading-relaxed">
                        This creates a faster and smarter recovery process across campus
                        environments.
                    </p>

                    {/* Feature Cards */}
                    <div className="mt-10 grid grid-cols-2 gap-5">
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5">
                            <h3 className="text-cyan-400 text-3xl font-bold">98%</h3>
                            <p className="text-gray-300 mt-2">
                                Matching accuracy simulation
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-5">
                            <h3 className="text-blue-400 text-3xl font-bold">AI</h3>
                            <p className="text-gray-300 mt-2">
                                Smart keyword comparison
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative flex justify-center items-center h-[650px]"
                >

                    {/* Connection Line */}
                    <div className="absolute w-[350px] h-[350px] border border-cyan-400/30 rounded-full animate-pulse"></div>

                    {/* LEFT CARD */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute left-0 top-28 bg-[#0f172a] border border-cyan-400/20 rounded-3xl p-4 shadow-2xl w-[260px]"
                    >
                        <Image
                            src="/lostitem.jpg"
                            alt="Lost Wallet"
                            width={400}
                            height={300}
                            className="rounded-2xl object-cover"
                        />

                        <h3 className="text-white font-bold mt-4 text-lg">
                            Lost Wallet Report
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            Black wallet lost near lecture hall.
                        </p>
                    </motion.div>

                    {/* CENTER AI */}
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="z-10 bg-cyan-400 text-black font-bold px-8 py-6 rounded-full shadow-[0_0_50px_rgba(34,211,238,0.7)]"
                    >
                        98% Match
                    </motion.div>

                    {/* RIGHT CARD */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute right-0 bottom-28 bg-[#0f172a] border border-cyan-400/20 rounded-3xl p-4 shadow-2xl w-[260px]"
                    >
                        <Image
                            src="/foundwallet.jpg"
                            alt="Found Wallet"
                            width={400}
                            height={300}
                            className="rounded-2xl object-cover"
                        />

                        <h3 className="text-white font-bold mt-4 text-lg">
                            Found Wallet Report
                        </h3>

                        <p className="text-gray-400 text-sm mt-2">
                            Similar wallet discovered near campus cafe.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}