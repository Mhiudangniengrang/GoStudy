import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, Layout, Menu, notification } from "antd";
import {
  HomeOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useAuth from "../hooks/useAuthen.js";
import { Dropdown } from "antd";
import gostudy from "../assets/landingimage/Asset 4.png";
const { Content, Sider, Footer, Header } = Layout;

function getItem(label, key, icon, children, path) {
  return {
    key,
    icon,
    children,
    label,
    path,
  };
}

const items = [
  getItem("Home", "1", <HomeOutlined />, null, "/admin/dashboard"),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("User list", "2", null, null, "/admin/user/view"),
  ]),
  getItem("Room", "sub2", <VideoCameraOutlined />, [
    getItem("Room List", "3", null, null, "/admin/room/view"),
  ]),

  getItem("Payment", "sub3", <ShoppingOutlined />, [
    getItem("Payment List", "4", null, null, "/admin/payment/view"),
  ]),
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, infoUser, logout } = useAuth();

  const storeDefaultSelectedKeys = (keys) => {
    sessionStorage.setItem("keys", keys);
  };

  const resetDefaultSelectedKeys = () => {
    const selectedKeys = sessionStorage.getItem("keys");
    return selectedKeys ? selectedKeys : ["2"];
  };

  const defaultSelectedKeys = resetDefaultSelectedKeys();

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => storeDefaultSelectedKeys([item.key])}
          >
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        );
      }
    });
  };
  AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const handleLogout = () => {
    logout();
    notification.success({
      message: "Logout Successful",
      description: "You have successfully logged out.",
      duration: 2,
    });
  };
  const dropItems = () => {
    return [
      {
        label: (
          <a href={`/users/info/${infoUser._id}`}>
            {isAuthenticated ? <strong>{infoUser.membername}</strong> : ""}
          </a>
        ),
        key: "0",
      },
      {
        label: <a href="/home">Store</a>,
        key: "1",
      },
      {
        label: (
          <a href={`/user/change-password/${infoUser._id}`}>Change Password</a>
        ),
        key: "2",
      },
      {
        label: (
          <p
            className="text-blue-500 font-bold hover:underline cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </p>
        ),
        key: "3",
      },
    ];
  };
  const menu = (
    <Menu>
      {dropItems().map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      <Sider
        width={230}
        breakpoint="lg"
        collapsedWidth="55"
        defaultCollapsed
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="scrollbar sider overflow-auto min-h-screen left-0 top-0 bottom-0 box-border z-50 flex-none w-56 overflow-y-auto"
        theme="light"
      >
        <div className="demo-logo-vertical" />
        <div className="flex justify-center my-4">
          <img
            className="w-6/12 object-cover select-none"
            src={gostudy}
            alt=""
          />
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={defaultSelectedKeys}
          mode="inline"
          className="select-none"
        >
          {renderMenuItems(items)}
        </Menu>
      </Sider>
      <Layout className="right-bar overflow-y-auto transition-all duration-[280ms] ease-in">
        <Header className="bg-[#f8f8f8] bg-opacity-80 backdrop-blur-[6px]">
          <div className="header pr-4 flex justify-end gap-2 items-center fixed z-[1000] h-16 shadow-none ">
            <Dropdown menu={menu} placement="bottomRight" trigger={["click"]}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Avatar
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7rHb3Lmhnhau0CLSdDWBu3f4RKAiXHEV7hQ&s"
                  size="large"
                />
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          className={`mt-[80px] ${collapsed ? "ml-[10px]" : "ml-[240px]"}`}
        >
          <div className="rounded-sm overflow-x-auto min-w-[250px] bg-[#fff]">
            {children}
          </div>
        </Content>
        <Footer className="text-center">
          Copyright ©{new Date().getFullYear()} Watch Store
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
