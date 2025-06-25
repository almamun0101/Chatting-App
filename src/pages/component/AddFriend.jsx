import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const AddFriend = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [userList, setUserList] = useState([]);
    const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    const userListRef = ref(db, "friendRequest/");
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

const getRequestStatus = (userId) => {
    const req = requestList.find(
      (req) =>
        (req.sender === auth.currentUser.uid && req.reciver === userId) ||
        (req.reciver === auth.currentUser.uid && req.sender === userId)
    );
    if (req) {
      if (req.sender === auth.currentUser.uid) return "send";
      if (req.reciver === auth.currentUser.uid) return "received";
    }

    return null;
  };


  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
      <ul className="space-y-4">
        <Toaster position="bottom-center" reverseOrder={false} />
         {userList.map((user) => {
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
              <div className="flex gap-2">
                {status === "send" && (
                  <button className="bg-yellow-400 text-gray-900 px-3 py-1 rounded text-base cursor-default">
                    Requested
                  </button>
                )}

                {status === "received" && (
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-base">
                    Accept
                  </button>
                )}

                {!status && (
                  <button
                    onClick={() => addFriend(user)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-base"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AddFriend;
