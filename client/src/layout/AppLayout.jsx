import { Navbar } from "@/components";
import React from "react";
import { Outlet } from "react-router-dom";
const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
