import React from "react";
import LandingPricing from "../landingPricing";
import { useTheme } from "../../themeLightDark/ThemeProvider"; // Import useTheme

function LandingPricingView() {
  const { theme } = useTheme(); // Get the current theme from context

  return (
    <div
      className={`min-h-screen p-5 ${
        theme === "dark" ? "bg-[#282c34] text-black" : "bg-white text-black"
      }`}
    >
      <LandingPricing />
    </div>
  );
}

export default LandingPricingView;
