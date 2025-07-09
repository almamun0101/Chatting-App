import React, { useEffect, useState } from "react";
import {
  Home,
  MessageSquare,
  Users,
  Bell,
  Settings,
  UserPlus,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { userLoginInfo } from "../../slices/userslice";
import { FiLogOut } from "react-icons/fi";

const options = [
  { name: "Home", value: "1", to: "/", icon: <Home size={20} /> },
  { name: "Messages", value: "2", to: "/messages", icon: <MessageSquare size={20} /> },
  { name: "Request", value: "5", to: "/addfriend", icon: <UserPlus size={20} /> },
  { name: "Friends", value: "3", to: "/friendlist", icon: <Users size={20} /> },
  { name: "Notifications", value: "4", to: "/notifications", icon: <Bell size={20} /> },
  { name: "Settings", value: "6", to: "/setting", icon: <Settings size={20} /> },
  { name: "Logout", value: "7", to: "/logout", icon: <FiLogOut size={20} /> },
];

const Sidebar = () => {
  const data = useSelector((state) => state.userLogin.value);
  const [isPage, setIsPage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
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
        dispatch(userLoginInfo(null));
        navigate("/signin");
      }
    });
  }, [dispatch]);

  const handlePage = (page) => {
    setIsPage(page);
  };

  return (
    <div className="flex">
      <div
        className="bg-gradient-to-b from-[#00c6ff] via-[#0072ff] to-[#1e3c72] h-screen w-20 lg:w-64 shadow-2xl text-white py-5 flex flex-col items-center  transition-all duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src={data.img ? data.img : "/avater.png"}
            alt="avatar"
            className="w-12 h-12 lg:w-20 lg:h-20 rounded-full object-cover ring-4 ring-white hover:scale-105 duration-300"
          />
          <h2 className="hidden lg:block font-semibold mt-2 text-center">{data.name ? data.name : "Name"}</h2>
          <p className="hidden lg:block text-xs opacity-80 text-center">{data.email ? data.email : "Email"}</p>
        </div>

        <nav className="flex-1 w-full overflow-y-auto">
          {options.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              onClick={() => handlePage(item.value)}
              className={`group relative flex items-center gap-4 px-4 py-4 my-1 mx-2 rounded-xl transition-all duration-300 
                ${item.value == isPage ? "bg-white text-[#0072ff] shadow-lg" : "hover:bg-white/10 hover:shadow-md"}`}
            >
              <div className="flex justify-center lg:justify-start w-full">
                {item.icon}
                <span
                  className={`hidden lg:inline-block ml-3 text-sm font-medium 
                    group-hover:scale-105 group-hover:ml-4 duration-300`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
