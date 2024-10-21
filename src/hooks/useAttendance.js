import { create } from "zustand";
import { postAttendance } from "../api/attendance";
import { notification } from "antd";

const useAttendance = create((set) => ({
  fetchPostAttendance: async (userId) => {
    try {
      const res = await postAttendance(userId);
      if (res && res.status === 200) {
        notification.success({
          message: res.data,
          description: "Attendance recorded successfully",
          duration: 2,
        });
      }
    } catch (error) {
      console.log("error post attendance", error);
    }
  },
}));
export default useAttendance;
