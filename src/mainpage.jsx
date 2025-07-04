import React from "react";
import Home from "./Pages/Home";
import Sidebar from "./sideBar";
import { Outlet } from "react-router-dom";

export default function Mainpage() {
  return (
    <div className="main-container">
      <div className="home-content">
        <Home />
      </div>
      <aside className="sidebar-wrapper">
        <Sidebar />
      </aside>
      
    </div>
  );
}
