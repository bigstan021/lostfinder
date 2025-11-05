"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-100 to-white px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>

        <form className="flex flex-col gap-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="mt-3 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {isRegistering ? "Sign Up" : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          {isRegistering ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-red-600 font-semibold hover:underline"
          >
            {isRegistering ? "Log In" : "Create one"}
          </button>
        </p>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
