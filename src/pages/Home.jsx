import React from "react";
import SignUp from "./SignUp";
import Sidebar from "./component/Sidebar";

const Home = () => {
  return (
    <div>
      <div className="">
        {/* Main content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to ChatApp</h1>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <p>Select an option from the sidebar to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
