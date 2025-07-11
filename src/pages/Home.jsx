import React, { useEffect } from "react";
import SignUp from "./SignUp";
import Sidebar from "./component/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from "../slices/userslice";
import Userlist from "./component/Userlist";
import Request from "./component/Request";

const Home = () => {
  const data = useSelector((state) => state.userLogin.value); 
 
  return (
    <div>
      <div className="p-4">
        {/* Main content */}
        <div className="">
          <h1 className="text-2xl font-bold mb-4">
            Welcome 
          </h1>
     <div className="flex flex-wrap items-center ">
          <Userlist/>
          <Request/>

     </div>


         
        </div>
      </div>
    </div>
  );
};

export default Home;
