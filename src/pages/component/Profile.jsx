import { AiFillHeart } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import useFirebaseData from "./useFirebaseData";
import { useLocation, useNavigate } from "react-router";
import moment from "moment";
import { getAuth } from "firebase/auth";
import { getDatabase, push, ref, remove, set } from "firebase/database";
import date from "./date";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const Profile = () => {
  const auth = getAuth();
  const db = getDatabase();
  const nowTime = date();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {};
  const allUsers = useFirebaseData("userslist/");
  const allFeeds = useFirebaseData("feeds/");
  const allFriends = useFirebaseData("friendsList/");
  const allRequest = useFirebaseData("friendRequest/");
  const friendList = useFirebaseData("friendsList/");
  const [isOpen, setIsOpen] = useState(false);

  const getUser = (uid) => allUsers.find((user) => user?.uid === uid);
  const getFriends = () =>
    allFriends.filter((user) => user?.uid.includes(userData));
  const getPost = () => allFeeds.filter((user) => user?.postBy === userData);
  const timeline = getPost();
  const myFriends = getFriends();
  const currentUser = getUser(userData);
  const generateKey = (uid1, uid2) => {
    return uid1 < uid2 ? uid1 + uid2 : uid2 + uid1;
  };
  const isFriend = (userId) => {
    return allFriends.some(
      (friend) =>
        (friend.sender === auth.currentUser.uid &&
          friend.receiver === userId) ||
        (friend.receiver === auth.currentUser.uid && friend.sender === userId)
    );
  };

  const friend = isFriend(userData);

  const handleAddFriend = (user) => {
    const key = generateKey(auth.currentUser?.uid, user.uid);
    const requstData = {
      uid: key,
      sender: auth.currentUser.uid,
      senderName: auth.currentUser.displayName,
      receiver: user.uid,
      receiverName: user.name,
      date: nowTime,
    };
    const requestExists = allRequest?.some((item) => item.uid === key);
    if (!requestExists) {
      set(ref(db, `friendRequest/${key}`), requstData)
        .then(() => {
          console.log("request add to db");
          const notifiData = {
            id: user.uid,
            notifi: auth.currentUser.displayName,
            type: "SentRequest",
            date: nowTime,
            read: "unread",
          };
          set(push(ref(db, `notification/`)), notifiData)
            .then(() => {
              console.log("send to notifi");
              toast.success("Request Send ");
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Request already sent!");
    }
  };

  const getRequestStatus = (userId) => {
    const req = allRequest?.find(
      (req) =>
        (req.sender === auth.currentUser.uid && req.receiver === userId) ||
        (req.receiver === auth.currentUser.uid && req.sender === userId)
    );

    if (req) {
      if (req.sender === auth.currentUser.uid) return "sent";
      if (req.receiver === auth.currentUser.uid) return "received";
    }
    return null;
  };
  const requested = getRequestStatus(currentUser?.uid);

  const handleCancelRequest = (user) => {
    const key = generateKey(auth.currentUser.uid, user.uid);
    remove(ref(db, "friendRequest/" + key)).then(() => {
      toast("Request cancelled", { icon: "❌" });
    });
  };
  const handleUnfriendConfirm = () => {
    setIsOpen(true);
  };
  const handleUnfriend = (user) => {
    setIsOpen(true);
    const friend = friendList.find(
      (f) =>
        (f.sender === auth.currentUser.uid && f.receiver === user.uid) ||
        (f.receiver === auth.currentUser.uid && f.sender === user.uid)
    );
    if (friend?.uid) {
      remove(ref(db, "friendsList/" + friend.uid))
        .then(() => toast.success("Unfriend successfully"))
        .catch((err) => console.log(err));
    }
  };

  const handleEdit = () => {
    navigate("/setting");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Profile Header */}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white flex items-center justify-center p-5 lg:p-5 rounded-b-full shadow-md border-b-4 border-cyan-300">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <img
            src={currentUser?.img}
            alt="Avatar"
            className="w-22 h-22 md:w-30 md:h-30 rounded-full object-cover ring-4 ring-cyan-300"
          />

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-700">
              {currentUser?.name}
            </h2>
            <p className="text-gray-500 mb-2">{currentUser?.email}</p>
            <div className="flex gap-2 justify-center p-2 md:justify-start  mx-auto md:p-1">
              {!friend && auth.currentUser?.uid !== currentUser?.uid && (
                <div className="">
                  {requested === "sent" && (
                    <button
                      onClick={() => handleCancelRequest(currentUser)}
                      className="text-sm px-5 border  rounded-lg p-1"
                    >
                      {" "}
                      Requested{" "}
                    </button>
                  )}
                  {!requested && (
                    <button
                      onClick={() => handleAddFriend(currentUser)}
                      className="text-sm px-5 border  rounded-lg p-1"
                    >
                      {" "}
                      Add{" "}
                    </button>
                  )}
                </div>
              )}
              {friend && (
                <div className="relative ">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="text-sm px-5 border  rounded-lg p-1"
                  >
                    {" "}
                    Friends{" "}
                  </button>

                  {isOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
                      <div className="w-[90%] sm:w-[400px] border p-4 text-sm lg:text-lg rounded-2xl shadow-2xl bg-white/90">
                        <h2 className="text-center font-semibold mb-4">
                          Are you sure you want to unfriend?
                        </h2>
                        <div className="flex justify-between gap-2">
                          <button
                            onClick={() => handleUnfriend(currentUser)}
                            className="w-1/2 p-2 rounded-lg hover:bg-red-100 hover:scale-105 transition"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="w-1/2 p-2 rounded-lg hover:bg-gray-100 hover:scale-105 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {auth.currentUser?.uid === currentUser?.uid && (
                <div className="">
                  <button
                    onClick={handleEdit}
                    className="text-sm px-5 border  rounded-lg p-1"
                  >
                    {" "}
                    Edit{" "}
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-center md:justify-start gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700">
                  {timeline?.length || 0}
                </h3>
                <p className="text-cyan-500">Posts</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-700">
                  {myFriends?.length}
                </h3>
                <p className="text-cyan-500">Friends</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-white w-xl mx-auto mt-2 border rounded-xl shadow-lg p-6 transition hover:shadow-xl  ">
      
      </div> */}
      {}
      {/* Posts */}
      <div className="px-6 max-w-3xl mx-auto space-y-5 h-[60vh] lg:h-[70vh] overflow-auto mt-2 lg:mt-5">
        {timeline.reverse().map((p) => {
          const user = getUser(p.postBy);

          return (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-lg p-6 transition hover:shadow-xl"
            >
              {/* Post Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.img}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-200"
                />
                <div>
                  <h4 className="font-semibold text-gray-700">{user.name}</h4>
                  <p className="text-xs text-gray-400">
                    {moment(p.time, "YYYYMMDD").fromNow()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="text-gray-700 mb-4 leading-relaxed">{p.post}</div>

              {/* Post Actions */}
              <div className="flex justify-around text-gray-500 text-sm border-t pt-3">
                <button className="flex items-center gap-1 hover:text-red-500 transition">
                  <AiFillHeart className="text-lg" />
                  Like
                </button>
                <button className="flex items-center gap-1 hover:text-cyan-500 transition">
                  💬 Comment
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500 transition">
                  <FaShare className="text-sm" />
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
