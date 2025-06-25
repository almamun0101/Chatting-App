import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const FriendsList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
  const [request, setRequest] = useState([]);

  useEffect(() => {
    const userListRef = ref(db, "friendList/");
    onValue(userListRef, (snapshot) => {
      const array = [];
      snapshot.forEach((item) => {
        const userData = item.val();
        if (
          userData.sender.includes(auth.currentUser.uid) ||
          userData.reciver.includes(auth.currentUser.uid)
        ) {
          array.push({ ...userData, uid: item.key });
        }
      });
      setUserList(array);
    });
  }, []);

  const addFriend = (user) => {
    const key = auth.currentUser.uid + id;

    set(ref(db, "friendRequst/" + key), {
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      reciver: user.id,
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
            {/* {console.log("reciver : " +user.reciver)}
            {console.log("sender : " + user.sender)}
            {console.log("current" +auth.currentUser.uid)}
            {console.log(auth.currentUser.uid===user.reciver)} */}
            <div className="flex items-center">
              <img
                src={user.img}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-semibold text-lg">
                  {auth.currentUser.uid === user.reciver
                    ? user.senderName
                    : user.reciverName}
                </p>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addFriend(user)}
                className="bg-red-500 text-white px-2 py-2 rounded-lg hover:bg-blue-600 text-sm"
              >
                {auth.currentUser.uid === user.reciver ? "Accpet" : "Cancel"}

                {/* {friends.includes(userList.id) ? "Friend" : "Add Friend"} */}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
