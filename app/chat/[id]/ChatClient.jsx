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
} from "firebase/firestore";

import verifyUser from "../../verifyUser";
import { sendNotification } from "../../utils/sendNotification";

export default function ChatClient({ itemId }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);

  const [chatData, setChatData] = useState(null);

  const [item, setItem] = useState(null);

  const [messages, setMessages] = useState([]);

  const [msgText, setMsgText] = useState("");

  const bottomRef = useRef(null);

  // 🔹 Verify user
  useEffect(() => {
    const u = verifyUser();

    if (!u) {
      router.push("/login");
    } else {
      setCurrentUser(u);
    }
  }, [router]);

  // 🔥 LOAD PRIVATE CHAT
  useEffect(() => {
    if (!itemId || !currentUser) return;

    let unsub;

    const setupChat = async () => {
      // 🔹 GET CHAT DOCUMENT
      const chatRef = doc(db, "chats", itemId);

      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        alert("Chat not found.");
        router.push("/found-items");
        return;
      }

      const chat = chatSnap.data();

      setChatData(chat);

      //  LOAD REAL ITEM
      const itemRef = doc(db, "foundReports", chat.itemId);

      const itemSnap = await getDoc(itemRef);

      if (!itemSnap.exists()) {
        alert("Item not found.");
        router.push("/found-items");
        return;
      }

      const itemData = itemSnap.data();

      setItem(itemData);

      //  LOAD MESSAGES
      const msgCol = collection(db, "chats", itemId, "messages");

      const q = query(msgCol, orderBy("createdAt", "asc"));

      unsub = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setMessages(list);
      });
    };

    setupChat();

    return () => {
      if (unsub) unsub();
    };
  }, [itemId, currentUser, router]);

  //  Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  //  SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!msgText.trim()) return;

    if (!chatData) return;

    await addDoc(
      collection(db, "chats", itemId, "messages"),
      {
        text: msgText,

        sender: currentUser.uid,

        senderName:
          currentUser.displayName ||
          currentUser.email ||
          "User",

        createdAt: serverTimestamp(),
      }
    );

    //  PRIVATE RECEIVER LOGIC
    const receiverUID =
      currentUser.uid === chatData.finderUID
        ? chatData.seekerUID
        : chatData.finderUID;

    //  notify
    await sendNotification({
      userUID: receiverUID,

      type: "chat",

      message: `New message about ${chatData.itemName}`,

      itemId,
    });

    setMsgText("");
  };

  //  CLAIM REQUEST
  const requestClaim = async () => {
    if (!chatData || !item) return;

    await addDoc(collection(db, "claims"), {
      itemId: chatData.itemId,

      itemName: chatData.itemName,

      seekerUID: chatData.seekerUID,

      seekerName: chatData.seekerName,

      finderUID: chatData.finderUID,

      finderName: chatData.finderName,

      status: "pending",

      createdAt: serverTimestamp(),
    });

    //  notify finder
    await sendNotification({
      userUID: chatData.finderUID,

      type: "claim",

      message: `${chatData.seekerName} requested to claim your item`,

      itemId,
    });

    alert("Claim request sent.");
  };

  if (!currentUser || !item || !chatData) {
    return (
      <div className="p-10 text-center">
        Loading chat...
      </div>
    );
  }

  //  LOGIC
  const isFinder =
    currentUser.uid === chatData.finderUID;

  const isAnonymous =
    chatData.isAnonymous ?? true;

  const finderName =
    chatData.finderName || "Finder";

  const seekerName =
    chatData.seekerName || "User";

  const isResolved =
    item.status === "Claimed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-full max-w-3xl bg-white shadow rounded-xl flex flex-col h-[80vh]">

        {/* HEADER */}
        <div className="p-4 border-b">

          <h2 className="font-bold text-blue-600">
            Chat about: {chatData.itemName}
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {isFinder
              ? `You are chatting with ${seekerName}`
              : isAnonymous
                ? "You are chatting with an anonymous finder"
                : `You are chatting with ${finderName}`}
          </p>

        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.map((m) => {

            const mine =
              m.sender === currentUser.uid;

            const isFinderMsg =
              m.sender === chatData.finderUID;

            let displayName;

            if (mine) {
              displayName = "You";
            }

            else if (isFinderMsg) {
              displayName = isAnonymous
                ? "Anonymous Finder"
                : finderName;
            }

            else {
              displayName = seekerName;
            }

            return (
              <div
                key={m.id}
                className={`flex ${mine
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >

                <div
                  className={`max-w-[70%] p-3 rounded-lg ${mine
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                    }`}
                >

                  <p className="text-xs mb-1 opacity-70">
                    {displayName}
                  </p>

                  <p>{m.text}</p>

                </div>

              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>

        {/*  CLAIMED */}
        {isResolved ? (

          <div className="p-4 border-t text-center text-red-600 font-semibold">
            This item has already been claimed.
          </div>

        ) : (

          <>
            {/* INPUT */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t flex gap-2"
            >

              <input
                value={msgText}
                onChange={(e) =>
                  setMsgText(e.target.value)
                }
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type message..."
              />

              <button className="bg-blue-600 text-white px-4 rounded">
                Send
              </button>

            </form>

            {/* CLAIM BUTTON */}
            {!isFinder && (
              <button
                onClick={requestClaim}
                className="bg-green-600 text-white py-2 hover:bg-green-700"
              >
                Request to Claim This Item
              </button>
            )}

          </>
        )}

      </div>

    </div>
  );
}