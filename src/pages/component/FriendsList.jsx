import React from "react";
import useFirebaseData from "./useFirebaseData";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, remove, set } from "firebase/database";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const FriendsList = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const friendList = useFirebaseData("friendsList/");
  const userList = useFirebaseData("userslist/");
  const blockList = useFirebaseData("blockList/");

  const generateKey = (uid1, uid2) => {
    return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
  };

  // Get current user's friends' UIDs
  const myFriendUids =
    friendList
      ?.map((f) =>
        f.sender === auth.currentUser.uid ? f.receiver : f.receiver === auth.currentUser.uid ? f.sender : null
      )
      .filter(Boolean) || [];

  // Get friend user objects
  const friends = userList?.filter((user) => myFriendUids.includes(user.uid)) || [];

  // Blocked users by me
  const myBlocks = blockList?.filter((b) => b.blockBy === auth.currentUser.uid) || [];
  const blockedUids = myBlocks.map((b) => b.blockUser);
  const blockedUsers = userList?.filter((user) => blockedUids.includes(user.uid)) || [];

  const handleUnfriend = (user) => {
    const friend = friendList.find(
      (f) =>
        (f.sender === auth.currentUser.uid && f.receiver === user.uid) ||
        (f.receiver === auth.currentUser.uid && f.sender === user.uid)
    );
    if (friend?.uid) {
      remove(ref(db, "friendsList/" + friend.uid))
        .then(() => toast.success("Unfriended successfully"))
        .catch((err) => console.log(err));
    }
  };

  const handleBlock = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    const blockData = {
      uid: key,
      blockBy: auth.currentUser.uid,
      blockByName: auth.currentUser.displayName,
      blockUser: user.uid,
      blockUserName: user.name,
    };

    set(ref(db, `blockList/${key}`), blockData)
      .then(() => {
        remove(ref(db, "friendsList/" + key));
        toast.success("Blocked successfully");
      })
      .catch((error) => console.log(error));
  };

  const handleUnblock = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    remove(ref(db, "blockList/" + key))
      .then(() => toast.success("Unblocked successfully"))
      .catch((err) => console.log(err));
  };

   const handleMessage = (message)=>{
    navigate("/messages")  
    const getUid = userList.find((user)=>user.uid === message.id )
    dispatch(chattingInfo(getUid));
    console.log(getUid)
  }
 

  return (
    <div className="h-full ">
      <div className="h-full grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Friend List */}
        <div className="bg-white  p-5 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Friends</h2>
          <div className="overflow-y-auto space-y-4 flex-1">
            {friends.length ? (
              friends.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center">
                    <img
                      src={user.img}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMessage(user)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => handleUnfriend(user)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Unfriend
                    </button>
                    <button
                      onClick={() => handleBlock(user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                    >
                      Block
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No friends found</p>
            )}
          </div>
        </div>

        {/* Block List */}
        <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col  h-full ">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Blocked Users</h2>
          <div className="overflow-y-auto space-y-4 flex-1">
            {blockedUsers.length ? (
              blockedUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center">
                    <img
                      src={user.img}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-400"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnblock(user)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                  >
                    Unblock
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No blocked users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
