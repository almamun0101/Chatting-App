import { getAuth } from "firebase/auth";
import {
  getDatabase,
  onValue,
  remove,
  set,
  ref,
  push,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import useFirebaseData from "./useFirebaseData";
import toast from "react-hot-toast";
import date from "./date";
import moment from "moment";
import UserList from "./Userlist";

const AddFriend = () => {
  const db = getDatabase();
  const auth = getAuth();
  const nowTime = date();

  const [view, setView] = useState("Sug"); // default: Suggestion
  const [requestList, setRequestList] = useState([]);
  const [loading, setLoading] = useState(true);

  const allUser = useFirebaseData("userslist/");

  const generateKey = (uid1, uid2) => (uid1 < uid2 ? uid1 + uid2 : uid2 + uid1);

  useEffect(() => {
    const dataFetch = ref(db, "friendRequest/");
    onValue(dataFetch, (snapshot) => {
      const requests = [];
      snapshot.forEach((item) => {
        requests.push({ ...item.val(), key: item.key });
      });
      setRequestList(requests);
      setLoading(false);
    });
  }, []);

  const getRequest = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    return requestList.find((req) => req.key === key);
  };

  const handleCancelRequest = (userId) => {
    const key = generateKey(auth.currentUser.uid, userId);
    remove(ref(db, "friendRequest/" + key)).then(() => {
      toast("Request cancelled", { icon: "❌" });
    });
  };

  const handleAccept = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    const friendsData = {
      uid: key,
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiver: user.uid,
      receiverName: user.name,
    };

    set(ref(db, `friendsList/${key}`), friendsData)
      .then(() => {
        remove(ref(db, "friendRequest/" + key));
        toast.success("Friend request accepted");
        return set(push(ref(db, `notification/`)), {
          notifi: auth.currentUser.displayName,
          type: "AcceptRequest",
          id: user.uid,
          date: nowTime,
          read: "unread",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sentRequests = allUser.filter((user) => {
    const request = getRequest(user);
    return request && request.sender === auth.currentUser.uid;
  });

  const receivedRequests = allUser.filter((user) => {
    const request = getRequest(user);
    return request && request.receiver === auth.currentUser.uid;
  });

  const renderRequestCard = (user, status) => {
    const request = getRequest(user);
    const dateText =
      request?.date && moment(request.date, "YYYYMMDD, h:mm").isValid()
        ? moment(request.date, "YYYYMMDD, h:mm").fromNow()
        : "Time not available";

    return (
      <div
        key={user.uid}
        className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md transition duration-300"
      >
        <img
          src={user.img || "https://via.placeholder.com/150"}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          
        </div>
        <div className="flex flex-col gap-2 min-w-[80px]">
          {status === "sent" && (
            <button
              onClick={() => handleCancelRequest(user.uid)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
            >
              Cancel
            </button>
          )}
          {status === "received" && (
            <button
              onClick={() => handleAccept(user)}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg transition"
            >
              Accept
            </button>
          )}
          <p className="text-gray-400 text-xs mt-1">{dateText}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-100">
      {/* Mobile tab buttons */}
      <div className="flex gap-2 mb-4 lg:hidden">
        <button
          onClick={() => setView("Sug")}
          className={`border rounded-2xl p-2 ${view === "Sug" ? "bg-gray-300" : ""}`}
        >
          Suggestion
        </button>
        <button
          onClick={() => setView("sent")}
          className={`border rounded-2xl p-2 ${view === "sent" ? "bg-gray-300" : ""}`}
        >
          Sent
        </button>
        <button
          onClick={() => setView("rec")}
          className={`border rounded-2xl p-2 ${view === "rec" ? "bg-gray-300" : ""}`}
        >
          Received
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-[80vh]">
        {/* Suggestion Panel */}
        {(view === "Sug" || !["sent", "rec"].includes(view)) && (
          <div className="col-span-  p-1 h-fit">
            <UserList />
          </div>
        )}

        {/* Sent Requests Panel */}
        {(view === "sent" || view === "Sug") && (
          <div className="col-span-1  p-1 ">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Sent Requests</h2>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : sentRequests.length > 0 ? (
              <div className="space-y-1">
                {sentRequests.map((user) => renderRequestCard(user, "sent"))}
              </div>
            ) : (
              <p className="text-gray-500">No sent requests</p>
            )}
          </div>
        )}

        {/* Received Requests Panel */}
        {(view === "rec" || view === "Sug") && (
          <div className="col-span-1  p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Received Requests</h2>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : receivedRequests.length > 0 ? (
              <div className="space-y-1">
                {receivedRequests.map((user) => renderRequestCard(user, "received"))}
              </div>
            ) : (
              <p className="text-gray-500">No received requests</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriend;
