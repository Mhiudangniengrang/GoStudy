import React, { useEffect, useState } from "react";
import { AimOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Checkbox, notification } from "antd";
import useTask from "../../hooks/useTask";
import Cookies from "js-cookie";

const FocusSession = ({ showGoal, toggleShowGoal }) => {
  const [goalInput, setGoalInput] = useState("");
  const {
    fetchPostTask,
    fetchGetTaskToday,
    taskToday,
    fetchPutTask,
    fetchDeleteTask,
  } = useTask();
  const userId = Cookies.get("userId");

  const fetchTasks = async () => {
    await fetchGetTaskToday(userId);
  };

  useEffect(() => {
    fetchTasks();
  }, [userId, fetchGetTaskToday]);

  const handleAddGoal = async () => {
    if (goalInput.trim()) {
      try {
        await fetchPostTask({
          userId,
          title: "",
          description: goalInput,
          scheduledTime: new Date().toISOString(),
          scheduledEndTime: new Date().toISOString(),
          status: false,
          isDeleted: false,
        });

        setGoalInput("");
        fetchTasks(); // Refresh tasks after adding a new one
      } catch (error) {
        notification.error({
          message: "Error",
          description: "There was an error adding your task.",
        });
      }
    }
  };

  const handleCompleteGoal = async (index) => {
    const task = taskToday[index];
    try {
      await fetchPutTask(task.taskId, {
        ...task,
        status: !task.status,
      });
      fetchTasks(); // Refresh tasks after updating the status
    } catch (error) {
      notification.error({
        message: "Error",
        description: "There was an error updating the task status.",
      });
    }
  };

  const handleRemoveGoal = async (index) => {
    const task = taskToday[index];
    try {
      await fetchDeleteTask(task.taskId);
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      notification.error({
        message: "Error",
        description: "There was an error deleting the task.",
      });
    }
  };

  const completedGoals = taskToday.filter((task) => task.status).length;

  return (
    <div>
      <button
        className="text-white p-2 mt-8 bg-black bg-opacity-70 rounded-lg text-sm ml-3"
        onClick={toggleShowGoal}
      >
        <AimOutlined /> Session goals {completedGoals}/{taskToday.length}
      </button>

      {showGoal && (
        <div className="absolute mt-2 bg-black bg-opacity-60 p-4 rounded-lg w-80 text-white z-20 ml-3">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AimOutlined className="mr-2" />
            Session Goals
          </h3>

          <div className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Type a goal..."
                className="w-full px-2 py-1 rounded bg-gray-800 text-white outline-none"
              />
              <div className="ml-2 bg-gray-800 px-2 py-1 rounded">
                <PlusOutlined onClick={handleAddGoal} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 px-8 py-8 rounded">
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <span className="text-4xl">
                  {taskToday.length - completedGoals}
                </span>
                <span className="text-lg">Open</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl text-green-500">
                  {completedGoals}
                </span>
                <span className="text-lg">Completed</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <ul className="list-none p-0">
              {taskToday.map((task, index) => (
                <li
                  key={task.taskId}
                  className="flex justify-between items-center mt-2"
                >
                  <Checkbox
                    checked={task.status}
                    onChange={() => handleCompleteGoal(index)}
                  >
                    <span
                      className={`${
                        task.status ? "line-through" : ""
                      } text-white`}
                    >
                      {task.description}
                    </span>
                  </Checkbox>
                  <button
                    onClick={() => handleRemoveGoal(index)}
                    className="text-white py-1 px-2 rounded ml-2"
                  >
                    <CloseOutlined />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusSession;
