"use client";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { storage, db } from "../firebaseconfig"; // db added
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ReportFound() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    foundLocation: "",
    foundDate: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check login
  useEffect(() => {
    const u = verifyUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, [router]);

  if (!user) return null;

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Select image + preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Upload image to firebase
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);

    const safeName = imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const fileName = `found_items/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, fileName);

    try {
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      setUploading(false);
      return url;
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
      return null;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (extra check)
    if (!formData.itemName.trim() || !formData.foundLocation.trim() || !formData.foundDate) {
      alert("Please fill item name, location and date.");
      return;
    }

    setSaving(true);

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        alert("Failed to upload image. Try again.");
        setSaving(false);
        return;
      }
    }

    // Build report object
    const report = {
      itemName: formData.itemName,
      description: formData.description,
      foundLocation: formData.foundLocation,
      foundDate: formData.foundDate,
      imageUrl: imageUrl || "",
      reporterEmail: user.email || user?.email || null,
      reporterUID: user.uid || user?.uid || null,
      reporterName: user.name || user.displayName || null,
      createdAt: serverTimestamp(),
    };

    try {
      // Save to Firestore (collection 'foundReports')
      await addDoc(collection(db, "foundReports"), report);

      // Optional: console log
      console.log("FOUND ITEM REPORTED:", report);

      alert("Found item submitted successfully!");

      // Reset form
      setFormData({
        itemName: "",
        description: "",
        foundLocation: "",
        foundDate: "",
        imageUrl: "",
      });
      setImageFile(null);
      setPreview(null);

      // redirect to user's reports (you should create /my-reports)
      router.push("/found-items");
    } catch (err) {
      console.error("Error saving report:", err);
      alert("Failed to save report. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Navbar />
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-14">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Report a Found Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Item Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="e.g. iPhone, Wallet..."
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the condition, color, features..."
              className="w-full border border-gray-300 rounded-md p-2 h-24"
            ></textarea>
          </div>

          {/* Location Found */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location Found
            </label>
            <input
              type="text"
              name="foundLocation"
              value={formData.foundLocation}
              onChange={handleChange}
              placeholder="Where did you find it?"
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Date Found */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Date Found
            </label>
            <input
              type="date"
              name="foundDate"
              value={formData.foundDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Image (Optional)
            </label>
            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </div>

          {/* Preview */}
          {preview && (
            <img
              src={preview}
              className="w-full h-40 object-cover rounded-md border"
              alt="Preview"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || saving}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          >
            {uploading ? "Uploading image..." : saving ? "Saving..." : "Submit Found Item"}
          </button>
        </form>
      </div>
    </section>
    </>
  );
}
