import React from "react";
import LandingUser from "../landingUser";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function LandingUserView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-[#282c34] text-black" : "bg-white text-black"
      }`}
    >
      <LandingUser />
    </div>
  );
}

export default LandingUserView;
