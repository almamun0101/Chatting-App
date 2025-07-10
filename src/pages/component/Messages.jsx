import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";
import useFirebaseData from "./useFirebaseData";
import { getAuth } from "firebase/auth";
import { chattingInfo } from "../../slices/chatSlice";
import { getDatabase, push, ref, set } from "firebase/database";

export default function MessagingUI() {
  const auth = getAuth();
  const db = getDatabase();
  const friendList = useFirebaseData("friendsList/") || [];
  const messages = useFirebaseData("messages/") || [];
  const userList = useFirebaseData("userslist/") || [];
  const [inputText, setInputText] = useState("");
  const [activeFriend, setActiveFriend] = useState(null);
  const dispatch = useDispatch();

  const generateKey = (uid1, uid2) => (uid1 < uid2 ? uid1 + uid2 : uid2 + uid1);

  const friends = userList.filter(user =>
    friendList.some(f =>
      (f.sender === auth.currentUser.uid && f.receiver === user.uid) ||
      (f.receiver === auth.currentUser.uid && f.sender === user.uid)
    )
  );

  const handleSend = () => {
    if (!inputText.trim() || !activeFriend) return;

    const key = generateKey(auth.currentUser.uid, activeFriend.uid);
    const messageData = {
      uid: key,
      sender: auth.currentUser.uid,
      receiver: activeFriend.uid,
      messages: inputText,
    };

    set(push(ref(db, "messages/")), messageData)
      .then(() => console.log("Message sent"))
      .catch(console.error);

    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleActive = (friend) => {
    dispatch(chattingInfo(friend));
    setActiveFriend(friend);
  };

  return (
    <div className="p-4 rounded-2xl flex h-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="md:flex flex-col w-2/5 bg-white/70 backdrop-blur-md p-4 border-r border-gray-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-gray-700">Friends</h2>
          <button className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition">
            <FiSearch className="text-purple-600 w-5 h-5" />
          </button>
        </div>
        <ul className="space-y-3 overflow-y-auto flex-1 p-2">
          {friends.length === 0 ? (
            <p className="text-gray-500">No friends available</p>
          ) : (
            friends.map((friend) => (
              <li
                key={friend.uid}
                onClick={() => handleActive(friend)}
                className={`flex items-center p-2 bg-white/80 rounded-xl shadow hover:scale-105 transition-all cursor-pointer ${activeFriend?.uid === friend.uid ? "ring-2 ring-purple-400" : ""}`}
              >
                <img
                  src={friend.img || "https://via.placeholder.com/40"}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full mr-2 border border-gray-300"
                />
                <p className="text-gray-800 font-medium truncate flex-1">{friend.name}</p>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 relative">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-700 mb-4 md:mb-6">
          {activeFriend ? activeFriend.name : "Select a friend to chat"}
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-0 md:pr-2">
          {activeFriend ? (
            messages
              .filter(
                (msg) =>
                  (msg.receiver === activeFriend.uid && msg.sender === auth.currentUser.uid) ||
                  (msg.sender === activeFriend.uid && msg.receiver === auth.currentUser.uid)
              )
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === auth.currentUser.uid ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl max-w-xs md:max-w-sm shadow-md transition-all duration-300 ${msg.sender === auth.currentUser.uid ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white" : "bg-white text-gray-800 border border-gray-200"}`}
                  >
                    {msg.messages}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500">No messages yet</p>
          )}
        </div>

        <div className="flex mt-4 bg-white/70 backdrop-blur-md rounded-full shadow-inner p-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent focus:outline-none px-3 md:px-4 text-gray-700"
            placeholder="Type a message..."
            disabled={!activeFriend}
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2 rounded-full shadow hover:scale-105 transition-all"
            disabled={!activeFriend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
