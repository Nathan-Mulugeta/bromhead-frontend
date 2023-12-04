import { useSelector } from "react-redux";
import { selectCurrentToken } from "../slices/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";
  let isExpired = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { username, roles } = decoded.UserInfo;

    const currentTime = Math.floor(Date.now() / 1000);
    isExpired = currentTime > decoded.exp;

    if (isExpired)
      return { username: "", roles: [], isManager, isAdmin, status };

    isManager = roles.includes("Manager");
    isAdmin = roles.includes("Admin");

    if (isManager) status = "Manager";
    if (isAdmin) status = "Admin";

    return { username, roles, status, isManager, isAdmin };
  }

  return { username: "", roles: [], isManager, isAdmin, status };
};
export default useAuth;
