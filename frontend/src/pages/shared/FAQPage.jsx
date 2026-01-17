import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  ShoppingBag,
  Truck,
  CreditCard,
  RotateCcw,
  Shield,
  Users,
} from "lucide-react";
import { Input } from "../../components/ui/input";

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestion, setOpenQuestion] = useState(null);

  const categories = [
    { id: "general", label: "General", icon: HelpCircle },
    { id: "ordering", label: "Ordering", icon: ShoppingBag },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "returns", label: "Returns", icon: RotateCcw },
    { id: "sellers", label: "For Sellers", icon: Users },
  ];

  const faqs = {
    general: [
      {
        question: "What is Maker DZ?",
        answer:
          "Maker DZ is an online marketplace connecting talented Algerian artisans with customers worldwide. We offer authentic, handcrafted products including pottery, textiles, jewelry, and more.",
      },
      {
        question: "Are all products handmade?",
        answer:
          "Yes! Every product on Maker DZ is handcrafted by skilled Algerian artisans. We verify all sellers and their craftsmanship before they can list products on our platform.",
      },
      {
        question: "How do I contact customer support?",
        answer:
          "You can reach us via email at contact@makerdz.com, call us at +213 555 123 456, or use the contact form on our website. We typically respond within 24-48 hours.",
      },
    ],
    ordering: [
      {
        question: "How do I place an order?",
        answer:
          "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase.",
      },
      {
        question: "Can I modify my order after placing it?",
        answer:
          "You can request modifications within 24 hours of placing your order by contacting our support team. After that, the artisan may have already started working on your item.",
      },
      {
        question: "Do you offer custom orders?",
        answer:
          "Many of our artisans accept custom orders. Look for the 'Custom Order' option on product pages, or contact the seller directly through their profile.",
      },
    ],
    shipping: [
      {
        question: "Where do you ship to?",
        answer:
          "We ship worldwide! Shipping times and costs vary depending on your location. You'll see the exact shipping cost at checkout before completing your purchase.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Domestic (Algeria): 3-7 business days. Europe: 7-14 business days. North America: 10-21 business days. Other regions: 14-28 business days.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive an email with a tracking number. You can also track your order in your account dashboard.",
      },
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept Visa, MasterCard, CIB (Carte Interbancaire), and Edahabia. We're working on adding more payment options soon.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard SSL encryption and never store your full card details. All payments are processed through secure, PCI-compliant payment processors.",
      },
      {
        question: "Can I pay in my local currency?",
        answer:
          "Prices are displayed in Algerian Dinar (DZD), but we also show approximate conversions. Your bank will convert the charge to your local currency.",
      },
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 14-day return policy for items in original condition. Custom-made items are non-returnable unless they arrive damaged or defective.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Contact our support team with your order number and reason for return. We'll provide you with return instructions and a shipping label if applicable.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Once we receive your returned item, refunds are processed within 5-7 business days. The time it takes to appear in your account depends on your bank.",
      },
    ],
    sellers: [
      {
        question: "How do I become a seller on Maker DZ?",
        answer:
          "Click 'Become a Seller' and complete the application form. We'll review your craftsmanship and get back to you within 3-5 business days.",
      },
      {
        question: "What fees does Maker DZ charge?",
        answer:
          "We charge a small commission on each sale to cover platform maintenance and payment processing. There are no monthly fees or listing fees.",
      },
      {
        question: "How do I get paid?",
        answer:
          "Payments are released to your account after the buyer confirms receipt of their order. You can withdraw funds to your bank account at any time.",
      },
    ],
  };

  const filteredFAQs = searchTerm
    ? Object.values(faqs)
        .flat()
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : faqs[activeCategory];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers to common questions about Maker DZ
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {!searchTerm && (
        <section className="py-8 px-4 border-b bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-white text-gray-600 hover:bg-gray-100 border"
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {searchTerm && (
            <p className="text-gray-600 mb-6">
              {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""}{" "}
              for "{searchTerm}"
            </p>
          )}

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenQuestion(openQuestion === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openQuestion === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openQuestion === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No results found. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <a href="/contact">
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-colors">
              Contact Support
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
