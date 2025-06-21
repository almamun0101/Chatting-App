import { getAuth, signOut } from "firebase/auth";
import React from "react";

const Logout = () => {
    const auth = getAuth();
  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Sign Out Scueess")
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div>
      <div className="">
         <div className="">
          <h1 className="text-2xl font-bold mb-4">
           LogOut
          </h1>
        
        </div>
      </div>
      <button onClick={handleSignout} className="border-1 px-3 rounded-2xl py-1 ">Sign Out</button>
    </div>
  );
};

export default Logout;
