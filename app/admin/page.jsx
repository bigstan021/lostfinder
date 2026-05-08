"use client";

import { useEffect, useState } from "react";
import { db } from "../firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import verifyUser from "../verifyUser";

export default function AdminPage() {
  const [user, setUser] = useState(null);
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
    const snap = await getDocs(collection(db, "foundReports"));
    setFoundItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  if (!user || user.email !== "stanloclassic@gmail.com") {
    return <p className="text-center mt-10">Access Denied</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {foundItems.map(item => (
        <div key={item.id} className="border p-3 mb-2">
          {item.itemName}
        </div>
      ))}
    </div>
  );
}