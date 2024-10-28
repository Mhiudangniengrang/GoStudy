import React, { useEffect } from "react";
import { Avatar, Layout, Dropdown, Menu } from "antd";
import logo from "../assets/landingimage/Asset 5.png";
import fb from "../assets/landingimage/facebook-circle-logo-png.png";
import tiktok from "../assets/landingimage/1691751429tiktok-icon-png.png";
import insta from "../assets/landingimage/1715965947instagram-logo-png (1).png";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthen from "../hooks/useAuthen";
import Cookies from "js-cookie";
import DarkMode from "../section/DarkMode/DarkMode";
import { useTheme } from "../section/themeLightDark/ThemeProvider"; // Import useTheme

const { Header, Footer, Content } = Layout;

const LandingPageUser = ({ children }) => {
  LandingPageUser.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const navigate = useNavigate();
  const { isAuthenticated, infoUser, fetchUserInfo } = useAuthen();
  const avatarUrl = infoUser.profileImage || "";
  const userName = infoUser.fullName || "";
  const { theme } = useTheme(); // Lấy theme hiện tại từ context

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (isAuthenticated && !infoUser.fullName && userId) {
      fetchUserInfo(userId);
    }
  }, [isAuthenticated, infoUser, fetchUserInfo]);

  const handleLogout = () => {
    Cookies.remove("__token");
    Cookies.remove("userId");
    navigate("/");
  };

  const menu = (
    <Menu>
      {infoUser.role === 1 && (
        <Menu.Item key="admin-dashboard">
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Item key="profile">
        <Link to="/user/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="landing-page min-h-screen bg-white">
      {/* Header */}
      <Header
        className={`sticky top-0 z-50 p-4 md:p-12 shadow-md flex justify-between items-center  ${
          theme === "dark" ? "header-dark" : "header-light"
        }`}
      >
        <Link to="/user">
          <img src={logo} alt="Go Study Logo" className="h-8 md:h-10" />
        </Link>
        <div className="flex space-x-4 md:space-x-8 justify-center">
          {[
            { path: "/user/home", label: "HOME" },
            { path: "/user/room", label: "ROOM" },
            { path: "/user/blog", label: "BLOG" },
            { path: "/user/focus-space", label: "FOCUS ROOM" },
            { path: "/user/rules", label: "RULES" },
            { path: "/user/contact-us", label: "CONTACT US" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm md:text-md text-[#034EA1] hover:text-orange-500 font-black relative ${
                window.location.pathname === item.path ? "text-orange-500" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <DarkMode />
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar src={avatarUrl} size="large" className="cursor-pointer" />
          </Dropdown>
        </div>
      </Header>

      {/* Content */}
      <Content className="">{children}</Content>

      {/* Footer */}
      <Footer
        className={`py-8 px-4 text-center ${
          theme === "dark" ? "footer-dark" : "footer-light"
        }`}
      >
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5">
            <div className="text-left mb-4">
              <img
                src={logo}
                alt="Go Study Logo"
                className="h-10 md:h-12 mb-4 transition duration-500 ease-in-out transform hover:rotate-6"
              />
              <p className="text-xs md:text-sm">
                GO! Study is an online communication platform specifically
                designed to create conditions for students to meet, exchange
                studies, and work in groups easily and effectively.
              </p>
            </div>

            <div className="text-left my-3 space-y-2 md:space-y-3">
              <h2 className="font-bold text-sm md:text-lg">GO! STUDY</h2>
              <p className="text-xs md:text-sm">Home</p>
              <p className="text-xs md:text-sm">How to Go! Study</p>
              <p className="text-xs md:text-sm">Room</p>
              <p className="text-xs md:text-sm">Blogs</p>
              <p className="text-xs md:text-sm">Rules</p>
              <p className="text-xs md:text-sm">Profile</p>
            </div>

            <div className="text-left my-3 space-y-2 md:space-y-3">
              <h2 className="font-bold text-sm md:text-lg">How it works</h2>
              <p className="text-xs md:text-sm">Features</p>
              <p className="text-xs md:text-sm">Integrations</p>
              <p className="text-xs md:text-sm">Pricing</p>
              <p className="text-xs md:text-sm">What's new</p>
              <p className="text-xs md:text-sm">Help center</p>
              <p className="text-xs md:text-sm">Contact support</p>
            </div>

            <div className="text-left my-3 space-y-2 md:space-y-3">
              <h2 className="font-bold text-sm md:text-lg">About us</h2>
              <p className="text-xs md:text-sm">Hotline: (+84) 34 264 0809</p>
              <p className="text-xs md:text-sm">
                Email: gostudy.go01@gmail.com
              </p>
              <p className="text-xs md:text-sm">
                Address: Lot E2a-7, Street D1, Long Thanh My, Thu Duc City, Ho
                Chi Minh City 700000, Vietnam
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://www.facebook.com/GoStudynumber1">
                  <img
                    src={fb}
                    alt="Facebook"
                    className="w-6 h-6 md:w-8 md:h-8 transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </a>
                <a href="https://www.tiktok.com/@go.study21">
                  <img
                    src={tiktok}
                    alt="TikTok"
                    className="w-6 h-6 md:w-8 md:h-8 transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </a>
                <a href="https://www.instagram.com/gostudy_go01/">
                  <img
                    src={insta}
                    alt="Instagram"
                    className="w-6 h-6 md:w-8 md:h-8 transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-300 pt-4">
            <p className="text-xs md:text-sm">
              © 2024 Welcome. All rights reserved.
            </p>
            <p className="text-xs md:text-sm">
              <a
                href="#"
                className={`transition duration-300 ease-in-out transform hover:text-blue-800 ${
                  theme === "dark" ? "link-dark" : "link-light"
                }`}
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="#"
                className={`transition duration-300 ease-in-out transform hover:text-blue-800 ${
                  theme === "dark" ? "link-dark" : "link-light"
                }`}
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPageUser;
