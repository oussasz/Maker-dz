import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../store/authStore";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAccessToken, setRefreshToken, setUser, setIsAuthenticated } = useAuth();
  const { t } = useTranslation("login");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });

      if (response.status === 200) {
        console.log("User logged in:", response.data);
        const user = response.data.user;
        console.log("setAccessToken type:", typeof setAccessToken);

        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUser(user);
        setIsAuthenticated(true);
        if (user?.role === "seller") {
          navigate(`/dashboard`, { replace: true });
        } else if (user?.role === "customer") {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-background w-full h-[88vh] p-10 md:p-0">
      <div className="w-full space-y-8 flex-1">
        <div className="flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-medium 900 mb-8">
              {t("login_to_your_account")}
            </h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="email">{t("email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email")}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password">{t("password")}</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password")}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{t("invalid_credentials_error")}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200">
                {t("login_button")}
              </button>

              <p>
                {t("dont_have_account")}{" "}
                <Link className="text-primary font-semibold" to={"/signup"}>
                  {t("signup_link")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
