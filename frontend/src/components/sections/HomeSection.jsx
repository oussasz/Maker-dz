import React, { useRef } from "react";
import IconButton from "../ui/icon-button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Swiper } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomeSection = ({
  children,
  title,
  subtitle,
  swipable = false,
  containerClasses = "",
  viewAllLink,
  viewAll = true,
  rtl = false,
}) => {
  const swiperRef = useRef(null);
  const { t, i18n } = useTranslation("homesection");
  const isRTL = i18n.language === "ar";

  const swipeNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const swipePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="w-full">
      {/* Title Section */}
      <div
        className={`flex w-full items-center gap-3 sm:gap-4 mb-4 sm:mb-5 ${rtl ? "flex-row-reverse" : ""}`}>
        <div className="w-3 h-6 sm:w-5 sm:h-10 bg-primary rounded-md" />
        <h2 className="text-primary font-semibold text-lg sm:text-xl md:text-2xl">
          {title}
        </h2>
      </div>

      {/* Subtitle + Controls */}
      <div
        className={`w-full flex sm:items-center sm:justify-between mb-6 sm:mb-10 gap-4 sm:gap-0 ${rtl ? "flex-row-reverse" : "flex-col sm:flex-row"}`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
          {subtitle}
        </h1>

        {swipable ? (
          <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
            {isRTL ? (
              <>
                <IconButton icon={<ArrowRight />} onClick={swipeNext} />
                <IconButton icon={<ArrowLeft />} onClick={swipePrev} />
              </>
            ) : (
              <>
                <IconButton icon={<ArrowLeft />} onClick={swipePrev} />
                <IconButton icon={<ArrowRight />} onClick={swipeNext} />
              </>
            )}
          </div>
        ) : (
          viewAll && (
            <Link
              to={viewAllLink}
              className="text-white font-medium py-2 px-6 sm:py-3 sm:px-10 md:py-4 md:px-12 bg-primary rounded-md text-sm sm:text-base md:text-lg text-center">
              {t("view_all")}
            </Link>
          )
        )}
      </div>

      {/* Content */}
      {swipable ? (
        <Swiper
          ref={swiperRef}
          slidesPerView={5}
          spaceBetween={30}
          dir={isRTL ? "rtl" : "ltr"}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}>
          {children}
        </Swiper>
      ) : (
        <div className={`${containerClasses} w-full`}>{children}</div>
      )}
    </div>
  );
};

export default HomeSection;
