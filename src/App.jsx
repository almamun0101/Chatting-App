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
import SignIn from "./pages/SingIn";
import SignUp from "./pages/SignUp";
import Logout from "./pages/Logout";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [{ index: true, Component: Home },
        {
          path:"/messages",
          element:<Messages/>

        },
        {
          path:"/friendlist",
          element:<FriendsList/>

        },
        {
          path:"/notifications",
          element:<Notifications/>

        },
        {
          path:"/addfriend",
          element:<AddFriend/>

        },
        {
          path:"/setting",
          element:<Setting/>

        },
        {
          path:"/logout",
          element:<Logout/>

        },
      ],
    },
    {
      path: "/signin",
      element: <SignIn />,
    },


    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
      {/* <SignUp/> */}
      {/* <SignIn/> */}
    </div>
  );
};

export default App;
