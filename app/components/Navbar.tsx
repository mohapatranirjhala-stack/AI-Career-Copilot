
"use client";

import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();

  const [userEmail, setUserEmail] =
    useState("");
    const [userName, setUserName] =
  useState("");

 useEffect(() => {

  const user = auth.currentUser;

  if (user) {

    const email =
      user.email || "";

    const name =
      user.displayName ||
      email
        .split("@")[0]
        .replace(/\./g, " ")
        .replace(/\b\w/g, (c) =>
          c.toUpperCase()
        );

    setUserName(name);
    setUserEmail(email);

  }

}, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center bg-white shadow p-4 rounded-xl mb-6">

      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3">

  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

    {userName.charAt(0)}

  </div>

  <div>

    <p className="font-semibold text-sm">
      {userName}
    </p>

    <p className="text-xs text-gray-500">
      {userEmail}
    </p>

  </div>

</div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
}