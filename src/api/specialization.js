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
const getSpecializationAvailable = (userId) => {
  return axiosClient.get(
    `/api/Specialization/AvailableSpecializations?userId=${userId}`
  );
};
const putSpecializationAvailable = (userSpecializationId, specializationId) => {
  return axiosClient.put(
    `/api/Specialization/UpdateUserSpecialization?userSpecializationId=${userSpecializationId}&specializationId=${specializationId}`
  );
};
export {
  getSpecialization,
  postSpecialization,
  getSpecializationAvailable,
  putSpecializationAvailable,
};
