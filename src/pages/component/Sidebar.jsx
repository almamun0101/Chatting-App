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
import { getDatabase, onValue, ref } from "firebase/database";

const options = [
  { name: "Home", to: "/", icon: <Home size={20} /> },
  { name: "Request", to: "/addfriend", icon: <UserPlus size={20} /> },
  { name: "Messages", to: "/messages", icon: <MessageSquare size={20} /> },
  { name: "Friends", to: "/friendlist", icon: <Users size={20} /> },
  { name: "Notifications", to: "/notifications", icon: <Bell size={20} /> },
  { name: "Settings", to: "/setting", icon: <Settings size={20} /> },
];

const Sidebar = () => {
  const user = useSelector((state) => state.userLogin.value);
  const [notifi, setNotifi] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
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

    return () => unsubscribeAuth();
  }, [dispatch]);

  useEffect(() => {
    const userListRef = ref(db, "notification/");
    const unsubscribe = onValue(userListRef, (snapshot) => {
      const notificationArray = [];
      snapshot.forEach((item) => {
        const userData = item.val();
        notificationArray.push({ ...userData });
      });
      setNotifi(notificationArray);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const hasNotifi = notifi?.some(
    (n) => n.id === user?.uid && n.read === "unread"
  );

  const handleProfileClick = () => {
    if (user?.uid) {
      navigate("/profile", { state: { userData: user.uid } });
    }
  };

  return (
    <div className="">

    <div className="relative">
      <div className="fixed md:block bottom-0 left-0 bg-gradient-to-br from-teal-500 via-cyan-400 to-blue-500 h-15 md:h-screen md:w-22 lg:w-54 md:top-0 md:left-0 w-full shadow-2xl text-white py-5 flex md:flex-col items-center transition-all duration-300">
        {/* Avatar (visible only on md and up) */}
        <div className="md:flex flex-col items-center ">
          <div className="pl-2 pb-10">

          <img
            onClick={handleProfileClick}
            src={user?.img ? user.img : "/avater.png"}
            alt="avatar"
            className="w-16 h-16 lg:w-20 lg:h-20   rounded-full object-cover ring-4 ring-white hover:scale-105 duration-300 cursor-pointer"
          />
          </div>
          <h2 className="hidden lg:block font-semibold mt-2 text-center">
            {user?.name || "Name"}
          </h2>
          <p className="hidden lg:block text-xs opacity-80 text-center">
            {user?.email || "Email"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-row md:flex-col md:gap-2 w-full justify-end overflow-y-auto">
          {options.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`group relative flex items-center px-2 md:px-5 py-2 md:py-4 my-1 mx-2 rounded-xl transition-all duration-300 
                ${
                  location.pathname === item.to
                    ? "bg-white text-[#0072ff] shadow-lg"
                    : "hover:bg-white/10 hover:shadow-md"
                }`}
            >
              <div className="flex justify-center lg:justify-start w-full items-center">
                {item.icon}
                <span
                  className="hidden lg:inline-block ml-3 text-sm font-medium group-hover:scale-105 group-hover:ml-4 duration-300"
                >
                  {item.name}
                </span>

                {/* Notification Badge */}
                {hasNotifi && item.to === "/notifications" && (
                  <span className="w-3 h-3 bg-red-500 rounded-full absolute top-1 right-3"></span>
                )}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;
