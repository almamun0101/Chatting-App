import React, { useEffect, useMemo, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import useFirebaseData from "./useFirebaseData";
import date from "./date";
const UserList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const nowTime = date();
 
  const [userList, setUserList] = useState([]);

  const allRequest = useFirebaseData("friendRequest/");
  const allFriends = useFirebaseData("friendsList/");

  // Fetch all users except the current user
  useEffect(() => {
    const userListRef = ref(db, "userslist/");
    onValue(userListRef, (snapshot) => {
      const users = [];
      snapshot.forEach((item) => {
        if (item.key !== auth.currentUser?.uid) {
          users.push({ ...item.val(), uid: item.key });
        }
      });
      setUserList(users);
    });
  }, [auth.currentUser?.uid]);

  // Helper to generate consistent key
  const generateKey = (uid1, uid2) => (uid1 < uid2 ? uid1 + uid2 : uid2 + uid1);

  // Find all current friends
  const friendsList = useMemo(() => {
    return allFriends
      ? allFriends.filter(
          (friend) =>
            friend.sender === auth.currentUser?.uid ||
            friend.receiver === auth.currentUser?.uid
        )
      : [];
  }, [allFriends, auth.currentUser?.uid]);

  const isFriend = (userId) => {
    return friendsList.some(
      (friend) =>
        (friend.sender === auth.currentUser.uid &&
          friend.receiver === userId) ||
        (friend.receiver === auth.currentUser.uid && friend.sender === userId)
    );
  };

  const getRequestStatus = (userId) => {
    const req = allRequest?.find(
      (r) =>
        (r.sender === auth.currentUser.uid && r.receiver === userId) ||
        (r.receiver === auth.currentUser.uid && r.sender === userId)
    );
    if (req) {
      return req.sender === auth.currentUser.uid ? "sent" : "received";
    }
    return null;
  };

  const addFriend = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);

    const requestExists = allRequest?.some((item) => item.uid === key);
    if (requestExists) {
      toast.error("Request already sent!");
      return;
    }

    const requestData = {
      uid: key,
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiver: user.uid,
      receiverName: user.name,
      date: nowTime,
    };

    set(ref(db, `friendRequest/${key}`), requestData).then(() => {
      toast.success("Friend request sent!");
    });
    set(ref(db, `notification/${user.uid}`), {
      notfi: `${auth.currentUser.displayName}`,
      type : "SentRequest",
      id : user.uid,
      date : nowTime,
    }).then(() => {
      toast.success("Friend request sent!");
    }).catch((err)=>console.log(err))
  };

  // Only users not already friends or with pending requests
  const filteredUsers = useMemo(() => {
    return userList.filter(
      (user) => !getRequestStatus(user.uid) && !isFriend(user.uid)
    );
  }, [userList, allRequest, friendsList]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Toaster position="bottom-center" />
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Friends
      </h2>

      {filteredUsers.length > 0 ? (
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user.uid}
              className="flex items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300"
            >
            <img
                src={
                  user.img ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                }
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm"
              />

              <div className="ml-4 flex-1">
                <p className="font-semibold text-lg text-gray-700">
                  {user.name}
                </p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>

              <button
                onClick={() => addFriend(user)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:scale-105 hover:shadow-lg transition"
              >
                Add Friend
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No users available to add.</p>
      )}
    </div>
  );
};

export default UserList;
