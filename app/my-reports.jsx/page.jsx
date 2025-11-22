"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { db } from "../firebaseconfig";
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
  const [loading, setLoading] = useState(true);

  // Verify login
  useEffect(() => {
    const u = verifyUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    fetchReports(u.uid);
  }, []);

  // Fetch user's own reports
  const fetchReports = async (uid) => {
    try {
      const q = query(
        collection(db, "foundReports"),
        where("reporterUID", "==", uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(items);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update status (Pending / Claimed / Resolved)
  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "foundReports", id), {
        status: newStatus,
      });

      // Update local UI instantly
      setReports((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading your reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        My Reports
      </h1>

      {/* If no reports */}
      {reports.length === 0 ? (
        <p className="text-center text-gray-500">
          You have not submitted any reports yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-4 border"
            >
              {/* Image */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt="Found Item"
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-3 text-gray-500">
                  No Image
                </div>
              )}

              {/* Item Name */}
              <h2 className="text-xl font-semibold text-gray-800">
                {item.itemName}
              </h2>

              {/* Description */}
              <p className="text-gray-600 mt-1">{item.description}</p>

              {/* Location */}
              <p className="text-sm text-gray-500 mt-2">
                <strong>Found Location:</strong> {item.foundLocation}
              </p>

              {/* Date */}
              <p className="text-sm text-gray-500">
                <strong>Found Date:</strong> {item.foundDate}
              </p>

              {/* Status */}
              <p className="mt-3 text-sm font-medium">
                Status:{" "}
                <span
                  className={`${
                    item.status === "Claimed"
                      ? "text-green-600"
                      : item.status === "Resolved"
                      ? "text-purple-600"
                      : "text-blue-600"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </p>

              {/* Status buttons (ONLY for owner) */}
              <div className="flex gap-2 mt-4">
                <button
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md"
                  onClick={() => updateStatus(item.id, "Pending")}
                >
                  Pending
                </button>
                <button
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md"
                  onClick={() => updateStatus(item.id, "Claimed")}
                >
                  Claimed
                </button>
                <button
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md"
                  onClick={() => updateStatus(item.id, "Resolved")}
                >
                  Resolved
                </button>
              </div>

              {/* Report ID */}
              <p className="text-xs text-gray-400 mt-3">ID: {item.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
