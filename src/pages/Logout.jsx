import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";

const Logout = () => {
  const auth = getAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign out successful");
        setShowConfirm(false);
        // Optionally redirect or show toast
      })
      .catch((error) => {
        console.error("Sign out failed:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Log Out</h1>
      <button
        onClick={() => setShowConfirm(true)}
        className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
      >
        Sign Out
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">Do you really want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSignout}
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Log Out
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
