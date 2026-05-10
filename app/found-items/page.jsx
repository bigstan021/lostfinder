"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { db } from "../firebaseconfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import verifyUser from "../verifyUser";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";


export default function SearchPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const u = verifyUser();
    if (u) setCurrentUser(u);
  }, []);

  // FILTER STATES
  const [queryText, setQueryText] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const FALLBACK_IMAGE = "/placeholder.png"; // replace if needed

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "foundReports"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);

        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(docs);
      } catch (err) {
        console.error("Error fetching found reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Unique locations
  const locations = useMemo(() => {
    const set = new Set();
    items.forEach((it) => {
      if (it.foundLocation) set.add(it.foundLocation);
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  // FILTER LOGIC
  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesQuery =
        !queryText ||
        (it.itemName || "")
          .toLowerCase()
          .includes(queryText.trim().toLowerCase());

      const matchesLocation =
        locationFilter === "All" || it.foundLocation === locationFilter;

      const matchesDate =
        !dateFilter || it.foundDate === dateFilter;

      return matchesQuery && matchesLocation && matchesDate;
    });
  }, [items, queryText, locationFilter, dateFilter]);
  const activeItems = filtered.filter(
    (item) => item.status !== "Returned"
  );
  const startPrivateChat = async (item) => {
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    // prevent chatting your own report
    if (currentUser.uid === item.reporterUID) {
      alert("You cannot chat on your own report");
      return;
    }

    const chatId = `${item.id}_${currentUser.uid}`;

    const chatRef = doc(db, "chats", chatId);

    const existingChat = await getDoc(chatRef);

    // create ONLY if chat doesn't exist
    if (!existingChat.exists()) {
      await setDoc(chatRef, {
        chatId,

        itemId: item.id,
        itemName: item.itemName,

        finderUID: item.reporterUID,
        finderName: item.reporterName,

        seekerUID: currentUser.uid,
        seekerName:
          currentUser.displayName ||
          currentUser.name ||
          currentUser.email,

        isAnonymous: item.isAnonymous || false,

        createdAt: serverTimestamp(),
      });
    }
    // multiple chat!! very crucial!!!
    window.location.href = `/chat/${chatId}`
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6 py-16 overflow-hidden">
      <div className="absolute top-20 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Search <span className="text-cyan-500">Found</span> Items
        </h1>

        {/* FILTER SECTION */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-300">Search</label>
              <input
                type="text"
                placeholder="Search by item name..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/10 rounded-2xl mt-1 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-gray-300">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/10 rounded-2xl mt-1 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-gray-300">Date Found</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/10 rounded-2xl mt-1 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <button
                onClick={() => setDateFilter("")}
                className="mt-2 px-3 py-1 bg-gray-100 rounded-md text-xs"
              >
                Clear Date
              </button>
            </div>

          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading items...</div>
        ) : activeItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {activeItems.map((it, idx) => {
              const imageUrl = it.imageUrl || it.imageURL || FALLBACK_IMAGE;

              return (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="group relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl hover:-translate-y-3 hover:border-cyan-400/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <img
                    src={imageUrl}
                    className="w-full h-56 object-cover bg-gray-900 group-hover:scale-110 transition duration-700"
                    alt="Found item"
                  />

                  <div className="p-6 relative z-10">
                    <h3 className="text-2xl font-bold text-white">{it.itemName}</h3>

                    <p className="text-sm text-gray-300 mt-2">{it.description}</p>

                    <div className="mt-3 text-sm text-cyan-300">
                      <p><strong>Location:</strong> {it.foundLocation}</p>
                      <p><strong>Date:</strong> {it.foundDate}</p>
                    </div>

                    {currentUser && currentUser.uid !== it.reporterUID && (

                      it.status === "Returned" ? (

                        <button
                          disabled
                          className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                        >
                          Item Returned
                        </button>

                      ) : (

                        <button
                          onClick={() => startPrivateChat(it)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 shadow-xl text-white rounded-md mt-5 w-full"
                        >
                          Chat with Finder
                        </button>

                      )

                    )}


                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section >
  );
}
