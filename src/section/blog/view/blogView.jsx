import React from "react";
import Blog from "../blog";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function BlogView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div
      className={`min-h-screen p-5 ${
        theme === "dark" ? "bg-[#282c34] text-white" : "bg-white text-black"
      }`}
    >
      <Blog />
    </div>
  );
}

export default BlogView;
