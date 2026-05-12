"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseconfig";
import { motion } from "framer-motion";
import { FaSearchengin } from "react-icons/fa6";
import NotificationBell from "./NotificationBell";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ROUTERING
  const router = useRouter();

  //ADMIN EMAIL
  const ADMIN_EMAIL = "stanloclassic@gmail.com";

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleScroll = (e, id) => {
    e.preventDefault();
    const section = document.querySelector(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-black/20 backdrop-blur-sm fixed w-full top-0 left-0 z-[999] border-b border-white/10">

        {/* LOGO */}
        <Link href="/" className="flex flex-row items-center gap-2">
          <FaSearchengin className="text-4xl text-slate-200 drop-shadow-lg" />
          <h1 className="text-2xl font-bold text-blue-600">
            <span className="text-red-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Lost</span>Finder
          </h1>
        </Link>

        {/* NAV LINKS */}
        <ul className="hidden md:flex gap-6 text-white font-medium">
          <li className="hover:text-blue-600 font-bold">
            <a href="#home" onClick={(e) => handleScroll(e, "#home")}>Home</a>
          </li>
          <li className="hover:text-blue-600 font-bold">
            <a href="#how-it-works" onClick={(e) => handleScroll(e, "#how-it-works")}>How It Works</a>
          </li>
          <li className="hover:text-blue-600 font-bold">
            <a href="#about" onClick={(e) => handleScroll(e, "#about")}>About</a>
          </li>
        </ul>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NOT LOGGED IN */}
        {!user && (
          <Link href="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </button>
          </Link>
        )}

        {/* LOGGED IN */}
        {user && (
          <div className="flex items-center gap-4 relative z-[999]">

            {/* CHAT INTERFACE */}
            <button
              onClick={() => router.push("/inbox")}
              className="relative md:block"
              
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </button>

            {/*  Notification Bell */}
            <NotificationBell />

            {/* PROFILE IMAGE */}
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <img
                src={user.photo}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
              />
            </div>

            {/* DROPDOWN */}
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-85 bg-white shadow-lg rounded-lg w-64
max-w-[90vw] border overflow-hidden"
              >
                {/* USER INFO */}
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-800">{user.email}</p>
                </div>

                {/* PROFILE */}
                <Link href="/profile">
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </div>
                </Link>

                {/* MY REPORTS */}
                <Link href="/my-reports">
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    My Reports
                  </div>
                </Link>

                {/* INBOX */}
                <Link href="/inbox">
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Inbox
                  </div>
                </Link>

                {/*  ADMIN (ONLY IF ADMIN) */}
                {user.email === ADMIN_EMAIL && (
                  <Link href="/admin">
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-purple-600 font-semibold">
                      Admin Panel
                    </div>
                  </Link>
                )}

                {/* LOGOUT */}
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

      {/* MOBILE NAVIGATION */}
{menuOpen && (
  <div className="md:hidden fixed top-20 left-0 w-full bg-[#0f172a] border-t border-white/10 z-[998]">
    <ul className="flex flex-col items-center gap-6 py-6 text-white font-medium">
      
      <li>
        <a
          href="#home"
          onClick={(e) => {
            handleScroll(e, "#home");
            setMenuOpen(false);
          }}
        >
          Home
        </a>
      </li>

      <li>
        <a
          href="#how-it-works"
          onClick={(e) => {
            handleScroll(e, "#how-it-works");
            setMenuOpen(false);
          }}
        >
          How It Works
        </a>
      </li>

      <li>
        <a
          href="#about"
          onClick={(e) => {
            handleScroll(e, "#about");
            setMenuOpen(false);
          }}
        >
          About
        </a>
      </li>

    </ul>
  </div>
)}
    </>


  );
}
