import { useSelector } from "react-redux";
import Userlist from "./component/Userlist";
import Post from "./component/Post";

const Home = () => {
  const data = useSelector((state) => state.userLogin.value);

  return (
    <div>
      <div className="">
        {/* Main content */}
        <div className="">
           <div className="flex items-center ">
            {/* <Userlist /> */}
            <Post/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
