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
  where,
  updateDoc,
} from "firebase/firestore";

import verifyUser from "../../verifyUser";
import { sendNotification } from "../../utils/sendNotification";

export default function ChatClient({ itemId }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);

  const [chatData, setChatData] = useState(null);

  const [item, setItem] = useState(null);

  const [messages, setMessages] = useState([]);

  const [claim, setClaim] = useState(null);

  const [msgText, setMsgText] = useState("");

  const bottomRef = useRef(null);

  //  Verify user
  useEffect(() => {
    const u = verifyUser();

    if (!u) {
      router.push("/login");
    } else {
      setCurrentUser(u);
    }
  }, [router]);

  //  LOAD PRIVATE CHAT
  useEffect(() => {
    if (!itemId || !currentUser) return;

    let unsubClaims;
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

      // LOAD CLAIM STATUS
      const claimsRef = collection(db, "claims");

      const claimsQuery = query(
        claimsRef,
        where("itemId", "==", chat.itemId)
      );

     unsubClaims = onSnapshot(claimsQuery, (snapshot) => {
        if (!snapshot.empty) {
          setClaim({
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          });
        }
      });

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
      if (unsubClaims) unsubClaims();
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

  const updateClaimStatus = async (status) => {
    if (!claim) return;

    try {

      const claimRef = doc(db, "claims", claim.id);

      await updateDoc(claimRef, {
        status,
      });

      // notify seeker
      await sendNotification({
        userUID: claim.seekerUID,

        type: "claim-update",

        message:
          status === "accepted"
            ? `Your claim for ${claim.itemName} was approved`
            : `Your claim for ${claim.itemName} was rejected`,

        itemId,
      });

    } catch (err) {
      console.error(err);
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-4 py-10 overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
      <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.4)] rounded-3xl flex flex-col h-[85vh] overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b border-white/10 bg-white/5 backdrop-blur-xl">

          <h2 className="font-bold text-2xl text-cyan-400">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-cyan-500/20">

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
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl"
                    : "bg-white/10 backdrop-blur-xl border border-white/10 text-gray-200"
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
            {/* CLAIM STATUS */}
            {claim && (
              <div className="mx-4 mb-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 backdrop-blur-xl p-4 text-center">

                <p className="text-white font-semibold text-lg">
                  🛡️ Claim Request
                </p>

                <p className="text-cyan-300 mt-1">
                  {claim.seekerName} requested to claim this item.
                </p>

                <p className="mt-2 text-white capitalize">
                  Status: {claim.status}
                </p>

                {/* FINDER ACTIONS */}
                {isFinder && claim.status === "pending" && (
                  <div className="flex gap-3 justify-center mt-4">

                    <button
                      onClick={() => updateClaimStatus("accepted")}
                      type="button"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:scale-105 transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateClaimStatus("rejected")}
                      type="button"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold hover:scale-105 transition"
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            )}

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
                className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Type message..."
              />

              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 text-white px-6 rounded-2xl font-semibold shadow-xl">
                Send
              </button>

            </form>

            {/* CLAIM BUTTON */}
            {!isFinder && !claim && (
              <button
                onClick={requestClaim}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 hover:scale-[1.01] transition-all duration-300 font-semibold"
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