import React, { useEffect, useState } from "react";
import Hero from "../../components/common/Hero";
import Popular from "../../components/common/Popular";
import { GridContainer } from "../../components/ui/index";
import ProductCard from "../../components/product/ProductCard";
import axios from "../../api/axios";
import { categories } from "../../components/CategotyLIst/consts.jsx";
import CategoryCard from "../../components/CategoryCard";
import { SwiperSlide } from "swiper/react";
import { useGeneralStore } from "../../store/globalGeneralStore";
import HomeSection from "../../components/sections/HomeSection";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { products, setProducts } = useGeneralStore();
  const { t } = useTranslation("home");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/products");
        console.log("response: ", response.data.products);
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

  // Ensure products is always an array before slicing
  const safeProducts = Array.isArray(products) ? products : [];
  console.log("Products in Home:", safeProducts);

  return (
    <div className="px-6 pb-6 md:px-10 w-full flex flex-col items-center gap-12 ">
      <Hero></Hero>

      <HomeSection
        title={t("popular_title")}
        subtitle={t("popular_subtitle")}
        viewAllLink={"/products"}>
        <GridContainer cols={4} gap={5}>
          {safeProducts.slice(0, 4).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </GridContainer>
      </HomeSection>

      <HomeSection
        title={t("categories_title")}
        subtitle={t("categories_subtitle")}
        swipable
        >
        {categories.map((cat) => (
          <SwiperSlide key={cat.name}>
            <CategoryCard key={cat.name} cat={cat} />
          </SwiperSlide>
        ))}
      </HomeSection>

      <HomeSection
        title={t("products_title")}
        subtitle={t("products_subtitle")}
        viewAllLink={"/products"}>
        <GridContainer cols={4} gap={5}>
          {safeProducts.slice(0, 12).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </GridContainer>
      </HomeSection>
    </div>
  );
};

export default Home;
