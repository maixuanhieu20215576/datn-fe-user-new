import { useMediaQuery } from "react-responsive";

const useDeviceQueries = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1024px)",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 1025px)" });

  return { isMobile, isTablet, isDesktop };
};

const getUserIdFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user._id;
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export { useDeviceQueries, getUserIdFromLocalStorage, formatNumber };
