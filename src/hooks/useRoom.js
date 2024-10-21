import { create } from "zustand";
import { getClass, putClassUrl } from "../api/roomApi";

const useRoom = create((set) => ({
  listRoom: {},
  fetchGetRoom: async (userId) => {
    try {
      const res = await getClass(userId);
      if (res && res.status === 200) {
        set({ listRoom: res.data });
      }
    } catch (err) {
      console.log("Get class err", err);
    }
  },
  fetchPutUrl: async (classroomId, linkUrl) => {
    try {
      const res = await putClassUrl(classroomId, linkUrl);
      console.log("url", res);
    } catch (err) {
      console.log("put failed", err);
    }
  },
}));

export default useRoom;
