import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import { motion } from "framer-motion";
import {
  Store,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Logo from "../../assets/Logo.png";
import useAuth from "../../store/authStore";

const GoogleRoleSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingToken = searchParams.get("token");

  const { setAccessToken, setRefreshToken, setUser, setIsAuthenticated } =
    useAuth();

  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Decode the pending token to show user info (display only)
  const profile = useMemo(() => {
    if (!pendingToken) return null;
    try {
      const payload = JSON.parse(atob(pendingToken.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  }, [pendingToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !pendingToken) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/auth/google/complete", {
        token: pendingToken,
        role,
      });

      const { accessToken, refreshToken, user } = response.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      setIsAuthenticated(true);

      if (user?.role === "seller") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.error;
      if (msg) {
        setError(msg);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!pendingToken) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Invalid Request
          </h2>
          <p className="text-gray-500 mb-6">
            This page requires a valid Google signup token.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center py-3 px-6 rounded-xl font-medium text-white bg-[#d86f19] hover:bg-[#c0610f] transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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

            {/* Google profile info */}
            {profile?.avatar && (
              <img
                src={profile.avatar}
                alt=""
                className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-100"
                referrerPolicy="no-referrer"
              />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Welcome, {profile?.firstName || profile?.username || ""}!
            </h1>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
            <p className="text-gray-500 mt-3">
              Choose how you want to use Maker DZ
            </p>
          </div>

          {/* Error */}
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-8">
              {/* Customer */}
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    role === "customer"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${role === "customer" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${role === "customer" ? "text-primary" : "text-gray-900"}`}
                    >
                      Customer
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Browse and buy unique products
                    </p>
                  </div>
                  {role === "customer" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>

              {/* Seller */}
              <button
                type="button"
                onClick={() => setRole("seller")}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    role === "seller"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${role === "seller" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${role === "seller" ? "text-primary" : "text-gray-900"}`}
                    >
                      Seller
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Sell your products to customers
                    </p>
                  </div>
                  {role === "seller" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
            </div>

            <Button
              type="submit"
              disabled={!role || isLoading}
              className="w-full h-12 rounded-xl font-semibold text-base bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GoogleRoleSelect;
