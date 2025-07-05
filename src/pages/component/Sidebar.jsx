import React, { useEffect, useState } from "react";
import {
  Home,
  MessageSquare,
  Users,
  Bell,
  Settings,
  UserPlus,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from "../../slices/userslice";
import { FiLogOut } from "react-icons/fi";
const options = [
    { name: "Home", value: "1", to: "/", icon: <Home /> },
    { name: "Messages", value: "2", to: "/messages", icon: <MessageSquare /> },
    { name: "Requst", value: "5", to: "/addfriend", icon: <UserPlus /> },
    { name: "Friends", value: "3", to: "/friendlist", icon: <Users /> },
    { name: "Notifications", value: "4", to: "/notifications", icon: <Bell /> },
    { name: "Settings", value: "6", to: "/setting", icon: <Settings /> },
    { name: "Logout", value: "7", to: "/logout", icon: <FiLogOut /> },
  ];
const Sidebar = () => {
  const data = useSelector((state) => state.userLogin.value);
  const [isPage, setIsPage] = useState("");
  const nevigate = useNavigate();
  const location = useLocation();
  const [alert ,setAlert ] = useState('')
  const handlePage = (page) => {
    setIsPage(page);
  };

  

  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    const currentPage = options.find((item) => item.to === location.pathname);
    if (currentPage) {
      setIsPage(currentPage.value);
    }
  }, [location.pathname]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          userLoginInfo({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            img: user.photoURL,
            alert: 0,
          })
        );
      } else {
        dispatch(userLoginInfo(null)), nevigate("/signin");
      }
    });
  }, [dispatch]);

  return (
    <div className="flex">
      {/* Fullscreen Sidebar */}

      <div
        className={`bg-[#5f36f5] h-screen shadow-xl30  text-white pl-1 py-5 space-y-6 flex  flex-col items-center inset-0 z-50 transform transition-transform duration-300 translate-x-0 lg:translate-x-0 lg:relative`}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <div className="flex justify-center flex-col items-center">
              <img
                src={data.img ? data.img : "/avater.png"}
                alt="avatar"
                className="w-15  rounded-full object-cover"
              />
              <h2 className="font-bold py-1">
                {data.name ? data.name : "Name"}
              </h2>
              <p className="text-[8px] font-medium">
                {data.email ? data.email : "Email"}
              </p>
            </div>
          </div>
          <div className="lg:hidden"></div>
        </div>

        <nav className=" overflow-y-auto">
          {options.map((item) => (
            <Link
              onClick={() => handlePage(item.value)}
              key={item.name}
              to={item.to}
              className={`flex relative items-center gap-4  px-13 py-6  rounded-tl-xl rounded-bl-xl duration-200 ${
                item.value == isPage ? " bg-white text-[#5f36f5]" : ""
              }`}
            >
              {item.icon}
              {alert && <span className="absolute right-8 top-3 bg-red-500 w-2 h-2 mb-4 rounded-full"></span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
