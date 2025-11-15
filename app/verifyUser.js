"use client";

export default function verifyUser() {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("user");

  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
