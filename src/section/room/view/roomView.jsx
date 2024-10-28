import React from "react";
import RoomUser from "../room";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function RoomView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div className={`min-h-screen p-5 ${theme === "dark" ? "bg-[#282c34] text-black" : "bg-white text-black"}`}>
      <RoomUser />
    </div>
  );
}

export default RoomView;
