import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "./pages/Home";
import RootLayout from "./pages/component/RootLayout";
import NotFound from "./pages/NotFound";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: RootLayout,
      children: [
        { index: true, Component: Home },
        
      ],
    },
    {
      path:"*",
      element: <NotFound/> ,
    }
  ]);

  return (
    <div>
      <RouterProvider router={router}/>
       </div>
  );
};

export default App;
