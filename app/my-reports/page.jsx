"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { db } from "../firebaseconfig";
import { sendNotification } from "../utils/sendNotification";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

export default function MyReportsPage() {

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {

    const u = verifyUser();

    if (!u) {
      router.push("/login");
      return;
    }

    setUser(u);

    fetchReports(u.uid);
    fetchClaims(u.uid);

  }, []);

  //  Fetch reports
  const fetchReports = async (uid) => {

    const q = query(
      collection(db, "foundReports"),
      where("reporterUID", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    setReports(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  //  Fetch claims
  const fetchClaims = async (uid) => {

    const q = query(
      collection(db, "claims"),
      where("finderUID", "==", uid)
    );

    const snap = await getDocs(q);

    setClaims(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  //  Approve
  const approveClaim = async (
    claimId,
    itemId,
    seekerUID
  ) => {

    await updateDoc(doc(db, "claims", claimId), {
      status: "approved",
    });

    await updateDoc(doc(db, "foundReports", itemId), {
      status: "Returned",
    });

    const requestQuery = query(
      collection(db, "matchRequests"),
      where("userUID", "==", seekerUID),
      where("active", "==", true)
    );

    const requestSnap = await getDocs(requestQuery);

    requestSnap.forEach(async (d) => {

      await updateDoc(doc(db, "matchRequests", d.id), {
        active: false,
      });

    });
    await sendNotification({
      userUID: seekerUID,
      type: "approval",
      message: "Your claim request was approved 🎉",
      itemId,
    });

    alert("Claim approved");

    fetchClaims(user.uid);
    fetchReports(user.uid);
  };

  //  Reject
  const rejectClaim = async (claimId) => {

    await updateDoc(doc(db, "claims", claimId), {
      status: "rejected",
    });

    fetchClaims(user.uid);
  };

  if (!user) return null;

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6 py-16">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold mb-3">
            COMMAND CENTER
          </p>

          <h1 className="text-5xl font-bold text-white">
            My Reports
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Manage your found item reports, track recovery progress,
            and review claim requests from seekers.
          </p>

        </div>

        {/* EMPTY */}
        {reports.length === 0 ? (

          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-16 text-center">

            <div className="text-6xl mb-4">📦</div>

            <h2 className="text-2xl font-bold text-white mb-2">
              No Reports Yet
            </h2>

            <p className="text-gray-400">
              Your submitted found items will appear here.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {reports.map((item) => (

              <div
                key={item.id}
                className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >

                {/* GLOW */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition duration-500"></div>

                {/* IMAGE */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center text-6xl">
                    📦
                  </div>
                )}

                {/* CONTENT */}
                <div className="relative z-10 p-6">

                  <div className="flex items-center justify-between mb-4">

                    <h2 className="text-2xl font-bold text-white">
                      {item.itemName}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Returned"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                        }`}
                    >
                      {item.status || "Pending"}
                    </span>

                  </div>

                  <p className="text-gray-400 leading-relaxed mb-5">
                    {item.description || "No description provided."}
                  </p>

                  <div className="space-y-2 text-sm">

                    <p className="text-cyan-300">
                      📍 {item.foundLocation || "Unknown"}
                    </p>

                    <p className="text-cyan-300">
                      📅 {item.foundDate || "No date"}
                    </p>

                  </div>

                  {/* CLAIMS */}
                  <div className="mt-6 space-y-4">

                    {claims
                      .filter(
                        (c) =>
                          c.itemId === item.id &&
                          c.status === "pending" &&
                          item.status !== "Returned"
                      )
                      .map((c) => (

                        <div
                          key={c.id}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4"
                        >

                          <p className="text-white font-medium">
                            Claim request from
                          </p>

                          <p className="text-cyan-400 font-semibold mt-1">
                            {c.seekerName}
                          </p>

                          <div className="flex gap-3 mt-4">

                            <button
                              onClick={() =>
                                approveClaim(
                                  c.id,
                                  item.id,
                                  c.seekerUID
                                )
                              }
                              className="flex-1 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                rejectClaim(c.id)
                              }
                              className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                            >
                              Reject
                            </button>

                          </div>

                        </div>
                      ))}

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 