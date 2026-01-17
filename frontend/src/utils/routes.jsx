import { Navigate } from "react-router-dom";
import useAuth from "../store/authStore";

export const SellerRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userRole !== "seller") return <Navigate to="/dashboard" replace />;

  return children;
};

export const CustomerRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const userRole = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userRole === "seller") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const PublicCustomerRoute = ({ children }) => {
  const { user } = useAuth();
  const userRole = user?.role;

  if (userRole === "seller") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
