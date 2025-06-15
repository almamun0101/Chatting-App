import React, { useEffect, useState } from "react";
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
  const [isPage, setIsPage] = useState(1);

 const handlePage=(page)=>{
 setIsPage(page);
 }

  const options = [
    { name: "Home", value:"1", to: "/", icon: <Home/> },
    { name: "Messages",value:"2", to: "/messages", icon: <MessageSquare/> },
    { name: "Users",value:"3", to: "/friendlist", icon: <Users/> },
    { name: "Notifications",value:"4", to: "/notifications", icon: <Bell /> },
    { name: "Friends",value:"5", to: "/addfriend", icon: <UserPlus/> },
    { name: "Settings",value:"6", to: "/setting", icon: <Settings/> },
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
            onClick={()=>handlePage(item.value)}
              key={item.name}
              to={item.to}

              className={`flex items-center gap-4  px-16 py-6 rounded-tl-xl rounded-bl-xl duration-200 ${(item.value==isPage)? " bg-white text-[#5f36f5]": ""}`}
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
