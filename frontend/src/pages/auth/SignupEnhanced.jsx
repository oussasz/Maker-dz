import React, { useState, useCallback, useMemo } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
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
  User,
  Store,
  ShoppingBag,
  Check,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import Logo from "../../assets/Logo.png";

// Password strength calculator
const calculatePasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
};

const getPasswordStrengthLabel = (score) => {
  if (score <= 1)
    return { label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
  if (score <= 2)
    return {
      label: "Fair",
      color: "bg-orange-500",
      textColor: "text-orange-500",
    };
  if (score <= 3)
    return {
      label: "Good",
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
    };
  if (score <= 4)
    return {
      label: "Strong",
      color: "bg-green-500",
      textColor: "text-green-500",
    };
  return {
    label: "Very Strong",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
  };
};

// Password requirement component
const PasswordRequirement = ({ met, text }) => (
  <div
    className={`flex items-center gap-2 text-sm ${met ? "text-green-600" : "text-gray-400"}`}
  >
    {met ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4" />
    )}
    {text}
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form

  const { t, i18n } = useTranslation("signup");
  const isRTL = i18n.language === "ar";

  const { username, email, password, confirmPassword, role } = formData;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  // Password validation
  const passwordChecks = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    }),
    [password]
  );

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password]
  );
  const strengthInfo = useMemo(
    () => getPasswordStrengthLabel(passwordStrength),
    [passwordStrength]
  );

  const isStep1Valid = username.length >= 3 && validateEmail(email);
  const isStep2Valid =
    password.length >= 8 && password === confirmPassword && role !== "";
  const isFormValid = isStep1Valid && isStep2Valid && acceptedTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        navigate("/login", {
          state: { message: "Account created successfully! Please log in." },
        });
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setError(
          error.response.data.message || "Username or email already exists"
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Role selection cards
  const RoleCard = ({
    roleType,
    icon: Icon,
    title,
    description,
    selected,
    onClick,
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
        ${
          selected
            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${selected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p
            className={`font-semibold ${selected ? "text-primary" : "text-gray-900"}`}
          >
            {title}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        {selected && <CheckCircle2 className="h-5 w-5 text-primary" />}
      </div>
    </button>
  );

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
              {t("create_your_account")}
            </h1>
            <p className="text-gray-500">
              Join our community of makers and shoppers
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all
                  ${
                    step >= s
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-1 rounded-full ${step > 1 ? "bg-primary" : "bg-gray-100"}`}
                  />
                )}
              </React.Fragment>
            ))}
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

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Username Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("username")}
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`}
                    />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => updateField("username", e.target.value)}
                      placeholder="johndoe"
                      required
                      className={`
                        w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-3
                        bg-gray-50 border-2 border-gray-100 rounded-xl
                        text-gray-900 placeholder:text-gray-400
                        focus:outline-none focus:border-primary focus:bg-white
                        transition-all duration-200
                      `}
                    />
                    {username.length >= 3 && (
                      <CheckCircle2
                        className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-green-500`}
                      />
                    )}
                  </div>
                  {username.length > 0 && username.length < 3 && (
                    <p className="text-xs text-orange-500">
                      Username must be at least 3 characters
                    </p>
                  )}
                </div>

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
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="name@example.com"
                      required
                      className={`
                        w-full ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} py-3
                        bg-gray-50 border-2 border-gray-100 rounded-xl
                        text-gray-900 placeholder:text-gray-400
                        focus:outline-none focus:border-primary focus:bg-white
                        transition-all duration-200
                      `}
                    />
                    {email && validateEmail(email) && (
                      <CheckCircle2
                        className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-green-500`}
                      />
                    )}
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="
                    w-full py-6 text-base font-semibold
                    bg-primary hover:bg-primary/90
                    rounded-xl shadow-lg shadow-primary/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    group
                  "
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Password & Role */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => updateField("password", e.target.value)}
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
                      className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2`}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {password && (
                    <div className="space-y-2 mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full ${
                              passwordStrength >= level
                                ? strengthInfo.color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-medium ${strengthInfo.textColor}`}
                      >
                        {strengthInfo.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400`}
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute ${isRTL ? "left-4" : "right-4"} top-1/2 -translate-y-1/2`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("role")}
                  </label>
                  <div className="space-y-3">
                    <RoleCard
                      roleType="customer"
                      icon={ShoppingBag}
                      title={t("customer")}
                      description="Browse and purchase handmade products"
                      selected={role === "customer"}
                      onClick={() => updateField("role", "customer")}
                    />
                    <RoleCard
                      roleType="seller"
                      icon={Store}
                      title={t("seller")}
                      description="Sell your handmade creations"
                      selected={role === "seller"}
                      onClick={() => updateField("role", "seller")}
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 py-6"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className="
                      flex-[2] py-6 text-base font-semibold
                      bg-primary hover:bg-primary/90
                      rounded-xl shadow-lg shadow-primary/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      group
                    "
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        {t("signup_button")}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600">
            {t("already_have_account")}{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {t("login_link")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
