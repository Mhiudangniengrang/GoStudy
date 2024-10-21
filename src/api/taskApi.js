import axiosClient from "../config/axiosClient";

const postTask = (taskData) => {
  return axiosClient.post("/api/Task/SaveTask", taskData);
};
const getTask = (userId) => {
  return axiosClient.get(`/api/Task/GetTasksForMonth/${userId}`);
};
const getTaskToday = (userId) => {
  return axiosClient.get(`/api/Task/today/${userId}`);
};
const putTask = (taskId) => {
  return axiosClient.put(`/api/Task/Completetask/${taskId}`);
};
const getTaskNextWeek = (userId) => {
  return axiosClient.get(`/api/Task/GetTasksForNextWeek/${userId}`);
};
const getTasksForPreviousWeek = (userId) => {
  return axiosClient.get(`/api/Task/GetTasksForPreviousWeek/${userId}`);
};
const getTasksForMonth = (userId) => {
  return axiosClient.get(`/api/Task/GetTasksForMonth/${userId}`);
};
const getTaskForNextMonth = (userId) => {
  return axiosClient.get(`/api/Task/GetTasksForNextMonth/${userId}`);
};
const getTaskForPreviousMonth = (userId) => {
  return axiosClient.get(`/api/Task/GetTasksForPreviousMonth/${userId}`);
};
const deleteTask = (taskId) => {
  return axiosClient.delete(`/api/Task/SoftDelete/${taskId}`);
};
export {
  postTask,
  putTask,
  deleteTask,
  getTask,
  getTaskToday,
  getTaskNextWeek,
  getTasksForPreviousWeek,
  getTasksForMonth,
  getTaskForNextMonth,
  getTaskForPreviousMonth,
};
