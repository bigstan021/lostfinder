"use client";

import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseconfig";
import { useRouter } from "next/navigation";


export default function Login() {
  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;


      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid
      }));

      router.push("/");
    } catch (err) {
      console.log("Google login failed:", err);
      alert("Failed to sign in. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center border border-blue-100">
       
          <div className="mb-6">
            <img
              src="/favicon.ico"
              alt="Logo"
              className="w-14 h-14 mx-auto"
            />
          </div>
       
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Login to <span className="text-blue-600"><span className="text-red-600">Lost</span>Finder</span>
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in to continue with
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all"
        >
          <FcGoogle size={24} />
          <span className="text-gray-700 font-medium">
            Google
          </span>
        </button>

      </div>
    </div>
  );
}
