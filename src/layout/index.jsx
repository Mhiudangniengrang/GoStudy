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

const { Header, Footer, Content } = Layout;

const LandingPageUser = ({ children }) => {
  LandingPageUser.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const navigate = useNavigate();
  const { isAuthenticated, infoUser, fetchUserInfo } = useAuthen();
  const avatarUrl = infoUser.profileImage || "";
  const userName = infoUser.fullName || "";

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
      <Header className="sticky top-0 z-50 bg-gradient-to-t from-[#D7DDFF] to-white p-12 shadow-md flex justify-between items-center rounded-b-3xl  transition duration-500 ease-in-out transform hover:scale-105">
        <Link to="/user">
          <img src={logo} alt="Go Study Logo" className="h-10" />
        </Link>
        <div className="flex space-x-8 justify-center">
          {[
            { path: "/user/home", label: "HOME" },
            { path: "/user/room", label: "ROOM" },
            { path: "/user/blog", label: "BLOG" },
            { path: "/user/focus-space", label: "FOCUS ROOM" },

            { path: "/user/contact-us", label: "CONTACT US" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[#034EA1] hover:text-orange-500 font-black relative ${
                window.location.pathname === item.path ? "text-orange-500" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Avatar src={avatarUrl} size="large" className="cursor-pointer" />
          </Dropdown>
        </div>
      </Header>
      <Content>{children}</Content>
      <Footer className="bg-gradient-to-t from-blue-200 to-white py-8 px-4 text-center">
        <div className="ml-12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-5">
            <div className="text-left">
              <img
                src={logo}
                alt="Go Study Logo"
                className="h-12 mb-4 transition duration-500 ease-in-out transform hover:rotate-6"
              />
              <p className="text-sm">
                GO! Study is an online communication platform specifically
                designed to create conditions for students to meet, exchange
                studies and work in groups easily and effectively.
              </p>
            </div>
            <div className="text-left my-3 space-y-3 transition duration-500 ease-in-out transform hover:translate-x-1">
              <h2 className="font-bold text-lg">GO! STUDY</h2>
              <p>Home</p>
              <p>How to Go! Study</p>
              <p>Room</p>
              <p>Blogs</p>
              <p>Rules</p>
              <p>Profile</p>
            </div>
            <div className="text-left my-3 space-y-3 transition duration-500 ease-in-out transform hover:translate-x-1">
              <h2 className="font-bold text-lg">How it works</h2>
              <p>Features</p>
              <p>Integrations</p>
              <p>Pricing</p>
              <p>What's new</p>
              <p>Help center</p>
              <p>Contact support</p>
            </div>
            <div className="text-left my-3 space-y-3 transition duration-500 ease-in-out transform hover:translate-x-1">
              <h2 className="font-bold text-lg">About us</h2>
              <p>Hotline: (+84) 34 264 0809</p>
              <p>Email: gostudy.go01@gmail.com</p>
              <p>
                Address: Lot E2a-7, Street D1, D, D1, Long Thanh My, Thu Duc
                City, Ho Chi Minh City 700000, Vietnam
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://www.facebook.com/profile.php?id=100036066884308">
                  <img
                    src={fb}
                    alt="Facebook"
                    className="w-8 h-8 transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </a>
                <a href="https://www.tiktok.com/@_dmhieu12_">
                  <img
                    src={tiktok}
                    alt="TikTok"
                    className="w-8 h-8 transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </a>
                <a href="https://www.instagram.com/wynhhs._hyuss/">
                  <img
                    src={insta}
                    alt="Instagram"
                    className="w-8 h-8 transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-300 pt-4">
            <p>© 2024 Welcome. All rights reserved.</p>
            <p>
              <a
                href="#"
                className="text-blue-600 transition duration-300 ease-in-out transform hover:text-blue-800"
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="#"
                className="text-blue-600 transition duration-300 ease-in-out transform hover:text-blue-800"
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
