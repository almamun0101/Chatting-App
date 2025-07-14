import React from "react";
import { BellIcon } from "lucide-react";
import useFirebaseData from "./useFirebaseData";
import { BsPersonAdd } from "react-icons/bs";
import { getAuth } from "firebase/auth";
import moment from "moment";
import { useNavigate } from "react-router";
import { FaUserCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { chattingInfo } from "../../slices/chatSlice";
import { getDatabase, ref, update } from "firebase/database";

const Notifications = () => {
  const notifi = useFirebaseData("notification/");
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userList = useFirebaseData("userslist/") || [];

  const handleMessage = (message) => {
    navigate("/messages");
    const getUid = userList.find((user) => user.uid === message.id);
    dispatch(chattingInfo(getUid));
    console.log(getUid);
  };

  const handleRead = (notification) => {
    const notificationRef = ref(db, `notification/${notification.uid}`);
    update(notificationRef, { read: "read" })
      .then(() => {
        
        if ((notification.type === "SentRequest")) {
          navigate("/addfriend");
           console.log(notification.type)
        } else if ((notification.type === "AcceptRequest")) {
          navigate("/friendlist");
          console.log(notification.type)
        }
      })
      .catch((err) => {
        console.log("Error updating notification:", err);
      });
  };

  return (
    <div className="flex justify-center py-10 px-4  h-full">
      <div className="w-full max-w-2xl  overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <BellIcon className="text-gray-500" size={24} />
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {notifi.length > 0 ? (
            notifi
              .filter((n) => n.id === auth.currentUser.uid)
              .map((notification) => (
                <div
                  key={notification.uid}
                  className={`flex items-center gap-4 p-4 m-2 rounded-lg transition-all cursor-pointer border 
                    ${
                      notification.read === "unread"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200"
                    }
                    hover:shadow-md`}
                  onClick={() => handleRead(notification)}
                  >
                {console.log(notification)}
                  <div className="flex-shrink-0">
                    {notification.type === "SentRequest" && (
                      <BsPersonAdd size={28} className="text-green-500" />
                    )}
                    {notification.type === "AcceptRequest" && (
                      <FaUserCheck size={28} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm md:text-base">
                      <span className="font-bold">{notification.notifi}</span>{" "}
                      {notification.type === "SentRequest" &&
                        "sent you a friend request."}
                      {notification.type === "AcceptRequest" &&
                        "accepted your friend request."}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {moment(notification.date, "YYYYMMDD,h:mm").fromNow()}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessage(notification);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs md:text-sm hover:bg-blue-600 transition"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No new notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
