import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";

const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        // {
        //   path: "login",
        //   element: <Login />,
        // },
        // {
        //   path: "email-verify",
        //   element: <EmailVerify />,
        // },
        // {
        //   path: "reset-password",
        //   element: <ResetPassword />,
        // },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
