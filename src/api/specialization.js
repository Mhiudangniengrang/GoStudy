import axiosClient from "../config/axiosClient";

const getSpecialization = () => {
  return axiosClient.get("/api/Specialization/GetAllSpecialization");
};
const postSpecialization = (userId, specializationId) => {
  return axiosClient.post(
    `/api/Specialization/SaveSpecializationByUser?userId=${userId}`,
    specializationId
  );
};
export { getSpecialization, postSpecialization };
