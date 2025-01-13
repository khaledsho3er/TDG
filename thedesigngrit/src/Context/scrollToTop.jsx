import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // Scrolls to the top after a small delay
  }, [pathname]); // Runs whenever the path changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
