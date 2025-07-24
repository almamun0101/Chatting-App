import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import useFirebaseData from "./useFirebaseData";
import { getAuth } from "firebase/auth";
import { chattingInfo } from "../../slices/chatSlice";
import { getDatabase, push, ref } from "firebase/database";
import date from "./date";
import moment from "moment";

export default function MessagingUI() {
  const auth = getAuth();
  const db = getDatabase();
  const friendList = useFirebaseData("friendsList/") || [];
  const messages = useFirebaseData("messages/") || [];
  const userList = useFirebaseData("userslist/") || [];
  const [inputText, setInputText] = useState("");
  const [activeFriend, setActiveFriend] = useState(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const NowTime = date();
  const reduxUser = useSelector((s) => s.chatInfo.value);

  const generateKey = (uid1, uid2) => (uid1 < uid2 ? uid1 + uid2 : uid2 + uid1);

  const friends = userList.filter((user) =>
    friendList.some(
      (f) =>
        (f.sender === auth.currentUser?.uid && f.receiver === user.uid) ||
        (f.receiver === auth.currentUser?.uid && f.sender === user.uid)
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
      date: NowTime,
    };

    push(ref(db, "messages/"), messageData)
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

  useEffect(() => {
    if (reduxUser && userList.length > 0) {
      const fullUser = userList.find((user) => user.uid === reduxUser.uid);
      if (fullUser && (!activeFriend || activeFriend.uid !== fullUser.uid)) {
        handleActive(fullUser);
      }
    }
  }, [reduxUser, userList]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeFriend]);

  return (
    // Inside return()
    <div className="rounded-2xl flex flex-col lg:flex-row h-full overflow-hidden bg-gradient-to-br from-teal-100 via-cyan-100 to-white shadow-lg">
      {/* Sidebar */}
      <div className="lg:w-2/7  bg-white bg-opacity-90 py-5 border-r border-cyan-200 shadow-inner overflow-y-auto max-h-60vh lg:max-h-full">
        <div className="flex px-5 items-center justify-between mb-5">
          <h2 className="text-xl lg:text-2xl font-semibold text-teal-800 tracking-wide">
            Friends
          </h2>
          <button
            aria-label="Search friends"
            className="p-2 rounded-full hover:bg-cyan-100 transition-colors"
          >
            <FiSearch className="text-teal-700 w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
        <ul className="space-y-4 px-3 flex lg:flex-col gap-2 ">
          {friends.length === 0 ? (
            <li>
              <p className="text-gray-500 italic text-center">
                No friends found
              </p>
            </li>
          ) : (
            friends.map((friend) => (
              <li
                key={friend.uid}
                onClick={() => handleActive(friend)}
                className={`flex h-20 items-center gap-4 cursor-pointer py-2 px-3 rounded-xl transition-colors 
          ${
            activeFriend?.uid === friend.uid
              ? "bg-cyan-100 shadow-md ring-2 ring-teal-200"
              : "hover:bg-cyan-50"
          }`}
              >
                <div className="flex flex-col lg:flex-row lg:gap-3 items-center">
                  
                    <img
                      src={friend.img || "https://via.placeholder.com/40"}
                      alt={friend.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-300 object-cover"
                    />

              
                 
                      <p className="text-teal-900 font-medium text-sm sm:text-base truncate">
                        {friend.name}
                      </p>
                    
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 bg-white bg-opacity-90 pb-5">
        <h2 className="text-lg lg:text-2xl font-semibold text-teal-900 p-3 select-none truncate">
          {friends.length && activeFriend
            ? activeFriend.name
            : "Select a friend to start chatting"}
        </h2>

        <div className="flex-1 rounded-2xl bg-cyan-100 overflow-y-auto pl-2 pt-5 pr-4 space-y-2 max-h-[60vh] lg:max-h-full">
          {friends.length > 0 && activeFriend ? (
            messages
              .filter(
                (msg) =>
                  (msg.receiver === activeFriend.uid &&
                    msg.sender === auth.currentUser.uid) ||
                  (msg.sender === activeFriend.uid &&
                    msg.receiver === auth.currentUser.uid)
              )
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === auth.currentUser.uid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-5 py-2 rounded-3xl max-w-[80%] md:max-w-lg shadow ${
                      msg.sender === auth.currentUser.uid
                        ? "bg-gradient-to-tr from-teal-600 to-cyan-600 text-white text-right"
                        : "bg-white text-gray-900 text-left"
                    }`}
                    style={{ wordBreak: "break-word" }}
                  >
                    <p className="text-sm md:text-base font-medium">
                      {msg.messages}
                    </p>
                    <p className="text-[10px] pt-1 opacity-50">
                      {moment(msg.date, "YYYYMMDD,h:mm").fromNow()}
                    </p>
                    {console.log(messages?.length ? messages.length : 0)}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 italic pl-3">No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex mt-2 bg-white rounded-full border border-cyan-300 shadow-sm p-2 mx-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent focus:outline-none px-4 text-teal-900 placeholder-teal-400 text-sm md:text-base"
            placeholder="Type your message..."
            disabled={!activeFriend}
          />
          <button
            onClick={handleSend}
            disabled={!activeFriend}
            className="ml-2 md:ml-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 hover:from-teal-700 hover:to-cyan-700 text-white px-4 md:px-6 py-2 rounded-full font-semibold transition disabled:opacity-50 text-sm md:text-base"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
