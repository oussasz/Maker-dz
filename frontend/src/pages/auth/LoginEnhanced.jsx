import React, { useState, useCallback } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../store/authStore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Logo from "../../assets/Logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setAccessToken, setRefreshToken, setUser, setIsAuthenticated } =
    useAuth();
  const { t, i18n } = useTranslation("login");
  const isRTL = i18n.language === "ar";

  const validateEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/login", { email, password });

      if (response.status === 200) {
        const user = response.data.user;
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUser(user);
        setIsAuthenticated(true);

        if (user?.role === "seller") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response?.status === 401) {
        setError(t("invalid_credentials_error") || "Invalid email or password");
      } else if (error.response?.status === 429) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <img src={Logo} alt="Maker DZ" className="h-12 mx-auto" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t("login_to_your_account")}
            </h1>
            <p className="text-gray-500">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("email")}
              </label>
              <div className="relative">
                <Mail
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className={`
                    w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-3
                    bg-gray-50 border-2 border-gray-100 rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:border-primary focus:bg-white
                    transition-all duration-200
                  `}
                  aria-describedby={error ? "email-error" : undefined}
                />
                {email && validateEmail(email) && (
                  <CheckCircle2
                    className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-green-500`}
                  />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("password")}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`
                    w-full ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} py-3
                    bg-gray-50 border-2 border-gray-100 rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:border-primary focus:bg-white
                    transition-all duration-200
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-6 text-base font-semibold
                bg-primary hover:bg-primary/90
                rounded-xl shadow-lg shadow-primary/20
                transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed
                group
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {t("login_button")}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="w-full">
            <button
              type="button"
              onClick={() => {
                const apiUrl =
                  import.meta.env.VITE_API_URL || "http://localhost:3001";
                window.location.href = `${apiUrl}/api/auth/google`;
              }}
              className="
                w-full flex items-center justify-center gap-3
                py-3 px-4 rounded-xl
                border-2 border-gray-100 bg-gray-50
                text-gray-700 font-medium
                hover:bg-gray-100 hover:border-gray-200 transition-all
              "
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-600">
            {t("dont_have_account")}{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {t("signup_link")}
            </Link>
          </p>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Secure Login</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="text-sm">256-bit SSL</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
