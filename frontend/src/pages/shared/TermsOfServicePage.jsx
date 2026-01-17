import React from "react";
import { motion } from "framer-motion";
import { FileText, Calendar } from "lucide-react";

const TermsOfServicePage = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using Maker DZ, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.

These terms apply to all users of the platform, including buyers, sellers, and visitors.`,
    },
    {
      title: "Account Registration",
      content: `To make purchases or sell on Maker DZ, you must create an account. You agree to:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized use
• Be at least 18 years old or have parental consent

You are responsible for all activities that occur under your account.`,
    },
    {
      title: "Buyer Terms",
      content: `As a buyer on Maker DZ, you agree to:

• Pay for all items you purchase, including shipping costs
• Provide accurate shipping information
• Accept delivery of purchased items
• Report any issues within 14 days of delivery
• Leave honest and fair reviews of your purchases

All sales are between you and the individual seller. Maker DZ facilitates the transaction but is not the seller of the items.`,
    },
    {
      title: "Seller Terms",
      content: `As a seller on Maker DZ, you agree to:

• Only list authentic, handmade products that you create
• Provide accurate descriptions and images of your products
• Ship items within the stated processing time
• Respond to buyer inquiries in a timely manner
• Comply with all applicable laws and regulations
• Pay applicable fees and commissions to Maker DZ
• Accept returns in accordance with our return policy

Maker DZ reserves the right to remove listings or suspend accounts that violate these terms.`,
    },
    {
      title: "Prohibited Activities",
      content: `You may not:

• Violate any laws or regulations
• Infringe on intellectual property rights
• Post false, misleading, or defamatory content
• Manipulate reviews or ratings
• Attempt to circumvent platform fees
• Engage in harassment or discrimination
• Use the platform for money laundering or fraud
• Interfere with the platform's operation`,
    },
    {
      title: "Fees and Payments",
      content: `Maker DZ charges sellers a commission on each sale. The current fee structure is displayed in the seller dashboard.

Payment processing is handled by third-party providers. By using our platform, you agree to their terms of service.

Seller payouts are processed according to our payment schedule after buyers confirm receipt of their orders.`,
    },
    {
      title: "Intellectual Property",
      content: `All content on Maker DZ, including logos, text, and graphics, is owned by Maker DZ or its licensors and is protected by intellectual property laws.

Sellers retain ownership of their product images and descriptions but grant Maker DZ a license to use them for platform operations and marketing.`,
    },
    {
      title: "Dispute Resolution",
      content: `We encourage buyers and sellers to resolve disputes directly. If you cannot reach a resolution:

• Contact Maker DZ support within 14 days
• Provide all relevant documentation
• Allow up to 10 business days for review
• Accept our decision as final for platform disputes

For issues not resolved through our process, disputes will be governed by the laws of Algeria.`,
    },
    {
      title: "Limitation of Liability",
      content: `Maker DZ provides the platform "as is" without warranties of any kind. We are not liable for:

• Actions of buyers or sellers
• Quality or authenticity of products (though we verify sellers)
• Shipping delays or losses
• Indirect or consequential damages

Our liability is limited to the fees you paid to Maker DZ in the 12 months preceding the claim.`,
    },
    {
      title: "Termination",
      content: `You may close your account at any time by contacting support. We may suspend or terminate accounts that violate these terms.

Upon termination:
• Outstanding orders must be completed
• Seller balances will be paid according to our schedule
• Your content may be retained for legal purposes`,
    },
    {
      title: "Changes to Terms",
      content: `We may modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of material changes via email or platform notification.`,
    },
    {
      title: "Contact Information",
      content: `For questions about these Terms of Service, contact us at:

Email: legal@makerdz.com
Address: Algiers, Algeria`,
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
            <FileText className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
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
            Welcome to Maker DZ. These Terms of Service govern your use of our
            platform and constitute a legally binding agreement between you and
            Maker DZ.
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

export default TermsOfServicePage;
