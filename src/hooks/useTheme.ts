import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("neoquiz_dark");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("neoquiz_dark", String(dark));
  }, [dark]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored = localStorage.getItem("neoquiz_dark");
      if (stored === null) setDark(mq.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(() => setDark(d => !d), []);
  return { dark, toggle };
}
