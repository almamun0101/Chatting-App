import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import Home from "../Home";

const RootLayout = () => {
  return (
    <div className="">
      <div className="flex">
        <div className=" border-gray-300 my-2">
          <Sidebar />
        </div>
        <div className=" border-gray-300 shadow-2xl border px-5 w-full my-4 rounded-tr-xl rounded-br-3xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
