"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import verifyUser from "../verifyUser";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";


export default function About() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // Check login
  useEffect(() => {
    const u = verifyUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, []);

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
        {user ?

          <button className=" bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Follow our Socials
            <span className="flex flex-row gap-2 justify-around item-center">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaXTwitter /></a>
              <a href="#"><FaFacebook  /></a>
            </span>
          </button>

          :
          <Link href="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>

        }
      </motion.div>
    </section>
  );
}
