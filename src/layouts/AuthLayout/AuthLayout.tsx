import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "/images/logo-icon.png";
import { useEffect } from "react";

function AuthLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path: Record<string, string> = {
      "/register": "Register",
      "/login": "Login",
    };
    document.title = path[pathname];
  }, [pathname]);
  return (
    <div className="sm:h-screen flex items-center gap-10 overflow-y-auto">
      <div className="hidden sm:flex-3 h-full sm:flex-center flex-col sm:bg-[radial-gradient(circle,rgba(233,228,148,1)21%,rgba(174,238,224,1)86%)]">
        <Link to="/">
          <img className="max-sm:h-[120px]" src={logo} alt="logo" />
        </Link>
        <p className="hidden sm:inline text-9xl font-bold">DEV</p>
      </div>
      <div className="flex-1 sm:flex-2 h-full flex-center p-6 flex-col min-h-screen">
        <Link to="/" className="hidden max-sm:block">
          <img
            className="hidden max-sm:block max-sm:h-[120px]"
            src={logo}
            alt="logo"
          />
        </Link>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
