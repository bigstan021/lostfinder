"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { db } from "../../firebaseconfig";

import {
    doc,
    getDoc,
} from "firebase/firestore";

export default function FoundItemDetails() {

    const { id } = useParams();
    const router = useRouter();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchItem = async () => {

            try {

                const ref = doc(db, "foundReports", id);

                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    alert("Item not found");
                    router.push("/found-items");
                    return;
                }

                setItem({
                    id: snap.id,
                    ...snap.data(),
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }

        };

        if (id) {
            fetchItem();
        }

    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading item...
            </div>
        );
    }

    if (!item) return null;

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">

            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow overflow-hidden">

                <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.itemName}
                    className="w-full h-72 object-cover"
                />

                <div className="p-6">

                    <h1 className="text-3xl font-bold text-gray-800">
                        {item.itemName}
                    </h1>

                    <p className="mt-4 text-gray-600">
                        {item.description}
                    </p>

                    <div className="mt-4 text-sm text-gray-500 space-y-1">

                        <p>
                            <strong>Location:</strong> {item.foundLocation}
                        </p>

                        <p>
                            <strong>Date:</strong> {item.foundDate}
                        </p>

                    </div>

                    <button
                        onClick={() => router.push(`/chat/${item.id}`)}
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                    >
                        Chat with Finder
                    </button>

                </div>
            </div>
        </div>
    );
}