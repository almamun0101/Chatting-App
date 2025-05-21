import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home";
import RootLayout from "./pages/component/RootLayout";
import NotFound from "./pages/NotFound";
import AddFriend from "./pages/component/AddFriend";
import Messages from "./pages/component/Messages";
import Notifications from "./pages/component/Notifications";
import FriendsList from "./pages/component/FriendsList";
import Setting from "./pages/component/Setting";
import SignUp from "./pages/SignUp";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [{ index: true, Component: Home }],
    },
    {
      path: "/addfriend",
      element: <AddFriend />,
    },
    {
      path: "/messages",
      element: <Messages />,
    },
    {
      path: "/notification",
      element: <Notifications />,
    },
    {
      path: "/friendlist",
      element: <FriendsList />,
    },
    {
      path: "/setting",
      element: <Setting />,
    },
    {
      path: "/setting",
      element: <Setting />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div>
      {/* <RouterProvider router={router} /> */}

      <SignUp/>
    </div>
  );
};

export default App;
