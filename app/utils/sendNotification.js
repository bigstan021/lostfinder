import { db } from "../firebaseconfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const sendNotification = async ({
    userUID,
    type,
    message,
    itemId,
}) => {
    try {
        await addDoc(collection(db, "notifications"), {
            userUID,
            type,
            message,
            itemId,
            read: false,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error("Notification error:", err);
    }
};