import React, { useState, useEffect } from "react";
import { Button, notification } from "antd";
import {
  CaretRightOutlined,
  PauseOutlined,
  BorderOutlined,
  HourglassOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

const FocusTimer = ({
  focusTime,
  breakTime,
  isLoop,
  setFocusTime,
  setBreakTime,
  isTimerRunning,
  setIsTimerRunning,
  showTimer, // Receive showTimer as a prop
  toggleShowTimer, // Receive toggleShowTimer from parent
}) => {
  const [currentTime, setCurrentTime] = useState(focusTime * 60);
  const [isFocusSession, setIsFocusSession] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isTimerRunning && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(interval);

            if (isFocusSession && !notificationShown) {
              openNotification();
              setNotificationShown(true);
            }

            if (!isFocusSession) {
              setIsFocusSession(true);
              setCurrentTime(focusTime * 60);
              setIsTimerRunning(false);
            }

            return 0;
          }
        });
      }, 1000);
    } else if (!isTimerRunning && currentTime !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [
    isTimerRunning,
    isPaused,
    isLoop,
    currentTime,
    isFocusSession,
    focusTime,
    breakTime,
    notificationShown,
  ]);

  const openNotification = () => {
    notification.open({
      message: "Focus Session Ended",
      description:
        "Your focus session has ended. Do you want to start your break time?",
      btn: (
        <Button
          type="primary"
          onClick={() => {
            startBreakTime();
            notification.destroy();
          }}
        >
          Start Break
        </Button>
      ),
      onClose: () => {
        stopTimer();
      },
    });
  };

  const startBreakTime = () => {
    setIsFocusSession(false);
    setCurrentTime(breakTime * 60);
    setIsTimerRunning(true);
    setNotificationShown(false);
  };

  const adjustFocusTime = (amount) => {
    const newFocusTime = Math.max(5, focusTime + amount);
    setFocusTime(newFocusTime);
    if (isFocusSession) {
      setCurrentTime(newFocusTime * 60);
    }
  };

  const adjustBreakTime = (amount) => {
    const newBreakTime = Math.max(5, breakTime + amount);
    setBreakTime(newBreakTime);
    if (!isFocusSession) {
      setCurrentTime(newBreakTime * 60);
    }
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setCurrentTime(focusTime * 60);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      secs < 10 ? "0" : ""
    }${secs}`;
  };

  return (
    <div>
      <button
        className="text-white p-2 mt-8 bg-black bg-opacity-70 rounded-lg text-sm ml-3"
        onClick={toggleShowTimer} // Use the toggle function passed as a prop
      >
        <FieldTimeOutlined /> Personal Timer
      </button>

      {showTimer && isTimerRunning && (
        <div className="absolute mt-2 bg-black bg-opacity-60 p-4 rounded-lg w-80 text-white z-20 ml-3">
          <div className="flex items-center space-x-2">
            <HourglassOutlined />
            <span>{isFocusSession ? "Focus time" : "Break time"}</span>
          </div>

          <div className="flex justify-between">
            <div className="text-xl font-mono mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="flex space-x-5">
              <button onClick={pauseTimer} className="text-white text-xl">
                {isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
              </button>
              <button onClick={stopTimer} className="text-white text-xl">
                <BorderOutlined />
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimer && !isTimerRunning && (
        <div className="absolute mt-2 bg-black bg-opacity-60 p-6 rounded-lg w-80 text-white z-20">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            Personal Timer
          </h2>
          <div className="mb-4">
            <label className="text-sm font-medium">Focus time (min)</label>
            <div className="flex items-center justify-between mt-1">
              <button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustFocusTime(-5)}
              >
                –
              </button>
              <span className="text-3xl font-mono">{`${focusTime}:00`}</span>
              <button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustFocusTime(5)}
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Break time (min)</label>
            <div className="flex items-center justify-between mt-1">
              <button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustBreakTime(-5)}
              >
                –
              </button>
              <span className="text-3xl font-mono">{`${breakTime}:00`}</span>
              <button
                className="text-3xl px-2 focus:outline-none hover:bg-gray-700 rounded"
                onClick={() => adjustBreakTime(5)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="text-sm">Loop automatically</label>
            <input
              type="checkbox"
              checked={isLoop}
              onChange={() => setIsLoop(!isLoop)}
              className="w-5 h-5 rounded focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsTimerRunning(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Start Timer
          </button>
        </div>
      )}
    </div>
  );
};

export default FocusTimer;
