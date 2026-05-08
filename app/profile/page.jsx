"use client";

import verifyUser from "../verifyUser";

export default function Profile() {
  const user = verifyUser();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 text-center">
      <img src={user.photo} className="w-20 h-20 rounded-full mx-auto" />
      <h2 className="text-xl font-bold mt-3">{user.name}</h2>
      <p className="text-gray-500">{user.email}</p>
    </div>
  );
}