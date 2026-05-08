"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SmartAssistant() {

    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi 👋 I’m LostFinder AI. How can I help you today?",
        },
    ]);

    const [input, setInput] = useState("");

    //  AI Logic
    const getBotReply = (msg) => {

        const text = msg.toLowerCase();

        //  DEVELOPER
        if (
            text.includes("who built") ||
            text.includes("developer") ||
            text.includes("creator") ||
            text.includes("who made") ||
            text.includes("author")
        ) {
            return "LostFinder was developed by Ifeanyi Stanley S. as an intelligent lost-item recovery platform using modern web and real-time technologies.";
        }

        //  SYSTEM PURPOSE
        if (
            text.includes("what is lostfinder") ||
            text.includes("what does this system do") ||
            text.includes("purpose")
        ) {
            return "LostFinder is an intelligent system designed to help users recover lost items through smart matching, real-time communication and proactive notifications.";
        }

        //  INTELLIGENCE
        if (
            text.includes("intelligent") ||
            text.includes("smart") ||
            text.includes("ai") ||
            text.includes("matching")
        ) {
            return "The system uses intelligent matching techniques that compare item names, descriptions, locations and dates to generate confidence-based recovery suggestions.";
        }

        //  SEARCH GUIDANCE
        if (
            text.includes("search") ||
            text.includes("find")
        ) {
            return `To search effectively:

1. Open the Search Found Items page.
2. Enter keywords related to your item.
3. Include details like color, brand or type.
4. Review intelligent match results.
5. Open chat if you find a possible match.`;
        }

        //  REPORT LOST
        if (
            text.includes("report lost") ||
            text.includes("lost item")
        ) {
            return `To report a lost item:

1. Open the Report Lost page.
2. Enter item details carefully.
3. Add location and date.
4. Upload an image if available.
5. Submit the report.

The system will automatically perform intelligent matching.`;
        }

        //  REPORT FOUND
        if (
            text.includes("report found") ||
            text.includes("found item")
        ) {
            return `To report a found item:

1. Open the Report Found page.
2. Enter item details carefully.
3. Add where and when the item was found.
4. Upload an image if available.
5. Submit the report.

The system will compare the item against lost reports intelligently.`;
        }

        //  CLAIM PROCESS
        if (
            text.includes("claim") ||
            text.includes("recover") ||
            text.includes("retrieve")
        ) {
            return `To claim an item:

1. Open the matched item.
2. Start a chat with the finder.
3. Explain why the item belongs to you.
4. Send a claim request.
5. Wait for approval from the finder.`;
        }

        //  NOTIFICATIONS
        if (
            text.includes("notification") ||
            text.includes("notify") ||
            text.includes("no match")
        ) {
            return `If no match exists:

1. Activate smart notifications.
2. The system will monitor future uploads.
3. You will receive alerts when similar items are reported later.`;
        }

        //  PRIVACY
        if (
            text.includes("anonymous") ||
            text.includes("privacy") ||
            text.includes("identity")
        ) {
            return "LostFinder protects finder identity during communication by supporting anonymous interaction features.";
        }

        //  CHAT SYSTEM
        if (
            text.includes("chat") ||
            text.includes("message") ||
            text.includes("conversation")
        ) {
            return "LostFinder includes a real-time chat system that enables communication between finders and claimers securely.";
        }

        //  ADMIN
        if (
            text.includes("admin") ||
            text.includes("manage") ||
            text.includes("moderator")
        ) {
            return "The platform includes an administrative dashboard for monitoring reports, claims and user activities.";
        }

        //  PROFILE
        if (
            text.includes("profile") ||
            text.includes("account")
        ) {
            return "Users can personalize and manage their profile information within the platform.";
        }

        //  TECHNOLOGY
        if (
            text.includes("technology") ||
            text.includes("stack") ||
            text.includes("firebase") ||
            text.includes("next js")
        ) {
            return "LostFinder was built using Next.js, Firebase Authentication, Firestore Database, Firebase Storage and intelligent matching techniques.";
        }

        //  HELP
        if (
            text.includes("help") ||
            text.includes("assist")
        ) {
            return "I can help explain searching, intelligent matching, reporting, notifications, claims, privacy and system features.";
        }

        //  DEFAULT RESPONSE
        return "I’m LostFinder AI 🤖. I help users understand intelligent matching, searching, reporting, claiming and recovery processes within the platform.";
    };    //  Send message
    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg = {
            sender: "user",
            text: input,
        };

        const botMsg = {
            sender: "bot",
            text: getBotReply(input),
        };

        setMessages((prev) => [...prev, userMsg, botMsg]);

        setInput("");
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-8 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-xl text-3xl z-[999]"
            >
                🤖
            </button>

            {/* Chat Window */}
            <AnimatePresence>

                {open && (

                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-26 right-6 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden z-[999]"
                    >

                        {/* Header */}
                        <div className="bg-blue-600 text-white p-4 font-bold">
                            LostFinder AI
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-50">

                            {messages.map((msg, i) => (

                                <div
                                    key={i}
                                    className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user"
                                        ? "bg-blue-600 text-white ml-auto"
                                        : "bg-gray-200 text-black"
                                        }`}
                                >
                                    {msg.text}
                                </div>

                            ))}

                        </div>

                        {/* Input */}
                        <div className="flex border-t">

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask something..."
                                className="flex-1 p-3 outline-none"
                            />

                            <button
                                onClick={sendMessage}
                                className="bg-blue-600 text-white px-4"
                            >
                                Send
                            </button>

                        </div>

                    </motion.div>

                )}

            </AnimatePresence>
        </>
    );
}