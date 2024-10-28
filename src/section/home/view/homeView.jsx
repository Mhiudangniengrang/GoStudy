import React from "react";
import Home from "../home";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function HomeView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div className={`min-h-screen p-5 ${theme === "dark" ? "bg-[#282c34] text-dark" : "bg-white text-black"}`}>
      <Home />
    </div>
  );
}

export default HomeView;
