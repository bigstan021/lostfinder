"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function RecoveredItems() {
    const items = [
        {
            id: 1,
            name: "Black Wallet",
            location: "Lecture Hall B",
            image: "/wallet1.jpeg",
            time: "Recovered 2 hours ago",
        },

        {
            id: 2,
            name: "AirPods Pro",
            location: "Engineering Lab",
            image: "/airpodsitem.jpg",
            time: "Recovered yesterday",
        },

        {
            id: 3,
            name: "Student ID Card",
            location: "Campus Library",
            image: "/idcarditem1.jpeg",
            time: "Recovered today",
        },
    ];

    return (
        <section className="relative py-28 px-6 bg-gradient-to-b from-[#050816] to-[#0b1120] overflow-hidden">

            {/* Glow Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center relative z-10"
            >
                <span className="uppercase tracking-[0.3em] text-cyan-400 font-semibold">
                    Recovered Items
                </span>

                <h2 className="mt-5 text-5xl font-extrabold text-white">
                    Successfully Reunited
                </h2>

                <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    LostFinder helps students reconnect with valuable belongings faster
                    through intelligent matching and real-time communication.
                </p>
            </motion.div>

            {/* Cards */}
            <div className="mt-20 max-w-7xl mx-auto grid md:grid-cols-3 gap-10 relative z-10">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                        viewport={{ once: true }}
                        className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden hover:-translate-y-3 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] transition-all duration-500"
                    >
                        {/* Image */}
                        <div className="overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={500}
                                height={400}
                                className="w-full h-[260px] object-cover group-hover:scale-110 transition duration-700"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6">

                            {/* Badge */}
                            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                <CheckCircle className="w-5 h-5" />
                                Successfully Returned
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-2xl font-bold text-white">
                                {item.name}
                            </h3>

                            {/* Location */}
                            <p className="mt-2 text-gray-400">
                                Found near {item.location}
                            </p>

                            {/* Time */}
                            <p className="mt-5 text-sm text-cyan-400">
                                {item.time}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}