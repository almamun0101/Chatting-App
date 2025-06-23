import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    const userListRef = ref(db, "userslist/");
    onValue(userListRef, (snapshot) => {
      const array = [];
      
      snapshot.forEach((item) => {
        if(item.key != auth.currentUser.uid){
            array.push(item.val());
           
        }

      });
      setUserList(array);
    });
  }, []);
  console.log(userList)
  const addFriend = () => {};

  const removeUser = () => {};

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
      <ul className="space-y-4">
        {userList.map((user) => (
            <li
            key={user.uid}
            className="flex items-center bg-white shadow rounded-lg p-4 hover:bg-gray-50 transition justify-between"
            >
         
            <div className="flex items-center">
              <img
                src={user.img }
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
                onClick={() => addFriend()}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              >
                Add 
                {/* {friends.includes(userList.id) ? "Friend" : "Add Friend"} */}
              </button>
              <button
                onClick={() => removeUser()}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
