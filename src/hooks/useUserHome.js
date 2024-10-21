import create from "zustand";
import { getUserHome } from "../api/userHomeApi";
import { getAllUser } from "../api/authenApi";

const useUserHome = create((set) => ({
  userHome: {},
  fetchGetUserHome: async (userId) => {
    try {
      const res = await getUserHome(userId);
      console.log("User Home", res.data);
      if (res && res.status === 200) {
        set({ userHome: res.data });
      }
    } catch (err) {
      console.log("Error get userhome", err);
    }
  },
  getAll: [],
  fetchGetAll: async () => {
    try {
      const res = await getAllUser();
      console.log("Get All", res.data);
      if (res && res.status === 200) {
        set({ getAll: res.data });
      }
    } catch (err) {
      console.log("Error get all", err);
    }
  },
}));
export default useUserHome;
