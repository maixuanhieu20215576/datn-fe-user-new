import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router";
import { useEffect } from "react";

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

const getUserRoleFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role;
};

const useAccessToken = () => {
  const navigate = useNavigate();

  const getAccessToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    const token = accessToken ? JSON.parse(accessToken) : null;
    if (!token || !token.expires || new Date(token.expires) < new Date()) {
      return null;
    }
    return token.token;
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  return getAccessToken();
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export {
  useDeviceQueries,
  getUserIdFromLocalStorage,
  getUserRoleFromLocalStorage,
  formatNumber,
  useAccessToken,
};
