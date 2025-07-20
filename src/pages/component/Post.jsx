import { getAuth } from "firebase/auth";
import { getDatabase, push, ref, set } from "firebase/database";
import React, { useState } from "react";
import date from "./date";
import useFirebaseData from "./useFirebaseData";
import UserList from "./Userlist";

const Post = () => {
  const [input, setInput] = useState("");
  const auth = getAuth();
  const db = getDatabase();
  const nowTime = date();
  const allFeeds = useFirebaseData("feeds/");

  const handlePost = () => {
    const postData = {
      post: input,
      postBy: auth.currentUser?.uid,
      name: auth.currentUser?.displayName || "Anonymous",
      time: nowTime,
    };
    set(push(ref(db, `feeds/`)), postData)
      .then(() => setInput(""))
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex flex-col lg:flex-row px-4 pt-3 gap-6">
      {/* Main Feed Section */}
      <div className="lg:w-2/3 w-full space-y-4">
        {/* Create Post */}
        <div className="flex items-center justify-between gap-2 bg-gradient-to-br from-[#e0f2fe] via-[#f0f0ff] to-[#fef2f2] rounded-2xl shadow-md p-4">
          <h2 className="w-30 text-sm lg:text-xl font-semibold text-gray-800 ">
            Create a Post
          </h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full h-20 border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white bg-opacity-80"
          />
          <div className="text-right">
            <button
              onClick={handlePost}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium hover:from-indigo-600 hover:to-purple-600 transition"
            >
              Post
            </button>
          </div>
        </div>

        {/* Post Feed */}
        <div className="space-y-4 max-h-[78vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300">
          {allFeeds.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">No posts yet</p>
          ) : (
            allFeeds
              .slice()
              .reverse()
              .map((feed, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                      {feed.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-800">
                        {feed.name || "Unknown User"}
                      </h4>
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        🕒 {feed.time}
                      </span>
                    </div>
                  </div>

                  {/* Post Body */}
                  <p className="text-gray-800 mb-4 leading-relaxed">{feed.post}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <button className="hover:text-indigo-500 transition flex items-center gap-1">
                      👍 Like
                    </button>
                    <button className="hover:text-emerald-500 transition flex items-center gap-1">
                      💬 Comment
                    </button>
                    <button className="hover:text-pink-500 transition flex items-center gap-1">
                      🔁 Share
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-1/3 w-full hidden lg:block">
        <div className="sticky top-4 bg-white rounded-2xl shadow-md p-6 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Suggested Friends
          </h3>
          <div className="space-y-3">
            <UserList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
