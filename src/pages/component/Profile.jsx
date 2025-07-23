import { AiFillHeart } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import useFirebaseData from "./useFirebaseData";
import { useLocation } from "react-router";
import moment from "moment";

const Profile = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const allUsers = useFirebaseData("userslist/");
  const allFeeds = useFirebaseData("feeds/");
  const allFriends = useFirebaseData("friendsList/");
  const getUser = (uid) => allUsers.find((user) => user?.uid === uid);
  const getFriends = () =>
    allFriends.filter((user) => user?.uid.includes(userData));
  const getPost = () => allFeeds.filter((user) => user?.postBy === userData);
  const timeline = getPost();
  const myFriends = getFriends();
  const currentUser = getUser(userData);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Profile Header */}
      <div className="bg-white flex items-center justify-center p-5 lg:p-5 rounded-b-full shadow-md border-b-4 border-cyan-300">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={currentUser?.img}
            alt="Avatar"
            className="w-22 h-22 rounded-full object-cover ring-4 ring-cyan-300"
          />

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-700">
              {currentUser?.name}
            </h2>
            <p className="text-gray-500 mb-2">{currentUser?.email}</p>
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

      {/* Posts */}
      <div className="px-6 py-10 max-w-3xl mx-auto space-y-8 h-[50vh] overflow-auto mt-4 lg:mt-10">
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
