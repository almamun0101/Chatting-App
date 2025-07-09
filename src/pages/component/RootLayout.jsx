import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import Home from "../Home";

const RootLayout = () => {
  return (
    <div className="">
      <div className="flex">
        <div className="">
          <Sidebar />
        </div>
        <div className="bg-white  m-2 shadow-2xl w-full my-4 rounded-xl mr-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
