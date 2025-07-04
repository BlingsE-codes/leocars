import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
const ParentWrapper = () => {
  return (
    <>
      <Navbar />
      <div className="app-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export default ParentWrapper;
