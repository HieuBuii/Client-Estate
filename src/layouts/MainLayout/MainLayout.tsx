import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="container px-5 mx-auto overflow-hidden">
      <Navbar />
      <div className="h-[calc(100vh-100px)] mt-[100px]">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
