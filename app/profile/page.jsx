"use client";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebaseconfig";

import verifyUser from "../verifyUser";

export default function Profile() {

  const user = verifyUser();
  const [stats, setStats] = useState({
    reports: 0,
    recovered: 0,
    chats: 0,
  });

  useEffect(() => {

    const fetchStats = async () => {

      try {

        // REPORTS
        const reportsQuery = query(
          collection(db, "foundReports"),
          where("reporterUID", "==", user.uid)
        );

        const reportsSnap = await getDocs(reportsQuery);

        const reports = reportsSnap.docs;

        // RECOVERED
        const recovered = reports.filter(
          (doc) => doc.data().status === "Returned"
        ).length;

        // CHATS
        const chatsQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains", user.uid)
        );

        const chatsSnap = await getDocs(chatsQuery);

        setStats({
          reports: reports.length,
          recovered,
          chats: chatsSnap.size,
        });

      } catch (err) {

        console.error(err);

      }
    };

    fetchStats();

  }, [user]);


  if (!user) return null;

  return (

    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6 py-16">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* PAGE TITLE */}
        <div className="text-center mb-14">

          <p className="text-cyan-400 uppercase tracking-[0.3em] font-semibold mb-4">
            User Dashboard
          </p>

          <h1 className="text-5xl font-bold text-white">
            Welcome back 👋
          </h1>

        </div>

        {/* PROFILE CARD */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* PROFILE IMAGE */}
            <div className="relative">

              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>

              <img
                src={user.photo}
                alt="Profile"
                className="relative w-32 h-32 rounded-full border-4 border-cyan-400/40 shadow-2xl"
              />

            </div>

            {/* USER INFO */}
            <div className="text-center md:text-left flex-1">

              <h2 className="text-4xl font-bold text-white">
                {user.displayName}
              </h2>

              <p className="text-cyan-400 mt-2 text-lg">
                {user.email}
              </p>

              <p className="text-gray-400 mt-4 leading-relaxed max-w-2xl">
                Managing lost and found activities across campus
                through the LostFinder AI-powered recovery system.
              </p>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          {/* CARD 1 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">

            <p className="text-cyan-400 text-sm uppercase tracking-widest">
              Reports
            </p>

            <h3 className="text-5xl font-bold text-white mt-4">
              {stats.reports}
            </h3>

            <p className="text-gray-400 mt-3">
              Total items reported
            </p>

          </div>

          {/* CARD 2 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">

            <p className="text-cyan-400 text-sm uppercase tracking-widest">
              Recovered
            </p>

            <h3 className="text-5xl font-bold text-white mt-4">
              {stats.recovered}
            </h3>

            <p className="text-gray-400 mt-3">
              Successfully recovered items
            </p>

          </div>

          {/* CARD 3 */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:scale-[1.02] transition duration-300">

            <p className="text-cyan-400 text-sm uppercase tracking-widest">
              Chats
            </p>

            <h3 className="text-5xl font-bold text-white mt-4">
              {stats.chats}
            </h3>

            <p className="text-gray-400 mt-3">
              Active conversations
            </p>

          </div>

        </div>

        {/* ACTIVITY SECTION */}
        {/* <div className="mt-10 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-8">

          <h3 className="text-3xl font-bold text-white mb-6">
            Recent Activity
          </h3>

          <div className="space-y-4">

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-white">
                You reported a missing wallet.
              </p>

              <span className="text-cyan-400 text-sm">
                2 hours ago
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-white">
                Your laptop claim was approved.
              </p>

              <span className="text-cyan-400 text-sm">
                Yesterday
              </span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-white">
                New chat started for AirPods report.
              </p>

              <span className="text-cyan-400 text-sm">
                3 days ago
              </span>
            </div>

          </div>

        </div> */}

      </div>

    </section>
  );
}