import React from "react";
import { motion } from "framer-motion";
import { Cookie, Calendar, Settings, BarChart, Shield } from "lucide-react";

const CookiePolicyPage = () => {
  const lastUpdated = "January 15, 2025";

  const cookieTypes = [
    {
      icon: Shield,
      name: "Essential Cookies",
      description:
        "Required for the platform to function. They enable basic features like page navigation, secure areas access, and shopping cart functionality.",
      examples: "Session ID, authentication tokens, cart contents",
      canDisable: false,
    },
    {
      icon: Settings,
      name: "Functional Cookies",
      description:
        "Remember your preferences and choices to provide enhanced features and personalization.",
      examples:
        "Language preference, currency selection, recently viewed items",
      canDisable: true,
    },
    {
      icon: BarChart,
      name: "Analytics Cookies",
      description:
        "Help us understand how visitors interact with our platform, allowing us to improve user experience.",
      examples: "Page views, time on site, click patterns",
      canDisable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Cookie className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-gray-300 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Are Cookies?
            </h2>
            <p className="text-gray-600 mb-8">
              Cookies are small text files that are stored on your device when
              you visit a website. They help the website remember your
              preferences and understand how you use the site. Cookies are
              widely used to make websites work more efficiently and provide a
              better browsing experience.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Cookies
            </h2>
            <p className="text-gray-600 mb-8">
              At Maker DZ, we use cookies to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>Keep you signed in to your account</li>
              <li>Remember items in your shopping cart</li>
              <li>Store your language and currency preferences</li>
              <li>Analyze how you use our platform to improve it</li>
              <li>Personalize your shopping experience</li>
            </ul>
          </motion.div>

          {/* Cookie Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              {cookieTypes.map((cookie, index) => (
                <div
                  key={cookie.name}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <cookie.icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {cookie.name}
                        </h3>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            cookie.canDisable
                              ? "bg-gray-200 text-gray-600"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {cookie.canDisable ? "Optional" : "Required"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{cookie.description}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Examples:</span>{" "}
                        {cookie.examples}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Managing Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-gray-600 mb-6">
              You can control and manage cookies in several ways:
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900">Browser Settings</h3>
              <p className="text-gray-600">
                Most browsers allow you to refuse or accept cookies, delete
                existing cookies, and set preferences for certain websites.
                Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </div>

            <p className="text-gray-600 mt-6">
              Please note that disabling certain cookies may affect the
              functionality of our platform. For example, without essential
              cookies, you won't be able to stay logged in or use the shopping
              cart.
            </p>
          </motion.div>

          {/* Third-Party Cookies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-gray-600 mb-6">
              Some cookies on our platform are set by third-party services we
              use. These include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Payment processors</strong> - To securely process
                transactions
              </li>
              <li>
                <strong>Analytics services</strong> - To understand how our
                platform is used
              </li>
              <li>
                <strong>Social media platforms</strong> - If you use social
                login or sharing features
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              These third parties have their own privacy and cookie policies
              which we encourage you to review.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 bg-amber-50 rounded-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2">Questions?</h2>
            <p className="text-gray-600">
              If you have questions about our use of cookies, please contact us
              at{" "}
              <a
                href="mailto:privacy@makerdz.com"
                className="text-primary hover:underline"
              >
                privacy@makerdz.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicyPage;
