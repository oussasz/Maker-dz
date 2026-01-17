import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../store/authStore";
import LoadingSpinner from "../../components/ui/loading-spinner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAccessToken, setRefreshToken, setUser, setIsAuthenticated } =
    useAuth();

  useEffect(() => {
    const handleCallback = () => {
      // Get tokens and user data from URL params
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const userString = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        console.error("OAuth error:", error);
        navigate("/login?error=" + error);
        return;
      }

      if (accessToken && refreshToken && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));

          // Store auth data
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          setUser(user);
          setIsAuthenticated(true);

          // Redirect based on user role
          if (user?.role === "seller") {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          navigate("/login?error=invalid_data");
        }
      } else {
        navigate("/login?error=missing_data");
      }
    };

    handleCallback();
  }, [
    searchParams,
    navigate,
    setAccessToken,
    setRefreshToken,
    setUser,
    setIsAuthenticated,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner text="Authenticating..." />
    </div>
  );
};

export default AuthCallback;
