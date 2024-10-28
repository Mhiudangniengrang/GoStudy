import React from "react";
import Calendars from "../calendar";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function CalendarView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div
      className={`min-h-screen p-5 ${
        theme === "dark" ? "bg-[#282c34] text-black" : "bg-white text-black"
      }`}
    >
      <Calendars />
    </div>
  );
}

export default CalendarView;
