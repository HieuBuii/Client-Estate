import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import ListApartments from "../pages/ListApartments";
import Apartment from "../pages/Apartment";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthLayout from "../layouts/AuthLayout";
import { loadDataPost, loadProfileListPost } from "../lib/reactRouter/loader";

const Router = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/apartments",
          element: <ListApartments />,
        },
        {
          path: "/apartments/:id",
          element: <Apartment />,
          loader: loadDataPost,
        },
      ],
    },
    isLoggedIn
      ? {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              path: "/profile",
              element: <Profile />,
              loader: loadProfileListPost,
            },
          ],
        }
      : {
          path: "/",
          element: <AuthLayout />,
          children: [
            {
              path: "/login",
              element: <Login />,
            },
            {
              path: "/register",
              element: <Register />,
            },
          ],
        },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
