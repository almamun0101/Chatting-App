import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const UserList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
  const [sendRequest, setSendRequest ] = useState({})

  useEffect(() => {
      const userListRef = ref(db, "friendRequst/");
      onValue(userListRef, (snapshot) => {
        const array = [];
        snapshot.forEach((item) => {
          const userData = item.val();
         
            array.push({ ...userData, uid: item.key });
          
        });
        setSendRequest(array);
      });
    }, []);
    console.log(sendRequest)
  

  useEffect(() => {
    const userListRef = ref(db, "userslist/");
    onValue(userListRef, (snapshot) => {
      const array = [];

      snapshot.forEach((item) => {
        const userData = item.val();
        if (item.key !== auth.currentUser.uid) {
          array.push({ ...userData, uid: item.key });
        }
      });
      setUserList(array);
    });
  }, []);

  const addFriend = (user) => {
    const key = auth.currentUser.uid + user.uid;
   
    set(ref(db, "friendRequst/" + key), {
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      reciver: user.uid,
      reciverName: user.name,
    })
      .then(() => {
        console.log("requst send");
        toast.success("Request Send Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeUser = () => {};

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
      <ul className="space-y-4">
        <Toaster position="bottom-center" reverseOrder={false} />
        {userList.map((user) => (
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
