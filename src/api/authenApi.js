import axiosClient from "../config/axiosClient";

const login = (idToken) => {
  return axiosClient.post("/api/auth/google", { idToken });
};

const getInfoUser = (userId) => {
  return axiosClient.get(`/api/User/GetUserProfile/${userId}`);
};

const getAllUser = () => {
  return axiosClient.get("/api/User/GetAll");
};

const updateProfile = (userId, userProfile) => {
  return axiosClient.put(
    `/api/User/update-profile?userid=${userId}`,
    userProfile
  );
};

export { login, getInfoUser, updateProfile, getAllUser };
