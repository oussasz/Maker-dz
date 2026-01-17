import React from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  Calendar,
  Eye,
  Keyboard,
  MousePointer2,
  Volume2,
  Mail,
} from "lucide-react";

const AccessibilityPage = () => {
  const lastUpdated = "January 15, 2025";

  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description:
        "Our platform can be navigated entirely using a keyboard. All interactive elements are accessible via Tab, Enter, and arrow keys.",
    },
    {
      icon: Eye,
      title: "Screen Reader Support",
      description:
        "We use semantic HTML and ARIA labels to ensure compatibility with screen readers like NVDA, JAWS, and VoiceOver.",
    },
    {
      icon: MousePointer2,
      title: "Focus Indicators",
      description:
        "Clear visual focus indicators help you track where you are on the page when navigating with keyboard or assistive technology.",
    },
    {
      icon: Volume2,
      title: "Text Alternatives",
      description:
        "All images have descriptive alt text, and videos include captions when available.",
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
            <Accessibility className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
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
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Commitment
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              At Maker DZ, we are committed to ensuring that our platform is
              accessible to everyone, including people with disabilities. We
              strive to meet Web Content Accessibility Guidelines (WCAG) 2.1
              Level AA standards and continuously work to improve the
              accessibility of our website and mobile applications.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Accessibility Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Text Size and Contrast
              </h2>
              <p className="text-gray-600">
                You can adjust text size using your browser's zoom functionality
                (Ctrl/Cmd + or -). We maintain sufficient color contrast ratios
                throughout our platform to ensure readability for users with low
                vision or color blindness.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Responsive Design
              </h2>
              <p className="text-gray-600">
                Our platform is fully responsive and works on devices of all
                sizes. Content reflows appropriately whether you're using a
                desktop, tablet, or mobile device, and supports text scaling up
                to 200% without loss of functionality.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ongoing Improvements
              </h2>
              <p className="text-gray-600 mb-4">
                We regularly audit our platform for accessibility issues and are
                committed to addressing them promptly. Our development team
                follows accessibility best practices and tests with assistive
                technologies.
              </p>
              <p className="text-gray-600">
                Current accessibility initiatives include:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Regular automated and manual accessibility testing</li>
                <li>User testing with people who use assistive technologies</li>
                <li>Training for our team on accessible design practices</li>
                <li>Continuous improvement based on user feedback</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Known Limitations
              </h2>
              <p className="text-gray-600">
                While we strive for full accessibility, some third-party content
                or features may not be fully accessible. We are working with our
                partners to improve these areas. If you encounter any barriers,
                please let us know.
              </p>
            </div>
          </motion.div>

          {/* Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-amber-50 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Feedback & Assistance
                </h2>
                <p className="text-gray-600 mb-4">
                  We welcome your feedback on the accessibility of Maker DZ. If
                  you encounter any barriers or have suggestions for
                  improvement, please contact us:
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:accessibility@makerdz.com"
                      className="text-primary hover:underline"
                    >
                      accessibility@makerdz.com
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> +213 555 123 456
                  </li>
                  <li>
                    <strong>Response time:</strong> We aim to respond within 2
                    business days
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AccessibilityPage;
