"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  // Mock items — replace with database later
  const items = [
    {
      id: 1,
      title: "Black Wallet",
      location: "Veritas University Cafeteria",
      date: "2025-02-20",
      category: "Wallet",
      image: "https://images.unsplash.com/photo-1518548530631-fb67ca8262ec?w=800",
    },
    {
      id: 2,
      title: "iPhone 12",
      location: "COSMAS Building",
      date: "2025-02-18",
      category: "Phone",
      image: "https://images.unsplash.com/photo-1598327100476-90c89f4e6f52?w=800",
    },
    {
      id: 3,
      title: "HP Laptop",
      location: "Library",
      date: "2025-02-15",
      category: "Laptop",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    },
    {
      id: 4,
      title: "School ID Card",
      location: "Hostel Block B",
      date: "2025-02-19",
      category: "ID Card",
      image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
    },
  ];

  const categories = ["All", "Wallet", "Phone", "Laptop", "ID Card"];

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = filter === "All" || item.category === filter;
    return matchesQuery && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-20">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Search Lost Items
      </h1>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by item name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-xl transition"
          >
            <img
              src={item.image}
              className="w-full h-40 object-cover"
              alt={item.title}
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{item.location}</p>
              <p className="text-gray-500 text-xs mt-1">Date: {item.date}</p>

              <span className="inline-block mt-3 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No results */}
      {filteredItems.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No items found.
        </p>
      )}
    </section>
  );
}
