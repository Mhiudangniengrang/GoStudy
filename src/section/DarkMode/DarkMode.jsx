import React from "react";
import { ReactSVG } from "react-svg";
import { useTheme } from "../themeLightDark/ThemeProvider";
import "./DarkMode.css";

function DarkMode() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        checked={theme === "dark"}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <ReactSVG src="./Sun.svg" className="sun" />
        <ReactSVG src="./Moon.svg" className="moon" />
      </label>
    </div>
  );
}

export default DarkMode;
