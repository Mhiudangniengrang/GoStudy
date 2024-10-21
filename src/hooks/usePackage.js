import { create } from "zustand";
import { getPackage } from "../api/package";

const usePackage = create((set) => ({
  packages: [],
  fetchGetPackage: async () => {
    try {
      const res = await getPackage();
      if (res && res.status === 200) {
        set({ packages: res.data });
      }
    } catch (err) {
      console.log("Error fetching package", err);
    }
  },
}));
export default usePackage;
