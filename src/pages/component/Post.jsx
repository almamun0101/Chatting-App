import { getAuth } from "firebase/auth";
import { getDatabase, push, ref, update, set } from "firebase/database";
import React, { useState } from "react";
import date from "./date";
import useFirebaseData from "./useFirebaseData";
import UserList from "./Userlist";
import moment from "moment";
import { AiFillHeart } from "react-icons/ai";
import { FaShare } from "react-icons/fa";

const Post = () => {
  const [postInput, setPostInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);

  const auth = getAuth();
  const db = getDatabase();
  const nowTime = date();

  const allFeeds = useFirebaseData("feeds/");
  const allUsers = useFirebaseData("userslist/");

  const userId = auth?.currentUser?.uid;

  const getPoster = (uid) => allUsers.find((user) => user?.uid === uid);

  const handlePost = () => {
    if (!postInput.trim()) return;

    const newPostRef = push(ref(db, "feeds"));
    const postData = {
      post: postInput.trim(),
      postBy: userId,
      name: auth.currentUser?.displayName || "Anonymous",
      time: nowTime,
      like: [],
      comment: [],
      id: newPostRef.key,
    };

    set(newPostRef, postData)
      .then(() => setPostInput(""))
      .catch(console.error);
  };

  const handleLike = (feed) => {
    const postRef = ref(db, `feeds/${feed?.id}`);
    const hasLiked = feed?.like?.includes(userId);
    const updatedLikes = hasLiked
      ? feed.like.filter((uid) => uid !== userId)
      : [...(feed.like || []), userId];

    update(postRef, { like: updatedLikes }).catch(console.error);
  };

  const toggleCommentBox = (feedId) => {
    setActiveCommentId((prevId) => (prevId === feedId ? null : feedId));
  };

  const handleAddComment = (feed) => {
    if (!commentInput.trim()) return;

    const postRef = ref(db, `feeds/${feed.id}`);
    const comment = {
      text: commentInput.trim(),
      commentBy: userId,
      time: nowTime,
    };

    const updatedComments = Array.isArray(feed.comment)
      ? [...feed.comment, comment]
      : [comment];

    update(postRef, { comment: updatedComments })
      .then(() => setCommentInput(""))
      .catch(console.error);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0] flex flex-col lg:flex-row px-4 pt-3 gap-6">
      {/* Main Feed Section */}
      <div className="lg:w-2/3 w-full space-y-4">
        {/* Create Post */}
        <div className="flex  lg:flex-row items-center gap-3 bg-gradient-to-br from-[#e0f2fe] via-[#f0f0ff] to-[#fef2f2] rounded-2xl shadow-md p-2 lg:p-5">
          <textarea
            value={postInput}
            onChange={(e) => setPostInput(e.target.value)}
            placeholder="What's on your mind?"
            rows={2}
            className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white bg-opacity-80"
          />
          <div className="text-right">
            <button
              onClick={handlePost}
              disabled={!postInput.trim()}
              className={`bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium transition ${
                !postInput.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-indigo-600 hover:to-purple-600"
              }`}
            >
              Post
            </button>
          </div>
        </div>

        {/* Feed List */}
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
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    {/* Post Header */}
                    <div className="flex items-center gap-4 mb-3">
                      {user?.img ? (
                        <img
                          src={user.img}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                          {feed.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-md">
                          {user?.name || "Unknown"}
                        </h4>
                        <span className="text-sm text-gray-400">
                          {moment(feed.time, "YYYYMMDD, h:mm").fromNow()}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-4">{feed.post}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-6 text-sm font-medium text-gray-600 mb-3">
                      <button
                        onClick={() => handleLike(feed)}
                        className="flex items-center gap-1 hover:text-rose-500"
                      >
                        <AiFillHeart
                          size={20}
                          color={feed.like?.includes(userId) ? "red" : ""}
                        />
                        {feed.like?.length || 0}
                      </button>
                      <button
                        onClick={() => toggleCommentBox(feed.id)}
                        className="hover:text-blue-500 flex items-center gap-1"
                      >
                        💬 {feed.comment?.length || 0} Comment
                      </button>
                      <button className="hover:text-green-500 flex items-center gap-1">
                        <FaShare />
                        Share
                      </button>
                    </div>

                    {/* Comment Input Box */}
                    {activeCommentId === feed.id && (
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          type="text"
                          placeholder="Write a comment..."
                          className="flex-1 p-2 text-sm border rounded-md"
                        />
                        <button
                          onClick={() => handleAddComment(feed)}
                          className="px-4 py-1 bg-blue-500 text-white rounded-full"
                        >
                          Done
                        </button>
                      </div>
                    )}

                    {/* Comment List */}
                    {feed.comment?.length > 0 ? (
                      <div className="space-y-2">
                        {feed.comment.map((c, i) => {
                          const commentUser = getPoster(c.commentBy);
                          return (
                            <div key={i} className="flex gap-2 text-sm">
                              <img
                                src={commentUser?.img || "/default-user.png"}
                                alt={commentUser?.name || "User"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="bg-gray-100 px-3 py-2 rounded-lg w-full">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium text-gray-800 text-[13px]">
                                    {commentUser?.name || "Unknown"}
                                  </span>
                                  <span className="text-gray-400 text-[11px]">
                                    {moment(c.time, "YYYYMMDD, h:mm").fromNow()}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-[13px]">
                                  {c.text}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
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
