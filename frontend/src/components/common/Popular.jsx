import HomeSection from "../sections/HomeSection";
import ProductCard from "../product/ProductCard";
import { GridContainer } from "../ui";

const Popular = ({ products, title, subtitle }) => {
  return (
    <>
      <div className="w-full">
        <HomeSection
          title={title}
          subtitle={subtitle}
          viewAllLink={"/products"}
          rtl={isRTL}>
          <GridContainer cols={4} gap={5}>
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </GridContainer>
        </HomeSection>
      </div>
    </>
  );
};

export default Popular;
