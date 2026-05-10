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
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6 py-16 flex items-center justify-center">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-semibold mb-3">
            FOUND SOMETHING?
          </p>

          <h1 className="text-5xl font-bold text-white leading-tight">
            Report a Found Item
          </h1>

          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Help reunite lost belongings with their rightful owners using
            smart AI-powered matching and secure communication.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">

          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 space-y-6"
          >

            {/* ITEM NAME */}
            <div>
              <label className="text-sm text-gray-300 font-medium">
                Item Name
              </label>

              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g. Black HP Laptop"
                className="w-full mt-2 p-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-gray-300 font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item..."
                rows={4}
                className="w-full mt-2 p-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition resize-none"
              />
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* LOCATION */}
              <div>
                <label className="text-sm text-gray-300 font-medium">
                  Location Found
                </label>

                <input
                  type="text"
                  name="foundLocation"
                  value={formData.foundLocation}
                  onChange={handleChange}
                  placeholder="e.g. Hostel C"
                  className="w-full mt-2 p-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* DATE */}
              <div>
                <label className="text-sm text-gray-300 font-medium">
                  Date Found
                </label>

                <input
                  type="date"
                  name="foundDate"
                  value={formData.foundDate}
                  onChange={handleChange}
                  className="w-full mt-2 p-4 bg-white/10 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

            </div>

            {/* IMAGE */}
            <div>
              <label className="text-sm text-gray-300 font-medium">
                Upload Item Image
              </label>

              <label className="mt-2 border-2 border-dashed border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-400/40 transition bg-white/5">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                <div className="text-5xl mb-3">📦</div>

                <p className="text-white font-semibold">
                  Click to upload image
                </p>

                <span className="text-gray-400 text-sm mt-1">
                  PNG, JPG or JPEG
                </span>

              </label>
            </div>

            {/* PREVIEW */}
            {preview && (
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={preview}
                  className="w-full h-72 object-cover"
                  alt="Preview"
                />
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={uploading || saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-cyan-500/20"
            >
              {uploading
                ? "Uploading..."
                : saving
                  ? "Saving..."
                  : "Submit Found Item"}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}