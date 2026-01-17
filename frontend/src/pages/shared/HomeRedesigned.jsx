import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGeneralStore } from "../../store/globalGeneralStore";
import axios from "../../api/axios";
import ProductCard from "../../components/product/ProductCard";
import {
  ArrowRight,
  Heart,
  MapPin,
  Star,
  Sparkles,
  HandHeart,
  Home as HomeIcon,
  Package,
  Shield,
  Truck,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  Globe,
  Users,
  Award,
} from "lucide-react";

// ============================================
// HERO SECTION - Emotional Storytelling
// ============================================
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation("home");

  const heroContent = [
    {
      title: t("hero_title_1"),
      titleHighlight: t("hero_highlight_1"),
      subtitle: t("hero_subtitle_1"),
      image: "/handcraft.webp",
      cta: t("hero_cta_1"),
    },
    {
      title: t("hero_title_2"),
      titleHighlight: t("hero_highlight_2"),
      subtitle: t("hero_subtitle_2"),
      image: "/artizanal.webp",
      cta: t("hero_cta_2"),
    },
    {
      title: t("hero_title_3"),
      titleHighlight: t("hero_highlight_3"),
      subtitle: t("hero_subtitle_3"),
      image: "/artisant.webp",
      cta: t("hero_cta_3"),
    },
  ];

  useEffect(() => {
    // Preload images for smoother transitions
    heroContent.forEach((content) => {
      const img = new Image();
      img.src = content.image;
    });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100vh] min-h-[700px] w-full overflow-hidden -mt-20">
      {/* Background Images with Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.05, opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroContent[currentSlide].image}
            alt={heroContent[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover"
            // Start loading the first image immediately with high priority
            fetchPriority={currentSlide === 0 ? "high" : "auto"}
            loading={currentSlide === 0 ? "eager" : "lazy"}
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Pattern Overlay - Algerian Geometric */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t("hero_badge")}</span>
            </motion.div>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
                  {heroContent[currentSlide].title}
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    {heroContent[currentSlide].titleHighlight}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-2xl">
                  {heroContent[currentSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-full flex items-center gap-3 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
                >
                  {heroContent[currentSlide].cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-colors flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                {t("watch_story")}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "w-12 bg-gradient-to-r from-amber-400 to-orange-500"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-sm tracking-widest uppercase rotate-90 origin-center translate-x-6">
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

// ============================================
// STORY SECTION - The "Why" Behind Maker
// ============================================
const StorySection = () => {
  const { t } = useTranslation("home");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 bg-gradient-to-b from-stone-50 to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Composition */}
          <div className="relative">
            <motion.div style={{ y }} className="relative z-10">
              <div className="relative">
                {/* Main Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src="png-transparent-algerian-zellige-mosaic-pattern-illustration.png"
                    alt="Algerian artisan at work"
                    className="w-full h-[500px] object-cover"
                  />
                </motion.div>

                {/* Floating Card */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-8 -right-8 md:right-8 bg-white rounded-2xl p-6 shadow-xl max-w-[280px]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <HandHeart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {t("story_card_number")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("story_card_label")}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("story_card_desc")}
                  </p>
                </motion.div>

                {/* Decorative Element */}
                <div className="absolute -top-6 -left-6 w-24 h-24 border-4 border-amber-400/30 rounded-2xl" />
              </div>
            </motion.div>

            {/* Background Pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <pattern
                  id="moroccan"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M20 0L40 20L20 40L0 20z"
                    fill="currentColor"
                    className="text-amber-600"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#moroccan)" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
              {t("story_badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t("story_title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                {t("story_title_highlight")}
              </span>{" "}
              {t("story_title_end")}
            </h2>
            <div className="space-y-5 text-lg text-gray-600 leading-relaxed">
              <p>{t("story_para1")}</p>
              <p>
                <strong className="text-gray-900">
                  {t("story_para2_bold")}
                </strong>{" "}
                {t("story_para2")}
              </p>
              <p>{t("story_para3")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-200">
              {[
                { number: t("story_stat1"), label: t("story_stat1_label") },
                { number: t("story_stat2"), label: t("story_stat2_label") },
                { number: t("story_stat3"), label: t("story_stat3_label") },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// CRAFT CATEGORIES - Visual Craft Showcase
// ============================================
const craftCategories = [
  {
    id: 1,
    name: "Pottery & Ceramics",
    nameAr: "الفخار والسيراميك",
    description: "Traditional clay work from Kabylie and beyond",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
    color: "from-amber-600 to-orange-700",
    items: 245,
  },
  {
    id: 2,
    name: "Textiles & Weaving",
    nameAr: "المنسوجات والنسيج",
    description: "Handwoven carpets, blankets, and traditional fabrics",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    color: "from-red-600 to-rose-700",
    items: 189,
  },
  {
    id: 3,
    name: "Jewelry & Silver",
    nameAr: "المجوهرات والفضة",
    description: "Berber silver, traditional Kabyle pieces",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    color: "from-slate-600 to-zinc-700",
    items: 156,
  },
  {
    id: 4,
    name: "Leather Goods",
    nameAr: "المنتجات الجلدية",
    description: "Handcrafted bags, shoes, and accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    color: "from-amber-700 to-yellow-800",
    items: 134,
  },
  {
    id: 5,
    name: "Woodwork & Carving",
    nameAr: "الأعمال الخشبية",
    description: "Intricate wooden art and furniture",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80",
    color: "from-stone-600 to-stone-800",
    items: 98,
  },
  {
    id: 6,
    name: "Traditional Dress",
    nameAr: "الأزياء التقليدية",
    description: "Karakou, Chedda, and regional costumes",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    color: "from-emerald-600 to-teal-700",
    items: 167,
  },
];

const CraftCategoriesSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  const craftCategories = [
    {
      id: 1,
      name: "Pottery & Ceramics",
      nameTranslated: t("category_pottery"),
      description: t("category_pottery_desc"),
      image:
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
      color: "from-amber-600 to-orange-700",
      items: 245,
    },
    {
      id: 2,
      name: "Textiles & Weaving",
      nameTranslated: t("category_textiles"),
      description: t("category_textiles_desc"),
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      color: "from-red-600 to-rose-700",
      items: 189,
    },
    {
      id: 3,
      name: "Jewelry & Silver",
      nameTranslated: t("category_jewelry"),
      description: t("category_jewelry_desc"),
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      color: "from-slate-600 to-zinc-700",
      items: 156,
    },
    {
      id: 4,
      name: "Leather Goods",
      nameTranslated: t("category_leather"),
      description: t("category_leather_desc"),
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      color: "from-amber-700 to-yellow-800",
      items: 134,
    },
    {
      id: 5,
      name: "Woodwork & Carving",
      nameTranslated: t("category_woodwork"),
      description: t("category_woodwork_desc"),
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80",
      color: "from-stone-600 to-stone-800",
      items: 98,
    },
    {
      id: 6,
      name: "Traditional Dress",
      nameTranslated: t("category_dress"),
      description: t("category_dress_desc"),
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      color: "from-emerald-600 to-teal-700",
      items: 167,
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            {t("categories_badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("categories_title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              {t("categories_title_highlight")}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("categories_subtitle")}
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {craftCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/products/categories/${category.name}`)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity`}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                  <h3 className="text-2xl font-bold mb-2">
                    {category.nameTranslated}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">
                      {category.items} {t("items")}
                    </span>
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FEATURED PRODUCTS - Curated Selection
// ============================================
const FeaturedProductsSection = ({ products }) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const { t } = useTranslation("home");

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
              {t("products_badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t("products_title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                {t("products_title_highlight")}
              </span>
            </h2>
          </div>
          <Link
            to="/products"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
          >
            {t("products_browse_all")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {safeProducts.slice(0, 8).map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// JOIN AS SELLER - Craftsmen Registration CTA
// ============================================
const JoinAsSellerSection = () => {
  const { t } = useTranslation("home");

  const benefits = [
    {
      icon: "🏪",
      title: t("benefit1_title"),
      description: t("benefit1_desc"),
    },
    {
      icon: "🌍",
      title: t("benefit2_title"),
      description: t("benefit2_desc"),
    },
    {
      icon: "💰",
      title: t("benefit3_title"),
      description: t("benefit3_desc"),
    },
    {
      icon: "📦",
      title: t("benefit4_title"),
      description: t("benefit4_desc"),
    },
    {
      icon: "🛡️",
      title: t("benefit5_title"),
      description: t("benefit5_desc"),
    },
    {
      icon: "📈",
      title: t("benefit6_title"),
      description: t("benefit6_desc"),
    },
  ];
  return (
    <section className="py-24 md:py-32 bg-gray-900 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 rounded-full text-sm font-medium mb-4 border border-amber-500/30">
            {t("seller_badge")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("seller_title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              {t("seller_title_highlight")}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t("seller_subtitle")}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group"
            >
              <span className="text-4xl mb-4 block">{benefit.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t("seller_cta_badge")}
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("seller_cta_title")}
            </h3>
            <p className="text-gray-300 text-lg mb-8">
              {t("seller_cta_subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 w-full sm:w-auto"
                >
                  {t("seller_cta_start")}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  {t("seller_cta_learn")}
                </motion.button>
              </Link>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              {t("seller_cta_footer")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// TRUST & SHIPPING - Confidence Builders
// ============================================
const TrustSection = () => {
  const { t } = useTranslation("home");

  const features = [
    {
      icon: Globe,
      title: t("trust_worldwide"),
      description: t("trust_worldwide_desc"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: t("trust_verified"),
      description: t("trust_verified_desc"),
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: HandHeart,
      title: t("trust_direct"),
      description: t("trust_direct_desc"),
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Award,
      title: t("trust_secure"),
      description: t("trust_secure_desc"),
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION - Final Push
// ============================================
const CTASection = () => {
  const { t } = useTranslation("home");

  return (
    <section className="py-24 md:py-32 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="cta-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="8" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t("cta_title")}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t("cta_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-white text-orange-600 font-bold rounded-full shadow-2xl hover:shadow-white/30 transition-shadow flex items-center gap-3 justify-center"
              >
                {t("cta_shop")}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white/10 transition-colors"
              >
                {t("cta_artisan")}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// MAIN HOME COMPONENT
// ============================================
const Home = () => {
  const { products, setProducts } = useGeneralStore();
  const { t } = useTranslation("home");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/products");
        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="overflow-hidden">
      <HeroSection />
      <StorySection />
      <CraftCategoriesSection />
      <FeaturedProductsSection products={products} />
      <JoinAsSellerSection />
      <TrustSection />
      <CTASection />
    </main>
  );
};

export default Home;
