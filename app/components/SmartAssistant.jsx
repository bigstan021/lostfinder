"use client";

import { useState, useEffect, useRef } from "react";
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
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Auto Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    // AI Logic
    const getBotReply = (msg) => {

        const text = msg.toLowerCase();

        // DEVELOPER
        if (
            text.includes("who built") ||
            text.includes("developer") ||
            text.includes("creator") ||
            text.includes("who made") ||
            text.includes("author")
        ) {
            return "LostFinder was developed by Ifeanyi Stanley S. as an intelligent lost-item recovery platform using modern web and real-time technologies.";
        }

        // SYSTEM PURPOSE
        if (
            text.includes("what is lostfinder") ||
            text.includes("what does this system do") ||
            text.includes("purpose")
        ) {
            return "LostFinder is an intelligent system designed to help users recover lost items through smart matching, real-time communication and proactive notifications.";
        }

        // INTELLIGENCE
        if (
            text.includes("intelligent") ||
            text.includes("smart") ||
            text.includes("ai") ||
            text.includes("matching")
        ) {
            return "The system uses intelligent matching techniques that compare item names, descriptions, locations and dates to generate confidence-based recovery suggestions.";
        }

        // SEARCH
        if (
            text.includes("search item") ||
            text.includes("find item") ||
            text.includes("search lost")
        ) {
            return `To search effectively:

1. Open the Search Found Items page.
2. Enter keywords related to your item.
3. Include details like color, brand or type.
4. Review intelligent match results.
5. Open chat if you find a possible match.`;
        }

        // REPORT LOST
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

        // REPORT FOUND
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

        // CLAIM
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

        // NOTIFICATIONS
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

        // PRIVACY
        if (
            text.includes("anonymous") ||
            text.includes("privacy") ||
            text.includes("identity")
        ) {
            return "LostFinder protects finder identity during communication by supporting anonymous interaction features.";
        }

        // CHAT
        if (
            text.includes("chat") ||
            text.includes("message") ||
            text.includes("conversation")
        ) {
            return "LostFinder includes a real-time chat system that enables communication between finders and claimers securely.";
        }

        // ADMIN
        if (
            text.includes("admin") ||
            text.includes("manage") ||
            text.includes("moderator")
        ) {
            return "The platform includes an administrative dashboard for monitoring reports, claims and user activities.";
        }

        // PROFILE
        if (
            text.includes("profile") ||
            text.includes("account")
        ) {
            return "Users can personalize and manage their profile information within the platform.";
        }

        // TECHNOLOGY
        if (
            text.includes("technology") ||
            text.includes("stack") ||
            text.includes("firebase") ||
            text.includes("next js")
        ) {
            return "LostFinder was built using Next.js, Firebase Authentication, Firestore Database, Firebase Storage and intelligent matching techniques.";
        }

        // HELP
        if (
            text.includes("help") ||
            text.includes("assist")
        ) {
            return "I can help explain searching, intelligent matching, reporting, notifications, claims, privacy and system features.";
        }

        // DEFAULT
        return "I’m LostFinder AI 🤖. I help users understand intelligent matching, searching, reporting, claiming and recovery processes within the platform.";
    };

    // Send Message
    const sendMessage = () => {

        if (!input.trim()) return;

        const userMsg = {
            sender: "user",
            text: input,
        };

        setMessages((prev) => [...prev, userMsg]);

        const currentInput = input;

        setInput("");
        setLoading(true);

        // Fake AI Delay
        setTimeout(() => {

            const botMsg = {
                sender: "bot",
                text: getBotReply(currentInput),
            };

            setMessages((prev) => [...prev, botMsg]);

            setLoading(false);

        }, 700);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-4 sm:right-6 bg-blue-600 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-xl text-2xl sm:text-3xl z-[999]"
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
                        className="fixed bottom-24 right-3 sm:right-6 w-[90%] sm:w-80 max-w-sm bg-white shadow-2xl rounded-2xl overflow-hidden z-[999]"
                    >

                        {/* Header */}
                        <div className="bg-blue-600 text-white p-4 font-bold">
                            <span className="text-red-600">Lost</span>Finder AI
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-50">

                            {messages.map((msg, i) => (

                                <div
                                    key={i}
                                    className={`p-3 rounded-xl text-sm max-w-[80%] whitespace-pre-line ${msg.sender === "user"
                                        ? "bg-blue-600 text-white ml-auto"
                                        : "bg-gray-200 text-black"
                                        }`}
                                >
                                    {msg.text}
                                </div>

                            ))}

                            {/* Loading */}
                            {loading && (
                                <div className="bg-gray-200 text-black p-3 rounded-xl w-fit">
                                    Typing...
                                </div>
                            )}

                            <div ref={messagesEndRef} />

                        </div>

                        {/* Input */}
                        <div className="flex border-t">

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                                placeholder="Ask something..."
                                aria-label="Chat input"
                                className="flex-1 p-3 outline-none text-sm"
                            />

                            <button
                                onClick={sendMessage}
                                aria-label="Send message"
                                className="bg-blue-600 text-white px-4 text-sm"
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