import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const getUserDetails = () => {
  try {
    localStorage.getItem("user")
    const token = Cookies.get("user");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded; 
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
};

export const getThaterDetails = () => {
  try {
    localStorage.getItem("Thater")
    const token = Cookies.get("Thater");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded; 
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
};