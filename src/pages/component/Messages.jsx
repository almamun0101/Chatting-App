import React, { useEffect, useState } from "react";
import useFirebaseData from "./useFirebaseData";
import { getDatabase, onValue, ref } from "firebase/database";
import { getAuth } from "firebase/auth";

const Messages = () => {
  const db = getDatabase();
  const auth = getAuth();
  // const [friends , setFriends ] = useState([]);
  const friendList = useFirebaseData("friendsList/");
  const userList = useFirebaseData("userslist/");
  const messagesData = useFirebaseData("messages/");
  const [selectedFriend, setSelectedFriend] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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

  const handleSendMessage = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    const blockData = {
      uid: key,
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiver: user.uid,
      receiverName: user.name,
      messages: newMessage,
    };

    set(ref(db, `messages/${key}`), blockData)
      .then(() => {
        remove(ref(db, "friendsList/" + key));
        toast.success("Block successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    setNewMessage("");
  };

  return (
    <div className="flex h-full w-full">
      <div className="w-35 border-r border-gray-300 py-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <ul>
          {friends?.map((friend) => (
            <li
              key={friend.uid}
              className={`rounded-l-2xl p-2 text-base cursor-pointer hover:bg-gray-100 ${
                selectedFriend.uid === friend.uid
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => setSelectedFriend(friend)}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-300 p-4">
          <h2 className="text-lg font-semibold">{selectedFriend.name}</h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
          {messages[selectedFriend.uid]?.map((msg, uid) => (
            <div
              key={uid}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded max-w-xs break-words ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 p-4 flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={()=>handleSendMessage(friend)}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
