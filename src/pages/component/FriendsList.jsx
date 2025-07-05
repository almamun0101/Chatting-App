import React, { useEffect } from "react";

import useFirebaseData from "./useFirebaseData";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import toast from "react-hot-toast";

const FriendsList = () => {
  const auth = getAuth();
  const db = getDatabase();
  const friendList = useFirebaseData("friendsList/");
  const userList = useFirebaseData("userslist/");
  const blockList = useFirebaseData("blockList/");
  const generateKey = (uid1, uid2) => {
    return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
  };

  const getFriendInfo = () => {
    const myFriendUid = friendList?.map((f) => {
      if (f.sender === auth.currentUser.uid) return f.receiver;
      else if (f.receiver === auth.currentUser.uid) return f.sender;
    });

    const friendInfo = userList?.filter((user) =>
      myFriendUid.includes(user.uid)
    );
    return friendInfo;
  };
  const friends = getFriendInfo();

  const handleUnfriend = (user) => {
    const friend = friendList.find(
      (f) =>
        (f.sender === auth.currentUser.uid && f.receiver === user.uid) ||
        (f.receiver === auth.currentUser.uid && f.sender === user.uid)
    );
    if (friend?.uid) {
      remove(ref(db, "friendsList/" + friend.uid))
        .then(() => toast.success("Unfriend The User"))
        .catch((err) => console.log(err));
    }
    console.log("click");
  };

  const handleBlock = (user) => {
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
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Friend List  */}
        <div className="h-70 overflow-auto">
          <h1 className="text-2xl font-bold ">Friend List</h1>
          {friends.map((user) => {
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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUnfriend(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Unfriend
                  </button>
                  <button
                    onClick={() => handleBlock(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Block
                  </button>
                </div>
              </li>
            );
          })}
        </div>

        {/* block LIst  */}
        <div className="h-70 overflow-auto">
          <h1 className="text-2xl font-bold">Block List</h1>
          {blockList.map((user) => {
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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUnfriend(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Unblock
                  </button>
                </div>
              </li>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
