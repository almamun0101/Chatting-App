import { useSelector } from "react-redux";
import Userlist from "./component/Userlist";

const Home = () => {
  const data = useSelector((state) => state.userLogin.value);

  return (
    <div>
      <div className="p-4">
        {/* Main content */}
        <div className="">
           <div className="flex items-center ">
            <Userlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
