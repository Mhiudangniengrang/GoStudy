import React, { useState, useEffect } from "react";
import { Button, Input, Modal, message, DatePicker, Checkbox } from "antd";
import {
  EditOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import useTask from "../../hooks/useTask";

const RoomTask = () => {
  const {
    fetchGetTaskToday,
    fetchPostTask,
    fetchPutTask,
    taskToday,
    fetchDeleteTask,
  } = useTask();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [description, setDescription] = useState("");
  const userId = Cookies.get("userId");

  useEffect(() => {
    fetchGetTaskToday(userId);
  }, [fetchGetTaskToday, userId]);

  useEffect(() => {
    const checkTaskExpiry = () => {
      taskToday.forEach((task) => {
        const endTime = dayjs(task.scheduledEndTime);
        const now = dayjs();
        if (
          endTime.diff(now, "minute") <= 10 &&
          endTime.diff(now, "minute") > 0
        ) {
          message.warning(`Task "${task.description}" is about to expire!`);
        }
      });
    };

    const interval = setInterval(checkTaskExpiry, 60000);
    return () => clearInterval(interval);
  }, [taskToday]);

  const showModal = (task = {}, index = null) => {
    if (index !== null) {
      setDescription(task.description);
      setDateRange([dayjs(task.scheduledTime), dayjs(task.scheduledEndTime)]);
    }
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditIndex(null);
    setDateRange([]);
    setDescription("");
  };

  // Assuming fetchPutTask is correctly imported from useTask

  const handleEditTask = async (taskId, updatedData) => {
    try {
      await fetchPutTask(taskId, updatedData);
      fetchGetTaskToday(userId);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Example function to handle saving changes
  const handleSave = async () => {
    if (!description.trim()) {
      message.warning("Task description cannot be empty");
      return;
    }

    if (!dateRange || dateRange.length !== 2) {
      message.warning("Please select a valid date range");
      return;
    }

    const start = dayjs(dateRange[0]);
    const end = dayjs(dateRange[1]);
    const timeComplete = end.diff(start, "hour");
    const scheduledTime = start.format();

    const updatedData = {
      userId,
      title: "",
      timeComplete,
      description,
      scheduledTime,
      scheduledEndTime: end.format(),
      status: false,
      isDeleted: false,
    };

    if (editIndex !== null && taskToday[editIndex]) {
      // Update existing task
      const taskId = taskToday[editIndex].taskId;
      await handleEditTask(taskId, updatedData);
    } else {
      // Create new task
      await fetchPostTask(updatedData);
      fetchGetTaskToday(userId);
      handleCancel();
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await fetchDeleteTask(taskId);
      await fetchGetTaskToday(userId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDateChange = (dates) => {
    setDateRange(dates || []);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailVisible(true);
  };

  const handleStatusChange = async (checked) => {
    if (selectedTask) {
      await fetchPutTask(selectedTask.taskId, checked);
      fetchGetTaskToday(userId);
      setIsTaskDetailVisible(false);
    }
  };

  return (
    <div className="p-3 rounded-lg mt-5">
      <div
        className="flex justify-between items-center text-white mb-4 p-3"
        style={{ backgroundColor: "#034EA1" }}
      >
        <EditOutlined />
        <p>Task Today</p>
        <CloseOutlined />
      </div>

      <div className="space-y-3">
        {taskToday && taskToday.length > 0 ? (
          taskToday.map((task, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <div className="flex justify-between items-center cursor-pointer">
                <span
                  className="flex-grow "
                  onClick={() => handleTaskClick(task)}
                >
                  {task.description}
                </span>
                <DeleteOutlined
                  onClick={() => handleDelete(task.taskId)}
                  className="ml-2"
                />
              </div>
              <div className="text-gray-600 text-sm">
                {dayjs(task.scheduledTime).format("HH:mm")} -{" "}
                {dayjs(task.scheduledEndTime).format("HH:mm")}
              </div>
              <hr className="my-2 border-gray" />
            </div>
          ))
        ) : (
          <p>No tasks for today</p>
        )}
      </div>

      <Modal
        title="Urgent tasks"
        open={isTaskDetailVisible}
        onCancel={() => setIsTaskDetailVisible(false)}
        footer={null}
      >
        {selectedTask && (
          <div>
            <ul className="divide-y divide-gray-200">
              <li className="flex flex-col py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {!selectedTask.status && (
                      <Checkbox
                        checked={selectedTask.status}
                        onChange={(e) => handleStatusChange(e.target.checked)}
                      />
                    )}
                    <span className="font-medium ml-2">
                      {selectedTask.description}
                    </span>
                  </div>
                  <span
                    className={
                      selectedTask.status
                        ? "text-green-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {selectedTask.status ? "Hoàn thành" : "Chưa hoàn thành"}
                  </span>
                </div>

                <div className="mt-2 text-gray-500 ml-2">
                  <p>
                    <strong>Start:</strong>{" "}
                    {dayjs(selectedTask.scheduledTime).format(
                      "MMMM D, YYYY h:mm A"
                    )}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {dayjs(selectedTask.scheduledEndTime).format(
                      "MMMM D, YYYY h:mm A"
                    )}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomTask;
