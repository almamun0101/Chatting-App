import React from "react";

import useFirebaseData from "./useFirebaseData";

const FriendsList = () => {
  const userList = useFirebaseData("friendsList/");
 
  return (
    <div>
      <h2>Friends List</h2>
      {userList.map((user) => (
        <li
          key={user.uid}
          className="flex items-center bg-white shadow rounded-lg p-4 hover:bg-gray-50 transition justify-between"
        >{ console.log(user)}
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
    </div>
  );
};

export default FriendsList;
