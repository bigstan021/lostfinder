// 🔔 Save match request
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseconfig";

export const saveMatchRequest = async (user, formData) => {
  try {
    await addDoc(collection(db, "matchRequests"), {
      userUID: user.uid,
      userEmail: user.email || null,
      itemName: formData.itemName,
      description: formData.description,
      location: formData.lostLocation,
      date: formData.lostDate,
      createdAt: serverTimestamp(),
      
      active: true,

    });
  } catch (err) {
    console.error("Error saving match request:", err);
  }
};  