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
    <div className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        My Reports
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {reports.map((item) => (

          <div
            key={item.id}
            className="bg-white shadow rounded p-4"
          >

            <h2 className="text-xl font-semibold">
              {item.itemName}
            </h2>

            <p>{item.description}</p>

            <p className="text-sm mt-2">
              Status: {item.status || "Pending"}
            </p>

            {/* CLAIM REQUESTS */}
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
                  className="mt-3 p-2 border rounded bg-gray-100"
                >

                  <p>
                    Claim request from{" "}
                    <b>{c.seekerName}</b>
                  </p>

                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={() =>
                        approveClaim(
                          c.id,
                          item.id,
                          c.seekerUID
                        )
                      }
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectClaim(c.id)
                      }
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>

                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
} 