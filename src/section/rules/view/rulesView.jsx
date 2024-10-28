import React from "react";
import Rules from "../rules";
import { useTheme } from "../../themeLightDark/ThemeProvider"

function RulesView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div className={`min-h-screen p-5 ${theme === "dark" ? "bg-[#282c34] text-white" : "bg-white text-black"}`}>
      <Rules />
    </div>
  );
}

export default RulesView;
