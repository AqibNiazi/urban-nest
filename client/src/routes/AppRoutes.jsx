import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import {
  Home,
  About,
  SignIn,
  SignUp,
  Profile,
  CreateListing,
  UpdateListing,
  Listing,
} from "@/pages";
import { PrivateRoute } from "@/components";

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
        {
          path: "about",
          element: <About />,
        },
        {
          path: "sign-in",
          element: <SignIn />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "listing/:listingId",
          element: <Listing />,
        },
        // Protected routes
        {
          element: <PrivateRoute />,
          children: [
            { path: "profile", element: <Profile /> },
            { path: "create-listing", element: <CreateListing /> },
            { path: "update-listing/:listingId", element: <UpdateListing /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
