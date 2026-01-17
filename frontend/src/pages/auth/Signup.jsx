import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("signup");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/register", { username, email, password, role });
      console.log("User saved:", response.data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Username is already taken. Please choose another.");
      } else {
        console.error("Error saving user:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-background w-full h-[88vh]">
      <div className="w-full space-y-8 flex-1">
        <div className="flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-medium 900 mb-8">
              {t("create_your_account")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col">
                <label htmlFor="username">{t("username")}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  placeholder={t("username")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">{t("email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t("email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="role">{t("role")}</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t("choose_your_role")}</option>
                  <option value="customer">{t("customer")}</option>
                  <option value="seller">{t("seller")}</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="password">{t("password")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t("password")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{t("username_taken_error")}</p>
              )}

              <button
                type="submit"
                className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200"
              >
                {t("signup_button")}
              </button>

              <p>
                {t("already_have_account")}{" "}
                <Link className="text-primary font-semibold" to={"/login"}>
                  {t("login_link")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;