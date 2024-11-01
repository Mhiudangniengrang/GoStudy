import Cookies from "js-cookie";
import { create } from "zustand";
import { getInfoUser, updateProfile } from "../api/authenApi";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";

const useAuthen = create((set) => ({
  infoUser: {},
  isAuthenticated: !!Cookies.get("__token"),
  fetchUserInfo: async (userId) => {
    try {
      const res = await getInfoUser(userId);
      if (res && res.status === 200) {
        console.log(res.data);
        set({ infoUser: res.data || {} });
      } else if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
      }
    } catch (err) {
      console.error("Error fetching userInfo", err);
    }
  },
  fetchEditUser: async (userId, userProfile) => {
    try {
      const res = await updateProfile(userId, userProfile);
      if (res && res.status === 200) {
        set({ infoUser: { ...res.data } });
        notification.success({
          message: "Profile Updated",
          description: "Your profile has been updated successfully.",
          duration: 2,
        });
      } else {
        notification.error({
          message: "Update Failed",
          description: "Failed to update your profile. Please try again.",
          duration: 2,
        });
      }
    } catch (err) {
      console.error("Error updating user profile", err);
      notification.error({
        message: "Error",
        description: "An error occurred while updating your profile.",
        duration: 2,
      });
    }
  },
  login: () => {
    set({ isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove("__token");
    sessionStorage.removeItem("keys");
    set({ isAuthenticated: false, infoUser: {} });
  },
}));

const handleUnauthorized = () => {
  Cookies.remove("__token");
  set({ isAuthenticated: false, infoUser: {} });
  notification.error({
    message: "Session Expired",
    description: "Please log in again.",
    duration: 2,
  });
  const navigate = useNavigate();
  navigate("/");
};

export default useAuthen;
