"use client";

import { Button } from "@repo/ui/button";

import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  // Get the current theme and toggle function
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      {theme === "light"
        ? "🌙 Dark Mode"
        : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;