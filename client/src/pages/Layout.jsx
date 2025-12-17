import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebaropen] = useState(false);

  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebaropen={setSidebaropen} />
      <div className="flex-1 bg-slate-50 overflow-hidden">
        <Outlet />
      </div>
      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-100  bg-white rounded-md shadow w-10 h-10 text-grey-600 sm:hidden"
          onClick={() => setSidebaropen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-100  bg-white rounded-md shadow w-10 h-10 text-grey-600 sm:hidden"
          onClick={() => setSidebaropen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
