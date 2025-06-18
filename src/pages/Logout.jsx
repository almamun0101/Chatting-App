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

      Logout
      </div>
      <button onClick={handleSignout}>Sign Out</button>
    </div>
  );
};

export default Logout;
