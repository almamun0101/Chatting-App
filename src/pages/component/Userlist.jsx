import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const UserList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    const userListRef = ref(db, "friendRequest/");
    onValue(userListRef, (snapshot) => {
      const RequestArray = [];
      snapshot.forEach((item) => {
        const userData = item.val();
        // console.log(userData)
        if (
          userData.sender.includes(auth.currentUser.uid) ||
          userData.reciver.includes(auth.currentUser.uid)
        ) {
          RequestArray.push({ ...userData, uid: item.key });
        } 
      });
      setRequestList(RequestArray);
    });
  }, []);

  useEffect(() => {
    const userListRef = ref(db, "userslist/");
    onValue(userListRef, (snapshot) => {
      const Userarray = [];

      snapshot.forEach((item) => {
        const userData = item.val();
        if (item.key !== auth.currentUser.uid) {
          Userarray.push({ ...userData, uid: item.key });
        }
      });
      setUserList(Userarray);
    });
  }, []);

  const addFriend = (user) => {
    const key = auth.currentUser.uid + user.uid;
    let requstData = {
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      reciver: user.uid,
      reciverName: user.name,
    };
    set(push(ref(db, "friendRequest/")), requstData)
      .then(() => {
        toast.success("Request Send Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isRequestSend = (userId) => {
    return requestList.some(
      (req) =>
        (req.sender === auth.currentUser.uid && req.reciver === userId) ||
        (req.reciver === auth.currentUser.uid && req.sender === userId)
    );
  };

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
              {isRequestSend(user.uid) ? (
                <button
                  
                  className="bg-green-400 text-white px-3 py-1 rounded text-sm "
                >
                   {requestList.map((item) =>
                    item.reciver === user.uid ? "Requested " : "Accpet "
                  )}
                </button>
              ) : (
                <button
                  onClick={() => addFriend(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Add Friend
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
