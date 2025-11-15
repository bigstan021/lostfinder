"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";

export default function MyReports() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = verifyUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, []);

  if (!user) return null;

  const mockReports = [
    {
      title: "Black Wallet",
      date: "2025-02-10",
      status: "Pending",
    },
    {
      title: "Silver HP Laptop",
      date: "2025-01-25",
      status: "Resolved",
    },
  ];

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-5">My Reports</h1>

      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        <img src={user.photo} className="w-14 h-14 rounded-full border" />
        <div>
          <p className="text-xl font-semibold">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {mockReports.map((r, i) => (
          <div
            key={i}
            className="border p-4 rounded-lg shadow-sm bg-white flex justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{r.title}</p>
              <p className="text-sm text-gray-600">
                Reported on: {r.date}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                r.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
