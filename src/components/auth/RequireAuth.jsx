import { useEffect, useRef } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const RequireAuth = ({ allowedRoles }) => {
  const { roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roles.some((role) => allowedRoles.includes(role))) {
      toast.error("Unauthorized!");
      navigate("/dash/dashboard");
    }
  }, [roles, allowedRoles, navigate]);

  return roles.some((role) => allowedRoles.includes(role)) ? <Outlet /> : null;
};

export default RequireAuth;
