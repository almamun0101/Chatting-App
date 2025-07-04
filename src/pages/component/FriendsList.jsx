import React, { useEffect } from "react";

import useFirebaseData from "./useFirebaseData";
import { getAuth } from "firebase/auth";

const FriendsList = () => {
  const auth = getAuth();
  const friendList = useFirebaseData("friendsList/");
  const userList = useFirebaseData("userslist/");

  useEffect(() => {}, []);

  const friendUid = friendList.filter((user) =>
    user.sender === auth.currentUser.uid ? user.receiver : user.sender
  );
  const friendInfo = (friendId) => {
    const userInfo =  userList.find((user) => user.uid === friendId);
    return userInfo
  };
  console.log(friendInfo);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Friend List</h1>
      {friendList.map((user) => (
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
              <p className="font-semibold text-lg">
                {auth.currentUser.uid === user.sender
                  ? user.receiverName
                  : user.senderName}
              </p>
              <p className="text-gray-500 text-sm">
                {auth.currentUser.uid === user.sender
                  ? user.senderName
                  : user.receiverName}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addFriend(user)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Unfriend
            </button>
            <button
              onClick={() => addFriend(user)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Block
            </button>
          </div>
        </li>
      ))}
    </div>
  );
};

export default FriendsList;
