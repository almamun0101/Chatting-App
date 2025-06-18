import React, { useEffect } from "react";
import SignUp from "./SignUp";
import Sidebar from "./component/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from "../slices/userslice";

const Home = () => {
  const data = useSelector((state) => state.userLogin.value);
  const auth = getAuth();
  const dispatch = useDispatch();


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch(userLoginInfo({
        name : user.displayName,
        email : user.email,
        uid : user.uid,
      }))
    });
  }, []);

  return (
    <div>
      <div className="">
        {/* Main content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to {data.displayName}
          </h1>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p>Select an option from the sidebar to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
