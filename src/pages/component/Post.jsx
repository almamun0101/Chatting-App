import { getAuth } from "firebase/auth";
import {
  get,
  getDatabase,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import React, { useState } from "react";
import date from "./date";
import useFirebaseData from "./useFirebaseData";
import UserList from "./Userlist";
import { h2, img } from "framer-motion/client";
import moment from "moment";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { AiFillHeart } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
const Post = () => {
  const [input, setInput] = useState("");
  const [inputComment, setInputComment] = useState("");
  const auth = getAuth();
  const db = getDatabase();
  const nowTime = date();
  const allFeeds = useFirebaseData("feeds/");
  const allUser = useFirebaseData("userslist/");
  const [activeComent, setActiveComent] = useState(null);

  const userId = auth?.currentUser?.uid;

  const handlePost = () => {
    const newPostRef = push(ref(db, "feeds"));
    const postData = {
      post: input,
      postBy: auth.currentUser?.uid,
      name: auth.currentUser?.displayName || "Anonymous",
      time: nowTime,
      like: "0",
      comment: "",
      id: newPostRef.key,
    };
    set(newPostRef, postData)
      .then(() => setInput(""))
      .catch((err) => console.log(err));
  };

  const getPoster = (postByUid) => {
    return allUser.find((n) => n && n.uid === postByUid);
  };

  const handleLike = (feed) => {
    const postRef = ref(db, `feeds/${feed?.uid}`);
    const hasLiked = feed?.like.includes(userId);
    if (!hasLiked) {
      update(postRef, {
        like: [...feed.like, userId],
      }).catch((err) => console.log(err));
    } else {
      const updateLiked = feed.like.filter((u) => u !== userId);
      update(postRef, {
        like: updateLiked,
      }).catch((err) => console.log(err));
    }
  };

  const handleComent = (feed) => {
    setActiveComent((prev) => (prev === feed.id ? null : feed.id));
  };

  const handleAddComent = (feed) => {
    const postRef = ref(db, `feeds/${feed.id}`);
    const commentInfo = {
      text: inputComment,
      commentBy: auth.currentUser.uid,
      time: nowTime,
    };
    const updateComment = feed.comment
      ? [...feed.comment, commentInfo]
      : [commentInfo]; // make sure it's an array
    update(postRef, {
      comment: updateComment,
    })
      .then(() => setInputComment(""))
      .catch((err) => console.log(err));
    // console.log(inputComment);
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
              .map((feed, index) => {
                const user = getPoster(feed.postBy);

                return (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-3">
                      {/* Avatar */}

                      {user?.img ? (
                        <div className="">
                          <img
                            src={user?.img}
                            alt={user?.name}
                            className="w-10 h-10 rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                          {feed.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <h4 className="text-md font-semibold text-gray-800">
                          {/* {p(feed.postBy) } */}
                          {user?.name}
                        </h4>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          {moment(feed.time, "YYYYMMDD, h:mm").fromNow()}
                        </span>
                      </div>
                    </div>

                    {/* Post Body */}
                    <p className="text-gray-800 mb-4 leading-relaxed">
                      {feed.post}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-6 text-sm font-medium text-gray-500">
                      <button
                        onClick={() => handleLike(feed)}
                        className="hover:text-emerald-500 transition flex items-center gap-1"
                      >
                        {feed.like?.includes(userId) ? (
                          <AiFillHeart size={20} color="red" />
                        ) : (
                          <AiFillHeart size={20} color="" />
                        )}
                        {feed.like?.length - 1}
                        {/* {liked && <FcLikePlaceholder className="font-blue-500" />} */}
                      </button>
                      <div className="flex items-center gap-2 ">
                        <button
                          onClick={() => handleComent(feed)}
                          className="hover:text-emerald-500 transition flex items-center gap-1"
                        >
                          {feed.comment.length} Comment
                        </button>
                      </div>
                      <button className="hover:text-pink-500 transition flex items-center gap-1">
                        <FaShare />
                      </button>
                    </div>
                    {activeComent === feed.id && (
                      <div className=" py-2  my-2 gap-10 flex justify-between items-center">
                        <input
                          value={inputComment}
                          onChange={(e) => setInputComment(e.target.value)}
                          placeholder="Write Your coment"
                          type="text"
                          className="text-sm p-1 not-last:w-full rounded-lg border "
                        />
                        <button
                          onClick={() => handleAddComent(feed)}
                          className="border px-4 py-1 bg-blue-400 text-white rounded-3xl"
                        >
                          {" "}
                          Done
                        </button>
                      </div>
                    )}
                    {feed.comment && feed.comment.length > 0 ? (
                      <div className="px-4 pt-3 space-y-2">
                        {feed.comment.map((c, i) => {
                          const commentUser = getPoster(c.commentBy);
                          return (
                            <div
                              className="flex gap-2 items-start text-sm"
                              key={i}
                            >
                              <img
                                src={commentUser?.img || "/default-user.png"}
                                alt={commentUser?.name || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="bg-gray-100 p-2 rounded-md w-full">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-[13px] text-gray-800">
                                    {commentUser?.name || "Unknown"}
                                  </span>
                                  <span className="text-[11px] text-gray-500">
                                    {c.time
                                      ? moment(c.time, "YYYYMMDD, h:mm").fromNow()
                                      : ""}
                                  </span>
                                </div>
                                <p className="text-[13px] text-gray-700">
                                  {c.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="px-4 pt-3 text-gray-400 text-sm italic">
                        No comments yet.
                      </p>
                    )}
                  </div>
                );
              })
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
