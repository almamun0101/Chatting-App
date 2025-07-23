import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import Profile from "./Profile";

const Setting = () => {
  const auth = getAuth();
  const data = useSelector((state) => state.userLogin.value);
  const [userName, setUserName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // const uid = auth.currentUser.uid;
  // console.log(auth.currentUser.displayName)
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleUpdateProfile = () => {
    updateProfile(auth.currentUser, {
      displayName: userName,
    })
      .then(() => {
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => {
          setSuccessMsg("");
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
    <div className="max-w-md mx-auto mt-10 p-6 ">
      <h1 className="text-3xl font-bold mb-6 text-left">Settings</h1>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">Update Name</label>
        <input
          onChange={handleUserName}
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder={data.name}
          value={userName}
        />
      </div>

      <button
        onClick={handleUpdateProfile}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
      >
        Save
      </button>

      {successMsg && (
        <p className="mt-4 text-green-600 text-center font-medium transition">
          {successMsg}
        </p>
      )}
    </div>
     </div>
  );
};

export default Setting;
