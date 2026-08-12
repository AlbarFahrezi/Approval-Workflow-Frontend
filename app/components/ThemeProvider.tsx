"use client";

import { useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem(
      "settings_dark_mode"
    );

    const enabled = savedDarkMode === "true";

    document.documentElement.classList.toggle(
      "dark",
      enabled
    );

    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}