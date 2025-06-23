import React, { useEffect } from "react";
import SignUp from "./SignUp";
import Sidebar from "./component/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from "../slices/userslice";
import Userlist from "./component/Userlist";

const Home = () => {
  const data = useSelector((state) => state.userLogin.value); 
 
  return (
    <div>
      <div className="">
        {/* Main content */}
        <div className="">
          <h1 className="text-3xl font-bold mb-4">
            Welcome 
          </h1>
          <div className="">

          <Userlist/>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
