import axiosClient from "../config/axiosClient";

const postAttendance = (userId) => {
  return axiosClient.post(`/api/User/SaveAttendance?UserId=${userId}`);
};

export { postAttendance };
