import { create } from "zustand";
import {
  getSpecialization,
  getSpecializationAvailable,
  postSpecialization,
  putSpecializationAvailable,
} from "../api/specialization";
import { notification } from "antd";

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
  specializationAvailable: {},
  fetchGetSpecializationAvailable: async (userId) => {
    try {
      const res = await getSpecializationAvailable(userId);
      if (res && res.status === 200) {
        set({ specializationAvailable: res.data });
      }
    } catch (err) {
      console.error("Error fetching spezilation", err);
    }
  },
  fetchPostSpecialization: async (userId, specializationId) => {
    try {
      const res = await postSpecialization(userId, specializationId);
      if (res.status === 200) {
        notification.success({
          message: "Room",
          description: "Unlocks rooms successfully.",
        });
      }
    } catch (err) {
      console.error("Error fetching spezilation", err);
    }
  },
  fetchPutSpecialization: async (userSpecializationId, specializationId) => {
    try {
      const res = await putSpecializationAvailable(
        userSpecializationId,
        specializationId
      );
      if (res.status === 200) {
        notification.success({
          message: "Update room successfull",
          description: res.data.message,
        });
      }
    } catch (err) {
      console.error("Error fetching spezilation", err);
    }
  },
}));
export default useSpecialization;
