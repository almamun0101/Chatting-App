import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch } from "react-icons/fi";

export default function MessagingUI() {
  const friends = useSelector((state) => state?.friends?.list || []);
  const messages = useSelector((state) => state?.messages?.conversation || []);
  const [inputText, setInputText] = useState("");
  const [activeFriend, setActiveFriend] = useState(null);
  const dispatch = useDispatch();

  const handleSend = () => {
    if (!inputText.trim() || !activeFriend) return;
    dispatch({
      type: "messages/sendMessage",
      payload: { text: inputText, sender: "me", to: activeFriend.id },
    });
    setInputText("");
  };

  return (
    <div className="flex h-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      {/* Sidebar always visible */}
      <div className=" md:flex flex-col w-1/4 bg-white/70 backdrop-blur-md p-4 border-r border-gray-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-gray-700">Friends</h2>
          <button className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition">
            <FiSearch className="text-purple-600 w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search friends..."
          className="mb-4 p-2 w-30 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
          disabled
        />
        <ul className="space-y-3 overflow-y-auto flex-1">
          {friends.length === 0 ? (
            <p className="text-gray-500">No friends available</p>
          ) : (
            friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => setActiveFriend(friend)}
                className={`flex items-center p-2 bg-white/80 rounded-xl shadow hover:scale-105 hover:shadow-lg transition-all cursor-pointer ${activeFriend?.id === friend.id ? "ring-2 ring-purple-400" : ""}`}
              >
                <img
                  src={friend.avatar || "https://via.placeholder.com/40"}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full mr-2 border border-gray-300"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-800 font-medium truncate">{friend.name}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 relative">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-700 mb-4 md:mb-6">
          {activeFriend ? `Chat with ${activeFriend.name}` : "Select a friend to chat"}
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-0 md:pr-2">
          {activeFriend && messages.length > 0 ? (
            messages
              .filter(
                (msg) =>
                  (msg.to === activeFriend.id || msg.from === activeFriend.id)
              )
              .map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 md:px-5 md:py-3 rounded-2xl max-w-xs md:max-w-sm shadow-md transition-all duration-300 ${
                      msg.sender === "me"
                        ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500">No messages yet</p>
          )}
        </div>

        {/* Input area */}
        <div className="flex mt-4 bg-white/70 backdrop-blur-md rounded-full shadow-inner p-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
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
