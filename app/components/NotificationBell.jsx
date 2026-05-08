"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebaseconfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import verifyUser from "../verifyUser";

export default function NotificationBell() {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔐 Auth + fetch notifications
  useEffect(() => {
    const u = verifyUser();
    if (!u) return;
    setUser(u);

    const q = query(
      collection(db, "notifications"),
      where("userUID", "==", u.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setNotifications(data);
    });

    return () => unsub();
  }, []);

  // 🔔 unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🧠 Format time
  const formatTime = (ts) => {
    if (!ts?.toDate) return "";
    const d = ts.toDate();

    return d.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  // 🔥 click notification
  const handleClick = async (notif) => {
    try {
      await updateDoc(doc(db, "notifications", notif.id), {
        read: true,
      });

      if (notif.itemId) {
        router.push(`/found-items/${notif.itemId}`) 
      }

      setOpen(false);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  //  close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-2xl"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl p-3 z-50 border">
          <h3 className="font-bold mb-3 text-gray-800">
            Notifications
          </h3>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No notifications
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                let bg = "bg-gray-100";
                let icon = "🔔";

                if (n.type === "chat") {
                  bg = "bg-blue-100 hover:bg-blue-200";
                  icon = "💬";
                }

                if (n.type === "claim") {
                  bg = "bg-yellow-100 hover:bg-yellow-200";
                  icon = "📩";
                }

                if (n.type === "approval") {
                  bg = "bg-green-100 hover:bg-green-200";
                  icon = "✅";
                }

                return (
                  <div
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`p-3 mb-2 rounded-lg cursor-pointer transition flex gap-2 items-start ${n.read ? "bg-gray-100" : bg
                      }`}
                  >
                    {/* Icon */}
                    <span className="text-lg">{icon}</span>

                    {/* Content */}
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-800">
                        {n.message}
                      </p>

                      <span className="text-xs text-gray-500 mt-1">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}