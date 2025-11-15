"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import verifyUser from "../verifyUser";
import { storage } from "../firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

  // Check login
  useEffect(() => {
    const u = verifyUser();
    if (!u) router.push("/login");
    else setUser(u);
  }, []);

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

    const fileName = `found_items/${Date.now()}_${imageFile.name}`;
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

    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage();
    }

    console.log("FOUND ITEM REPORTED:", {
      ...formData,
      imageUrl,
      reporter: user.email,
    });

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
  };

  return (
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
              required
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
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {uploading ? "Uploading..." : "Submit Found Item"}
          </button>
        </form>
      </div>
    </section>
  );
}
