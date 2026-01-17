import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Heart,
  Target,
  Lightbulb,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const OurStoryPage = () => {
  const timeline = [
    {
      year: "2024",
      title: "The Idea",
      description:
        "A group of Algerians living abroad realized how difficult it was to find authentic handmade items from home.",
    },
    {
      year: "2025",
      title: "Research & Planning",
      description:
        "We traveled across Algeria, meeting artisans and understanding their challenges in reaching global markets.",
    },
    {
      year: "2026",
      title: "Launch",
      description:
        "Maker DZ officially launched, creating a bridge between Algerian artisans and customers worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              <Clock className="w-4 h-4" />
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              From a Simple Idea to a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Movement
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The story of how Maker DZ came to be—and why we believe in the
              power of handmade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-amber-500" />
              Where It All Began
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              It started with a conversation between friends—Algerians scattered
              across Europe and North America, all missing the same thing: the
              textures, colors, and craftsmanship of home.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              One friend recalled her grandmother's hand-woven blankets. Another
              missed the distinctive pottery from his hometown. We all shared
              stories of searching online for authentic Algerian crafts, only to
              find mass-produced imitations or exorbitant shipping costs.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              That's when the idea for Maker DZ was born: What if we could
              create a platform where artisans could sell directly to customers
              worldwide? Where every purchase supports a real family and
              preserves centuries of tradition?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          >
            Our Journey
          </motion.h2>

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Target className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Vision for the Future
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We envision a world where every Algerian artisan has the
              opportunity to share their craft globally, earning fair income
              while preserving traditions that have been passed down for
              generations.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Join Our Mission
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
