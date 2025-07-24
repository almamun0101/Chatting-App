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
        <div className="md:pl-22 lg:pl-54  w-full h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
