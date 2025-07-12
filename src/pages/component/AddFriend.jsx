import { getAuth } from "firebase/auth";
import {
  getDatabase,
  onValue,
  remove,
  ref,
  set,
} from "firebase/database";
import React, { useEffect, useState } from "react";
import useFirebaseData from "./useFirebaseData";
import toast from "react-hot-toast";
import date from "./date";
import moment from "moment";

const AddFriend = () => {
  const db = getDatabase();
  const auth = getAuth();
  const nowTime = date();

  const [requestList, setRequestList] = useState([]);
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

        set(ref(db, `notification/${user.uid}`), {
          notfi: `${auth.currentUser.displayName}`,
          type: "AcceptRequest",
          id: user.uid,
          date: nowTime,
        }).then(() => {
          remove(ref(db, `notification/${user.uid}`));
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderRequest = (user) => {
    if (user.uid === auth.currentUser.uid) return null;
    const request = getRequest(user);
    if (!request) return null;

    let status = null;
    if (request.sender === auth.currentUser.uid) {
      status = "sent";
    } else if (request.receiver === auth.currentUser.uid) {
      status = "received";
    }

    return (
      <div
        key={user.uid}
        className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition-all duration-300"
      >
        <img
          src={user.img}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-400 text-xs mt-1">
            {moment(request.date, "YYYYMMDD, h:mm").fromNow()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {status === "sent" && (
            <span
              onClick={() => handleCancelRequest(user.uid)}
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1 rounded text-center"
            >
              Cancel
            </span>
          )}
          {status === "received" && (
            <span
              onClick={() => handleAccept(user)}
              className="cursor-pointer bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1 rounded text-center"
            >
              Accept
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Friend Requests</h2>
      <div className="space-y-5">
        {allUser.map((user) => renderRequest(user))}
      </div>
    </div>
  );
};

export default AddFriend;
