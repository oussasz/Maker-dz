import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import Logo from "../../assets/Logo.png";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token provided.");
      return;
    }

    const verify = async () => {
      try {
        await axios.get(`/verify-email/${token}`);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrorMsg(
          err.response?.data?.error || "Verification failed. Please try again.",
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img src={Logo} alt="Maker DZ" className="h-12" />
            </Link>
          </div>

          {status === "loading" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-[#d86f19] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-500">Please wait a moment.</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-500 mb-6">
                Your email has been verified successfully. You can now log in to
                your account.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-medium text-white bg-[#d86f19] hover:bg-[#c0610f] transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-500 mb-6">{errorMsg}</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl font-medium text-white bg-[#d86f19] hover:bg-[#c0610f] transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
