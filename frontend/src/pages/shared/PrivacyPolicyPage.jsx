import React from "react";
import { motion } from "framer-motion";
import { Shield, Calendar } from "lucide-react";

const PrivacyPolicyPage = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
      
• Name and contact information (email address, phone number, shipping address)
• Payment information (processed securely through our payment providers)
• Order history and preferences
• Communications with us
• Profile information if you're a seller`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:

• Process your orders and payments
• Send order confirmations and shipping updates
• Respond to your questions and provide customer support
• Personalize your shopping experience
• Send promotional communications (with your consent)
• Prevent fraud and ensure platform security
• Comply with legal obligations`,
    },
    {
      title: "Information Sharing",
      content: `We share your information only in the following circumstances:

• With sellers to fulfill your orders (shipping address and order details)
• With payment processors to complete transactions
• With shipping carriers to deliver your orders
• With service providers who assist our operations
• When required by law or to protect our rights
• In connection with a merger or acquisition

We never sell your personal information to third parties for marketing purposes.`,
    },
    {
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information, including:

• SSL encryption for all data transmission
• Secure payment processing through PCI-compliant providers
• Regular security assessments and updates
• Limited access to personal data on a need-to-know basis
• Secure data storage with industry-standard protections`,
    },
    {
      title: "Your Rights",
      content: `You have the right to:

• Access the personal information we hold about you
• Correct inaccurate or incomplete information
• Request deletion of your personal information
• Opt out of marketing communications
• Request a copy of your data in a portable format

To exercise these rights, please contact us at privacy@makerdz.com.`,
    },
    {
      title: "Cookies and Tracking",
      content: `We use cookies and similar technologies to:

• Keep you logged in to your account
• Remember your preferences
• Analyze how you use our platform
• Provide personalized content and ads

You can manage cookie preferences through your browser settings. See our Cookie Policy for more details.`,
    },
    {
      title: "International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.`,
    },
    {
      title: "Children's Privacy",
      content: `Maker DZ is not intended for children under 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.`,
    },
    {
      title: "Contact Us",
      content: `If you have questions about this Privacy Policy or our privacy practices, please contact us at:

Email: privacy@makerdz.com
Address: Algiers, Algeria

We will respond to your inquiry within 30 days.`,
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
            <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-gray-600 mb-12"
          >
            At Maker DZ, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our platform.
          </motion.p>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {index + 1}. {section.title}
                </h2>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
