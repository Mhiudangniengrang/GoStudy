import { create } from "zustand";
import { getSpecialization, postSpecialization } from "../api/specialization";

const useSpecialization = create((set) => ({
  specialization: [],
  fetchGetSpecialization: async () => {
    try {
      const res = await getSpecialization();
      if (res && res.status === 200) {
        set({ specialization: res.data });
      }
    } catch (err) {
      console.error("Error fetching spezilation", err);
    }
  },
  fetchPostSpecialization: async (userId, specializationId) => {
    try {
      const res = await postSpecialization(userId, specializationId);
      console.log("postSpecial", res.data);
    } catch (err) {
      console.error("Error fetching spezilation", err);
    }
  },
}));
export default useSpecialization;
