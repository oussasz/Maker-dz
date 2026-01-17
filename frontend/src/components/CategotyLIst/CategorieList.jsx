import DropList from "../DropList/DropList";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { categoryList, subCategories } from "./consts.jsx";
import "./CategorieList.css";

const CategorieList = () => {
  const breakpoints = {
    320: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    480: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 30,
    },
  };

  return (
    <>
      <div className="w-full p-3">
        <Swiper
          navigation={true}
          breakpoints={breakpoints}
          modules={[Navigation]}
        >
            {categoryList.map((category) => {
              return (
                <SwiperSlide style={{ width: "auto" }} key={category}>
                  <DropList
                    key={category}
                    title={category}
                    items={subCategories[category]}
                  />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </>
  );
};
export default CategorieList;
