import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "/images/logo.png";
import DrawerMenu from "./components";
import { Dropdown } from "flowbite-react";
import { logoutApi } from "../../apis/auth.api";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import defaultAvatar from "/images/default-avatar.png";
import { useNotificationsStore } from "../../lib/zustand/notificationsStore";
import { SocketContext } from "../../context/SocketContext";
import { ChangePassword } from "../Modal/ChangePassword/ChangePassword";

const customTheme = {
  floating: {
    target:
      "hidden sm:block pb-2 bg-primary cursor-pointer border-0 relative rounded-full ml-2 md:mx-5 hover:!bg-primaryHover",
  },
};

function Navbar() {
  const { socket } = useContext(SocketContext);
  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const [openModalChangePass, setOpenModalChangePass] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const fetchNumberOfNewChat = useNotificationsStore(
    (state) => state.fetchNumberOfNewChat
  );
  const numbersOfNewChat = useNotificationsStore((state) => state.numbers);

  useEffect(() => {
    if (currentUser?.id) {
      fetchNumberOfNewChat();
    }
  }, [currentUser, fetchNumberOfNewChat]);

  const handleLogout = async () => {
    try {
      const res = await logoutApi();
      socket?.disconnect();
      toast.success(res.message);
      updateCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const path: Record<string, string> = {
      "/": "Home",
      "/apartments": "Apartments",
      "/profile": "Profile",
    };
    document.title = path[pathname] || "Apartment";
  }, [pathname]);
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <img className="h-9 max-w-28" src={Logo} alt="Logo" loading="lazy" />
        </Link>
        <Link
          className={`nav-link ${
            pathname === "/" &&
            "text-primary font-bold after:w-full after:bg-primary"
          }`}
          to="/"
        >
          Home
        </Link>
        <Link
          className={`nav-link !min-w-[104px] ${
            pathname === "/apartments" &&
            "text-primary font-bold after:w-full after:bg-primary"
          }`}
          to="/apartments"
        >
          Apartments
        </Link>
        {currentUser && (
          <Link
            className={`nav-link ${
              pathname === "/profile" &&
              "text-primary font-bold after:w-full after:bg-primary"
            }`}
            to="/profile"
          >
            Profile
          </Link>
        )}
      </div>
      <div className="nav-right">
        <div className="flex items-center font-bold ml-2">
          {currentUser && (
            <Link to="/profile" className="flex items-center relative">
              {!!numbersOfNewChat && (
                <div className="absolute top-[-8px] left-[30px] bg-red-500 text-white rounded-full w-[20px] h-[20px] flex-center text-xs">
                  {numbersOfNewChat}
                </div>
              )}
              <img
                src={currentUser?.avatar || defaultAvatar}
                alt=""
                width={46}
                className="rounded-full object-cover mr-5 h-10"
              />
              <span className="hidden md:inline">{`${currentUser?.firstName} ${currentUser?.lastName}`}</span>
            </Link>
          )}
          <Dropdown
            label={<i className="fa-solid fa-sort-down text-[20px]" />}
            arrowIcon={false}
            theme={customTheme}
            className="z-[1001]"
          >
            {currentUser ? (
              <>
                <Dropdown.Item className="font-medium flex justify-between">
                  <Link to="/profile">Profile</Link>
                  {!!numbersOfNewChat && (
                    <div className="bg-red-500 text-white rounded-full w-[20px] h-[20px] flex-center text-xs">
                      {numbersOfNewChat}
                    </div>
                  )}
                </Dropdown.Item>
                <Dropdown.Item
                  className="font-medium"
                  onClick={() => setOpenModalChangePass(true)}
                >
                  Change password
                </Dropdown.Item>
                <Dropdown.Item className="font-medium" onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item className="font-medium">
                  <Link to="/login">Sign in</Link>
                </Dropdown.Item>
                <Dropdown.Item className="font-medium">
                  <Link to="/register">Sign up</Link>
                </Dropdown.Item>
              </>
            )}
          </Dropdown>
        </div>

        <DrawerMenu />
      </div>
      <ChangePassword
        openModal={openModalChangePass}
        setOpenModal={setOpenModalChangePass}
      />
    </nav>
  );
}

export default Navbar;
