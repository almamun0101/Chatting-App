import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import useFirebaseData from "./useFirebaseData";
import toast from "react-hot-toast";

const Request = () => {
  const db = getDatabase();
  const auth = getAuth();

  const [requestList, setRequestList] = useState([]);
  const allUser = useFirebaseData("userslist/");

  const generateKey = (uid1, uid2) => {
    return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
  };

  useEffect(() => {
    const dataFetch = ref(db, "friendRequest/");
    onValue(dataFetch, (snapshot) => {
      const requestArray = [];
      snapshot.forEach((item) => {
        const allData = item.val();
        if (item.key.includes(auth.currentUser.uid)) {
          requestArray.push({ ...allData, uid: item.key });
        }
      });
      setRequestList(requestArray);
    });
  }, []);

  const getRequestStatus = (userId) => {
    const req = requestList.find(
      (req) =>
        (req.sender === auth.currentUser.uid && req.receiver === userId) ||
        (req.receiver === auth.currentUser.uid && req.sender === userId)
    );
    if (req) {
      if (req.sender === auth.currentUser.uid) return "sent";
      if (req.receiver === auth.currentUser.uid) return "received";
    }
    return null;
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sentRequests = allUser.filter(
    (user) =>
      user.uid !== auth.currentUser.uid && getRequestStatus(user.uid) === "sent"
  );
  const receivedRequests = allUser.filter(
    (user) =>
      user.uid !== auth.currentUser.uid &&
      getRequestStatus(user.uid) === "received"
  );

  const renderRequestCard = (user, status) => (
    <div
      key={user.uid}
      className="flex items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
    >
      <img
        src={user.img}
        alt={user.name}
        className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 mr-4"
      />
      <div className="flex-1">
        <p className="font-semibold text-lg">{user.name}</p>
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>
      <div className="flex gap-2">
        {status === "sent" && (
          <button
            onClick={() => handleCancelRequest(user.uid)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Cancel
          </button>
        )}
        {status === "received" && (
          <button
            onClick={() => handleAccept(user)}
            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm"
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-50 min-h-full">
     

      {/* Received Requests */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">
          Received Requests
        </h2>
        {receivedRequests.length === 0 ? (
          <p className="text-gray-500">No received requests yet.</p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((user) =>
              renderRequestCard(user, "received")
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
