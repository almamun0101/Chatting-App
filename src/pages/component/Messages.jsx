import React, { useState } from "react";

const friends = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const initialMessages = {
  1: [
    { text: "Hi Alice!", sender: "me" },
    { text: "Hello!", sender: "friend" },
  ],
  2: [
    { text: "Hey Bob!", sender: "me" },
    { text: "Yo!", sender: "friend" },
  ],
  3: [
    { text: "Hello Charlie!", sender: "me" },
    { text: "Hi!", sender: "friend" },
  ],
};

const Messages = () => {
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [...prev[selectedFriend.id], { text: newMessage, sender: "me" }],
    }));
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedFriend.id === friend.id ? "bg-gray-200 font-semibold" : ""
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
          {messages[selectedFriend.id]?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded max-w-xs break-words ${
                  msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
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
            onClick={handleSendMessage}
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
