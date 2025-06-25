import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import useFirebaseData from "./useFirebaseData";
import toast, { Toaster } from "react-hot-toast";

const AddFriend = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
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
    const req = requestList?.find(
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

  const handleRequest = (userId) => {
    const key = generateKey(auth.currentUser.uid, userId);

    remove(ref(db, "friendRequest/" + key));
  };
  const handleAccpet = (user) => {
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
        toast.success("Friends successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
        <ul className="space-y-4">
          {allUser
            .filter(
              (user) =>
                user.uid !== auth.currentUser.uid && getRequestStatus(user.uid)
            )
            .map((user) => {
              const status = getRequestStatus(user.uid);
              return (
                <li
                  key={user.uid}
                  className="flex items-center bg-white shadow rounded-lg p-4 hover:bg-gray-50 transition justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={user.img}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>
                  {console.log(user)}
                  <div className="flex gap-2">
                    {status === "sent" && (
                      <button
                        onClick={() => {
                          handleRequest(user.uid);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Requested
                      </button>
                    )}
                    {status === "received" && (
                      <button
                        onClick={() => {
                          handleAccpet(user);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      >
                        Acpet
                      </button>
                    )}
                    {!status && (
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                        None
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default AddFriend;
