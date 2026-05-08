"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { storage, db } from "../firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { matchItems } from "../utils/matchingEngine";
import { saveMatchRequest } from "../utils/matchRequest";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export default function ReportLost() {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    lostLocation: "",
    lostDate: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [matches, setMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false);
  const [noMatch, setNoMatch] = useState(false);

  const FALLBACK_IMAGE = "/placeholder.png";

  // 🔐 Verify user
  useEffect(() => {
    const u = verifyUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, [router]);

  if (!user) return null;

  // 🧠 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼 Image select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ☁️ Upload image
  const uploadImage = async () => {
    if (!imageFile) return "";

    setUploading(true);

    try {
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const fileName = `lost_items/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);

      setUploading(false);
      return url;
    } catch (err) {
      console.warn("Image upload skipped:", err);
      setUploading(false);
      return "";
    }
  };

  //  MATCHING ENGINE
  const findMatches = async (lostItem) => {
    try {
      const snap = await getDocs(collection(db, "foundReports"));

      const foundItems = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const results = matchItems(lostItem, foundItems);

      setMatches(results);
      setShowMatches(true);

      return results;
    } catch (err) {
      console.error("Matching error:", err);
      return [];
    }
  };

 // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.itemName.trim() ||
      !formData.lostLocation.trim() ||
      !formData.lostDate
    ) {
      alert("Please fill all required fields.");
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
      lostLocation: formData.lostLocation,
      lostDate: formData.lostDate,
      imageUrl,
      ownerUID: user.uid,
      ownerName: user.displayName || "User",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "lostReports"), report);

      alert("Lost item reported!");

      const results = await findMatches(formData);

      if (results.length === 0) {
        setNoMatch(true);
      } else {
        // reset only if matches exist
        setFormData({
          itemName: "",
          description: "",
          lostLocation: "",
          lostDate: "",
        });
        setPreview(null);
        setImageFile(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center bg-gray-50 px-6 py-14">

      {/* FORM */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          Report a Lost Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
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
            name="lostLocation"
            value={formData.lostLocation}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            name="lostDate"
            value={formData.lostDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input type="file" onChange={handleImageSelect} />

          {preview && (
            <img src={preview} className="w-full h-40 object-cover" />
          )}

          <button className="w-full bg-red-600 text-white py-2 rounded">
            Submit
          </button>
        </form>
      </div>

      {/* RESULTS */}
      {showMatches && (
        <div className="mt-12 w-full max-w-6xl">

          <h3 className="text-2xl text-center font-bold mb-6">
            Possible Matches
          </h3>

          {/* 🔔 NO MATCH */}
          {noMatch && (
            <div className="text-center mb-6">
              <p>No strong matches found.</p>

              <button
                onClick={async () => {
                  await saveMatchRequest(user, formData);
                  alert("You will be notified!");
                  setNoMatch(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                🔔 Notify me when match appears
              </button>
            </div>
          )}



          {/* MATCHES */}
          <div className="grid grid-cols-3 gap-4">

            {matches.map((it) => (

              <div key={it.id} className="bg-white p-4 shadow rounded">

                <img
                  src={it.imageUrl || FALLBACK_IMAGE}
                  className="h-40 w-full object-cover"
                />

                <h4 className="font-bold mt-2">{it.itemName}</h4>

                <p className="text-green-600">
                  {it.confidence}% match
                </p>

                <p className="text-xs">
                  {it.reasons?.join(", ")}
                </p>

                <button
                  onClick={() => router.push(`/chat/${it.id}`)}
                  className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Chat with Finder
                </button>

              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">

            <button
              onClick={async () => {

                await saveMatchRequest(user, formData);

                alert("You will be notified when a better match is uploaded!");

              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              🔔 Notify Me About Future Matches
            </button>

          </div>
        </div>
      )}
    </section>
  );
}