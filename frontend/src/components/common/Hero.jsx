import React from "react";
import HeroImage from "../../assets/HeroImage.png";
import HeroImage2 from "../../assets/heroImage2.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowRight } from "lucide-react";
import { subCategories } from "../CategotyLIst/consts.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../store/authStore";

const Hero = () => {
  const { t, i18n } = useTranslation("hero");
  const isRTL = i18n.language === "ar";
  const { isAuthenticated } = useAuth();
  return (
    <div className="w-full flex flex-col lg:flex-row items-start gap-6 lg:gap-12 mt-6">
      {/* Sidebar Categories */}
      <div className="hidden lg:block lg:w-1/5">
        <h1 className="font-semibold text-2xl mb-4 text-center lg:text-left">
          {t("categories")}
        </h1>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {Object.entries(subCategories).map(([category, items], index) => (
            <AccordionItem key={category} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium">
                {category}
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-2">
                {items.length > 0 ? (
                  items.map((sub, idx) => (
                    <Link
                      to={`products/categories/${sub}`}
                      key={idx}
                      className="w-full text-sm md:text-base hover:underline cursor-pointer text-gray-700 dark:text-gray-300"
                    >
                      {sub}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">{t("no_items")}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Hero Carousel */}

      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={50}
        dir={isRTL ? "rtl" : "ltr"}
        autoplay
        className="!overflow-hidden !w-full"
      >
        <SwiperSlide>
          <div className="relative flex items-center px-4 sm:px-6 md:px-8 lg:px-12 w-full h-[20vh] sm:h-[70vh] md:h-[80vh] bg-primary">
            <div className="z-20 text-white max-w-4xl">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl ${isRTL ? "font-rubik" : "!font-hero"} mb-3 sm:mb-4 leading-tight`}>
                {t("title1")}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
                {t("subtitle1")}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 cursor-pointer hover:text-secondary duration-200">
                  <p className="text-base sm:text-lg md:text-xl underline font-medium">
                    {t("shop_now")}
                  </p>
                  <ArrowRight size={20} className="sm:w-6 sm:h-6" color="white" />
                </div>
                {!isAuthenticated && (
                  <Link
                    to="/signup"
                    className="bg-white text-primary font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md text-sm sm:text-base hover:bg-secondary hover:text-white transition-colors duration-200"
                  >
                    {t("join_as_artisan")}
                  </Link>
                )}
              </div>
            </div>
            <img
              src={HeroImage}
              alt="hero"
              className="absolute h-full w-full inset-0 object-cover"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative flex items-center px-4 sm:px-6 md:px-8 lg:px-12 w-full h-[20vh] sm:h-[70vh] md:h-[80vh] bg-primary">
            <div className="z-20 text-white max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4 leading-tight">
                {t("title2")}
              </h1>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 cursor-pointer hover:text-secondary duration-200">
                  <p className="text-base sm:text-lg md:text-xl underline font-medium">
                    {t("shop_now")}
                  </p>
                  <ArrowRight size={20} className="sm:w-6 sm:h-6" color="white" />
                </div>
                {!isAuthenticated && (
                  <Link
                    to="/signup"
                    className="bg-white text-primary font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-md text-sm sm:text-base hover:bg-secondary hover:text-white transition-colors duration-200"
                  >
                    {t("join_as_artisan")}
                  </Link>
                )}
              </div>
            </div>
            <img
              src={HeroImage2}
              alt="hero"
              className="absolute h-full w-full inset-0 object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hero;
