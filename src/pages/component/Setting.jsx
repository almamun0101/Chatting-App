import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { userLoginInfo } from "../../slices/userslice";
import { getAuth, updateProfile } from "firebase/auth";

const Setting = () => {
  const auth = getAuth();
  const [userName, setUserName] = useState("");
  const data = useSelector((state) => state.userLogin.value);
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleUpdateProfile = () => {
    updateProfile(auth.currentUser, {
      displayName: userName,
    }).then(()=>{
      window.location.reload();
      console.log(" data UpdATE SUCCEESSFULL")
    }).catch((error)=>{
      console.log(error)
    })
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <div className="pb-10">
          <label htmlFor="" className="flex  items-center gap-5  ">
            <h2>Name </h2>
            <input
              onChange={handleUserName}
              type="text"
              className="border rounded-xl p-1"
              placeholder={data.name}
            />
          </label>
        </div>
        <button
          onClick={handleUpdateProfile}
          className="bg-blue-600  text-white border px-5 py-1 "
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Setting;
