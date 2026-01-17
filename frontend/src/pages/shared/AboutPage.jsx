import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Users,
  Globe,
  Award,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const AboutPage = () => {
  const stats = [
    { value: "500+", label: "Artisans" },
    { value: "2K+", label: "Products" },
    { value: "45+", label: "Countries Served" },
    { value: "10K+", label: "Happy Customers" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description:
        "Every product is genuinely handcrafted by skilled Algerian artisans using traditional techniques.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "We're building a community that celebrates and preserves Algerian heritage and craftsmanship.",
    },
    {
      icon: Globe,
      title: "Connection",
      description:
        "Bridging the gap between artisans and the global diaspora who cherish their roots.",
    },
    {
      icon: Award,
      title: "Quality",
      description:
        "We ensure every item meets high standards of craftsmanship before it reaches you.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              About Maker DZ
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connecting Algerian{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Heritage
              </span>{" "}
              to the World
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're on a mission to preserve and celebrate traditional Algerian
              craftsmanship by connecting talented artisans with customers
              worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Maker DZ was born from a simple observation: millions of
                Algerians living abroad long for authentic pieces that remind
                them of home—the handwoven rugs from Kabylie, the intricate
                pottery from Constantine, the delicate silver jewelry from
                Ghardaïa.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We created a marketplace where artisans can sell directly to
                customers worldwide, earning fair prices for their work while
                preserving crafts that have been passed down for generations.
              </p>
              <Link to="/products">
                <Button className="gap-2">
                  Explore Products
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-900">
                    Made in Algeria
                  </p>
                  <p className="text-gray-600">With love and tradition</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Discover Authentic Algerian Crafts?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Browse our marketplace and find unique handmade treasures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="gap-2">
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 gap-2"
              >
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
