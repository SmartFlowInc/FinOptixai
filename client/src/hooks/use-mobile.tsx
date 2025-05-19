import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    // Define the check for mobile devices
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Common breakpoint for mobile devices
    };

    // Set initial value
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}