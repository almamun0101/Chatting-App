import React, { useState } from "react";
import { MessageCircle, Rocket } from "lucide-react";

function Feeds({ post }) {
  const [echoed, setEchoed] = useState(false);

  const toggleEcho = () => setEchoed(!echoed);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 max-w-xl mx-auto shadow-md hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
            {post.username.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold">{post.username}</h4>
            <p className="text-xs text-gray-400">{post.time}</p>
          </div>
        </div>
        {echoed && (
          <span className="text-sm text-purple-600 animate-pulse font-medium">
            You vibed 💫
          </span>
        )}
      </div>

      {/* Text-only Post */}
      <div className="text-lg text-gray-800 leading-relaxed italic mb-6 whitespace-pre-wrap">
        “{post.text}”
      </div>

      {/* Action Row */}
      <div className="flex justify-between text-sm text-gray-500 border-t pt-4">
        <button
          onClick={toggleEcho}
          className={`font-medium px-3 py-1 rounded-full transition hover:bg-purple-100 ${
            echoed ? "text-purple-600 bg-purple-50" : ""
          }`}
        >
          💯 Echo
        </button>

        <button className="flex items-center gap-1 hover:text-gray-700">
          <MessageCircle size={16} />
          Reply
        </button>

        <button className="flex items-center gap-1 hover:text-gray-700">
          <Rocket size={16} />
          Boost
        </button>
      </div>
    </div>
  );
}

export default Feeds;
