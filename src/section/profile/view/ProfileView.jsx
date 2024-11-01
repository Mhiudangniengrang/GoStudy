import React from "react";
import ProfileUser from "../ProfileUser";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function ProfileView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div
      className={`min-h-screen p-20 ${
        theme === "dark" ? "bg-[#282c34] text-dark" : "bg-white text-black"
      }`}
    >
      <ProfileUser />
    </div>
  );
}

export default ProfileView;
