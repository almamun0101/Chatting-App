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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { name: "Home", href: "#", icon: <Home/> },
    { name: "Messages", href: "#", icon: <MessageSquare/> },
    { name: "Users", href: "#", icon: <Users/> },
    { name: "Notifications", href: "#", icon: <Bell /> },
    { name: "Friends", href: "#", icon: <UserPlus/> },
    { name: "Settings", href: "#", icon: <Settings/> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Fullscreen Sidebar */}
      <div className=""></div>
      <div
        className={`bg-[#5f36f5] mx-2 my-3 rounded-3xl text-white w-[186px] py-6 px-2 space-y-6 flex  flex-col items-center inset-0 z-50 transform transition-transform duration-300 translate-x-0  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative`}
      >
        <div className="flex items-center justify-between">
          <div className="">
            <div className="flex justify-center">
              <img
                src="./avater.png"
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="lg:hidden"></div>
        </div>

        <nav className="space-y-2 overflow-y-auto max-h-[90vh]">
          {options.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-4  px-16 py-8 rounded-tl-xl rounded-bl-xl  hover:bg-white hover:text-[#5f36f5] duration-200 "
            >
              {item.icon}
              <span></span>
            </a>
          ))}
        </nav>
      </div>


    </div>
  );
};

export default Sidebar;
