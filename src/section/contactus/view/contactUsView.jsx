import React from "react";
import ContactUs from "../contactUs";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function ContactUsView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <>
      <div
        className={`min-h-screen p-5 ${
          theme === "dark" ? "text-white" : "bg-white text-black"
        }`}
        style={{ backgroundColor: theme === "dark" ? "#282c34" : undefined }} // Apply custom dark background color
      >
        <ContactUs />
      </div>{" "}
    </>
  );
}

export default ContactUsView;
