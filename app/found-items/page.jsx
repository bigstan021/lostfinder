"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { db } from "../firebaseconfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function SearchPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [queryText, setQueryText] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // fallback image
  const FALLBACK_IMAGE = "/mnt/data/b7d70957-fbba-4fb8-9db8-5c4d70390faa.png";

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

      const matchesStatus =
        statusFilter === "All" ||
        (it.status || "Pending") === statusFilter;

      const matchesDate =
        !dateFilter || it.foundDate === dateFilter;

      return (
        matchesQuery &&
        matchesLocation &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [items, queryText, locationFilter, statusFilter, dateFilter]);

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
            Search Found Items
          </h1>

          <p className="text-sm text-gray-600 max-w-lg">
            Search items that others have reported found. Use filters to narrow results.
          </p>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}
            <div className="flex flex-col">
              <label
                htmlFor="search-by-name"
                className="text-sm text-gray-700 font-medium"
              >
                Filter by Name
              </label>
              <input
                id="search-by-name"
                type="text"
                placeholder="Search by item name..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium">
                Filter by Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="p-3 mt-1 border border-gray-300 rounded-md shadow-sm"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-3 mt-1 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Claimed">Claimed</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-medium">
                Filter by Date Found
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="p-3 mt-1 border border-gray-300 rounded-md shadow-sm"
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
          <div className="text-center py-20 text-lg text-gray-600">
            Loading items...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No items found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((it, idx) => {
              const imageUrl = it.imageUrl || it.imageURL || FALLBACK_IMAGE;
              const status = it.status || "Pending";

              return (
                <motion.div
                  key={it.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border"
                >
                  <div className="w-full h-44 bg-gray-200 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={it.itemName || "Found item"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {it.itemName || "Unknown item"}
                      </h3>

                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          status === "Claimed"
                            ? "bg-green-100 text-green-700"
                            : status === "Resolved"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      {it.description}
                    </p>

                    <div className="mt-3 text-sm text-gray-500">
                      <div>
                        <strong>Location:</strong> {it.foundLocation || "Unknown"}
                      </div>
                      <div>
                        <strong>Date:</strong> {it.foundDate || "Unknown"}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() =>
                          (window.location.href = `/found-items/${it.id}`)
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View
                      </button>

                      <a
                        href={`mailto:${it.reporterEmail || ""}`}
                        className={`text-sm ${
                          it.reporterEmail
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {it.reporterEmail ? "Contact Finder" : "No contact"}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
