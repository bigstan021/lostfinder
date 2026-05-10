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
        <div className="min-h-screen bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-4 py-10 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
            <h1 className="text-5xl font-bold text-center text-cyan-400 mb-12 relative z-10">
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
                            className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 hover:scale-[1.02] hover:border-cyan-400/30 transition-all duration-300 shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition duration-500"></div>
                            <div className="flex justify-between items-center relative z-10">

                                <h3 className="font-semibold text-gray-800">
                                    <div>
                                        <h3 className="font-bold text-2xl text-white">
                                            {chat.itemName}
                                        </h3>

                                        <p className="text-cyan-400 font-medium">
                                            {chat.chatPartner}
                                        </p>
                                    </div>
                                </h3>

                                <span className="text-cyan-300 text-sm">
                                    {formatTime(chat.createdAt)}
                                </span>

                            </div>

                           <p className="text-sm text-gray-300 mt-3 truncate relative z-10">
                                {chat.lastMessage}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}