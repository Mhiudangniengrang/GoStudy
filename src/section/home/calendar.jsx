import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Input, DatePicker, Checkbox, notification } from "antd";
import useTask from "../../hooks/useTask";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Calendars = () => {
  const {
    fetchPostTask,
    fetchGetTaskToday,
    taskToday,
    taskForMonth,
    taskForNextMonth,
    fetchGetTaskForMonth,
    fetchGetTaskForNextMonth,
    fetchPutTask,
    fetchDeleteTask,
  } = useTask();
  const userId = Cookies.get("userId");
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [description, setDescription] = useState("");

  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchTasks = async () => {
      await fetchGetTaskToday(userId);
      await fetchGetTaskForMonth(userId);
      await fetchGetTaskForNextMonth(userId);
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    const formatTasks = (tasks) => {
      return tasks.map((t) => ({
        title: t.title,
        start: dayjs(t.scheduledTime).toISOString(),
        end: dayjs(t.scheduledTime).add(t.timeComplete, "hour").toISOString(),
        description: t.description,
        status: t.status,
        taskId: t.taskId,
      }));
    };

    const monthTasks = taskForMonth ? formatTasks(taskForMonth) : [];
    const nextMonthTasks = taskForNextMonth
      ? formatTasks(taskForNextMonth)
      : [];

    setEvents([...monthTasks, ...nextMonthTasks]);
  }, [taskForMonth, taskForNextMonth]);

  const scheduleNotifications = (task) => {
    const now = dayjs();
    const end = dayjs(task.scheduledEndTime);

    const endDiff = end.diff(now, "milliseconds") - 5 * 60 * 1000;

    if (endDiff > 0) {
      setTimeout(() => {
        notification.warning({
          message: "Task Reminder",
          description: `5 minutes left to complete your task "${task.description}".`,
        });
      }, endDiff);
    }
  };

  const handleAddEvent = async () => {
    if (!dateRange.length || !description) {
      notification.error({
        message: "Invalid Input",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const start = dayjs(dateRange[0]);
    const end = dayjs(dateRange[1]);
    const timeComplete = end.diff(start, "hour");
    const scheduledTime = start.format();
    const scheduledEndTime = end.format();

    try {
      await fetchPostTask({
        userId,
        title: "",
        timeComplete,
        description,
        scheduledTime,
        scheduledEndTime,
        status: false,
        isDeleted: false,
      });

      // Schedule notification 5 minutes before task end time
      const now = dayjs();
      const endDiff = end.diff(now, "milliseconds") - 5 * 60 * 1000;

      if (endDiff > 0) {
        setTimeout(() => {
          notification.warning({
            message: "Task Reminder",
            description: `5 minutes left to complete your task "${description}".`,
          });
        }, endDiff);
      }

      await fetchGetTaskToday(userId);
      await fetchGetTaskForMonth(userId);
      await fetchGetTaskForNextMonth(userId);

      setNewEvent({ title: "", start: "", end: "", description: "" });
      setIsModalVisible(false);
      setDateRange([]);
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
      notification.error({
        message: "Error",
        description: "There was an error adding your task.",
      });
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailVisible(true);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setNewEvent((prev) => ({
        ...prev,
        start: dates[0].format(),
        end: dates[1].format(),
      }));
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setDescription(value);
    setNewEvent((prev) => ({ ...prev, description: value }));
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleEventClick = (clickInfo) => {
    const { description, status, taskId } = clickInfo.event.extendedProps;
    const start = clickInfo.event.start;
    const end = clickInfo.event.end;

    setSelectedTask({
      description,
      status,
      taskId,
      scheduledTime: start,
      scheduledEndTime: end,
    });
    setIsTaskDetailVisible(true);
  };

  const handleStatusChange = async (checked) => {
    try {
      if (selectedTask) {
        await fetchPutTask(selectedTask.taskId, checked);

        await fetchGetTaskToday(userId);
        await fetchGetTaskForMonth(userId);
        await fetchGetTaskForNextMonth(userId);

        setIsTaskDetailVisible(false);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetchDeleteTask(taskId);

      // Directly update the local state by filtering out the deleted task
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.taskId !== taskId)
      );

      // Fetch tasks again to ensure the state is consistent with the server
      await fetchGetTaskToday(userId);
      await fetchGetTaskForMonth(userId);
      await fetchGetTaskForNextMonth(userId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex ">
      <div className="bg-white rounded-lg shadow-md p-4 w-1/5">
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          <PlusOutlined /> Add new task
        </Button>
        <h2 className="text-xl font-bold my-4">You are going to</h2>
        <ul>
          {taskToday &&
            taskToday
              .filter((t) => dayjs(t.scheduledTime).isSame(dayjs(), "day"))
              .map((event, index) => (
                <li key={index} className="mb-4 cursor-pointer">
                  <div className="flex justify-between">
                    <h3
                      className="font-semibold"
                      onClick={() => handleTaskClick(event)}
                    >
                      {event.description}
                    </h3>
                    <DeleteOutlined
                      onClick={() => handleDeleteTask(event.taskId)}
                    />
                  </div>
                  <p>
                    {dayjs(event.scheduledTime).format("MMMM D, YYYY h:mm A")}
                  </p>
                  <hr className="my-2 border-gray" />
                </li>
              ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 w-4/5 mx-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events.map((event) => ({
            title: event.description,
            start: event.start,
            end: event.end,
            extendedProps: {
              description: event.description,
              status: event.status,
              taskId: event.taskId,
            },
          }))}
          eventClick={handleEventClick}
          dayMaxEventRows={3}
          dayMaxEvents={3}
          height={550}
          themeSystem="blue"
        />
      </div>

      <Modal
        title="Task Today"
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
                    {!selectedTask.status &&
                      !dayjs(selectedTask.scheduledEndTime).isBefore(
                        dayjs().startOf("day")
                      ) && (
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
                    {selectedTask.status ? "Complete" : "Not Complete"}
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

      <Modal
        title="Add New Task"
        open={isModalVisible}
        onOk={handleAddEvent}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          name="task"
          placeholder="Enter task..."
          value={description}
          onChange={handleChange}
          className="mb-2"
        />
        <DatePicker.RangePicker
          showTime
          value={dateRange}
          onChange={handleDateChange}
          className="w-full"
          disabledDate={disabledDate}
        />
      </Modal>
    </div>
  );
};

export default Calendars;
