import React, { createContext, useContext, useEffect } from "react";
import { useGymStore } from "../../store/gymStore";

const ThemeContext = createContext<{
  currentTheme: any;
  themes: any[];
}>({
  currentTheme: null,
  themes: [],
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { designThemes, currentDesignTheme } = useGymStore();
  const currentTheme =
    designThemes.find((theme) => theme.id === currentDesignTheme) ||
    designThemes[0];

  useEffect(() => {
    if (currentTheme) {
      // Apply theme colors to CSS custom properties
      const root = document.documentElement;
      root.style.setProperty("--theme-primary", currentTheme.colors.primary);
      root.style.setProperty(
        "--theme-secondary",
        currentTheme.colors.secondary,
      );
      root.style.setProperty("--theme-accent", currentTheme.colors.accent);
      root.style.setProperty(
        "--theme-background",
        currentTheme.colors.background,
      );
      root.style.setProperty("--theme-text", currentTheme.colors.text);

      // Apply theme styles
      root.setAttribute("data-theme-layout", currentTheme.styles.layout);
      root.setAttribute(
        "data-theme-typography",
        currentTheme.styles.typography,
      );
      root.setAttribute("data-theme-button", currentTheme.styles.buttonStyle);
    }
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themes: designThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};
