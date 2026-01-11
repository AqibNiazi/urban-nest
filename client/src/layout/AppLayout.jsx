import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";
const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default AppLayout;
