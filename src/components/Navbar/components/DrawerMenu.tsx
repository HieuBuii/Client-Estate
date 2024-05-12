import { Drawer, Sidebar } from "flowbite-react";
import { useContext, useState } from "react";
import {
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineOfficeBuilding,
  HiLogin,
  HiPencil,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export function DrawerMenu() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleLinkToPage = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string
  ) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <>
      <div className="flex min-h-[50vh] items-center justify-center">
        <button
          className="w-8 h-8 cursor-pointer ml-2 text-2xl focus:border-0 focus:outline-0 sm:hidden"
          onClick={() => setIsOpen(true)}
        >
          <i className="fa-solid fa-bars" />
        </button>
      </div>
      <Drawer open={isOpen} onClose={handleClose} position="right">
        <Drawer.Header
          className="[&>h5]:font-bold"
          title="MENU"
          titleIcon={() => <></>}
        />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    <Sidebar.Item
                      icon={HiOutlineHome}
                      href="/"
                      onClick={(
                        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                      ) => handleLinkToPage(e, "/")}
                    >
                      Home
                    </Sidebar.Item>
                    <Sidebar.Item
                      icon={HiOutlineOfficeBuilding}
                      href="/apartments"
                      onClick={(
                        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                      ) => handleLinkToPage(e, "/apartments")}
                    >
                      Apartments
                    </Sidebar.Item>
                    {currentUser && (
                      <Sidebar.Item
                        icon={HiOutlineInformationCircle}
                        href="/profile"
                        onClick={(
                          e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                        ) => handleLinkToPage(e, "/profile")}
                      >
                        Profile
                      </Sidebar.Item>
                    )}

                    {!currentUser && (
                      <>
                        <Sidebar.Item
                          href="/login"
                          icon={HiLogin}
                          onClick={(
                            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                          ) => handleLinkToPage(e, "/login")}
                        >
                          Sign in
                        </Sidebar.Item>
                        <Sidebar.Item
                          href="/register"
                          icon={HiPencil}
                          onClick={(
                            e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                          ) => handleLinkToPage(e, "/register")}
                        >
                          Sign up
                        </Sidebar.Item>
                      </>
                    )}
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
