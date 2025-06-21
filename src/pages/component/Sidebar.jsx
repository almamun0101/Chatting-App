import React, { useEffect, useState } from "react";
import {
  Home,
  MessageSquare,
  Users,
  Bell,
  Settings,
  UserPlus,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from "../../slices/userslice";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {
   const data = useSelector((state) => state.userLogin.value); 
  
  const [isPage, setIsPage] = useState(1);
  const nevigate  = useNavigate();

  const handlePage = (page) => {
    setIsPage(page);
  };

  const options = [
    { name: "Home", value: "1", to: "/", icon: <Home /> },
    { name: "Messages", value: "2", to: "/messages", icon: <MessageSquare /> },
    { name: "Users", value: "3", to: "/friendlist", icon: <Users /> },
    { name: "Notifications", value: "4", to: "/notifications", icon: <Bell /> },
    { name: "Friends", value: "5", to: "/addfriend", icon: <UserPlus /> },
    { name: "Settings", value: "6", to: "/setting", icon: <Settings /> },
    { name: "Logout", value: "7", to: "/logout", icon: <FiLogOut /> },
  ];

  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          userLoginInfo({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
          })
        );
        
      } else {
        dispatch(userLoginInfo(null)),
        nevigate("/signin")
      }
    });
  }, [dispatch]);

  return (
    <div className="flex">
      {/* Fullscreen Sidebar */}
      
      <div
        className={`bg-[#5f36f5] mx-2 my-2 rounded-3xl text-white pl-2 py-5 space-y-5 flex  flex-col items-center inset-0 z-50 transform transition-transform duration-300 translate-x-0 lg:translate-x-0 lg:relative`}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <div className="flex justify-center flex-col items-center">
              <img
                src="./avater.png"
                alt="avatar"
                className="w-15  rounded-full object-cover"
              />
              <h2 className="font-bold py-1">{data.name}</h2>
              <h2 className="text-[10px] font-medium">{data.email}</h2>
            </div>
          </div>
          <div className="lg:hidden"></div>
        </div>

        <nav className=" overflow-y-auto ">
          {options.map((item) => (
            <Link
              onClick={() => handlePage(item.value)}
              key={item.name}
              to={item.to}
              className={`flex items-center gap-4  px-16 py-6  rounded-tl-xl rounded-bl-xl duration-200 ${
                item.value == isPage ? " bg-white text-[#5f36f5]" : ""
              }`}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
