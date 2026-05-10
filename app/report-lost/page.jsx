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

  //  Verify user
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
    <section className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6 py-14 overflow-hidden">

      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-10 left-0 w-[500px] h-[500px] bg-red-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>

      {/* FORM */}
      {/* FORM */}
      <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 w-full max-w-lg overflow-hidden">

        {/* GLOW */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-cyan-500/5"></div>

        <div className="relative z-10">

          <h2 className="text-4xl font-extrabold text-center text-white mb-2">
            Report a <span className="text-red-600">Lost</span> Item
          </h2>

          <p className="text-center text-gray-400 mb-8">
            Report missing belongings and let LostFinder intelligently search for possible matches.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Item name"
              className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />

            <input
              name="lostLocation"
              value={formData.lostLocation}
              onChange={handleChange}
              placeholder="Location"
              className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />

            <input
              type="date"
              name="lostDate"
              value={formData.lostDate}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />

            <label className="border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-400 transition bg-white/5">

              <p className="text-white font-medium">
                Upload Item Image
              </p>

              <p className="text-gray-400 text-sm mt-1">
                PNG, JPG or JPEG
              </p>

              <input
                type="file"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {preview && (
              <img
                src={preview}
                className="w-full h-52 object-cover rounded-2xl border border-white/10 shadow-xl"
              />
            )}

            <button
              disabled={saving || uploading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl"
            >
              {saving || uploading ? "Processing..." : "Submit"}
            </button>

          </form>
        </div>
      </div>



      {/* RESULTS */}
      {showMatches && (
        <div className="mt-12 w-full max-w-6xl">

          <h3 className="text-4xl text-center font-extrabold text-white mb-10">
            Possible Matches
          </h3>

          {/*  NO MATCH */}
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

              <div key={it.id} className="group relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl hover:-translate-y-2 hover:border-cyan-400/30 transition-all duration-500">

                <img
                  src={it.imageUrl || FALLBACK_IMAGE}
                  className="h-52 w-full object-cover rounded-2xl group-hover:scale-105 transition duration-700"
                />

                <h4 className="font-bold mt-4 text-2xl text-white">{it.itemName}</h4>

                <p className="text-cyan-400 font-semibold text-lg">
                  {it.confidence}% match
                </p>

                <p className="text-sm text-gray-300 mt-2">
                  {it.reasons?.join(", ")}
                </p>

                <button
                  onClick={() => router.push(`/chat/${it.id}`)}
                  className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
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
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
            >
              🔔 Notify Me About Future Matches
            </button>

          </div>
        </div>
      )}
    </section>
  );
}