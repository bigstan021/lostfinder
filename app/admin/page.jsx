"use client";

import { useEffect, useState } from "react";
import { db } from "../firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import verifyUser from "../verifyUser";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    found: 0,
    claims: 0,
    returned: 0,
    users: 0,
  });

  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    const u = verifyUser();
    if (!u) return;

    setUser(u);
    // youradmin@email.com
    if (u.email === "stanloclassic@gmail.com") {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    //KEEP/STORES USERS COUNT
    const usersSnap = await getDocs(
      collection(db, "users")
    );

    // FOUND REPORTS
    const foundSnap = await getDocs(
      collection(db, "foundReports")
    );

    const foundData = foundSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // CLAIMS
    const claimsSnap = await getDocs(
      collection(db, "claims")
    );

    // RETURNED
    const returnedCount = foundData.filter(
      (item) => item.status === "Returned"
    ).length;

    setStats({
      found: foundData.length,
      claims: claimsSnap.size,
      returned: returnedCount,
      users: usersSnap.size,
    });
    setFoundItems(foundData);
  };

  if (!user || user.email !== "stanloclassic@gmail.com") {
    return <p className="text-center mt-10">Access Denied</p>;
  }

  return (

    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6 py-16">

      {/* GLOWS */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold mb-3">
            SYSTEM CONTROL
          </p>

          <h1 className="text-5xl font-bold text-white">
            Admin Dashboard
          </h1>

          <p className="text-gray-400 mt-4">
            Monitor reports, claims and recovery activities
            across the LostFinder network.
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">

            <p className="text-cyan-400 uppercase tracking-widest text-sm">
              Found Reports
            </p>

            <h2 className="text-5xl font-bold text-white mt-4">
              {stats.found}
            </h2>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">

            <p className="text-cyan-400 uppercase tracking-widest text-sm">
              Claims
            </p>

            <h2 className="text-5xl font-bold text-white mt-4">
              {stats.claims}
            </h2>

          </div>

          {/* CARD */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">

            <p className="text-cyan-400 uppercase tracking-widest text-sm">
              Returned Items
            </p>

            <h2 className="text-5xl font-bold text-white mt-4">
              {stats.returned}
            </h2>

          </div>

          {/* USERS */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-6">

            <p className="text-cyan-400 uppercase tracking-widest text-sm">
              Users
            </p>

            <h2 className="text-5xl font-bold text-white mt-4">
              {stats.users}
            </h2>

          </div>

        </div>

        {/* REPORTS */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden">

          <div className="p-6 border-b border-white/10">

            <h2 className="text-3xl font-bold text-white">
              Recent Found Reports
            </h2>

          </div>

          <div className="divide-y divide-white/5">

            {foundItems.map((item) => (

              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 hover:bg-white/5 transition"
              >

                <div>

                  <h3 className="text-xl font-semibold text-white">
                    {item.itemName}
                  </h3>

                  <p className="text-gray-400 mt-1">
                    {item.description || "No description"}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === "Returned"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                      }`}
                  >
                    {item.status || "Pending"}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>

  );
}