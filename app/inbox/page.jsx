"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { db } from "../firebaseconfig";

import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
} from "firebase/firestore";

export default function InboxPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);

    // 🔐 Verify user
    useEffect(() => {
        const u = verifyUser();

        if (!u) {
            router.push("/login");
        } else {
            setUser(u);
        }
    }, [router]);

    //  Fetch inbox chats
    useEffect(() => {
        if (!user) return;

        const fetchChats = async () => {

            try {

                const chatsRef = collection(db, "chats");

                const snapshot = await getDocs(chatsRef);

                const chatList = [];

                for (const chatDoc of snapshot.docs) {

                    const chatData = chatDoc.data();

                    // 🔥 ONLY SHOW USER'S PRIVATE ROOMS
                    const isParticipant =
                        chatData.finderUID === user.uid ||
                        chatData.seekerUID === user.uid;

                    if (!isParticipant) continue;

                    // 🔥 GET LAST MESSAGE
                    const msgRef = collection(
                        db,
                        "chats",
                        chatDoc.id,
                        "messages"
                    );

                    const q = query(
                        msgRef,
                        orderBy("createdAt", "desc"),
                        limit(1)
                    );

                    const msgSnap = await getDocs(q);

                    let lastMessage = "No messages yet";
                    let createdAt = null;

                    if (!msgSnap.empty) {
                        const lastMsg = msgSnap.docs[0].data();

                        lastMessage = lastMsg.text;
                        createdAt = lastMsg.createdAt;
                    }

                    // 🔥 DISPLAY NAME
                    let chatPartner;

                    if (chatData.finderUID === user.uid) {

                        // finder viewing
                        chatPartner =
                            chatData.seekerName || "User";

                    } else {

                        // seeker viewing
                        chatPartner = chatData.isAnonymous
                            ? "Anonymous Finder"
                            : chatData.finderName || "Finder";
                    }

                    chatList.push({
                        chatId: chatDoc.id,

                        itemName: chatData.itemName,

                        chatPartner,

                        lastMessage,

                        createdAt,
                    });
                }

                setChats(chatList);

            } catch (err) {

                console.error("Inbox error:", err);

            }
        };

        fetchChats();

    }, [user]);

    // 🕒 Format time
    const formatTime = (ts) => {
        if (!ts?.toDate) return "";

        const d = ts.toDate();

        return d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                Inbox
            </h1>

            {chats.length === 0 ? (

                <p className="text-center text-gray-500">
                    No conversations yet 💬
                    Start chatting with finders to recover your items.
                </p>

            ) : (

                <div className="max-w-2xl mx-auto space-y-4">

                    {chats.map((chat, i) => (

                        <div
                            key={i}
                            onClick={() => router.push(`/chat/${chat.chatId}`)}
                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
                        >

                            <div className="flex justify-between items-center">

                                <h3 className="font-semibold text-gray-800">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {chat.itemName}
                                        </h3>

                                        <p className="text-xs text-blue-600">
                                            {chat.chatPartner}
                                        </p>
                                    </div>
                                </h3>

                                <span className="text-xs text-gray-400">
                                    {formatTime(chat.createdAt)}
                                </span>

                            </div>

                            <p className="text-sm text-gray-600 mt-1 truncate">
                                {chat.lastMessage}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}