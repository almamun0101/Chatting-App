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
        <div className="bg-white shadow-2xl px-5 w-full my-4 rounded-xl mr-3 p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
