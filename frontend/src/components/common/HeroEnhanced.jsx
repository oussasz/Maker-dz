import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Shield,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { subCategories } from "../CategotyLIst/consts.jsx";
import HeroImage from "../../assets/HeroImage.png";
import HeroImage2 from "../../assets/heroImage2.png";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// Hero Slide Data
const heroSlides = [
  {
    id: 1,
    image: HeroImage,
    titleKey: "title1",
    subtitleKey: "subtitle1",
    badge: "New Collection",
    badgeIcon: Sparkles,
    ctaKey: "shop_now",
    link: "/products",
    gradient: "from-primary/90 via-primary/70 to-transparent",
  },
  {
    id: 2,
    image: HeroImage2,
    titleKey: "title2",
    subtitleKey: "subtitle2",
    badge: "Trending",
    badgeIcon: TrendingUp,
    ctaKey: "explore",
    link: "/products",
    gradient: "from-gray-900/80 via-gray-900/50 to-transparent",
  },
];

// Features Bar Component
const FeaturesBar = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "On orders over 5000 DZD",
    },
    { icon: Shield, title: "Secure Payment", subtitle: "100% Protected" },
    { icon: Sparkles, title: "Handmade Quality", subtitle: "Artisan Crafted" },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center gap-8 py-4 px-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg -mt-8 relative z-20 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <React.Fragment key={feature.title}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {feature.title}
              </p>
              <p className="text-xs text-gray-500">{feature.subtitle}</p>
            </div>
          </div>
          {index < features.length - 1 && (
            <div className="w-px h-8 bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Category Sidebar Component
const CategorySidebar = ({ t }) => (
  <div className="hidden lg:block lg:w-1/5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit sticky top-24">
    <h2 className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
      <span className="w-1 h-6 bg-primary rounded-full" />
      {t("categories")}
    </h2>
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-0"
    >
      {Object.entries(subCategories).map(([category, items], index) => (
        <AccordionItem
          key={category}
          value={`item-${index}`}
          className="border-b border-gray-100 last:border-0"
        >
          <AccordionTrigger className="text-sm font-medium hover:text-primary py-3 transition-colors">
            {category}
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="flex flex-col gap-1.5">
              {items.length > 0 ? (
                items.map((sub, idx) => (
                  <Link
                    to={`products/categories/${sub}`}
                    key={idx}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {sub}
                  </Link>
                ))
              ) : (
                <p className="text-xs text-gray-400 px-3">{t("no_items")}</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

// Main Hero Component
const Hero = () => {
  const { t, i18n } = useTranslation("hero");
  const isRTL = i18n.language === "ar";
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <section className="w-full" aria-label="Hero section">
      <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mt-6">
        {/* Sidebar Categories */}
        <CategorySidebar t={t} />

        {/* Hero Carousel */}
        <div className="w-full lg:w-4/5">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Swiper
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              modules={[Pagination, Autoplay, EffectFade, Navigation]}
              effect="fade"
              slidesPerView={1}
              spaceBetween={0}
              dir={isRTL ? "rtl" : "ltr"}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass:
                  "swiper-pagination-bullet !w-2.5 !h-2.5 !bg-white/50 !opacity-100 transition-all duration-300",
                bulletActiveClass: "!bg-white !w-8 !rounded-full",
              }}
              navigation={{
                prevEl: ".hero-prev",
                nextEl: ".hero-next",
              }}
              className="!overflow-hidden aspect-[21/9] md:aspect-[21/8]"
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <div className="relative w-full h-full">
                    {/* Background Image */}
                    <img
                      src={slide.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
                    />

                    {/* Content */}
                    <div className="relative h-full flex items-center px-6 sm:px-10 lg:px-16">
                      <AnimatePresence mode="wait">
                        {activeIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-2xl text-white"
                          >
                            {/* Badge */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.3 }}
                              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                            >
                              <slide.badgeIcon className="h-4 w-4" />
                              {slide.badge}
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 }}
                              className={`
                                text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                                ${isRTL ? "font-rubik" : "!font-hero"}
                                mb-4 leading-tight font-bold
                              `}
                            >
                              {t(slide.titleKey)}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                              className="text-lg sm:text-xl md:text-2xl font-medium mb-6 text-white/90"
                            >
                              {t(slide.subtitleKey)}
                            </motion.p>

                            {/* CTA Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.6 }}
                            >
                              <Link to={slide.link}>
                                <Button
                                  size="lg"
                                  className="
                                    bg-white text-gray-900 hover:bg-gray-100
                                    px-8 py-6 text-base font-semibold
                                    rounded-full shadow-xl
                                    group transition-all duration-300
                                    hover:shadow-2xl hover:-translate-y-1
                                  "
                                >
                                  {t(slide.ctaKey)}
                                  <ArrowRight
                                    className={`
                                    ml-2 h-5 w-5 transition-transform duration-300
                                    group-hover:translate-x-1
                                    ${isRTL ? "rotate-180" : ""}
                                  `}
                                  />
                                </Button>
                              </Link>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button
              className={`
                hero-prev absolute top-1/2 -translate-y-1/2 z-10
                ${isRTL ? "right-4" : "left-4"}
                w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm
                flex items-center justify-center
                text-white hover:bg-white/30 transition-all duration-200
                opacity-0 group-hover:opacity-100
                hidden md:flex
              `}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              className={`
                hero-next absolute top-1/2 -translate-y-1/2 z-10
                ${isRTL ? "left-4" : "right-4"}
                w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm
                flex items-center justify-center
                text-white hover:bg-white/30 transition-all duration-200
                opacity-0 group-hover:opacity-100
                hidden md:flex
              `}
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperInstance?.slideTo(index)}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${
                      activeIndex === index
                        ? "w-8 bg-white"
                        : "w-1.5 bg-white/50 hover:bg-white/70"
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Features Bar */}
          <FeaturesBar />
        </div>
      </div>
    </section>
  );
};

export default Hero;
