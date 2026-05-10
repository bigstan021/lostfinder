"use client";

import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import { useRouter } from "next/navigation";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Login() {
  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;


      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photo: user.photoURL,

          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      router.push("/");
    } catch (err) {
      console.log("Google login failed:", err);
      alert("Failed to sign in. Try again.");
    }
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#050816] via-[#0f172a] to-[#111827] px-6">

      {/* BACKGROUND GLOWS */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-lg">

        <div className="relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-10">

          {/* INNER GLOW */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>

          <div className="relative z-10 text-center">

            {/* LOGO */}
            <div className="mb-8">

              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shadow-cyan-400/30">

                <img
                  src="/favicon.ico"
                  alt="Logo"
                  className="w-10 h-10"
                />

              </div>

            </div>

            {/* HEADING */}
            <h1 className="text-5xl font-bold text-white leading-tight">

              Login to{" "}

              <span className="text-red-500">
                Lost
              </span>

              <span className="text-cyan-400">
                Finder
              </span>

            </h1>

            {/* SUBTEXT */}
            <p className="text-gray-400 mt-5 mb-10 leading-relaxed">
              Securely continue into the AI-powered campus
              recovery network.
            </p>

            {/* GOOGLE BUTTON */}
            <button
              onClick={loginWithGoogle}
              className="group relative overflow-hidden w-full flex items-center justify-center gap-4 bg-white/10 border border-white/10 rounded-2xl py-4 hover:border-cyan-500/20 hover:scale-[1.02] transition-all duration-300 shadow-xl"
            >

              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 transition duration-300"></div>

              <FcGoogle size={28} />

              <span className="relative z-10 text-white font-semibold text-lg">
                Continue with Google
              </span>

            </button>

            {/* SMALL TEXT */}
            <p className="text-gray-500 text-sm mt-8">
              LostFinder helps students reconnect with
              misplaced belongings faster.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
