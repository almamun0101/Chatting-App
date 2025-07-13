import React from "react";
import { BellIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import useFirebaseData from "./useFirebaseData";
import { BsPersonAdd } from "react-icons/bs";
import { getAuth } from "firebase/auth";
import moment from "moment";

const Notifications = () => {
  const notifi = useFirebaseData("notification/");
  const auth = getAuth();
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className="text-green-500" size={24} />;
      case "error":
        return <XCircleIcon className="text-red-500" size={24} />;
      case "info":
      default:
        return <BellIcon className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="min-h-full flex justify-center py-10 px-4">
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <BellIcon className="text-gray-500" size={24} />
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifi.length > 0 ? (
            notifi
              .filter((n) => n.id === auth.currentUser.uid)
              .map((notification) => (
                <div
                  key={notification.id}
                  className=" flex items-center gap-3 px-6 py-2 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                >
                  {notification.type === "SentRequest" && (
                    <BsPersonAdd size={25} className="text-green-500" />
                  )}

                  <div>
                    <p className="text-gray-700  ">
                      <span className="text-lg font-bold">
                        {notification.notfi + "   "}
                      </span>
                      {notification.type === "SentRequest" &&
                        "    Sent you a Freind Request "}
                    </p>
                    <span className="text-xs text-gray-400">
                      {moment(notification.date, "YYYYMMDD,h:mm").fromNow()}
                    </span>
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
