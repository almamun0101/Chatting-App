import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import useFirebaseData from "./useFirebaseData";
import date from "./date"

const UserList = () => {
  const db = getDatabase();
  const auth = getAuth();
  const nowTime = date();
  const [userList, setUserList] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const allRequest = useFirebaseData("friendRequest/");
  const allFriends = useFirebaseData("friendsList/");
  const allBlocks = useFirebaseData("blockList/");

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

  useEffect(() => {
    if (allFriends) {
      const myFriends = allFriends.filter(
        (friend) =>
          friend.sender === auth.currentUser?.uid ||
          friend.receiver === auth.currentUser?.uid
      );
      setFriendsList(myFriends);
    }
  }, [allFriends, auth.currentUser?.uid]);

  const addFriend = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    const requstData = {
      uid: key,
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiver: user.uid,
      receiverName: user.name,
      date : nowTime,
    };
    const requestExists = allRequest?.some((item) => item.uid === key);
    if (!requestExists) {
      set(ref(db, `friendRequest/${key}`), requstData)
        .then(() => {
          const notifiData = {
            id: user.uid,
            notifi: auth.currentUser.displayName,
            type: "SentRequest",
            date:nowTime,
            read:"unread"
          };
          set(push(ref(db, `notification/`)), notifiData)
            .then(() => console.log())
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
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

  const isFriend = (userId) => {
    return friendsList.some(
      (friend) =>
        (friend.sender === auth.currentUser.uid &&
          friend.receiver === userId) ||
        (friend.receiver === auth.currentUser.uid && friend.sender === userId)
    );
  };
  const isBlock = (userId) => {
    return allBlocks.some(
      (friend) =>
        (friend.blockBy === auth.currentUser.uid &&
          friend.blockUser === userId) ||
        (friend.blockUser === auth.currentUser.uid && friend.blockBy === userId)
    );
  };

  const filteredUsers = userList.filter(
    (user) =>
      getRequestStatus(user.uid) === null &&
      !isFriend(user.uid) &&
      !isBlock(user.uid)
  );

  return (
    <div className="mx-auto p-4 w-full">
      <ul className="space-y-4">
        <Toaster position="bottom-center" reverseOrder={false} />
        {filteredUsers.map((user) => (
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
