import { useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

const TAB_ORDER = ["/", "/categories", "/stats", "/profile", "/settings"];

function getDepth(pathname: string): number {
  if (pathname === "/") return 0;
  return pathname.split("/").filter(Boolean).length;
}

function getTabIndex(pathname: string): number {
  const idx = TAB_ORDER.indexOf(pathname);
  if (idx >= 0) return idx;
  if (pathname.startsWith("/categories")) return 1;
  if (pathname.startsWith("/profile")) return 3;
  return -1;
}

export type SlideDirection = "left" | "right" | "up" | "down" | "victory";

export function useDirection() {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPathRef = useRef(location.pathname);
  const directionRef = useRef<SlideDirection>("left");
  const victoryRef = useRef(false);

  const getDirection = useCallback((nextPath: string): SlideDirection => {
    const prev = prevPathRef.current;

    // Victory transition: results → home
    if (prev === "/results" && nextPath === "/" && victoryRef.current) {
      return "victory";
    }

    // Vertical: quiz → results (slide down = "up")
    if (prev === "/quiz" && nextPath === "/results") return "up";

    // Vertical: results → home (slide down = "down")
    if (prev === "/results" && nextPath === "/") return "down";

    // Tab navigation: compare tab indices
    const prevTab = getTabIndex(prev);
    const nextTab = getTabIndex(nextPath);
    if (prevTab >= 0 && nextTab >= 0) {
      return nextTab > prevTab ? "left" : "right";
    }

    // Depth-based: deeper = left, shallower = right
    const prevDepth = getDepth(prev);
    const nextDepth = getDepth(nextPath);
    if (nextDepth > prevDepth) return "left";
    if (nextDepth < prevDepth) return "right";

    // Default: same level, left
    return "left";
  }, []);

  const goTo = useCallback((nextPath: string, isVictory = false) => {
    victoryRef.current = isVictory;
    directionRef.current = getDirection(nextPath);
    prevPathRef.current = location.pathname;
    navigate(nextPath);
  }, [getDirection, navigate, location.pathname]);

  const goBack = useCallback((fallback?: string) => {
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallback) {
      goTo(fallback);
    }
  }, [navigate, goTo]);

  return {
    direction: directionRef.current,
    goTo,
    goBack,
    prevPath: prevPathRef.current,
  };
}
