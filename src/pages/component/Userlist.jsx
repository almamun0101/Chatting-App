import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import useFirebaseData from "./useFirebaseData";

const UserList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const allRequest = useFirebaseData("friendRequest/");
  const generateKey = (uid1, uid2) => {
    return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
  };

  useEffect(() => {
    const userListRef = ref(db, "userslist/");
    onValue(userListRef, (snapshot) => {
      const Userarray = [];

      snapshot.forEach((item) => {
        const userData = item.val();
        if (item.key !== auth.currentUser?.uid) {
          Userarray.push({ ...userData, uid: item.key });
        }
      });
      setUserList(Userarray);
    });
  }, [auth.currentUser?.uid]);

  const addFriend = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    const requstData = {
      uid: key,
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiver: user.uid,
      receiverName: user.name,
    };
    const requestExists = allRequest?.some((item) => item.uid === key);
    if (!requestExists) {
      set(ref(db, `friendRequest/`+ key), requstData).then(() =>
        toast.success("Request sent successfully")
      );
    } else {
      toast.error("Request already sent!");
    }
  };

  const getRequestStatus = (userId) => {
    const req = allRequest?.find(
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
      <ul className="space-y-4">
        <Toaster position="bottom-center" reverseOrder={false} />
        {userList
          .filter((user) => getRequestStatus(user.uid) === null)
          .map((user) => (
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

              <div className="flex gap-2">
                <button
                  onClick={() => addFriend(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Add Friend
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;
