import axiosClient from "../config/axiosClient";

const getPackage = () => {
  return axiosClient.get("/api/Package/All_Package");
};
export { getPackage };
