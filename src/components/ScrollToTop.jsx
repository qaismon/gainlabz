import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Extracts pathname property from the current location
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scrolls to top of the page on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;