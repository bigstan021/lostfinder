"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebaseconfig";
import {
    doc,
    getDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import verifyUser from "../../verifyUser";

export default function ChatClient({ itemId }) {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState(null);
    const [item, setItem] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgText, setMsgText] = useState("");
    const [updatingAnon, setUpdatingAnon] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]); // others typing

    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // 1) Verify user
    useEffect(() => {
        const u = verifyUser();
        if (!u) {
            router.push("/login");
        } else {
            setCurrentUser(u);
        }
    }, [router]);

    // 2) Load item + subscribe to messages AND typing
    useEffect(() => {
        if (!itemId || !currentUser) return;

        let unsubMessages;
        let unsubTyping;

        const setupChat = async () => {
            try {
                // Load the found item
                const itemRef = doc(db, "foundReports", itemId);
                const snap = await getDoc(itemRef);

                if (!snap.exists()) {
                    alert("Item not found.");
                    router.push("/found-items");
                    return;
                }

                const itemData = snap.data();
                setItem(itemData);

                // Messages path: chats/{itemId}/messages
                const msgCol = collection(db, "chats", itemId, "messages");
                const q = query(msgCol, orderBy("createdAt", "asc"));

                unsubMessages = onSnapshot(
                    q,
                    (snapshot) => {
                        const list = snapshot.docs.map((d) => ({
                            id: d.id,
                            ...d.data(),
                        }));
                        setMessages(list);
                    },
                    (err) => {
                        console.error("onSnapshot error:", err);
                    }
                );

                // Typing path: chats/{itemId}/typing
                const typingCol = collection(db, "chats", itemId, "typing");
                unsubTyping = onSnapshot(
                    typingCol,
                    (snapshot) => {
                        const list = snapshot.docs
                            .map((d) => d.data())
                            .filter((t) => t.uid !== currentUser.uid && t.isTyping);
                        setTypingUsers(list);
                    },
                    (err) => {
                        console.error("Typing onSnapshot error:", err);
                    }
                );
            } catch (err) {
                console.error("Error in setupChat:", err);
            }
        };

        setupChat();

        return () => {
            if (unsubMessages) unsubMessages();
            if (unsubTyping) unsubTyping();
        };
    }, [itemId, currentUser, router]);

    // 3) Auto-scroll to bottom on new messages
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    // 4) Send message into chats/{itemId}/messages
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!msgText.trim() || !currentUser || !item) return;

        const msgCol = collection(db, "chats", itemId, "messages");

        await addDoc(msgCol, {
            text: msgText.trim(),
            sender: currentUser.uid,
            senderName:
                currentUser.displayName || currentUser.name || "User",
            senderPhotoURL: currentUser.photoURL || null,
            createdAt: serverTimestamp(),
        });

        setMsgText("");

        // stop typing once message sent
        await stopTyping();
    };

    // 5) Handle typing indicator
    const startTyping = async () => {
        if (!currentUser || !itemId) return;

        const typingDocRef = doc(
            db,
            "chats",
            itemId,
            "typing",
            currentUser.uid
        );

        await setDoc(
            typingDocRef,
            {
                uid: currentUser.uid,
                name:
                    currentUser.displayName || currentUser.name || "User",
                isFinder: currentUser.uid === item.reporterUID,
                isTyping: true,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );
    };

    const stopTyping = async () => {
        if (!currentUser || !itemId) return;

        const typingDocRef = doc(
            db,
            "chats",
            itemId,
            "typing",
            currentUser.uid
        );

        // You can either mark false or delete. I'll mark false to keep it simple.
        await setDoc(
            typingDocRef,
            {
                uid: currentUser.uid,
                isTyping: false,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setMsgText(value);

        if (!currentUser || !item) return;
        // If input not empty, user is typing
        if (value.trim().length > 0) {
            await startTyping();

            // reset timer
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                stopTyping();
            }, 1500); // 1.5s after last key
        } else {
            // if they cleared the input, stop typing immediately
            await stopTyping();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    // 6) Finder anonymity toggle
    const toggleAnon = async () => {
        if (!currentUser || !item) return;
        if (currentUser.uid !== item.reporterUID) return;

        const newVal = !item.isAnonymous;
        setUpdatingAnon(true);

        try {
            const itemRef = doc(db, "foundReports", itemId);
            await updateDoc(itemRef, { isAnonymous: newVal });
            setItem((prev) => ({ ...prev, isAnonymous: newVal }));
        } catch (err) {
            console.error("Error updating anonymity:", err);
            alert("Could not update anonymity. Try again.");
        } finally {
            setUpdatingAnon(false);
        }
    };

    // 7) Loading guard
    if (!itemId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600 text-lg">No item id provided.</p>
            </div>
        );
    }

    if (!currentUser || !item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600 text-lg">Loading chat...</p>
            </div>
        );
    }

    const isFinder = currentUser.uid === item.reporterUID;
    const isAnonymous = item.isAnonymous ?? true;
    const finderDisplayName = item.reporterName || "Finder";

    // Helper to format time
    const formatTime = (ts) => {
        if (!ts || !ts.toDate) return "";
        const d = ts.toDate();
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // Build typing text from typingUsers array
    let typingText = "";
    if (typingUsers.length === 1) {
        const t = typingUsers[0];
        if (t.isFinder) {
            typingText = isAnonymous ? "Anonymous finder is typing…" : `${finderDisplayName} is typing…`;
        } else {
            typingText = `${t.name || "Seeker"} is typing…`;
        }
    } else if (typingUsers.length > 1) {
        typingText = "Multiple people are typing…";
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col h-[80vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Chat about:{" "}
                            <span className="text-blue-600">
                                {item.itemName || "Item"}
                            </span>
                        </h2>

                        {isFinder ? (
                            <p className="text-xs text-gray-500 mt-1">
                                You are the{" "}
                                <span className="font-semibold">finder</span> for this
                                item.
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">
                                You are chatting with:{" "}
                                <span className="font-semibold">
                                    {isAnonymous ? "Anonymous finder" : finderDisplayName}
                                </span>
                            </p>
                        )}

                        {isFinder && (
                            <div className="flex items-center gap-2 mt-2">
                                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={toggleAnon}
                                        disabled={updatingAnon}
                                    />
                                    <span>
                                        Hide my identity from seekers
                                        {updatingAnon && " (updating…)"}
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 px-4 md:px-6 py-4 overflow-y-auto space-y-3 bg-gray-50">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-400 text-sm mt-4">
                            No messages yet. Start the conversation.
                        </p>
                    )}

                    {messages.map((m) => {
                        const mine = m.sender === currentUser.uid;
                        const isFinderMsg = m.sender === item.reporterUID;

                        // label for who sent it
                        let label;
                        if (mine) {
                            label = "You";
                        } else if (isFinderMsg) {
                            label = isAnonymous
                                ? "Anonymous finder"
                                : finderDisplayName;
                        } else {
                            label = m.senderName || "Seeker";
                        }

                        // avatar logic
                        let avatarURL = null;
                        if (isFinderMsg) {
                            if (!isAnonymous) {
                                avatarURL = m.senderPhotoURL || null;
                            }
                        } else {
                            avatarURL = m.senderPhotoURL || null;
                        }

                        const initials = label ? label.charAt(0).toUpperCase() : "?";

                        return (
                            <div
                                key={m.id}
                                className={`flex w-full ${mine ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`flex items-end gap-2 max-w-[80%] ${mine ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden text-[11px] font-semibold text-white">
                                        {avatarURL ? (
                                            <img
                                                src={avatarURL}
                                                alt={label}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{initials}</span>
                                        )}
                                    </div>

                                    {/* Name + bubble + time */}
                                    <div className="flex flex-col">
                                        <div
                                            className={`text-[11px] mb-1 ${mine ? "text-right" : "text-left"
                                                } text-gray-500`}
                                        >
                                            {label}
                                        </div>

                                        <div
                                            className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${mine
                                                    ? "bg-blue-600 text-white rounded-br-sm self-end"
                                                    : "bg-red-100 text-red-800 rounded-bl-sm self-start"
                                                }`}
                                        >
                                            {m.text}
                                        </div>

                                        <div
                                            className={`text-[10px] mt-1 text-gray-400 ${mine ? "text-right" : "text-left"
                                                }`}
                                        >
                                            {formatTime(m.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* typing indicator */}
                    {typingText && (
                        <div className="text-xs text-gray-500 mt-2 px-1">
                            {typingText}
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form
                    onSubmit={sendMessage}
                    className="px-4 md:px-6 py-4 border-t border-gray-100 flex gap-3"
                >
                    <input
                        type="text"
                        value={msgText}
                        onChange={handleInputChange}
                        placeholder="Type a message…"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
