import axiosClient from "../config/axiosClient";

const getClass = (userId) => {
  return axiosClient.get(`/api/Classroom/user/${userId}`);
};
const putClassUrl = (classroomId, linkUrl) => {
  return axiosClient.put(
    `/api/Classroom/UpdateLinkUrl/${classroomId}`,
    linkUrl
  );
};
export { getClass, putClassUrl };
