"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { storage, db } from "../firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { matchItems } from "../utils/matchingEngine";
import { sendNotification } from "../utils/sendNotification";

export default function ReportFound() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    foundLocation: "",
    foundDate: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  //  Check login
  useEffect(() => {
    const u = verifyUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, [router]);

  if (!user) return null;

  //  Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Image select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //  Upload image
  const uploadImage = async () => {
    if (!imageFile) return "";

    setUploading(true);

    try {
      const fileName = `found_items/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      setUploading(false);
      return url;
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      return "";
    }
  };

  //  Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.itemName.trim() ||
      !formData.foundLocation.trim() ||
      !formData.foundDate
    ) {
      alert("Please fill item name, location and date.");
      return;
    }

    setSaving(true);

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage();
    }

    const report = {
      itemName: formData.itemName,
      description: formData.description,
      foundLocation: formData.foundLocation,
      foundDate: formData.foundDate,
      imageUrl: imageUrl || "",
      reporterEmail: user.email || null,
      reporterUID: user.uid || null,
      reporterName: user.displayName || user.name || "Finder",
      isAnonymous: true,
      createdAt: serverTimestamp(),
    };

    try {
      //  Save found item
      const docRef = await addDoc(collection(db, "foundReports"), report);

      const newItem = {
        id: docRef.id,
        ...report,
      };

      //  CHECK MATCH REQUESTS...the intelligence!!🧠
     const q = query(
  collection(db, "matchRequests"),
  where("active", "==", true)
);

const requestsSnap = await getDocs(q);

      for (const docSnap of requestsSnap.docs) {

        const req = docSnap.data();

        const results = matchItems(
          {
            itemName: req.itemName,
            description: req.description,
            lostLocation: req.location,
            lostDate: req.date,
          },
          [newItem]
        );

        if (results.length > 0) {

          // don't notify uploader
          if (req.userUID === user.uid) return;

          await sendNotification({
            userUID: req.userUID,
            type: "match",
            message: `A new item matches your lost item (${newItem.itemName})`,
            itemId: newItem.id,
          });

        }
      }

      alert("Found item submitted successfully!");

      //  Reset form
      setFormData({
        itemName: "",
        description: "",
        foundLocation: "",
        foundDate: "",
      });

      setImageFile(null);
      setPreview(null);

      router.push("/my-reports");
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Failed to save report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-14">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Report a Found Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Item name"
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="foundLocation"
            value={formData.foundLocation}
            onChange={handleChange}
            placeholder="Location found"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            name="foundDate"
            value={formData.foundDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input type="file" accept="image/*" onChange={handleImageSelect} />

          {preview && (
            <img
              src={preview}
              className="w-full h-40 object-cover rounded"
              alt="Preview"
            />
          )}

          <button
            type="submit"
            disabled={uploading || saving}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {uploading
              ? "Uploading..."
              : saving
                ? "Saving..."
                : "Submit Found Item"}
          </button>

        </form>
      </div>
    </section>
  );
}