import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  MessageSquare,
  Users,
  Bell,
  Settings,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { name: "Home", to: "/", icon: <Home/> },
    { name: "Messages", to: "/messages", icon: <MessageSquare/> },
    { name: "Users", to: "/friendlist", icon: <Users/> },
    { name: "Notifications", to: "/notifications", icon: <Bell /> },
    { name: "Friends", to: "/addfriend", icon: <UserPlus/> },
    { name: "Settings", to: "/setting", icon: <Settings/> },
  ];

  return (
    <div className="flex">
      {/* Fullscreen Sidebar */}
      <div className=""></div>
      <div
        className={`bg-[#5f36f5] mx-2 my-2 rounded-3xl text-white w-[186px] py-5 px-2 space-y-5 flex  flex-col items-center inset-0 z-50 transform transition-transform duration-300 translate-x-0 lg:translate-x-0 lg:relative`}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <div className="flex justify-center">
              <img
                src="./avater.png"
                alt="avatar"
                className="w-20  rounded-full object-cover"
              />
            </div>
          </div>
          <div className="lg:hidden"></div>
        </div>

        <nav className="space-y-4 overflow-y-auto ">
          {options.map((item) => (
            <Link
              key={item.name}
              to={item.to}

              className="flex items-center gap-4  px-16 py-6 rounded-tl-xl rounded-bl-xl  hover:bg-white hover:text-[#5f36f5] duration-200 "
            >
              {item.icon}
              <span></span>
            </Link>
          ))}
        </nav>
      </div>


    </div>
  );
};

export default Sidebar;
