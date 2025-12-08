"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { db } from "../firebaseconfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import verifyUser from "../verifyUser";



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

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
          Search Found Items
        </h1>

        {/* FILTER SECTION */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                placeholder="Search by item name..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="w-full p-3 border rounded-md mt-1"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-3 border rounded-md mt-1"
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
              <label className="text-sm font-medium text-gray-700">Date Found</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 border rounded-md mt-1"
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((it, idx) => {
              const imageUrl = it.imageUrl || it.imageURL || FALLBACK_IMAGE;

              return (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border"
                >
                  <img
                    src={imageUrl}
                    className="w-full h-44 object-cover bg-gray-200"
                    alt="Found item"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{it.itemName}</h3>

                    <p className="text-sm text-gray-600 mt-2">{it.description}</p>

                    <div className="mt-3 text-sm text-gray-500">
                      <p><strong>Location:</strong> {it.foundLocation}</p>
                      <p><strong>Date:</strong> {it.foundDate}</p>
                    </div>

                    {currentUser && currentUser.uid !== it.reporterUID && (
                      <button
                        onClick={() => (window.location.href = `/chat/${it.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Chat with Finder
                      </button>
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
