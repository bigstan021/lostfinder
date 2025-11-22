"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseconfig";
import { motion } from "framer-motion";
import { FaSearchengin } from "react-icons/fa6";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();
    const section = document.querySelector(id);
    section.scrollIntoView({ behavior: "smooth" });
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center p-5 bg-white shadow-md fixed w-full top-0 left-0 z-[999]">
      <Link href={'/'} className="flex flex-row justify-center item-center gap-2">
        <span><FaSearchengin className="text-4xl" /></span>
        <h1 className="text-2xl font-bold text-blue-600">
          <span className="text-red-600">Lost</span>Finder
        </h1>
      </Link>
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-blue-600 font-bold">
          <a href="/" onClick={(e) => handleScroll(e, "#home")}>Home</a>
        </li>
        <li className="hover:text-blue-600 font-bold">
          <a href="#how-it-works" onClick={(e) => handleScroll(e, "#how-it-works")}>How It Works</a>
        </li>
        <li className="hover:text-blue-600 font-bold">
          <a href="#about" onClick={(e) => handleScroll(e, "#about")}>About</a>
        </li>
      </ul>

      {/* NOT LOGGED IN */}
      {!user && (
        <Link href="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Login
          </button>
        </Link>
      )}

      {/* LOGGED-IN VIEW */}
      {user && (
        <div className="relative z-[999]">
          {/* Profile image button */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <img
              src={user.photo}
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>

          {/* Animated Dropdown */}
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-52 border overflow-hidden"
            >
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <Link href="/profile">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </div>
              </Link>

              <Link href="/my-reports">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  My Reports
                </div>
              </Link>

              <div
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer border-t"
              >
                Logout
              </div>
            </motion.div>
          )}
        </div>
      )}
    </nav>
  );
}
<h1 className="text-2xl font-bold text-blue-600">
  <span className="text-red-600">Lost</span>Finder
</h1> 
