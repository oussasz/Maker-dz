// src/pages/seller/UpdateProduct.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import ProductAttributes from "../../components/sellerDashboard/ProductAttributesEnhanced";
import ProductForm from "../../components/sellerDashboard/ProductFormEnhanced";
import VariantOptions from "../../components/sellerDashboard/VariantOptions";
import VariantsTable from "../../components/sellerDashboard/VariantsTable";
import LoadingSpinner from "../../components/ui/loading-spinner";
import { useTranslation } from "react-i18next";
import { useProductSubmission } from "../../hooks/useProductSubmission";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";

const initialProductState = {
  name: "",
  description: "",
  basePrice: "",
  images: [],
};

const initialProductAttributes = {
  specifications: new Map(),
  tags: [],
  categories: [],
};

export default function UpdateProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { updateProduct, getProductDetails } = useProductSubmission();
  const { t } = useTranslation("seller_updateproduct");

  const [productData, setProductData] = useState(initialProductState);
  const [productAttributes, setProductAttributes] = useState(
    initialProductAttributes,
  );
  const [variantOptions, setVariantOptions] = useState({});
  const [variantVariables, setVariantVariables] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("1");

  const next = () => setStep((prev) => `${Number(prev) + 1}`);
  const back = () => setStep((prev) => `${Number(prev) - 1}`);

  const fetchProduct = async () => {
    setLoading(true);
    const { success, product } = await getProductDetails(productId);
    if (success) {
      setProductData({
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,

        images: product.mainImages || [],
      });

      setProductAttributes({
        categories: product.categories.map((cat) => cat._id),
        tags: product.tags,
        specifications: new Map(Object.entries(product.specifications || {})),
      });

      setVariantOptions(product.variantOptions);
      setVariants(product.variants);
      setVariantVariables(product.variantVariables);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating product...");

    try {
      const result = await updateProduct(
        productId,
        productData,
        variantOptions,
        variantVariables,
        variants,
        productAttributes,
      );

      if (result.success) {
        toast.success("Product updated successfully!", { id: toastId });
        console.log("Product updated successfully:", result.data);
      } else {
        toast.error("Failed to add product", { id: toastId });
        console.error("Failed to add product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product", {
        id: toastId,
      });
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t("loading_product_details")} />;
  }

  return (
    <div className="space-y-8 w-full bg-gradient-to-br from-gray-50 to-gray-100 p-2 lg:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          {t("update_product")}
        </h1>
      </div>

      <Tabs value={step} onValueChange={setStep} className="space-y-8">
        {/* Step Indicators */}
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="1">{`1.  ${t("basic_info")}`}</TabsTrigger>
          <TabsTrigger value="2">{`2.  ${t("specifications")}`}</TabsTrigger>
          <TabsTrigger value="3">{`3.  ${t("variants")}`}</TabsTrigger>
        </TabsList>

        {/* STEP 1 — Product Form */}
        <TabsContent value="1" className="space-y-8">
          <ProductForm data={productData} setData={setProductData} />
          <div className="flex justify-end">
            <Button onClick={next}>{t("next")}</Button>
          </div>
        </TabsContent>

        {/* STEP 2 — Specifications */}
        <TabsContent value="2" className="space-y-8">
          <ProductAttributes
            data={productAttributes}
            setData={setProductAttributes}
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={back}>
              {t("back")}
            </Button>
            <Button onClick={next}>{t("next")}</Button>
          </div>
        </TabsContent>

        {/* STEP 3 — Variants */}
        <TabsContent value="3" className="space-y-8">
          <VariantOptions
            variantOptions={variantOptions}
            setVariantOptions={setVariantOptions}
            setVariants={setVariants}
            variantVariables={variantVariables}
            setVariantVariables={setVariantVariables}
          />

          {variants.length > 0 && (
            <VariantsTable
              variants={variants}
              setVariants={setVariants}
              variantVariables={variantVariables}
            />
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={back}>
              {t("previous")}
            </Button>
            <Button
              className="w-40"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("updating_product") : t("save_product")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
