"use client";

import { useEffect, useState } from "react";
import verifyUser from "../verifyUser";
import { useRouter } from "next/navigation";
import { db } from "../firebaseconfig";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    doc,
} from "firebase/firestore";

export default function NotificationsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const u = verifyUser();
        if (!u) return router.push("/login");

        setUser(u);

        const q = query(
            collection(db, "notifications"),
            where("userUID", "==", u.uid),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snap) => {
            setNotifications(
                snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
        });

        return () => unsub();
    }, []);

    const openNotification = async (n) => {
        await updateDoc(doc(db, "notifications", n.id), {
            read: true,
        });

        if (n.itemId) {
            router.push(`/chat/${n.itemId}`);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
                Notifications
            </h1>

            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`p-4 rounded shadow cursor-pointer ${n.read
                                    ? "bg-white"
                                    : "bg-blue-50 border border-blue-300"
                                }`}
                        >
                            <p>{n.message}</p>

                            {!n.read && (
                                <span className="text-xs text-blue-600 font-semibold">
                                    NEW
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}