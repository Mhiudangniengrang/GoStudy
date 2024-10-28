import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { Suspense, lazy } from "react";
import {
  AdminError,
  Error404,
  Loading,
  ScrollToTop,
  Unauthorized,
} from "../components";
import LandingPage from "../layout/landing";
import LandingPageUser from "../layout";
import AdminLayout from "../layout/admin";
import { UserView } from "../section/admin/User/view";
import useAuthen from "../hooks/useAuthen";

lazy(() => import("../pages/Authentication"));
export const PaymentPage = lazy(() => import("../pages/PaymentPage"));
export const RulesPage = lazy(() => import("../pages/RulesPage"));
export const ContactPage = lazy(() => import("../pages/ContactPage"));
export const ContactUsPage = lazy(() => import("../pages/ContactUsPage"));
export const BlogPage = lazy(() => import("../pages/BlogPage"));
export const RoomPage = lazy(() => import("../pages/RoomPage"));
export const HomePage = lazy(() => import("../pages/HomePage"));
export const ProfilePage = lazy(() => import("../pages/ProfilePage"));
export const CalendarPage = lazy(() => import("../pages/CalendarPage"));
export const PricingPage = lazy(() => import("../pages/PricingPage"));
export const FocusPage = lazy(() => import("../pages/FocusPage"));
export const DashboardPage = lazy(() => import("../pages/DashboardPage"));
export const RoomZego = lazy(() => import("../section/room/roomZego"));
export const PaymentResult = lazy(() =>
  import("../section/payment/paymentResult")
);
export const RoomViewList = lazy(() =>
  import("../section/admin/RoomManage/view/RoomViewList")
);
export const LandingView = lazy(() =>
  import("../section/landing/view/landingView")
);
export const LandingUserView = lazy(() =>
  import("../section/landing/view/landingUserView")
);
export const PaymentView = lazy(()=>import("../section/admin/Payment/view/PaymentView"))

export const Router = () => {
  const { isAuthenticated, infoUser } = useAuthen();
  const specialization = infoUser.specialization;
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <LandingPage>
          <ScrollToTop>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </ScrollToTop>
        </LandingPage>
      ),
      children: [
        {
          path: "/",
          element: <LandingView />,
        },
        {
          path: "*",
          element: <Error404 />,
        },
      ],
    },
    {
      path: "/user",
      element: isAuthenticated ? (
        <LandingPageUser>
          <ScrollToTop>
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </ScrollToTop>
        </LandingPageUser>
      ) : (
        <Navigate to="/" />
      ),
      children: [
        {
          path: "/user",
          element: <LandingUserView />,
        },
        {
          path: "/user/profile",
          element: <ProfilePage />,
        },
        {
          path: "/user/home",
          element: <HomePage />,
        },
        {
          path: "/user/payment/:id",
          element: <PaymentPage />,
        },
        {
          path: "/user/pricing",
          element: <PricingPage />,
        },
        {
          path: "/user/rules",
          element: <RulesPage />,
        },
        {
          path: "/user/contact",
          element: <ContactPage />,
        },
        {
          path: "/user/contact-us",
          element: <ContactUsPage />,
        },
        {
          path: "/user/blog",
          element: <BlogPage />,
        },
        {
          path: "/user/room",
          element: <RoomPage />,
        },
        {
          path: "/user/calendar/task",
          element: <CalendarPage />,
        },
        {
          path: "/user/focus-space",
          element: <FocusPage />,
        },
        {
          path: "*",
          element: <Error404 />,
        },
      ],
    },
    {
      path: "/admin",
      element:
        isAuthenticated && infoUser.role === 2 ? (
          <AdminLayout>
            <ScrollToTop>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </ScrollToTop>
          </AdminLayout>
        ) : (
          <Unauthorized />
        ),
      children: [
        {
          path: "/admin/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/admin/user/view",
          element: <UserView />,
        },
        {
          path: "/admin/room/view",
          element: <RoomViewList />,
        },
        {
          path: "/admin/payment/view",
          element: <PaymentView />,
        },
        { element: <AdminError />, path: "*" },
      ],
    },
    {
      path: "/user/room/:roomId",
      element: <RoomZego />,
    },
    { path: "/payment/result", element: <PaymentResult /> },
  ]);

  return routes;
};
