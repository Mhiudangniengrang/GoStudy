import axiosClient from "../config/axiosClient";

const getUserHome = (userId) => {
  return axiosClient.get(`/api/User/GetUserHome/${userId}`);
};

export { getUserHome };
