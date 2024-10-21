import { create } from "zustand";
import {
  deleteTask,
  getTask,
  getTaskForNextMonth,
  getTaskForPreviousMonth,
  getTaskNextWeek,
  getTasksForMonth,
  getTaskToday,
  postTask,
  putTask,
} from "../api/taskApi";
import { notification } from "antd";

const useTask = create((set) => ({
  fetchPostTask: async (taskData) => {
    try {
      const respone = await postTask(taskData);
      notification.success({
        message: respone.data,
        description: "Task created successfully",
        duration: 2,
      });
    } catch (error) {
      console.log("task post error", error);
    }
  },
  fetchPutTask: async (taskId) => {
    try {
      const respone = await putTask(taskId);
      notification.success({
        message: respone.data,
        description: "Task updated successfully",
        duration: 2,
      });
    } catch (error) {
      console.log("task put error", error);
    }
  },
  task: [],
  fetchGetTask: async (userId) => {
    try {
      const res = await getTask(userId);

      if (res && res.status === 200) {
        set({ task: res.data });
      }
    } catch (error) {
      console.log("error get", error);
    }
  },
  taskToday: [],
  fetchGetTaskToday: async (userId) => {
    try {
      const res = await getTaskToday(userId);

      if (res && res.status === 200) {
        set({ taskToday: res.data });
      }
    } catch (error) {
      console.log("error get", error);
    }
  },
  taskNextWeek: [],
  fetchGetTaskNextWeek: async (userId) => {
    try {
      const res = await getTaskNextWeek(userId);
      console.log("tasknextweek get success", res.data);
      if (res && res.status === 200) {
        set({ taskNextWeek: res.data });
      }
    } catch (error) {
      console.log("error gettasknextweek", error);
    }
  },
  taskPreviousWeek: [],
  fetchGetTaskPreviousWeek: async (userId) => {
    try {
      const res = await getTasksForPreviousWeek(userId);
      console.log("taskpreviousweek get success", res.data);
      if (res && res.status === 200) {
        set({ taskPreviousWeek: res.data });
      }
    } catch (error) {
      console.log("error gettaskpreviousweek", error);
    }
  },
  taskForMonth: [],
  fetchGetTaskForMonth: async (userId) => {
    try {
      const res = await getTasksForMonth(userId);
      console.log("taskformonth get success", res.data);
      if (res && res.status === 200) {
        set({ taskForMonth: res.data });
      }
    } catch (error) {
      console.log("error gettaskformonth", error);
    }
  },
  taskForNextMonth: [],
  fetchGetTaskForNextMonth: async (userId) => {
    try {
      const res = await getTaskForNextMonth(userId);
      console.log("taskfornextmonth get success", res.data);
      if (res && res.status === 200) {
        set({ taskForNextMonth: res.data });
      }
    } catch (error) {
      console.log("error gettaskfornextmonth", error);
    }
  },
  taskForPreviousMonth: [],
  fetchGetTaskForPreviosMonth: async (userId) => {
    try {
      const res = await getTaskForPreviousMonth(userId);
      console.log("taskforpreviousmonth get success", res.data);
      if (res && res.status === 200) {
        set({ taskForPreviousMonth: res.data });
      }
    } catch (error) {
      console.log("error gettaskfornextmonth", error);
    }
  },
  fetchDeleteTask: async (taskId) => {
    try {
      const res = await deleteTask(taskId);
      console.log("task delete success", res.data);
      if (res && res.status === 200) {
        notification.success({
          message: res.data,
          description: "Task deleted success",
          duration: 2,
        });
      }
    } catch (err) {
      console.log("error delete task", err);
    }
  },
}));
export default useTask;
